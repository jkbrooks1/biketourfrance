# Fix list: where documented intent and actual behaviour disagree

**Date:** 2026-10-05
**Companion to:** `docs/BTF_MAIN_SITE_BUILD_AND_DEPLOY_DOCUMENTATION.md`

Every item was verified on 2026-10-05 by reading a file or running a command. Each one is a place
where "how things are" and "how we intend them to be" differ. Items marked **FIXED** retain their
original diagnosis as a record of the issue.

Ordered by how much damage each one can still do.

---

## D1 — `npm run build` and `npm run verify` could not run on `main` — **FIXED 2026-10-05**

**Intent:** the documented local workflow is `npm run check`, `npm run build`, `npm run verify`.
**Before fix:** both failed on `main`. `.btf-canonical-root.json` set
`"developmentBranch":"rebuild/2026-10-02-audit-remediation"`, and
`scripts/assert-canonical-root.mjs:21` throws `Wrong development branch: main` whenever the branch
differs and `CI` is not set. All active work is on `main`; the same file already sets
`"productionBranch":"main"`.

**Resolution:** `developmentBranch` is now `main` in `.btf-canonical-root.json`; local `canonical:check`, `build`, and `verify` pass.
**Effort:** one line. **Risk:** none — the field is only read by that assertion.
**Why it mattered:** anyone following the README hit an error that looked like a broken repo.

---

## D2 — the canonical-root marker said the copy gate was inactive — **FIXED 2026-10-05**

**Intent:** the marker records current state.
**Before fix:** `.btf-canonical-root.json` had
`"copyGateStatus":"inactive-blocking-deployment"`. The gate is active, credentialed and green.

**Resolution:** `copyGateStatus` is now `active`.

---

## D3 — Pages does not read the Sheet, so a Sheet edit does not change the site — **design decision needed**

**Intent:** `docs/APPROVED_COPY_GATE.md` line 108 states "No Cloudflare Pages variables are needed,
because the Cloudflare build command stays `npm run build`", and
`docs/PRODUCTION_CUTOVER_PREFLIGHT.md` §3.0 repeats it.
**Actual:** the Pages build command is `npx astro build`. Worse, the documented intent is
impossible: `npm run build` sets `BTF_COPY_FIXTURE=1`, and `resolveMode()` refuses fixture copy
whenever `CF_PAGES` is set, so a Pages build running `npm run build` would fail outright.

Because Pages runs `npx astro build`, it builds from the **committed**
`src/data/approved-copy.ts`. Editing the Sheet therefore has no effect on staging until that
generated file is regenerated and committed.

**Two coherent options — pick one:**

- **Option A, keep today's behaviour and document it.** The Sheet is the authority; the generated
  file is the committed build input; the gate validates each push. Requires: correcting the two
  statements above, and accepting that publishing a Sheet edit means running `copy:generate-ts` and
  committing. Lowest risk; the committed file also makes every deploy reproducible.
- **Option B, make Pages read the Sheet.** Change the Pages build command to the Sheet-mode
  pipeline and add `BTF_COPY_SHEET_ID` and `BTF_COPY_GOOGLE_SA_JSON` as Pages environment variables
  for Preview and Production. A Sheet edit then reaches staging on the next deploy with no commit.
  Requires putting the service-account key into a second system, and makes builds depend on Google
  being reachable.

**Recommendation:** Option A, plus a one-command script (`npm run copy:publish`) that syncs,
verifies and commits the generated file, so publishing a Sheet edit is a single step.

---

## D4 — `main` has no branch protection — **the gate can be bypassed**

**Intent:** `docs/PRODUCTION_CUTOVER_PREFLIGHT.md` §3.0 requires that branch protection on `main`
make **Approved copy check** a required status check.
**Actual:** `gh api repos/jkbrooks1/biketourfrance/branches/main/protection` returns
`Branch not protected` (HTTP 404). There is no protection of any kind, so any push to `main`
deploys to staging whether the gate passes or not.

**Fix:** enable branch protection on `main` requiring the **Approved copy check** status check.
**Note:** this needs a decision about your own workflow, because requiring a check normally means
pushing through pull requests rather than straight to `main`.

---

## D5 — the Pages production branch was wrong until today — **FIXED TODAY, docs still stale**

**Intent:** earlier documents state that the Pages project is connected with production
auto-deploys **off** pending owner approval.
**Actual before today:** `production_branch` was `rebuild/2026-10-02-audit-remediation`, so pushes
to `main` produced Preview deployments while `temp-btf.pages.dev` served a stale production build
from 2026-10-04T22:53Z.
**Actual now:** `production_branch` is `main` and production deployments are enabled, changed at
your request on 2026-10-05. Recorded in the system changes register.

**Fix:** update `docs/PRODUCTION_CUTOVER_PREFLIGHT.md` and `docs/cutover.md` so the "auto-deploys
off" statements match the new intent, and state explicitly that staging auto-deploys from `main`
while the **production domain** cutover remains unapproved.

---

## D6 — documents described a system that no longer exists — **FIXED 2026-10-05**

| File | Previous stale claim | Corrected state |
|---|---|---|
| `README.md:15` | copy gate is "**not active**" | active, credentialed, enforced on every push to `main` |
| `README.md:44` | "`npm run build` and Cloudflare preview builds need no Google credentials and are unaffected by the copy gate" | `npm run build` is fixture-only and fails in CI or Pages; Pages runs `npx astro build`; the gate reads the Sheet in GitHub Actions |
| `AGENTS.md:5` | "Active branch: `rebuild/2026-10-02-audit-remediation`" | `main` |
| `docs/APPROVED_COPY_GATE.md:51` | "The 224 current fields" | 351 fields after D7 and D9 |
| `docs/APPROVED_COPY_GATE.md` §4 | "Credential setup (not done; for the owner)" | done 2026-10-05; both GitHub secrets exist |
| `docs/APPROVED_COPY_GATE.md:108` | "the Cloudflare build command stays `npm run build`" | see D3 |
| `.github/workflows/approved-copy-check.yml` header | gate "NOT ACTIVE", lists activation steps | active since 2026-10-05 |

**Resolution:** README, AGENTS, the copy-gate guide, workflow header, and the current-state guide now describe the active gate and the Pages `npx astro build` command. This documentation change does not select a D3 publishing design.

---

## D7 — orphaned second copy authority — **FIXED 2026-10-05**

**Intent:** one copy authority, `BTF_Approved_Site_Copy`.
**Before fix:** `src/data/practical-info-data.json` was a generated export from a **different**
spreadsheet (`CDMv3_2026_Canonical_Tour_Data`, tab `TRANSPORT_BOD_GARE.STJEAN`). Its transport
copy was moved into the approved Sheet on 2026-10-05 as `/cdm-practical/q1..q6_*` so that one
authority applies. The page still imported the JSON, but only for its `generated_at` date.

**Consequence:** regenerating that upstream export no longer updates this site.

**Resolution:** Added `/cdm-practical/last_checked` = `June 2026` to the approved Sheet, fixture,
and manifest; the practical-info page now renders it through `TEXT`. The JSON import and export
file were removed after confirming no remaining reader. The old CDMv3 export no longer feeds the site.

---

## D8 — 293 Sheet rows are unapproved

**Intent:** everything on the site is owner-approved copy.
**Actual:** 293 of 357 rows are marked YELLOW, added on 2026-10-05. Their wording is the text that
was already on the site, lifted into the Sheet so the gate could enforce it — it has not been
through your review.

**Fix:** review and approve, clearing the yellow fill. The gate cannot tell approved wording from
wording that was merely imported, so this is the one control only you can apply. **This should be
complete before the production domain cutover.**

---

## D9 — seven Sheet rows had no reader — **FIXED 2026-10-05**

**Intent:** every Sheet row controls something on the site.
**Before fix:** seven rows were read by nothing, so editing them had no visible effect:

| Field | Value | Note |
|---|---|---|
| `/404/meta_title` | `Page not found \| BikeTourFrance.net` | the 404 title comes from `/404/heading` instead |
| `/404/header_logo_text` | `BikeTourFrance.net` | header uses `/header/logo_text` |
| `/hero/body_3` | *(empty)* | intentionally blank, unused |
| `/resources/meta_title` | `Resources for planning…` | page title set elsewhere |
| `/resources/helpful_sites_library_text` | `Templates, audio guides…` | duplicate of the `helpful_stuff` pair |
| `/resources/helpful_sites_library_cta` | `Open resource library` | same |
| `/self-guided/subtitle` | `BikeTourFrance.net` | no self-guided page exists |

All seven predate today's work.

**Resolution:** Confirmed no `TEXT` page reference or `COPY` generator mapping reads any of these
fields, then deleted all seven from the live Sheet, fixture, and manifest. The generated copy file
was regenerated from the live Sheet. Final count: 351 in all three sources.

---

## D10 — two unpushed commits on the retired branch

**Intent:** `main` is the single active branch.
**Actual:** `rebuild/2026-10-02-audit-remediation` sits at `baba02e`, two commits ahead of its
remote, never pushed. They predate the work now on `main`.

**Fix:** decide whether anything in them is still wanted, then push or abandon the branch.

---

## FIXED TODAY

| Item | What was wrong | Resolution |
|---|---|---|
| 19 junk Sheet rows | A codemod's quote scanner desynchronized on an apostrophe inside a comment, mangled `src/data/site.ts`, and its garbage output was appended to the Sheet as 18 `/nav/copy_*` rows holding TypeScript fragments. `/nav/copy_1` contained `john@biketourfrance.net`. Nothing read them, and their words were counting as approved copy anywhere, weakening the coverage check. | Rows deleted from Sheet, fixture and manifest. `site.ts` had already been reverted and rewritten by hand; its scanner now masks comments first. Sheet, fixture and manifest agree at 357. Commit `2976f3c`. |
| `/nav/text_1` | Duplicate of `/nav/practical_info` under a meaningless name, in the wrong namespace. | Page repointed at `/nav/practical_info`; row deleted. |
| Stale staging site | `temp-btf.pages.dev` served a build from before your Sheet edits. | Pages production branch set to `main`; production deploy of `main` completed. Staging now matches the Sheet. |
| Personal information on the site | `src/data/site.ts` hardcoded `email: 'john@biketourfrance.net'`, powering every `mailto` link; "John Brooks" appeared in four meta descriptions and the CDM lede. | Email reads `/contact/contact_email`; name shortened to "John". `dist/` verified clean of both. |
| `BTF_DEPLOY_ENV` never reached `assert-deployable` | The variable was prefixed to the first command of an `&&` chain, so the deployability gate was unpassable regardless of copy correctness. | Chain moved into `copy:production-pipeline`, with the variable set on the outer `npm run`. |
| `npm run build` skipped `copy:generate-ts` | The Pages-facing build script never regenerated the copy file, so it could build from a stale one. | Step added. |

---

## Suggested order

1. **D1, D2, D6, D7, D9** — completed 2026-10-05.
2. **D3** — decide Option A or B. Everything about how copy is published depends on this.
3. **D4** — branch protection, once you have decided how you want to push to `main`.
4. **D8** — approve the 293 rows. The long pole, and a prerequisite for the domain cutover.
5. **D10** — the retired branch decision remains open.

D3, D4, D8 and D10 remain owner decisions. This cleanup does not change their scope.
