// Preserve originals; choose delivery sizes/quality that satisfy the existing 300 KiB asset policy.
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
const manifest = JSON.parse(readFileSync('src/data/cdm-gallery-manifest.json', 'utf8'));
const limit = 300 * 1024;
const plans = [];
for (const photo of manifest.photos) {
  const variants = [];
  for (const width of [320, 640, 960].filter((value) => value <= photo.width)) {
    for (const format of ['avif', 'webp']) {
      let planned;
      for (const quality of [70, 62, 55, 48, 40]) {
        const bytes = (await sharp(photo.managedSource).rotate().resize({ width, withoutEnlargement: true }).toFormat(format, { quality }).toBuffer()).length;
        if (bytes <= limit) { planned = { width, format, quality, estimatedBytes: bytes }; break; }
      }
      if (!planned) throw new Error(`Tile cannot meet existing image policy: ${photo.managedSource} ${width} ${format}`);
      variants.push(planned);
    }
  }
  let detail;
  for (const width of [...new Set([Math.min(1200, photo.width), Math.min(960, photo.width)])]) {
    for (const quality of [78, 70, 62, 55, 48]) {
      const bytes = (await sharp(photo.managedSource).rotate().resize({ width, withoutEnlargement: true }).webp({ quality }).toBuffer()).length;
      if (bytes <= limit) { detail = { width, format: 'webp', quality, estimatedBytes: bytes }; break; }
    }
    if (detail) break;
  }
  if (!detail) throw new Error(`Detail cannot meet existing image policy: ${photo.managedSource}`);
  plans.push({ id: photo.id, variants, detail });
  console.log(`${plans.length}/${manifest.photos.length}: ${photo.sourceFilename}; detail ${detail.width}w q${detail.quality}, ${detail.estimatedBytes} bytes`);
}
writeFileSync('src/data/cdm-gallery-delivery-plan.json', JSON.stringify({ maxAssetBytes: limit, photos: plans }, null, 2) + '\n');
console.log(`gallery:plan PASS: ${plans.length} originals retained; all planned derivatives <= ${limit} bytes.`);
