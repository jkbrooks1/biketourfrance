import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { makeReview, selectLibrary, reviewManifest, captionField } from './review-lib.mjs';
const read = (file) => JSON.parse(readFileSync(file, 'utf8'));
const library = read('src/data/cdm-gallery-manifest.json').photos;
const base = () => {
  const input = { photos: selectLibrary(library, read('src/data/cdm-gallery-selection.json')), collections: read('copy/gallery-review.fixture.json').collections, registry: read('src/data/cdm-photo-id-registry.json'), approvedFields: new Map(read('copy/fixture/fixture-rows.json')) };
  for (const row of input.collections.combined.slice(1)) { row[0] = true; row[1] = ''; row[3] = ''; }
  for (const photo of input.photos) input.approvedFields.set(captionField(photo), '');
  return input;
};
const shown = (result) => result.snapshot.photos.filter((p) => p.keep && !p.deleted);
test('49 folder photos with blank captions; all 61 permanent IDs stay reserved', () => {
  const input = base(), result = makeReview(input);
  assert.equal(shown(result).length, 49);
  assert.equal(result.snapshot.photos.filter((p) => p.estimated).length, 9);
  assert.equal(new Set(result.snapshot.photos.map((p) => p.photoId.replace(/EST$/, ''))).size, 49);
  assert.ok(result.snapshot.photos.every((p) => /^\d{10}(?:EST)?$/.test(p.photoId)));
  assert.deepEqual(result.registry, input.registry);
});
test('Delete?=Y overrides Keep and caption; blank/N restores without renumbering IDs', () => {
  for (const value of ['Y', 'y', '', 'N', 'n']) {
    const input = base(), photo = input.photos[0];
    input.collections.combined[1][1] = value;
    input.collections.combined[1][3] = 'A cycling memory.';
    input.approvedFields.set(captionField(photo), 'A cycling memory.');
    const result = makeReview(input), deleted = value.toUpperCase() === 'Y';
    assert.equal(result.snapshot.photos[0].keep, true);
    assert.equal(result.snapshot.photos[0].deleted, deleted);
    assert.equal(shown(result).length, deleted ? 48 : 49);
    assert.deepEqual(result.registry, input.registry);
    const field = reviewManifest(read('copy/field-manifest.json'), library, result.snapshot).find((p) => p.field === photo.altField);
    assert.equal(field.route, deleted ? null : '/cdm-photo-gallery/');
    assert.equal(field.required, true);
  }
});
test('unchecked Keep excludes regardless of caption; caption linkage is checked', () => {
  const input = base(), photo = input.photos[0];
  input.collections.combined[1][0] = false;
  input.collections.combined[1][3] = 'A cycling memory.';
  assert.throws(() => makeReview(input), /differs from its Approved/);
  input.approvedFields.set(captionField(photo), 'A cycling memory.');
  assert.equal(shown(makeReview(input)).length, 48);
});
test('missing/duplicate/outside-folder/reordered/nonboolean rows and invalid Delete? fail closed', () => {
  for (const edit of [
    (i) => i.collections.combined.pop(),
    (i) => i.collections.combined.push(i.collections.combined[1]),
    (i) => { i.collections.combined[1][8] = library.find((p) => !i.photos.some((x) => x.id === p.id)).id; },
    (i) => { [i.collections.combined[1], i.collections.combined[2]] = [i.collections.combined[2], i.collections.combined[1]]; },
    (i) => { i.collections.combined[1][0] = 'TRUE'; },
    ...['Yes', ' Y ', true, 1, 'delete'].map((value) => (i) => { i.collections.combined[1][1] = value; }),
  ]) { const input = base(); edit(input); assert.throws(() => makeReview(input)); }
});
test('assigned dates/IDs immutable; EST suffix and unique bases enforced', () => {
  const input = base(); input.collections.combined[1][6] = '2026-09-31';
  assert.throws(() => makeReview(input), /real YYYY-MM-DD/);
  const altered = base(); altered.collections.combined[1][5] = '2026082999';
  assert.throws(() => makeReview(altered), /immutable/);
  const est = base(); const record = est.registry.photos.find((p) => p.estimated); record.photoId = record.photoId.slice(0, 10);
  assert.throws(() => makeReview(est), /Invalid/);
  const duplicate = base(); duplicate.registry.photos[1].photoId = duplicate.registry.photos[0].photoId;
  assert.throws(() => makeReview(duplicate), /duplicate/);
});
test('date allocation stops at 99 rather than expanding ten-digit base', () => {
  const input = base(), first = input.registry.photos.find((p) => p.id === input.photos[0].id), next = input.registry.photos.find((p) => p.id === input.photos[1].id);
  first.photoId = first.captureDate.replaceAll('-', '') + '99' + (first.estimated ? 'EST' : ''); input.collections.combined[1][5] = first.photoId;
  next.photoId = null; next.captureDate = null; input.collections.combined[2][5] = '';
  assert.throws(() => makeReview(input), /at most 99/);
});
test('all eligible photos may be Y; registry and originals remain retained', () => {
  const input = base(); input.collections.combined.slice(1).forEach((row) => { row[1] = 'Y'; });
  const result = makeReview(input);
  assert.equal(shown(result).length, 0);
  assert.deepEqual(result.registry, input.registry);
});
test('selection rejects changed hashes, duplicate assets and unstable order', () => {
  for (const edit of [(s) => { s.photos[0].sha256 = 'bad'; }, (s) => { s.photos[1] = s.photos[0]; }, (s) => { s.photos[0].order = 2; }]) {
    const selection = read('src/data/cdm-gallery-selection.json'); edit(selection);
    assert.throws(() => selectLibrary(library, selection));
  }
});
