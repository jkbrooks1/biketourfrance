# BikeTourFrance.net style guide (implementation record)

The authority is the owner's **Unified Style & Positioning Guide v4.3**, stored in `docs/OWNER_STYLE_GUIDE_v4.3.md`. This file records how the site implements it, the repository rules that keep it consistent, and every place where the build departs from the owner guide. Code: `src/styles/global.css`, `src/components/`, `src/layouts/BaseLayout.astro`.

## Brand name

- Visible brand: **BikeTourFrance.net**, always. Never "Bike Tour France", "BikeTourFrance" without `.net`, or "BTF" in visible copy.
- The name comes from `SITE.name` in `src/data/site.ts`. Page titles read "Page name | BikeTourFrance.net".
- `scripts/verify-dist.mjs` fails the build check if a page shows the name any other way.
- The person is John Brooks (first person on the About page, "John" elsewhere). Tagline: Eat. Sleep. Roll. Repeat.

## Voice

Calm, practical, and specific, in line with the guide's tone (experienced rider, capable organizer, understated authority). Short sentences. Say what is included, what is not, and what is still undecided. No hype, no luxury-travel clichés, no promises that have not been confirmed.

## Colors (guide v4.3)

| Token | Value | Use |
|---|---|---|
| `--green` | `#2d5016` | Header band, footer band, primary buttons, headings, links, borders |
| `--green-dark` | `#1f3d11` | Hover |
| `--green-pressed` | `#17300c` | Active and pressed |
| `--beige` | `#f5f0e8` | Secondary buttons, warm sections |
| `--blue` | `#1b4f72` | Link hover, informational accents only |
| `--white` | `#ffffff` | Text on green, section backgrounds |

Additions that are not brand colors: body ink `#1a1a1a`, muted ink `#4a4a44`, hairline `#d9d2c3`, focus rings (`#0a58ca` on light, `#ffd166` on dark green), and the yellow staging banner and orange review note that appear on staging only.

## Typography

- Montserrat (variable), self-hosted through `@fontsource-variable/montserrat`, with `system-ui, sans-serif` fallback. No other typeface. Nothing loads from Google Fonts.
- Weights: headings 700 (h1) and 600 (h2 to h4), buttons 600, body 400, navigation 500.
- Sentence case everywhere. No all-caps text (the verifier fails on `text-transform: uppercase`).
- Body 16 px, line height 1.7. h1 tops out at 40 px, so there are no oversized hero slogans. Nothing is smaller than 14.4 px.

## Layout

- Container: `width: calc(100% - 40px); max-width: 1280px; margin: 0 auto` on phones (20 px side edge), as the guide states. From 768 px up the owner raised the side edge to 80 px (`width: calc(100% - 160px)`, still capped at 1280 px), so left and right content edges are at least 80 px on tablet and desktop. Reading text is capped at 68 characters.
- Sections alternate white and beige. Section padding is `clamp(40px, 6vw, 80px)`.
- Multi-column layouts collapse to a single stack on phones and never overflow (tested at 320, 375, 390, 768, 1024, and 1440 px).

## Header and footer

- Header: full-width green band, 72 px tall on desktop, white logo mark and the **BikeTourFrance.net** wordmark on the left, navigation on the right. The logo is the owner's white-on-transparent asset (`src/assets/brand/btf-logo-white.png`), flat, with no effects.
- Navigation: Tours, Canal des Deux Mers, Practical Information, Resources, About, Contact. The current page is marked by a heavier underline and weight (not by color alone) and by `aria-current="page"`.
- Below 1080 px the links collapse behind a **Menu** button. Without JavaScript the full list stays visible. Escape closes the menu.
- Footer: full-width green band with the logo, email, the same six links, and Privacy, Terms, and Cookies.
- The link lists live in `NAV` and `LEGAL_NAV` in `src/data/site.ts`. Never link to a page that does not exist; `npm run verify` checks every internal link.

## Buttons and links

- **Primary:** `#2d5016` fill, white text, 6 px radius, 12 px 24 px padding, 16 px, weight 600, minimum height 44 px, soft shadow. Hover `#1f3d11` and a 2 px lift. Active `#17300c`.
- **Secondary** (`.btn--secondary`): beige fill, green border, green text.
- **Tertiary:** underlined text links, no container and no shadow. This is the default link style.
- All buttons are real links to a real place or a `mailto:` address. No `#` placeholders.
- Link text says where it goes. Headings are never used as button labels, and buttons never contain headings.
- Lift animation is off when the visitor prefers reduced motion.

## Focus and accessibility

- Every interactive element shows a 3 px outline with a 3 px offset on `:focus-visible` (the guide minimum offset is 2 px).
- Never write `outline: none` or `outline: 0`. The verifier fails on either.
- Touch targets are at least 44 by 44 px. Contrast meets WCAG AA.
- One `<h1>` per page, no skipped heading levels, one `<main>`, a skip link, and landmarks on every page.

## Images

- Photos live in `src/assets/photos/` and are added to `src/data/photos.ts` with alt text. Alt text describes only what is visible. People are not named. A place is named only when a sign or other visible text proves it.
- Captions appear only where a place is proven ("Créon", "Canal du Midi route signs").
- Decorative images use empty alt text. Only the header and footer logos are decorative.
- Use the `Photo` component: AVIF and WebP at several widths; `priority` only for the single hero image on a page; everything else lazy-loads.
- Gallery tiles share one square crop.
- **Photography and illustration are never mixed in one section.** Today every page section is photography only, except the Practical Information page, which uses one panda illustration with no photographs.

## Public facts

Public 2027 facts come only from `src/data/cdm2027.ts` (see `docs/2027_CDM_CONTENT_AUTHORITY.md`). No prices, deposits, cancellation terms, or exact dates until the owner approves them.

## Deviations from the owner guide (owner to confirm)

| # | Guide says | Site does | Why |
|---|---|---|---|
| 1 | Approved navigation labels: Overview; Schedule short meeting to discuss; Overnight Destinations. | Uses Tours, Canal des Deux Mers, Practical Information, Resources, About, Contact. | The remediation brief (item NAV-001) requires these six links. The guide's labels read as tour-page navigation. **Owner decision:** whether the guide's labels apply to the Canal des Deux Mers page's own sub-navigation. |
| 2 | Logo: white on transparent. | The logo asset has no wordmark, so the header and footer show it with the text "BikeTourFrance.net" beside it. | Keeps the brand name visible beside the mark. |
| 3 | Primary button is plain green. | On the dark hero photo the primary button also has a white 2 px edge. | Green on a dark green photo would disappear. |
| 4 | Not specified for dark bands. | The closing "Ready to ride?" band is beige with a green top rule, not dark green. | Lets both buttons keep the exact guide colors. |
| 5 | The guide shows engraving and panda illustrations as the illustration systems. | The site has no engraving artwork yet. Photographs from earlier rides fill that role. | Only the existing live-site photographs were available. |
| 6 | "Avoid startup SaaS cards." | Content groups use plain bordered boxes with a 6 px radius and no shadow. | Keeps structure without a card-grid look. |
| 8 | Container side edge is 20 px at every width. | 80 px from 768 px up, 20 px on phones. | Owner instruction of 2026-10-03. |
| 7 | Hero should answer "what, where, why" in seconds. | The home hero states small-group tours in France, the 2027 Canal des Deux Mers tour, and the two actions. | Meets the guide; noted here for review. |
