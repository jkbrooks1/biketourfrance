# 2026-10-02 audit remediation report

> **Later change (2026-10-02, after this report):** all public copy now comes from the Google Sheet BTF_Approved_Site_Copy, enforced by the build (`docs/APPROVED_COPY_GATE.md`). The files `src/data/cdm2027.ts`, `src/data/resources.ts`, and `src/data/practical-info-data.json` named below were removed. The page text is unchanged: all 11 pages read identically before and after.

Branch: `rebuild/2026-10-02-audit-remediation` (from `rebuild/initial`). Repository: `github.com/jkbrooks1/biketourfrance`. Staging project: Cloudflare Pages `temp-btf`.
Commit hashes and the preview URL are in the closing entry of `docs/BUILD_LOG.md`, because a file cannot contain its own commit hash.

**Nothing in production was touched.** No DNS, Cloudflare setting, domain binding, redirect, security header, or Framer content was changed. Nothing was merged to `main`.

## How the evidence was produced

| Proof | What it covers | Where |
|---|---|---|
| `npm run check` | Astro type check: 0 errors, 0 warnings | `docs/proof/2026-10-02/01_static_checks.txt` |
| `prettier --check .` | Formatting clean | same file |
| `npm run build` | 11 pages, sitemap generated | same file |
| `npm run verify` (`scripts/verify-dist.mjs`) | One H1 per page, landmarks, skip link, heading order, unique titles and descriptions, canonicals, alt text, internal links and fragments, staging noindex, banned content (prices, consent-by-use wording, "upcoming 2026", analytics), brand spelling, no all-caps, no outline suppression, sitemap, robots, 404 | same file |
| Browser, 11 pages x 6 widths | No horizontal overflow, no clipped elements, no tap target under 44 px (320, 375, 390, 768, 1024, 1440) | `02_browser_checks.txt` |
| Browser, keyboard | First Tab stop is the skip link and it moves focus to `<main>`; every focus stop shows a 3 px outline; no keyboard trap; mobile menu opens with the keyboard, shows `aria-expanded`, and Escape closes it; no-JavaScript fallback shows the navigation; zero cookies set | same file |
| Browser, images | Every lazy-loaded image loads after scrolling at 320 and 1440 px | same file |
| Browser, report-only CSP | 0 violations with the proposed policy; 24 with a deliberately broken policy (negative control) | same file; `docs/SECURITY_CSP_AUDIT.md` |
| Page weight | Live Framer home 5.2 MB, 44 requests, 0 lazy images; new home 234 KB at 390 px (1.2 MB at 1440 px); new CDM page 132 KB at 390 px | `03_performance_before_after.txt` |
| Screenshots | Before (live Framer, 375 px) and after (home 390 and 1440 px, CDM 320 px) | `docs/proof/2026-10-02/*.jpg` |

Limits of this evidence: the browser tests ran against the local build served by `astro preview`, not yet against the Cloudflare preview. Local load timings are not comparable with a live site over a network, so only transferred bytes and image behavior are compared. The 404 status was seen from the local preview; confirm it on the Pages preview after the first deploy.

## Status by audit item

| # | ID | Priority | Status |
|---|---|---|---|
| 1 | CV-001 | P0 | PARTIAL |
| 2 | RW-001 | P0 | DONE |
| 3 | CT-002 | P0 | DONE |
| 4 | CT-001 | P0 | DONE |
| 5 | NAV-001 | P1 | DONE |
| 6 | TR-001 | P1 | PARTIAL |
| 7 | A11Y-001 | P1 | DONE |
| 8 | A11Y-002 | P1 | DONE |
| 9 | RS-001 | P1 | DONE |
| 10 | SEO-001 | P2 | DONE |
| 11 | PERF-001 | P2 | DONE |
| 12 | A11Y-003 | P2 | DONE |
| 13 | CDM-001 | P2 | DONE |
| 14 | DES-001 | P3 | DONE |
| 15 | NF-001 | P3 | DONE |
| 16 | BR-001 | P3 | DONE |
| 17 | SEC-001 | P3 | DONE |

Two PARTIAL items wait on owner decisions. No item is BLOCKED or NOT STARTED.

## Item detail

### 1. CV-001 (P0): conversion paths. PARTIAL
- **Done:** every button on the new pages goes to a real destination. The waitlist, trip-planning, and general buttons are `mailto:john@biketourfrance.net` links with a pre-filled subject and message (`src/data/site.ts`). The email address is visible in the footer on every page, on the Contact page (`src/pages/contact/index.astro`), and in the closing band (`src/components/ContactCta.astro`). All are keyboard-reachable links, at least 44 px high.
- **Not done:** there is no mailing-list or waitlist form. The DNS shows a MailerLite account, but no form endpoint, group, or consent wording is documented, and a test submission could not be proven. The Contact page says plainly that sign-up is by email. It makes no claim that a list signup works.
- **Files:** `src/data/site.ts`, `src/components/ContactCta.astro`, `src/components/Footer.astro`, `src/pages/contact/index.astro`, `src/pages/index.astro`, `src/pages/tours/index.astro`, `src/pages/canal-des-deux-mers/index.astro`.
- **Evidence:** the 11-page link check in `npm run verify` and the keyboard test.
- **Owner decisions:** approve the mailto route; supply the form endpoint, fields, and consent text if a form is wanted (`docs/PRODUCTION_CUTOVER_PREFLIGHT.md` section 2, items 1 and 2).
- **Rollback:** revert the branch commit; the Framer site is unchanged.

### 2. RW-001 (P0): responsive clipping. DONE
- The "Ready to ride?" area is now the shared closing band: heading, one sentence, two buttons in a wrapping row. The container is `calc(100% - 40px)` up to 1280 px, so a desktop has wide side margins and a phone has 20 px.
- **Files:** `src/styles/global.css`, `src/components/ContactCta.astro`.
- **Evidence:** zero overflow, zero clipped elements, and zero tap targets under 44 px on all 11 pages at all six widths (`02_browser_checks.txt`). The live Framer page showed no scroll overflow either, because its clipping happened inside containers; the screenshots show the difference.
- **Rollback:** revert the commit.

### 3. CT-002 (P0): 2026 destination replaced. DONE
- New 2027 page at `/canal-des-deux-mers/`. Every "2027 tour" button on the home and Tours pages points to it. The 2026 tour appears only as history: one paragraph stating it ran in September 2026 and is finished, plus audio guides and a narrative on the Resources page.
- No 2026 site was deleted or redirected. The redirect plan, proposed rules, and test commands are in `docs/SUBDOMAIN_MIGRATION_AUDIT.md`, sections 4 and 5.
- **Files:** `src/pages/canal-des-deux-mers/index.astro`, `src/data/cdm2027.ts`, `docs/SUBDOMAIN_MIGRATION_AUDIT.md`.
- **Evidence:** `npm run verify` finds no "upcoming 2026" wording, no dollar amount, and no provisional price on any page.
- **Owner decision:** confirm the "September 2026" history wording; approve each redirect separately.
- **Rollback:** revert the commit; `cdm-sep2026.biketourfrance.net` is untouched.

### 4. CT-001 (P0): one included / separate statement. DONE
- One content source (`src/data/cdm2027.ts`) feeds one component (`src/components/Included.astro`), used on the home page and the CDM page. Pricing and dates are stated as not final. Self-supported travel, no luggage transport, required panniers, guest-owned bikes, direct e-bike rental, and the required phone with RideWithGPS are all stated.
- **Files:** `src/data/cdm2027.ts`, `src/components/Included.astro`, `src/pages/index.astro`, `src/pages/canal-des-deux-mers/index.astro`, `docs/2027_CDM_CONTENT_AUTHORITY.md`.
- **Evidence:** the same text appears on both pages; the verifier finds no price figure.
- **Owner decisions:** confirm the live-site items carried over and the one inference (lunches not included), listed in the authority document.
- **Rollback:** revert the commit.

### 5. NAV-001 (P1): shared header and footer. DONE
- One header and footer on every page, including the 404. Links: Tours, Canal des Deux Mers, Practical Information, Resources, About, Contact; footer adds Privacy, Terms, and Cookies. Mobile menu collapses behind a Menu button and works without JavaScript. Every link resolves to a built page.
- **Files:** `src/components/Header.astro`, `src/components/Footer.astro`, `src/layouts/BaseLayout.astro`, `src/scripts/nav.ts`, `src/data/site.ts`.
- **Evidence:** the internal-link check and the keyboard and menu tests.
- **Owner decision:** the owner style guide names three navigation labels that differ from these six (`docs/STYLE_GUIDE.md`, deviation 1).
- **Rollback:** revert the commit.

### 6. TR-001 (P1): policy pages. PARTIAL
- Privacy, Terms, and Cookies pages exist and state only what the site's code does: no forms, no analytics, no cookies of its own (0 cookies observed), email handled by John's mailbox, hosting on Cloudflare Pages, no bookings on the site, no tour terms published. Nothing says or implies consent by continued use (the verifier fails on that wording). No consent banner was added, because no non-essential tool is deployed.
- **Why PARTIAL:** these are factual shells. The owner must review them, and the legal and provider details listed in `docs/PRODUCTION_CUTOVER_PREFLIGHT.md` (section 2, item 9) before production. Until then each page shows an orange "Draft for owner review" box, on staging only.
- **Files:** `src/pages/privacy/index.astro`, `src/pages/terms/index.astro`, `src/pages/cookies/index.astro`, `src/components/ReviewNote.astro`.
- **Evidence:** `npm run verify`; cookie count of zero in the keyboard test.
- **Rollback:** revert the commit.

### 7. A11Y-001 (P1): semantic structure. DONE
- Exactly one H1 per page, no skipped heading levels, one `<main id="main">`, `<header>`, `<nav>`, and `<footer>` landmarks, and a skip link that appears on focus and moves focus to the main content. No heading is used as a button label.
- **Files:** `src/layouts/BaseLayout.astro` and every page.
- **Evidence:** `npm run verify` (all 11 pages) and the skip-link test.
- **Rollback:** revert the commit.

### 8. A11Y-002 (P1): image alt text and captions. DONE
- Every informative photo has concise alt text describing only what is visible. Only the header and footer logos have empty alt text, as they sit beside the brand name. Two photos have place captions, each proven by a visible sign ("Créon", "Canal du Midi route signs"). No person is named and no location is guessed.
- **Files:** `src/data/photos.ts`, `src/components/Gallery.astro`, `src/components/Photo.astro`.
- **Evidence:** the verifier finds no image without alt text and no more than two with empty alt.
- **Rollback:** revert the commit.

### 9. RS-001 (P1): resources. DONE
- A native `/resources/` page replaces the broken Apps Script embeds: the packing-list sheet, 13 audio route guides plus the food introduction (playable and downloadable, loaded only on press), the mobile historical narrative, and 12 trusted sites. Link checks on 2026-10-02 found the desktop narrative Google Doc deleted (HTTP 410), so it was omitted. Three entries that were Google search links rather than documents were also omitted. No stray code text, no embeds, no placeholders.
- **Not included:** the French-learning audio library stays on `resources.biketourfrance.net`; the page links to it. The `/dl/` function is not part of this build.
- **Files:** `src/pages/resources/index.astro`, `src/data/resources.ts`.
- **Evidence:** the verifier; the link check recorded in `src/data/resources.ts`; the audio element loaded from the media host under the CSP trial.
- **Rollback:** revert the commit.

### 10. SEO-001 (P2): metadata and structured data. DONE
- Unique title and description on every page (the verifier checks uniqueness and length), canonical URLs on the production origin, Open Graph tags, a sitemap (`sitemap-index.xml` and `sitemap-0.xml`, with the 404 page excluded), and `Organization` and `WebSite` JSON-LD built only from the name, domain, and logo. No `Event` or `Offer` markup, because dates and prices are not approved. The staging noindex blocks remain, so none of this is crawlable yet.
- **Files:** `src/layouts/BaseLayout.astro`, `astro.config.mjs`, each page's `title` and `description`.
- **Evidence:** `npm run verify`.
- **Rollback:** revert the commit.

### 11. PERF-001 (P2): images and delivery. DONE
- Photos are resized at the source and served as AVIF and WebP in several widths. The single hero image per page loads eagerly with high fetch priority; the other 11 to 14 images per page are lazy. Fonts are self-hosted. No third-party script.
- **Measured (transfer size):** live Framer home 5.2 MB in 44 requests, all 18 images eager. New home 234 KB in 6 requests at 390 px, and 1.2 MB in 15 requests at 1440 px, with 11 of 13 images lazy.
- **Files:** `src/components/Photo.astro`, `src/components/Gallery.astro`, `src/assets/photos/*`, `package.json`.
- **Evidence:** `03_performance_before_after.txt`. Load times from a local server are not meaningful and are not claimed.
- **Rollback:** revert the commit.

### 12. A11Y-003 (P2): focus and keyboard. DONE
- A 3 px `:focus-visible` outline with a 3 px offset on every interactive element (yellow on the green bands). The player controls get the same ring. No `outline: none` or `outline: 0` anywhere (the verifier fails if one appears).
- **Files:** `src/styles/global.css`.
- **Evidence:** the keyboard test: 22 pages and viewport sizes, every focus stop has a ring, no trap, logical order.
- **Rollback:** revert the commit.

### 13. CDM-001 (P2): copy cleanup. DONE
- Duplicate copy removed: the Framer export carries each text block three times, once per screen-size layout, and the new pages carry one copy. "BikeTourFrance.net" is the one visible brand form, as the owner style guide requires, and the verifier fails on any other form. Labels cleaned up ("What about my bike?!?!" is now "What about my bike?", numbering removed from the Practical Information questions). "Fewer than 12 riders" became the confirmed maximum of twelve.
- **Files:** all pages, `src/data/*`.
- **Evidence:** `npm run verify`.
- **Owner decision:** confirm the brand spelling choice (the earlier brief said "BikeTourFrance"; the owner style guide v4.3, which governs, says "BikeTourFrance.net").
- **Rollback:** revert the commit.

### 14. DES-001 (P3): hierarchy and rhythm. DONE
- Shared spacing scale, one square gallery crop that keeps people in frame, 16 px body text, no text under 14.4 px, hero headline capped at 40 px, and a consistent alternating white and beige section rhythm. This is a design judgment; the owner should review the screenshots.
- **Files:** `src/styles/global.css`, `src/components/Gallery.astro`.
- **Rollback:** revert the commit.

### 15. NF-001 (P3): 404 page. DONE
- A branded 404 with the shared header and footer, links to every main page, and two buttons. `src/pages/404.astro` builds to `dist/404.html`; Cloudflare Pages serves it with HTTP 404. The local preview returned 404 for an unknown path. Confirm on the Pages preview after deploy.
- **Files:** `src/pages/404.astro`.
- **Rollback:** revert the commit.

### 16. BR-001 (P3): brand system and style guide. DONE
- One name, one set of colors and fonts, shared header and footer, written up in `docs/STYLE_GUIDE.md` against the owner's guide v4.3 (stored in `docs/OWNER_STYLE_GUIDE_v4.3.md`). The style guide lists seven places where the build departs from the owner guide.
- **Owner decision:** review the deviations in `docs/STYLE_GUIDE.md`.
- **Rollback:** revert the commit.

### 17. SEC-001 (P3): CSP and HSTS audit. DONE
- Full inventory of what the site loads, a trial report-only policy with 0 violations (and a negative control that fails as expected), HTTPS and HSTS status of all 19 known hosts, a staged plan, and rollback notes. `public/_headers` was not changed beyond the staging noindex rule.
- **Findings to act on later:** `lodging-assets` does not redirect HTTP to HTTPS; only the apex, `www`, and `espo` send HSTS; do not use `includeSubDomains` until the DNS record list is re-exported.
- **Files:** `docs/SECURITY_CSP_AUDIT.md`.
- **Rollback:** nothing deployed.

## Production-only changes intentionally not performed

Domain binding and DNS changes, redirects, security headers, turning indexing on, merging to `main`, enabling production deploys, replacing the live Framer site, and any change to `n8n`, `espo`, `lodging-assets`, or the old subdomains.

## Remaining owner decisions

The full list is in `docs/PRODUCTION_CUTOVER_PREFLIGHT.md`, section 2. The main ones: approve the mailto route or supply a form, review the three policy pages, restore or omit the $250 planning price, confirm the carried and inferred copy, and rule on the navigation labels.

## Other things this work found

- The live `/resources` Framer page embeds are broken. They are replaced here, not fixed in Framer.
- `lodging.pages.dev` is an unrelated third-party gambling page; our lodging project's `pages.dev` host is `lodging-git.pages.dev`.
- `tourhub.biketourfrance.net` returns 404 on both hosts. `airqual-alt-cdm.biketourfrance.net` is named in local docs but is not in the DNS inventory.
- The earlier fallback log path in the brief, `/Users/jkbrookspersonal/JBLocal FilesTEMP/00_GENERAL_BUILDLOG.md`, is retired in the owner's rules. The canonical `/Users/jkbrookspersonal/JBLocalBuildLogs/00_GENERAL_BUILDLOG.md` was used.
