import { getGalleryDelivery } from '../../data/cdm-photo-gallery';

export async function GET() {
  const photos = await getGalleryDelivery();
  return new Response(JSON.stringify({
    schemaVersion: 1,
    ordering: 'Stable relative filename order within each collection.',
    photos: photos.map(({ src: _src, sourcePath: _sourcePath, managedSource: _managedSource, ...photo }) => photo),
  }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
