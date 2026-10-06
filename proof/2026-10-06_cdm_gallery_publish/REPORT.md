# CDM Photo Gallery publication report

Status: LOCAL PASS; Git-connected preview and production publication pending. Owner-approved CTA brand correction is applied; prior STOPs are resolved. This reports status, not owner acceptance of project completion.

## Source, before state and authority

Canonical root: /Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT. GitHub jkbrooks1/biketourfrance. Feature feature/cdm-combined-gallery. Public/main before1785d5f45dcd71bb84fb1f4c4c635e8485a3e96d; run-before fec3e7f879875a90bab4e0c6edf18bfcd5728b9d; pre-editorial preservation2c8152e3f05b186661f8c6723b0f972a73579f8c. Actual release SHAs/deployment IDs will be recorded in RELEASE.json. Existing btf-production Git integration/main/build npx astro build/output dist/root . and domains were read, not changed.

Canonical runbook: docs/BUILD_AND_DEPLOY_RUNBOOK.md. Owner authorized reconciliation of stale procedure, Sheet compliance repair, exact47-photo editorial release and publication, then corrected CTA brand to BikeTourFrance. Current approved site includes four previously stored Sheet changes from d958c837: /terms/body_3,/tours/meta_description,/waitlist/body_2,/cdm-facts/copy_12; no new wording changes to those pages. Older unrelated closeout notes and untracked proofs remain preserved.

## Inventory, inclusion and exceptions

Mounted /Volumes/JB_Tier2Storage/CDM1and2 readable:50 files;49 supported images (41 .jpg/.JPG,8 .jpeg),0 corrupt/unreadable,0 exact-content or normalized-pixel duplicates. Total185847413bytes; images185841265bytes. Exact unsupported path /Volumes/JB_Tier2Storage/CDM1and2/.DS_Store:6148bytes, filesystem metadata, not an image. All49 originals match managed source hashes; no mounted file changed. Final gallery47 unique images; all49 review rows and61 permanent IDs/managed originals/review thumbnails retained. No new images.

Owner-authorized gallery removals: /Volumes/JB_Tier2Storage/CDM1and2/IMG_4470.JPG and /Volumes/JB_Tier2Storage/CDM1and2/IMG_4497.JPG, Delete?=Y; originals/thumbnails/stored alts retained. The twelve old managed photos absent from the authoritative folder remain excluded, retained for recovery: src/assets/cdm-gallery/cdm1/IMG_4507.PNG; src/assets/cdm-gallery/cdm2/IMG_4638.PNG,IMG_4664.PNG,IMG_4665.PNG,IMG_4691.PNG,IMG_4692.PNG,IMG_4694.PNG,IMG_4696.PNG,IMG_4697.PNG,IMG_4781.JPG,IMG_4783.JPG,IMG_4784.JPG. See selection exclusions for exact individual paths. No silent omissions or deletion of originals.

## Editorial changes and Sheet evidence

New H1/intro/title/meta describe two Bordeaux-to-Sète tours; exact47-owner-order groups remain contiguous west-to-east. Source policy src/data/cdm-gallery-editorial.json; runtime renders generated manifest/approved Sheet copy.47 alts exact; captions blank.39 GPS-based/10 estimated assignments and40 EXIF-based/9 estimated capture dates across49 eligible photos retained unchanged. Photo-ID registry/location sidecar unchanged.

First UUID rider photo is a natural-aspect-ratio lead <=one-third desktop width, eager/high priority; other46 lazy. Only IMG_4528.JPG receives reversible Astro/Sharp derivative crop: oriented original3024x4032; bbox left0,top0,width3024,height3620; remove412 bottom pixels, preserve street/cafés/buildings/distant tower. Original and review thumbnail unchanged. Other46 derivative sets byte-path unchanged. Seven transforms for crop are regenerated;329 displayed variant/detail references all <=300KiB, max306276bytes. No IMG_4633 pixel change.

CTA immediately after gallery above footer: Interested in riding the Canal des Deux Mers with us? Join the waitlist for a future BikeTourFrance trip. Existing green/Montserrat Button links /waitlist-2027/; existing approved short label. No past-trip booking claim/place headings.

Native Sheet snapshots: sheet-before.json; sheet-compliance-before/after.json; sheet-identity-before/after.json; sheet-editorial-before/after.json; sheet-cta-brand-before/after.json. Five blank obsolete required fields repaired with already approved gallery identity, required fields/gate unchanged. B356:B367 identity;47 dynamic alt fields; review twoY/order/formulas; A501:B501 CTA. Keys/formats/removed alts/provenance/blank captions verified.

## Local validation evidence

- npm run check:35 files,0errors/0warnings,2 pre-existing hints (astro-check.txt).
- npm run gallery:test:8 PASS (gallery-tests.txt).
- npm run copy:test:4 unit/10 regression-negative PASS (copy-tests.txt).
- npm run predeploy:approved-copy: PASS439 live fields,13 pages,47/49 images,61 IDs/thumbs; includes canonical:check, rendered copy, gallery verification, verify-dist and deployability (final-predeploy.txt). Gate unchanged.
- python3 scripts/gallery/browser.py: six320/375/768/1024/1440/1920 widths; order47,0overflow/overlap/broken images; next/previous/Escape/focus return/keyboard/touch>=44px PASS (local-browser.txt/local/gallery-browser-verification.json).
- python3 scripts/gallery/v01_cdm_gallery_reaudit.py: exact identity47order/alts/CTA/crop/eager+46lazy;329 fetched variants; six screenshot views,0failures (local-reaudit.txt/local/editorial-reaudit.json). Desktop widths vary about22–33% of available space. Natural ratios and reserved dimensions. Moissac order mixes riding/portrait/water/cloister/aqueduct/bridge/bike detail instead of uninterrupted scenic shots. Desktop/mobile/crop/CTA visually reviewed.
- Managed/source hashes, IDs, provenance, crop/delivery budgets PASS (manifest-verification.json,derivative-change-verification.json,source-delivery-verification.txt).
- Guest journey:13 routes/338links/24CTAs/oneform/12hooks PASS; technicalSEO13pages/13JSONLD/sitemap PASS (guest-journey.txt,technical-seo.txt).
- python3 scripts/gallery/audit-performance.py: three cold375x900,CPU4x,1600/750Kbps,150ms; medianLCP1468ms,maxCLS0.099378125,next-button paint27.3–30.3ms (local-performance-final.txt/local-performance/performance.json). First measurement overlapped a rebuild and timed out; retained local-performance.txt, then stable-output retry succeeded. Lab metrics do not establish real-user Core Web Vitals.

Initial prerequisite, blank Sheet-field and exact-CTA brand failures are preserved in HISTORY.md and failed command logs; subsequently owner-resolved without gate relaxation. No unresolved local regression.

## Publication, logs and rollback

Preview/main/live verification pending; no claim of publication from local build. Final results and screenshots will be added to preview/pages/public evidence directories and RELEASE.json. Before publication retain old canonical production64240a36-ecc3-4d0f-a0ec-d4de34ad78c1 serving main1785d5f.

All mandatory milestones appended to /Users/jkbrookspersonal/LocalSiteBuildFiles/00_GENERAL_BUILD_LOG.md,00_BUILD_LOG.md,docs/BUILD_LOG.md,/Users/jkbrookspersonal/JBLocalBuildLogs/00_GENERAL_BUILDLOG.md. Single system register /Users/jkbrookspersonal/LocalSiteBuildFiles/00_A.SYSTEMS_CHANGES_REGISTER/SYSTEM_CHANGES_REGISTER.md consulted and appended. Scripts/prompt archived in /Users/jkbrookspersonal/00_SCRIPTS/ withv01 names.

Rollback after main merge: git revert -m1 <release-merge-SHA>, normal main push, wait/verify matching revert deployment. Coordinate only touched Sheet cells against before snapshots after checking newer owner edits; do not restore whole workbook blindly. Retain originals, IDs, estimates and review decisions. No force-push/reset/DNS action. Pre-editorial checkpoint2c8152e also preserves49-photo local state. Existing unrelated notes preserved separately, never discarded.

No DNS, public-domain cutover, Pages configuration/build command/secrets, Framer or Wrangler change. Production main publication is explicitly owner-approved; until served proof exists it remains pending.
