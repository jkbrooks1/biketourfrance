"""Apply the owner's exact editorial order; retain all eligible rows and provenance."""
import json
from pathlib import Path
root = Path(__file__).resolve().parents[2]
read = lambda name: json.loads((root/name).read_text())
editorial = read('src/data/cdm-gallery-editorial.json')
selection = read('src/data/cdm-gallery-selection.json')
by_name = {p['sourceFilename']:p for p in selection['photos']}
names = [p['filename'] for p in editorial['photos']]
assert len(names)==47 and len(set(names))==47
assert set(names+editorial['deleteFilenames'])==set(by_name)
# Retain removed rows adjacent to the retained view in their original municipality.
names.insert(names.index('IMG_4471.JPG')+1, 'IMG_4470.JPG')
names.insert(names.index('IMG_4496.JPG')+1, 'IMG_4497.JPG')
selection['ordering'] = 'Owner-approved exact editorial order, geographic groups west to east; permanent capture-date IDs and original GPS/estimated-location evidence unchanged.'
selection['photos'] = [{**by_name[name], 'order':index+1} for index,name in enumerate(names)]
(root/'src/data/cdm-gallery-selection.json').write_text(json.dumps(selection,indent=2,ensure_ascii=False)+'\n')
print('Editorial order: 47 displayed positions, 49 preserved eligible review rows; no provenance changes.')
