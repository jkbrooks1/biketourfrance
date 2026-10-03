// Static check of the built site (dist/) against the committed approved-copy snapshot.
//
//   npm run build && npm run copy:check
//
// 1. Every mapped field appears in dist at every recorded site, with the snapshot text.
// 2. The 404 page carries every /404/ row.
// 3. No visible text exists in the built HTML that is not backed by a Sheet row.
// Exit code 1 on any failure. No network access.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import {
  FIELD_MAP_PATH,
  NOT_FOUND_KEYS,
  ROOT,
  SNAPSHOT_PATH,
  assignParts,
  escHtml,
  escapeFor,
  loadJson,
  rowsToMap,
  validateSnapshot,
} from './lib.mjs';

const DIST = resolve(ROOT, 'dist');
const snapshot = validateSnapshot(loadJson(SNAPSHOT_PATH));
const map = loadJson(FIELD_MAP_PATH);
const values = rowsToMap(snapshot);
const failures = [];
const read = (f) => readFileSync(resolve(DIST, f), 'utf8');

// Which Sheet rows are visible, by page. Meta rows are counted separately.
const META = new Set(['/meta_title', '/meta_description', '/resources/meta_title', '/resources/meta_description']);
const visibleByPage = { '/': [], '/resources/': [], '/404/': [] };
const metaByPage = { '/': [], '/resources/': [], '/404/': [] };

const currentText = new Set(); // trimmed visible strings expected in HTML text nodes

for (const [key, field] of Object.entries(map.fields)) {
  const value = values.get(key);
  const assigned = field.parts.length === 1 ? new Map([[0, value.trim()]]) : assignParts(key, field.parts, value);
  for (const t of field.targets) {
    const text = read(t.file);
    const needle = t.left + escapeFor(t.esc, assigned.get(t.part)) + t.right;
    let n = 0;
    for (let i = text.indexOf(needle); i >= 0; i = text.indexOf(needle, i + 1)) n += 1;
    if (n < t.nth.length) failures.push(`${key}: found ${n} of ${t.nth.length} expected sites in dist/${t.file}`);
  }
  field.parts.forEach((p, i) => {
    if (p.br) return;
    currentText.add((assigned.get(i) ?? p.baseline).trim());
  });
  (META.has(key) ? metaByPage : visibleByPage)[field.page].push(key);
}

const notFound = read('404.html');
for (const key of NOT_FOUND_KEYS) {
  if (!notFound.includes(escHtml(values.get(key)))) failures.push(`${key}: not found in dist/404.html`);
  currentText.add(values.get(key).trim());
  (key === '/404/meta_title' ? metaByPage : visibleByPage)['/404/'].push(key);
}

// Visible text nodes with no Sheet row behind them.
const uncovered = [];
const htmlFiles = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = resolve(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) htmlFiles.push(p);
  }
};
walk(DIST);
const unescape = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
for (const file of htmlFiles) {
  let html = readFileSync(file, 'utf8');
  html = html.replace(/<head[\s\S]*?<\/head>/i, '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  for (const m of html.matchAll(/>([^<]+)</g)) {
    const t = unescape(m[1]).trim();
    if (!t || t === '$' || t === '/$') continue;
    if (!currentText.has(t)) uncovered.push(`${relative(DIST, file)}: ${JSON.stringify(t.slice(0, 70))}`);
  }
}
for (const u of uncovered) failures.push(`Visible text with no Sheet row: ${u}`);

const out = {
  snapshotSha256: snapshot.contentSha256,
  sheetId: snapshot.sheetId,
  tab: snapshot.tab,
  fetchedAt: snapshot.fetchedAt,
  rowCount: snapshot.rowCount,
  visibleRowsByPage: Object.fromEntries(Object.entries(visibleByPage).map(([k, v]) => [k, v.length])),
  metaRowsByPage: Object.fromEntries(Object.entries(metaByPage).map(([k, v]) => [k, v.length])),
  htmlPagesChecked: htmlFiles.map((f) => relative(DIST, f)),
  failures,
};
console.log(JSON.stringify(out, null, 2));
if (failures.length) {
  console.error(`copy:check FAILED (${failures.length})`);
  process.exit(1);
}
console.log('copy:check PASS');
