The CDM photo review controls are in the existing [BTF_Approved_Site_Copy workbook](https://docs.google.com/spreadsheets/d/1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw/edit).

Open [CDM1 Photo Review](https://docs.google.com/spreadsheets/d/1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw/edit#gid=61061001) or [CDM2 Photo Review](https://docs.google.com/spreadsheets/d/1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw/edit#gid=61061002).

## Using the sheet

- Check **Keep** to include the photo. Uncheck it to hide the photo from its gallery and the landing page in the next validated build. The original and review thumbnail remain retained.
- **Caption** is optional. A blank Caption never hides a checked photo. Captions display below the image in the lightbox; existing factual alt descriptions remain independent.
- **Lightbox number** updates immediately to the checked-photo sequence. The live site's numbers follow after the corresponding build is published.
- **Photo ID** is permanent. Known dates use ten digits `YYYYMMDDXX`; estimates add `EST`, for example `2026090202EST` (13 characters). Keep changes do not change IDs. Both collections share the daily counter, 01–99. The system stops rather than inventing a longer ID when a day exceeds 99 allocations.
- Date basis, confidence and evidence are shown to the right. An estimate is an inference, never recovered EXIF metadata. Low-confidence estimates need owner review. Request an explicit correction if a date or ID is wrong.
- Edit only Keep and Caption. Do not delete or reorder rows or change generated reference fields. Stable filename order remains the gallery reading order; Photo IDs do not change that order.

## Activation

The tabs and local implementation are ready on `feature/cdm-photo-review-sheet`. They have not been merged into main or deployed. Keep changes currently have no effect on the public galleries. Wait for publication before entering captions: the public main branch still has the older field manifest, so a new nonblank caption would cause its existing copy sync to fail validation until this feature is integrated.

Once owner-approved publication is complete, the existing hourly scheduled-copy-sync workflow reads Keep and Caption alongside approved copy, validates/builds, commits the changed review/copy snapshot and triggers the existing Git-connected Pages deployment. The existing schedule, credentials and Pages build command are unchanged. A manual workflow dispatch or a validated maintainer release can publish sooner. Nothing changes on the site merely because a checkbox was clicked; the validated build must be published.

## Maintainer workflow

```sh
npm run check
npm run gallery:test
npm run copy:test
npm run build
BTF_COPY_SHEET_ID=1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw npm run predeploy:approved-copy
```

`npm run build` explicitly uses local fixtures and cannot be deployed. The production check uses the existing service account with read-only scope and fails if the review tabs, rows, checkbox booleans, assigned IDs, date evidence, linked captions or approved copy are invalid. It saves `src/data/cdm-gallery-review.json`, the stable ID registry, fixtures and optional caption field definitions before the unchanged copy gate builds and verifies pages. `gallery:verify` additionally verifies inclusion, IDs, caption hashes, route assignments, reserved dimensions and retained originals/thumbnails. Required alt fields remain required in the source Sheet; only explicitly unchecked photos lose their gallery route association. The copy gate itself is unchanged.

Optional caption formulas occupy `Approved Site Copy!A440:B500`. A field name and value remain blank while the corresponding Caption is blank; the older main manifest therefore still accepts the unchanged 438 populated copy fields. The 61 optional caption fields become recognized when this feature is published. Do not overwrite these linking formulas or the existing A1:B439 copy values.

The review uses native Boolean checkboxes and `IMAGE` formulas for public 320px WebP thumbnails. Loading these required enabling this workbook's `importFunctionsExternalUrlAccessAllowed` property. Google documents that this can be enabled when false and is read-only when true; removing the IMAGE formulas stops thumbnail use, but this permission cannot be reset through that API. See [Google's spreadsheet-property reference](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets#SpreadsheetProperties). No sharing permissions or secrets were changed.

`/cdm-photo-gallery/review-thumbnails.json` retains thumbnails for all 61 library photos even when unchecked. Gallery manifests contain only checked photos. Hiding a photo is editorial exclusion, not private-media deletion; its review thumbnail remains public and its original remains in Git.

The initial registry contains 52 dates from DateTimeOriginal and nine explicit estimates. Known-date counters were allocated in timestamp order; estimates were appended by stable source order after existing allocations for the same date. Later additions must append counters rather than renumber existing photos. Source photo bytes and their original capture metadata are unchanged.

## Validation and rollback

Evidence and exact source exceptions are in [the implementation report](proof/2026-10-06_cdm_photo_review/REPORT.md). The scenario test proved that a caption cannot include an unchecked photo, checked photos with blank captions still appear, and checked captions appear in the lightbox. The Sheet checkbox/numbering test was restored to all checked.

Before activation, keep the tabs and this branch available for review. To withdraw the infrastructure, preserve the latest review values and clear only A440:B500 after checking for newer owner edits; archive the review tabs rather than discarding decisions. Revert the infrastructure commit separately from the preceding live-copy refresh commit. After activation, coordinate the source revert and formula removal before running the older copy pipeline. Retain all original assets and preserve the four unrelated current Sheet copy edits. Publication/rollback to main still requires owner authorization; do not reset main or alter Pages/DNS settings.
