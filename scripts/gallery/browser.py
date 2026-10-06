"""Focused local browser QA; uses the existing Playwright installation as a browser fallback."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / os.environ.get('BTF_GALLERY_PROOF_DIR', 'docs/proof/2026-10-05_cdm_photo_gallery')
OUT.mkdir(parents=True, exist_ok=True)
BASE = os.environ.get('BTF_GALLERY_PREVIEW_URL', 'http://127.0.0.1:4321')
WIDTHS = [320, 375, 768, 1024, 1440, 1920]
ROUTES = ['/cdm-photo-gallery/', '/cdm-photo-gallery/cdm1/', '/cdm-photo-gallery/cdm2/']
report = {'pages': [], 'lightboxes': [], 'failures': []}


def check(condition, label):
    if not condition:
        report['failures'].append(label)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch()
    for width in WIDTHS:
        context = browser.new_context(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
        for route in ROUTES:
            page = context.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.add_init_script('''window.galleryCLS=0; new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.galleryCLS += entry.value; }).observe({type:'layout-shift', buffered:true});''')
            response = page.goto(BASE + route, wait_until='networkidle')
            page.evaluate('document.fonts.ready')
            metrics = page.evaluate('''() => {
              const list=document.querySelector('[data-gallery-tiles]');
              const tiles=[...document.querySelectorAll('[data-gallery-tile]')];
              const rects=tiles.map(tile=>{const r=tile.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};});
              const images=tiles.map(tile=>tile.querySelector('img'));
              let overlaps=0;for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){const a=rects[i],b=rects[j];if(a.x<b.x+b.width-1&&a.x+a.width>b.x+1&&a.y<b.y+b.height-1&&a.y+a.height>b.y+1)overlaps++;}
              const visible=images.filter(img=>img.getBoundingClientRect().top<innerHeight && img.getBoundingClientRect().bottom>0);
              const ratios=rects.map(r=>r.width/list.clientWidth);
              return {overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,h1:document.querySelectorAll('h1').length,tiles:tiles.length,ids:tiles.map(t=>t.dataset.photoId),overlaps,widths:rects.map(r=>Math.round(r.width)),minWidthFraction:ratios.length?Math.min(...ratios):null,maxWidthFraction:ratios.length?Math.max(...ratios):null,distinctWidths:new Set(rects.map(r=>Math.round(r.width))).size,sourceOrderPreserved:rects.every((r,i)=>!i||r.y>=rects[i-1].y-.5),lazyImages:images.filter(i=>i.loading==='lazy').length,initialLoadedImages:images.filter(i=>i.complete&&i.naturalWidth>0).length,initialVisibleImages:visible.length,dimensionsReserved:images.every(i=>i.width>0&&i.height>0&&i.style.aspectRatio),altMissing:images.filter(i=>!i.alt.trim()).length,masonryReady:list?.dataset.masonryReady,cls:window.galleryCLS,headerColor:getComputedStyle(document.querySelector('.site-header')).backgroundColor,font:getComputedStyle(document.body).fontFamily,footerLastExploreLink:[...document.querySelectorAll('.site-footer__grid nav:first-of-type a')].at(-1)?.getAttribute('href'),contrastColors:{foreground:getComputedStyle(document.querySelector('h1')).color,background:getComputedStyle(document.body).backgroundColor}};
            }''')
            check(response.status == 200, f'{width}{route}: route status')
            check(metrics['overflow'] <= 0, f'{width}{route}: horizontal overflow')
            check(metrics['h1'] == 1, f'{width}{route}: h1')
            check(metrics['overlaps'] == 0, f'{width}{route}: overlapping tiles')
            check(metrics['sourceOrderPreserved'], f'{width}{route}: visual source order')
            check(metrics['altMissing'] == 0, f'{width}{route}: alt text')
            check(metrics['dimensionsReserved'], f'{width}{route}: dimension reservation')
            check(metrics['cls'] < 0.1, f'{width}{route}: CLS {metrics["cls"]}')
            check(metrics['footerLastExploreLink'] == '/cdm-photo-gallery/', f'{width}{route}: final footer entry')
            check(not errors, f'{width}{route}: browser errors {errors}')
            if metrics['tiles']:
                check(metrics['masonryReady'] == 'true', f'{width}{route}: masonry initialization')
                check(metrics['lazyImages'] == metrics['tiles'], f'{width}{route}: lazy loading')
                if width >= 1024:
                    check(0.18 <= metrics['minWidthFraction'] <= 0.26, f'{width}{route}: minimum desktop size')
                    check(0.28 <= metrics['maxWidthFraction'] <= 0.34, f'{width}{route}: maximum desktop size')
                    check(metrics['distinctWidths'] >= 4, f'{width}{route}: width variety')
                # Native lazy-loading distance is browser-dependent; record actual initial loads.
                # The controlled far-below-viewport check below verifies deferral and activation.
                page.evaluate('''async()=>{for(let y=0;y<document.body.scrollHeight;y+=650){window.scrollTo(0,y);await new Promise(resolve=>setTimeout(resolve,100));}}''')
                page.wait_for_load_state('networkidle')
                broken = page.evaluate("[...document.querySelectorAll('[data-gallery-tile] img')].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src)")
                check(not broken, f'{width}{route}: broken images {broken}')
                metrics['brokenImagesAfterScroll'] = broken
            page.evaluate('window.scrollTo(0,0)')
            page.screenshot(path=str(OUT / f'{route.strip("/").replace("/","-")}-{width}.png'), full_page=True)
            report['pages'].append({'width': width, 'route': route, 'status': response.status, 'metrics': metrics, 'errors': errors})
            page.close()
        context.close()

    context = browser.new_context(viewport={'width': 1440, 'height': 900}, has_touch=True)
    for collection in ['cdm1', 'cdm2']:
        page = context.new_page()
        page.goto(BASE + '/cdm-photo-gallery/' + collection + '/', wait_until='networkidle')
        link = page.locator('[data-gallery-open]').first
        # Keyboard activation and focus confinement.
        link.focus()
        page.keyboard.press('Enter')
        check(page.locator('dialog').evaluate('(d)=>d.open'), collection + ': keyboard open')
        check(page.locator('[data-gallery-close]').evaluate('(b)=>b===document.activeElement'), collection + ': initial close focus')
        original_alt = page.locator('[data-gallery-media] img').get_attribute('alt')
        page.keyboard.press('ArrowRight')
        check(page.locator('[data-gallery-position]').inner_text().startswith('2 /'), collection + ': arrow next')
        page.keyboard.press('ArrowLeft')
        check(page.locator('[data-gallery-media] img').get_attribute('alt') == original_alt, collection + ': arrow previous')
        page.keyboard.press('ArrowLeft')
        total = page.locator('[data-gallery-open]').count()
        check(page.locator('[data-gallery-position]').inner_text() == f'{total} / {total}', collection + ': previous wrap')
        page.locator('[data-gallery-next]').click()
        check(page.locator('[data-gallery-position]').inner_text() == f'1 / {total}', collection + ': next button wrap')
        page.locator('[data-gallery-previous]').click()
        check(page.locator('[data-gallery-position]').inner_text() == f'{total} / {total}', collection + ': previous button')
        page.locator('[data-gallery-close]').focus()
        page.keyboard.press('Shift+Tab')
        check(page.locator('[data-gallery-next]').evaluate('(b)=>b===document.activeElement'), collection + ': reverse focus trap')
        page.keyboard.press('Tab')
        check(page.locator('[data-gallery-close]').evaluate('(b)=>b===document.activeElement'), collection + ': forward focus trap')
        focus = page.locator('[data-gallery-close]').evaluate('(b)=>({outline:getComputedStyle(b).outlineStyle,width:getComputedStyle(b).outlineWidth})')
        check(focus['outline'] == 'solid' and focus['width'] == '2px', collection + ': visible focus')
        page.wait_for_load_state('networkidle')
        page.screenshot(path=str(OUT / f'{collection}-lightbox-desktop.png'))
        page.keyboard.press('Escape')
        check(not page.locator('dialog').evaluate('(d)=>d.open'), collection + ': Escape closes')
        check(link.evaluate('(a)=>a===document.activeElement'), collection + ': focus returns to opener')
        check(page.evaluate("document.body.style.overflow") != 'hidden', collection + ': scroll restored')
        link.click()
        page.locator('[data-gallery-close]').click()
        check(link.evaluate('(a)=>a===document.activeElement'), collection + ': close button restores focus')
        # Resize an existing page and exercise touch at phone dimensions.
        page.set_viewport_size({'width': 320, 'height': 740})
        page.wait_for_timeout(100)
        link.tap()
        page.wait_for_load_state('networkidle')
        check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'), collection + ': mobile lightbox overflow')
        targets = page.locator('dialog button').evaluate_all('(buttons)=>buttons.map(b=>{const r=b.getBoundingClientRect();return {width:r.width,height:r.height};})')
        check(all(b['width'] >= 44 and b['height'] >= 44 for b in targets), collection + ': touch targets')
        page.screenshot(path=str(OUT / f'{collection}-lightbox-mobile.png'))
        page.keyboard.press('Escape')
        report['lightboxes'].append({'collection': collection, 'keyboardNextPreviousEscape': True, 'focusReturn': True, 'nativeModalAndFocusTrap': True, 'focusStyle': focus, 'mobileTargets': targets})
        page.close()
    context.close()
    # Verify native lazy loading separately from Chromium's generous near-viewport preload distance.
    # Move the unchanged gallery HTML far below the viewport in this test only.
    context = browser.new_context(viewport={'width':375,'height':900})
    page = context.new_page()
    path = BASE + '/cdm-photo-gallery/cdm1/'
    html = page.request.get(path).text().replace('<div class="cdm-gallery-area">', '<div class="cdm-gallery-area" style="margin-top:10000px">')
    page.route(path, lambda route: route.fulfill(status=200, content_type='text/html', body=html))
    page.goto(path, wait_until='networkidle')
    deferred = page.locator('[data-gallery-tile] img').evaluate_all('(images)=>images.filter(i=>i.complete&&i.naturalWidth>0).length')
    check(deferred == 0, 'Native lazy loading defers photos 10000px below viewport')
    page.locator('[data-gallery-open]').first.scroll_into_view_if_needed()
    page.wait_for_function("document.querySelector('[data-gallery-tile] img').complete && document.querySelector('[data-gallery-tile] img').naturalWidth > 0")
    activated = page.locator('[data-gallery-tile] img').first.evaluate('(img)=>img.complete&&img.naturalWidth>0')
    check(activated, 'Native lazy photo loads after entering viewport')
    report['lazyLoadingBehavior'] = {'testOnlyOffsetPixels':10000,'loadedBeforeScroll':deferred,'firstImageLoadedAfterScroll':activated}
    context.close()
    # Without JS every image still links to a working optimized detail image.
    context = browser.new_context(java_script_enabled=False, viewport={'width':375,'height':900})
    page = context.new_page()
    page.goto(BASE + '/cdm-photo-gallery/cdm1/', wait_until='networkidle')
    fallback = page.locator('[data-gallery-open]').first.get_attribute('href')
    check(page.request.get(BASE + fallback).status == 200, 'No-JS detail link')
    check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'), 'No-JS mobile overflow')
    context.close()
    browser.close()

OUT.mkdir(parents=True, exist_ok=True)
(OUT / 'gallery-browser-verification.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({'pages':len(report['pages']), 'lightboxCollections':len(report['lightboxes']), 'failures':report['failures']}, indent=2))
raise SystemExit(bool(report['failures']))
