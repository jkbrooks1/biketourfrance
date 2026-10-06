# CDM photo review infrastructure — 2026-10-06

## Verified state

Repository root: `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT`.
Branch: `feature/cdm-photo-review-sheet`, from verified GitHub/local `main` `1785d5f45dcd71bb84fb1f4c4c635e8485a3e96d`.
Before commit: `1785d5f45dcd71bb84fb1f4c4c635e8485a3e96d`.
Unrelated approved-Sheet refresh preserved separately in commit `d958c837996c024efa1cbecaea755d7b4bd2d473`.
Infrastructure after-commit SHA is reported in the final handoff and Git history (the commit contains this report).
Pages remains `btf-production`, production `main`, Git integration, build `npx astro build`, output `dist`, root `.`, previews `all`. No Pages setting changed.
No new preview or public deployment was created. Locally reviewed routes: `http://127.0.0.1:4321/cdm-photo-gallery/`, `/cdm-photo-gallery/cdm1/`, `/cdm-photo-gallery/cdm2/`; preview server is temporary and stopped at handoff.

Before: public galleries display every unique library photo, no Sheet inclusion/caption controls.
After: review tabs exist and validated feature source uses Keep alone, optional captions, retained review thumbnails and stable date IDs. The public site continues to use its previous release until owner-approved integration/publication. Do not enter captions before activation; their new field identifiers would make the older main copy sync fail closed.

## Exact inventory and retained counts

Both mounts remain readable. All 100 supported source-image SHA-256 values were rechecked unchanged; 61 managed originals remain unchanged and unsymlinked. No source image was copied, recompressed or modified during this review-infrastructure task; assets were already retained by the published gallery work.

| Folder | Files | Supported by extension | Unsupported | Corrupt/unreadable | Total bytes | Unique library / final rendered |
|---|---:|---|---:|---:|---:|---:|
| `/Volumes/JB_Tier2Storage/CDM1-green` | 40 | .jpg: 31, .png: 1, .jpeg: 8 | 0 | 0 | 149275263 | 40 / 40 |
| `/Volumes/JB_Tier2Storage/CDM2-green` | 61 | .jpg: 44, .png: 8, .jpeg: 8 | 1 | 0 | 213063571 | 21 / 21 |

40 CDM1 + 21 CDM2 = 61 unique library and currently rendered photos, all Keep checked, all captions blank. 52 known capture-date IDs are ten digits; nine estimates have the ten-digit base plus EST. Counters are global per capture day; maximum currently seven, below the 99/day limit. No additional supported unique photo was omitted. The tested local scenario had CDM1 40 / CDM2 20 and restored the original all-checked state afterward.

## Estimated dates and their exact source paths

Estimates are explicitly tentative. Two medium-confidence estimates use visual/sequence comparisons; seven are low confidence. The UUID CDM2 image has no reliable ordering clue, so Sep 12 is only a proposed collection-start date, not a determined capture date. Evidence and limitations for every assignment are in the Sheet and `capture-date-audit.json`; original metadata is preserved.

| Source path | Photo ID | Estimated date | Confidence |
|---|---|---|---|
| `/Volumes/JB_Tier2Storage/CDM1-green/IMG_6115.jpeg` | `2026083005EST` | 2026-08-30 | Medium |
| `/Volumes/JB_Tier2Storage/CDM1-green/IMG_6117.jpeg` | `2026083006EST` | 2026-08-30 | Low |
| `/Volumes/JB_Tier2Storage/CDM1-green/IMG_6125.jpeg` | `2026090106EST` | 2026-09-01 | Medium |
| `/Volumes/JB_Tier2Storage/CDM1-green/IMG_6143.jpeg` | `2026090202EST` | 2026-09-02 | Low |
| `/Volumes/JB_Tier2Storage/CDM1-green/IMG_6146.jpeg` | `2026090203EST` | 2026-09-02 | Low |
| `/Volumes/JB_Tier2Storage/CDM1-green/IMG_6155.jpeg` | `2026090204EST` | 2026-09-02 | Low |
| `/Volumes/JB_Tier2Storage/CDM1-green/IMG_6158.jpeg` | `2026090205EST` | 2026-09-02 | Low |
| `/Volumes/JB_Tier2Storage/CDM1-green/IMG_6175.jpeg` | `2026090206EST` | 2026-09-02 | Low |
| `/Volumes/JB_Tier2Storage/CDM2-green/9f4a9960-26b2-4d36-a8a3-4db68d666749_A4F2DBC7-C58D-460E-A289-3894F082CA8E.jpg` | `2026091204EST` | 2026-09-12 | Low |

## Every source exception

Unsupported: `/Volumes/JB_Tier2Storage/CDM2-green/.DS_Store` — 6148-byte macOS metadata file; unsupported non-image extension. Corrupt/unreadable: none. Remaining omitted copies below are the 39 duplicates already excluded under the owner's unique-photo instruction; none is newly excluded by the review task. Every retained counterpart remains in its intended gallery.

| Duplicate exact path | Retained exact path | Reason |
|---|---|---|
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4406.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4406.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4411.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4411.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4416.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4416.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4421.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4421.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4423.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4423.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4428.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4428.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4459.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4459.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4462.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4462.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4463.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4463.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4470.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4470.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4471.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4471.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4484.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4484.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4492.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4492.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4495.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4495.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4496.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4496.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4497.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4497.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4516.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4516.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4517.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4517.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4518.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4518.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4520.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4520.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4528.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4528.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4529.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4529.JPG` | Identical orientation-normalized RGB pixels despite different file bytes; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4533.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4533.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4553.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4553.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4572.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4572.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4574.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4574.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4578.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4578.JPG` | Identical orientation-normalized RGB pixels despite different file bytes; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4596.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4596.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4600.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4600.JPG` | Identical orientation-normalized RGB pixels despite different file bytes; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4606.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4606.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4607.JPG` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4607.JPG` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_6115.jpeg` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_6115.jpeg` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_6117.jpeg` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_6117.jpeg` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_6125.jpeg` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_6125.jpeg` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_6143.jpeg` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_6143.jpeg` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_6146.jpeg` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_6146.jpeg` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_6155.jpeg` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_6155.jpeg` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_6158.jpeg` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_6158.jpeg` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |
| `/Volumes/JB_Tier2Storage/CDM2-green/IMG_6175.jpeg` | `/Volumes/JB_Tier2Storage/CDM1-green/IMG_6175.jpeg` | Exact file SHA-256 duplicate; owner requires one occurrence across both galleries. |

Supported format mismatches (all retained unchanged):

- `/Volumes/JB_Tier2Storage/CDM1-green/IMG_4507.PNG` — JPEG data under a PNG extension; readable and retained unchanged.
- `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4694.PNG` — JPEG data under a PNG extension; readable and retained unchanged.
- `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4696.PNG` — JPEG data under a PNG extension; readable and retained unchanged.
- `/Volumes/JB_Tier2Storage/CDM2-green/IMG_4697.PNG` — JPEG data under a PNG extension; readable and retained unchanged.

## Files and external changes

Created: `scripts/gallery/review-lib.mjs`, `read-sheet.mjs`, `sync-review.mjs`, `review.test.mjs`, `verify-review.mjs`, `review-browser.py`; `src/data/cdm-photo-id-registry.json`, `src/data/cdm-gallery-review.json`, `copy/gallery-review.fixture.json`; `src/pages/cdm-photo-gallery/review-thumbnails.json.ts`; `docs/CDM_PHOTO_REVIEW.md`; this proof directory.
Modified: `src/data/cdm-photo-gallery.ts`, `src/components/CdmPhotoGallery.astro`, `src/scripts/cdm-photo-gallery.ts`, `src/scripts/cdm-gallery-layout.js`, `scripts/gallery/verify.mjs`, `copy/field-manifest.json`, `package.json`, `.github/workflows/scheduled-copy-sync.yml`, canonical rules and AGENTS wrapper, required logs. No new packages/lockfile changes, navigation changes, gate-script edits, Pages settings, build-command changes, secrets, originals or Drive asset-store changes.
Live copy synchronization refreshed `copy/fixture/fixture-rows.json` and `src/data/approved-copy.ts`: four existing Sheet edits `/terms/body_3`, `/tours/meta_description`, `/waitlist/body_2`, `/cdm-facts/copy_12`, plus explicit empty-cell normalization. These edits originated in the current Sheet and were not authored or written to the Sheet by this task; they are preserved in their separate copy-refresh commit.
Preexisting uncommitted publication closeout edits to `docs/BUILD_LOG.md` and `docs/proof/2026-10-06_cdm_gallery_discovery/REPORT.md`, and older untracked proof files, are retained. Large full-page screenshot sets remain local; compact viewport/caption screenshots and JSON/command evidence are selected for the feature commit.

Google workbook: BTF_Approved_Site_Copy, ID `1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw`. Added `CDM1 Photo Review` (gid 61061001, A1:K41) and `CDM2 Photo Review` (gid 61061002, A1:K22); native Keep Boolean validation, IMAGE thumbnail formulas, count formulas, frozen header, 120px photo rows, reference-field warning protection and hidden internal asset keys. Optional-caption linking formulas added to `Approved Site Copy!A440:B500`; existing A1:B439 values and styles were not written. The field manifest now recognizes 61 optional captions; 438 current populated copy fields remain valid with all captions blank. Caption cells in the authority tab remain yellow for owner review.
Required IMAGE fetch permission `importFunctionsExternalUrlAccessAllowed` enabled for this workbook; no workbook sharing change. Official reference: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets#SpreadsheetProperties. It becomes read-only when true; removing thumbnail formulas stops their use, but API rollback cannot unset this property.

## Actual validation

- `npm run check`: 36 files, 0 errors/0 warnings; two existing hints (`photos.ts` unused import, waitlist async suggestion). See `astro-check.txt`.
- `npm run gallery:test`: seven behavior/failure tests pass; blank-caption inclusion, Keep exclusion independent of caption, required alt preservation, malformed/missing/duplicate rows fail closed, immutable dates/IDs, EST suffix/base uniqueness, 99/day limit, all unchecked retention. See `gallery-tests-final.txt`.
- `npm run copy:test`: four existing unit tests plus ten copy regression/negative checks pass, including deliberate rendered mismatch and uncovered prose. See `copy-tests-final.txt`.
- `npm run build`: local fixture build passes; unchanged copy gate verifies 15 pages. The caption/exclusion scenario passes with 60 selected images and 61 retained thumbnails. See `selection-caption-build.txt`.
- `BTF_COPY_SHEET_ID=1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw npm run predeploy:approved-copy`: live read-only Sheet sync + validation + Astro build + rendered copy + gallery verification + site verification + deployability check pass. Final 61/61 selected, CDM1 40/CDM2 21, 61 thumbnails, nine EST IDs, zero pending dates. See `live-predeploy-final.txt`.
- `BTF_GALLERY_PROOF_DIR=docs/proof/2026-10-06_cdm_photo_review node scripts/gallery/verify.mjs`: original inventory/uniqueness/retained-source hashes and delivery verification pass. 100 source files verified unchanged; 427 gallery derivatives; maximum 306276 bytes under 300 KiB; 599 built files, 65618406 bytes, all files under Pages 25 MiB/file. See `originals-verification.txt`, `manifest-verification.json`.
- `BTF_GALLERY_PROOF_DIR=.../all-kept python3 scripts/gallery/browser.py`: 18 route/viewport reviews at 320/375/768/1024/1440/1920; zero failures. Both lightboxes pass keyboard open/arrows/wrap/Escape/close/focus confinement/restoration and mobile targets. No broken images after scrolling, no horizontal scrolling, reserved aspect ratios, lazy loading, heading/alt/focus checks. Desktop widths vary from 18.69–32.24% at 1024, 19.08–32.57% at 1440, 19.32–32.76% at 1920; gallery CLS zero. Far-below-viewport photos defer loading and activate on scroll. See `all-kept/gallery-browser-verification.json`.
- `BTF_BROWSER_PROOF_DIR=.../site-browser python3 scripts/browser-check.py`: 56 site route/viewport checks and interactions; zero failures, including contrast/focus/mobile navigation. See `site-browser.txt`, `site-browser/browser_report.json`.
- `python3 scripts/gallery/review-browser.py`: local caption/exclusion fixture passes at 375/768/1440. Hidden captioned photo absent; kept caption displays; next kept blank-caption photo displays with independent alt; 61 thumbnail links HTTP 200, including hidden photo's thumbnail; focus restored. See `selection-caption-browser.json` and `optional-caption-375.png`/`optional-caption-1440.png`.
- Native Sheet API readback: all 61 checkboxes Boolean/checked, captions blank, formula errors zero, IDs text, thumbnails formulas, headers frozen. Live checkbox test: unchecked CDM2 first photo => blank number; next photo => number 1; IDs unchanged; original checked state restored. See `sheet-verification.json`, `sheet-checkbox-test.json`, `sheet-after.json`. Native Google GUI clipping/fit was not independently rendered; verified dimensions/styles/formulas via API as skill fallback.
- `node scripts/test-guest-journey.mjs`: routes/navigation/CTA/mobile/Escape/skip-link checks pass. `node scripts/test-technical-seo.mjs`: 15 HTML pages and JSON-LD pass. `git diff --check`: clean. Exact outputs retained.

Screenshots: `gallery-viewport-375.png`, `gallery-viewport-768.png`, `gallery-viewport-1440.png`; optional-caption screenshots at 375/768/1440. Full local screenshot sets also retained in all-kept/site-browser. Optional captions use the site's existing lightbox typography/colors and preserve photo aspect ratio.

## History and rollback

Canonical rules updated first for Keep, Caption and date/EST policy; AGENTS wrapper follows them. Both required logs appended: `docs/BUILD_LOG.md` and `/Users/jkbrookspersonal/JBLocalBuildLogs/00_GENERAL_BUILDLOG.md`. Material new review/automation/permission dependencies and pre-activation warning appended to `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_A.SYSTEMS_CHANGES_REGISTER/SYSTEM_CHANGES_REGISTER.md`.
Before-state retained at base commit 1785d5f and `sheet-target-before.json`. Preserve latest owner review data before any rollback. Revert only the infrastructure commit, keeping the separate d958c83 copy refresh. Coordinate clearing only A440:B500 and archiving new tabs with the source revert, after checking newer edits; keep all photos/IDs and original assets. External URL permission cannot be unset through the API. Main remains unchanged and there is no new deployment to roll back.

No DNS change, public-domain cutover, Framer change, Wrangler deployment, Pages configuration change, secret change, main push or public production deployment occurred in this infrastructure task.
