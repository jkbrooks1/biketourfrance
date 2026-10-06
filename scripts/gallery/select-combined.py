"""Read-only photo inspection; write the exact eligible set, never alter mounted photos.
Every selected image must already have a byte-identical managed original and stable ID.
"""
import hashlib, json, os
from collections import Counter
from pathlib import Path
from PIL import Image, ImageOps
from location_order import apply_location_groups

root = Path(__file__).resolve().parents[2]
folder = Path('/Volumes/JB_Tier2Storage/CDM1and2')
extensions = {'.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.tif', '.tiff', '.heic', '.heif', '.bmp'}
library = json.loads((root / 'src/data/cdm-gallery-manifest.json').read_text())['photos']
registry = {p['id']: p for p in json.loads((root / 'src/data/cdm-photo-id-registry.json').read_text())['photos']}
by_hash = {p['sha256']: p for p in library}
assert folder.is_dir() and os.access(folder, os.R_OK | os.X_OK), 'Source folder unreadable'
files = sorted((p for p in folder.rglob('*') if p.is_file()), key=lambda p: (str(p.relative_to(folder)).casefold(), str(p)))
inventory = dict(folder=str(folder), readable=True, totalFiles=len(files), totalBytes=sum(p.stat().st_size for p in files), supportedByExtension=dict(Counter(p.suffix.lower() for p in files if p.suffix.lower() in extensions)), unsupported=[], corruptOrUnreadable=[], duplicates=[], photos=[])
seen = {}
for path in files:
    if path.suffix.lower() not in extensions:
        inventory['unsupported'].append(dict(path=str(path), bytes=path.stat().st_size, reason='Unsupported non-image file extension.'))
        continue
    try:
        sha = hashlib.sha256(path.read_bytes()).hexdigest()
        with Image.open(path) as image: image.verify()
        with Image.open(path) as image:
            image.load()
            capture = image.getexif().get_ifd(34665).get(36867)
            pixels = ImageOps.exif_transpose(image).convert('RGB')
            width, height = pixels.size
            pixel_sha = hashlib.sha256(str(pixels.size).encode() + pixels.tobytes()).hexdigest()
    except Exception as error:
        inventory['corruptOrUnreadable'].append(dict(path=str(path), reason=str(error)))
        continue
    if pixel_sha in seen:
        inventory['duplicates'].append(dict(path=str(path), retainedPath=seen[pixel_sha], reason='Identical orientation-normalized RGB pixels.'))
        continue
    seen[pixel_sha] = str(path)
    photo = by_hash.get(sha)
    if not photo: raise RuntimeError(f'Photo needs managed import and approved description before selection: {path}')
    if hashlib.sha256((root / photo['managedSource']).read_bytes()).hexdigest() != sha: raise RuntimeError(f'Managed source differs: {path}')
    inventory['photos'].append(dict(id=photo['id'], sourcePath=str(path), sourceFilename=path.name, sha256=sha, pixelSha256=pixel_sha, bytes=path.stat().st_size, width=width, height=height, captureDate=capture, photoId=registry[photo['id']]['photoId'], estimated=registry[photo['id']]['estimated']))
inventory['supportedCount'] = sum(inventory['supportedByExtension'].values())
inventory['uniqueCount'] = len(inventory['photos'])
inventory['uniqueBytes'] = sum(p['bytes'] for p in inventory['photos'])
proof = root / 'docs/proof/2026-10-06_cdm_combined_gallery'
proof.mkdir(parents=True, exist_ok=True)
(proof / 'source-inventory.json').write_text(json.dumps(inventory, indent=2) + '\n')
if inventory['corruptOrUnreadable']: raise RuntimeError('Unreadable source photos require explicit resolution; inventory saved')
ordered = sorted(inventory['photos'], key=lambda p: (p['photoId'][:10], p['sourceFilename'].casefold(), p['sourceFilename']))
locations_file = root / 'src/data/cdm-gallery-locations.json'
locations = json.loads(locations_file.read_text()) if locations_file.exists() else None
if locations: ordered = apply_location_groups(ordered, locations)
ids = {p['id'] for p in ordered}
selection = dict(schemaVersion=1, sourceFolder=str(folder), ordering='Capture date (EXIF or explicitly marked estimate), then permanent daily counter; estimates remain estimates.', photos=[dict(id=p['id'], sourcePath=p['sourcePath'], sourceFilename=p['sourceFilename'], sha256=p['sha256'], pixelSha256=p['pixelSha256'], order=i+1) for i,p in enumerate(ordered)], excluded=[dict(id=p['id'], sourceFilename=p['sourceFilename'], managedSource=p['managedSource'], reason='Absent from the owner-selected CDM1and2 folder; retained for recovery.') for p in library if p['id'] not in ids])
if locations:
    selection['ordering'] = locations['method']
    for entry, photo in zip(selection['photos'], ordered): entry['locationGroup'] = photo['locationGroup']
(root / 'src/data/cdm-gallery-selection.json').write_text(json.dumps(selection, indent=2) + '\n')
print(json.dumps({k:v for k,v in inventory.items() if k != 'photos'}, indent=2))
