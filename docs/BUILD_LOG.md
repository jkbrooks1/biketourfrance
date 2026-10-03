# Project build log (btf-migration)

Append-only. Concise timestamped entries. No secrets. Each entry is also appended to /Users/jkbrookspersonal/JBLocalBuildLogs/00_GENERAL_BUILDLOG.md.

## 2026-10-02T14:43:11Z — GitHub-driven deploys, Astro wrapper, real 404, enforced no-index
- Workflow change: Cloudflare Pages project temp-btf is now Git-connected to github.com/jkbrooks1/biketourfrance (production branch main; production auto-deploys disabled until owner approves; GitHub preview branches enabled). Local origin URL updated to that repo. Wrangler is no longer used to deploy.
- Added minimal Astro setup (astro.config.mjs publicDir=site, package.json, .node-version 22, src/pages/404.astro). Build: npm run build -> dist/ (404.html plus site files unchanged).
- Staging protections: robots meta "noindex, nofollow, noarchive" on every page including 404; X-Robots-Tag "noindex, nofollow, noarchive" via _headers; robots.txt Disallow /. No forms or analytics exist; none added.
- Added docs/cutover.md (future process only; no DNS or custom-domain action taken). README updated.
- Local test: / 200, /resources/ 200, unknown path 404 with X-Robots-Tag. Both leak checks (Apps Script macros URL; Apps Script deployment ID prefix) returned nothing.
- Pre-push baseline of Pages Production deployments: 33307963 (main@420030a) and b12b3456. Expect no new Production deployment after the preview push.

## 2026-10-02T20:43:01Z — Project relocated to canonical root 00_BTF_MAIN_SITE_ROOT_ON_CLOUDFLARE
- Old path: /Users/jkbrookspersonal/btf-migration (unchanged; kept as rollback copy).
- New canonical path: /Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_ROOT_ON_CLOUDFLARE. This docs/BUILD_LOG.md is now the active project build log; append new entries here.
- Method: git clone --branch rebuild/initial --single-branch from https://github.com/jkbrooks1/biketourfrance.git. No commit, push, or new repo.
- Branch rebuild/initial, HEAD fcf2d093cc5da3219d6bc3d80f5ff30d131d0840 (matches old repo and GitHub). Tracked-file lists identical (165 files). Clone was clean before this entry.
- npm ci succeeded (0 vulnerabilities). npm run build passed (dist/ generated, not committed).
- source-framer/ is gitignored and local-only, so it is NOT in the new clone. It stays in the old folder. Needed only for npm run build:site.
- No push, deployment, DNS, Cloudflare setting, Framer, or Production change occurred.

## 2026-10-02T21:36:39Z — Audit remediation: native Astro rebuild on branch rebuild/2026-10-02-audit-remediation
- Branch created from rebuild/initial (fcf2d09). Carried the earlier uncommitted practical-info page and the pending BUILD_LOG relocation entry.
- Replaced the served Framer export with a native Astro site: 11 pages, shared layout/header/footer, one content source for 2027 CDM facts (src/data/cdm2027.ts), self-hosted Montserrat, AVIF/WebP images. publicDir changed from site/ to public/ (robots.txt, _headers copied unchanged). site/ and scripts/build_site.py kept as reference only.
- Applied owner style guide v4.3 (docs/OWNER_STYLE_GUIDE_v4.3.md): brand spelling BikeTourFrance.net, green header/footer bands, white logo, Montserrat, button system.
- Tests: astro check 0 errors; prettier clean; npm run build 11 pages; scripts/verify-dist.mjs 11 pages OK; Playwright (scratch install, not in repo) 11 pages x 320/375/390/768/1024/1440 clean; keyboard/skip link/focus/menu/no-JS pass; 0 cookies; report-only CSP trial 0 violations with negative control 24.
- Leak checks (Apps Script macros path, deployment ID prefix, the practical-info Sheet ID, service-account path): git grep and grep of src/public/dist returned nothing.
- Docs added: 2027_CDM_CONTENT_AUTHORITY, SUBDOMAIN_MIGRATION_AUDIT, PRODUCTION_CUTOVER_PREFLIGHT, 2026-10-02_AUDIT_REMEDIATION_REPORT, STYLE_GUIDE, OWNER_STYLE_GUIDE_v4.3, SECURITY_CSP_AUDIT; README and cutover.md updated. Proof in docs/proof/2026-10-02/.
- Read-only live checks only against public hosts (GET/HEAD). No DNS, Cloudflare setting, domain binding, redirect, production header, Framer, or Production deployment change. main not touched.
- Note: the brief named /Users/jkbrookspersonal/JBLocal FilesTEMP/00_GENERAL_BUILDLOG.md as a fallback log; that path is retired. Logged to the canonical general log instead.

## 2026-10-03T03:59:06Z — Branch pushed; Cloudflare Pages preview verified
- Pushed rebuild/2026-10-02-audit-remediation (commits 4fdf064, af941d2, aa239b4). Tested build commit: aa239b4acfd30fd510e89f2eedc5c0f6c7cd544c.
- Cloudflare Pages (temp-btf) built it via Git integration: preview https://e476b72c.temp-btf.pages.dev, branch preview https://rebuild-2026-10-02-audit-rem.temp-btf.pages.dev. No Wrangler deploy.
- Staging proof: 10 pages plus sitemap-index.xml and robots.txt return 200; unknown path returns 404 with the branded page; X-Robots-Tag noindex, nofollow, noarchive on 200 and 404; robots.txt Disallow /; noindex meta present; canonical points to https://biketourfrance.net/; no Set-Cookie, CSP, or HSTS header added; Playwright responsive run against the preview (11 pages x 6 widths) clean.
- Proof ZIP: /Users/jkbrookspersonal/Downloads/BTF_AUDIT_REMEDIATION_PROOF_20261002.zip. Helper scripts archived to /Users/jkbrookspersonal/00_SCRIPTS (prefix 20261002T205204_).
- Not done: merge to main, DNS, domain binding, redirects, production headers, production deploy, Framer. Pull request not opened.

## 2026-10-03T04:29:27Z — Layout: 80px content edge from 768px up
- Container side edge is 80px from 768px up (was 20px; briefly 40px). Phones keep 20px so content is not squeezed. Measured left edge of the CDM summary, trip summary, What's included lists, CTA blocks, and Ready to ride heading: 80px at 768, 1024, 1440; 20px at 320, 375, 390 (docs/proof/2026-10-02/04_left_edge_check.txt). Commit eb81767.

## 2026-10-03T04:29:27Z — Approved copy gate: BTF_Approved_Site_Copy is the copy authority (branch only; not live until credentials are set)
- Added: copy/field-manifest.json (224 fields: field, route, required, codeLocation; no copy text), copy/consistency-rules.json, copy/fixture/fixture-rows.json, copy/seed/BTF_Approved_Site_Copy.seed.csv; src/lib/copy*.mjs; scripts/copy/{lib,sync,validate,code-references,verify-rendered,assert-deployable,negative-tests}.mjs; .github/workflows/approved-copy-check.yml (job name: Approved copy check); docs/APPROVED_COPY_GATE.md.
- Every public text block, alt text, caption, title, and meta description now renders from the generated artifact (.copy/, git-ignored) keyed by page/field_name. Removed src/data/cdm2027.ts, resources.ts, practical-info-data.json (their text moved to the fixture/seed; recoverable from git history).
- npm run build = copy:sync, copy:validate, astro build, copy:verify-rendered, verify. npm run predeploy = BTF_DEPLOY_ENV=production npm run build, then assert-deployable. build:fixture and dev:fixture are local only; fixture copy is refused in CI, on Cloudflare Pages, and when BTF_DEPLOY_ENV is set.
- Tests: copy:test 31/31 (missing, duplicate, unknown, blank, header, extra column, header-only sheet, consistency, banned content, links, no credential, Google 403/404/title, fixture-under-production, stale artifact, rendered mismatch, uncovered text/alt, wrong artifact, assert-deployable). Fixture build passes all five steps. All 11 pages read identically before and after the refactor (text diff). astro check 0 errors; prettier clean; browser suites (responsive, keyboard, images, edge, CSP) pass on the fixture build.
- Real sheet (read-only): spreadsheet BTF_Approved_Site_Copy exists with a header row only. An existing local service account signed in but was denied (HTTP 403) on it, so nothing was read. Normal build and predeploy with no credentials exit 1; predeploy with fixture forced exits 1 (docs/proof/2026-10-02/05_approved_copy_gate_proof.txt).
- Credential setup NOT done (owner): read-only service account key as BTF_COPY_GOOGLE_SA_JSON and the sheet ID as BTF_COPY_SHEET_ID, in GitHub secrets and Cloudflare Pages env (Preview and Production); share the sheet with the account as Viewer; require the check "Approved copy check" on main; import the seed CSV and approve each cell.
- WARNING: Cloudflare Pages runs npm run build, so previews of this branch will fail at copy:sync until those settings exist. The branch was NOT pushed for that reason. No secret written to the repo, logs, or register (leak greps clean). No DNS, Cloudflare setting, deployment, or production copy change.
