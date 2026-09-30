# btf-migration

Rebuild of the btf.net Framer site, deployed to a temporary Cloudflare Pages project (`temp-btf`).

## Goal

Make a close visual and functional copy of the current Framer site first. No redesign in this pass. Keep the same pages, copy, images, navigation, and URL paths.

## Layout

- `source-framer/` : original Framer export, kept unmodified for comparison
- `site/` : rebuilt site (deployed to Cloudflare Pages)
- `docs/route-inventory.md` : every route found, marked included, skipped, or redirected

## Workflow

- Work on a branch (for example `rebuild/initial`) and open a pull request.
- Do not push to `main` without approval. The Pages project treats `main` as production.
- Deploy directly with Wrangler to the `temp-btf` Pages project as a preview/branch deployment.
- Use only existing `wrangler login` or `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` environment variables. Never print, paste, or commit tokens.

## Draft-deploy rules

- Contact and waitlist forms are non-submitting placeholders, clearly marked "Draft - not live".
- WhatsApp and other outbound links are real only if approved; otherwise they point to `#`.
- No analytics scripts.
- `noindex` meta tag and `robots.txt` disallow on the temp site.

## Deploy (example)

```bash
npx wrangler pages deploy site --project-name temp-btf --branch rebuild-initial
```

## Status

- [ ] Route inventory
- [ ] Assets and fonts copied
- [ ] Pages rebuilt
- [ ] Side-by-side check against live site
- [ ] Draft deployed to temp-btf
- [ ] Integrations approved (forms, WhatsApp, analytics)
