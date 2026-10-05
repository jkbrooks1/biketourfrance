# BikeTourFrance.net main-site build and deploy documentation

**Effective:** 2026-10-05
**Supersedes:** the packet of the same name that bundled documents verbatim. That packet is stale:
its build log stopped at 2026-10-03, it used the retired root name
`00_BTF_MAIN_SITE_ROOT_ON_CLOUDFLARE`, and it stated that the approved-copy gate was inactive and
its credentials unset. All three are now wrong.

Everything in this document was verified by reading a file or running a command on 2026-10-05.
Where something could not be verified, it says so.

---

## 1. One-paragraph summary

`biketourfrance.net` is still served by **Framer**. The replacement is a native Astro site in
`jkbrooks1/biketourfrance`, deployed by the Cloudflare Pages Git integration to the project
`temp-btf` and visible at **https://temp-btf.pages.dev**. All visitor-facing text comes from the
Google Sheet `BTF_Approved_Site_Copy`, and a GitHub Actions gate fails the build if any rendered
string does not. The cutover of the live domain has not happened and is not scheduled here.

---

## 2. Canonical locations

| Thing | Value |
|---|---|
| Local root | `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT` |
| GitHub remote | `https://github.com/jkbrooks1/biketourfrance.git` |
| Working branch | `main` |
| Cloudflare Pages project | `temp-btf` |
| Staging URL | https://temp-btf.pages.dev |
| Approved-copy Sheet | `BTF_Approved_Site_Copy`, id `1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw`, tab `Approved Site Copy` |
| Sheet reader | service account `btf-sheets-access@btf-general.iam.gserviceaccount.com` |
| Project build log | `docs/BUILD_LOG.md` |
| General build log | `/Users/jkbrookspersonal/JBLocalBuildLogs/00_GENERAL_BUILDLOG.md` |
| System changes register | `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_A.SYSTEMS_CHANGES_REGISTER/SYSTEM_CHANGES_REGISTER.md` |

The retired root `00_BTF_MAIN_SITE_ROOT_ON_CLOUDFLARE` no longer exists on disk.

---

## 3. The site

12 built routes: `/`, `/tours/`, `/about/`, `/canal-des-deux-mers/`,
`/canal-des-deux-mers/practical-info/`, `/resources/`, `/contact/`, `/waitlist-2027/`, `/privacy/`,
`/terms/`, `/cookies/`, and `/404.html`.

`astro.config.mjs`: `site: 'https://biketourfrance.net'`, `trailingSlash: 'always'`,
`build.format: 'directory'`, sitemap integration excluding `/404/`. Static files that must be served
as-is live in `public/`. The old Framer export in `site/` is kept in git as reference only and is
not served.

---

## 4. Where copy comes from

### The rule

Only copy in `BTF_Approved_Site_Copy` may appear on the site. The Sheet is two columns:
`page/field_name` in A, the copy in B.

### How a Sheet field reaches a page

1. `copy:sync` reads the Sheet with the service account and writes a snapshot artifact to `.copy/`
   (git-ignored).
2. `copy:validate` checks the snapshot against `copy/field-manifest.json`: no unknown fields, no
   duplicates, no blank required values.
3. `copy:generate-ts` writes `src/data/approved-copy.ts`, which exports two things:
   - **`COPY`** — a nested, camelCase object for the fields listed in the `SCALARS` and `LISTS`
     tables inside `scripts/copy/generate-ts.mjs`. This is the older access path, for example
     `COPY.notFound.heading` from `/404/heading`.
   - **`TEXT`** — every Sheet field keyed by its exact Sheet path, for example
     `TEXT['/tours/heading_1']`. A component can render approved copy through `TEXT` without the
     field first needing a hand-written mapping entry. This is what keeps page text and Sheet rows
     in one-to-one correspondence.
   The script contains **no copy text of its own**. If the code needs a field the Sheet lacks, the
   build fails and names the exact rows to add.
4. `astro build` renders the pages from that generated file.
5. `copy:verify-rendered` checks the built HTML in **both** directions (section 5).

### Current counts, verified 2026-10-05

| Item | Count |
|---|---|
| Sheet data rows | 351 |
| `copy/field-manifest.json` fields | 351 |
| `copy/fixture/fixture-rows.json` rows | 351 |
| Fields confirmed on their routes by the gate | 351 |
| Owner copy review | Open (D8); the new `/cdm-practical/last_checked` row is marked yellow |

### Naming

`page/field_name`: a leading `/`, a page or namespace segment, then `/`, then the field. Examples:
`/hero/heading`, `/tours/heading_1`, `/cdm-practical/q3_tram`, `/nav/practical_info`,
`/email/waitlist_body`. Field names added on 2026-10-05 were generated mechanically, so some are
positional rather than descriptive. Renaming one requires updating the matching `TEXT['...']`
reference in the file named in `copy/field-manifest.json`.

---

## 5. The approved-copy gate

### Both directions are checked

1. **Sheet → page.** Every manifest field marked `required` must appear on its expected route, and
   page titles and meta descriptions must match their approved values. A page title may be the
   approved value followed by `" | <brand>"`, because `BaseLayout` appends the brand.
2. **Page → Sheet (coverage).** No rendered string may contain prose that no approved field
   supplies. For every visible block, title, meta description, `alt` and `aria-label`, the check
   removes each approved value the string contains, longest first, and requires that only
   punctuation, digits and whitespace remain. A block may legitimately combine several approved
   fields, because that is layout rather than copy.

   The allow-list is deliberately short: `Skip to main content`, `Menu`, `Main`, `Site`, `Home`, and
   the twelve month names, because dates are machine-formatted with `toLocaleDateString`. **Anything
   added to that list stops being checked against the Sheet.**

Direction 2 had been removed from the script at some earlier point while the file header still
claimed to enforce it, which let hardcoded copy ship while the gate reported success. 214 unapproved
strings were on the site when that was found on 2026-10-05. `npm run copy:test` now contains the
check "rendered text with no approved field fails the rendered gate", so removing it again breaks
the test suite.

### Fixture mode

`copy/fixture/fixture-rows.json` mirrors the Sheet for offline work. `scripts/copy/lib.mjs`
`resolveMode()` computes `inCI = Boolean(env.CI || env.GITHUB_ACTIONS || env.CF_PAGES)` and **refuses
fixture copy** whenever `BTF_COPY_FIXTURE=1` coincides with `inCI` or any `BTF_DEPLOY_ENV`. The
GitHub Actions gate reads the Sheet. Pages currently builds the committed generated file with
`npx astro build`; it does not run the copy scripts.

---

## 6. Commands, and what actually happens on `main`

### Verified working on `main`

| Command | Result on 2026-10-05 |
|---|---|
| `npm run check` | 0 errors, 0 warnings, 2 hints |
| `node scripts/verify-dist.mjs` | 12 pages OK |
| `npm run copy:test` | 10 passed, 0 failed |
| `npm run canonical:check` | PASS (native-astro) after D1 |
| `npm run build` | PASS locally in fixture mode after D1; refused under `CI` or `CF_PAGES` |
| `npm run verify` | PASS, 12 pages OK after D1 |
| `CI=true npm run canonical:check` | PASS (native-astro) |
| `npm run predeploy:approved-copy` | PASS against 351 live Sheet fields and 12 routes on 2026-10-05 |

### Local build limitation

| Command | Result | Cause |
|---|---|---|
| `CI=true npm run build` or `CF_PAGES=1 npm run build` | `copy:sync FAILED. Fixture copy is not allowed here.` | `build` sets `BTF_COPY_FIXTURE=1`; fixture mode is intentionally refused in CI and Pages. Use the Sheet-mode predeploy pipeline for the gate, while Pages continues to run `npx astro build`. |

D1 and D2 in the fix list were resolved on 2026-10-05. The previous branch assertion and stale
copy-gate marker are historical findings, not current failures.

### Script definitions

```
check                     = astro check
canonical:check           = node scripts/assert-canonical-root.mjs
verify                    = canonical:check && node scripts/verify-dist.mjs
build                     = canonical:check && BTF_COPY_FIXTURE=1 copy:sync && copy:validate
                            && copy:generate-ts && astro build && copy:verify-rendered && verify
copy:production-pipeline  = copy:sync && copy:validate && copy:generate-ts && astro build
                            && copy:verify-rendered && verify && assert-deployable
predeploy:approved-copy   = BTF_DEPLOY_ENV=production npm run copy:production-pipeline
copy:test                 = node scripts/copy/negative-tests.mjs
```

`BTF_DEPLOY_ENV=production` is set on the **outer** `npm run` so the whole inner chain inherits it.
A variable assignment prefixed to the first command of an `&&` chain reaches only that command, which
previously made `assert-deployable` unpassable regardless of copy correctness.

---

## 7. Deploy

### Two independent mechanisms. Only one deploys.

**GitHub Actions — validates, does not deploy.**
`.github/workflows/approved-copy-check.yml`, job **Approved copy check**.
- Triggers: `workflow_dispatch`; `push` to `main`; `pull_request` to `main`.
- Steps: checkout → Node 22 with npm cache → `npm ci` → `npm run predeploy:approved-copy`.
- Secrets: `BTF_COPY_SHEET_ID`, `BTF_COPY_GOOGLE_SA_JSON`. Both exist, both added 2026-10-05.
- It reads the live Sheet and ends with
  `predeploy OK: dist/ matches a current snapshot of BTF_Approved_Site_Copy and is deployable.`
- There is **no deploy step**. Runs are currently green.
- The workflow header records that the gate became active on 2026-10-05.

**Cloudflare Pages Git integration — builds and deploys.**
- Project `temp-btf`, connected to `jkbrooks1/biketourfrance`.
- Production branch: `main`. Production deployments enabled.
- Build command: **`npx astro build`**. Output directory: `dist`.
- A push to `main` produces a **production** deployment serving `temp-btf.pages.dev`.
- A push to any other branch produces a **preview** deployment at
  `https://<deployment-id>.temp-btf.pages.dev` plus a per-branch alias. Previews do not affect the
  staging host.

### The consequence you must know

Because the Pages build command is `npx astro build` and nothing more, **Pages does not run the gate
and does not read the Sheet.** It builds from the **committed** `src/data/approved-copy.ts`.

So: **editing the Sheet does not change the staging site.** The generated file has to be regenerated
and committed. The working sequence is:

```
export BTF_COPY_SHEET_ID=1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw
npm run copy:sync && npm run copy:validate && npm run copy:generate-ts
npx astro build && node scripts/copy/verify-rendered.mjs   # prove it before committing
git add src/data/approved-copy.ts && git commit && git push origin main
```

The push triggers both the GitHub Actions gate (validation) and the Pages production deploy. This is
divergence **D3** — the documented intent was that Pages would read the Sheet itself.

### Rollback

Roll back to a previous Cloudflare Pages deployment for the project, or revert the commit and push.
Pages keeps prior deployments addressable by id.

---

## 8. Staging protections

Verified by reading the files:

| Protection | Value |
|---|---|
| `src/data/site.ts:17` | `indexingEnabled: false` |
| `src/layouts/BaseLayout.astro:69` | `{!SITE.indexingEnabled && <meta name="robots" content="noindex, nofollow, noarchive" />}` |
| `public/_headers` | `X-Robots-Tag: noindex, nofollow, noarchive` on `/*`, plus no-store `Cache-Control`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()` |
| `public/robots.txt` | `User-agent: *` / `Disallow: /` |

Three layers: response header, meta tag, robots.txt. A "Draft for owner review" box also shows on
Privacy, Terms and Cookies **only while `indexingEnabled` is false**, so the legal review has to
happen before indexing is turned on.

---

## 9. Personal information rules

The owner's personal name and address must not appear on the site.

- `src/data/site.ts` reads `email: TEXT['/contact/contact_email']`, which is
  `contact@biketourfrance.net`. It previously hardcoded `john@biketourfrance.net`, which powered
  every `mailto` link.
- "John Brooks" is not used; "John" is.
- Verified on the built site: zero occurrences of `john@biketourfrance.net` and `John Brooks` in
  `dist/`, and `contact@biketourfrance.net` on all 12 pages.

Any new Sheet row must respect both rules; the gate enforces that copy comes from the Sheet, not
that the Sheet is free of personal data.

---

## 10. Secrets

| Secret | Where | Purpose |
|---|---|---|
| `BTF_COPY_SHEET_ID` | GitHub Actions secret | the Sheet id |
| `BTF_COPY_GOOGLE_SA_JSON` | GitHub Actions secret | read-only service-account key |
| service-account key file | `~/.config/btf/google/service-account.json` | local Sheet access |

No Cloudflare Pages environment variables are set, and none are needed while the Pages build command
is `npx astro build`. Never commit a key, paste one into chat, or write one to a build log.

---

## 11. Current status

- The latest local Sheet-mode predeploy passed with 351 fields and 12 built routes. Staging serves
  the committed version of `approved-copy.ts`; confirm its deployment ID after the next push.
- GitHub Actions gate green.
- `biketourfrance.net` still served by Framer (`server: Framer/26fa766`, DNS `31.43.160.6`,
  `31.43.161.6`). No custom domain cutover has occurred.
- Owner review of imported Sheet copy remains open (D8). The new last-checked row is yellow.
- `main` has **no branch protection**, so the gate is not a required check.

See `docs/BTF_BUILD_DEPLOY_FIX_LIST.md` for every point where documented intent and actual
behaviour disagree, and what each fix requires.
