import json,time,threading
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
out=Path('proof/2026-10-06_cdm_gallery_retry')
html=(out/'before.html').read_text().replace('<head>','<head><base href="https://0166b870.btf-production.pages.dev/">')
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory="dist",**kwargs)
 def log_message(self,*args):pass
 def do_GET(self):
  if self.path not in ['/before','/after']:return super().do_GET()
  content=html if self.path=='/before' else Path('dist/cdm-photo-gallery/index.html').read_text()
  payload=content.encode();marker=b'data-gallery-tile';split=payload.index(b'<li class="cdm-gallery__tile"');split=payload.index(b'</li>',split)+5
  for _ in range(9):split=payload.index(b'</li>',split)+5
  self.send_response(200);self.send_header('Content-Type','text/html');self.send_header('Content-Length',str(len(payload)));self.end_headers();self.wfile.write(payload[:split]);self.wfile.flush();time.sleep(1.5);self.wfile.write(payload[split:])
server=ThreadingHTTPServer(('127.0.0.1',4333),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
results=[]
with sync_playwright() as p:
 b=p.chromium.launch()
 for mode in ['before','after']:
  c=b.new_context(viewport={'width':1440,'height':900});page=c.new_page()
  page.add_init_script("""window.shifts=[];new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)shifts.push({value:e.value,time:e.startTime,sources:e.sources.map(s=>({tag:s.node?.tagName,class:s.node?.className,before:s.previousRect.toJSON(),after:s.currentRect.toJSON()}))})}).observe({type:'layout-shift',buffered:true});""")
  page.goto('http://127.0.0.1:4333/'+mode,wait_until='networkidle');page.wait_for_timeout(500)
  shifts=page.evaluate('shifts');results.append({'mode':mode,'cls':sum(s['value'] for s in shifts),'shifts':shifts});c.close()
 b.close()
server.shutdown();(out/'stream-layout.json').write_text(json.dumps(results,indent=2)+'\n');print(json.dumps(results,indent=2))
assert results[1]['cls']<.1
