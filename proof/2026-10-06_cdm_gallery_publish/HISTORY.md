# CDM Gallery Publication — STOP report

Timestamp: 2026-10-06T16:58:39Z
Root: `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT`
Branch: `feature/cdm-combined-gallery`
Before and after commit: `fec3e7f879875a90bab4e0c6edf18bfcd5728b9d` (no commit made in this run).

## Result: STOPPED during prerequisite inspection

Owner publication approval was received. No editorial, Sheet, image, code, commit, push or deployment action was performed in this run. Only read-only inspection and this STOP evidence/logging were performed. Pre-existing work has been retained.

## Blockers and contradictions

1. Required `docs/BUILD_AND_DEPLOY_RUNBOOK.md` does not exist: `cat` exited 1, “No such file or directory”. The available `docs/BTF_BUILD_AND_DEPLOY_RUNBOOK_v2.3.md` identifies itself as v2.2 and says both Pages production-branch fields still point to `rebuild/2026-10-02-audit-remediation`, with alignment to main pending approval. It also says the public domains remain on Framer. Those statements contradict the owner's prompt and newer canonical rules/register. The prompt explicitly requires STOP rather than choosing between conflicting procedures. No settings alignment or domain change was attempted.
2. Required `proof/2026-10-06_cdm_combined_gallery/REPORT.md` is absent. The alternative `docs/proof/2026-10-06_cdm_combined_gallery/REPORT.md` is also absent. Earlier gallery implementation remains without its final handoff report; no prior completion report was fabricated. Actual location evidence exists at `docs/proof/2026-10-06_cdm_combined_gallery/audit/locations.json`.
3. The requested clean working tree was not confirmed: tracked source, data, rules and documentation edits, a deleted legacy route, and many untracked evidence files remain. Exact initial state is retained in `git-status-before.txt`. No unrelated file was discarded, staged, committed or published.

## Approved sections: execution status

- Page identity / metadata: NOT DONE in this run.
- Two Delete?=Y edits: NOT DONE; no Sheet writes.
- IMG_4528 reversible derivative crop: NOT DONE; originals and derivatives untouched.
- Lead tile and exact 47-photo order: NOT DONE in this run.
- All 47 approved alt replacements: NOT DONE; no Sheet writes.
- Future-tour CTA: NOT DONE.
- Sheet snapshots, build, predeploy and targeted re-audit: NOT RUN in this run; earlier results are not represented as validation of these new changes.
- Cloudflare preview: NOT CREATED; URL unavailable.
- Main merge / push: NOT DONE; merge SHA unavailable.
- Production deployment: NOT STARTED; deployment ID unavailable.
- Live post-deploy validation: NOT RUN; no new live verification claim.
- Prompt/script archival: NOT DONE before prerequisite STOP; no reusable script created in this run.

## Logging

Start and STOP entries appended to the owner-requested `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_GENERAL_BUILD_LOG.md`, existing `00_BUILD_LOG.md`, canonical project `docs/BUILD_LOG.md`, and canonical general `/Users/jkbrookspersonal/JBLocalBuildLogs/00_GENERAL_BUILDLOG.md`. A warning was appended to the single canonical systems-change register because the stale deployment procedure is a future operational hazard. No log history was rewritten.

## Rollback and resumption

No publication rollback is needed for this run. Preserve the existing feature changes and all review decisions. Before resuming, obtain owner direction to reconcile the deployment runbook with verified current deployment facts, finish the missing earlier combined-gallery report, and checkpoint only intended pending gallery changes while preserving unrelated files. Do not silently substitute a procedure under the prompt's explicit conflict STOP rule.

No DNS, domain cutover, Cloudflare project settings, secrets, build configuration, Framer work, Wrangler upload, main history rewrite, or public deployment occurred.


## 2026-10-06T17:27:17.401241+00:00 — Authorized resumption; STOP on live pre-change gate failure

Owner authorized runbook reconciliation, missing prior report and pending-gallery checkpoint. Current Cloudflare GET verified both production branch fields main, unchanged build npx astro build/dist/root, existing public domains, and successful canonical deployment 64240a36-ecc3-4d0f-a0ec-d4de34ad78c1 for main1785d5f. Evidence: project-before.json/deployments-before.json. No Cloudflare write.

DONE: new docs/BUILD_AND_DEPLOY_RUNBOOK.md; old docs/BTF_BUILD_AND_DEPLOY_RUNBOOK_v2.3.md marked historical; publication authorization recorded in canonical rules; prior docs/proof/2026-10-06_cdm_combined_gallery/REPORT.md and proof-root pointer written; pending closeout notes preserved byte-for-byte under preserved-local/. New helper archived at /Users/jkbrookspersonal/00_SCRIPTS/v01_cdm_gallery_publish_evidence.py.

Read-before-write native Sheet snapshot saved as sheet-before.json. No Sheet cells were written. Pre-change npm run predeploy:approved-copy exited 1 in gallery:sync because these retired fields have blank live copy but remain required in the field manifest:
- `/cdm-gallery-cdm1/meta_description`
- `/cdm-gallery/cdm2_heading`
- `/cdm-gallery/cdm2_intro`
- `/cdm-gallery-cdm2/meta_title`
- `/cdm-gallery-cdm2/meta_description`

Actual failure output: baseline-predeploy.txt. The owner prompt expressly says STOP if npm run predeploy:approved-copy fails. No gate weakening, replacement text or stale fallback was used. No editorial changes, crop, preservation commit, feature push, preview, main merge, public deployment or live-release verification was performed after the failure. SHA remains fec3e7f879875a90bab4e0c6edf18bfcd5728b9d.

Required next action: retire the five unused legacy fields in the data manifest (optional/no rendered route), retaining their stored Sheet values and the unchanged copy gate, then rerun the live gate. This aligns the schema with the approved combined-page removal of separate CDM1/CDM2 metadata. Separately, publication scope for the four earlier non-gallery Sheet refreshes remains pending owner clarification. Prompt archival is not yet done; execution stopped at prerequisites. All originals, permanent IDs, dates, ten location estimates, existing owner review choices and unrelated local files remain preserved.

Resumption START and this STOP appended to the four required build logs; operational warning appended to the one systems register. No DNS/domain routing/settings/secrets/build configuration/Framer/Wrangler changes occurred.


## 2026-10-06T17:31:30.336919+00:00 — Sheet compliance repair verified PASS

Owner asked “can you fix the sheet so it is compliant?” Re-read native metadata and target cells before writing. Filled only B363:B367 (the five blank required legacy fields) using the exact combined title, intro and description already approved in the publication prompt. Kept required=true and the copy gate unchanged. The previous proposed optional-field schema repair was not used. The intermediate check then identified the old 47-character combined meta description outside the existing 50–200-character policy; aligned B356:B362 with the same approved combined-page title/intro/description, including obsolete stored headings/titles. No invented prose.

Native before/after readback verified all twelve changed values, unchanged keys/formats, untouched neighboring row, and unchanged review inputs (Keep/Delete/Caption/IDs/date/location). Best-effort visual verification used native formatting data: existing Arial 11/wrap/top-aligned formats retained; authenticated GUI rendering was not independently inspected. No Sheet-wide layout changes.

Evidence: sheet-compliance-before.json, sheet-compliance-after.json, sheet-identity-before.json, sheet-identity-after.json. The original short-description failure is retained in sheet-compliance-predeploy.txt. Final npm run predeploy:approved-copy exited 0, with copy:validate OK: 438 fields from sheet; copy:verify-rendered OK: 13 pages, 437 fields confirmed; gallery:verify PASS: 49/49 eligible shown, 0 Delete?=Y, 61 IDs and thumbnails retained; canonical-root PASS; verify-dist: 13 pages OK; predeploy OK: dist/ matches a current snapshot of BTF_Approved_Site_Copy and is deployable. Full output: sheet-compliance-predeploy-final.txt. Generated approved copy and deterministic fixtures reflect the repaired live Sheet.

This resolves the five-field/short-description Sheet compliance blocker. It does not claim the 47-photo editorial release is published: the two removals, crop/order/alt/CTA edits, preview, merge, production deployment and post-release verification remain pending. Four earlier non-gallery live-Sheet refreshes still require scope clarification against the gallery-only publication guardrail. No originals or photo-review choices changed; no commit, push, DNS, Pages settings, public routing, Framer or Wrangler action in this repair. All required logs appended.


## 2026-10-06T21:54:17.081256+00:00 — 47-photo editorial build retained; STOP on exact CTA brand conflict

Owner reiterated “publish the site now.” Pre-editorial checkpoint committed locally as `2c8152e3f05b186661f8c6723b0f972a73579f8c`. The existing four previously stored approved-copy refreshes are included in the current Sheet-backed site state; no additional non-gallery Sheet wording was written in this run.

DONE: exact47 owner order (all49 review rows retained), 47 verbatim alts, only IMG_4470.JPG and IMG_4497.JPG Delete?=Y, removed alts unchanged, optional captions blank, immutable IDs/dates/ten estimated locations verified unchanged by native readback; approved future-tour CTA at Approved Site Copy row501; existing green Button linking to /waitlist-2027/; one-third desktop lead tile with eager/high priority and other46 lazy. Reversible IMG_4528 crop recorded in src/data/cdm-gallery-editorial.json: EXIF-oriented3024×4032 original, top-left0,0 full-width3024×3620 retained,412 bottom pixels removed, Astro Sharp top-anchored cover at each responsive width. Every original/thumbnail retained. Crop visual proof and final performance not yet run because release gate stopped first.

Native Sheet rollback/evidence: sheet-editorial-before.json, sheet-editorial-after.json. Exact release policy/order/alts/crop: src/data/cdm-gallery-editorial.json. New helper scripts archived in /Users/jkbrookspersonal/00_SCRIPTS/ with v01 prefixes. Prompt archival remains pending.

`npm run predeploy:approved-copy` failed only in the final site validator: `verify-dist: 1 problem(s) — /cdm-photo-gallery/: brand written as "Bike Tour France"`. Earlier output confirms `copy:verify-rendered OK: 13 pages,438 fields confirmed` and `gallery:verify PASS:47/49 eligible shown;2 Delete?=Y;61 permanent IDs and61 thumbnails retained`. Full output: editorial-predeploy.txt. The exact owner-approved future-tour CTA contains that phrase. scripts/verify-dist.mjs enforces joined BikeTourFrance branding; it was not bypassed or altered. Owner prompt explicitly requires STOP on failed predeploy. No feature push/preview/main merge/deployment/post-deploy claim.

Required resolution: authorize a gallery-only exception for the exact owner-approved Sheet CTA in the brand validator, retaining enforcement elsewhere and the unchanged approved-copy gate. Alternatively authorize revised CTA spelling; do not change owner-verbatim copy silently. All editorial changes, prior unrelated local files and historical evidence remain retained. Required logs and the single register appended; no DNS, settings, cutover, secrets, Framer or Wrangler changes.
