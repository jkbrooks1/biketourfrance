# BTF approved main deployment closeout

Verified current main is already successfully deployed. No new deployment or Pages settings write was necessary.

- Canonical repository: /Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT
- Local main, GitHub main and deployed commit before/after closeout: `d9895e66b65c7a3118f4d612212b08a7c812a052`.
- Both btf-production production branch fields: `main`.
- Stable URL: https://btf-production.pages.dev
- Exact deployment: https://9aad66bd.btf-production.pages.dev (`9aad66bd-59c3-4810-a82c-ce335874b942`).
- Completed successfully: 2026-10-06T03:11:48.18403Z (2026-10-05 20:11:48 PDT).
- GitHub approved-copy check: https://github.com/jkbrooks1/biketourfrance/actions/runs/37407707451 — success.
- Build settings remain npx astro build, dist, root ., Git source jkbrooks1/biketourfrance.

## Shared copy repaired

Before: 438 fields, including 84 new gallery draft fields that main's 354-field manifest could not accept.
After: restored only A356:B439 to recorded pre-gallery values/formats after verifying no newer edits. All original 354 data values match the before snapshot exactly. The Sheet and tab remain unchanged.

Gallery field values and yellow-cell formatting are preserved in sheet-preserved-gallery-state.json and sheet-preserved-gallery-cells.json. Confirmed restored Sheet: sheet-restored-confirmed-main.json. First request failed argument binding without mutation; sheet-after-rejected-rollback-attempt.json records that intermediate state. The subsequent correctly bound restoration succeeded and was verified.

## Validation

- Isolated committed-main checkout: /private/tmp/btf-main-deployment-20261006; active gallery workspace untouched.
- Live-Sheet `npm run predeploy:approved-copy`: PASS, 354 fields, 12 pages. Command output: main-predeploy-final.txt.
- Generated approved-copy.ts matches committed main byte-for-byte (SHA-256 b6d3fbec8500f7f01f7156c10641cd62291bf098c32f8abff9c477e64f88201a).
- Stable-host HTML for all 12 pages exactly matches the pinned deployment; 144 links/assets pass; ordinary nonexistent route returns 404 at both hosts. Direct /404.html correctly returns 200. An underscore-heavy diagnostic path returned 403; the ordinary missing-route probe verifies native 404 behavior. Evidence: served-main-verification.json and served-main-verification-final.txt.
- Existing unchanged approved-copy rendered gate run against downloaded live HTML: PASS, 12 pages and 353 route-used fields from the 354-field snapshot. Output: served-copy-check.txt.
- No gallery draft access link/content was found in served main HTML.
- First isolated build failed when Intel Python spawned Intel Node against ARM64 native dependencies. Native ARM64 Node rerun passed; no dependency, lockfile, copy-gate or build-command changes were made.

## Preservation and boundaries

Owner clarified “yes” approved Pages main/deployment, not gallery-related rules/branch repairs. The earlier interpretation was incorrect. Gallery work is stopped. All existing source changes remain uncommitted on feature/cdm-photo-gallery; no unrelated files were discarded or published. Independent draft archive: /private/tmp/btf-gallery-draft-preserved-20261006.tar.gz (297634531 bytes). Gallery preview PID 85934 was stopped.

No new deployment was triggered: current main had already completed through Git integration. No main push, Pages PATCH, DNS, live-domain routing, Framer, Wrangler upload or secret change occurred in this closeout. Existing public-domain associations were preserved.

Before/after main and deployment are unchanged, so no deployment rollback is needed. Sheet repair can be reversed using saved draft cell data only after checking newer owner edits and coordinating the gallery manifest; restoring those 84 draft rows alone recreates main's incompatibility. Do not apply the stale old-remediation branch rollback plan. Before resuming gallery development, deliberately reconcile and restore the saved draft fields with its local fixture/manifest.

History entries appended to docs/BUILD_LOG.md, /Users/jkbrookspersonal/JBLocalBuildLogs/00_GENERAL_BUILDLOG.md, and /Users/jkbrookspersonal/LocalSiteBuildFiles/00_A.SYSTEMS_CHANGES_REGISTER/SYSTEM_CHANGES_REGISTER.md.
