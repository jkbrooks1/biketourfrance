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

## 2026-10-03T15:04:34Z — Correction: normal build restored; approved copy gate is local and production-only (not active)
- Owner instruction: the normal build and Cloudflare previews must work without Google credentials while the Sheet is empty and the gate is not activated. Reworked locally; nothing pushed, deployed, or changed in Cloudflare, DNS, or the live site.
- Restored the pre-gate content sources and pages (git checkout from eb81767): src/data/cdm2027.ts, resources.ts, practical-info-data.json, all pages and components. Removed the field-rendering layer (Copy/LinkList/AudioList components, src/lib/copy*.mjs); it stays in git history at commit 07bb2c6. package.json build is astro build again; dependencies and package-lock.json are unchanged since the last successful Cloudflare preview (aa239b4).
- The gate is now a comparison, not a renderer: npm run predeploy:approved-copy (production only) = copy:sync, copy:validate, astro build, copy:verify-rendered, verify, assert-deployable. It accepts only the existing service account btf-sheets-access@btf-general.iam.gserviceaccount.com (confirmed: the existing local key is that account; no new account or key created). Key files are refused only in CI.
- Added docs/COPY_FIELD_MAP_REVIEW.md (224 fields: page, page/field_name, current rendered copy, content type, required) generated by scripts/copy/generate-field-map-review.mjs. Verified against the built pages and against the deployed staging preview e476b72c (11 pages, all fields). No mailing-list field. Pricing stays TBD and unpublished.
- .github/workflows/approved-copy-check.yml is manual-only (workflow_dispatch) until the owner activates it. No GitHub or Cloudflare secrets created.
- Tests: normal build in a stripped environment exit 0; verify 11 pages OK; astro check 0 errors; prettier clean; copy:check-local 224 fields; copy:test 38/38 (includes a passing path for a good Sheet snapshot); browser responsive, keyboard, image, left-edge and CSP checks pass; page text, titles, descriptions, and alt text identical to the pre-gate snapshot and to the deployed staging preview. Real-Sheet run with the existing key: HTTP 403 (Sheet not yet shared), exit 1, no artifacts left. Proof: docs/proof/2026-10-02/06_normal_build_and_inactive_gate_proof.txt.
- Bug fixed during testing: the production command refused the local key file because BTF_DEPLOY_ENV was set; key files are now refused only when CI, GITHUB_ACTIONS, or CF_PAGES is set.
- The earlier entry in this log and in the register that says the normal build needs the Sheet is superseded by this one.

## 2026-10-04T03:43:57Z — IN PROGRESS — Audit remediation to style guide v4.4
- Read branch source (package.json, layout, components, pages, data, CSS) for planning.
- Secrets: none recorded.

## 2026-10-04T03:44:06Z — IN PROGRESS — Audit remediation to style guide v4.4
- Read pages, data files, and global.css on the branch.
- Secrets: none recorded.

## 2026-10-04T03:44:34Z — IN PROGRESS — Audit remediation to style guide v4.4
- Read remaining pages, photos/resources data, verify script, content authority doc.
- Secrets: none recorded.

## 2026-10-04T03:45:10Z — IN PROGRESS — Audit remediation to style guide v4.4
- Read legal, about, contact, tours pages and content authority doc; inspect logo and image dimensions.
- Secrets: none recorded.

## 2026-10-04T03:45:28Z — IN PROGRESS — Audit remediation to style guide v4.4
- Download the guide's approved white-on-transparent logo from its R2 URL to scratchpad for comparison with the repo logo (read-only fetch).
- Secrets: none recorded.

## 2026-10-04T03:45:53Z — IN PROGRESS — Audit remediation to style guide v4.4
- Install dependencies in the worktree with npm ci from the committed lockfile (node_modules is git-ignored) and run a baseline npm run build + npm run verify before editing.
- Secrets: none recorded.

## 2026-10-04T03:48:05Z — IN PROGRESS — Audit remediation to style guide v4.4
- Check for local Playwright/Chrome tooling for browser tests; check resources.biketourfrance.net reachability; grep rebuild/initial export for 'B&B' string.
- Secrets: none recorded.

## 2026-10-04T03:48:49Z — IN PROGRESS — Audit remediation to style guide v4.4
- Grep source for inline styles, btn usage, photo usage, exclamation marks, brand spelling; list fontsource files.
- Secrets: none recorded.

## 2026-10-04T03:50:05Z — IN PROGRESS — Audit remediation to style guide v4.4
- Write shared components: Button, Header, Footer, ContactCta, Included, Photo, Gallery, nav script (full file replacements).
- Secrets: none recorded.

## 2026-10-04T03:51:16Z — IN PROGRESS — Audit remediation to style guide v4.4
- Write src/styles/global.css as a complete v4.4 replacement (tokens, spacing scale, type scale, container, header/footer bands, buttons, focus, hero, gallery, resources).
- Secrets: none recorded.

## 2026-10-04T03:52:06Z — IN PROGRESS — Audit remediation to style guide v4.4
- Write home, resources, 404, about pages from the approved copy (full file replacements).
- Secrets: none recorded.

## 2026-10-04T03:52:32Z — IN PROGRESS — Audit remediation to style guide v4.4
- Convert CDM, tours, contact, practical-info pages to the shared Button and class-based styles (python text replacement script, then review diff).
- Secrets: none recorded.

## 2026-10-04T03:53:09Z — IN PROGRESS — Audit remediation to style guide v4.4
- Extend scripts/verify-dist.mjs with v4.4 static checks (heading and label length, no exclamation marks, no # links, alt text, brand, CSS scale, no Framer assets).
- Secrets: none recorded.

## 2026-10-04T03:53:18Z — IN PROGRESS — Audit remediation to style guide v4.4
- Run npm run build and npm run verify after the v4.4 rewrite.
- Secrets: none recorded.

## 2026-10-04T03:54:15Z — IN PROGRESS — Audit remediation to style guide v4.4
- Inspect built CSS for font and focus rules to fix verify failures; fix image delivery sizes and one remaining exclamation mark in the approved copy.
- Secrets: none recorded.

## 2026-10-04T03:54:30Z — IN PROGRESS — Audit remediation to style guide v4.4
- Fix verify rules (font stack and focus regex), allow the guide's 12px button padding, set image fallback format to webp, lower hero quality, remove last exclamation mark in approved copy; rebuild.
- Secrets: none recorded.

## 2026-10-04T03:55:17Z — IN PROGRESS — Audit remediation to style guide v4.4
- Re-encode source photos in src/assets/photos to 290 KB or less (hero cropped to 16:9) so no delivered image exceeds the guide's 300 KB limit. Helper script archived to 00_SCRIPTS.
- Secrets: none recorded.

## 2026-10-04T03:55:35Z — IN PROGRESS — Audit remediation to style guide v4.4
- Rebuild after photo optimization and run verify.
- Secrets: none recorded.

## 2026-10-04T03:56:09Z — IN PROGRESS — Audit remediation to style guide v4.4
- Set terminal title as the user requested (printf escape sequence).
- Secrets: none recorded.

## 2026-10-04T03:56:42Z — IN PROGRESS — Audit remediation to style guide v4.4
- Write and run Playwright browser test (4 widths x 11 routes) against the built dist served locally; save screenshots and JSON report under docs/proof/2026-10-03.
- Secrets: none recorded.

## 2026-10-04T03:57:51Z — IN PROGRESS — Audit remediation to style guide v4.4
- Apply link-list fix and hero contrast probe, rebuild, verify, rerun browser check (probe image written to scratchpad; rm is globally denied).
- Secrets: none recorded.

## 2026-10-04T03:58:58Z — WARNING — Audit remediation to style guide v4.4
- Hero text contrast measured 3.57:1 at 1024px with the gradient overlay (needs 4.5). Switching to a uniform dark-green tint at all widths; adding min-width 44px to link-list links.
- Secrets: none recorded.

## 2026-10-04T04:00:02Z — IN PROGRESS — Audit remediation to style guide v4.4
- Run npm run check, format:check, copy:test, copy:check-local to see which existing checks the rewrite affects.
- Secrets: none recorded.

## 2026-10-04T04:00:36Z — WARNING — Audit remediation to style guide v4.4
- Inactive approved-copy gate (copy:check-local) fails against the rewritten pages because copy/field-manifest.json maps the old v4.3 text. It is not part of the Cloudflare build. Removing it from npm test and documenting that the manifest needs regeneration before gate activation.
- Secrets: none recorded.

## 2026-10-04T04:16:42Z — IN PROGRESS — Audit remediation to style guide v4.4
- New narrow task: find the two legacy Framer HTML comments (Made in Framer, Published Sep 30) in the BTF project source and build output (read-only grep). Previous commit/push of v4.4 work was declined by the user and not run.
- Secrets: none recorded.

## 2026-10-04T04:16:53Z — IN PROGRESS — Audit remediation to style guide v4.4
- Delete lines 2-3 (the two exact Framer comments) from SITE/index.html and SITE/resources/index.html only.
- Secrets: none recorded.

## 2026-10-04T04:16:59Z — IN PROGRESS — Audit remediation to style guide v4.4
- Run npm run build in the main root (regenerates DIST) and check DIST for the strings.
- Secrets: none recorded.

## 2026-10-04T04:17:08Z — DONE — Audit remediation to style guide v4.4
- Removed the two Framer comments from site/index.html and site/resources/index.html in the main root (rebuild/initial working tree, uncommitted). Neither string remains in site source, .generated, or DIST; npm run build completed with no errors. Not committed or pushed.
- Secrets: none recorded.

## 2026-10-04T04:21:58Z — IN PROGRESS — Audit remediation to style guide v4.4
- User reports the Made in Framer comment is still present. Read-only grep of BTF dirs, and curl of the staging preview to see what is deployed.
- Secrets: none recorded.

## 2026-10-04T04:22:46Z — IN PROGRESS — Audit remediation to style guide v4.4
- Commit only site/index.html and site/resources/index.html on rebuild/initial and push so Cloudflare Pages Git integration redeploys the preview.
- Secrets: none recorded.

## 2026-10-04T04:23:48Z — DONE — Audit remediation to style guide v4.4
- Commit 7cb6a31 on rebuild/initial pushed; Cloudflare Pages preview 143a5bbd (https://143a5bbd.temp-btf.pages.dev) deployed; the two Framer comments checked absent on / and /resources/.
- Secrets: none recorded.

## 2026-10-04T04:25:42Z — IN PROGRESS — Audit remediation to style guide v4.4
- Check worktree state before committing the v4.4 remediation on its branch.
- Secrets: none recorded.

## 2026-10-04T04:26:11Z — IN PROGRESS — Audit remediation to style guide v4.4
- Write the v4.4 remediation report, commit in two commits on rebuild/2026-10-02-audit-remediation, push. Not merging; waitlist files and production untouched.
- Secrets: none recorded.
