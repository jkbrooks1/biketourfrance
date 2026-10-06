"""Read retained EXIF GPS and resolve nearby municipalities through IGN; no photo changes."""
import json, urllib.request, urllib.parse, concurrent.futures
from pathlib import Path
folder=Path('docs/proof/2026-10-06_cdm_combined_gallery/audit')
positions=json.loads((folder/'gps-availability.json').read_text())
def locate(photo):
 url='https://data.geopf.fr/geocodage/reverse?'+urllib.parse.urlencode({'lon':photo['lon'],'lat':photo['lat'],'index':'address','limit':1})
 try:
  with urllib.request.urlopen(url,timeout=30) as response:data=json.load(response)
  item=data['features'][0]['properties']
  return {**photo,'city':item['city'],'postcode':item['postcode'],'distanceMetres':item['distance'],'sourceUrl':url,'basis':'Inference from retained EXIF GPS and nearest IGN/BAN municipality; not confirmation of the photographed landmark or trip phase.'}
 except Exception as e:
  alternate='https://geo.api.gouv.fr/communes?'+urllib.parse.urlencode({'lat':photo['lat'],'lon':photo['lon'],'fields':'nom,code','format':'json'})
  try:
   with urllib.request.urlopen(alternate,timeout=30) as response:communes=json.load(response)
   if len(communes)!=1:raise ValueError('No unique containing municipality')
   return {**photo,'city':communes[0]['nom'],'citycode':communes[0]['code'],'sourceUrl':alternate,'basis':'Retained EXIF GPS and containing municipality from French administrative-boundary API; not proof of a landmark or trip phase.'}
  except Exception as error:return {**photo,'error':str(error),'sourceUrl':alternate}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(locate,positions))
(folder/'locations.json').write_text(json.dumps(results,indent=2)+'\n')
for photo in results:print(photo['filename'],photo.get('city',photo.get('error')),photo.get('distanceMetres'))
