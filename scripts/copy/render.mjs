// Offline build step: render the committed snapshot into the Framer export.
//
// Reads copy/approved-copy.snapshot.json and copy/field-map.json, patches the page HTML
// and the page JavaScript modules (Framer re-renders text from those modules after load,
// so both must change), and writes the result to .generated/site/. Astro serves that
// folder. No network access. Fails loudly on any mismatch instead of skipping a row.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import {
  FIELD_MAP_PATH,
  GENERATED_DIR,
  GENERATED_SITE_DIR,
  NOT_FOUND_KEYS,
  SITE_DIR,
  SNAPSHOT_PATH,
  assignParts,
  escapeFor,
  joinParts,
  loadJson,
  rowsToMap,
  validateSnapshot,
} from './lib.mjs';

const snapshot = validateSnapshot(loadJson(SNAPSHOT_PATH));
const map = loadJson(FIELD_MAP_PATH);
const values = rowsToMap(snapshot);

// Every Sheet row must have a home, and every mapped field must have a row.
const mapped = new Set(Object.keys(map.fields));
const unmapped = [...values.keys()].filter((k) => !mapped.has(k) && !NOT_FOUND_KEYS.includes(k));
const missing = [...mapped, ...NOT_FOUND_KEYS].filter((k) => !values.has(k));
if (unmapped.length || missing.length) {
  throw new Error(
    `Sheet rows and field map disagree.\n  Rows with no place on the site: ${JSON.stringify(unmapped)}\n  Mapped fields with no Sheet row: ${JSON.stringify(missing)}`,
  );
}

const original = new Map();
const readOriginal = (file) => {
  if (!original.has(file)) original.set(file, readFileSync(resolve(SITE_DIR, file), 'utf8'));
  return original.get(file);
};

const edits = new Map(); // file -> [{start, end, text}]
let changedFields = 0;
let sites = 0;
for (const [key, field] of Object.entries(map.fields)) {
  const value = values.get(key);
  const baselineValue = joinParts(field.parts);
  if (value !== baselineValue) changedFields += 1;
  let assigned;
  if (field.parts.length === 1) {
    if (value.includes('\n')) throw new Error(`${key}: line breaks are not supported in this field.`);
    assigned = new Map([[0, value.trim()]]);
  } else {
    assigned = assignParts(key, field.parts, value);
  }
  for (const t of field.targets) {
    const text = readOriginal(t.file);
    const core = field.parts[t.part].baseline.trim();
    const needle = t.left + escapeFor(t.esc, core) + t.right;
    const hits = [];
    for (let i = text.indexOf(needle); i >= 0; i = text.indexOf(needle, i + 1)) hits.push(i + t.left.length);
    if (hits.length !== t.total) {
      throw new Error(`${key}: expected ${t.total} matches in ${t.file}, found ${hits.length}. The site files changed; regenerate the field map.`);
    }
    const replacement = escapeFor(t.esc, assigned.get(t.part));
    for (const n of t.nth) {
      const start = hits[n];
      if (!edits.has(t.file)) edits.set(t.file, []);
      edits.get(t.file).push({ start, end: start + escapeFor(t.esc, core).length, text: replacement, key });
      sites += 1;
    }
  }
}

rmSync(GENERATED_DIR, { recursive: true, force: true });
mkdirSync(GENERATED_DIR, { recursive: true });
cpSync(SITE_DIR, GENERATED_SITE_DIR, { recursive: true });

let filesChanged = 0;
for (const [file, list] of edits) {
  list.sort((a, b) => a.start - b.start);
  for (let i = 1; i < list.length; i += 1) {
    if (list[i].start < list[i - 1].end) throw new Error(`Overlapping edits in ${file}: ${list[i - 1].key} and ${list[i].key}`);
  }
  let out = readOriginal(file);
  for (const e of [...list].reverse()) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  if (out !== readOriginal(file)) filesChanged += 1;
  const dest = resolve(GENERATED_SITE_DIR, file);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, out);
}

const report = {
  snapshotSha256: snapshot.contentSha256,
  sheetId: snapshot.sheetId,
  tab: snapshot.tab,
  fetchedAt: snapshot.fetchedAt,
  rowCount: snapshot.rowCount,
  fieldsRendered: Object.keys(map.fields).length,
  replacementSites: sites,
  fieldsDifferingFromExport: changedFields,
  filesPatchedWithChanges: filesChanged,
};
writeFileSync(resolve(GENERATED_DIR, 'render-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(
  `copy:render ok. Snapshot ${snapshot.contentSha256.slice(0, 12)} (${snapshot.rowCount} rows, fetched ${snapshot.fetchedAt}); ` +
    `${Object.keys(map.fields).length} fields, ${sites} sites; ${changedFields} fields differ from the committed export; ${filesChanged} files changed.`,
);
