// Step 2 of the build: validate the fetched rows against copy/field-manifest.json and write the
// generated artifact (.copy/approved-copy.generated.json) that the site renders from.
import { existsSync, readFileSync, unlinkSync } from 'node:fs';
import { PATHS, fail, formatReport, loadManifest, loadRules, validateGrid, writeJson } from './lib.mjs';
import { checkCodeReferences } from './code-references.mjs';

if (!existsSync(PATHS.rows))
  fail('copy:validate FAILED. .copy/sheet-rows.json is missing. Run "npm run copy:sync" first.');
if (existsSync(PATHS.artifact)) unlinkSync(PATHS.artifact);

const fetched = JSON.parse(readFileSync(PATHS.rows, 'utf8'));
const manifest = loadManifest();
const { errors, fields } = validateGrid(fetched.grid, manifest, loadRules());

// The manifest must also match the code: every field used in src/ is in the manifest, and every
// manifest field appears in its code location.
errors.push(...checkCodeReferences(manifest));

if (errors.length)
  fail(
    formatReport(errors) +
      '\nNo artifact was written, so the build stops here. See docs/APPROVED_COPY_GATE.md ("A failed copy check").',
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
