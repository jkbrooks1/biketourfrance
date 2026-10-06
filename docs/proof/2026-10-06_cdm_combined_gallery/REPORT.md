# Combined CDM Photo Gallery — prior local implementation handoff

Written on 2026-10-06 during owner-authorized preservation, before the separate 47-photo editorial release. This records the existing 49-photo local build, not a public deployment.

Root: `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT`. Branch: `feature/cdm-combined-gallery`. Public main before work: `1785d5f45dcd71bb84fb1f4c4c635e8485a3e96d`. Preserved feature HEAD before checkpoint: `fec3e7f879875a90bab4e0c6edf18bfcd5728b9d`. The preservation checkpoint is recorded by the following Git commit and release evidence; no after-SHA is fabricated here.

## Inventory and retained assets

`/Volumes/JB_Tier2Storage/CDM1and2` is readable: 50 files, 49 supported images (41 `.jpg`, 8 `.jpeg`), zero corrupt/unreadable images, zero exact file or orientation-normalized pixel duplicates. Total 185,847,413 bytes; supported images 185,841,265 bytes. The sole unsupported exception is `/Volumes/JB_Tier2Storage/CDM1and2/.DS_Store`, 6,148 bytes, non-image extension. All 49 have byte-identical repository-managed originals; no mounted photo was changed or symlinked.

All 61 managed originals and permanent IDs remain retained (213,695,229 bytes). The 12 old photos absent from the selected folder are retained for recovery, excluded from this combined gallery, and listed with managed paths in `src/data/cdm-gallery-selection.json`: CDM1 `IMG_4507.PNG`; CDM2 `IMG_4638.PNG`, `IMG_4664.PNG`, `IMG_4665.PNG`, `IMG_4691.PNG`, `IMG_4692.PNG`, `IMG_4694.PNG`, `IMG_4696.PNG`, `IMG_4697.PNG`, `IMG_4781.JPG`, `IMG_4783.JPG`, `IMG_4784.JPG`. Original source paths remain in `src/data/cdm-gallery-manifest.json`.

## Implemented behavior

One combined `/cdm-photo-gallery/` displays all 49 eligible unique photos. Earlier CDM1/CDM2 child routes redirect to it. Grouping is 22 municipalities west to east: 39 photos have GPS-derived locations; ten retain explicitly estimated locations, evidence/confidence and no invented coordinates. Permanent IDs/date/EST evidence are unchanged. This does not represent two tours as one continuous dated trip.

`CDM Photo Review` in `BTF_Approved_Site_Copy` contains 49 rows with native Keep checkbox, Delete?, lightbox number, optional Caption, thumbnail, permanent ID, date and location evidence. Delete?=Y overrides checked Keep; clearing Y restores eligibility with Keep. Originals, thumbnails and IDs are retained. Captions never control inclusion. Older review tabs/owner choices remain hidden as history. The current 49 initial rows are checked, Delete blank, Caption blank.

The manifest-driven responsive masonry preserves aspect ratio; desktop sizes range about one-fifth to one-third of available width. Accessible native lightbox supports next/previous, wrap, Escape, visible focus, confinement and return; controls have at least 44-pixel targets. First photo eager/high, the other 48 lazy, dimensions reserved. Existing design/copy gate retained. A shared header initial-state correction removes mobile layout shift; source dates and image pixels were not edited.

## Recorded verification

These are existing local command outputs, not validation of the subsequent 47-photo changes:

- `astro-check.txt`: 35 files, zero errors, zero warnings, two pre-existing hints.
- `gallery-tests.txt`: eight passed, zero failed. `copy-tests.txt`: four unit tests plus ten negative/regression checks passed.
- `live-predeploy-gps.txt`: `verify-dist: 13 pages OK`; live approved-copy gate and deployability passed.
- `source-delivery-verification.txt` / `manifest-verification.json`: 49 rendered exactly once, all 49 mounted originals unchanged, all 61 managed originals retained; 343 delivered variants checked; largest 306,276 bytes under 300 KiB; 526 dist files, 55,946,818 bytes. No newly committed large originals needed.
- `browser/gallery-browser-verification.json`: six widths 320/375/768/1024/1440/1920; zero failures, overflow, overlap or broken images. Lightbox, focus, touch, no-JS links and controlled native lazy-loading checks passed. Desktop/mobile screenshots are in `browser/`.
- `scenario/selection-caption-browser.json`: reversible local fixture test displays 48 photos with Delete? overriding Keep, independent optional captions, all IDs/originals/thumbnails retained; three viewports passed. `sheet-gps-delete-test.json`: live Y test after geographic grouping, restored to original blank; numbering correct, ID unchanged.
- `guest-journey.txt`: 13 routes, 339 internal links, 23 CTAs, one form, zero blockers. `technical-seo.txt`: 13 pages/JSON-LD blocks passed. `site-browser/browser_report.json`: earlier whole-site responsive checks retained.
- `audit/performance.json`: three cold local 375×900 loads, 4× CPU, 1600/750 Kbps and 150 ms latency; median LCP 928 ms, maximum CLS 0.0896584. Lab measurements do not establish field Core Web Vitals.

## Audit and publication state

The full `docs/CDM_PHOTO_GALLERY_AUDIT.md` audits all 25 items, proposes all 49 positions and reviews all 49 alts. Verdict NEEDS WORK: identity/meta/CTA and factual alts need approved-copy corrections. Near-duplicate pairs 4470/4471 and 4496/4497 are recommendations only in this prior build; no removal/crop had been applied. Contact sheets and comparison evidence live in `audit/`.

No preview deployment, main push, public deployment, DNS, domain cutover, Framer change, Cloudflare configuration/secrets/build-command change or Wrangler upload occurred for this prior combined implementation. Public production still served main `1785d5f` / 61 older gallery photos at the fresh release preflight.

## Preservation and rollback

Keep the old closeout edits to `docs/BUILD_LOG.md` and `docs/proof/2026-10-06_cdm_gallery_discovery/REPORT.md`, older untracked evidence and preserved stash separately; do not stage unrelated artifacts wholesale. Four prior live-Sheet copy refreshes exist in separate ancestor `d958c837996c024efa1cbecaea755d7b4bd2d473` and need scope resolution before publishing them with the gallery.

For code rollback, revert the combined-gallery checkpoint through normal Git after coordinating newer Sheet decisions. Reconcile only task-created Sheet links/review data from `sheet-before.json` / `sheet-before-gps.json`; preserve newer decisions and all 61 ID assignments. Gallery removal never physically deletes originals or review thumbnails. Caption links require coordinated feature activation; entering new captions against the old main manifest can fail the copy gate. Existing photo IDs must never be reused.

Canonical project/general logs and the single systems register retain prior history; the new release START/STOP/resume entries record the preservation checkpoint and deployment procedure reconciliation. All further publication results belong to `proof/2026-10-06_cdm_gallery_publish/REPORT.md`.
