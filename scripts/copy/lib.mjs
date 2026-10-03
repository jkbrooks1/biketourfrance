// Shared helpers for the approved-copy snapshot, field map, renderer, and checks.
// Node built-ins only. No network access here.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
// Test-only overrides: BTF_COPY_SNAPSHOT and BTF_COPY_GENERATED_DIR let a test render a
// different snapshot into a scratch folder without touching the committed files.
export const SNAPSHOT_PATH = process.env.BTF_COPY_SNAPSHOT ?? resolve(ROOT, 'copy', 'approved-copy.snapshot.json');
export const FIELD_MAP_PATH = resolve(ROOT, 'copy', 'field-map.json');
export const SITE_DIR = resolve(ROOT, 'site');
export const GENERATED_DIR = process.env.BTF_COPY_GENERATED_DIR ?? resolve(ROOT, '.generated');
export const GENERATED_SITE_DIR = resolve(GENERATED_DIR, 'site');

export const SHEET_ID = '1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw';
export const SHEET_TAB = 'Approved Site Copy';
export const SHEET_HEADER = ['page/field_name', 'copy'];
export const KEY_PATTERN = /^\/[a-z0-9_\-/]+$/;

// Rows for the Astro 404 page (src/pages/404.astro). They are not in the field map.
export const NOT_FOUND_KEYS = [
  '/404/meta_title',
  '/404/header_logo_text',
  '/404/heading',
  '/404/body',
  '/404/home_cta',
  '/404/resources_cta',
  '/404/footer_note',
];

// Hash over the rows only, so the hash does not change with the fetch time.
export function contentHash(rows) {
  const canonical = JSON.stringify(rows.map((r) => [r.key, r.copy]));
  return createHash('sha256').update(canonical, 'utf8').digest('hex');
}

export function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
export function escAttr(s) {
  return escHtml(s).replace(/"/g, '&quot;');
}
// Escape for a JavaScript template literal.
export function escJs(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

// How a value must be escaped for each kind of target.
export function escapeFor(esc, s) {
  switch (esc) {
    case 'html':
      return escHtml(s);
    case 'attr':
      return escAttr(s);
    case 'js':
      return escJs(s);
    case 'htmljs':
      return escJs(escHtml(s));
    default:
      throw new Error(`Unknown escape kind: ${esc}`);
  }
}

export function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

// Validate a snapshot object. Throws with a clear message on any problem.
export function validateSnapshot(snap) {
  if (snap.schema !== 1) throw new Error('Snapshot schema must be 1.');
  if (snap.sheetId !== SHEET_ID) throw new Error('Snapshot sheetId does not match the approved Sheet.');
  if (snap.tab !== SHEET_TAB) throw new Error('Snapshot tab does not match the approved tab.');
  if (!Array.isArray(snap.rows) || snap.rows.length === 0) throw new Error('Snapshot has no rows.');
  const seen = new Set();
  for (const r of snap.rows) {
    if (!KEY_PATTERN.test(r.key)) throw new Error(`Bad row key: ${JSON.stringify(r.key)}`);
    if (typeof r.copy !== 'string' || r.copy.trim() === '') throw new Error(`Empty copy for ${r.key}`);
    if (seen.has(r.key)) throw new Error(`Duplicate row key: ${r.key}`);
    seen.add(r.key);
  }
  if (snap.rowCount !== snap.rows.length) throw new Error('Snapshot rowCount does not match rows.');
  if (snap.contentSha256 !== contentHash(snap.rows)) throw new Error('Snapshot content hash does not match its rows.');
  return snap;
}

export function rowsToMap(snap) {
  return new Map(snap.rows.map((r) => [r.key, r.copy]));
}

// Join field parts into the cell text a person sees: <br> becomes a newline,
// runs of spaces collapse, and spaces around newlines are dropped.
export function joinParts(parts) {
  const raw = parts.map((p) => (p.br ? '\n' : p.baseline)).join('');
  return raw
    .replace(/[ \t\r\f\v]+/g, ' ')
    .replace(/ ?\n ?/g, '\n')
    .trim();
}

// Split a new cell value across a field's parts. Fixed parts (bold labels and
// line breaks) stay as anchors and must appear in the new value in order.
// Returns the new text for each editable part, keyed by part index.
export function assignParts(key, parts, value) {
  const out = new Map();
  let pos = 0;
  const anchorOf = (p) => (p.br ? '\n' : p.baseline.trim());
  for (let i = 0; i < parts.length; i += 1) {
    const p = parts[i];
    if (p.fixed || p.br) {
      const a = anchorOf(p);
      const idx = value.indexOf(a, pos);
      if (idx < 0) throw new Error(`${key}: expected fixed text ${JSON.stringify(a)} was not found in the Sheet value, in order.`);
      if (value.slice(pos, idx).trim() !== '') {
        throw new Error(`${key}: unexpected text before fixed text ${JSON.stringify(a)}.`);
      }
      pos = idx + a.length;
    } else {
      let next = i + 1;
      while (next < parts.length && !(parts[next].fixed || parts[next].br)) next += 1;
      let end = value.length;
      if (next < parts.length) {
        end = value.indexOf(anchorOf(parts[next]), pos);
        if (end < 0) throw new Error(`${key}: expected fixed text ${JSON.stringify(anchorOf(parts[next]))} was not found after part ${i}.`);
      }
      const text = value.slice(pos, end).trim();
      if (text === '') throw new Error(`${key}: part ${i} is empty in the Sheet value.`);
      out.set(i, text);
      pos = end;
    }
  }
  if (value.slice(pos).trim() !== '') throw new Error(`${key}: extra text after the last part.`);
  return out;
}
