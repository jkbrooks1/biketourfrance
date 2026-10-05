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

## GitHub Actions CI/CD pipeline and Sheet Mode deployment

**Effective date:** 2026-10-04

The build and deployment pipeline is fully automated via GitHub Actions and Cloudflare Pages integration:

### Workflow Configuration
- **Workflow file:** `.github/workflows/approved-copy-check.yml`
- **Location:** `.github/workflows/` in repository root
- **Status:** ACTIVE (enabled 2026-10-04)

### Triggers
The workflow automatically runs on:
1. `push` to `main` branch
2. `pull_request` to `main` branch  
3. `workflow_dispatch` (manual trigger via GitHub UI)

### Build Process (Sheet Mode)
1. **Checkout:** Clone repository at triggered commit
2. **Setup:** Node.js 22, npm cache, install dependencies
3. **Build command:** `npm run predeploy:approved-copy`
   - Step 1: `copy:sync` — Read the 64 approved fields from Google Sheet (BTF_Approved_Site_Copy)
   - Step 2: `copy:validate` — Validate fields against field-manifest.json
   - Step 3: `copy:generate-ts` — Generate `src/data/approved-copy.ts` from the validated artifact
   - Step 4: `astro build` — Generate static site in dist/
   - Step 5: `copy:verify-rendered` — Verify approved copy text appears on rendered pages
   - Step 6: `verify` — Run style and accessibility checks
   - Step 7: `assert-deployable` — Final deployment readiness check

**Sheet-to-code mapping (added 2026-10-05).** The Sheet names fields `/section/field_name` in
snake_case (e.g. `/404/home_cta`); the Astro components read nested camelCase
(e.g. `COPY.notFound.homeCta`). `scripts/copy/generate-ts.mjs` holds the declarative map between
them and contains no copy text of its own. If the code needs a field the Sheet does not have, the
build fails and names the exact rows to add. Fallback or placeholder copy must never be added to
that script: only Sheet copy may ship. `npm run build` (the Cloudflare Pages command) runs
`copy:generate-ts` as well, so Pages never builds from a stale generated file.

### Required Secrets
Two secrets must be configured in GitHub repository settings:
1. `BTF_COPY_SHEET_ID` = Google Sheet ID for approved copy (e.g., 1vzlhoekeVcx...)
2. `BTF_COPY_GOOGLE_SA_JSON` = Service account JSON for Google Sheets API access

### Deployment
- **Cloud platform:** Cloudflare Pages (project `temp-btf`)
- **Staging URL:** https://btf-production.pages.dev/
- **Auto-deployment:** Upon successful workflow completion, Cloudflare Pages automatically deploys dist/ to staging
- **Build time:** ~2-5 minutes (includes all validation steps)

### Validation Gates
- ✓ All 64 approved copy fields must be present in synced data
- ✓ Every field the code reads must exist in the Sheet, or the build fails naming the missing rows
- ✓ Rendered HTML must contain all approved copy text (63 fields confirmed across 12 routes)
- ✓ No style guide violations, as amended by the owner on 2026-10-05 (see below)
- ✓ Build artifacts must be deployable

### Style guide checks, as amended by the owner 2026-10-05
These four amendments were made so that approved Sheet copy ships unchanged. Style Guide v4.4
itself still needs updating to record them.
1. Button label limit raised from 24 to 32 characters (`src/components/Button.astro`,
   `scripts/verify-dist.mjs`), so "Join our free 2027 tour waitlist" (32) ships as approved.
2. Brand may be written "BikeTourFrance" or "BikeTourFrance.net". The spaced form
   "Bike Tour France" remains a violation.
3. Heading limit raised from 60 to 100 characters, so the intentionally multi-line Canal des
   Deux Mers heading (94) is not shortened.
4. The no-exclamation-mark check was removed. Enforcing it would have required editing 5 approved
   Sheet fields (6 marks), including the CDM heading line and "Send us an email!". The specific
   audited copy defects "soon!." and "soon.)!" still fail.

### Monitoring
- View workflow runs: https://github.com/jkbrooks1/biketourfrance/actions
- Look for: "Approved copy check" workflow status (✅ PASS or ❌ FAIL)
- Failed builds block staging deployment; review action logs for error details

### Future Changes
Any changes to the workflow, secrets, or branch triggers require updating this decision document and the system changes register.

---

## Rollback, supersession, and future changes

Use the verified preservation set and dated archive for rollback. Earlier present-tense claims that the remediation worktree was active, the wrapper was the destination, Drive was missing, or consolidation was pending are superseded. Any root, branch, Drive, GitHub, or Cloudflare change requires this decision and the system register to be updated.
