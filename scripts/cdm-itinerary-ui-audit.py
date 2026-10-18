#!/usr/bin/env python3
# UI audit for the CDM illustrated map and expandable itinerary on the home page.
# Expected values are derived independently from the raw tab snapshot (copy/fixture/cdm-itinerary-rows.json),
# not from the generated module, so the audit checks the page against the workbook data itself.
#
# Usage:
#   python3 scripts/cdm-itinerary-ui-audit.py --out DIR [--base-url URL] [--baseline-html FILE] [--label NAME]
# Without --base-url it serves dist/ locally. With --base-url it audits that deployed origin.
# Writes DIR/<label>_results.json and screenshots. Exits 1 if any check fails.
import argparse, json, os, re, subprocess, sys, time
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument('--out', required=True)
ap.add_argument('--base-url', default='')
ap.add_argument('--baseline-html', default='')
ap.add_argument('--label', default='local')
ap.add_argument('--port', default='4398')
args = ap.parse_args()
os.makedirs(args.out, exist_ok=True)

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
WIDTHS = [1440, 1024, 768, 390]
SHOT_WIDTHS = {1440, 390}

# ------------------------------------------------------------------ expected data from the raw tab grid
grid = json.load(open(os.path.join(ROOT, 'copy/fixture/cdm-itinerary-rows.json'), encoding='utf8'))
H = {h: i for i, h in enumerate(grid[0]) if h}
def cell(row, h):
    i = H[h]
    return (row[i] if i < len(row) else '').strip()
days, ui = [], {}
for row in grid[1:]:
    if cell(row, 'UI Copy Key'):
        ui[cell(row, 'UI Copy Key')] = cell(row, 'Approved Text')
    ident = cell(row, 'Ride Day')
    if not ident:
        continue
    bullets = [re.match(r'^•\s+(.+?)\s+—\s+(.+)$', l.strip()).groups() for l in cell(row, 'Day highlights').split('\n') if l.strip()]
    days.append(dict(
        id=ident, rest=ident == 'REST', start=cell(row, 'Start Town'), end=cell(row, 'End Town'),
        distance=None if ident == 'REST' else cell(row, 'Distance (miles)') + ' miles',
        elevation=None if ident == 'REST' else cell(row, 'Elevation (feet)') + ' feet',
        lodging=None if ident == 'REST' else cell(row, 'Destination Lodging'),
        highlights=bullets, description=cell(row, 'Route description')))
HEADING, DETAILS, RESTTITLE = ui['Itinerary section heading'], ui['Details control'], ui['Rest day title']
fixture_rows = dict(json.load(open(os.path.join(ROOT, 'copy/fixture/fixture-rows.json'), encoding='utf8')))
MAP_ALT = fixture_rows['/home/canal_map_alt']

results, failures = [], []
def check(name, ok, detail=''):
    results.append(dict(name=name, ok=bool(ok), detail=str(detail)[:400]))
    if not ok:
        failures.append(name)

ws = lambda s: re.sub(r'\s+', ' ', s or '').strip()

server = None
base = args.base_url.rstrip('/')
if not base:
    server = subprocess.Popen([sys.executable, '-m', 'http.server', args.port, '-d', os.path.join(ROOT, 'dist')], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    base = f'http://127.0.0.1:{args.port}'
    time.sleep(1.5)

JS_VISIBLE = "el => !!el && el.checkVisibility() && el.getBoundingClientRect().height > 0"

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for width in WIDTHS:
            tag = f'{width}px'
            ctx = browser.new_context(viewport={'width': width, 'height': 900}, device_scale_factor=1)
            page = ctx.new_page()
            console, failed = [], []
            page.on('console', lambda m: console.append(f'{m.type}: {m.text}') if m.type in ('error', 'warning') else None)
            page.on('pageerror', lambda e: console.append(f'pageerror: {e}'))
            page.on('requestfailed', lambda r: failed.append(f'{r.url} {r.failure}'))
            page.on('response', lambda r: failed.append(f'{r.url} HTTP {r.status}') if r.status >= 400 else None)
            resp = page.goto(base + '/', wait_until='networkidle')
            page.add_style_tag(content='html{scroll-behavior:auto !important}')
            check(f'[{tag}] home page loads with HTTP success', resp and resp.ok, resp.status if resp else 'none')

            # ---- map: position, spacing, no added border, correct asset and alt
            m = page.evaluate("""() => {
              const box = document.querySelector('.journey-map'); const img = box.querySelector('img');
              const r = box.getBoundingClientRect(); const cs = getComputedStyle(box);
              return { left: r.left, rightGap: document.documentElement.clientWidth - r.right, top: r.top + scrollY, bottom: r.bottom + scrollY,
                marginTop: cs.marginTop, marginBottom: cs.marginBottom, borders: ['Top','Right','Bottom','Left'].map(s => cs['border'+s+'Width']),
                outline: cs.outlineStyle, alt: img.alt, complete: img.complete, natural: img.naturalWidth, src: img.currentSrc, imgW: img.getBoundingClientRect().width,
                boxW: r.width, prevIsReady: box.previousElementSibling && box.previousElementSibling.getAttribute('aria-labelledby'),
                nextIsItinerary: box.nextElementSibling && box.nextElementSibling.hasAttribute('data-cdm-itinerary'),
                gapToItinerary: document.querySelector('[data-cdm-itinerary]').getBoundingClientRect().top + scrollY - (r.bottom + scrollY) } }""")
            check(f'[{tag}] map has 30px left and right spacing', abs(m['left'] - 30) < 0.6 and abs(m['rightGap'] - 30) < 0.6, f"left={m['left']} right={m['rightGap']}")
            check(f'[{tag}] map has 5px top and bottom spacing', m['marginTop'] == '5px' and m['marginBottom'] == '5px', f"{m['marginTop']} {m['marginBottom']}")
            check(f'[{tag}] map has no added visible border', all(b == '0px' for b in m['borders']) and m['outline'] == 'none', m['borders'])
            check(f'[{tag}] map image loaded and fills the one-column width', m['complete'] and m['natural'] > 0 and abs(m['imgW'] - m['boxW']) < 1, f"natural={m['natural']} w={m['imgW']}/{m['boxW']}")
            check(f'[{tag}] map is the Agen aqueduct asset with the approved alt text', 'canal-des-deux-mers-illustrated-map' in m['src'] and m['alt'] == MAP_ALT, m['src'])
            check(f'[{tag}] map sits after the Ready to ride section', m['prevIsReady'] == 'ready-heading', m['prevIsReady'])
            check(f'[{tag}] itinerary section is the next element after the map', m['nextIsItinerary'], m['gapToItinerary'])

            sec = page.locator('section[data-cdm-itinerary]')
            check(f'[{tag}] itinerary heading is the approved heading', ws(sec.locator('h2').inner_text()) == HEADING, ws(sec.locator('h2').inner_text()))
            rows = sec.locator('details[data-itin-day]')
            ids = page.eval_on_selector_all('section[data-cdm-itinerary] details[data-itin-day]', 'els => els.map(e => e.dataset.itinDay)')
            check(f'[{tag}] ten rows in order with the rest day between 4 and 5', ids == [d['id'] for d in days] and ids.index('REST') == ids.index('4') + 1 == ids.index('5') - 1, ids)
            check(f'[{tag}] nine ride rows and one rest row', sum(1 for d in days if not d['rest']) == 9 and ids.count('REST') == 1, '')
            check(f'[{tag}] all rows start closed', page.eval_on_selector_all('section[data-cdm-itinerary] details', 'els => els.every(e => !e.open)'), '')

            # ---- closed state per row
            for i, d in enumerate(days):
                row = rows.nth(i)
                summ = row.locator('summary')
                text = ws(summ.inner_text())
                panel = row.locator('.itin-day__panel')
                label = f'[{tag}] row {d["id"]} closed'
                parts = [DETAILS] + [h[0] for h in d['highlights']]
                parts += [RESTTITLE] if d['rest'] else [d['start'], d['end'], d['distance']]
                check(f'{label}: shows approved closed fields', all(ws(x) in text for x in parts), text[:160])
                if not d['rest']:
                    check(f'{label}: starts with the ride day', text.split(' ')[0] == d['id'], text[:20])
                    check(f'{label}: distance is visible', summ.locator('.itin-day__distance').evaluate(JS_VISIBLE), '')
                    check(f'{label}: elevation, lodging and notes are not shown', not any(x in text for x in [d['elevation'], d['lodging'][:30]] + [h[1] for h in d['highlights']]), '')
                check(f'{label}: expanded panel hidden', not panel.evaluate('el => el.checkVisibility()'), '')

            # ---- overlap and overflow, closed
            def overlap_report(selector):
                return page.evaluate("""sel => { const bad = [];
                  document.querySelectorAll(sel).forEach(s => { const kids = [...s.children].map(c => [c, c.getBoundingClientRect()]);
                    for (let a = 0; a < kids.length; a++) for (let b = a + 1; b < kids.length; b++) { const A = kids[a][1], B = kids[b][1];
                      const w = Math.min(A.right, B.right) - Math.max(A.left, B.left), h = Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top);
                      if (w > 1 && h > 1) bad.push(kids[a][0].className + ' x ' + kids[b][0].className); } });
                  return bad; }""", selector)
            check(f'[{tag}] no overlapping elements in closed rows', overlap_report('.itin-day__summary') == [], overlap_report('.itin-day__summary'))
            ov = page.evaluate("""() => { const w = document.documentElement.clientWidth; const bad = [];
              document.querySelectorAll('[data-cdm-itinerary] *').forEach(e => { const r = e.getBoundingClientRect(); if (r.width && (r.right > w + 0.5 || r.left < -0.5)) bad.push(e.className || e.tagName); });
              return { page: document.documentElement.scrollWidth - w, bad }; }""")
            check(f'[{tag}] no horizontal overflow (closed)', ov['page'] <= 0 and not ov['bad'], ov)
            if width in SHOT_WIDTHS:
                page.evaluate("document.querySelector('.journey-map').scrollIntoView({block:'start'})")
                page.wait_for_function("(() => { const i = document.querySelector('.journey-map img'); return i.complete && i.naturalWidth > 0; })()")
                page.wait_for_timeout(1200)
                page.screenshot(path=os.path.join(args.out, f'{args.label}_{width}_map_and_itinerary_closed.png'))
                sec.screenshot(path=os.path.join(args.out, f'{args.label}_{width}_itinerary_closed.png'))

            # ---- open and close each row with the pointer
            for i, d in enumerate(days):
                row = rows.nth(i)
                row.locator('summary').click()
                opened = row.evaluate('e => e.open')
                panel = row.locator('.itin-day__panel')
                ptxt = ws(panel.inner_text())
                label = f'[{tag}] row {d["id"]} expanded'
                want = [d['description']] + [x for h in d['highlights'] for x in h] + ([] if d['rest'] else [d['lodging'], d['elevation']])
                check(f'{label}: opens on click', opened, '')
                check(f'{label}: shows description, both notes{"" if d["rest"] else ", lodging and elevation"}', all(ws(x) in ptxt for x in want), ptxt[:120])
                if not d['rest']:
                    check(f'{label}: elevation is visible inside the details', panel.locator('.itin-day__elevation').evaluate(JS_VISIBLE) and ws(panel.locator('.itin-day__elevation').inner_text()) == d['elevation'], '')
                check(f'{label}: description is 30 words', len(d['description'].split()) == 30, len(d['description'].split()))
                row.locator('summary').click()
                check(f'{label}: closes on click', not row.evaluate('e => e.open'), '')

            # ---- keyboard operation
            for i, d in enumerate(days):
                row = rows.nth(i)
                row.locator('summary').focus()
                page.keyboard.press('Enter')
                o1 = row.evaluate('e => e.open')
                page.keyboard.press('Enter')
                c1 = not row.evaluate('e => e.open')
                page.keyboard.press('Space')
                o2 = row.evaluate('e => e.open')
                page.keyboard.press('Space')
                c2 = not row.evaluate('e => e.open')
                focused = row.locator('summary').evaluate("e => e === document.activeElement && e.matches(':focus-visible')")
                check(f'[{tag}] row {d["id"]} keyboard: Enter and Space open and close, focus ring shown', o1 and c1 and o2 and c2 and focused, f'{o1} {c1} {o2} {c2} {focused}')
            # Tab order reaches each summary
            page.evaluate("document.activeElement && document.activeElement.blur(); document.querySelector('[data-cdm-itinerary] h2').scrollIntoView()")
            reached = []
            page.evaluate("(() => { const s = document.querySelector('[data-itin-day=\"1\"] summary'); const prev = s.previousElementSibling; })()")
            rows.nth(0).locator('summary').focus()
            for _ in range(len(days) - 1):
                page.keyboard.press('Tab')
                reached.append(page.evaluate("document.activeElement.closest('[data-itin-day]') ? document.activeElement.closest('[data-itin-day]').dataset.itinDay : 'x'"))
            check(f'[{tag}] Tab moves through all ten rows in order', reached == [d['id'] for d in days][1:], reached)

            # ---- all open: overlap, overflow, screenshot
            page.evaluate("document.querySelectorAll('[data-cdm-itinerary] details').forEach(e => e.open = true)")
            ov = page.evaluate("""() => { const w = document.documentElement.clientWidth; const bad = [];
              document.querySelectorAll('[data-cdm-itinerary] *').forEach(e => { const r = e.getBoundingClientRect(); if (r.width && (r.right > w + 0.5 || r.left < -0.5)) bad.push(e.className || e.tagName); });
              return { page: document.documentElement.scrollWidth - w, bad }; }""")
            check(f'[{tag}] no horizontal overflow (all rows expanded)', ov['page'] <= 0 and not ov['bad'], ov)
            check(f'[{tag}] no overlapping elements in expanded rows', overlap_report('.itin-day__panel') == [] and overlap_report('.itin-day__summary') == [], '')
            if width in SHOT_WIDTHS:
                sec.screenshot(path=os.path.join(args.out, f'{args.label}_{width}_itinerary_expanded_all.png'))
                page.evaluate("document.querySelectorAll('[data-cdm-itinerary] details').forEach(e => e.open = false); document.querySelector('[data-itin-day=\"4\"]').open = true; document.querySelector('[data-itin-day=\"REST\"]').open = true; document.querySelector('[data-itin-day=\"5\"]').open = true")
                page.evaluate("document.querySelector('[data-itin-day=\"4\"]').scrollIntoView({block:'start'})")
                page.screenshot(path=os.path.join(args.out, f'{args.label}_{width}_itinerary_rest_day_expanded.png'))
            page.evaluate("document.querySelectorAll('[data-cdm-itinerary] details').forEach(e => e.open = false)")

            # ---- site-wide console and request health
            check(f'[{tag}] no console errors or warnings', console == [], console[:5])
            check(f'[{tag}] no failed or error responses', failed == [], failed[:5])

            # ---- nothing outside the itinerary changed (text compared with the baseline page)
            if args.baseline_html and width == 1440:
                strip = """() => { const c = document.body.cloneNode(true); c.querySelectorAll('script,style,[data-cdm-itinerary]').forEach(e => e.remove());
                  return c.textContent.replace(/\\s+/g, ' ').replace(/updated [\\d-]+ \\d\\d:\\d\\d Heure de Paris/g, 'updated [stamp]')
                  .replace(/\\[email.protected\\]|contact@biketourfrance\\.net/g, '[email]').trim(); }"""
                now_text = page.evaluate(strip)
                base_page = ctx.new_page()
                base_page.set_content(open(args.baseline_html, encoding='utf8').read())
                base_text = base_page.evaluate(strip)
                check('[1440px] all text outside the itinerary is identical to the page before this release', now_text == base_text, f'now={len(now_text)} before={len(base_text)}')
                base_page.close()
            ctx.close()
        browser.close()

try:
    run()
finally:
    if server:
        server.terminate()
json.dump(dict(label=args.label, base=base, passed=len(results) - len(failures), failed=len(failures), failures=failures, results=results), open(os.path.join(args.out, f'{args.label}_results.json'), 'w'), indent=1, ensure_ascii=False)
print(f'ui-audit[{args.label}] {len(results) - len(failures)} passed, {len(failures)} failed')
for f in failures[:30]:
    print('  FAIL', f)
sys.exit(1 if failures else 0)
