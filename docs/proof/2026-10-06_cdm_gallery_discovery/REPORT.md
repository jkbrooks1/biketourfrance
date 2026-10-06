# CDM gallery discovery update — 2026-10-06T14:09:35.730330+00:00

Before: main/GitHub `20bfe12e7c8d4400ef239c81c88c0f41e51fcbaa`. Feature branch: `feature/cdm-gallery-discovery`.

The owner requested easier discovery and directed “More tour photos” to the gallery. The homepage now has a CDM Photo Gallery button directly below its headline, visible before scrolling at 320, 375, 768, 1024, 1440 and 1920 px. The main menu adds the existing Sheet-backed Tour Gallery label; More tour photos goes directly to `/cdm-photo-gallery/`. That page renders both collections immediately, 40 CDM1 + 21 CDM2, with no additional page selection required. Collection shortcuts scroll within the page. Existing standalone collection routes are retained. Footer still has one final CDM Photo Gallery link. Tablet navigation uses existing spacing tokens and 14px type with 44px minimum targets to preserve the 64px header.

Both gallery instances use collection-specific description and dialog IDs. Photo originals, derivatives, alt fields, order, counts and approved Sheet values are unchanged.

Validation commands and actual output are alongside this report:

- `BTF_COPY_SHEET_ID=… npm run predeploy:approved-copy`: live Sheet snapshot, 438 fields; rendered gate confirms 437 route fields, 15 pages; deployable.
- `npm run check`: 0 errors, 0 warnings, 2 existing hints.
- `npm run copy:test`: 4 library and 10 negative checks passed.
- `node scripts/gallery/verify.mjs`: landing 61 / CDM1 40 / CDM2 21, unique IDs and original order; all 100 source hashes unchanged, 427 derivatives validated, largest 306276 bytes.
- `node scripts/test-technical-seo.mjs`: 15 pages passed.
- `node scripts/test-guest-journey.mjs`: routes and links passed, zero blockers.
- `BTF_BROWSER_PROOF_DIR=… python3 scripts/browser-check.py`: 56 route/viewport cases, zero failures. An initial interrupted-build run timed out; final stable-build run passed.
- `python3 …/check-discovery.py http://127.0.0.1:4321`: six widths, both on-page galleries, 61 distinct IDs, one-click homepage/menu/More tour photos navigation, no overflow, preserved desktop/tablet header heights, unique ARIA targets, dimensions/lazy loading/alt text, four keyboard/focus lightbox checks; zero failures.

Before/after visual proof: prior published-gallery proof is in `../2026-10-06_cdm_gallery_publication/`; current local screenshots and JSON are in `local/`. Production verification will be recorded in `live/` after Git-driven release. Preview/build server is temporary and will be stopped.

Rollback: revert the forthcoming discovery commit via Git and publish through the existing pipeline. No Sheet rollback is needed because this update only reuses existing approved fields. Prior gallery publication remains available at the before commit. Existing unrelated/untracked release evidence is preserved.

Both required build logs appended. The systems register was read; this routine content/navigation update adds no infrastructure dependency, so no system entry is required. No DNS, Pages settings, build commands, secrets, public-domain routing, Framer or Wrangler changes. Publication uses the previously approved gallery GitHub/main workflow.
