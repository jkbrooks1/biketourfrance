import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync, statSync, readdirSync, lstatSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const proof = 'docs/proof/2026-10-05_cdm_photo_gallery';
const outputProof = process.env.BTF_GALLERY_PROOF_DIR || proof;
const source = JSON.parse(readFileSync(`${proof}/source-inventory.json`, 'utf8'));
const manifest = JSON.parse(readFileSync('src/data/cdm-gallery-manifest.json', 'utf8'));
const review = JSON.parse(readFileSync('src/data/cdm-gallery-review.json', 'utf8'));
const kept = manifest.photos.filter((photo) => review.photos.find((entry) => entry.id === photo.id)?.keep);
const delivered = JSON.parse(readFileSync('dist/cdm-photo-gallery/manifest.json', 'utf8'));
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
assert.equal(manifest.photos.length, source.uniqueCount);
assert.equal(new Set(manifest.photos.map((photo) => photo.sha256)).size, manifest.photos.length);
assert.equal(new Set(manifest.photos.map((photo) => photo.pixelSha256)).size, manifest.photos.length);
assert.equal(delivered.photos.length, kept.length);
const fields = new Map(JSON.parse(readFileSync('copy/fixture/fixture-rows.json', 'utf8')));
const summary = { routes: [], uniqueImages: manifest.photos.length, excludedDuplicates: source.duplicates.length, sourceImagesVerifiedUnchanged: 0, variantsChecked: 0, largestDeliveredImageBytes: 0, managedOriginalBytes: 0 };
const landing = readFileSync('dist/cdm-photo-gallery/index.html', 'utf8');
const landingIds = [...landing.matchAll(/data-photo-id="([^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(landingIds, kept.map((photo) => photo.id), 'Landing page must show checked photos in manifest order');
assert.equal(new Set(landingIds).size, kept.length);
summary.routes.push({ route: '/cdm-photo-gallery/', renderedImages: landingIds.length });

for (const collection of source.collections) {
  assert.equal(collection.images.length + collection.corruptOrUnreadable.length, collection.supportedCount);
  for (const image of collection.images) {
    assert.equal(hash(readFileSync(image.sourcePath)), image.sha256, `Mounted original changed: ${image.sourcePath}`);
    summary.sourceImagesVerifiedUnchanged++;
  }
  const included = kept.filter((photo) => photo.collection === collection.collection);
  assert.equal(manifest.photos.filter((photo) => photo.collection === collection.collection).length, collection.includedCount);
  const route = `/cdm-photo-gallery/${collection.collection}/`;
  const html = readFileSync(`dist${route}index.html`, 'utf8');
  const ids = [...html.matchAll(/data-photo-id="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(ids, included.map((photo) => photo.id), 'Rendered order/count differs from inventory');
  assert.equal(new Set(ids).size, ids.length);
  summary.routes.push({ route, renderedImages: ids.length });
  const lazy = [...html.matchAll(/<img\b[^>]*loading="lazy"[^>]*>/g)];
  assert.ok(lazy.length >= included.length, 'Missing lazy loading');
  assert.ok(html.includes(`aria-describedby="gallery-open-help-${collection.collection}"`));
  assert.ok(html.includes('data-gallery-dialog'));
}
for (const photo of manifest.photos) {
  assert.ok(existsSync(photo.managedSource));
  assert.equal(lstatSync(photo.managedSource).isSymbolicLink(), false);
  assert.equal(hash(readFileSync(photo.managedSource)), photo.sha256, 'Managed original changed');
  summary.managedOriginalBytes += statSync(photo.managedSource).size;
  const output = delivered.photos.find((entry) => entry.id === photo.id);
  if (!review.photos.find((entry) => entry.id === photo.id).keep) { assert.equal(output, undefined); continue; }
  assert.equal(output.alt, fields.get(photo.altField));
  assert.ok(output.alt?.trim());
  assert.deepEqual([output.width, output.height], [photo.width, photo.height]);
  for (const variant of [...output.variants, output.detail]) {
    const file = join('dist', variant.path);
    assert.ok(existsSync(file), `Missing image: ${variant.path}`);
    const bytes = statSync(file).size;
    assert.ok(bytes <= 300 * 1024, `Existing 300 KiB policy exceeded: ${variant.path}, ${bytes}`);
    const metadata = await sharp(file).metadata();
    assert.equal(metadata.width, variant.width, `Width mismatch: ${variant.path}`);
    assert.ok(Math.abs(metadata.height - variant.height) <= 1, `Height mismatch: ${variant.path}`);
    summary.largestDeliveredImageBytes = Math.max(summary.largestDeliveredImageBytes, bytes);
    summary.variantsChecked++;
  }
}
for (const duplicate of source.duplicates) {
  assert.ok(manifest.photos.some((photo) => photo.sourcePath === duplicate.retainedPath));
  assert.ok(!manifest.photos.some((photo) => photo.sourcePath === duplicate.path));
}
function walk(folder) {
  return readdirSync(folder).flatMap((name) => {
    const file = join(folder, name);
    return statSync(file).isDirectory() ? walk(file) : [file];
  });
}
const distFiles = walk('dist');
assert.ok(distFiles.length < 20000, 'Pages Free-plan file limit exceeded');
assert.ok(distFiles.every((file) => statSync(file).size <= 25 * 1024 * 1024), 'Pages per-file limit exceeded');
summary.pagesFileCount = distFiles.length;
summary.pagesBytes = distFiles.reduce((bytes, file) => bytes + statSync(file).size, 0);
for (const htmlFile of distFiles.filter((file) => file.endsWith('.html'))) {
  const html = readFileSync(htmlFile, 'utf8');
  assert.ok(html.includes('href="/cdm-photo-gallery/"'), `Missing footer gallery access: ${htmlFile}`);
}
mkdirSync(outputProof, { recursive: true });
writeFileSync(`${outputProof}/manifest-verification.json`, JSON.stringify(summary, null, 2) + '\n');
console.log('gallery:verify PASS');
console.log(JSON.stringify(summary, null, 2));
