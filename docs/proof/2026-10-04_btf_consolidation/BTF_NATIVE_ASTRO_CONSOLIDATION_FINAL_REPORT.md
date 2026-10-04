# BTF Native Astro Consolidation — Final Report

**Completed:** 2026-10-04  
**Production deployment:** Not performed

## Final active project

- Local root: `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT`
- Branch: `rebuild/2026-10-02-audit-remediation`
- HEAD: `d394f730e8c65b2d263a29c8dd0d2ac29c91fa3c`
- GitHub remote: `https://github.com/jkbrooks1/biketourfrance.git`
- Cloudflare Pages relationship: project `temp-btf`; production branch remains `main`.

The final root is a standalone Git clone and has no Git-worktree dependency on a retired directory. Native local planning, proof, and generated-copy material was restored from the verified preservation set. Wrapper/Framer material was not merged into the native Astro source.

## Archived former roots

Archive parent: `/Users/jkbrookspersonal/LocalSiteBuildFiles/99_ARCHIVE/BTF_MIGRATION_2026-10-04`

- `wrapper-checkout-rebuild-initial`
- `stale-checkout-btf-migration`
- `native-retired-worktree-files`
- `incomplete-scaffold-BTF_MV_BTF_TO_CLOUDFLARE_PROJECT`

The verified preservation set remains separate and must be retained:
`/Users/jkbrookspersonal/BTF_PRESERVATION_20261004T134432Z_02`.

## Drive authorities

- BTF Website parent: `1azP1B1_ybQHS6Rtxn0R1W8ZELwFl8_wq`
- New BTF Migration folder: `1XmvuhM_iyMbZWPf5qH1TqvaHmtaCMW2R`
- Subfolders: Source Assets (`1lrugCFejJaE3QBUImGcA0CdLzXTEokBC`), Reviews and Briefs (`1pr8PwCiyMPK1GN9u0wgXcJ_nGV_eADF-`), Handoffs (`1q2kzPCgIl4CJbhmv0J0GX9gUFkQQBxSJ`)
- Approved copy: `BTF_Approved_Site_Copy`, ID `1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw`, unmoved in `OO_BTF_GOOG_SITE_ROOT` (`1-acJrUL2VjIndc0yAXP96vBz5HebH01U`).

No sharing, production, DNS, Cloudflare configuration, or approved-copy Sheet change was made.

## Verification

- Preservation proof ZIP re-verified before transition; SHA-256: `3a611ddd86b15af27ae8269cae10e62dd5cca4018b8a6dc7df2f73a03649bd16`.
- Both Git recovery bundles verified successfully.
- Node `v24.14.1`; npm `11.17.0`; lockfile installation via `npm ci` passed.
- `npm run build`: passed.
- `npm run check`: passed with zero errors and one non-blocking unused-import hint.
- `BaseLayout.astro` imports `src/styles/global.css`; Astro generates the native route set and does not serve the archived Framer export.

## Remaining blocker

The approved-copy gate remains inactive/stale. `npm run verify` expects an obsolete sitemap/404 shape, and `npm run copy:test` has six failures caused by stale copy snapshot expectations. This was not changed because it requires separate approved-copy/gate repair work. It blocks any future deployment approval but does not invalidate the native build.

## Proof and rollback

- Proof ZIP: `/Users/jkbrookspersonal/Downloads/BTF_NATIVE_ASTRO_CONSOLIDATION_PROOF_20261004.zip`
- Proof ZIP SHA-256: `cd1d98b413a26469a735439bd83e9545c0b6c3bb862f2e2aaf5535289ed8f9ca`
- Rollback material: dated archive parent above and verified preservation set with `biketourfrance-shared.bundle` and `btf-migration.bundle`.

See `docs/BTF_DRIVE_AUTHORITIES.md`, `docs/BTF_MV_CANONICAL_DECISIONS.md`, `docs/BUILD_LOG.md`, the canonical general build log, and the master system-change register for the supporting record.
