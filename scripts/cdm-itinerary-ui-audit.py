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
# Owner-approved expected rendered widths (canal map, locator), +/-1px: canal 5/6 and locator 1/6 of (viewport - 60px).
EXPECTED_W = {1440: (1150, 230), 1024: (803.33, 160.67), 768: (590, 118), 390: (275, 55)}
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
# The live Sheet spells the key "Lodging Label"; find it without assuming the spelling.
LABEL = next(v for k, v in ui.items() if k.lower() == 'lodging label')
DAY1_LODGING = next(d['lodging'] for d in days if d['id'] == '1')
STAGING_BANNER = 'Staging preview. This site is not indexed by search engines and is not the live BikeTourFrance.net site.'
fixture_rows = dict(json.load(open(os.path.join(ROOT, 'copy/fixture/fixture-rows.json'), encoding='utf8')))
MAP_ALT = fixture_rows['/home/canal_map_alt']

results, failures, measured, notes = [], [], [], []
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
            console, failed, img_status = [], [], {}
            page.on('response', lambda r: img_status.__setitem__(r.url, r.status) if r.request.resource_type == 'image' else None)
            page.on('console', lambda m: console.append(f'{m.type}: {m.text}') if m.type in ('error', 'warning') else None)
            page.on('pageerror', lambda e: console.append(f'pageerror: {e}'))
            page.on('requestfailed', lambda r: failed.append(f'{r.url} {r.failure}'))
            page.on('response', lambda r: failed.append(f'{r.url} HTTP {r.status}') if r.status >= 400 else None)
            resp = page.goto(base + '/', wait_until='networkidle')
            page.add_style_tag(content='html{scroll-behavior:auto !important}')
            check(f'[{tag}] home page loads with HTTP success', resp and resp.ok, resp.status if resp else 'none')

            # ---- map group: canal map left, France locator right (1:5, 20% of canal width), top-aligned, outer spacing, no extras
            page.evaluate("document.querySelector('.journey-map').scrollIntoView({block:'center'})")
            page.wait_for_function("(() => [...document.querySelectorAll('.journey-map img')].every(i => i.complete && i.naturalWidth > 0))()", timeout=15000)
            m = page.evaluate("""() => {
              const box = document.querySelector('.journey-map'); const canal = box.querySelector('.journey-map__canal img'); const loc = box.querySelector('.journey-map__locator img');
              const rect = (e) => { const r = e.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom, w: r.width, h: r.height }; };
              const r = rect(box); const c = rect(canal); const l = rect(loc); const cs = getComputedStyle(box);
              const borders = [...box.querySelectorAll('*')].concat([box]).map(e => ['Top','Right','Bottom','Left'].map(s => getComputedStyle(e)['border'+s+'Width']).join(',') + '|' + getComputedStyle(e).boxShadow + '|' + getComputedStyle(e).outlineStyle);
              return { left: r.l, rightGap: document.documentElement.clientWidth - r.r, marginTop: cs.marginTop, marginBottom: cs.marginBottom,
                canal: c, loc: l, row: r, borders, boxText: box.innerText.trim(), figcaptions: box.querySelectorAll('figcaption,h1,h2,h3,h4,p,span').length,
                canalAlt: canal.alt, locAlt: loc.getAttribute('alt'), canalNat: canal.naturalWidth, locNat: loc.naturalWidth, canalSrc: canal.currentSrc, locSrc: loc.currentSrc,
                prevIsReady: box.previousElementSibling && box.previousElementSibling.getAttribute('aria-labelledby'),
                nextIsItinerary: box.nextElementSibling && box.nextElementSibling.hasAttribute('data-cdm-itinerary') } }""")
            ratio = m['loc']['w'] / m['canal']['w']
            record = dict(width=width, ratio=round(ratio, 5), locW=round(m['loc']['w'], 2), canalW=round(m['canal']['w'], 2),
                          canalTop=round(m['canal']['t'], 2), locTop=round(m['loc']['t'], 2), expectedCanalW=EXPECTED_W[width][0], expectedLocW=EXPECTED_W[width][1],
                          left=round(m['left'], 2), rightGap=round(m['rightGap'], 2), marginTop=m['marginTop'], marginBottom=m['marginBottom'],
                          gapBetween=round(m['loc']['l'] - m['canal']['r'], 2))
            measured.append(record)
            check(f'[{tag}] locator is present and to the right of the canal map', m['loc']['l'] >= m['canal']['r'] - 0.5 and m['loc']['w'] > 0, record)
            check(f'[{tag}] locator width is 0.20 of canal map width within 1px', abs(m['loc']['w'] - 0.20 * m['canal']['w']) <= 1, f"loc={m['loc']['w']} canal={m['canal']['w']} ratio={ratio}")
            check(f'[{tag}] locator top edge equals canal map top edge within 1px', abs(m['loc']['t'] - m['canal']['t']) <= 1, f"locTop={m['loc']['t']} canalTop={m['canal']['t']}")
            check(f'[{tag}] canal map width matches the expected value within 1px', abs(m['canal']['w'] - EXPECTED_W[width][0]) <= 1, f"{m['canal']['w']} vs {EXPECTED_W[width][0]}")
            check(f'[{tag}] locator width matches the expected value within 1px', abs(m['loc']['w'] - EXPECTED_W[width][1]) <= 1, f"{m['loc']['w']} vs {EXPECTED_W[width][1]}")
            check(f'[{tag}] canal map and locator have no gap between them', abs(m['loc']['l'] - m['canal']['r']) <= 0.6, record['gapBetween'])
            check(f'[{tag}] map group fills the row: canal map 5/6, locator 1/6', abs(m['canal']['w'] / m['row']['w'] - 5 / 6) < 0.005 and abs(m['loc']['w'] / m['row']['w'] - 1 / 6) < 0.005, f"{m['canal']['w']/m['row']['w']:.4f} {m['loc']['w']/m['row']['w']:.4f}")
            check(f'[{tag}] map group has 30px left and right spacing', abs(m['left'] - 30) < 0.6 and abs(m['rightGap'] - 30) < 0.6, f"left={m['left']} right={m['rightGap']}")
            check(f'[{tag}] map group has 5px top and bottom spacing', m['marginTop'] == '5px' and m['marginBottom'] == '5px', f"{m['marginTop']} {m['marginBottom']}")
            check(f'[{tag}] no visible border, shadow, caption or text in the map group', all(b.startswith('0px,0px,0px,0px|none|none') for b in m['borders']) and m['boxText'] == '' and m['figcaptions'] == 0, m['borders'][:3])
            check(f'[{tag}] canal map has the approved alt text and the locator has empty alt', m['canalAlt'] == MAP_ALT and m['locAlt'] == '', f"{m['canalAlt'][:40]!r} {m['locAlt']!r}")
            check(f'[{tag}] both images loaded (HTTP 200, naturalWidth > 0)', m['canalNat'] > 0 and m['locNat'] > 0 and img_status.get(m['canalSrc']) == 200 and img_status.get(m['locSrc']) == 200, f"{img_status.get(m['canalSrc'])} {img_status.get(m['locSrc'])}")
            check(f'[{tag}] canal map is the Agen aqueduct asset and the locator is the France locator asset', 'canal-des-deux-mers-illustrated-map' in m['canalSrc'] and 'btf-cdm-france-locator-map' in m['locSrc'], f"{m['canalSrc']} | {m['locSrc']}")
            check(f'[{tag}] map group sits after Ready to ride and is followed by the itinerary', m['prevIsReady'] == 'ready-heading' and m['nextIsItinerary'], '')
            if width in SHOT_WIDTHS:
                page.wait_for_timeout(800)
                page.screenshot(path=os.path.join(args.out, f'{args.label}_{width}_map_group.png'))

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
            check(f'[{tag}] canal map and locator do not overlap', overlap_report('.journey-map') == [], overlap_report('.journey-map'))
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
                if d['rest']:
                    check(f'{label}: no lodging label on the rest day', panel.locator('.itin-day__label').count() == 0, '')
                else:
                    lab = panel.evaluate("p => { const dt = p.querySelector('.itin-day__label'); const dd = dt && dt.nextElementSibling; return { label: dt && dt.innerText.trim(), lodging: dd && dd.innerText.trim(), isDd: !!dd && dd.tagName === 'DD', pair: !!dt && dt.parentElement.tagName === 'DL' }; }")
                    check(f'{label}: live Lodging Label is immediately before the lodging text', lab['label'] == LABEL and lab['lodging'] == d['lodging'] and lab['isDd'] and lab['pair'], lab)
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
            labels = page.eval_on_selector_all('[data-cdm-itinerary] .itin-day__label', 'els => els.map(e => e.innerText.trim())')
            check(f'[{tag}] the live Lodging Label text appears exactly 9 times with all rows expanded', labels == [LABEL] * 9, labels)
            rest_labels = page.locator('[data-itin-day="REST"] .itin-day__label').count()
            measured[-1].update(labelCount=len(labels), restDayLabelCount=rest_labels)
            check(f'[{tag}] no lodging label on the rest-day row with all rows expanded', rest_labels == 0, rest_labels)
            check(f'[{tag}] Day 1 lodging shows "agricultural" and the page has no "agritcultural"', 'agricultural' in DAY1_LODGING and page.locator('[data-itin-day="1"] .itin-day__lodging').inner_text().strip() == DAY1_LODGING and 'agritcultural' not in page.content(), '')
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
                strip = """() => { const c = document.body.cloneNode(true); c.querySelectorAll('script,style,[data-cdm-itinerary],.journey-map').forEach(e => e.remove());
                  return c.textContent.replace(/\\s+/g, ' ').replace(/updated [\\d-]+ \\d\\d:\\d\\d Heure de Paris/g, 'updated [stamp]')
                  .replace(/\\[email.protected\\]|contact@biketourfrance\\.net/g, '[email]').trim(); }"""
                now_text = page.evaluate(strip)
                banner_seen = STAGING_BANNER in now_text
                if args.label == 'preview' and banner_seen:
                    now_text = now_text.replace(STAGING_BANNER, '').strip()
                    notes.append('preview-only staging banner text removed before comparison')
                base_page = ctx.new_page()
                base_page.set_content(open(args.baseline_html, encoding='utf8').read())
                base_text = base_page.evaluate(strip)
                check('[1440px] all text outside the map group and itinerary is identical to production before this release', now_text == base_text, f'now={len(now_text)} before={len(base_text)}')
                base_page.close()
            ctx.close()
        browser.close()

try:
    run()
finally:
    if server:
        server.terminate()
json.dump(dict(label=args.label, base=base, measured=measured, notes=notes, passed=len(results) - len(failures), failed=len(failures), failures=failures, results=results), open(os.path.join(args.out, f'{args.label}_results.json'), 'w'), indent=1, ensure_ascii=False)
print(f'ui-audit[{args.label}] {len(results) - len(failures)} passed, {len(failures)} failed')
for f in failures[:30]:
    print('  FAIL', f)
sys.exit(1 if failures else 0)
