"""Generate reviewable groups from retained GPS and explicitly authorized estimates.
No mounted photo edits and no network dependency during builds.
"""
import json,unicodedata,re
from collections import defaultdict
from pathlib import Path
from location_order import apply_location_groups
root=Path(__file__).resolve().parents[2]
read=lambda f:json.loads((root/f).read_text())
selection=read('src/data/cdm-gallery-selection.json')
source={p['id']:p for p in read('docs/proof/2026-10-06_cdm_combined_gallery/source-inventory.json')['photos']}
resolved={p['filename']:p for p in read('docs/proof/2026-10-06_cdm_combined_gallery/audit/locations.json')}
estimates={
 'IMG_6115.jpeg':('La Réole','High','Suspension-bridge scene matches the GPS-located bridge in IMG_4416.JPG; nearby series date.'),
 'IMG_6117.jpeg':('La Réole','Low','Same early riding series as IMG_6115.jpeg and IMG_4416.JPG; church/fountain appearance. Approximate stop, not recovered GPS.'),
 'IMG_6125.jpeg':('Moissac','High','Aqueduct riding scene matches IMG_4462.JPG and the Cacor route context; exact source GPS is absent.'),
 'IMG_6143.jpeg':('Moissac','High','Circular openings and brick/stone aqueduct match Cacor architecture and IMG_6146.jpeg; comparison with the official Cacor page image.'),
 'IMG_6146.jpeg':('Moissac','High','Brick/stone arches and circular openings match the official Cacor aqueduct image; source GPS is absent.'),
 'IMG_6155.jpeg':('Moissac','Low','Nearby bridge-riding series with IMG_6143.jpeg/IMG_6146.jpeg/IMG_6175.jpeg; rough area assignment, no source GPS.'),
 'IMG_6158.jpeg':('Moissac','Low','Same under-bridge view as IMG_6155.jpeg; approximate area assignment, no source GPS.'),
 'IMG_6175.jpeg':('Moissac','Medium','Brick parapet and tree-lined canal match the surrounding aqueduct/bridge series; approximate Cacor/Moissac context.'),
 'IMG_4600.JPG':('Béziers','Low','Capture date 2026-09-07 and sequence between GPS-located IMG_4596.JPG in Béziers and IMG_4606.JPG in Sète; restaurant location not independently identified.'),
 '9f4a9960-26b2-4d36-a8a3-4db68d666749_A4F2DBC7-C58D-460E-A289-3894F082CA8E.jpg':('Créon','Low','Early CDM2 source series and existing estimated date near Créon bike-stop photos IMG_4633.JPG/IMG_4634.JPG; rough route-area assignment.')}
slug=lambda name:re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',name).encode('ascii','ignore').decode().lower()).strip('-')
assignments=[];points=defaultdict(list)
for selected in selection['photos']:
 photo=source[selected['id']];filename=photo['sourceFilename']
 if filename in resolved:
  location=resolved[filename]
  if 'city' not in location:raise ValueError('Unresolved retained GPS: '+filename)
  name=location['city'];basis='GPS';confidence='GPS municipality';evidence=location['basis'];coords={'latitude':location['lat'],'longitude':location['lon']};url=location['sourceUrl'];points[name].append(location['lon'])
 else:
  if filename not in estimates:raise ValueError('Missing owner-authorized location estimate: '+filename)
  name,confidence,evidence=estimates[filename];basis='Estimated';coords=None;url='https://www.tourisme-tarnetgaronne.fr/moissac-terres-des-confluences/incontournables/le-pont-canal-du-cacor/' if filename in ['IMG_6143.jpeg','IMG_6146.jpeg'] else None
 assignments.append({'id':photo['id'],'filename':filename,'groupId':slug(name),'locationName':name,'basis':basis,'estimated':basis=='Estimated','confidence':confidence,'evidence':evidence,'coordinates':coords,'sourceUrl':url})
names={a['locationName'] for a in assignments}
if not names<=points.keys():raise ValueError('Estimated group has no GPS anchor')
orderedNames=sorted(names,key=lambda name:(sum(points[name])/len(points[name]),name))
groups=[{'id':slug(name),'name':name,'order':i+1,'longitude':sum(points[name])/len(points[name]),'photoCount':sum(a['locationName']==name for a in assignments)} for i,name in enumerate(orderedNames)]
locations={'schemaVersion':1,'method':'Group both completed tours by GPS municipality, west to east using mean anchor longitude; ten owner-authorized approximate locations retain their evidence/confidence. Date/counter order within each group. No estimated coordinates are invented.','groups':groups,'photos':assignments}
(root/'src/data/cdm-gallery-locations.json').write_text(json.dumps(locations,indent=2,ensure_ascii=False)+'\n')
ordered=apply_location_groups(list(source.values()),locations)
selection['ordering']=locations['method']
selection['photos']=[{k:p[k] for k in ['id','sourcePath','sourceFilename','sha256','pixelSha256','locationGroup']}|{'order':i+1} for i,p in enumerate(ordered)]
(root/'src/data/cdm-gallery-selection.json').write_text(json.dumps(selection,indent=2,ensure_ascii=False)+'\n')
print('GPS grouping PASS:',len(ordered),'photos,',len(groups),'groups,',sum(a['basis']=='GPS' for a in assignments),'GPS-based,',len(estimates),'explicit estimates; IDs unchanged.')
for g in groups:print(g['name'],g['photoCount'])
