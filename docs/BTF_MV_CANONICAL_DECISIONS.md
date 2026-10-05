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
   - Step 1: `copy:sync` — Read 57 approved fields from Google Sheet (BTF_Approved_Site_Copy)
   - Step 2: `copy:validate` — Validate fields against field-manifest.json
   - Step 3: `astro build` — Generate static site in dist/
   - Step 4: `copy:verify-rendered` — Verify approved copy text appears on rendered pages
   - Step 5: `verify` — Run style and accessibility checks
   - Step 6: `assert-deployable` — Final deployment readiness check

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
- ✓ All 57 approved copy fields must be present in synced data
- ✓ Rendered HTML must contain all approved copy text
- ✓ No style guide violations (headings ≤60 chars, button labels ≤24 chars, brand as "BikeTourFrance.net")
- ✓ Build artifacts must be deployable

### Monitoring
- View workflow runs: https://github.com/jkbrooks1/biketourfrance/actions
- Look for: "Approved copy check" workflow status (✅ PASS or ❌ FAIL)
- Failed builds block staging deployment; review action logs for error details

### Future Changes
Any changes to the workflow, secrets, or branch triggers require updating this decision document and the system changes register.

---

## Rollback, supersession, and future changes

Use the verified preservation set and dated archive for rollback. Earlier present-tense claims that the remediation worktree was active, the wrapper was the destination, Drive was missing, or consolidation was pending are superseded. Any root, branch, Drive, GitHub, or Cloudflare change requires this decision and the system register to be updated.
