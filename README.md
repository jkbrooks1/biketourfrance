# BikeTourFrance.net website

Native Astro build of the biketourfrance.net marketing site, deployed from GitHub to the Cloudflare Pages project `temp-btf` (staging). The live site is still on Framer until the owner approves cutover.

## What is in the repository

- `src/pages/`: the 11 pages (home, tours, Canal des Deux Mers 2027, practical information, resources, about, contact, privacy, terms, cookies, and the 404 page).
- `src/layouts/BaseLayout.astro`, `src/components/`: shared header, footer, skip link, image, gallery, and "included" components.
- `src/data/`: `site.ts` (origin, contact address, link targets, navigation fields, staging switch) and `photos.ts` (the photo catalogue). **All visible text is not here.** It comes from the approved copy sheet (see below).
- `src/lib/copy*.mjs`, `src/components/Copy.astro`: how pages read and render approved copy by `page/field_name`.
- `copy/`: the field manifest (no copy text), consistency rules, local fixture copy, and a seed CSV for filling the sheet.
- `scripts/copy/`: the approved-copy gate (sync, validate, rendered verification, production pre-deploy assertion, negative tests).
- `.github/workflows/approved-copy-check.yml`: the required GitHub check **Approved copy check**.
- `src/styles/global.css`: the visual system from the owner's style guide.
- `src/assets/`: photographs and the logo, optimized by Astro at build time.
- `public/`: files served as they are (`robots.txt`, `_headers`, favicon). They carry the staging search-engine blocks.
- `scripts/verify-dist.mjs`: checks the built site (headings, landmarks, titles, canonicals, alt text, links, banned content, indexing protections).
- `scripts/build_site.py` and `site/`: the earlier Framer export, kept only as a reference. Astro no longer serves `site/`. `source-framer/` is local only and is not committed.
- `docs/`: build log, owner style guide, style guide implementation record, 2027 content authority, subdomain migration audit, cutover preflight, security audit, and the audit remediation report.

## Rules

- Deploy only by pushing to GitHub; Cloudflare Pages builds the preview. Do not use Wrangler to deploy.
- Work on a branch and open a pull request. Do not push to `main` without approval. The Pages project treats `main` as production, and production auto-deploys are off.
- Use only existing `wrangler login` or `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` variables. Never print, paste, or commit tokens.
- Staging stays blocked from search engines until the owner approves launch: `SITE.indexingEnabled` is `false`, `public/_headers` sends `X-Robots-Tag: noindex, nofollow, noarchive`, and `public/robots.txt` disallows everything. See `docs/PRODUCTION_CUTOVER_PREFLIGHT.md` for how to turn them off.
- All public copy comes from the Google Sheet **BTF_Approved_Site_Copy** (two columns: `page/field_name`, `copy`). The build fails if any field is missing, blank, duplicated, unrecognized, or different on the built page, or if a page shows text that has no approved field. Publish no price, deposit, cancellation term, or exact date until the owner approves it in the sheet. See `docs/APPROVED_COPY_GATE.md`.
- The repository is public. Do not commit Google Sheet IDs, Apps Script URLs or IDs, tokens, or keys. Before every commit run a `git grep` for the Apps Script macros URL, and a `grep -r` of `src/` and `public/` for the Apps Script deployment ID prefix. The patterns are the script.google.com macros path and the six-character prefix that starts every Apps Script deployment ID (written in the 2026-09-30 and 2026-10-02 entries of `/Users/jkbrookspersonal/JBLocalBuildLogs/00_GENERAL_BUILDLOG.md`, not in this repository). Both must return nothing.

## Commands

```bash
npm install
npm run dev:fixture        # local development with fixture copy (red banner on every page)
npm run build:fixture      # local build with fixture copy; cannot be deployed
npm run build              # the normal build: copy sync, validation, site build, rendered verification, dist checks
npm run predeploy          # production pre-deploy check (what GitHub runs); needs the sheet credential
npm run copy:test          # negative tests of the copy gate (run npm run build:fixture first)
npm run check              # Astro type check
npm run format:check       # Prettier
npm test                   # fixture build, copy tests, type check
git push origin <branch>   # Cloudflare builds the preview (needs the copy settings; see docs/APPROVED_COPY_GATE.md)
```

Plain `npm run build` and `npm run dev` read the real sheet and fail without `BTF_COPY_SHEET_ID` and `BTF_COPY_GOOGLE_SA_JSON` (or, locally, `BTF_COPY_GOOGLE_SA_FILE`). Local preview of the built site: `npm run preview`.

## Status

See `docs/2026-10-02_AUDIT_REMEDIATION_REPORT.md` for the state of each of the 17 audit items and `docs/PRODUCTION_CUTOVER_PREFLIGHT.md` for what remains before launch.
