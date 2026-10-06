import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { makeReview, captionField, digest } from './review-lib.mjs';

const read = (file) => JSON.parse(readFileSync(file, 'utf8'));
const photos = read('src/data/cdm-gallery-manifest.json').photos;
const review = read('src/data/cdm-gallery-review.json');
const registry = read('src/data/cdm-photo-id-registry.json');
const rows = read('copy/fixture/fixture-rows.json');
const expected = makeReview({ photos, collections: read('copy/gallery-review.fixture.json').collections, registry, approvedFields: new Map(rows) });
assert.deepEqual(review, expected.snapshot, 'Review snapshot is stale or modified outside the Sheet sync');
const fields = new Map(read('copy/field-manifest.json').map((field) => [field.field, field]));
const selected = photos.filter((photo) => review.photos.find((state) => state.id === photo.id).keep);
const delivered = read('dist/cdm-photo-gallery/manifest.json').photos;
assert.deepEqual(delivered.map((photo) => photo.id), selected.map((photo) => photo.id));
const thumbnails = read('dist/cdm-photo-gallery/review-thumbnails.json').photos;
assert.deepEqual(thumbnails.map((photo) => photo.id), photos.map((photo) => photo.id));
for (const photo of photos) {
  const state = review.photos.find((entry) => entry.id === photo.id);
  const route = `/cdm-photo-gallery/${photo.collection}/`;
  assert.equal(fields.get(photo.altField)?.route, state.keep ? route : null, 'Only unchecked Keep may detach the required alt field from its route');
  assert.equal(fields.get(photo.altField)?.required, true);
  assert.equal(fields.get(captionField(photo))?.required, false);
  assert.ok(existsSync(photo.managedSource), 'Every original must remain managed');
  assert.equal(digest(readFileSync(photo.managedSource)), photo.sha256, 'Managed original must stay byte-identical');
  const output = delivered.find((entry) => entry.id === photo.id);
  assert.equal(Boolean(output), state.keep);
  if (output) {
    assert.equal(output.photoId, state.photoId);
    assert.equal(digest(output.caption.trim()), state.captionHash, 'Caption differs from approved review snapshot');
    for (const variant of [...output.variants, output.detail]) {
      assert.ok(existsSync('dist' + variant.path));
      assert.ok(statSync('dist' + variant.path).size <= 300 * 1024);
    }
  }
  const thumb = thumbnails.find((entry) => entry.id === photo.id);
  assert.ok(existsSync('dist' + thumb.thumbnail));
  assert.ok(statSync('dist' + thumb.thumbnail).size <= 300 * 1024);
}
for (const collection of ['cdm1', 'cdm2']) {
  const expected = selected.filter((photo) => photo.collection === collection).map((photo) => photo.id);
  const html = readFileSync(`dist/cdm-photo-gallery/${collection}/index.html`, 'utf8');
  assert.deepEqual([...html.matchAll(/data-photo-id="([^"]+)"/g)].map((match) => match[1]), expected);
}
const landing = readFileSync('dist/cdm-photo-gallery/index.html', 'utf8');
assert.deepEqual([...landing.matchAll(/data-photo-id="([^"]+)"/g)].map((match) => match[1]), selected.map((photo) => photo.id));
console.log(`gallery:verify PASS: ${selected.length}/${photos.length} selected; CDM1 ${selected.filter((p) => p.collection === 'cdm1').length}, CDM2 ${selected.filter((p) => p.collection === 'cdm2').length}; ${thumbnails.length} retained thumbnails; ${registry.photos.filter((p) => p.estimated).length} EST IDs; order/optional captions/copy routes/dimensions/assets checked`);
