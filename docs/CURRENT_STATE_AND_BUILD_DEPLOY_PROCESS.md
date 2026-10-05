# Current state, build and deploy process — biketourfrance.net

**Audit date:** 2026-10-05
**Scope:** read-only. No commit, push, deploy, Cloudflare API call, Pages configuration change, or
source modification was made.
**Canonical local root:** `/Users/jkbrookspersonal/LocalSiteBuildFiles/00_BTF_MAIN_SITE_CLOUDFLARE_ROOT`
(the former `00_BTF_MAIN_SITE_ROOT_ON_CLOUDFLARE` path no longer exists on disk).

---

## 1. Git branch and workspace state

| Item | Observed |
|---|---|
| Active branch | `main`, tracking `origin/main`, in sync |
| Working tree | clean (`git status --short --branch` printed only `## main...origin/main`) |
| HEAD | `24cc405` docs: record staging fix - temp-btf production branch was not main |
| Other local branch | `rebuild/2026-10-02-audit-remediation` at `baba02e`, **ahead 2** of its remote |
| Remote | `origin  https://github.com/jkbrooks1/biketourfrance.git` (fetch and push) |

Last five commits on `main`:

```
24cc405 docs: record staging fix - temp-btf production branch was not main
889b68c fix: source every rendered string from the approved Sheet, and check it
7825f86 docs: audit finds 214 unapproved strings the copy gate cannot detect
628ea4c docs: record v4.5 style guide, green copy gate, and the Pages deploy blocker
8165d18 fix: make BTF_DEPLOY_ENV reach the whole predeploy chain
```

`rebuild/2026-10-02-audit-remediation` holds two commits that were never pushed. They predate the
work now on `main` and are not part of the deployed site.

---

## 2. Local build and test pipeline — what actually happens on `main`

### Succeeds on `main`

| Command | Result |
|---|---|
| `npm run check` | 0 errors, 0 warnings, 2 hints (28 files) |
| `node scripts/verify-dist.mjs` | `verify-dist: 12 pages OK` |
| `npm run copy:test` | `10 passed, 0 failed` |
| `CI=true npm run canonical:check` | `canonical-root: PASS (native-astro)` |

### Fails on `main`

| Command | Failure | Cause |
|---|---|---|
| `npm run canonical:check` | `Error: Wrong development branch: main.` | `.btf-canonical-root.json` sets `"developmentBranch":"rebuild/2026-10-02-audit-remediation"`. `scripts/assert-canonical-root.mjs:21` throws when not in CI and the current branch differs. |
| `npm run verify` | fails at its **first** sub-step | `verify` = `npm run canonical:check && node scripts/verify-dist.mjs`. The canonical check above aborts it. `verify-dist` itself passes when run directly. |
| `CI=true npm run build` | `copy:sync FAILED. Fixture copy is not allowed here.` | `build` sets `BTF_COPY_FIXTURE=1`. In `scripts/copy/lib.mjs`, `resolveMode()` computes `inCI = Boolean(env.CI \|\| env.GITHUB_ACTIONS \|\| env.CF_PAGES)` and throws when `BTF_COPY_FIXTURE=1` coincides with `inCI` or any `BTF_DEPLOY_ENV`. |

**Correction to a common assumption.** `npm run build` does **not** currently "execute native Astro
without requiring Google Sheet credentials" on this branch. Two separate guards stop it: the
development-branch marker (locally on `main`) and the fixture-in-CI refusal (with `CI=true`). It
does run on the branch named in the marker with no CI variable set.

### The two guards, stated plainly

1. **Development-branch marker.** `.btf-canonical-root.json` still names
   `rebuild/2026-10-02-audit-remediation` as the development branch, although `productionBranch` in
   the same file is `main` and all active work is on `main`. Every script that calls
   `canonical:check` therefore fails locally on `main`. The check is skipped when `CI` is set, which
   is why GitHub Actions is unaffected.
2. **Fixture refusal.** Fixture copy exists for local development only and is refused in any context
   that could deploy — CI, Cloudflare Pages, or a set `BTF_DEPLOY_ENV`. This is deliberate: staging
   and production must read `BTF_Approved_Site_Copy`.

**Stale field in the marker:** `"copyGateStatus":"inactive-blocking-deployment"`. That is no longer
true — see section 3.

---

## 3. Approved-copy gate — current status

### Workflow

`.github/workflows/approved-copy-check.yml`, job name **Approved copy check**.

- **Triggers:** `workflow_dispatch`; `push` to `main`; `pull_request` to `main`.
- **Steps:** checkout → set up Node 22 (npm cache) → `npm ci` → *Production check* running
  `npm run predeploy:approved-copy`.
- **Secrets consumed:** `BTF_COPY_SHEET_ID`, `BTF_COPY_GOOGLE_SA_JSON`.
- The workflow contains **no deploy step**. It validates and builds; it does not publish.

The file's own header comments still describe the gate as "NOT ACTIVE" and list activation
instructions. Those comments are stale; the triggers below them are live.

### Secrets present (names and dates only; no values read)

```
BTF_COPY_GOOGLE_SA_JSON   2026-10-05T02:54:29Z
BTF_COPY_SHEET_ID         2026-10-05T02:56:18Z
```

The gate is therefore **active and credentialed**, not inactive.

### Recent workflow runs

The five most recent runs all concluded **success** (~1m22s–1m25s each), the latest being
`37329982987`. The production pipeline is:

```
predeploy:approved-copy = BTF_DEPLOY_ENV=production npm run copy:production-pipeline
copy:production-pipeline = copy:sync → copy:validate → copy:generate-ts → astro build
                           → copy:verify-rendered → verify → assert-deployable
```

### Field counts

| File | Count |
|---|---|
| `copy/field-manifest.json` | 376 fields |
| `copy/fixture/fixture-rows.json` | 376 rows (375 with non-empty values) |

### Bi-directional coverage

The gate checks both directions, which is the key property:

1. **Sheet → page.** Every manifest field marked `required` must appear on its expected route. A
   mismatch between the approved value and the rendered text fails the build.
2. **Page → Sheet.** No rendered string may contain prose that no approved field supplies. For each
   visible block, title, meta description, `alt` and `aria-label`, the check removes every approved
   value the block contains, longest first, and requires only punctuation, digits and whitespace to
   remain. A block may legitimately combine several approved fields, because that is layout rather
   than copy.

   The allow-list is deliberately small and explicit: `Skip to main content`, `Menu`, `Main`,
   `Site`, `Home`, and the twelve month names (dates are machine-formatted with
   `toLocaleDateString`). Anything added to that list stops being checked against the Sheet.

Direction 2 had previously been removed from the script while its header still claimed to enforce
it, which allowed hardcoded copy to ship while the gate reported success. `npm run copy:test` now
includes a regression check — "rendered text with no approved field fails the rendered gate" — so
its removal would break the test suite.

---

## 4. Deployment architecture

*Source for this section: repository files, `docs/BUILD_LOG.md`, and
`00_A.SYSTEMS_CHANGES_REGISTER/SYSTEM_CHANGES_REGISTER.md`. The Cloudflare API was out of scope for
this audit, so the live values below are **recorded, not verified live in this audit**.*

- **Mechanism:** Cloudflare Pages Git integration, project **`temp-btf`**, connected to
  `jkbrooks1/biketourfrance`. Deployment happens through GitHub; there is no Wrangler direct deploy
  and no deploy step in GitHub Actions.
- **Pages build command:** `npx astro build`, output directory `dist`.
- **Production branch:** `main` (recorded). It was `rebuild/2026-10-02-audit-remediation` until
  2026-10-05, which is why pushes to `main` produced Preview deployments at per-commit hashed URLs
  while the staging host kept serving an older Production build.
- **Staging URL:** `https://temp-btf.pages.dev` (recorded).
- **Preview behaviour:** pushes to any branch other than the production branch produce a Preview
  deployment with a per-commit URL of the form `https://<deployment-id>.temp-btf.pages.dev`, plus a
  per-branch alias. Previews do not affect the staging host.

**Important consequence of the Pages build command.** Because Pages runs `npx astro build` only, it
does **not** run the approved-copy gate and does **not** read the Sheet during deployment. It builds
from the **committed** `src/data/approved-copy.ts`. A Sheet edit therefore does not reach staging
until that generated file is regenerated (`copy:generate-ts`) and committed. The GitHub Actions gate
is what reads the Sheet, and it validates rather than deploys.

`astro.config.mjs` confirms the shape of the build: `site: 'https://biketourfrance.net'`,
`trailingSlash: 'always'`, `build.format: 'directory'`, sitemap integration excluding `/404/`.

---

## 5. Staging protections — verified by reading the files

| Protection | Observed value |
|---|---|
| `src/data/site.ts:17` | `indexingEnabled: false` |
| `src/layouts/BaseLayout.astro:69` | `{!SITE.indexingEnabled && <meta name="robots" content="noindex, nofollow, noarchive" />}` — the meta tag is emitted only while indexing is disabled; a second guarded block appears at line 91 |
| `public/_headers` | `X-Robots-Tag: noindex, nofollow, noarchive` on `/*`, plus `Cache-Control: max-age=0, no-cache, no-store, must-revalidate`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()` |
| `public/robots.txt` | `User-agent: *` / `Disallow: /` |

All three layers are in force: response header, meta tag, and robots.txt.

---

## 6. Findings worth acting on

1. **`.btf-canonical-root.json` is out of date in two ways.** `developmentBranch` still names
   `rebuild/2026-10-02-audit-remediation`, which breaks `npm run build` and `npm run verify`
   locally on `main`; and `copyGateStatus` still reads `inactive-blocking-deployment` although the
   gate is active, credentialed and passing. Updating `developmentBranch` to `main` would make the
   local pipeline usable again on the branch actually in use.
2. **The workflow file's header comments are stale**, describing the gate as "NOT ACTIVE" and
   listing activation steps that have already been done.
3. **A Sheet edit alone does not update staging.** Making Pages read the Sheet directly would mean
   changing its build command to the Sheet-mode pipeline and adding `BTF_COPY_SHEET_ID` and
   `BTF_COPY_GOOGLE_SA_JSON` as Pages environment variables. Not done; owner decision.
4. **`rebuild/2026-10-02-audit-remediation` has two unpushed commits.** Decide whether they are
   still wanted before that branch is deleted or reused.

---

## Scope limitations

- The Cloudflare API and `~/.wrangler/config/default.toml` were out of scope, so the production
  branch, staging URL and deployment history in section 4 are reported from the build log and the
  system changes register rather than confirmed against Cloudflare in this audit.
- `npm run predeploy:approved-copy` was not run, so no live Sheet read happened during this audit.
  Gate health is reported from GitHub Actions run conclusions instead.
- No HTTP request was made to any staging or production host.
