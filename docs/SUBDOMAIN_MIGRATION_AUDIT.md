# Subdomain migration audit and redirect plan

Prepared 2026-10-02. **Planning only. Nothing here is deployed.** No DNS record, Cloudflare binding, redirect, or header was changed. No subdomain may be deleted or redirected until the redirect is tested on staging and the owner approves it.

Read first: the system-change register entries of 2026-10-02 (Framer cutover prerequisites) and `docs/cutover.md`. The apex is still on Framer. Path-based URLs only exist on the real domain after the cutover.

Live checks behind this table were made on 2026-10-02 with read-only GET and HEAD requests. Search ranking and traffic for each host are **not yet verified**; pull Search Console and analytics data before any redirect (see section 3).

## 1. Migration matrix

Recommendation words: keep, replace, redirect, restrict, archive, retire.

| Current URL | Actual purpose | Recommendation | Proposed destination | Depends on | 301 needed | Rollback |
|---|---|---|---|---|---|---|
| `biketourfrance.net` (apex, Framer) | Main marketing site | **Replace** with this build at cutover | same | Cutover preflight; Pages custom domain; MX/TXT untouched | No | Point the apex A records back at the two Framer addresses recorded in the register; Framer stays live until verified |
| `www.biketourfrance.net` | Framer alias; 308 to apex | **Keep** as redirect to apex | apex | Cutover | Already 308 | Restore the CNAME to `sites.framer.app` |
| `cdm-sep2026.biketourfrance.net` | 2026 CDM overview site (Sept 2026 tour, now past) | **Archive**, then **redirect** once approved | `/canal-des-deux-mers/` | New CDM page live in production; owner decision; the site links to `practical-info` and `resources` | Yes | Remove the redirect rule; the Pages project is untouched |
| `lodging.biketourfrance.net` | Lodging guide, Sheet-driven, 11 of 12 cards render (open owner decision) | **Keep** for now | `/canal-des-deux-mers/lodging/` once a native lodging page exists (not built) | Google Sheet pipeline; `lodging-assets` images; owner decision on 11 vs 12 cards | Yes, later | n/a until moved |
| `practical-info.biketourfrance.net` | Airport-to-station transport guide (2026) | **Redirect** after production check | `/canal-des-deux-mers/practical-info/` (built) | New page live in production; its links back to `cdm-sep2026` | Yes | Remove the redirect rule |
| `resources.biketourfrance.net` | Resource library, French audio, `/dl/` download function, `/media_francais/` | **Keep** | New `/resources/` covers templates, route audio, trusted sites only | `/dl/` Pages Function; `/media_francais/`; shared audio links; deploy only from `BTF_ROOT.FrenchAudioLearning/site` (register, 2026-10-02) | Not yet. Redirect only the root path after `/dl/` and `/media_francais/` are preserved | n/a |
| `cdm-v2.biketourfrance.net` | Current rider app (Sheet-driven) | **Keep** as a separate participant app | none | Google Sheet; the three legacy config traps listed in the July runbook | No | n/a |
| `cdm.biketourfrance.net` | Legacy rider app v1 | **Redirect** after traffic check | `cdm-v2.biketourfrance.net` | Confirm riders and QR codes do not still use it | Yes | Remove the redirect rule |
| `cdm-draft.biketourfrance.net` | Duplicate alias of `cdm` (same page) | **Retire** after traffic check | `cdm-v2.biketourfrance.net` | Same Pages project as `cdm`; deleting the alias must not delete the `cdm` binding | Yes | Re-add the custom domain |
| `cdm-lodging-aug2026.biketourfrance.net` | Past-tour lodging guide | **Archive** | `/canal-des-deux-mers/` (or keep as a dated archive) | Confirm no guest still uses it | Yes, if retired | Re-add the custom domain |
| `cdm-lodging-sep2026.biketourfrance.net` | Past-tour lodging guide | **Archive** | same | same | Yes, if retired | same |
| `cdmstatus2.biketourfrance.net` | Route status portal. Runs scheduled GitHub Actions deploys. Showed "Data unavailable" on 2026-10-02 | **Keep** as a separate subdomain; add noindex | none (optional alias `status.`) | GitHub Actions schedule; n8n connectors | No (alias would need one) | n/a |
| `airqual-cdm.biketourfrance.net` | Air-quality dashboard, Bordeaux to Sète | **Keep** for now | later, a tab in the status portal | n8n connector | No | n/a |
| `airqual-bod-nantes.biketourfrance.net` | Air-quality dashboard, alternate route | **Keep** for now | same | n8n connector | No | n/a |
| `uw-issy.biketourfrance.net` | UW to Issaquah route status. Different audience | **Keep** | none | A watchdog checks its public `system-health.json`; changing the URL breaks the watchdog | No | n/a |
| `francenews.biketourfrance.net` | France News Digest, updated daily | **Keep** | `/france-news/` only after a merge or proxy exists | Daily update pipeline | Yes, if moved | n/a |
| `tourhub.biketourfrance.net` | Unknown. Returns 404 at the custom host and at `tourhub-6yl.pages.dev`; source `CDM_TourHubSite` exists locally | **Verify**, then retire the DNS record or deploy | none until content exists | Check the Pages project state | No | n/a |
| `lodging-assets.biketourfrance.net` | R2 image host for lodging | **Keep** (infrastructure) | none | Lodging page image URLs; HTTP does not redirect to HTTPS | No | n/a |
| `n8n.biketourfrance.net` | Operational n8n | **Keep separate. Restrict** | none | Webhooks must stay reachable (FLE Apps Script route, others); Cloudflare Access only on the UI paths | No | Remove the Access policy |
| `espo.biketourfrance.net` | EspoCRM | **Keep separate. Restrict** | none | CRM users and mail settings (see register entries on EspoCRM) | No | Remove the Access policy |

## 2. What the new site already contains

| New path | Replaces or covers | Status |
|---|---|---|
| `/` | Framer home | Built |
| `/tours/` | none (new) | Built |
| `/canal-des-deux-mers/` | `cdm-sep2026` (2026 content replaced by 2027) | Built |
| `/canal-des-deux-mers/practical-info/` | `practical-info` | Built, text identical to live |
| `/resources/` | Framer `/resources` and part of `resources.*` | Built (templates, route audio, trusted sites). No French audio, no `/dl/` |
| `/about/`, `/contact/`, `/privacy/`, `/terms/`, `/cookies/` | none (new) | Built |
| `/canal-des-deux-mers/lodging/` | `lodging` | **Not built**; needs the lodging Sheet pipeline |

Old URLs stay live and unredirected. The new site only links to the `resources.biketourfrance.net` French audio library; it does not link to `cdm-sep2026`.

## 3. Before any redirect (verification gate)

1. Pull Search Console data (clicks, indexed pages, top queries) and analytics for each host. A host with rankings gets a page-for-page 301; a host with none needs only a tidy redirect.
2. Search the owner's email templates, Drive documents, QR codes, and tour paperwork for each old hostname.
3. Confirm the destination page exists in **production** and contains the content the old page offered.
4. Test the rule on a staging host first (section 5).
5. Record the existing DNS and Pages bindings (read-only export) so the rollback is exact.

## 4. Proposed redirect rules (not deployed)

These would go in a `_redirects` file on the **old** host's Pages project (or a Cloudflare Bulk Redirect). They are not in this repository's `public/` folder, so nothing ships by accident.

```
# cdm-sep2026 project
/    https://biketourfrance.net/canal-des-deux-mers/   301
/*   https://biketourfrance.net/canal-des-deux-mers/   301

# practical-info project
/    https://biketourfrance.net/canal-des-deux-mers/practical-info/   301
/*   https://biketourfrance.net/canal-des-deux-mers/practical-info/   301

# cdm project and cdm-draft (after the traffic check)
/    https://cdm-v2.biketourfrance.net/   301
/*   https://cdm-v2.biketourfrance.net/   301
```

Cautions:

- A blanket `/*` rule sends every deep link to one page. That is acceptable for a single-page site such as `practical-info`. For `cdm-sep2026`, list any deep paths that carry search value first, and map them one to one.
- Cloudflare Pages allows 2,000 static and 100 dynamic rules per project.
- A 301 is cached by browsers for a long time. Test with a 302 first, then switch to 301 when proven.
- `lodging.*` and `resources.*` are not in the list on purpose (section 1).

## 5. Test commands

Run after a rule is deployed to the old host (replace the host as needed). All commands are read-only.

```
# status and destination (expect: HTTP/2 301 and the exact Location)
curl -sI https://cdm-sep2026.biketourfrance.net/ | grep -i -E '^HTTP|^location'
curl -sI https://cdm-sep2026.biketourfrance.net/some/old/path | grep -i -E '^HTTP|^location'
curl -sI https://practical-info.biketourfrance.net/ | grep -i -E '^HTTP|^location'

# no redirect loop, destination returns 200 (follow redirects, show the chain)
curl -sIL https://cdm-sep2026.biketourfrance.net/ | grep -i -E '^HTTP|^location'

# destination carries the right canonical
curl -s https://biketourfrance.net/canal-des-deux-mers/ | grep -o '<link rel="canonical"[^>]*>'

# http variants
curl -sI http://cdm-sep2026.biketourfrance.net/ | grep -i -E '^HTTP|^location'

# nothing else changed: the hosts that must keep working still answer 200
for h in lodging resources cdm-v2 cdmstatus2 uw-issy airqual-cdm n8n espo; do
  printf "%s " $h; curl -s -o /dev/null -w "%{http_code}\n" https://$h.biketourfrance.net/
done
```

Pass condition: one hop, status 301, exact destination, destination 200, no loop, and every "must keep working" host still returns 200.

## 6. Hosts that are not public brands

`n8n`, `espo`, and `lodging-assets` stay separate forever (operational or infrastructure). `cdm-draft`, `cdm-lodging-*`, and `tourhub` are tour-specific or draft names and should not become permanent public addresses. The public brand is the main domain with clean paths.

## 7. Open uncertainties

- Traffic, rankings, and incoming links for every host are unknown.
- `tourhub`: whether the Pages project exists.
- `airqual-alt-cdm.biketourfrance.net` appears in local docs but not in the DNS inventory.
- The Cloudflare project that serves `lodging-git.pages.dev`. Note that `lodging.pages.dev` is an unrelated third-party page and must never appear in a redirect or document.
- `practical-info`: older docs name `practical-info-dku.pages.dev` (404 today); the live target is `practical-info.pages.dev`.
- Whether shared audio or podcast links use `resources.*/dl/` URLs.
