import { readFileSync, writeFileSync } from 'node:fs';
import { resolveMode, validateGrid, loadRules, HEADERS as COPY_HEADERS } from '../copy/lib.mjs';
import { makeReview, reviewManifest, selectLibrary } from './review-lib.mjs';
import { readReviewSheet } from './read-sheet.mjs';

try {
  const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
  const mode = resolveMode().mode;
  const input = mode === 'fixture' ? { collections: read('copy/gallery-review.fixture.json').collections, approved: [COPY_HEADERS, ...read('copy/fixture/fixture-rows.json')] } : await readReviewSheet();
  const library = read('src/data/cdm-gallery-manifest.json').photos;
  const photos = selectLibrary(library, read('src/data/cdm-gallery-selection.json'));
  const registry = read('src/data/cdm-photo-id-registry.json');
  const result = makeReview({ photos, collections: input.collections, registry, approvedFields: new Map(input.approved.slice(1)) });
  const manifest = reviewManifest(read('copy/field-manifest.json'), library, result.snapshot);
  const { errors, warnings } = validateGrid(input.approved, manifest, loadRules());
  for (const w of warnings) console.warn(`gallery:sync  WARNING: ${w.field}: ${w.issue}`);
  if (errors.length) throw new Error(`Approved copy failed validation before saving photo review: ${errors.map((e) => e.field + ': ' + e.issue).join('; ')}`);
  const save = (path, value) => writeFileSync(path, JSON.stringify(value, null, 2) + '\n');
  save('src/data/cdm-gallery-review.json', result.snapshot);
  save('src/data/cdm-photo-id-registry.json', result.registry);
  save('copy/field-manifest.json', manifest);
  if (mode === 'sheet') {
    save('copy/gallery-review.fixture.json', { schemaVersion: 1, collections: input.collections });
    save('copy/fixture/fixture-rows.json', input.approved.slice(1).filter(([key]) => key).map(([key, value]) => [key, String(value ?? '')]));
  }
  console.log(`gallery:sync PASS (${mode}): ${result.snapshot.photos.filter((p) => p.keep && !p.deleted).length}/${photos.length} shown; ${result.snapshot.photos.filter((p) => p.deleted).length} marked Delete?=Y; captions never control inclusion; ${result.registry.photos.length} permanent IDs retained`);
} catch (error) {
  console.error('gallery:sync FAILED: ' + error.message);
  process.exit(1);
}
