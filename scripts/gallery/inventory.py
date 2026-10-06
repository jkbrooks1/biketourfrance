#!/usr/bin/env python3
"""Inventory mounted source photos without modifying them; optionally import unique originals.

Run from the canonical root. Pillow is a local inventory/inspection dependency only;
Cloudflare builds use the committed manifest and Astro's existing image service.
"""
import argparse
import hashlib
import json
import os
import shutil
from collections import Counter, defaultdict
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
PROOF = ROOT / 'docs/proof/2026-10-05_cdm_photo_gallery'
EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.tif', '.tiff', '.heic', '.heif', '.bmp'}
COLLECTIONS = [('cdm1', Path('/Volumes/JB_Tier2Storage/CDM1-green')), ('cdm2', Path('/Volumes/JB_Tier2Storage/CDM2-green'))]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--import-originals', action='store_true')
    args = parser.parse_args()
    seen = {}
    groups = defaultdict(list)
    inventory = {'ordering': 'Stable case-folded relative filename order; capture dates are incomplete.', 'collections': [], 'duplicates': [], 'formatMismatches': [], 'supportedExtensions': sorted(EXTENSIONS)}
    photos = []
    for collection, folder in COLLECTIONS:
        if not folder.is_dir() or not os.access(folder, os.R_OK | os.X_OK):
            raise RuntimeError(f'Source folder unavailable or unreadable: {folder}')
        files = sorted((p for p in folder.rglob('*') if p.is_file()), key=lambda p: (str(p.relative_to(folder)).casefold(), str(p.relative_to(folder))))
        record = {'collection': collection, 'folder': str(folder), 'readable': True, 'totalFiles': len(files), 'totalBytes': sum(p.stat().st_size for p in files), 'supportedByExtension': dict(Counter(p.suffix.lower() for p in files if p.suffix.lower() in EXTENSIONS)), 'unsupported': [], 'corruptOrUnreadable': [], 'images': []}
        for path in files:
            if path.suffix.lower() not in EXTENSIONS:
                record['unsupported'].append({'path': str(path), 'bytes': path.stat().st_size, 'reason': 'Unsupported non-image file extension.'})
                continue
            try:
                digest = hashlib.sha256(path.read_bytes()).hexdigest()
                with Image.open(path) as image:
                    raw_width, raw_height = image.size
                    detected = image.format
                    exif = image.getexif()
                    orientation = exif.get(274, 1)
                    capture = exif.get_ifd(34665).get(36867) or exif.get(306)
                    image.verify()
                with Image.open(path) as image:
                    image.load()
                    pixels = ImageOps.exif_transpose(image).convert('RGB')
                    pixel_digest = hashlib.sha256(str(pixels.size).encode() + pixels.tobytes()).hexdigest()
                width, height = (raw_height, raw_width) if orientation in (5, 6, 7, 8) else (raw_width, raw_height)
            except Exception as error:
                record['corruptOrUnreadable'].append({'path': str(path), 'reason': str(error)})
                continue
            item = {'sourcePath': str(path), 'relativePath': str(path.relative_to(folder)), 'sha256': digest, 'pixelSha256': pixel_digest, 'bytes': path.stat().st_size, 'width': width, 'height': height, 'rawWidth': raw_width, 'rawHeight': raw_height, 'orientation': orientation, 'detectedFormat': detected, 'captureDate': str(capture) if capture else None}
            groups[digest].append(str(path))
            if path.suffix.lower() == '.png' and detected != 'PNG':
                inventory['formatMismatches'].append({'path': str(path), 'reason': f'{detected} data under a PNG extension; readable and retained unchanged.'})
            if pixel_digest in seen:
                owner = seen[pixel_digest]
                kind = 'Exact file SHA-256 duplicate' if digest == owner['sha256'] else 'Identical orientation-normalized RGB pixels despite different file bytes'
                item.update({'included': False, 'retainedId': owner['id'], 'retainedSource': owner['sourcePath'], 'managedSource': owner['managedSource'], 'reason': kind + '; owner requires one occurrence across both galleries.'})
                inventory['duplicates'].append({'path': str(path), 'retainedPath': owner['sourcePath'], 'sha256': digest, 'pixelSha256': pixel_digest, 'reason': item['reason']})
            else:
                identifier = f'{collection}-{digest[:16]}'
                managed = f'src/assets/cdm-gallery/{collection}/{path.relative_to(folder)}'
                photo = {'id': identifier, 'collection': collection, 'order': 1 + sum(p['collection'] == collection for p in photos), 'sourcePath': str(path), 'sourceFilename': path.name, 'managedSource': managed, 'sha256': digest, 'pixelSha256': pixel_digest, 'bytes': item['bytes'], 'width': width, 'height': height, 'captureDate': item['captureDate'], 'altField': f'/cdm-gallery/{identifier.replace(chr(45), chr(95))}_alt'}
                seen[pixel_digest] = photo
                photos.append(photo)
                item.update({'included': True, 'id': identifier, 'managedSource': managed})
                if args.import_originals:
                    destination = ROOT / managed
                    destination.parent.mkdir(parents=True, exist_ok=True)
                    if destination.exists() and hashlib.sha256(destination.read_bytes()).hexdigest() != digest:
                        raise RuntimeError(f'Existing managed original differs: {destination}')
                    if not destination.exists():
                        shutil.copyfile(path, destination)
                    if hashlib.sha256(destination.read_bytes()).hexdigest() != digest:
                        raise RuntimeError(f'Copied original checksum differs: {destination}')
            record['images'].append(item)
        record['supportedCount'] = sum(record['supportedByExtension'].values())
        record['decodedCount'] = len(record['images'])
        record['includedCount'] = sum(i['included'] for i in record['images'])
        record['supportedBytes'] = sum(p.stat().st_size for p in files if p.suffix.lower() in EXTENSIONS)
        inventory['collections'].append(record)
    inventory['duplicateGroups'] = [paths for paths in groups.values() if len(paths) > 1]
    inventory['uniqueCount'] = len(photos)
    inventory['uniqueBytes'] = sum(p['bytes'] for p in photos)
    PROOF.mkdir(parents=True, exist_ok=True)
    (PROOF / 'source-inventory.json').write_text(json.dumps(inventory, indent=2) + '\n')
    if args.import_originals:
        target = ROOT / 'src/data/cdm-gallery-manifest.json'
        target.write_text(json.dumps({'schemaVersion': 1, 'ordering': inventory['ordering'], 'photos': photos}, indent=2) + '\n')
    print(json.dumps({'uniqueCount': len(photos), 'uniqueBytes': inventory['uniqueBytes'], 'duplicates': len(inventory['duplicates']), 'collections': [{key: row[key] for key in ['collection', 'readable', 'totalFiles', 'totalBytes', 'supportedByExtension', 'supportedCount', 'decodedCount', 'includedCount', 'unsupported', 'corruptOrUnreadable']} for row in inventory['collections']]}, indent=2), flush=True)


if __name__ == '__main__':
    main()
