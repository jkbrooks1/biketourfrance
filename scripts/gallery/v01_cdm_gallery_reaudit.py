"""Verify only the owner-approved CDM release; local or served URLs, no writes to site."""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/os.environ.get('BTF_GALLERY_PROOF_DIR','proof/2026-10-06_cdm_gallery_publish/local')
OUT.mkdir(parents=True,exist_ok=True)
BASE=os.environ.get('BTF_GALLERY_PREVIEW_URL','http://127.0.0.1:4322').rstrip('/')
expected=json.loads((ROOT/'src/data/cdm-gallery-editorial.json').read_text())
library=json.loads((ROOT/'src/data/cdm-gallery-manifest.json').read_text())['photos']
ids=[next(p['id'] for p in library if p['sourceFilename']==x['filename']) for x in expected['photos']]
report={'url':BASE+'/cdm-photo-gallery/','failures':[],'pages':[],'images':[]}
def check(value,label):
    if not value:report['failures'].append(label)
with sync_playwright() as p:
 browser=p.chromium.launch()
 context=browser.new_context(viewport={'width':1440,'height':900})
 page=context.new_page()
 response=page.goto(report['url'],wait_until='networkidle',timeout=90000)
 check(response.status==200,'Gallery HTTP200')
 check(page.locator('h1').inner_text()==expected['page']['heading'],'Exact H1')
 check(page.locator('.cdm-gallery-header .lede').inner_text()==expected['page']['intro'],'Exact intro')
 check(page.locator('meta[name="description"]').get_attribute('content')==expected['page']['description'],'Exact meta description')
 check(page.title()==expected['page']['heading']+' | BikeTourFrance.net','Title and existing suffix')
 check(page.locator('.cdm-gallery-header').inner_text().strip().endswith('47 photos'),'Visible count47')
 check(page.locator('[data-gallery-cta] .lede').inner_text()==expected['page']['cta'],'Future CTA exact text')
 check(page.locator('[data-gallery-cta] a').get_attribute('href')==expected['page']['ctaHref'],'Waitlist target')
 check(page.request.get(BASE+expected['page']['ctaHref']).status==200,'Waitlist route HTTP200')
 check(page.evaluate("document.querySelector('[data-gallery-cta]').compareDocumentPosition(document.querySelector('footer')) & Node.DOCUMENT_POSITION_FOLLOWING"),'CTA before footer')
 check(page.evaluate("document.querySelector('[data-gallery-tiles]').compareDocumentPosition(document.querySelector('[data-gallery-cta]')) & Node.DOCUMENT_POSITION_FOLLOWING"),'CTA after all photos')
 tiles=page.locator('[data-gallery-tile]')
 check(tiles.evaluate_all('(ts)=>ts.map(t=>t.dataset.photoId)')==ids,'Exact47 order')
 check(tiles.locator('img').evaluate_all('(is)=>is.map(i=>i.alt)')==[x['alt'] for x in expected['photos']],'All47 alts verbatim')
 check(tiles.locator('img').first.get_attribute('loading')=='eager','Lead eager')
 check(tiles.locator('img').first.get_attribute('fetchpriority')=='high','Lead high priority')
 check(tiles.locator('img').evaluate_all('(is)=>is.slice(1).every(i=>i.loading==="lazy")'),'Other46 lazy including4633')
 widths=tiles.evaluate_all('(ts)=>ts.map(t=>t.getBoundingClientRect().width)')
 lead_fraction=page.locator('[data-gallery-tile]').first.evaluate('(t)=>t.getBoundingClientRect().width/t.parentElement.clientWidth')
 check(.30<=lead_fraction<=1/3,'Lead large at most1/3 desktop')
 check(widths[0]>=max(widths)-1,'Lead among largest tiles')
 check(page.locator('[data-photo-caption]').count()==0,'Captions remain blank')
 payload=page.request.get(BASE+'/cdm-photo-gallery/manifest.json').json()
 check([x['sourceFilename'] for x in payload['photos']]==[x['filename'] for x in expected['photos']],'Served manifest47 exact order')
 for photo in payload['photos']:
  check(photo['caption']=='','No caption '+photo['sourceFilename'])
  if photo['sourceFilename']==expected['crop']['filename']:
   check(photo['crop']==expected['crop'],'Recorded crop parameters')
   check((photo['width'],photo['height'])==(3024,3620),'Cropped displayed dimensions')
   image=page.request.get(BASE+photo['detail']['path'])
   (OUT/'IMG_4528-cropped.webp').write_bytes(image.body())
  else:check(photo.get('crop') is None,'No other pixel crop '+photo['sourceFilename'])
  for image in [*photo['variants'],photo['detail']]:
   response=page.request.get(BASE+image['path'],timeout=60000)
   size=len(response.body())
   check(response.status==200,'Image HTTP200 '+image['path'])
   check(0<size<=300*1024,'Derivative budget '+image['path'])
   report['images'].append({'path':image['path'],'status':response.status,'bytes':size})
 for width in [320,375,768,1024,1440,1920]:
  page.set_viewport_size({'width':width,'height':900});page.wait_for_timeout(200)
  order=tiles.evaluate_all('(ts)=>ts.map(t=>t.dataset.photoId)')
  check(order==ids,f'{width}:47 order')
  check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'{width}:no overflow')
  page.screenshot(path=str(OUT/f'editorial-{width}.png'))
  report['pages'].append({'width':width,'photos':len(order),'leadWidthFraction':page.locator('[data-gallery-tile]').first.evaluate('(t)=>t.getBoundingClientRect().width/t.parentElement.clientWidth')})
 page.locator('[data-gallery-cta]').scroll_into_view_if_needed();page.screenshot(path=str(OUT/'future-cta.png'))
 context.close();browser.close()
(OUT/'editorial-reaudit.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'url':report['url'],'viewports':len(report['pages']),'variants':len(report['images']),'failures':report['failures']},indent=2))
raise SystemExit(bool(report['failures']))
