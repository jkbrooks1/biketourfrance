"""Exercise the local fixture scenario: hidden photo has a caption, kept photo has one,
and a kept photo has none. Run after the scenario build; never edits the live Sheet."""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[2]
out = root / 'docs/proof/2026-10-06_cdm_photo_review'
source = json.loads((root / 'src/data/cdm-gallery-manifest.json').read_text())['photos']
review = json.loads((root / 'src/data/cdm-gallery-review.json').read_text())['photos']
delivered = json.loads((root / 'dist/cdm-photo-gallery/manifest.json').read_text())['photos']
base = os.environ.get('BTF_GALLERY_PREVIEW_URL', 'http://127.0.0.1:4321')
report = {'viewports': [], 'thumbnailLinks': 0}

with sync_playwright() as p:
    browser = p.chromium.launch()
    for width in (375, 768, 1440):
        page = browser.new_page(viewport={'width': width, 'height': 900})
        assert page.goto(base + '/cdm-photo-gallery/cdm2/', wait_until='networkidle').status == 200
        tiles = page.locator('[data-gallery-tile]')
        assert tiles.count() == 20
        expected = [photo for photo in delivered if photo['collection'] == 'cdm2']
        assert tiles.evaluate_all('(t)=>t.map(e=>e.dataset.photoId)') == [photo['id'] for photo in expected]
        first = page.locator('[data-gallery-open]').first
        first.click()
        page.wait_for_function("document.querySelector('[data-gallery-media] img')?.complete && document.querySelector('[data-gallery-media] img')?.naturalWidth > 0")
        assert page.locator('[data-gallery-caption]').inner_text() == expected[0]['caption']
        assert page.locator('[data-gallery-caption]').is_visible()
        assert page.locator('[data-gallery-media] img').get_attribute('alt') == expected[0]['alt']
        page.keyboard.press('ArrowRight')
        page.wait_for_function("document.querySelector('[data-gallery-media] img')?.complete && document.querySelector('[data-gallery-media] img')?.naturalWidth > 0")
        assert page.locator('[data-gallery-caption]').is_hidden()
        assert page.locator('[data-gallery-media] img').get_attribute('alt') == expected[1]['alt']
        assert page.locator('[data-gallery-position]').inner_text() == '2 / 20'
        page.keyboard.press('Escape')
        assert first.evaluate('(a)=>a===document.activeElement')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        first.click()
        page.wait_for_function("document.querySelector('[data-gallery-media] img')?.complete && document.querySelector('[data-gallery-media] img')?.naturalWidth > 0")
        page.screenshot(path=str(out / f'optional-caption-{width}.png'))
        page.keyboard.press('Escape')
        report['viewports'].append({'width': width, 'renderedImages': 20, 'captionShown': True, 'blankCaptionPhotoShown': True, 'captionIndependentAlt': True, 'focusRestored': True})
        page.close()
    page = browser.new_page()
    thumbs = page.request.get(base + '/cdm-photo-gallery/review-thumbnails.json').json()['photos']
    assert len(thumbs) == 61
    for thumb in thumbs:
        assert page.request.get(base + thumb['thumbnail']).status == 200
        report['thumbnailLinks'] += 1
    hidden = next(photo for photo in source if photo['collection'] == 'cdm2')
    assert any(t['id'] == hidden['id'] for t in thumbs)
    assert all(photo['id'] != hidden['id'] for photo in delivered)
    assert (root / hidden['managedSource']).exists()
    report['hiddenCaptionCannotIncludePhoto'] = True
    report['hiddenOriginalAndThumbnailRetained'] = True
    browser.close()

(out / 'selection-caption-browser.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
