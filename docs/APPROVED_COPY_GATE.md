# Approved copy gate

**Status, 2026-10-05:** Active and credentialed. GitHub Actions runs **Approved copy check** on ordinary pushes and pull requests to `main`, and on manual dispatch. GitHub suppresses this separate check for pushes made with the scheduled workflow's `GITHUB_TOKEN`; that workflow runs the same full predeploy pipeline before committing. Branch protection is not yet enabled, so a push can still reach Cloudflare Pages before or despite a failing check; see D4 in `docs/BTF_BUILD_DEPLOY_FIX_LIST.md`.

The copy authority is the Google Sheet `BTF_Approved_Site_Copy`, tab `Approved Site Copy`. Its two columns are `page/field_name` and `copy`. The Sheet, `copy/fixture/fixture-rows.json`, and `copy/field-manifest.json` each have **351 data fields** after D7 and D9. The fixture is an offline mirror for local work, not a deployable copy source. Newly added Sheet rows need owner review; D8 tracks the unapproved yellow rows.

## How copy reaches a page

1. `copy:sync` reads the live Sheet with the existing BTF service account and saves a snapshot under ignored `.copy/`.
2. `copy:validate` checks the snapshot against `copy/field-manifest.json` for missing, blank required, duplicate, or unrecognized fields and consistency rules.
3. `copy:generate-ts` writes `src/data/approved-copy.ts`. It exports `COPY` for fields mapped in `scripts/copy/generate-ts.mjs` and `TEXT` for every Sheet field keyed by its exact path. The generator contains no copy text.
4. `astro build` renders the 12 routes from the generated file.
5. `copy:verify-rendered` checks the rendered HTML in both directions. Required Sheet fields must appear on their route, and visible page text, titles, descriptions, alt text, and aria labels must be supplied by approved fields. A block can combine multiple approved values. The short allow-list covers structural labels and month names. A separate exact-format exception covers the owner-specified machine-generated footer build timestamp, `updated YYYY-MMDD HH:MM Heure de Paris`; other footer prose still needs a Sheet field.
6. `verify` checks the built site, and `assert-deployable` confirms the current snapshot came from the Sheet and passed the rendered check.

The regression test **“rendered text with no approved field fails the rendered gate”** in `npm run copy:test` guards the page-to-Sheet direction. Do not remove or weaken it.

## Commands and environments

| Command | Source and purpose |
|---|---|
| `npm run build` | Local fixture-only pipeline. Sets `BTF_COPY_FIXTURE=1`, regenerates copy, builds, and verifies. It fails under `CI`, `GITHUB_ACTIONS`, `CF_PAGES`, or any `BTF_DEPLOY_ENV`. |
| `npm run check` | Astro type check. |
| `npm run verify` | Canonical-root and built-site checks; expects `dist/` to exist. |
| `npm run copy:test` | Negative and regression checks; currently 10 tests. |
| `npm run predeploy:approved-copy` | Reads the live Sheet, validates, regenerates `approved-copy.ts`, builds, verifies both directions, and asserts deployability. This is the GitHub Actions gate. |

For a local Sheet-mode run, set `BTF_COPY_SHEET_ID` to the approved Sheet ID in the environment and run `npm run predeploy:approved-copy`. The local service-account key is found automatically outside the repository. Never print or commit the key. GitHub Actions already has the `BTF_COPY_SHEET_ID` and `BTF_COPY_GOOGLE_SA_JSON` secrets; credential setup was completed on 2026-10-05.

Cloudflare Pages project `temp-btf` uses Git integration, with `main` as its production branch. Its build command is **`npx astro build`**, output directory `dist`. Pages builds from the **committed** `src/data/approved-copy.ts`; it does not run this gate or read the Sheet. D3 selected Option A: `.github/workflows/scheduled-copy-sync.yml` checks the Sheet hourly at minute 17 UTC and can also be run manually from GitHub Actions. It runs `npm run predeploy:approved-copy`, then commits and pushes changed approved-copy files to `main`. A Sheet edit reaches staging only after that successful sync and the resulting Pages build; it does not change the site immediately. No Google credential is added to Cloudflare Pages.

The scheduled workflow checks `src/data/approved-copy.ts`, `copy/fixture/fixture-rows.json`, and `copy/field-manifest.json` for changes. The current Sheet pipeline generates only `approved-copy.ts`; adding or removing fields requires a coordinated Sheet, fixture, manifest, and source update. An invalid Sheet change fails the validation pipeline and is not committed. If there is no diff, the workflow logs `No copy changes detected in sheet` and exits successfully. GitHub schedules may be delayed, so the cron time is a check cadence rather than a publication deadline.

The workflow pushes with `GITHUB_TOKEN`. GitHub does not start the separate **Approved copy check** workflow from that token's push, so the scheduled job's own full predeploy pipeline is the check for its automated commit. D4 branch protection must account for this direct bot push. D8 owner review of yellow Sheet rows remains open: the sync validates fields and rendered copy but does not inspect Sheet fill colors or certify owner approval.

The live `biketourfrance.net` domain is still served by Framer. No site cutover is authorized by this guide.

## Changing fields

Update the live Sheet, fixture, manifest, and page reference together. The Sheet owns both field IDs and values. A missing field fails generation; a Sheet field absent from the manifest fails validation. Keep the fixture aligned with the Sheet, but regenerate `src/data/approved-copy.ts` from the **live Sheet** before committing. `npm run build` rewrites that file from the fixture and is never sufficient before a push.

`copy/field-manifest.json` records `field`, `route`, `required`, and `codeLocation` for each row. A route of `*` applies to every page. `TEXT['/path/field']` references exact Sheet paths; `COPY` references the explicit mappings in the generator. Do not put copy literals in `generate-ts.mjs`.

## When a check fails

- `copy:sync` fails: confirm Sheet access, tab, title, two-column header, and credential names without exposing secret values.
- `copy:validate` fails: align Sheet, manifest, and fixture; inspect the named field and route.
- `copy:generate-ts` fails: add the named missing field to the Sheet, fixture, and manifest or correct the page reference.
- `copy:verify-rendered` fails: compare the rendered string with its approved Sheet field. Do not broaden the allow-list to make prose pass.
- `assert-deployable` fails: run the full Sheet-mode pipeline again; a fixture or stale snapshot cannot pass.

See `docs/BTF_MAIN_SITE_BUILD_AND_DEPLOY_DOCUMENTATION.md` for the current deployment architecture and `docs/BTF_BUILD_DEPLOY_FIX_LIST.md` for the D3 decision and open D4/D8 work.
