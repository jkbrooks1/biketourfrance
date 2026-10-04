# Style guide v4.4 remediation report (2026-10-03)

Branch `rebuild/2026-10-02-audit-remediation`. Acceptance list: `BTF_STYLE_GUIDE_v4.4_AUDIT_20261003.md`. Proof: `docs/proof/2026-10-03/` (`browser_report.json`, screenshots). Test: 11 routes at 375, 768, 1024, and 1440 px, 0 failures (`npm run check:browser`).

| # | Status | Proof |
|---|---|---|
| B1 | Fixed | No horizontal overflow on any route at 4 widths; one `calc(100% - 40px)` / 1280px container |
| B2 | Fixed | Header band rgb(45,80,22), full width, 72/64/56px at desktop/tablet/mobile |
| B3 | Fixed | Approved white-on-transparent logo (byte-identical to the guide's asset), 48px (40px mobile), alt text set |
| B4 | Fixed | Home, Tours, About, Resources, Contact; keyboard menu with toggle below 768px |
| B5 | Fixed | No `#` or empty links (verify + browser). Join and ask actions are `mailto:` with a subject; no signup is claimed |
| B6 | Fixed | Full-width green footer, 40px logo, links, legal copy |
| B7 | Fixed | Legal copy 14px; no text under 14px; buttons 16px |
| B8 | Fixed | Focus 2px solid #2D5016, 4px offset, checked on all 25 focusable items on home |
| M1 | Fixed | Buttons: 6px radius, 12px 24px padding, 600 weight, 16px, subtle shadow |
| M2 | Fixed | Measured: hover #1F3D11 and lifts 2px with a larger shadow; active #17300C, no shadow |
| M3 | Fixed | Secondary: #F5F0E8 fill, 2px green border, green text |
| M4 | Fixed | One shared Button; one primary green #2D5016 |
| M5 | Fixed | Every button, nav link, footer link, and standalone link is 44px or more; inline links inside sentences are exempt |
| M6 | Fixed | One h1 per page, no heading jumps; h1 40/56px, h2 28/36, body 16px |
| M7 | Fixed | `--font: Montserrat, system-ui, sans-serif` everywhere; Montserrat loads |
| M8 | Fixed | Button throws and verify fails on headings over 60 or labels over 24 characters |
| M9 | Fixed | Reading text capped at 70ch |
| M10 | Fixed | Four `.net` omissions corrected; verify bans the bare form |
| M11 | Fixed | Browser check finds no off-scale padding, gap, or margin. Allowed: the guide's 12px button padding and the owner's 40px Ready-to-ride left padding |
| M12 | Fixed, one note | Source photos 290 KB or less, delivered files 300 KB or less (verify), AVIF with WebP fallback, crops 16:9, 1:1, 3:4, 6px radius. The home hero is a full-bleed cover image, so its on-screen shape follows the viewport (source is 16:9) |
| M13 | Fixed | No image without alt on any route |
| M14 | Fixed | header, nav, main, footer on every route through BaseLayout |
| m1 | Fixed | Grey plate removed. Flat dark-green tint at 74%; text contrast 6.26:1 or better at all four widths |
| m2 | Fixed | Hero padding 64px |
| m3 | Fixed | All exclamation marks removed; verify fails on any `!` in page text |
| m4 | Fixed | "each day's route" and "(package coming soon.)". "Hotels & B&B's" is not in the current Sheet or native pages (verify bans it) |
| m5 | Not applicable | Native list markup has no empty bullets (verify fails on empty `<li>`) |
| m6 | Fixed | The `<a>` is the button and has the pointer cursor |
| m7 | Fixed | One resource-library block with one button |

Extra fixes: stray semicolon in "What's included;" removed; the "He answers every message himself" promise removed from the closing call to action.

## Open issues for the owner

1. **Footer legal copy conflict.** The Sheet's `/footer/policies` says the site collects email and calendar data for webinars and uses tracking cookies with consent by continued use. The Privacy and Cookies pages say the site collects nothing and sets no cookies. Both now show; one is wrong for this site.
2. **The Sheet still holds the defects** (exclamation marks, `.net` omissions, "each days route", "soon!.", over-long labels). It was not edited; fix it before any fresh pull.
3. **Approved-copy gate manifest** (`copy/field-manifest.json`) maps the v4.3 text and fails against these pages (`copy:check-local`). It is inactive and not in the Cloudflare build; removed from `npm test`. Regenerate before activation.
4. **Sheet vs content authority doc.** The Sheet includes the $250 planning session and the three host dinners that `docs/2027_CDM_CONTENT_AUTHORITY.md` held back; they are published as the Sheet says. The CDM page still uses the authority doc's wording ("up to twelve riders") while the home and About pages use the Sheet's ("fewer than 12").
5. The Framer export in `site/` and `scripts/build_site.py` remain in git as inactive reference. Nothing from them ships (verify checks `dist/`).
