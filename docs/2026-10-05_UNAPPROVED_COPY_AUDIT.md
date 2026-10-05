# Unapproved copy: audit and resolution — BikeTourFrance.net

**Date:** 2026-10-05
**Status:** RESOLVED. Every user-visible string on all 12 routes now comes from
`BTF_Approved_Site_Copy`, and the gate fails the build if that stops being true.
**Trigger:** the owner found unapproved copy on /tours/ — "Ways to ride in France with
BikeTourFrance.net" (`src/pages/tours/index.astro:20`).

## What was wrong

**214 user-visible strings across all 12 routes were not in the Sheet**, from 152 hardcoded
occurrences in 17 source files. Two independent causes:

**1. The gate only ever checked one direction.** It verified that approved Sheet copy *appears* on
the pages, and never that every visible string *comes from* the Sheet. So text hardcoded in a
component shipped silently while the gate reported success — `copy:verify-rendered` printed
"OK: 12 pages, 63 fields confirmed" on a site carrying 214 unapproved strings.

The reverse check had been removed while its documentation was left in place.
`scripts/copy/verify-rendered.mjs` still advertised it in its header. Line 83 still declared
`const allBlocks = []; // every approved text fragment, for the "no uncovered text" check`,
filled it at line 92, and never read it again — dead code. Lines 137-140 declared the gap
intentional, claiming the material was "verified separately by verify-dist". That was untrue:
`verify-dist` checks lengths, brand spelling and accessibility, and has no concept of Sheet
approval.

**2. The field manifest had been cut from 224 fields to 57.** The 224-field inventory is still in
`docs/COPY_FIELD_MAP_REVIEW.md`. Roughly 160 fields of real page copy left both the manifest and
the Sheet, and because of cause 1, nothing flagged the loss.

## What was done

**The reverse check is restored**, as section 2 of `verify-rendered.mjs`. The contract it enforces:
every word a visitor reads must come from an approved Sheet field. A rendered block may combine
several approved fields, because that is layout rather than copy; what it may not contain is prose
no approved field supplies. For each block the check removes every approved value it contains,
longest first, and requires that only punctuation, digits and whitespace remain.

The allow-list is deliberately short and explicit: `Skip to main content`, `Menu`, `Main`, `Site`,
`Home`, and the twelve month names (dates are machine-formatted with `toLocaleDateString`).
Anything added there stops being checked against the Sheet.

**The generator now emits `TEXT`** alongside the existing nested `COPY`. `TEXT` exposes every Sheet
field by its exact Sheet path, so a component can render approved copy without that field first
needing a hand-written entry in the `SCALARS` map. This is what keeps page text and Sheet rows in
one-to-one correspondence. `COPY` is unchanged, so nothing that already worked was disturbed.

**312 rows were added to the Sheet** (rows 66-377), every one marked **YELLOW = unapproved and
awaiting owner approval**. The Sheet now holds 376 fields, up from 64. The 64 pre-existing rows
were not edited.

**Every hardcoded literal was re-pointed at the Sheet**, across 26 files: page templates,
components, layouts, and the `src/data/*.ts` catalogues. Mixed-content templates, string arrays,
component props, navigation labels and the pre-filled email subjects and bodies are all included.

**Two personal-information leaks were found and fixed** — both invisible to the rendered audit and
both things the owner had already asked to remove:
- `src/data/site.ts` still set `email: 'john@biketourfrance.net'`, which powered every `mailto`
  link on the site. It now reads `/contact/contact_email` (contact@biketourfrance.net).
- "John Brooks" survived in four meta descriptions and in the CDM page lede. All now read "John".
  Verified: zero occurrences of either string in `dist/`.

**A permanent regression test was added** (`copy:test`, now 10 checks). Dropping a field that a
page renders must fail the gate. The reverse check was deleted once before; this test exists so it
cannot be removed silently again.

**Also fixed along the way:** `npm run build`, the Cloudflare Pages command, never ran
`copy:generate-ts`, so Pages would have built from a stale generated file.

## Verification, against the live Sheet

- `copy:sync` — 376 data rows from `BTF_Approved_Site_Copy`
- `copy:validate` — OK, 376 fields from sheet
- `copy:generate-ts` — OK
- `astro build` — 12 pages, 0 errors
- `copy:verify-rendered` — **OK: 12 pages, 375 fields confirmed (source: sheet)**
- `verify-dist` — 12 pages OK
- `astro check` — 0 errors
- `copy:test` — 10 passed, 0 failed
- Personal information in `dist/`: `John Brooks` 0 files, `john@biketourfrance.net` 0 files,
  `contact@biketourfrance.net` on all 12 pages

**Gate proven to work:** injecting "Book our brand new Pyrenees expedition today" into the /tours/
heading makes `copy:verify-rendered` fail, naming the route, the element and the offending text.
Restoring the Sheet-backed version makes it pass again.

## Known limitation

The check proves no unapproved *words* ship. It does not prove the text is *sourced* from the
Sheet at build time: a literal that duplicates an approved value exactly would still pass, and
would then silently fail to follow a later Sheet edit. Closing that would require comparing each
rendered block to the field it is supposed to come from, route by route. Worth doing if Sheet edits
ever appear not to reach a page.

## Owner action outstanding

The 312 new rows are YELLOW. Review and approve the wording, then clear the fill. Field names were
generated mechanically (`/tours/heading_1`, `/cdm-practical/q3_tram`), so rename any that would be
easier to maintain under a different name — the code reads the Sheet path, so a rename needs the
matching `TEXT['...']` reference updated in the file named in `copy/field-manifest.json`.
