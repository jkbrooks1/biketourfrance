import { getGalleryDelivery } from '../../data/cdm-photo-gallery';
import selection from '../../data/cdm-gallery-selection.json';

export async function GET() {
  const photos = await getGalleryDelivery();
  return new Response(JSON.stringify({
    schemaVersion: 1,
    ordering: selection.ordering,
    photos: photos.map(({ src: _src, sourcePath: _sourcePath, managedSource: _managedSource, ...photo }) => photo),
  }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
