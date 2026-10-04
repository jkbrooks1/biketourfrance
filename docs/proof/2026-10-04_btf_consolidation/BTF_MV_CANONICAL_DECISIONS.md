# BTF Migration Canonical Decisions

Status: PLANNING ONLY — 2026-10-04. No consolidation, source change, deployment, Drive write, or settings change is authorized by this document.

## Confirmed current state

- **PROVEN current native-source root:** `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_AUDIT_REMEDIATION_WORKTREE`.
- **PROVEN current native branch and commit:** `rebuild/2026-10-02-audit-remediation` at `d394f730e8c65b2d263a29c8dd0d2ac29c91fa3c`.
- **PROVEN Git dependency:** the native root is a linked worktree. Its `.git` file points to `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT/.git/worktrees/00_BTF_AUDIT_REMEDIATION_WORKTREE`.
- **APPROVED target permanent active root:** `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT`.
- **PROVEN target root current state:** it is the primary worktree on wrapper branch `rebuild/initial`, commit `275326ba181aa3ff297072a19221c34cbdad14c4`, with unique local work. It is not yet the native source tree.
- **PROVEN canonical GitHub repository:** `jkbrooks1/biketourfrance`, remote `https://github.com/jkbrooks1/biketourfrance.git`.
- **PROVEN Pages production branch:** `main`; no production cutover is authorized.
- **PROVEN BTF Drive operational home:** `04_BikeTourFrance.net.GD-BTF` (folder ID `1B1CmJmIxcESa7oxhXJKsLx12sy34xOlo`) > `BTF_Website` (folder ID `1azP1B1_ybQHS6Rtxn0R1W8ZELwFl8_wq`). A `BTF_Migration` folder does not yet exist.
- **PROVEN approved-copy source:** shared Sheet `BTF_Approved_Site_Copy`, ID `1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw`, currently under `OO_BTF_GOOG_SITE_ROOT` (ID `1-acJrUL2VjIndc0yAXP96vBz5HebH01U`). It remains authoritative in place.

## Superseded path decisions

`/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_ROOT_ON_CLOUDFLARE` is a superseded path name. The current target directory is `00_BTF_MAIN_SITE_CLOUDFLARE_ROOT`; it must not be treated as already converted to the native branch.

`/Users/jkbrookspersonal/btf-migration` is a stale Framer-wrapper checkout, not an active build root. `BTF_MV_BTF_TO_CLOUDFLARE_PROJECT` is an incomplete scaffold inside the unrelated `LocalSiteBuildFiles` Git repository and is not a BTF site Git root.

## Awaiting approval

The reversible consolidation sequence in `docs/BTF_MIGRATION_CONSOLIDATION_PLAN.md`, all archives/backups, the Git-aware worktree transition, and Drive folder creation are proposed only. Do not execute them without a separate owner approval.
# Canonical Decisions — Executed 2026-10-04

- Sole active local root: `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT`.
- Sole active development branch: `rebuild/2026-10-02-audit-remediation`.
- GitHub remote: `https://github.com/jkbrooks1/biketourfrance.git`; Cloudflare Pages project: `temp-btf`; production branch remains `main`.
- All former BTF migration roots are inactive archives at `/Users/jkbrookspersonal/LocalSiteBuildFiles/99_ARCHIVE/BTF_MIGRATION_2026-10-04`.
- Drive operational folder: `BTF_Migration` (`1XmvuhM_iyMbZWPf5qH1TqvaHmtaCMW2R`). Approved copy remains the unmoved Sheet `1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw`.
- `docs/` and `copy/` are canonical lowercase names in the active native root. Wrapper `DOCS/` and `COPY/` content remains archived, not merged.
- Production cutover, deployment, Pages changes, DNS changes, and copy-gate activation remain separate approval items.
