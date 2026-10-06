import json,os
from pathlib import Path
from playwright.sync_api import sync_playwright
out=Path('proof/2026-10-06_cdm_gallery_retry');out.mkdir(parents=True,exist_ok=True)
results=[]
with sync_playwright() as p:
 b=p.chromium.launch()
 for delay in [0,1500,3000]:
  c=b.new_context(viewport={'width':1440,'height':900});page=c.new_page()
  if delay:
   def slow(route):
    response=route.fetch();page.wait_for_timeout(delay);route.fulfill(response=response)
   page.route('**/*.woff2',slow)
  page.add_init_script("""window.shifts=[];new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)shifts.push({value:e.value,time:e.startTime,sources:e.sources.map(s=>({tag:s.node?.tagName,class:s.node?.className,before:s.previousRect.toJSON(),after:s.currentRect.toJSON()}))})}).observe({type:'layout-shift',buffered:true});""")
  page.goto('https://0166b870.btf-production.pages.dev/cdm-photo-gallery/',wait_until='networkidle');page.wait_for_timeout(1000)
  results.append({'fontDelayMs':delay,'shifts':page.evaluate('shifts')});c.close()
 b.close()
(out/'layout-before.json').write_text(json.dumps(results,indent=2)+'\n');print(json.dumps(results,indent=2))
