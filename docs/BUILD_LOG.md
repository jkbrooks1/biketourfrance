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

## 2026-10-03T16:28:09Z — BLOCKED — Approved site copy inventory: workbook not found
- Task: populate BTF_Approved_Site_Copy.xlsx from staging https://e1802ca2.temp-btf.pages.dev (content inventory, no site, repo, Cloudflare, or Framer change).
- STOPPED at step 1: /Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_ROOT_ON_CLOUDFLARE/BTF_Approved_Site_Copy.xlsx does not exist. No workbook was created or edited; no site page was fetched.
- Also checked, no .xlsx found: LocalSiteBuildFiles, Downloads, Documents, Desktop, Library/CloudStorage (depth 6), Spotlight index. Related items found: Google Sheet pointer file in Google Drive (john@biketourfrance.net) My Drive/BTF_Approved_Site_Copy.gsheet; CSV seed copy/seed/BTF_Approved_Site_Copy.seed.csv on branch rebuild/2026-10-02-audit-remediation (not on rebuild/initial).
- Awaiting owner decision on where the workbook is. Secrets: none recorded.

## 2026-10-03T16:34:45Z — IN PROGRESS — Approved site copy inventory into Google Sheet
- Task: populate the Google Sheet BTF_Approved_Site_Copy (id 1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw, owner john@biketourfrance.net, tab 'Approved Site Copy', headers page/field_name and copy) with all copy published at https://e1802ca2.temp-btf.pages.dev. Owner clarified the workbook is the Google Drive file, not a local .xlsx; this supersedes the earlier BLOCKED entry.
- Content inventory only. No change to the staging site, GitHub repo, Cloudflare Pages, or Framer. No Git changes. Systems-change register not updated (not a system change). Secrets: none recorded.

## 2026-10-03T16:38:22Z — DONE — Approved site copy inventory into Google Sheet
- Result: populated the existing Google Sheet BTF_Approved_Site_Copy (id 1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw, tab 'Approved Site Copy', A2:B58) with 57 copy rows from https://e1802ca2.temp-btf.pages.dev. Headers unchanged; no columns, tabs, formulas, or notes added. Readback matched the written rows.
- Pages inventoried: 3 (/, /resources/, and the 404 page served for unknown paths). Staging has no sitemap (404) and no other routes (/about, /tours, /contact, /privacy, /terms, /cookies, /practical-info, /faq all return 404). robots.txt is Disallow all.
- Method: desktop variant only (tablet and phone duplicates dropped); on-page order confirmed in Chrome (blocks measured by position). All images have empty alt text, so no _alt rows. No navigation links exist on staging pages.
- Owner set the Google project root: .../My Drive/04_BikeTourFrance.net.GD-BTF/BTF_Website/OO_BTF_GOOG_SITE_ROOT (empty). The Sheet is NOT in it yet and was not moved. Supersedes the earlier BLOCKED entry about the missing local .xlsx.
- No change to staging, GitHub, Cloudflare, or Framer; no Git changes. Register not updated by design. Secrets: none recorded.

## 2026-10-03T20:17:00Z — IN PROGRESS — Move approved-copy Sheet into Google project root
- Task: move the existing Google Sheet BTF_Approved_Site_Copy (id 1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw, owner john@biketourfrance.net, current parent 0AHzmMZRoAS9aUk9PVA) into the Google project root 04_BikeTourFrance.net.GD-BTF/BTF_Website/OO_BTF_GOOG_SITE_ROOT in My Drive.
- Move only: same file ID, title, contents, sharing. No copy, new sheet, new folder, or local .xlsx. No change to website, Git, Cloudflare, Framer, systems register, or any other Google file. Secrets: none recorded.

## 2026-10-03T20:17:34Z — DONE — Approved-copy Sheet moved into Google project root
- Result: moved the existing Google Sheet BTF_Approved_Site_Copy (file ID 1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw, unchanged) from parent 0AHzmMZRoAS9aUk9PVA to folder OO_BTF_GOOG_SITE_ROOT (folder ID 1-acJrUL2VjIndc0yAXP96vBz5HebH01U) via Drive update_file (parent change only). Drive path: My Drive/04_BikeTourFrance.net.GD-BTF/BTF_Website/OO_BTF_GOOG_SITE_ROOT.
- Verified: Drive metadata parent is OO_BTF_GOOG_SITE_ROOT; same file ID and title; tab 'Approved Site Copy' (sheetId 1957325162); A1:B58 intact (header plus 57 rows); spreadsheet revisionId identical before and after the move; a title search finds one Sheet; the destination folder holds only this file.
- Not checked: sharing settings were not read before or after; a Drive parent change does not edit them.
- No copy, new sheet, new folder, or local .xlsx created. No change to website, Git, Cloudflare, Framer, systems register, or any other Google file. Secrets: none recorded.
