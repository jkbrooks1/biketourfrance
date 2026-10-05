# BikeTourFrance.net website

Native Astro build of the biketourfrance.net marketing site, deployed from GitHub to the Cloudflare Pages project `temp-btf` (staging). The live site is still on Framer until the owner approves cutover.

## What is in the repository

- `src/pages/`: 12 routes, including the 2027 waitlist and 404 page.
- `src/layouts/BaseLayout.astro`, `src/components/`: shared header, footer, skip link, image, gallery, and "included" components.
- `src/data/`: generated `approved-copy.ts` supplies Sheet copy; `site.ts`, `photos.ts`, and `resources.ts` supply site structure and assets.
- `src/styles/global.css`: the visual system from the owner's style guide.
- `src/assets/`: photographs and the logo, optimized by Astro at build time.
- `public/`: files served as they are (`robots.txt`, `_headers`, favicon). They carry the staging search-engine blocks.
- `scripts/verify-dist.mjs`: checks the built site (headings, landmarks, titles, canonicals, alt text, links, banned content, indexing protections).
- `scripts/build_site.py` and `site/`: the earlier Framer export, kept only as a reference. Astro no longer serves `site/`. `source-framer/` is local only and is not committed.
- `copy/` and `scripts/copy/`: the active, credentialed approved-copy gate. `copy/field-manifest.json` lists every public copy field. See `docs/APPROVED_COPY_GATE.md`.
- `.github/workflows/approved-copy-check.yml`: reads the live Sheet and runs the gate on every push and pull request to `main`, and on manual dispatch. Branch protection is a separate open decision (D4).
- `docs/`: build log, owner style guide, style guide implementation record, 2027 content authority, subdomain migration audit, cutover preflight, security audit, copy gate guide, copy field map for review, and the audit remediation report.

## Rules

- Deploy only by pushing to GitHub. Cloudflare Pages auto-deploys `main` to `temp-btf.pages.dev`; other branches get preview URLs. Do not use Wrangler to deploy.
- The live `biketourfrance.net` domain remains on Framer until a separately approved cutover.
- Never print, paste, or commit access tokens or service-account keys.
- Staging stays blocked from search engines until the owner approves launch: `SITE.indexingEnabled` is `false`, `public/_headers` sends `X-Robots-Tag: noindex, nofollow, noarchive`, and `public/robots.txt` disallows everything. See `docs/PRODUCTION_CUTOVER_PREFLIGHT.md` for how to turn them off.
- Public copy comes from `BTF_Approved_Site_Copy` through the committed generated `src/data/approved-copy.ts`. Owner review of yellow Sheet rows remains open (D8).
- The repository is public. Do not commit Google Sheet IDs, Apps Script URLs or IDs, tokens, or keys. Before every commit run a `git grep` for the Apps Script macros URL, and a `grep -r` of `src/` and `public/` for the Apps Script deployment ID prefix. The patterns are the script.google.com macros path and the six-character prefix that starts every Apps Script deployment ID (written in the 2026-09-30 and 2026-10-02 entries of `/Users/jkbrookspersonal/JBLocalBuildLogs/00_GENERAL_BUILDLOG.md`, not in this repository). Both must return nothing.

## Commands

```bash
npm install
npm run dev          # local development server
npm run check        # Astro type check
npm run format:check # Prettier
npm run build        # local fixture-only build; refused in CI and Cloudflare Pages
npm run verify       # static checks on dist/
npm run copy:check-local  # checks the built pages against the local fixture (no Google)
npm run copy:test    # tests of the copy gate (no Google)
npm run predeploy:approved-copy  # reads the live approved Sheet, generates copy, builds and checks dist/
npm test             # check, build, and verify
git push origin main # Cloudflare Pages auto-deploys staging
```

Cloudflare Pages runs `npx astro build` from the committed `src/data/approved-copy.ts`; it does not read the Sheet. The GitHub Actions gate reads the Sheet independently. After a Sheet edit, run `npm run predeploy:approved-copy` and commit the regenerated file before pushing. `npm run build` uses the fixture and fails under `CI` or `CF_PAGES`. Local preview of the built site: `npm run preview`. See D3 in `docs/BTF_BUILD_DEPLOY_FIX_LIST.md` for the open publishing-workflow decision.

## Status

See `docs/2026-10-02_AUDIT_REMEDIATION_REPORT.md` for the state of each of the 17 audit items and `docs/PRODUCTION_CUTOVER_PREFLIGHT.md` for what remains before launch.
