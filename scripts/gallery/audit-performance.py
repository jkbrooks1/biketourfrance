"""Cold-load lab measurements for the combined gallery; not field Core Web Vitals."""
import json, statistics, os
from pathlib import Path
from playwright.sync_api import sync_playwright
out=Path(os.environ.get('BTF_GALLERY_AUDIT_DIR','docs/proof/2026-10-06_cdm_combined_gallery/audit'))
out.mkdir(parents=True,exist_ok=True)
report={'url':os.environ.get('BTF_GALLERY_AUDIT_URL','http://127.0.0.1:4322/cdm-photo-gallery/'),'conditions':{'viewport':'375x900','cpuSlowdown':4,'downloadKbps':1600,'uploadKbps':750,'latencyMs':150},'runs':[]}
with sync_playwright() as p:
 browser=p.chromium.launch()
 for run in range(3):
  context=browser.new_context(viewport={'width':375,'height':900})
  page=context.new_page();cdp=context.new_cdp_session(page)
  cdp.send('Network.enable');cdp.send('Network.setCacheDisabled',{'cacheDisabled':True})
  cdp.send('Network.emulateNetworkConditions',{'offline':False,'latency':150,'downloadThroughput':1600*1024/8,'uploadThroughput':750*1024/8})
  cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
  page.add_init_script("""window.audit={lcp:0,cls:0,longTasks:[]};new PerformanceObserver(l=>{for(const e of l.getEntries())window.audit.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.audit.cls+=e.value}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())window.audit.longTasks.push(e.duration)}).observe({type:'longtask',buffered:true});""")
  page.goto(report['url'],wait_until='networkidle',timeout=90000)
  page.wait_for_timeout(1000)
  metrics=page.evaluate("""()=>({...window.audit,paint:performance.getEntriesByType('paint').map(e=>({name:e.name,ms:e.startTime})),requests:performance.getEntriesByType('resource').map(e=>({url:e.name.split('/').at(-1),type:e.initiatorType,bytes:e.encodedBodySize,ms:e.duration})),firstImage:{loading:document.querySelector('[data-gallery-tile] img').loading,fetchPriority:document.querySelector('[data-gallery-tile] img').fetchPriority},loadedGalleryImages:[...document.querySelectorAll('[data-gallery-tile] img')].filter(i=>i.complete&&i.naturalWidth).length})""")
  page.locator('[data-gallery-open]').first.click();page.wait_for_function("document.querySelector('[data-gallery-media] img')?.complete && document.querySelector('[data-gallery-media] img')?.naturalWidth > 0")
  interaction=page.evaluate("""async()=>{const start=performance.now();document.querySelector('[data-gallery-next]').click();await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));return performance.now()-start;}""")
  metrics['nextButtonLabResponseMs']=interaction
  metrics['initialResourceBytes']=sum(r['bytes'] for r in metrics['requests'])
  metrics['javascriptBytes']=sum(r['bytes'] for r in metrics['requests'] if r['url'].endswith('.js'))
  report['runs'].append(metrics);context.close()
 browser.close()
report['medianLcpMs']=statistics.median(r['lcp'] for r in report['runs'])
report['maxCls']=max(r['cls'] for r in report['runs'])
report['note']='Three cold Chromium lab runs at the recorded URL. This does not establish field LCP, INP or CLS; actual visitor metrics remain unmeasured.'
(out/'performance.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='runs'},indent=2))
