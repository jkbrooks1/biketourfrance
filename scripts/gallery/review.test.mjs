import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { makeReview, reviewManifest, captionField } from './review-lib.mjs';

const read = (file) => JSON.parse(readFileSync(file, 'utf8'));
const base = () => {
  const input = { photos: read('src/data/cdm-gallery-manifest.json').photos, collections: read('copy/gallery-review.fixture.json').collections, registry: read('src/data/cdm-photo-id-registry.json'), approvedFields: new Map(read('copy/fixture/fixture-rows.json')) };
  for (const rows of Object.values(input.collections)) for (const row of rows.slice(1)) { row[0] = true; row[2] = ''; }
  for (const photo of input.photos) input.approvedFields.set(captionField(photo), '');
  return input;
};

test('blank captions retain every checked photo; IDs are unique and estimated IDs end EST', () => {
  const input = base();
  const result = makeReview(input).snapshot.photos;
  assert.equal(result.filter((p) => p.keep).length, input.photos.length);
  assert.equal(new Set(result.map((p) => p.photoId.replace(/EST$/, ''))).size, input.photos.length);
  assert.equal(result.filter((p) => p.estimated).length, input.registry.photos.filter((p) => p.estimated).length);
  assert.ok(result.every((p) => /^\d{10}(?:EST)?$/.test(p.photoId)));
});
test('Keep alone controls selection; hiding photos preserves IDs and alt copy requirements', () => {
  const input = base();
  input.collections.cdm2[1][0] = false;
  const result = makeReview(input).snapshot;
  assert.equal(result.photos.filter((p) => p.keep).length, input.photos.length - 1);
  assert.deepEqual(result.photos.map((p) => p.photoId), input.registry.photos.map((p) => p.photoId));
  const fields = reviewManifest(read('copy/field-manifest.json'), input.photos, result);
  const hidden = input.photos.find((p) => p.collection === 'cdm2');
  assert.equal(fields.find((p) => p.field === hidden.altField).route, null);
  assert.equal(fields.find((p) => p.field === hidden.altField).required, true);
});
test('a caption on an unchecked photo cannot include it; caption must match approved copy', () => {
  const input = base();
  const photo = input.photos[0];
  input.collections.cdm1[1][0] = false;
  input.collections.cdm1[1][2] = 'A cycling memory.';
  assert.throws(() => makeReview(input), /differs from its Approved/);
  input.approvedFields.set(captionField(photo), 'A cycling memory.');
  assert.equal(makeReview(input).snapshot.photos[0].keep, false);
});
test('missing, duplicate, unknown, and nonboolean review rows fail closed', () => {
  for (const edit of [
    (i) => i.collections.cdm1.pop(),
    (i) => i.collections.cdm1.push(i.collections.cdm1[1]),
    (i) => { i.collections.cdm1[1][7] = 'unknown'; },
    (i) => { i.collections.cdm1[1][0] = 'TRUE'; },
  ]) { const input = base(); edit(input); assert.throws(() => makeReview(input)); }
});
test('registered dates/IDs cannot change silently; estimates need EST and bases cannot collide', () => {
  const input = base();
  input.collections.cdm1[1][5] = '2026-09-31';
  assert.throws(() => makeReview(input), /real YYYY-MM-DD/);
  const altered = base(); altered.collections.cdm1[1][4] = '2026082999';
  assert.throws(() => makeReview(altered), /immutable/);
  const missingSuffix = base(); const est = missingSuffix.registry.photos.find((p) => p.estimated); est.photoId = est.photoId.slice(0, 10);
  assert.throws(() => makeReview(missingSuffix), /Invalid/);
  const duplicate = base(); duplicate.registry.photos[1].photoId = duplicate.registry.photos[0].photoId;
  assert.throws(() => makeReview(duplicate), /duplicate/);
});
test('new date allocation stops at 99 instead of expanding the ten-digit base', () => {
  const input = base();
  input.registry.photos[0].photoId = '2026082999'; input.collections.cdm1[1][4] = '2026082999';
  input.registry.photos[1].photoId = null; input.registry.photos[1].captureDate = null; input.collections.cdm1[2][4] = '';
  assert.throws(() => makeReview(input), /at most 99/);
});

test('all photos may be unchecked while every original and ID remains in the review registry', () => {
  const input = base();
  for (const rows of Object.values(input.collections)) for (const row of rows.slice(1)) row[0] = false;
  const result = makeReview(input);
  assert.equal(result.snapshot.photos.filter((p) => p.keep).length, 0);
  assert.deepEqual(result.registry, input.registry);
});
