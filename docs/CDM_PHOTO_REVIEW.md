The active controls are in [CDM Photo Review](https://docs.google.com/spreadsheets/d/1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw/edit#gid=61061003), in the existing BTF_Approved_Site_Copy workbook.

## Using the sheet

- **Keep** checked and **Delete?** blank or N: include the photo on the next published build.
- **Delete? = Y**: remove the photo from the gallery even when Keep is checked or Caption is filled. Lowercase y works too. Clear Y and check Keep to restore it. This removes gallery inclusion, not the source file, review row, or retained public review thumbnail.
- **Caption** is optional and never determines inclusion. It appears in the lightbox; the factual alt description remains independent. Captions follow the existing Approved Site Copy gate.
- **Lightbox number** updates immediately in the Sheet, skipping unchecked or Y rows. Website numbers follow the next published build. **Photo ID** is permanent: ten digits YYYYMMDDXX, or YYYYMMDDXXEST for an explicit estimate. All 61 earlier assignments stay reserved, including the 12 retired photos. Never renumber an ID to close a gap; the daily counter stops at 99.
- Edit only Keep, Delete? and Caption. Do not delete/reorder rows or edit generated reference fields. Invalid decisions, unknown assets, altered IDs/dates/evidence, missing rows or mismatched captions stop the build rather than silently using old data.

## Eligible folder and order

The single combined gallery has 49 eligible unique supported photos in `/Volumes/JB_Tier2Storage/CDM1and2`. All are byte-identical to originals already retained in `src/assets/cdm-gallery/cdm1` or `cdm2`, so importing a second copy is unnecessary. The content-hash selection is in `src/data/cdm-gallery-selection.json`; the full 61-photo managed library remains in `src/data/cdm-gallery-manifest.json` for recovery. The 12 photos absent from the new folder cannot be added by editing this review tab.

`python3 scripts/gallery/group-by-location.py` generates the location sidecar from retained GPS results and documented estimates; builds do not call geocoding APIs. `python3 scripts/gallery/select-combined.py` recursively inventories and validates the mounted folder, checks file and orientation-normalized pixel hashes, matches managed originals, and writes selection/proof files. Unknown new photos stop selection pending proper asset import and approved factual alt text. Mounted originals are never edited. Supported corrupt files stop generation; exceptions are recorded. No deployed symlink depends on the mount.

Order is GPS municipality from west to east, combining photos from both tours at each place, then capture date/counter within each group. There are 39 GPS-based location assignments and 10 owner-authorized approximate location assignments across 22 groups. M:P in the review tab show group, GPS/Estimated basis, confidence and evidence. All 39 retained GPS positions were resolved using IGN nearest-address results or the government containing-municipality API for rural positions. No coordinates are invented for estimates. Location estimates are separate from the 40 EXIF-based capture dates and nine estimated dates. Estimates are not recovered metadata. This grouping is repeatable and authorized, but estimates do not establish exact landmark positions. Public display keeps one continuous masonry/lightbox sequence; named locations and evidence are shown in the review Sheet and manifest. Separate public location headings would need approved-copy fields. The owner-approved 47-photo editorial sequence in src/data/cdm-gallery-editorial.json now overrides date order within the contiguous geographic groups. IMG_4470.JPG and IMG_4497.JPG have Delete?=Y; their originals and review rows remain. After regenerating selection, run python3 scripts/gallery/v01_editorial_order.py to restore this approved sequence. IDs remain unchanged.

Earlier CDM1/CDM2 review tabs remain hidden with their prior owner decisions intact. Their snapshot included 40 checked CDM1 photos and nine checked CDM2 photos. The new authoritative folder selection starts all 49 eligible photos checked and Delete? blank, as requested; it supersedes earlier exclusions only for this new active gallery. No old rows were discarded.

## Activation and build

The Sheet controls and the 47-photo editorial build are tested. Activation follows the owner-approved feature preview and normal main merge. See ../../proof/2026-10-06_cdm_gallery_publish/REPORT.md for the actual publication SHA and host verification; a local build alone does not activate Sheet controls.

After owner-approved publication, the existing hourly scheduled-copy-sync workflow reads the active tab, validates copy and review data, persists snapshots and triggers the existing Git-connected btf-production build. The schedule, read-only service-account scope, secrets and Pages settings/build command are unchanged. A Sheet edit takes effect only when its validated build is published.

```sh
npm run check
npm run build
npm run copy:test
npm run gallery:test
BTF_COPY_SHEET_ID=1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw npm run predeploy:approved-copy
BTF_GALLERY_PROOF_DIR=docs/proof/2026-10-06_cdm_combined_gallery node scripts/gallery/verify.mjs
```

`npm run build` uses local fixtures and cannot be deployed. Production verification reads the live Sheet without stale fallback and runs the unchanged approved-copy gate. Do not deploy a fixture build. Field route associations reflect Keep and Delete?; all factual alt fields stay required at source. Optional Caption links remain in Approved Site Copy!A440:B500. The 49 eligible links now reference Caption column D on the combined tab; 12 archived links retain their earlier hidden-tab references. The editorial release updates approved gallery identity and 47 factual alts, retains the two removed-photo alts, and adds the future-tour CTA at A501:B501. Native before/after snapshots preserve the exact changes; formats and existing required-field checks remain unchanged.

The public manifest renders only eligible, checked photos without Y. `/cdm-photo-gallery/review-thumbnails.json` retains all 61 library thumbnails, including archived and hidden photos; its `active` flag identifies the 49 current folder photos. Removal is editorial exclusion, not private-media destruction. Native Boolean checkboxes and IMAGE formulas reuse the workbook's already-enabled external-image permission; this task did not change that permission or sharing.

The gallery route is `/cdm-photo-gallery/`. Four native Pages `_redirects` rules send CDM1/CDM2 legacy URLs, with or without a trailing slash, to that route. Existing header, homepage, More tour photos and final footer links continue to use the same combined route. This changes website paths only; DNS and public-domain settings are untouched.

## Validation and rollback

Evidence: [combined-gallery report](proof/2026-10-06_cdm_combined_gallery/REPORT.md), [editorial audit](CDM_PHOTO_GALLERY_AUDIT.md), native before/after snapshots and Delete? numbering test, a local 48-photo Y/caption scenario, browser/lightbox tests, source/delivery hashes and live-Sheet build logs. The earlier Delete? test was restored to blank. The later owner-approved release marks exactly IMG_4470.JPG and IMG_4497.JPG Y, leaving 47 included photos and all 49 review rows.

Rollback starts from preserved main1785d5f and prior review commit ec95a833, joined in fec3e7f before this change. Preserve newer Sheet decisions before reverting source or formulas. Restore only the 49 linking formulas from sheet-before.json, unhide the earlier tabs, and archive the combined tab without destroying its decisions. Reverting all photo-review infrastructure additionally requires coordinated removal of A440:B500 links before using the old main pipeline. Preserve the unrelated four-field copy refresh d958c837, old dirty closeout notes, all originals and the complete ID registry. No main reset or Cloudflare/DNS change is needed; production rollback still needs owner authorization.
