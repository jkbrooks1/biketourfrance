import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { makeReview, selectLibrary, captionField, digest, GALLERY_ROUTE } from './review-lib.mjs';
const read = (file) => JSON.parse(readFileSync(file, 'utf8'));
const library = read('src/data/cdm-gallery-manifest.json').photos;
const selection = read('src/data/cdm-gallery-selection.json');
const photos = selectLibrary(library, selection);
const locations = read('src/data/cdm-gallery-locations.json');
assert.equal(locations.photos.length, photos.length);
assert.equal(locations.photos.filter((p) => p.basis === 'GPS').length, 39);
assert.equal(locations.photos.filter((p) => p.estimated).length, 10);
let lastGroup = 0;
for (const photo of photos) {
  const location = locations.photos.find((p) => p.id === photo.id);
  const group = locations.groups.find((g) => g.id === location.groupId);
  assert.equal(photo.locationGroup, group.id);
  assert.ok(group.order >= lastGroup, 'Location groups must remain contiguous and west to east');
  assert.equal(Boolean(location.coordinates), !location.estimated, 'Estimated coordinates must not be invented');
  lastGroup = group.order;
}
const review = read('src/data/cdm-gallery-review.json');
const registry = read('src/data/cdm-photo-id-registry.json');
const expected = makeReview({ photos, collections: read('copy/gallery-review.fixture.json').collections, registry, approvedFields: new Map(read('copy/fixture/fixture-rows.json')) });
assert.deepEqual(review, expected.snapshot, 'Review snapshot stale or modified outside Sheet sync');
assert.equal(registry.photos.length, library.length, 'Retired IDs must remain reserved');
const fields = new Map(read('copy/field-manifest.json').map((field) => [field.field, field]));
const selected = photos.filter((photo) => { const state = review.photos.find((p) => p.id === photo.id); return state.keep && !state.deleted; });
const delivered = read('dist/cdm-photo-gallery/manifest.json').photos;
assert.deepEqual(delivered.map((photo) => photo.id), selected.map((photo) => photo.id));
const thumbnails = read('dist/cdm-photo-gallery/review-thumbnails.json').photos;
assert.deepEqual(thumbnails.map((photo) => photo.id), library.map((photo) => photo.id));
assert.equal(thumbnails.filter((photo) => photo.active).length, photos.length);
for (const photo of library) {
  const state = review.photos.find((entry) => entry.id === photo.id);
  const visible = Boolean(state?.keep && !state.deleted);
  assert.equal(fields.get(photo.altField)?.route, visible ? GALLERY_ROUTE : null);
  assert.equal(fields.get(photo.altField)?.required, true);
  assert.equal(fields.get(captionField(photo))?.required, false);
  assert.ok(existsSync(photo.managedSource));
  assert.equal(digest(readFileSync(photo.managedSource)), photo.sha256, 'Managed original changed');
  const output = delivered.find((entry) => entry.id === photo.id);
  assert.equal(Boolean(output), visible);
  if (output) {
    assert.equal(output.collection, 'combined');
    assert.equal(output.sourceCollection, photo.collection);
    assert.equal(output.locationGroup, photos.find((p) => p.id === photo.id).locationGroup);
    assert.equal(output.photoId, state.photoId);
    assert.equal(digest(output.caption.trim()), state.captionHash);
    assert.equal(output.sourcePath, undefined, 'Public manifest exposes mounted path');
    for (const variant of [...output.variants, output.detail]) {
      assert.ok(existsSync('dist' + variant.path));
      assert.ok(statSync('dist' + variant.path).size <= 300 * 1024);
    }
  }
  const thumb = thumbnails.find((entry) => entry.id === photo.id);
  assert.ok(existsSync('dist' + thumb.thumbnail));
  assert.ok(statSync('dist' + thumb.thumbnail).size <= 300 * 1024);
}
const html = readFileSync('dist/cdm-photo-gallery/index.html', 'utf8');
assert.deepEqual([...html.matchAll(/data-photo-id="([^"]+)"/g)].map((match) => match[1]), selected.map((photo) => photo.id));
const redirects = readFileSync('dist/_redirects', 'utf8');
for (const collection of ['cdm1', 'cdm2']) {
  assert.ok(!existsSync(`dist/cdm-photo-gallery/${collection}/index.html`));
  for (const suffix of ['', '/']) assert.ok(redirects.includes(`/cdm-photo-gallery/${collection}${suffix} /cdm-photo-gallery/ 301`));
}
assert.equal(new Set(selection.photos.map((p) => p.sha256)).size, photos.length);
assert.equal(new Set(selection.photos.map((p) => p.pixelSha256)).size, photos.length);
console.log(`gallery:verify PASS: ${selected.length}/${photos.length} eligible shown; ${review.photos.filter((p) => p.deleted).length} Delete?=Y; ${registry.photos.length} permanent IDs and ${thumbnails.length} thumbnails retained; combined route/redirects/order/captions/managed originals checked`);
