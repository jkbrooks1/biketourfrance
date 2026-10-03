// Step 4 of the build: after `astro build`, confirm the built pages match the validated approved copy.
//  1. Every required field appears on its expected route, in display order.
//  2. No visible text, image alt text, page title, or meta description on any page is missing from the
//     approved fields (public copy with no approved field fails the build).
//  3. The pages were built from this exact artifact (copy source and fingerprint in the page head).
// Usage: node scripts/copy/verify-rendered.mjs [--artifact path] [--dist path]
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';
import { PATHS, fail, loadManifest } from './lib.mjs';
import { fragmentTexts as blockTexts } from '../../src/lib/copy-markup.mjs';

const args = process.argv.slice(2);
const opt = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const artifactPath = opt('--artifact', PATHS.artifact);
const distPath = opt('--dist', PATHS.dist);
const FIXTURE_BANNER =
  'FIXTURE COPY. This is a local development build. The text on this page is not approved copy. Never deploy it.';

if (!existsSync(artifactPath))
  fail(
    'copy:verify-rendered FAILED. The approved copy artifact is missing. Run the copy sync and validation first.',
  );
if (!existsSync(distPath)) fail('copy:verify-rendered FAILED. dist/ is missing. Run the site build first.');
const artifact = JSON.parse(readFileSync(artifactPath, 'utf8'));
const manifest = loadManifest();
const problems = [];
const problem = (field, route, issue) => {
  const m = manifest.find((x) => x.field === field);
  problems.push(`  - ${field} | ${route} | ${m?.codeLocation ?? '(none)'} | ${issue}`);
};

// ----------------------------------------------------------------------------- reading pages
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
const ws = (s) => s.replace(/\s+/g, ' ').trim();
const INLINE = /<\/?(?:a|strong|em|b|i|span|small|picture|source)\b[^>]*>/gi;

function pageText(html) {
  let body = html.slice(html.indexOf('<body'));
  body = body.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  return ws(decode(body.replace(INLINE, '').replace(/<[^>]+>/g, ' ')));
}

const pages = new Map(); // route -> {html, text}
for (const file of walk(distPath).filter((f) => f.endsWith('.html'))) {
  const rel = relative(distPath, file);
  const route = rel.endsWith('index.html') ? '/' + rel.slice(0, -'index.html'.length) : '/' + rel;
  const html = readFileSync(file, 'utf8');
  pages.set(route, { html, text: pageText(html) });
}

// ----------------------------------------------------------------------------- built from this artifact
const copyId = createHash('sha256').update(JSON.stringify(artifact.fields)).digest('hex').slice(0, 16);
for (const [route, page] of pages) {
  const source = page.html.match(/<meta name="btf-copy-source" content="([^"]*)"/)?.[1];
  const id = page.html.match(/<meta name="btf-copy-id" content="([^"]*)"/)?.[1];
  if (source !== artifact.source)
    problem(
      '(page head)',
      route,
      `built from copy source "${source}", but the artifact source is "${artifact.source}"`,
    );
  if (id !== copyId)
    problem(
      '(page head)',
      route,
      'page was not built from this approved copy artifact (copy fingerprint differs)',
    );
}

// ----------------------------------------------------------------------------- expected strings
const attr = (html, regex) => {
  const m = html.match(regex);
  return m ? ws(decode(m[1])) : undefined;
};
const brand = ws(artifact.fields['site/brand_name'] ?? '');
const altSet = new Set();
const allBlocks = []; // every approved text fragment, for the "no uncovered text" check

for (const m of manifest) {
  const value = artifact.fields[m.field];
  if (value === undefined || value === '') {
    if (m.required) problem(m.field, m.route, 'required field is missing from the approved copy artifact');
    continue;
  }
  const blocks = blockTexts(value).map(ws);
  allBlocks.push(...blocks);
  if (m.field.endsWith('_alt')) altSet.add(ws(blocks.join(' ')));
}
if (artifact.source === 'fixture') allBlocks.push(FIXTURE_BANNER);

// ----------------------------------------------------------------------------- per-route checks
const routeFields = (route) => manifest.filter((m) => m.route === route || m.route === '*');
for (const [route, page] of pages) {
  const fields = routeFields(route);
  let cursor = 0;
  for (const m of fields) {
    const value = artifact.fields[m.field];
    if (value === undefined || value === '') continue; // absence already reported above when required
    const blocks = blockTexts(value).map(ws);
    const kind = m.field.endsWith('/seo_title')
      ? 'title'
      : m.field.endsWith('/seo_description')
        ? 'description'
        : m.field.endsWith('_alt')
          ? 'alt'
          : 'text';

    if (kind === 'title') {
      const expected = route === '/' ? blocks.join(' ') : `${blocks.join(' ')} | ${brand}`;
      const actual = attr(page.html, /<title>([\s\S]*?)<\/title>/);
      if (actual !== expected) problem(m.field, route, `page title is "${actual}", expected "${expected}"`);
    } else if (kind === 'description') {
      const actual = attr(page.html, /<meta name="description" content="([^"]*)"/);
      if (actual !== blocks.join(' '))
        problem(m.field, route, 'meta description does not match the approved copy');
    } else if (kind === 'alt') {
      const alts = [...page.html.matchAll(/<img\b[^>]*\salt="([^"]*)"/g)].map((x) => ws(decode(x[1])));
      if (!alts.includes(blocks.join(' ')))
        problem(m.field, route, 'image alt text with the approved wording is not on the page');
    } else {
      for (const block of m.required ? blocks : []) {
        if (!page.text.includes(block))
          problem(m.field, route, `approved text not found on the page: "${block.slice(0, 60)}"`);
      }
      // Display order: fields owned by this page must appear in manifest order (shared site/ and photos/ fields are exempt).
      if (
        m.route === route &&
        !m.field.startsWith('site/') &&
        !m.field.startsWith('photos/') &&
        blocks.length
      ) {
        const at = page.text.indexOf(blocks[0], cursor);
        if (at === -1) {
          if (page.text.includes(blocks[0])) problem(m.field, route, 'appears out of display order');
        } else cursor = at + blocks[0].length;
      }
    }
  }
  // Fields that belong to another route must still not be required here; nothing to check.

  // Public copy with no approved field: remove every approved fragment (longest first); nothing may remain.
  let rest = ` ${page.text} `;
  for (const block of [...new Set(allBlocks)].sort((a, b) => b.length - a.length))
    rest = rest.split(block).join(' ');
  rest = ws(rest);
  if (rest)
    problem('(uncovered text)', route, `visible text with no approved field: "${rest.slice(0, 120)}"`);

  for (const alt of [...page.html.matchAll(/<img\b[^>]*\salt(?:="([^"]*)")?/g)].map((x) =>
    ws(decode(x[1] ?? '')),
  )) {
    if (alt !== '' && !altSet.has(alt))
      problem('(uncovered alt text)', route, `image alt text with no approved field: "${alt.slice(0, 80)}"`);
  }
}

if (problems.length) {
  fail(
    `copy:verify-rendered FAILED: ${problems.length} problem${problems.length === 1 ? '' : 's'}\n  field | route | code location | issue\n${problems.slice(0, 60).join('\n')}${problems.length > 60 ? `\n  ... and ${problems.length - 60} more` : ''}`,
  );
}
console.log(
  `copy:verify-rendered  OK: ${pages.size} pages, ${manifest.filter((m) => artifact.fields[m.field]).length} fields confirmed on their routes (source: ${artifact.source})`,
);
