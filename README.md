# btf-migration

Rebuild of the btf.net Framer site, deployed to a temporary Cloudflare Pages project (`temp-btf`).

## Goal

Make a close visual and functional copy of the current Framer site first. No redesign in this pass. Keep the same pages, copy, images, navigation, and URL paths.

## Layout

- `source-framer/` : local-only copy of the Framer export, kept unmodified for comparison. It is NOT committed (it is listed in `.gitignore`) because the export contains Google Apps Script deployment IDs and this repo is public.
- `site/` : rebuilt site (deployed to Cloudflare Pages). Deployment IDs are removed from it.
- `scripts/build_site.py` : rebuilds `site/` from `source-framer/` and applies the draft rules.
- `docs/route-inventory.md` : every route found, marked included, skipped, or redirected

## Workflow

- Work on a branch (for example `rebuild/initial`) and open a pull request.
- Do not push to `main` without approval. The Pages project treats `main` as production.
- Deploy directly with Wrangler to the `temp-btf` Pages project as a preview/branch deployment.
- Use only existing `wrangler login` or `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` environment variables. Never print, paste, or commit tokens.
- Before every commit and every deploy, two leak checks must return nothing: a `git grep` for the Google Apps Script macros URL, and a `grep -r` of `site/` for the Apps Script deployment ID prefix. The exact commands are in the build log.

## Draft-deploy rules

- Contact and waitlist forms are non-submitting placeholders, clearly marked "Draft - not live". The two embedded Apps Script resource widgets on `/resources` (broken on the live Framer page) are replaced by a link block to `https://resources.biketourfrance.net/`.
- WhatsApp and other outbound links are real only if approved; otherwise they point to `#`. The `cdm-sep2026.biketourfrance.net` link on the home page points to `#`.
- No analytics scripts. Framer editor and `api.framer.com` calls are removed or blocked.
- `noindex` meta tag on every page, `X-Robots-Tag` header, and `robots.txt` with `Disallow: /` on the temp site.

## Deploy (example)

```bash
npx wrangler pages deploy site --project-name temp-btf --branch rebuild-initial
```

## Status

- [x] Route inventory
- [x] Assets and fonts copied
- [x] Pages rebuilt
- [x] Side-by-side check against live site (page text matches on `/`; `/resources` differs only by the draft placeholders)
- [x] Draft deployed to temp-btf (preview: https://rebuild-initial.temp-btf.pages.dev)
- [ ] Integrations approved (forms, WhatsApp, analytics)
