# BikeTourFrance native Astro build and deploy runbook

Verified 2026-10-06 against GitHub main and read-only Cloudflare Pages API. This is the current procedure; older v2.3/v2.2 documents are historical. Owner authorized this reconciliation and the specific CDM 47-photo publication.

## Current facts

- Root: `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT`.
- GitHub: `https://github.com/jkbrooks1/biketourfrance.git`; production branch `main`.
- Pages: `btf-production`; both production-branch fields are `main`, preview branches `all`.
- Build remains `npx astro build`, output `dist`, root `.`. Do not change settings, secrets, DNS or domain routing.
- Pages domains include `btf-production.pages.dev`, `biketourfrance.net`, `www.biketourfrance.net`. A main push can update the public website. Old statements that the domain remains on Framer or branch alignment is pending must not be acted on.
- Before this release, production deployment `64240a36-ecc3-4d0f-a0ec-d4de34ad78c1` serves commit `1785d5f45dcd71bb84fb1f4c4c635e8485a3e96d`. Re-read before any later release.
- Proof: `proof/2026-10-06_cdm_gallery_publish/project-before.json`.

## Authority and preservation

Read `00_PROJECT RULES.md` and the single global systems-change register first. Work on a descriptive feature branch based on current verified main. Preserve existing changes; never stage unrelated files or rewrite main history. This release uses the existing `feature/cdm-combined-gallery` branch and a selective pre-editorial checkpoint. Preserve older untracked evidence and unrelated closeout edits separately; a dirty tree is not permission to publish everything in it.

All public prose and alts come from `BTF_Approved_Site_Copy`, tab `Approved Site Copy`, id `1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw`. Caption and Keep/Delete decisions come from `CDM Photo Review`. Do not weaken the copy gate. Snapshot written Sheet ranges before and after, preserving formulas, validation, newer decisions and metadata. IDs, capture-date/EST and GPS/estimated-location evidence remain stable. Only owner-approved image derivative changes are permitted; retain originals.

## Local validation and preview

Run `npm run check`, `npm run canonical:check`, `npm run verify`, `npm run copy:test`, and relevant gallery tests. `npm run build` is a fixture-mode local build, not a live-Sheet release gate. Finish with:

```sh
export BTF_COPY_SHEET_ID=1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw
npm run predeploy:approved-copy
```

The gate must validate the live Sheet, build and verify rendered copy, gallery selection and deployability. Review generated source and fixture diffs. Check public source/copy/output for prohibited personal information. Never print credentials.

Review all six gallery viewports, order/count/uniqueness, every alt, images and links, keyboard/focus/touch, dimensions/lazy delivery, derivative budgets, CTA and three cold mobile lab loads. Preserve command output and screenshots. The shared Button label limit is 42 visible characters; long CTA prose belongs in a paragraph with an existing short approved Button label linking to `/waitlist-2027/`.

Commit only intended files. Push the feature branch through GitHub to create a Pages preview; never use Wrangler direct upload. Wait for the matching preview SHA to succeed, record URL and deployment ID, and validate its served gallery before merging. Pages builds committed generated copy, does not read the Sheet, and does not itself enforce the approved-copy gate.

## Approval, main merge and production

Obtain owner publication approval after a reviewable result unless explicit approval already covers the exact changes. The owner's `v01_CDM_GALLERY_PUBLISH_CODEX_PROMPT` grants advance approval for its enumerated editorial changes and publication, subject to passing all checks. Do not request the same approval again. Scope questions must be resolved before publishing affected changes.

Fetch current main and stop on merge conflicts. Merge the validated feature into main with a normal merge commit, preserving unrelated local changes outside the release. Push main without force. Wait for the matching GitHub approved-copy check and `btf-production` production deployment to succeed; record merge SHA, deployment ID and URL. Do not infer a live release from a build or preview success.

Fetch and inspect `https://btf-production.pages.dev/cdm-photo-gallery/` and `https://biketourfrance.net/cdm-photo-gallery/`. Verify the intended count, exact order/identity/alts/CTA/lead image, every image and controls, and three cold mobile lab loads on each host serving the new build. If the public host serves another build, report that and stop; no domain cutover is authorized.

## Failure and rollback

Stop on copy-gate, re-audit or regression failure before merge; preserve output and report. Never bypass validation. After deployment, if the new build has a wrong count, broken images or failed regression, revert the release merge with a new `git revert -m 1 <merge-sha>` commit, push normally, verify the revert deployment, then stop and report. No force-push. Coordinate Sheet rollback with its before snapshot after checking newer owner edits; restore only release-touched cells. Retain all originals and IDs. No DNS rollback is part of this release.

## Logs and evidence

For this run, append START, Sheet complete, build/re-audit complete, main merge, post-deploy complete and any STOP entries to `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_GENERAL_BUILD_LOG.md`, `00_BUILD_LOG.md`, `docs/BUILD_LOG.md`, and `/Users/jkbrookspersonal/JBLocalBuildLogs/00_GENERAL_BUILDLOG.md`. Never use the deprecated TEMP log. Record material dependencies in the single global register. Preserve real timestamps, SHAs, evidence paths and pass/fail status; never rewrite older entries.

New release evidence: `proof/2026-10-06_cdm_gallery_publish/`. Prior combined-build evidence: `docs/proof/2026-10-06_cdm_combined_gallery/`; `proof/2026-10-06_cdm_combined_gallery/REPORT.md` points to its handoff. Archive any scripts created in `/Users/jkbrookspersonal/00_SCRIPTS/` with two-digit version prefixes, and archive the owner prompt there. No secrets in artifacts.
