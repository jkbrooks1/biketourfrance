// Static checks on the built site in dist/. Run after `npm run build` (npm run verify).
// Covers: one H1, landmarks, skip link, heading order, unique titles and descriptions, canonical URLs,
// alt text, internal links and fragments, staging noindex, banned content (prices, consent-by-use,
// stale "upcoming 2026"), JSON-LD types, outline suppression, sitemap, robots.txt, _headers, and the 404 page.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const ORIGIN = 'https://biketourfrance.net';
const failures = [];
const fail = (page, msg) => failures.push(`${page}: ${msg}`);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const pages = htmlFiles.map((file) => {
  const rel = '/' + relative(DIST, file).replace(/index\.html$/, '');
  return { file, rel, html: readFileSync(file, 'utf8') };
});

const titles = new Map();
const descriptions = new Map();
const idsByPath = new Map();

for (const { rel, html } of pages) {
  idsByPath.set(rel, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

const pathExists = (p) => {
  const clean = p.split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') return true;
  const candidates = [
    join(DIST, clean),
    join(DIST, clean, 'index.html'),
    join(DIST, clean.replace(/\/$/, '') + '.html'),
  ];
  return candidates.some((c) => existsSync(c) && (statSync(c).isFile() || existsSync(join(c, 'index.html'))));
};

for (const { rel, html } of pages) {
  const name = rel === '/404.html' ? '/404' : rel;
  const is404 = rel === '/404.html';

  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (h1s.length !== 1) fail(name, `expected exactly one h1, found ${h1s.length}`);

  for (const tag of ['<header', '<nav', '<main', '<footer']) {
    if (!html.includes(tag)) fail(name, `missing ${tag} landmark`);
  }
  if ((html.match(/<main[\s>]/g) ?? []).length !== 1) fail(name, 'expected exactly one main landmark');
  if (!/<a class="skip-link"[^>]*href="#main"/.test(html)) fail(name, 'missing skip link');
  if (!html.includes('id="main"')) fail(name, 'skip link target #main missing');
  if (!/<html lang="en"/.test(html)) fail(name, 'missing html lang');

  // Heading order: no level may jump by more than one.
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  levels.forEach((lvl, i) => {
    if (i > 0 && lvl > levels[i - 1] + 1) fail(name, `heading jumps from h${levels[i - 1]} to h${lvl}`);
  });
  if (/<(a|button)[^>]*>\s*<h[1-6]/.test(html)) fail(name, 'heading used inside a link or button');

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!title) fail(name, 'missing title');
  if (!desc) fail(name, 'missing meta description');
  if (title) {
    if (titles.has(title)) fail(name, `duplicate title also on ${titles.get(title)}`);
    titles.set(title, name);
  }
  if (desc) {
    if (desc.length < 50 || desc.length > 200) fail(name, `description length ${desc.length} outside 50-200`);
    if (descriptions.has(desc)) fail(name, `duplicate description also on ${descriptions.get(desc)}`);
    descriptions.set(desc, name);
  }

  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  if (is404) {
    if (canonical) fail(name, '404 page must not have a canonical');
  } else if (canonical !== ORIGIN + rel) {
    fail(name, `canonical ${canonical} should be ${ORIGIN + rel}`);
  }

  if (!/<meta name="robots" content="noindex, nofollow, noarchive"/.test(html))
    fail(name, 'staging noindex meta missing');

  for (const img of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt(=|\s|\/|>)/.test(img[0])) fail(name, `img without alt: ${img[0].slice(0, 80)}`);
  }
  // The minifier writes alt="" as a bare alt attribute.
  const emptyAlt = [...html.matchAll(/<img\b[^>]*\salt(=""|(?=[\s/>]))[^>]*>/g)].length;
  if (emptyAlt > 2)
    fail(name, `${emptyAlt} images with empty alt (only the header and footer logos may be decorative)`);

  for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    const href = m[1];
    if (!href.startsWith('/')) continue;
    if (!pathExists(href)) fail(name, `broken internal link ${href}`);
    const [pathPart, frag] = href.split('#');
    if (frag) {
      const target = idsByPath.get(pathPart === '' ? rel : pathPart);
      if (!target?.has(frag)) fail(name, `fragment #${frag} missing on ${pathPart || rel}`);
    }
  }

  for (const m of html.matchAll(/<a\b[^>]*\shref="#([^"]+)"/g)) {
    if (!idsByPath.get(rel)?.has(m[1])) fail(name, `in-page link #${m[1]} has no target`);
  }

  // Banned public content.
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ');
  if (/\$\s?\d/.test(text)) fail(name, 'dollar price found');
  if (/3,?500|2,?000/.test(text.replace(/2000/g, ''))) fail(name, 'provisional price figure found');
  // Brand spelling from the owner's style guide v4.3: always BikeTourFrance.net.
  if (/Bike Tour France/i.test(text)) fail(name, 'brand written as "Bike Tour France"');
  if (/BikeTourFrance(?!\.net)/.test(text)) fail(name, 'brand written without .net');
  if (/by continuing|continued use/i.test(text)) fail(name, 'consent-by-use wording found');
  if (/upcoming[^.]{0,80}2026|2026[^.]{0,80}upcoming/i.test(text)) fail(name, 'upcoming-2026 wording found');
  if (/€/.test(text) && !rel.includes('practical-info'))
    fail(name, 'euro amount outside the third-party transport page');
  if (/script-src|googletagmanager|google-analytics|gtag\(/i.test(html))
    fail(name, 'analytics or tracking code found');
  if (/document\.cookie/.test(html)) fail(name, 'cookie access found');

  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const data = JSON.parse(block[1]);
    for (const item of Array.isArray(data) ? data : [data]) {
      if (!['Organization', 'WebSite'].includes(item['@type']))
        fail(name, `unexpected JSON-LD type ${item['@type']}`);
    }
  }
}

const css = files
  .filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n');
if (/text-transform\s*:\s*uppercase/.test(css))
  fail('css', 'all-caps text found (style guide: sentence case)');
if (/outline\s*:\s*(none|0)\b/.test(css)) fail('css', 'outline suppression found');
if (!/:focus-visible/.test(css)) fail('css', 'no :focus-visible styles');

if (!existsSync(join(DIST, 'sitemap-index.xml'))) fail('sitemap', 'sitemap-index.xml missing');
const sitemap = existsSync(join(DIST, 'sitemap-0.xml'))
  ? readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8')
  : '';
if (sitemap.includes('/404')) fail('sitemap', 'contains 404 page');
for (const p of pages.filter((p) => p.rel !== '/404.html')) {
  if (!sitemap.includes(`<loc>${ORIGIN}${p.rel}</loc>`)) fail('sitemap', `missing ${p.rel}`);
}

const robots = existsSync(join(DIST, 'robots.txt')) ? readFileSync(join(DIST, 'robots.txt'), 'utf8') : '';
if (!/Disallow:\s*\/\s*$/m.test(robots)) fail('robots.txt', 'must disallow all on staging');
const headers = existsSync(join(DIST, '_headers')) ? readFileSync(join(DIST, '_headers'), 'utf8') : '';
if (!/X-Robots-Tag:\s*noindex, nofollow, noarchive/.test(headers))
  fail('_headers', 'X-Robots-Tag noindex missing');
if (!existsSync(join(DIST, '404.html'))) fail('404', '404.html missing');

if (failures.length) {
  console.error(`verify-dist: ${failures.length} problem(s)`);
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
console.log(`verify-dist: ${pages.length} pages OK`);
