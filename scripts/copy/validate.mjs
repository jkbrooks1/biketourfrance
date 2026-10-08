// Step 2 of the production check: validate the fetched rows against copy/field-manifest.json and write the
// generated artifact (.copy/approved-copy.generated.json) that the rendered-page check compares the site to.
import { existsSync, readFileSync, unlinkSync } from 'node:fs';
import { PATHS, fail, formatReport, loadManifest, loadRules, validateGrid, writeJson } from './lib.mjs';
import { checkManifestLocations } from './code-references.mjs';

if (!existsSync(PATHS.rows))
  fail('copy:validate FAILED. .copy/sheet-rows.json is missing. Run "npm run copy:sync" first.');
if (existsSync(PATHS.artifact)) unlinkSync(PATHS.artifact);

const fetched = JSON.parse(readFileSync(PATHS.rows, 'utf8'));
const manifest = loadManifest();
const { errors, fields, warnings } = validateGrid(fetched.grid, manifest, loadRules());
for (const w of warnings) console.warn(`copy:validate  WARNING: ${w.field}: ${w.issue}`);

// Every manifest code location must be a real file.
errors.push(...checkManifestLocations(manifest));

if (errors.length)
  fail(
    formatReport(errors) +
      '\nNo artifact was written, so the check stops here. See docs/APPROVED_COPY_GATE.md ("A failed copy check").',
  );

writeJson(PATHS.artifact, {
  source: fetched.source,
  sheetTitle: fetched.title,
  tab: fetched.tab,
  fetchedAt: fetched.fetchedAt,
  validatedAt: new Date().toISOString(),
  fieldCount: Object.keys(fields).length,
  fields,
});
const banner = fetched.source === 'fixture' ? '  (FIXTURE copy: not deployable)' : '';
console.log(`copy:validate  OK: ${Object.keys(fields).length} fields from ${fetched.source}${banner}`);
