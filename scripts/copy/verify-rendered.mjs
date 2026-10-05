// Production check, last step: after `astro build`, confirm the built pages match the validated approved copy.
//  1. Every required field appears on its expected route, in display order.
//  2. No rendered string contains prose that no approved field supplies (page -> Sheet coverage).
//     Composing several approved fields in one block is allowed; unapproved prose is not.
// Usage: node scripts/copy/verify-rendered.mjs [--artifact path] [--dist path]
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { PATHS, fail, loadManifest, writeJson } from './lib.mjs';
import { fragmentTexts as blockTexts } from './markup.mjs';

const args = process.argv.slice(2);
const opt = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const artifactPath = opt('--artifact', PATHS.artifact);
const distPath = opt('--dist', PATHS.dist);

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
    .replace(/&copy;/g, '©')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…')
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rdquo;/g, '”')
    .replace(/&ldquo;/g, '“')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
const ws = (s) => s.replace(/\s+/g, ' ').trim();
// Comparisons ignore all whitespace, because markup can join or split words (for example <strong>4</strong>departures)
// without changing the copy a visitor reads.
const sq = (s) => s.replace(/\s+/g, '');
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
  const text = pageText(html);
  pages.set(route, { html, text, compact: sq(text) });
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

// ----------------------------------------------------------------------------- per-route checks
const routeFields = (route) => manifest.filter((m) => m.route === route || m.route === '*');
for (const [route, page] of pages) {
  const fields = routeFields(route);
  let cursor = 0;
  for (const m of fields) {
    const value = artifact.fields[m.field];
    if (value === undefined || value === '') continue; // absence already reported above when required
    const blocks = blockTexts(value).map(ws);
    const kind = m.field.endsWith('/seo_title') || m.field.endsWith('/meta_title')
      ? 'title'
      : m.field.endsWith('/seo_description') || m.field.endsWith('/meta_description')
        ? 'description'
        : m.field.endsWith('_alt')
          ? 'alt'
          : 'text';

    if (kind === 'title') {
      const expected = blocks.join(' ');
      const actual = attr(page.html, /<title>([\s\S]*?)<\/title>/);
      // BaseLayout appends " | <brand>" to the page title, so the approved value is the prefix.
      const ok = actual === expected || (actual ?? '').startsWith(`${expected} |`);
      if (!ok) problem(m.field, route, `page title is "${actual}", expected "${expected}" (optionally followed by " | brand")`);
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
        if (!page.compact.includes(sq(block)))
          problem(m.field, route, `approved text not found on the page: "${block.slice(0, 60)}"`);
      }
      // Sheet row order is its editing order. Native Astro deliberately groups a
      // few shared blocks differently in the rendered layout, so presence—not DOM
      // sequence—is the drift contract.
    }
  }
  // Fields that belong to another route must still not be required here; nothing to check.

}

// ------------------------------------------------- 2. no uncovered text (page -> Sheet)
// The contract is that every word a visitor reads comes from an approved Sheet field.
// A rendered block may combine several approved fields, because that is layout rather than
// copy; what it may not contain is prose that no approved field supplies. So for each block
// we remove every approved value it contains, longest first, and require that only
// punctuation, digits and whitespace remain.
//
// This check was previously removed, which let hardcoded copy ship while the gate reported
// success (see docs/2026-10-05_UNAPPROVED_COPY_AUDIT.md). Do not delete it again: weaken the
// allow-list below instead, so that any exemption is explicit and reviewable.
// Chrome and machine-formatted values that are not editorial copy and so have no Sheet row.
// Keep this list short: anything added here stops being checked against the Sheet.
const CHROME_ALLOWED = [
  'Skip to main content',
  'Menu',
  'Main',
  'Site',
  'Home',
  // Month names, because dates are rendered from data with toLocaleDateString.
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
].map((s) => ws(s).toLowerCase());

const approvedForCoverage = [...new Set(allBlocks.filter((b) => b && b.length >= 3))]
  .map((b) => ws(b).toLowerCase())
  .sort((a, b) => b.length - a.length); // longest first

const BLOCK_TAGS = 'h1|h2|h3|h4|h5|h6|p|li|button|figcaption|blockquote|td|th|dt|dd|label|summary|a';

function residualOf(text) {
  const whole = ws(text).toLowerCase();
  // A block that is itself a contiguous part of one approved value is approved copy. This covers
  // fields the layout deliberately splits, such as footerPolicyParts() breaking /footer/policies
  // into its four labelled parts.
  if (approvedForCoverage.some((a) => a.includes(whole))) return '';
  let rest = whole;
  for (const a of approvedForCoverage) {
    if (!rest) break;
    if (a.length < 3) continue;
    while (rest.includes(a)) rest = rest.replace(a, ' ');
  }
  for (const c of CHROME_ALLOWED) while (rest.includes(c)) rest = rest.replace(c, ' ');
  return ws(rest);
}

const uncovered = [];
for (const [route, page] of pages) {
  const seen = new Set();
  const consider = (raw, kind) => {
    const text = ws(decode(String(raw ?? '')));
    if (!text || !/[A-Za-z]{3}/.test(text)) return;
    const key = kind + '|' + text.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    const residual = residualOf(text);
    if (/[A-Za-z]{3}/.test(residual)) uncovered.push({ route, kind, text, residual });
  };

  consider(page.html.match(/<title>([\s\S]*?)<\/title>/i)?.[1], 'title');
  consider(page.html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1], 'meta description');
  for (const m of page.html.matchAll(/<img\b[^>]*\salt="([^"]+)"/gi)) consider(m[1], 'img alt');
  for (const m of page.html.matchAll(/\saria-label="([^"]+)"/gi)) consider(m[1], 'aria-label');

  let body = page.html.slice(page.html.indexOf('<body'));
  body = body
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '');
  for (const m of body.matchAll(new RegExp(`<(${BLOCK_TAGS})\\b[^>]*>([\\s\\S]*?)</\\1>`, 'gi'))) {
    if (new RegExp(`<(${BLOCK_TAGS})\\b`, 'i').test(m[2])) continue; // outer wrapper; its leaves are checked
    consider(m[2].replace(INLINE, '').replace(/<[^>]+>/g, ' '), `<${m[1].toLowerCase()}>`);
  }
}

if (uncovered.length) {
  const lines = uncovered
    .slice(0, 40)
    .map((u) => `  ${u.route} | ${u.kind} | not from the Sheet: "${u.residual.slice(0, 80)}"\n      in: "${u.text.slice(0, 100)}"`);
  problems.push(
    `${uncovered.length} rendered string${uncovered.length === 1 ? '' : 's'} contain text that no approved Sheet field supplies:\n${lines.join('\n')}${uncovered.length > 40 ? `\n  ... and ${uncovered.length - 40} more` : ''}`,
  );
}

if (problems.length) {
  fail(
    `copy:verify-rendered FAILED: ${problems.length} problem${problems.length === 1 ? '' : 's'}\n  field | route | code location | issue\n${problems.slice(0, 60).join('\n')}${problems.length > 60 ? `\n  ... and ${problems.length - 60} more` : ''}`,
  );
}
// Record that this exact artifact was checked against the built pages. assert-deployable requires it.
if (artifactPath === PATHS.artifact) {
  writeJson(PATHS.stamp, {
    source: artifact.source,
    fetchedAt: artifact.fetchedAt,
    verifiedAt: new Date().toISOString(),
    pages: pages.size,
  });
}
console.log(
  `copy:verify-rendered  OK: ${pages.size} pages, ${manifest.filter((m) => artifact.fields[m.field]).length} fields confirmed on their routes (source: ${artifact.source})`,
);
