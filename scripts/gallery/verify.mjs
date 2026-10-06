import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync, statSync, readdirSync, lstatSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const proof = 'docs/proof/2026-10-05_cdm_photo_gallery';
const outputProof = process.env.BTF_GALLERY_PROOF_DIR || proof;
const source = JSON.parse(readFileSync('docs/proof/2026-10-06_cdm_combined_gallery/source-inventory.json', 'utf8'));
const selection = JSON.parse(readFileSync('src/data/cdm-gallery-selection.json', 'utf8'));
const manifest = JSON.parse(readFileSync('src/data/cdm-gallery-manifest.json', 'utf8'));
const eligible = selection.photos.map((entry) => manifest.photos.find((p) => p.id === entry.id));
const review = JSON.parse(readFileSync('src/data/cdm-gallery-review.json', 'utf8'));
const kept = eligible.filter((photo) => {const state = review.photos.find((entry) => entry.id === photo.id);return state?.keep && !state.deleted;});
const delivered = JSON.parse(readFileSync('dist/cdm-photo-gallery/manifest.json', 'utf8'));
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
assert.equal(eligible.length, source.uniqueCount);
assert.equal(new Set(manifest.photos.map((photo) => photo.sha256)).size, manifest.photos.length);
assert.equal(new Set(manifest.photos.map((photo) => photo.pixelSha256)).size, manifest.photos.length);
assert.equal(delivered.photos.length, kept.length);
const fields = new Map(JSON.parse(readFileSync('copy/fixture/fixture-rows.json', 'utf8')));
const summary = { routes: [], eligibleImages: eligible.length, retainedLibraryImages: manifest.photos.length, excludedDuplicates: source.duplicates.length, sourceImagesVerifiedUnchanged: 0, variantsChecked: 0, largestDeliveredImageBytes: 0, managedOriginalBytes: 0 };
const landing = readFileSync('dist/cdm-photo-gallery/index.html', 'utf8');
const landingIds = [...landing.matchAll(/data-photo-id="([^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(landingIds, kept.map((photo) => photo.id), 'Landing page must show checked photos in manifest order');
assert.equal(new Set(landingIds).size, kept.length);
summary.routes.push({ route: '/cdm-photo-gallery/', renderedImages: landingIds.length });

for (const image of source.photos) {
  assert.equal(hash(readFileSync(image.sourcePath)), image.sha256, `Mounted original changed: ${image.sourcePath}`);
  summary.sourceImagesVerifiedUnchanged++;
}
assert.ok(landing.includes('aria-describedby="gallery-open-help-combined"'));
assert.ok(landing.includes('data-gallery-dialog'));
assert.ok([...landing.matchAll(/<img\b[^>]*loading="lazy"[^>]*>/g)].length >= Math.max(0, kept.length - 1));
for (const photo of manifest.photos) {
  assert.ok(existsSync(photo.managedSource));
  assert.equal(lstatSync(photo.managedSource).isSymbolicLink(), false);
  assert.equal(hash(readFileSync(photo.managedSource)), photo.sha256, 'Managed original changed');
  summary.managedOriginalBytes += statSync(photo.managedSource).size;
  const output = delivered.photos.find((entry) => entry.id === photo.id);
  if (!kept.some((entry) => entry.id === photo.id)) { assert.equal(output, undefined); continue; }
  assert.equal(output.alt, fields.get(photo.altField));
  assert.ok(output.alt?.trim());
  const crop = JSON.parse(readFileSync('src/data/cdm-gallery-editorial.json', 'utf8')).crop;
  assert.deepEqual([output.width, output.height], photo.sourceFilename === crop.filename ? [crop.width, crop.height] : [photo.width, photo.height]);
  assert.deepEqual([output.originalWidth, output.originalHeight], [photo.width, photo.height]);
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
assert.equal(source.duplicates.length, 0);
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
