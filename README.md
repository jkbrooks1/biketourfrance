# BikeTourFrance.net website

Native Astro build of the biketourfrance.net marketing site, deployed from GitHub to the Cloudflare Pages project `temp-btf` (staging). The live site is still on Framer until the owner approves cutover.

## What is in the repository

- `src/pages/`: the 11 pages (home, tours, Canal des Deux Mers 2027, practical information, resources, about, contact, privacy, terms, cookies, and the 404 page).
- `src/layouts/BaseLayout.astro`, `src/components/`: shared header, footer, skip link, image, gallery, and "included" components.
- `src/data/`: all public content in one place. `cdm2027.ts` holds the 2027 tour facts, `site.ts` the brand, contact route and navigation, `photos.ts` the photo catalogue with alt text, and `resources.ts` the verified resource links.
- `src/styles/global.css`: the visual system from the owner's style guide.
- `src/assets/`: photographs and the logo, optimized by Astro at build time.
- `public/`: files served as they are (`robots.txt`, `_headers`, favicon). They carry the staging search-engine blocks.
- `scripts/verify-dist.mjs`: checks the built site (headings, landmarks, titles, canonicals, alt text, links, banned content, indexing protections).
- `scripts/build_site.py` and `site/`: the earlier Framer export, kept only as a reference. Astro no longer serves `site/`. `source-framer/` is local only and is not committed.
- `copy/` and `scripts/copy/`: the approved copy gate (local development; **not active**). `copy/field-manifest.json` lists every public copy field, and `docs/COPY_FIELD_MAP_REVIEW.md` shows them with their current copy for owner review. See `docs/APPROVED_COPY_GATE.md`.
- `.github/workflows/approved-copy-check.yml`: the gate's GitHub check. It runs only when started by hand until the owner activates it.
- `docs/`: build log, owner style guide, style guide implementation record, 2027 content authority, subdomain migration audit, cutover preflight, security audit, copy gate guide, copy field map for review, and the audit remediation report.

## Rules

- Deploy only by pushing to GitHub; Cloudflare Pages builds the preview. Do not use Wrangler to deploy.
- Work on a branch and open a pull request. Do not push to `main` without approval. The Pages project treats `main` as production, and production auto-deploys are off.
- Use only existing `wrangler login` or `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` variables. Never print, paste, or commit tokens.
- Staging stays blocked from search engines until the owner approves launch: `SITE.indexingEnabled` is `false`, `public/_headers` sends `X-Robots-Tag: noindex, nofollow, noarchive`, and `public/robots.txt` disallows everything. See `docs/PRODUCTION_CUTOVER_PREFLIGHT.md` for how to turn them off.
- Public 2027 facts come only from `src/data/cdm2027.ts`. Publish no price, deposit, cancellation term, or exact date until the owner approves it.
- The repository is public. Do not commit Google Sheet IDs, Apps Script URLs or IDs, tokens, or keys. Before every commit run a `git grep` for the Apps Script macros URL, and a `grep -r` of `src/` and `public/` for the Apps Script deployment ID prefix. The patterns are the script.google.com macros path and the six-character prefix that starts every Apps Script deployment ID (written in the 2026-09-30 and 2026-10-02 entries of `/Users/jkbrookspersonal/JBLocalBuildLogs/00_GENERAL_BUILDLOG.md`, not in this repository). Both must return nothing.

## Commands

```bash
npm install
npm run dev          # local development server
npm run check        # Astro type check
npm run format:check # Prettier
npm run build        # builds dist/
npm run verify       # static checks on dist/
npm run copy:check-local  # compares the built pages to the snapshot of the current copy (no Google)
npm run copy:test    # tests of the copy gate (no Google)
npm run predeploy:approved-copy  # production-only: reads the approved Sheet; NOT part of the normal build
npm test             # check, build, and verify
git push origin <branch>   # Cloudflare builds the preview
```

`npm run build` and Cloudflare preview builds need no Google credentials and are unaffected by the copy gate. Local preview of the built site: `npm run preview`.

## Status

See `docs/2026-10-02_AUDIT_REMEDIATION_REPORT.md` for the state of each of the 17 audit items and `docs/PRODUCTION_CUTOVER_PREFLIGHT.md` for what remains before launch.
