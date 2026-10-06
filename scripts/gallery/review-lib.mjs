import { createHash } from 'node:crypto';

export const HEADERS = ['Keep', 'Delete?', 'Lightbox number', 'Caption', 'Thumbnail', 'Photo ID', 'Capture date', 'Filename', 'Asset key', 'Date basis', 'Confidence', 'Date evidence'];
export const TABS = { combined: 'CDM Photo Review' };
export const GALLERY_ROUTE = '/cdm-photo-gallery/';
export const captionField = (photo) => photo.altField.replace(/_alt$/, '_caption');
export const digest = (value) => createHash('sha256').update(value).digest('hex');

export function selectLibrary(photos, selection) {
  const seen = new Set();
  const selected = selection.photos.map((entry, index) => {
    const photo = photos.find((p) => p.id === entry.id);
    if (!photo || photo.sha256 !== entry.sha256 || photo.pixelSha256 !== entry.pixelSha256 || seen.has(entry.id) || entry.order !== index + 1) throw new Error(`Invalid combined-folder selection: ${entry.id}`);
    seen.add(entry.id);
    return { ...photo, order: entry.order, locationGroup: entry.locationGroup, selectionSourcePath: entry.sourcePath };
  });
  return selected;
}

export function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T12:00:00Z');
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export function makeReview({ photos, collections, registry, approvedFields }) {
  const old = new Map(registry.photos.map((entry) => [entry.id, entry]));
  const max = new Map();
  const used = new Set();
  for (const entry of registry.photos) {
    if (!entry.photoId) continue;
    const base = entry.photoId.replace(/EST$/, '');
    if (!/^\d{8}(?:0[1-9]|[1-9]\d)(?:EST)?$/.test(entry.photoId) || Boolean(entry.estimated) !== entry.photoId.endsWith('EST') || !validDate(entry.captureDate) || !base.startsWith(entry.captureDate.replaceAll('-', '')) || used.has(base)) throw new Error(`Invalid or duplicate registered Photo ID: ${entry.id}`);
    used.add(base);
    max.set(entry.captureDate, Math.max(max.get(entry.captureDate) || 0, Number(base.slice(8, 10))));
  }
  const inputs = new Map();
  for (const [collection, tab] of Object.entries(TABS)) {
    const rows = collections[collection];
    if (!rows || JSON.stringify(rows[0]) !== JSON.stringify(HEADERS)) throw new Error(`Review headers do not match ${tab}`);
    const collectionPhotos = photos;
    let position = 0;
    for (const [index, row] of rows.slice(1).entries()) {
      if (row.every((value) => value === '' || value == null)) continue;
      const [keep, rawDelete, , rawCaption, , rawId, rawDate, filename, key] = row;
      const deleteValue = String(rawDelete ?? '').toUpperCase();
      if (!['', 'Y', 'N'].includes(deleteValue)) throw new Error(`${tab} row ${index + 2}: Delete? must be Y, N or blank`);
      const photo = photos.find((entry) => entry.id === key);
      if (!photo || photo.sourceFilename !== filename) throw new Error(`${tab} row ${index + 2}: unknown asset or filename`);
      if (inputs.has(key)) throw new Error(`Duplicate review asset: ${key}`);
      if (key !== collectionPhotos[position++]?.id) throw new Error(`${tab}: preserve source row order so lightbox numbers remain accurate`);
      if (typeof keep !== 'boolean') throw new Error(`${tab} row ${index + 2}: Keep must be a checkbox TRUE/FALSE`);
      if (rawCaption != null && typeof rawCaption !== 'string') throw new Error(`${key}: Caption must be text or blank`);
      const caption = String(rawCaption ?? '').trim();
      if (caption.length > 1000 || /[\r\n]|[<>]/.test(caption)) throw new Error(`${key}: Caption must be plain single-line text of at most 1000 characters`);
      const approved = approvedFields.get(captionField(photo)) || '';
      if (caption !== approved.trim()) throw new Error(`${key}: Caption differs from its Approved Site Copy field; check the linked formula`);
      const date = String(rawDate ?? '').trim();
      if (date && !validDate(date)) throw new Error(`${key}: Capture date must be a real YYYY-MM-DD date`);
      const previous = old.get(key);
      if (!previous) throw new Error(`Asset has no ID registry entry: ${key}`);
      if (row[9] !== (previous.estimated ? 'Estimated' : 'EXIF') || row[10] !== previous.confidence || row[11] !== previous.dateEvidence) throw new Error(`${key}: date evidence fields must match the registry; request an explicit correction`);
      if (previous.captureDate && date !== previous.captureDate) throw new Error(`${key}: assigned capture date is immutable; request an explicit date correction`);
      const sheetId = String(rawId ?? '').trim();
      if (previous.photoId && sheetId !== previous.photoId) throw new Error(`${key}: assigned Photo ID is immutable`);
      inputs.set(key, { keep, deleted: deleteValue === 'Y', captionHash: digest(caption), date, sheetId, previous });
    }
  }
  if (inputs.size !== photos.length) throw new Error(`Incomplete review: expected ${photos.length} photos, found ${inputs.size}`);
  const records = photos.map((photo) => {
    const input = inputs.get(photo.id);
    let photoId = input.previous.photoId;
    if (!photoId && input.date) {
      const next = (max.get(input.date) || 0) + 1;
      if (next > 99) throw new Error(`${input.date}: 10-digit Photo IDs support at most 99 photos per date`);
      photoId = input.date.replaceAll('-', '') + String(next).padStart(2, '0');
      max.set(input.date, next);
    }
    if (input.sheetId && input.sheetId !== photoId) throw new Error(`${photo.id}: Photo ID does not match the registry allocation`);
    return { ...input.previous, id: photo.id, photoId, captureDate: input.date || null, dateSource: input.previous.photoId ? input.previous.dateSource : input.date ? 'Owner supplied capture date' : 'Pending owner capture date', estimated: input.previous.estimated || false, keep: input.keep, deleted: input.deleted, captionField: captionField(photo), captionHash: input.captionHash };
  });
  return {
    snapshot: { schemaVersion: 1, photos: records },
    registry: { schemaVersion: 1, photos: registry.photos.map((previous) => {
      const current = records.find((entry) => entry.id === previous.id);
      if (!current) return previous; // Retired IDs stay reserved permanently.
      const { keep: _keep, deleted: _deleted, captionField: _field, captionHash: _hash, ...record } = current;
      return record;
    }) },
  };
}

export function reviewManifest(manifest, photos, snapshot) {
  const states = new Map(snapshot.photos.map((entry) => [entry.id, entry]));
  const alts = new Map(photos.map((photo) => [photo.altField, photo]));
  const result = manifest.filter((entry) => !photos.some((photo) => captionField(photo) === entry.field)).map((entry) => {
    const photo = alts.get(entry.field);
    if (photo) return { ...entry, route: states.get(photo.id)?.keep && !states.get(photo.id)?.deleted ? GALLERY_ROUTE : null };
    if (entry.field.startsWith('/cdm-gallery')) {
      const visible = ['heading', 'meta_title', 'meta_description', 'cdm1_intro', 'photo_count_label', 'open_help', 'lightbox_title', 'close', 'previous', 'next', 'keyboard_help'];
      return { ...entry, codeLocation: entry.codeLocation === 'src/pages/cdm-photo-gallery/[collection].astro' ? 'src/pages/cdm-photo-gallery/index.astro' : entry.codeLocation, route: visible.some((key) => entry.field === '/cdm-gallery/' + key) ? GALLERY_ROUTE : null };
    }
    return entry;
  });
  for (const photo of photos) result.push({ field: captionField(photo), route: states.has(photo.id) ? GALLERY_ROUTE : null, required: false, codeLocation: 'src/data/cdm-photo-gallery.ts' });
  return result;
}
