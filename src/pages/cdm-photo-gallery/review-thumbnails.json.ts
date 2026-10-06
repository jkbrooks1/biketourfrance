import { getReviewThumbnails } from '../../data/cdm-photo-gallery';

export async function GET() {
  return new Response(JSON.stringify({ schemaVersion: 1, photos: await getReviewThumbnails() }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
