# BTF Native Astro Canonical Decisions

**Status:** CURRENT AND EXECUTED  
**Effective date:** 2026-10-04

## Purpose

This is the sole current-state authority for the consolidated native Astro project.

## Canonical local project

The sole active local root is `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT`, a standalone native Astro checkout using lowercase `docs/` and `copy/`.

## Git and Cloudflare authority

The sole active development branch is `rebuild/2026-10-02-audit-remediation`; remote is `https://github.com/jkbrooks1/biketourfrance.git`. Pages project is `temp-btf`; `main` remains the production branch. No production cutover occurred.

## Drive and copy authority

`BTF_Migration` (`1XmvuhM_iyMbZWPf5qH1TqvaHmtaCMW2R`) under BTF_Website is the operations folder. `BTF_Approved_Site_Copy` (`1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw`) remains authoritative and unmoved in `OO_BTF_GOOG_SITE_ROOT`.

## Archives, build state, and blockers

Former roots are inactive recovery archives at `/Users/jkbrookspersonal/LocalSiteBuildFiles/99_ARCHIVE/BTF_MIGRATION_2026-10-04`. `npm ci`, native build, and check pass. The old verifier and copy-gate tests do not pass because expectations are stale; deployment is blocked pending repair and approval.

## Rollback, supersession, and future changes

Use the verified preservation set and dated archive for rollback. Earlier present-tense claims that the remediation worktree was active, the wrapper was the destination, Drive was missing, or consolidation was pending are superseded. Any root, branch, Drive, GitHub, or Cloudflare change requires this decision and the system register to be updated.
