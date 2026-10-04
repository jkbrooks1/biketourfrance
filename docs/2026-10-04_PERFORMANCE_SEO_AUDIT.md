# Performance, content-governance, and SEO/LLM audit — 2026-10-04

Branch: `rebuild/2026-10-02-audit-remediation`. Scope: the Astro project at this repo root, as staged on Cloudflare Pages (`temp-btf`), ahead of the planned Framer cutover.

## How this audit was run

Direct inspection of the source tree — no guesses from memory. Before writing any finding, this audit cross-checked the project's own existing docs (`docs/APPROVED_COPY_GATE.md`, `docs/COPY_FIELD_MAP_REVIEW.md`, `docs/SECURITY_CSP_AUDIT.md`) so it would not re-report work already planned, or contradict a decision already made and recorded.

## Summary

| Area | Result |
|---|---|
| 1. Content governance & migration purge | No code fix needed. See below — the apparent "hardcoded copy" is a known, fully-tracked, pre-activation state. |
| 2. SEO, semantics, AI-citability | Three real gaps found and fixed: per-page social image, missing Twitter Card fields, no breadcrumb structured data. |
| 3. Astro performance & Cloudflare edge | Clean. No client-side hydration, no raw `<img>` tags, no Framer debt. One safe header addition applied. |
| 4. Fixes | Two fixes implemented, type-checked, and build-verified in the working tree (not committed). |

---

## 1. Content governance & migration purge

**Framer legacy debt:** none. `grep -rli framer src/` returns nothing. `package.json` has exactly three runtime dependencies (`astro`, `@astrojs/sitemap`, `@fontsource-variable/montserrat`) — no animation library, no leftover Framer runtime. The migration purge is already complete.

**Hardcoded copy:** real, but not a defect. `src/pages/index.astro`, `Footer.astro`, and `404.astro` pull every string from `src/data/approved-copy.ts`. The other pages (`tours`, `canal-des-deux-mers`, `contact`, `resources`, `waitlist-2027`, parts of `about`) do have headings, ledes, and body copy written directly in the `.astro` file rather than imported from `approved-copy.ts`.

This looks like drift, but `docs/APPROVED_COPY_GATE.md` explains it is the designed, current state: a production-only "approved copy gate" has been built and tested against a Google Sheet (`BTF_Approved_Site_Copy`) as the intended future source of truth, but **"Until the owner approves activation, the site's text lives in the repository exactly as before."** `docs/COPY_FIELD_MAP_REVIEW.md` confirms every one of the 224 copy fields across all 11 routes — including every string this audit flagged — is already catalogued with its exact code location, and an automated check (`npm run copy:check-local`) already verifies no page shows text outside that map.

**Conclusion:** nothing to fix here. The real next step is the one already on file in `APPROVED_COPY_GATE.md` §5 — share the Sheet with the service account and let the owner decide when to populate and activate the gate. Re-wiring individual pages to a parallel copy source now would fight that plan, not help it.

---

## 2. SEO, semantics & AI-citability (LLMO)

**Heading hierarchy:** checked every page — strict `h1 → h2 → h3` nesting throughout, no skipped levels, every `<section>` carries `aria-labelledby` tied to a real heading id. No fix needed.

**Trailing slashes:** `astro.config.mjs` sets `trailingSlash: 'always'`; every internal `href` across `src/pages`, `src/components`, and `src/layouts` follows it. No fix needed.

**Meta tags — gaps found and fixed in `src/layouts/BaseLayout.astro`:**
- Every page shared the same Open Graph image (the homepage hero), regardless of topic. `BaseLayout` now accepts an optional `ogImage` prop; `about/index.astro` and `tours/index.astro` now pass a photo that actually matches the page (`three-riders-town.jpg`, `rider-on-canal-path.jpg`) as a working example of the pattern. Pages that don't pass one keep the original hero image, so this is backward compatible with all nine other pages.
- `twitter:card` was present, but `twitter:title`, `twitter:description`, and `twitter:image` were missing, so link previews on X/Twitter fell back to a generic card instead of the page's own title, description, and image. Added, mirroring the existing `og:*` values.

**Structured data (JSON-LD):** was `Organization` + `WebSite` only. Added a `BreadcrumbList` entry, built mechanically from `path` and the page's own `title` — it states nothing the page doesn't already show, so it carries no risk of the kind `docs/APPROVED_COPY_GATE.md` and the CDM content-authority rules guard against (inventing a fact the page hasn't confirmed). Verified in the built HTML: home page renders a single-item ("Home") breadcrumb; `about/` renders two items ("Home", "About John Brooks").

A deeper schema addition — a `Service`/`TouristTrip` entity for the actual tour offering — was considered and **not** added. The 2027 tour's dates and pricing are explicitly marked "not final" on every page that mentions them (`CDM_FACTS`, `docs/2027_CDM_CONTENT_AUTHORITY.md`), and schema.org `Offer`/`TouristTrip` markup conventionally implies a bookable, priced product. Adding it now risks AI search engines and shopping surfaces citing firm trip details that don't exist yet. Revisit this once the owner finalizes 2027 dates/pricing.

**Robots and indexing:** `robots.txt` disallows everything and `SITE.indexingEnabled` is `false`, matching the project's own staging rule. No change made — this is expected pre-cutover, not a bug.

---

## 3. Astro performance & Cloudflare Pages edge optimization

**Images:** every image in `src/` goes through `Photo.astro` (wrapping `astro:assets` `<Picture>`) or a direct `<Image>` component (`Header.astro`, `Footer.astro`, `BaseLayout.astro`'s OG/touch-icon generation). `grep -rn "<img" src/` returns nothing — there is no raw, unoptimized `<img>` tag anywhere in source. AVIF with WebP fallback, responsive widths, and `loading`/`fetchpriority` are all already wired per-image in `Photo.astro`. No fix needed.

**Hydration:** zero `client:*` directives anywhere in `src/`. The only client-side JavaScript is two small vanilla scripts (`src/scripts/nav.ts`, 19 lines, for the mobile nav toggle, and an inline form-submit handler on `waitlist-2027.astro`) — neither is a framework island, so the site ships effectively zero hydration cost. No fix needed.

**Headers / Cloudflare config:** there is no `wrangler.toml` (not required for a static Pages project) and `public/_headers` carried only the staging `noindex` and no-cache rules. `docs/SECURITY_CSP_AUDIT.md` already contains a thorough, tested CSP and HSTS readiness audit with a deliberate staged rollout plan — it is correctly **not yet deployed**, pending the Framer cutover and a DNS re-check for HSTS safety (enabling it today would affect `n8n` and `espo` subdomains immediately, per that doc's own findings). This audit did not touch CSP or HSTS, to avoid contradicting that plan.

That same doc's §7 separately lists three headers as "worth adding later, little risk on a static site," independent of the CSP/HSTS staging: `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`. Those three were added to `public/_headers` — they're inert on a static site with no embeds, no third-party scripts, and no geolocation/camera/microphone use, and they don't touch the CSP question that doc is still staging carefully.

---

## 4. Ready-to-commit fixes (implemented, type-checked, build-verified)

Both fixes are already applied to the working tree at the canonical project root (uncommitted — for your review before commit, per standing instructions). `npx astro check` passes with 0 errors/0 warnings (two pre-existing hints, unrelated: an unused `canalTowpath` import left over from the hero-image fix, and an async-conversion style hint on the waitlist form). `npx astro build` completes cleanly, 12 pages.

### Fix 1 — `public/_headers`: add the three low-risk headers already recommended in `docs/SECURITY_CSP_AUDIT.md` §7

```
/*
  X-Robots-Tag: noindex, nofollow, noarchive
  Cache-Control: max-age=0, no-cache, no-store, must-revalidate
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Fix 2 — `src/layouts/BaseLayout.astro`: per-page OG image, complete Twitter Card, mechanical BreadcrumbList

```astro
---
// Shared page shell: head metadata, skip link, header, main landmark, footer.
// Each page supplies one <h1> inside the slot. Staging protections come from SITE.indexingEnabled.
import '../styles/global.css';
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import logo from '../assets/brand/logo-mark.png';
import appleIcon from '../assets/brand/apple-touch-icon.png';
import { PHOTOS } from '../data/photos';
import { SITE } from '../data/site';

interface Props {
  title: string; // Page title without the brand suffix. The home page passes its full title and sets home.
  description: string;
  path: string; // Site path, for example /resources/. Used for canonical and nav state.
  home?: boolean;
  notFound?: boolean;
  // Per-page social preview image. Defaults to the site hero photo when a page has no better photo of its own.
  ogImage?: ImageMetadata;
}
const { title, description, path, home = false, notFound = false, ogImage } = Astro.props;

const fullTitle = home ? title : `${title} | ${SITE.name}`;
const canonical = new URL(path, SITE.origin).href;
const og = await getImage({ src: ogImage ?? PHOTOS.hero.src, width: 1200, height: 630, fit: 'cover', format: 'jpg' });
const logoImg = await getImage({ src: logo, width: 512, format: 'png' });
const touch = await getImage({ src: appleIcon, width: 180, format: 'png' });
const ogUrl = new URL(og.src, SITE.origin).href;

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.origin,
    logo: new URL(logoImg.src, SITE.origin).href,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.origin,
  },
  // Mechanical breadcrumb trail (Home, then this page). Built only from `path` and `title`,
  // so it never states a fact the page itself does not already show.
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: (home
      ? [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE.origin }]
      : [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.origin },
          { '@type': 'ListItem', position: 2, name: title, item: canonical },
        ]),
  },
];
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    {!notFound && <link rel="canonical" href={canonical} />}
    {!SITE.indexingEnabled && <meta name="robots" content="noindex, nofollow, noarchive" />}
    <meta property="og:site_name" content={SITE.name} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    {!notFound && <meta property="og:url" content={canonical} />}
    <meta property="og:image" content={ogUrl} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={fullTitle} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogUrl} />
    <link rel="icon" href="/favicon.png" type="image/png" />
    <link rel="apple-touch-icon" href={touch.src} />
    <script is:inline>
      document.documentElement.classList.add('js');
    </script>
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body>
    <a class="skip-link" href="#main">
      Skip to main content
    </a>
    {!SITE.indexingEnabled && (
      <div class="staging-banner" role="note">
        Staging preview. This site is not indexed by search engines and is not the live BikeTourFrance.net
        site.
      </div>
    )}
    <Header path={path} />
    <main id="main" tabindex="-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

Two call sites were updated to use the new `ogImage` prop as a worked example (`src/pages/about/index.astro` passes `PHOTOS.threeRidersTown.src`; `src/pages/tours/index.astro` passes `PHOTOS.riderCanalPath.src`). The other nine pages are unaffected and keep the original hero image by default — extending this to them is a one-line addition per page whenever you want to pick a photo for each.

---

## What was deliberately not touched, and why

- **No copy was moved into `approved-copy.ts`.** Doing so would create a second, ungoverned copy path that competes with the Sheet-backed gate already built in `docs/APPROVED_COPY_GATE.md`. If you want the remaining pages copy-governed sooner, the lever is activating that gate (step 1 there: share the Sheet), not a parallel refactor.
- **No CSP or HSTS header was added or changed.** `docs/SECURITY_CSP_AUDIT.md` already has a tested, ready policy and an explicit staged rollout plan that intentionally waits on the Framer cutover and a full DNS re-check. Adding it now would contradict a decision already on record.
- **No `TouristTrip`/`Offer` schema was added**, because 2027 dates and pricing are explicitly not final yet; adding priced-offer markup now could get cited as fact before you've confirmed it.
