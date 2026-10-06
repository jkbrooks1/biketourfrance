import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import manifest from './cdm-gallery-manifest.json';
import deliveryPlan from './cdm-gallery-delivery-plan.json';
import { TEXT } from './approved-copy';

export type Collection = 'cdm1' | 'cdm2';
const originals = import.meta.glob<{ default: ImageMetadata }>('../assets/cdm-gallery/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,avif,gif,tif,tiff,bmp}', { eager: true });
export const GALLERY_ROOT = '/cdm-photo-gallery/';
export const COLLECTIONS = ['cdm1', 'cdm2'] as const;

export function sourceFor(photo: (typeof manifest.photos)[number]): ImageMetadata {
  const key = photo.managedSource.replace('src/', '../');
  const original = originals[key]?.default;
  if (!original) throw new Error(`Managed gallery original is missing: ${photo.managedSource}`);
  return original;
}

export const galleryPhotos = manifest.photos.map((photo) => {
  const alt = TEXT[photo.altField];
  if (!alt?.trim()) throw new Error(`Missing Sheet description: ${photo.altField}`);
  return { ...photo, collection: photo.collection as Collection, alt, src: sourceFor(photo) };
});

// Astro's configured image service generates all delivered images; originals remain in src/assets.
// Cache this promise so page routes and the generated delivery manifest share transforms.
let delivery: ReturnType<typeof createDelivery> | undefined;
async function createDelivery() {
  return Promise.all(galleryPhotos.map(async (photo) => {
    const plan = deliveryPlan.photos.find((entry) => entry.id === photo.id);
    if (!plan) throw new Error(`Missing image delivery plan: ${photo.id}`);
    const variants = await Promise.all(plan.variants.map(async ({ width, format, quality }) => {
      const image = await getImage({ src: photo.src, width, format, quality });
      return { format, width, height: Math.round(width * photo.height / photo.width), path: image.src };
    }));
    const detailWidth = plan.detail.width;
    const detail = await getImage({ src: photo.src, width: detailWidth, format: 'webp', quality: plan.detail.quality });
    return { ...photo, variants, detail: { path: detail.src, width: detailWidth, height: Math.round(detailWidth * photo.height / photo.width) } };
  }));
}
export function getGalleryDelivery() {
  return delivery ??= createDelivery();
}
