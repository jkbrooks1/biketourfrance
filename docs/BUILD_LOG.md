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
