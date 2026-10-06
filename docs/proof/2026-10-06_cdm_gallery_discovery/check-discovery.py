"""Verify gallery discovery, both on-page collections, navigation and modal accessibility."""
import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = sys.argv[1].rstrip('/')
OUT = Path(__file__).resolve().parent / ('live' if BASE.startswith('https:') else 'local')
OUT.mkdir(parents=True, exist_ok=True)
report = {'base': BASE, 'views': [], 'lightboxes': [], 'failures': []}

def check(ok, message):
    if not ok:
        report['failures'].append(message)

with sync_playwright() as pw:
    browser = pw.chromium.launch()
    for width in [320, 375, 768, 1024, 1440, 1920]:
        page = browser.new_page(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(BASE + '/', wait_until='networkidle')
        hero = page.locator('.hero a[href="/cdm-photo-gallery/"]')
        check(hero.count() == 1 and hero.is_visible(), f'{width}: visible hero gallery link')
        check(hero.evaluate('(e)=>e.getBoundingClientRect().bottom<=innerHeight'), f'{width}: gallery link above fold')
        nav = page.locator('#site-nav a[href="/cdm-photo-gallery/"]')
        if page.locator('[data-nav-toggle]').is_visible():
            page.locator('[data-nav-toggle]').click()
        check(nav.is_visible(), f'{width}: gallery main navigation')
        page.screenshot(path=str(OUT / f'home-{width}.png'), full_page=False)
        nav.click()
        page.wait_for_url(BASE + '/cdm-photo-gallery/')
        page.wait_for_load_state('networkidle')
        metrics = page.evaluate('''() => {
          const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
          const tiles=[...document.querySelectorAll('[data-gallery-tile]')];
          return {overflow:document.documentElement.scrollWidth-innerWidth,
            headerHeight:document.querySelector('header').getBoundingClientRect().height,
            h1:document.querySelectorAll('h1').length, duplicateIds:ids.filter((id,i)=>ids.indexOf(id)!==i),
            uniquePhotos:new Set(tiles.map(t=>t.dataset.photoId)).size,
            counts:[...document.querySelectorAll('[data-cdm-gallery]')].map(g=>g.querySelectorAll('[data-gallery-tile]').length),
            missingAriaTargets:[...document.querySelectorAll('[aria-describedby],[aria-labelledby]')].flatMap(e=>[e.getAttribute('aria-describedby'),e.getAttribute('aria-labelledby')].filter(Boolean).flatMap(s=>s.split(' '))).filter(id=>!document.getElementById(id)),
            missingAlt:tiles.filter(t=>!t.querySelector('img').alt.trim()).length,
            lazy:tiles.every(t=>t.querySelector('img').loading==='lazy'),
            dimensions:tiles.every(t=>t.querySelector('img').width>0&&t.querySelector('img').height>0),
            activeNav:document.querySelector('#site-nav [aria-current="page"]')?.getAttribute('href')};
        }''')
        check(metrics['overflow'] <= 0, f'{width}: horizontal overflow')
        if width >= 768:
            check(metrics['headerHeight'] == (64 if width < 1024 else 72), f'{width}: existing header height')
        check(metrics['counts'] == [40, 21] and metrics['uniquePhotos'] == 61, f'{width}: unique manifest counts')
        check(metrics['h1'] == 1 and not metrics['duplicateIds'] and not metrics['missingAriaTargets'], f'{width}: heading/ARIA IDs')
        check(metrics['missingAlt'] == 0 and metrics['lazy'] and metrics['dimensions'], f'{width}: alt/lazy/dimensions')
        check(metrics['activeNav'] == '/cdm-photo-gallery/', f'{width}: current navigation')
        check(not errors, f'{width}: page errors {errors}')
        page.screenshot(path=str(OUT / f'gallery-{width}.png'), full_page=False)
        report['views'].append({'width': width, **metrics})
        if width in [375, 1440]:
            for collection in ['cdm1', 'cdm2']:
                gallery = page.locator(f'#{collection} [data-cdm-gallery]')
                opener = gallery.locator('[data-gallery-open]').first
                opener.click()
                dialog = gallery.locator('dialog')
                check(dialog.is_visible(), f'{width} {collection}: modal opens')
                check(dialog.locator('[data-gallery-close]').evaluate('(e)=>e===document.activeElement'), f'{width} {collection}: initial focus')
                page.keyboard.press('Shift+Tab')
                check(dialog.locator('[data-gallery-next]').evaluate('(e)=>e===document.activeElement'), f'{width} {collection}: focus trap')
                page.keyboard.press('ArrowRight')
                check(dialog.locator('[data-gallery-position]').inner_text().startswith('2 /'), f'{width} {collection}: next')
                page.keyboard.press('ArrowLeft')
                check(dialog.locator('[data-gallery-position]').inner_text().startswith('1 /'), f'{width} {collection}: previous')
                page.screenshot(path=str(OUT / f'{collection}-lightbox-{width}.png'))
                page.keyboard.press('Escape')
                check(not dialog.is_visible() and opener.evaluate('(e)=>e===document.activeElement'), f'{width} {collection}: Escape/focus restore')
                report['lightboxes'].append({'width': width, 'collection': collection, 'checked': True})
        page.goto(BASE + '/', wait_until='networkidle')
        more = page.get_by_role('link', name='More tour photos', exact=True)
        check(more.get_attribute('href') == '/cdm-photo-gallery/', f'{width}: More tour photos target')
        more.click()
        page.wait_for_url(BASE + '/cdm-photo-gallery/')
        check(page.locator('[data-gallery-tile]').count() == 61, f'{width}: one-click photos')
        page.close()
    browser.close()
(OUT / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
raise SystemExit(1 if report['failures'] else 0)
