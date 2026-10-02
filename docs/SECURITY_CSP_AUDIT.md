# SEC-001: CSP and HSTS readiness audit (staging only)

Audit date: 2026-10-02. Nothing in this document is deployed. No production header was changed. `public/_headers` still carries only `X-Robots-Tag: noindex, nofollow, noarchive`.

## 1. What the new site loads

Inventory from `dist/` (11 pages):

| Kind | Host | Where | CSP directive affected |
|---|---|---|---|
| HTML, CSS, JS, images, fonts | same origin | every page | `default-src 'self'` covers them |
| Inline script: adds the `js` class to `<html>` | inline | every page | `script-src` needs a hash |
| Inline module script: mobile menu toggle (Astro inlines it) | inline | every page | `script-src` needs a hash |
| JSON-LD data block | inline, `application/ld+json` | every page | Data block, not executed. Not governed by `script-src`. |
| `style="..."` attributes | inline | home, tours, CDM, practical-info, resources | `style-src-attr 'unsafe-inline'` today. Removing them would allow a stricter policy. |
| Audio files (preload none) | `pub-248f360f2c014eee9d9621b9c416e07c.r2.dev` | `/resources/` | `media-src` |
| Outbound links only (no loads) | docs.google.com, eurovelo, komoot, ridewithgps, and 9 other sites; `resources.biketourfrance.net` | `/resources/` | None. Links do not load content. |
| Forms | none | none | `form-action` can be `'self'` |
| Embeds / iframes | none | none | `frame-src 'none'` |
| Analytics, ads, tag managers, social widgets | none | none | None. `verify-dist.mjs` fails if any appears. |
| Web fonts | self-hosted (`@fontsource-variable`) | every page | `font-src 'self'` |
| Image hosts | same origin only (Astro-generated files) | every page | `img-src 'self' data:` |

Inline script hashes today (they change if the inline code changes, so regenerate them on each build):

- `sha256-5LZ+KrD/YrLGs11sfW0NQ/qcer4jFTdG2CmUHx9xnIw=`
- `sha256-sa2BD07tH4oO53uT1B5vNSLM2+gcrREM4WTXttKp6oU=`

## 2. Trial result

A report-only policy (below) was injected into responses from a local preview server and loaded in Chromium with all 11 pages visited and one audio element asked to load from the R2 host.

- Violations with the proposed policy: **0**.
- Negative control (same test with `script-src 'self'` and no hashes): **24 violations**, so the test does detect problems.

Proposed policy (report-only first):

```
Content-Security-Policy-Report-Only:
  default-src 'self';
  script-src 'self' 'sha256-5LZ+KrD/YrLGs11sfW0NQ/qcer4jFTdG2CmUHx9xnIw=' 'sha256-sa2BD07tH4oO53uT1B5vNSLM2+gcrREM4WTXttKp6oU=';
  style-src 'self';
  style-src-attr 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
  media-src 'self' https://pub-248f360f2c014eee9d9621b9c416e07c.r2.dev;
  connect-src 'self';
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none'
```

Use the exact hash strings from section 1 when this is deployed. Do not retype them.

## 3. Gaps and dependencies

1. **No reporting endpoint exists.** Report-only mode without `report-uri` or `report-to` only shows violations in the browser console. Decide whether to add a collector before relying on field data.
2. **Hashes change with the code.** Any edit to the two inline scripts changes the hash. Either generate the header at build time, or move both scripts to external files so `script-src 'self'` is enough. The second is simpler and more robust.
3. **`style-src-attr 'unsafe-inline'`** is needed only because several pages use `style="..."` attributes. Moving them into CSS classes would remove it.
4. **Future embeds** (a form service, a map, video, analytics) each need a CSP change first. The Contact page notes a mailing-list form is not built yet; its provider (the domain's DNS shows MailerLite verification) would need `form-action` or `frame-src` entries.
5. **The audio host** is a public R2 dev URL. Moving it to a custom domain, for example `lodging-assets` style, would make the policy cleaner but is a separate Cloudflare change.
6. **`public/_headers` is shared by staging and production** because both deploy the same repository. A report-only header added there would reach production on cutover. That is acceptable for a report-only header but must be a conscious choice.

## 4. HSTS readiness (read-only checks, 2026-10-02)

| Host | HTTPS | HTTP redirects to HTTPS | HSTS header |
|---|---|---|---|
| biketourfrance.net (apex, Framer) | 200 | 308 | `max-age=31536000` (no includeSubDomains) |
| www | 308 to apex | 308 | `max-age=31536000` |
| espo | 200 | 308 | `max-age=10368000` |
| n8n | 200 | 308 | none |
| All other 15 subdomains (airqual-*, cdm*, cdmstatus2, francenews, lodging, practical-info, resources, uw-issy, tourhub, cdm-lodging-*) | answer over HTTPS (tourhub returns 404 but TLS works) | 301 to HTTPS | none |
| lodging-assets | 404 at the root (expected for an R2 custom domain) | **404, no redirect** | none |

Findings:

- Every known subdomain serves HTTPS, so `includeSubDomains` would not break a *known* host.
- `lodging-assets` does not redirect HTTP to HTTPS. A hard-coded `http://lodging-assets...` image URL would fail under HSTS. Check old pages and emails for `http://` links to it first.
- Subdomains not in the DNS inventory are the risk. Local docs mention `airqual-alt-cdm.biketourfrance.net`, which is not in the inventory. Confirm it does not exist, or that it has TLS.
- Cloudflare's HSTS setting applies at the zone level. Enabling `includeSubDomains` there affects **n8n and espo** immediately.

**Recommendation:** do not add `includeSubDomains` or `preload` until (a) the full DNS record list is re-exported and every host is tested, (b) `lodging-assets` HTTP behavior is understood, and (c) the Framer-to-Cloudflare cutover is complete and stable. Keep the existing `max-age=31536000` on the apex.

## 5. Staged rollout plan (not executed)

1. Week 0, after cutover is stable: add `Content-Security-Policy-Report-Only` to `public/_headers` for the staging preview branch only. Check the browser console on all pages.
2. Fix any violation. Move the inline scripts to external files and the `style` attributes to CSS if wanted.
3. Add the same header to production, still report-only. Watch for a week.
4. Switch the header name to `Content-Security-Policy`. Keep a one-line rollback ready.
5. Separately, after the DNS review in section 4, raise HSTS in steps: `max-age=86400`, then 604800, then 31536000, then consider `includeSubDomains`. Do not request `preload` until months of clean operation.

## 6. Rollback

- CSP: delete the `Content-Security-Policy*` line from `public/_headers`, push, and let Pages redeploy (a minute or two). Or in the Cloudflare dashboard, promote the previous deployment.
- HSTS: browsers remember HSTS for the whole `max-age`. A mistake cannot be undone quickly. That is why the steps in section 5 start at one day.
- A `Cloudflare Pages` rollback does not undo a zone-level HSTS setting. Change it in the Cloudflare SSL/TLS settings.

## 7. Other headers worth adding later (also not deployed)

`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` that disables camera, microphone, and geolocation. They carry little risk on a static site.
