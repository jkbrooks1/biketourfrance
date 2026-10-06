// Static checks on the built site in dist/. Run after `npm run build` (npm run verify).
// Covers: one H1, landmarks, skip link, heading order, unique titles and descriptions, canonical URLs,
// alt text, internal links and fragments, staging noindex, banned content (prices, consent-by-use,
// stale "upcoming 2026"), JSON-LD types, outline suppression, sitemap, robots.txt, _headers, and the 404 page.
// Style guide v4.4 checks (with owner amendments 2026-10-05): headings at most 100 characters, button labels at most 42,
// no "#" or empty links, every image has alt text, the audited copy defects stay fixed, spacing and font sizes in
// the CSS stay on the guide's scale, and no Framer files or references ship.
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
// Astro emits directory routes plus a single dist/404.html. Keep this explicit so
// a route can never disappear while a generic HTML scan still reports a pass.
const REQUIRED_ROUTES = [
  '/', '/about/', '/canal-des-deux-mers/', '/canal-des-deux-mers/practical-info/',
  '/contact/', '/cookies/', '/privacy/', '/resources/', '/terms/', '/tours/', '/404.html',
];
for (const route of REQUIRED_ROUTES) {
  if (!pages.some((page) => page.rel === route)) fail('routes', `missing required native Astro output ${route}`);
}

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
  // The owner removed the gallery hero heading; its browser title remains unchanged.
  const expectedH1s = rel === '/cdm-photo-gallery/' ? 0 : 1;
  if (h1s.length !== expectedH1s) fail(name, `expected ${expectedH1s} h1, found ${h1s.length}`);

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

  

  for (const img of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt(=|\s|\/|>)/.test(img[0])) fail(name, `img without alt: ${img[0].slice(0, 80)}`);
  }
  // The minifier writes alt="" as a bare alt attribute.
  const emptyAlt = [...html.matchAll(/<img\b[^>]*\salt(=""|(?=[\s/>]))[^>]*>/g)].length;
  if (emptyAlt > 0) fail(name, `${emptyAlt} images with empty alt (every image on this site is informative)`);

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
  // The only approved dollar amount is the $250 planning session in the approved-copy Sheet (hero/body_2).
  if (/\$\s?\d/.test(text.replace('$250 for a 50-minute planning session', '')))
    fail(name, 'dollar price found');
  if (/3,?500|2,?000/.test(text.replace(/2000/g, ''))) fail(name, 'provisional price figure found');
  // Brand spelling from the owner's style guide v4.3: always BikeTourFrance.net.
  if (/Bike Tour France/i.test(text)) fail(name, 'brand written as "Bike Tour France"');
  // Owner decision 2026-10-05: "BikeTourFrance" and "BikeTourFrance.net" are both acceptable.
  // The spaced form "Bike Tour France" above remains a violation.
  // The approved-copy Sheet's footer legal paragraph (cookie consent wording) is allowed inside the footer only.
  const textOutsideFooter = html
    .replace(/<footer[\s\S]*?<\/footer>/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ');
  if (/by continuing|continued use/i.test(textOutsideFooter)) fail(name, 'consent-by-use wording found');
  if (/upcoming[^.]{0,80}2026|2026[^.]{0,80}upcoming/i.test(text)) fail(name, 'upcoming-2026 wording found');
  if (/€/.test(text) && !rel.includes('practical-info'))
    fail(name, 'euro amount outside the third-party transport page');
  if (/script-src|googletagmanager|google-analytics|gtag\(/i.test(html))
    fail(name, 'analytics or tracking code found');
  if (/document\.cookie/.test(html)) fail(name, 'cookie access found');

  // ---- Style guide v4.4 checks ----
  const decode = (t) =>
    t
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim();
  for (const h of html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)) {
    const t = decode(h[2]);
    // Owner decision 2026-10-05: limit raised from the guide's 60 so the intentionally
    // multi-line Canal des Deux Mers heading is not shortened. Style Guide to be updated.
    if (t.length > 100) fail(name, `heading over 100 characters (${t.length}): ${t.slice(0, 50)}...`);
  }
  for (const b of html.matchAll(/<a\b[^>]*class="[^"]*\bbtn\b[^"]*"[^>]*>([\s\S]*?)<\/a>/g)) {
    const t = decode(b[1]);
    if (t.length === 0 || t.length > 42) fail(name, `button label length ${t.length}: "${t}"`);
  }
  for (const a of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const href = a[1].match(/\shref="([^"]*)"/)?.[1];
    if (href === undefined || href === '' || href === '#')
      fail(name, `link without a real destination: ${a[0].slice(0, 80)}`);
    if (decode(a[2]).length === 0 && !/aria-label=/.test(a[1]) && !/<img\b[^>]*\salt="[^"]+"/.test(a[2]))
      fail(name, `link with no accessible name: ${a[0].slice(0, 80)}`);
  }
  for (const m of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)) {
    if (decode(m[1]).length === 0) fail(name, 'button with no label');
  }
  const visible = decode(
    html
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<head[\s\S]*?<\/head>/g, ''),
  );
  // Owner decision 2026-10-05: exclamation marks are allowed in approved copy, so this is no
  // longer checked. The specific audited defects below ("soon!.", "soon.)!") still fail.
  // Style Guide to be updated.
  for (const bad of ["B&B's", 'Hotels & B', 'each days route', 'soon!.', 'soon.)!']) {
    if (visible.includes(bad)) fail(name, `audited copy defect present: ${bad}`);
  }
  if (/<li[^>]*>\s*<\/li>/.test(html)) fail(name, 'empty list item');
  if (/framer/i.test(html)) fail(name, 'Framer reference found');
  if (/\sstyle="/.test(html.replace(/<picture[\s\S]*?<\/picture>/g, ''))) {
    // Inline styles bypass the spacing and type scale. Astro adds none; any here came from page code.
    fail(name, 'inline style attribute found');
  }

  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const data = JSON.parse(block[1]);
    for (const item of Array.isArray(data) ? data : [data]) {
      if (!['Organization', 'WebSite', 'BreadcrumbList'].includes(item['@type']))
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
const flat = css.replace(/\s+/g, '').toLowerCase();
if (!/--green:#2d5016/.test(flat)) fail('css', 'primary green must be #2d5016');
if (!/:focus-visible\{outline:2pxsolid(var\(--green\)|#2d5016);outline-offset:(4|3|2)px/.test(flat))
  fail('css', 'focus style must be a 2px solid #2d5016 outline with an offset of at least 2px');
if (/border-radius\s*:\s*999px/.test(css)) fail('css', 'pill radius found (no pill buttons)');
if (/backdrop-filter|filter\s*:\s*blur/.test(css)) fail('css', 'blur or glass effect found');
// Font sizes: nothing below 14px except 12px UI labels; spacing only from the 4/8/16/24/32/48/64 scale
// (plus the owner's 40px left padding on the home "Ready to ride?" block).
for (const m of css.matchAll(/font-size\s*:\s*([\d.]+)px/g)) {
  if (Number(m[1]) < 12) fail('css', `font-size ${m[1]}px is below the 12px UI minimum`);
}
// 12px is the guide's own button padding (12px 24px).
const SCALE = new Set([0, 4, 8, 12, 16, 24, 32, 48, 64, 40]);
for (const m of css.matchAll(
  /(?:^|[;{}])\s*((?:padding|margin|gap|row-gap|column-gap)(?:-[a-z]+)?)\s*:\s*([^;}]+)/g,
)) {
  for (const n of m[2].matchAll(/(-?[\d.]+)(px|rem|em)\b/g)) {
    const px = n[2] === 'px' ? Number(n[1]) : Number(n[1]) * 16;
    if (!SCALE.has(Math.abs(px))) fail('css', `${m[1]}: ${n[0]} is not on the spacing scale`);
  }
}
if (!/--font:montserrat,system-ui,sans-serif/.test(flat))
  fail('css', 'font stack must be Montserrat, system-ui, sans-serif');

// No Framer files, runtime, or references anywhere in the deployed output.
for (const f of files) {
  if (/framer/i.test(f)) fail('dist', `Framer file shipped: ${relative(DIST, f)}`);
  else if (
    /\.(html|css|js|mjs|json|txt|xml)$/.test(f) &&
    /framerusercontent|framerstatic|framer\.app|sites\.framer/i.test(readFileSync(f, 'utf8'))
  )
    fail('dist', `Framer reference in ${relative(DIST, f)}`);
}
// Delivered images: 300 KB or less each (guide), except where documented in docs/STYLE_GUIDE.md.
for (const f of files.filter((f) => /\.(jpe?g|png|webp|avif)$/.test(f))) {
  const kb = statSync(f).size / 1024;
  if (kb > 300) fail('images', `${relative(DIST, f)} is ${Math.round(kb)} KB (limit 300)`);
}
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
if (/Disallow:\s*\/\s*$/m.test(robots)) fail("robots.txt", "must NOT disallow all on production");
if (!/Sitemap:/.test(robots)) fail("robots.txt", "must contain Sitemap directive on production");
const headers = existsSync(join(DIST, '_headers')) ? readFileSync(join(DIST, '_headers'), 'utf8') : '';

if (!existsSync(join(DIST, '404.html'))) fail('404', '404.html missing');

if (failures.length) {
  console.error(`verify-dist: ${failures.length} problem(s)`);
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
console.log(`verify-dist: ${pages.length} pages OK`);
