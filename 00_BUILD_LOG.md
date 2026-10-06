
## [2026-10-05] Guest Journey Audit & Copy Integrity Resolution

- **Repository:** 00_BTF_MAIN_SITE_CLOUDFLARE_ROOT
- **Branch:** main
- **Commits:**
  - f951854: fix(copy): sync updated timeless narrative copy for /resources-library/text_18
  - bdddf66: fix(audio): point resources page to non-offending R2 audio file name
  - 2ae7446: fix(copy): purge final hardcoded 2026 tour dates from resources page

### Summary of Actions
1. **Source Sheet Fix**: Updated `/resources-library/text_18` in `BTF_Approved_Site_Copy` (`1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw`) to: *"Written for BikeTourFrance CDM Tours. Formatted for a phone."*
2. **Audio Path Cleaned**: Updated `src/data/resources.ts` to reference `CDM_BTF_TourAudioOverview_00.CDM_BTFv1_CompleteAudio.m4b` on R2.
3. **Audit #2 (Copy Integrity)**: PASSED (12 routes compiled, 353 fields verified, 0 release blockers).
4. **Audit #2.5 (Guest Journey E2E)**: PASSED (242 internal links HTTP 200 OK, 22 CTAs verified with `rel="noopener"`, Google Form endpoint live, A11y focus traps verified on 12/12 routes).



## 2026-10-06T16:58:39Z — CDM gallery owner-approved publication — START

Read project rules, system history, Git state and available deployment procedure before editorial changes. Branch feature/cdm-combined-gallery; HEAD fec3e7f879875a90bab4e0c6edf18bfcd5728b9d. Evidence: /Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT/proof/2026-10-06_cdm_gallery_publish. Status: prerequisite inspection only.


## 2026-10-06T16:58:39Z — CDM gallery publication — STOP

FAIL prerequisites: named runbook missing; available v2.3 filename/v2.2 text still documents retired production branch and Framer public hosting, contradicting owner prompt/newer rules; prior combined REPORT.md missing under both proof roots; working tree is dirty. Exact findings and preserved Git state: /Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT/proof/2026-10-06_cdm_gallery_publish/REPORT.md and git-status-before.txt. HEAD remains fec3e7f879875a90bab4e0c6edf18bfcd5728b9d. No Sheet/asset/code/deployment change, commit, push or discard. Resume requires owner direction on procedure reconciliation and earlier report/checkpoint.


## 2026-10-06T17:25:19.162815+00:00 — CDM gallery publication — RESUMED

PASS: owner authorized resolving prerequisite STOP. Current Pages GET confirms main Git integration, unchanged npx astro build/dist/root and existing public domains. New canonical runbook and prior 49-photo handoff written; pending gallery changes preserved. Scope clarification for four earlier Sheet refreshes remains pending before publication.
Commit: fec3e7f879875a90bab4e0c6edf18bfcd5728b9d. Evidence: /Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT/proof/2026-10-06_cdm_gallery_publish.


## 2026-10-06T17:27:17.090384+00:00 — CDM gallery publication — STOP

FAIL: pre-change npm run predeploy:approved-copy exited 1 at gallery:sync. Five obsolete required CDM1/CDM2 fields are blank in the live Sheet. See baseline-predeploy.txt and sheet-before.json. Owner prompt mandates STOP on gate failure. Runbook correction and prior handoff written; checkpoint, editorial Sheet writes, crop, preview, merge and deployment not performed. No changes discarded.
Commit: fec3e7f879875a90bab4e0c6edf18bfcd5728b9d. Evidence: /Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT/proof/2026-10-06_cdm_gallery_publish.


## 2026-10-06T17:31:29.887174+00:00 — CDM gallery publication — SHEET_COMPLIANCE_COMPLETE

PASS: owner requested fixing the Sheet. Filled Approved Site Copy B363:B367 with already-approved combined-gallery text and aligned B356:B362 identity/metadata with the same owner wording. Five required legacy fields now nonblank; no manifest-required flag or copy gate changed. Native readback confirms exact values, preserved formats/keys, and unchanged CDM Photo Review inputs. Final live predeploy exited 0: 438 Sheet fields, 13 pages, 49/49 current photos, all 61 IDs/thumbnails retained. Evidence: sheet-compliance-before/after.json, sheet-identity-before/after.json, sheet-compliance-predeploy-final.txt. No commit, push or deployment in this repair.
Commit: fec3e7f879875a90bab4e0c6edf18bfcd5728b9d. Evidence: /Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT/proof/2026-10-06_cdm_gallery_publish.


## 2026-10-06T17:38:53.950226+00:00 — CDM gallery publication — SHEET_UPDATES_COMPLETE

PASS: 47 owner-approved alts written verbatim, only IMG_4470.JPG/IMG_4497.JPG marked Delete?=Y, exact editorial order reflected in all49 retained review rows, optional-caption formulas rewired, approved future CTA added at row501. Native before/after verifies permanent IDs/date and all ten estimated locations unchanged, removed-photo alts unchanged, all captions blank. Preserved pre-editorial commit2c8152e; live release gate running. Evidence sheet-editorial-before/after.json.
Commit: 2c8152e3f05b186661f8c6723b0f972a73579f8c. Evidence: /Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT/proof/2026-10-06_cdm_gallery_publish.


## 2026-10-06T21:54:14.924629+00:00 — CDM gallery publication — STOP_CTA_BRAND_CONFLICT

STOP: 47-photo build, approved-copy rendered check and gallery verification pass; final verify-dist rejects owner-approved verbatim CTA containing Bike Tour France. Required predeploy exits1. Retain exact approved CTA; no global brand/copy gate relaxation, main push or deployment. Need owner direction for a narrowly scoped gallery-only exception to the existing brand validator. Photo originals/IDs/provenance preserved. Editorial source/Sheet changes retained; checkpoint2c8152e. See editorial-predeploy.txt.
Commit: 2c8152e3f05b186661f8c6723b0f972a73579f8c. Evidence: /Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT/proof/2026-10-06_cdm_gallery_publish.


## 2026-10-06T22:04:45.225370+00:00 — CDM gallery publication — BUILD_AND_REAUDIT_COMPLETE

PASS: owner approved BikeTourFrance CTA spelling; Sheet B501 updated with native before/after snapshots. Final live predeploy passes 439 fields/13 pages/47 of49 photos, all61 IDs/thumbnails retained. Astro check0errors0warnings; eight gallery tests; copy unit/negative checks; six widths/lightbox;329 variants <=300KiB; source hashes/provenance unchanged; guest journey/SEO pass. Stable three cold mobile labs: medianLCP1468ms,maxCLS0.099378125,next27.3-30.3ms. Earlier overlapping-build measurement timed out and was repeated on stable output; diagnostics retained. No preview/main publication yet.
Commit: 2c8152e3f05b186661f8c6723b0f972a73579f8c. Evidence: /Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT/proof/2026-10-06_cdm_gallery_publish.
