# Browser checks for the built site (style guide v4.4). Serves dist/ locally, loads every route at 375/768/1024/1440 px
# in Chromium, and writes docs/proof/2026-10-03/browser_report.json plus screenshots. Run after npm run build.
import json, subprocess, sys, time, re, os
from playwright.sync_api import sync_playwright

ROUTES = ['/', '/tours/', '/about/', '/resources/', '/contact/', '/canal-des-deux-mers/',
          '/canal-des-deux-mers/practical-info/', '/privacy/', '/terms/', '/cookies/', '/404.html',
          '/cdm-photo-gallery/', '/cdm-photo-gallery/cdm1/', '/cdm-photo-gallery/cdm2/']
WIDTHS = [375, 768, 1024, 1440]
OUT = os.environ.get('BTF_BROWSER_PROOF_DIR', 'docs/proof/2026-10-03')
os.makedirs(OUT, exist_ok=True)
PROBE = os.environ.get('BTF_BROWSER_PROBE_PATH', os.path.join(OUT, 'hero-contrast-probe.png'))
SCALE = {0, 4, 8, 12, 16, 24, 32, 40, 48, 64}
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '4399', '-d', 'dist'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.5)

JS = r"""
() => {
  const r = {};
  const de = document.documentElement;
  r.overflowX = de.scrollWidth - de.clientWidth;
  r.landmarks = ['header','nav','main','footer'].map(t => document.querySelectorAll(t).length);
  r.h1 = document.querySelectorAll('h1').length;
  const lv = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => +h.tagName[1]);
  r.headingJumps = lv.filter((l, i) => i > 0 && l > lv[i-1] + 1).length;
  const hd = document.querySelector('.site-header__bar');
  r.headerH = document.querySelector('.site-header').getBoundingClientRect().height;
  r.headerBg = getComputedStyle(document.querySelector('.site-header')).backgroundColor;
  r.headerW = document.querySelector('.site-header').getBoundingClientRect().width;
  r.logoH = document.querySelector('.brand__logo').getBoundingClientRect().height;
  r.footerLogoH = document.querySelector('.site-footer__logo').getBoundingClientRect().height;
  r.footerBg = getComputedStyle(document.querySelector('.site-footer')).backgroundColor;
  r.imgNoAlt = [...document.images].filter(i => !(i.getAttribute('alt')||'').trim()).length;
  const vis = e => { const b = e.getBoundingClientRect(); const s = getComputedStyle(e); return b.width > 0 && b.height > 0 && s.visibility !== 'hidden'; };
  const inter = [...document.querySelectorAll('a, button, summary, audio')].filter(vis);
  r.interactive = inter.length;
  r.small = inter.filter(e => e.tagName !== 'AUDIO' && !(e.closest('p, li:not(.resource-list li)') && e.tagName==='A' && !e.classList.contains('btn') && !e.classList.contains('title') && !e.classList.contains('dl') && !e.classList.contains('footer-link') && !e.closest('nav') && e.closest('p')))
     .filter(e => { const b = e.getBoundingClientRect(); return b.height < 43.5 || b.width < 43.5; })
     .map(e => (e.className||e.tagName) + ':' + e.textContent.trim().slice(0,30) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height));
  const btns = [...document.querySelectorAll('.btn')].filter(vis);
  r.buttons = btns.map(b => { const s = getComputedStyle(b); return {t: b.textContent.trim(), h: Math.round(b.getBoundingClientRect().height), w: Math.round(b.getBoundingClientRect().width), radius: s.borderRadius, pad: s.padding, fw: s.fontWeight, fs: s.fontSize, cursor: s.cursor, bg: s.backgroundColor, href: b.getAttribute('href')}; });
  r.badHref = [...document.querySelectorAll('a')].filter(a => { const h = a.getAttribute('href'); return !h || h === '#'; }).length;
  // text sizes
  const sizes = {}; let tiny = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) { const n = walker.currentNode; if (!n.textContent.trim()) continue; const p = n.parentElement; if (!vis(p)) continue; const fs = parseFloat(getComputedStyle(p).fontSize); sizes[fs] = (sizes[fs]||0)+1; if (fs < 14) tiny.push(p.tagName+':'+n.textContent.trim().slice(0,25)+'@'+fs); }
  r.fontSizes = sizes; r.tinyText = tiny;
  r.fontFamily = [...new Set([...document.querySelectorAll('body, h1, h2, p, a, button, li')].map(e => getComputedStyle(e).fontFamily))];
  r.fontLoaded = document.fonts.check('16px Montserrat');
  // spacing scale (padding, gap; margins except auto-centered containers)
  const off = new Set();
  document.querySelectorAll('body *').forEach(e => { if (!vis(e)) return; const s = getComputedStyle(e);
    const props = ['paddingTop','paddingRight','paddingBottom','paddingLeft','rowGap','columnGap','marginTop','marginBottom'];
    if (!e.matches('.container, .band__inner')) props.push('marginLeft','marginRight');
    props.forEach(p => { const v = s[p]; if (v === 'normal' || v === 'auto') return; const n = parseFloat(v); if (!isNaN(n) && !SCALE.has(Math.round(n))) off.add(p + '=' + v + ' ' + (e.className||e.tagName).toString().slice(0,30)); }); });
  r.offScale = [...off].slice(0, 12);
  // line length
  r.longLines = [...document.querySelectorAll('main p, main li')].filter(e => vis(e) && !e.closest('.footer')).map(e => { const s = getComputedStyle(e); const cw = e.getBoundingClientRect().width; const chars = cw / (parseFloat(s.fontSize) * 0.55); return chars; }).filter(c => c > 85).length;
  r.robots = (document.querySelector('meta[name=robots]')||{}).content || null;
  r.framer = /framer/i.test(document.documentElement.outerHTML);
  return r;
}
"""
JS = JS.replace('const SCALE', 'const SCALE_')  # no-op safety
JS = JS.replace('SCALE.has', f'new Set({sorted(SCALE)}).has')

report = {}
fail = []
with sync_playwright() as p:
    b = p.chromium.launch()
    for w in WIDTHS:
        ctx = b.new_context(viewport={'width': w, 'height': 900})
        for route in ROUTES:
            page = ctx.new_page()
            errs = []
            page.on('pageerror', lambda e: errs.append(str(e)))
            page.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
            resp = page.goto(f'http://localhost:4399{route}', wait_until='networkidle')
            page.evaluate('document.fonts.ready')
            # open the mobile menu so its links are measured
            if w < 768:
                page.click('[data-nav-toggle]')
            r = page.evaluate(JS)
            r['errors'] = errs
            r['status'] = resp.status
            key = f'{w}{route}'
            report[key] = r
            exp_h = 56 if w < 768 else 64 if w < 1024 else 72
            probs = []
            if r['overflowX'] > 0: probs.append(f"horizontal overflow {r['overflowX']}")
            if r['landmarks'][0] < 1 or r['landmarks'][1] < 1 or r['landmarks'][2] != 1 or r['landmarks'][3] < 1: probs.append(f"landmarks {r['landmarks']}")
            if r['h1'] != 1: probs.append(f"h1 count {r['h1']}")
            if r['headingJumps']: probs.append('heading jump')
            if w >= 768 and abs(r['headerH'] - exp_h) > 0.5: probs.append(f"header height {r['headerH']} expected {exp_h}")
            if w < 768 and r['headerH'] < exp_h: probs.append(f"header height {r['headerH']}")
            if r['headerBg'] != 'rgb(45, 80, 22)' or r['footerBg'] != 'rgb(45, 80, 22)': probs.append('band color')
            if abs(r['headerW'] - w) > 1: probs.append('header not full width')
            if abs(r['logoH'] - (40 if w < 768 else 48)) > 0.5: probs.append(f"logo height {r['logoH']}")
            if abs(r['footerLogoH'] - 40) > 0.5: probs.append('footer logo height')
            if r['imgNoAlt']: probs.append('image without alt')
            if r['small']: probs.append('small targets ' + str(r['small'][:4]))
            if r['badHref']: probs.append('bad href')
            if r['tinyText']: probs.append('text under 14px ' + str(r['tinyText'][:4]))
            if r['offScale']: probs.append('off-scale spacing ' + str(r['offScale'][:4]))
            if r['framer']: probs.append('framer reference')
            if not r['fontLoaded']: probs.append('Montserrat not loaded')
            if r['errors']: probs.append('console errors ' + str(r['errors'][:2]))
            if (route == '/404.html') != (r['status'] == 404) and route == '/404.html' and r['status'] not in (200, 404): probs.append('404 status')
            for bt in r['buttons']:
                if bt['h'] < 44 or bt['w'] < 44: probs.append('button under 44 ' + bt['t'])
                if bt['cursor'] != 'pointer': probs.append('button cursor ' + bt['t'])
                if bt['radius'] != '6px' and bt['pad'] != '0px': probs.append('button radius ' + bt['t'])
                if bt['fw'] != '600' or bt['fs'] != '16px': probs.append('button type ' + bt['t'])
            if probs: fail.append((key, probs))
            page.evaluate("async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}window.scrollTo(0,0);}")
            page.wait_for_timeout(300)
            if route in ('/', '/resources/', '/404.html') or (route == '/about/' and w == 375):
                page.screenshot(path=f"{OUT}/shot_{w}_{route.strip('/').replace('/', '_') or 'home'}.png", full_page=True)
            page.close()
        ctx.close()

    # Interaction tests at 1440 on the home page: keyboard order, focus style, hover, active.
    ctx = b.new_context(viewport={'width': 1440, 'height': 900})
    page = ctx.new_page(); page.goto('http://localhost:4399/', wait_until='networkidle')
    total = page.evaluate("[...document.querySelectorAll('a[href], button, summary')].filter(e=>e.getBoundingClientRect().width>0).length")
    seen = []; focus_ok = True
    for i in range(total + 3):
        page.keyboard.press('Tab')
        info = page.evaluate("""() => { const e = document.activeElement; const s = getComputedStyle(e); return {tag: e.tagName, text: (e.textContent||'').trim().slice(0,20), href: e.getAttribute('href'), ow: s.outlineWidth, os: s.outlineStyle, oc: s.outlineColor, oo: s.outlineOffset}; }""")
        seen.append(info)
        if info['tag'] != 'BODY' and not (info['ow'] == '2px' and info['os'] == 'solid' and info['oc'] == 'rgb(45, 80, 22)' and float(info['oo'].replace('px','')) >= 2):
            focus_ok = False
    reached = len({json.dumps(s) + str(i) for i, s in enumerate(seen[:total]) if s['tag'] != 'BODY'})
    btn = page.locator('.hero .btn--primary').first
    def st(): return page.evaluate("""() => { const b = document.querySelector('.hero .btn--primary'); const s = getComputedStyle(b); return {bg: s.backgroundColor, tr: s.transform, sh: s.boxShadow}; }""")
    btn.scroll_into_view_if_needed(); before = st()
    btn.hover(); page.wait_for_timeout(400); hover = st()
    page.mouse.down(); page.wait_for_timeout(400); active = st(); page.mouse.up()
    contrast = {}
    from PIL import Image
    for w in (375, 768, 1024, 1440):
        pg = ctx.new_page(); pg.set_viewport_size({'width': w, 'height': 900}); pg.goto('http://localhost:4399/', wait_until='networkidle')
        boxes = pg.evaluate("[...document.querySelectorAll('.hero h1, .hero p')].map(e => { const r = e.getBoundingClientRect(); return [r.x, r.y + scrollY, r.width, r.height]; })")
        pg.add_style_tag(content='.hero h1,.hero p{color:transparent !important}')
        pg.screenshot(path=PROBE, full_page=True)
        im = Image.open(PROBE).convert('RGB')
        def lum(c):
            f = lambda v: (v/255)/12.92 if v/255 <= 0.03928 else (((v/255)+0.055)/1.055)**2.4
            return 0.2126*f(c[0]) + 0.7152*f(c[1]) + 0.0722*f(c[2])
        worst = 99
        for x, y, bw, bh in boxes:
            for yy in range(int(y), int(y+bh), 4):
                for xx in range(int(x), int(x+bw), 8):
                    if xx < im.width and yy < im.height:
                        worst = min(worst, 1.05/(lum(im.getpixel((xx, yy)))+0.05))
        contrast[w] = round(worst, 2)
        pg.close()
    inter = dict(hero_text_min_contrast=contrast, focusable=total, tab_reached_distinct=reached, focus_style_ok=focus_ok, before=before, hover=hover, active=active)
    page.keyboard.press('Tab')
    page.screenshot(path=f'{OUT}/shot_focus_1440_home.png')
    report['_interaction'] = inter
    b.close()
srv.terminate()
json.dump(report, open(f'{OUT}/browser_report.json', 'w'), indent=1)
print('failures:', len(fail))
for k, pr in fail: print(k, pr)
print(json.dumps(report['_interaction'], indent=1))
