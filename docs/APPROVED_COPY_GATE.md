# Approved copy gate

**BTF_Approved_Site_Copy** is the authority for all public copy on biketourfrance.net. The build reads it, checks it, renders the site from it, and then checks that every page matches it. If anything is missing, blank, duplicated, unrecognized, or different, the build fails and nothing is deployed.

Written 2026-10-02. The gate is implemented and tested on branch `rebuild/2026-10-02-audit-remediation`. It is **not live** until the credential setup in section 4 is done.

## 1. The sheet

| Item | Value |
|---|---|
| Spreadsheet name | `BTF_Approved_Site_Copy` (the script checks the title exactly) |
| Tab | The first tab, or the tab named in `BTF_COPY_SHEET_TAB`. The tab is currently named "Approved Site Copy". |
| Columns | Exactly two |

| A (row 1) | B (row 1) |
|---|---|
| `page/field_name` | `copy` |

- Row 1 must contain exactly those two header names.
- Every later row is one field: the field name in column A, the approved text in column B.
- There are **no** status, owner, approval, or change columns. Any value in column C or beyond fails the check.
- Blank rows between fields are ignored.
- The spreadsheet's own version history is the change record.

### Copy format (column B)

Plain text with a small markup set, the same everywhere:

| Write | You get |
|---|---|
| A blank line between blocks | Separate paragraphs |
| `## Heading` or `### Heading` on its own | A second or third level heading (policy pages) |
| Lines starting `- ` | A bullet list |
| `**bold**` | Bold |
| A single line break inside a paragraph | A line break |
| `[text](/path/)` | A link to a page on this site (the path must be in the manifest) |
| `[text](#anchor)` | A link within the page |
| `[text](https://...)` | An external link (opens with `rel="noopener"`) |
| `[text](mail:general)`, `mail:waitlist`, `mail:planning` | A mailto link. The code owns the address, subject, and starting message. |

Not allowed: HTML tags, `http://` links, dollar amounts, "by continuing" consent wording, "upcoming" next to 2026, "Bike Tour France", and "BikeTourFrance" without ".net". Fields ending `_alt`, `/seo_title`, and `/seo_description` must be plain single-line text. SEO titles are at most 70 characters, descriptions 50 to 200, alt text at most 200.

A list item that links a title and carries a note is written `- [Title](https://...) — note` (an em dash before the note). The Resources page uses this.

## 2. Field names

Convention: `page/field_name`.

- `page` is lowercase letters, digits, and hyphens. `field_name` is lowercase letters, digits, and underscores. Example: `cdm-tour/hero_heading`.
- One field per independently editable block of public text. Do not combine a heading and a paragraph that an editor would change separately.
- Page keys in use: `site` (header, footer, navigation, shared button labels), `home`, `tours`, `cdm-tour`, `practical-information`, `resources`, `about`, `contact`, `privacy`, `terms`, `cookies`, `404`, and `photos` (image alt text and captions).
- Every page has `seo_title` and `seo_description`. Page titles show as "seo_title | BikeTourFrance.net"; the home page's title is shown as written.
- Fields are listed in `copy/field-manifest.json` in the order a visitor sees them on each page. The rendered check confirms that order.
- Optional fields (`"required": false`) may be blank or absent: `site/staging_banner`, `site/review_note`, and the two photo captions. The rest are required.

## 3. The manifest and the other checked-in files

| File | Purpose |
|---|---|
| `copy/field-manifest.json` | One entry per field with only four keys: `field`, `route`, `required`, `codeLocation`. It holds **no copy text**. A route of `*` means every page; `/404.html` is the 404 page. |
| `copy/consistency-rules.json` | Pairs of fields that must hold identical copy. Today: the "What is included / what you arrange separately" block and the trip stats on the home page and the CDM page. |
| `copy/fixture/fixture-rows.json` | Fixture copy for local development only (section 6). |
| `copy/seed/BTF_Approved_Site_Copy.seed.csv` | A two-column import file with the staging text as of 2026-10-02, for filling the sheet the first time. It is **not** approved copy (section 4, step 5). |
| `src/lib/copy.mjs`, `src/lib/copy-markup.mjs`, `src/lib/copy-html.mjs` | How the site reads and renders a field. |
| `scripts/copy/*.mjs` | The gate (below). |
| `.copy/` (git-ignored) | The generated artifacts: `sheet-rows.json` and `approved-copy.generated.json`. They hold copy text only, never credentials. |

## 4. Credential setup (not done; for the owner)

Nothing below has been created. No secret value has been requested, printed, or stored.

1. **A Google service account** with the **Google Sheets API enabled** in its Google Cloud project. A dedicated, single-purpose account (for example "btf-copy-reader") is recommended over reusing an account that other tools use. The script asks Google only for the read-only scope `https://www.googleapis.com/auth/spreadsheets.readonly`, using a signed service-account sign-in (no OAuth consent screen, no user tokens).
2. **Share `BTF_Approved_Site_Copy` with the service account's email address as Viewer** (read-only). It needs no other access.
3. **Store three settings**, with these exact names:

| Name | What it holds | Where |
|---|---|---|
| `BTF_COPY_GOOGLE_SA_JSON` | The service account's JSON key (raw JSON, or the same JSON base64-encoded) | GitHub Actions secret, and a Cloudflare Pages **encrypted** environment variable on project `temp-btf` for both Preview and Production |
| `BTF_COPY_SHEET_ID` | The spreadsheet ID of `BTF_Approved_Site_Copy` | GitHub Actions secret, and a Cloudflare Pages environment variable (Preview and Production) |
| `BTF_COPY_SHEET_TAB` (optional) | A tab name, if the copy is not on the first tab | Same places, only if needed |

   For local use only, `BTF_COPY_GOOGLE_SA_FILE` may hold the path to a key file outside the repository. It is refused in CI and Cloudflare builds, which must use the stored secret.
4. **Make the check required.** In GitHub, add branch protection on `main` that requires the status check **Approved copy check**.
5. **Fill the sheet and approve it.** Import `copy/seed/BTF_Approved_Site_Copy.seed.csv` into the tab (File, Import, replace data, starting at A1), then edit each cell until the text is the copy you approve. The seed is only today's staging text, so it carries no approval; your edits in the sheet are the approval. Until the sheet holds all required fields the check fails by design.

Current state (read-only checks, 2026-10-02): the spreadsheet exists and holds only the header row. An existing local BTF service account signed in to Google but was denied (HTTP 403) on this spreadsheet, so the sheet is not shared with it. The gate fails safely in that state.

Never put the key, an access token, or the key's contents in the repository, a build log, the register, or chat. The script's messages name the setting that is wrong and never print its value.

## 5. The build

The normal build command, which Cloudflare Pages also runs:

```
npm run build
```

It runs, in order, and stops at the first failure:

1. `npm run copy:sync` reads the sheet (or the fixture when allowed). It deletes any earlier artifact first, so a failed sync can never fall back to old copy.
2. `npm run copy:validate` checks the rows against the manifest and writes the artifact:
   - the header is exactly `page/field_name` and `copy`, and there is no third column;
   - no duplicate field names;
   - no blank copy in a required field;
   - no sheet field that is missing from the manifest, and no required manifest field missing from the sheet;
   - the consistency rules hold; links are valid; banned content is absent;
   - every field used in `src/` is in the manifest, and every manifest field is used in its code location.
3. `astro build` renders the site. Every public text block is read from the artifact by `page/field_name`.
4. `npm run copy:verify-rendered` confirms, on the built pages: each required field appears on its route and in display order; page titles, meta descriptions, and image alt text equal their fields; **no visible text, alt text, title, or description exists that has no approved field**; and the pages were built from this exact artifact.
5. `npm run verify` runs the existing structural checks (headings, landmarks, links, indexing blocks).

A failure prints one line per problem: **field | route | code location | issue**.

**Production pre-deploy command** (what the GitHub check runs):

```
npm run predeploy
```

It sets `BTF_DEPLOY_ENV=production`, runs the whole build above, then `scripts/copy/assert-deployable.mjs`, which blocks unless the build came from the sheet (not fixture), the sheet title is `BTF_Approved_Site_Copy`, the copy was fetched within the hour, and every page's head records the sheet as its source and the current copy fingerprint.

The two `npm run copy:*` scripts and `npm run predeploy` are the only places copy is fetched. Run `npm test` before changing the gate; it runs a fixture build, then `copy:test`, then the type check.

### Scope: what is and is not in the sheet

In the sheet: every visible text block, button and link label, navigation label, footer text, page title, meta description, image alt text, and caption.
Kept in code on purpose: link destinations and the mailto subject and starting message (`src/data/site.ts`), screen-reader landmark labels such as `aria-label="Main"`, the fixture banner, and structured-data fields other than the brand name.

## 6. Local development

- `npm run dev:fixture` and `npm run build:fixture` use `copy/fixture/fixture-rows.json`. They need `BTF_COPY_FIXTURE=1`, which those scripts set.
- Every page then shows a red banner: **"FIXTURE COPY. This is a local development build. The text on this page is not approved copy. Never deploy it."** The page head records `btf-copy-source` as `fixture`, and the terminal prints a fixture warning.
- A developer with a read-only credential can instead use the real sheet: `BTF_COPY_SHEET_ID` plus `BTF_COPY_GOOGLE_SA_FILE`, then `npm run dev` or `npm run build`.
- Plain `npm run dev` and `npm run build` use the sheet and fail without a credential. There is no silent fallback to fixture copy.
- Fixture copy is **refused** in CI (`CI` or `GITHUB_ACTIONS`), on Cloudflare Pages (`CF_PAGES`), and whenever `BTF_DEPLOY_ENV` is set. A fixture build cannot pass `npm run predeploy`.

## 7. Staging and production

- Cloudflare Pages runs `npm run build` for `temp-btf` previews and for production. Both need the stored settings from section 4. Until they are set, **preview builds on the feature branch fail at `copy:sync`**. The last successful deployment stays live; a failed build never replaces it.
- A failed read of the sheet, or a failed validation, fails the build. Nothing is cached between builds.
- The GitHub job **Approved copy check** (workflow `Approved copy check`, file `.github/workflows/approved-copy-check.yml`) runs `npm run predeploy` on pull requests to `main`, on pushes to `main`, and on demand. With the branch-protection rule in section 4, step 4, a change cannot reach `main` (which Cloudflare treats as production) unless the check passes.
- A pull request from a fork gets no secrets, so its check fails. That is intended.
- Staging search blocks are separate and unchanged (see `docs/PRODUCTION_CUTOVER_PREFLIGHT.md`).

## 8. Changing fields

Every change touches the same four places: the code, `copy/field-manifest.json`, `copy/fixture/fixture-rows.json`, and the sheet. The sheet and the manifest on `main` must agree, or the production build fails. Do not leave them out of step.

**Add a field**
1. Pick the name (section 2). Use it in the code with `t('page/field_name')` (plain text), `<Copy field="page/field_name" />` (blocks), or a prop whose name ends in `Field`.
2. Add a manifest entry in display order, with the route and the code-location file. Add a fixture row.
3. To avoid breaking production while the pieces land, add it first as `"required": false` and read it with `maybe('page/field_name')`. Add the sheet row, merge, then change it to required in a follow-up.
4. Run `npm run build:fixture` and `npm test`.

**Rename a field**: change it in the code, the manifest, the fixture, and the sheet in the same change. The old sheet name is an "unrecognized field" the moment the manifest drops it, so rename the sheet row at the time of the merge.

**Remove a field**: remove the code use, the manifest entry, and the fixture row, then delete the sheet row. Delete the sheet row last; until then it is an unrecognized field and blocks the build.

## 9. When the copy check fails

| Message | Meaning | Fix |
|---|---|---|
| `copy:sync FAILED ... BTF_COPY_SHEET_ID is not set` or `No Google credential is configured` | The setting is missing in this environment | Add the setting (section 4). In CI check the secret names. |
| `... failed (HTTP 403 ...)` | The service account cannot read the sheet | Share the sheet read-only with the service account; enable the Google Sheets API for its project |
| `... failed (HTTP 404 ...)` | Wrong spreadsheet ID, or not shared | Check `BTF_COPY_SHEET_ID` and the sharing |
| `The spreadsheet is titled "...", not "BTF_Approved_Site_Copy"` | The ID points at another file | Correct the ID |
| `row 1 must be exactly "page/field_name" and "copy"` | Header changed | Restore the two header names |
| `the sheet has data in column C or later` | An extra column exists | Delete it (the sheet has exactly two columns) |
| `required field is missing from the sheet` | A row was deleted or renamed | Restore it. The line names the field, its route, and the code file |
| `required field has blank copy` | A required cell is empty | Write the approved copy |
| `duplicate field name (rows X and Y)` | Two rows share a name | Delete or rename one |
| `unrecognized field` | A row is not in the manifest | Fix the typo, or finish adding the field (section 8) |
| `must be identical to ...` | Two linked blocks differ | Make them match |
| `contains a dollar amount`, `claims consent by continued use`, and similar | Copy breaks a content rule | Edit the cell |
| `link target ... not allowed` or `not a route` | A link is malformed | Fix the link (section 1) |
| `used in code but not in copy/field-manifest.json` or `manifest field is not used anywhere` | The code and the manifest disagree | Align them in the pull request |
| `copy:verify-rendered FAILED ... approved text not found` | The built page does not show the approved text | Run the build again; if it persists the code is not reading the field |
| `visible text with no approved field` | Text on a page that is not from the sheet | Move that text into a field |
| `predeploy BLOCKED` | The build is not deployable (fixture copy, wrong environment, old copy) | Run `npm run predeploy` again from a clean state with the stored settings |

After fixing the sheet, re-run the build. Nothing needs cleaning up; every run starts by deleting the earlier artifacts.

## 10. Rollback

| What went wrong | Rollback |
|---|---|
| Bad copy in the sheet | Restore a previous version in Google Sheets version history. The next build uses it. |
| A bad deployment is already live | Cloudflare Pages dashboard: promote the previous deployment. This is the only sanctioned way to put out a build without re-reading the sheet. |
| The gate itself blocks the team wrongly | Fix the cause (section 9). Do not bypass it. If the gate code is at fault, revert the gate commits on the branch; the earlier build command was `astro build` plus `npm run verify`. |
| Credential trouble | Remove or replace the stored secret in GitHub and Cloudflare. Rotation needs the owner's approval. |

Nothing in this gate changes DNS, the production domain, Cloudflare security headers, or the live Framer site.

## 11. What the tests prove

`npm run copy:test` (31 tests, run locally) shows the gate fails closed: a missing field, a duplicate field, an unrecognized field, blank required copy, a wrong header, an extra column, a header-only sheet, mismatched linked copy, banned content, a bad link, changed copy after the build, uncovered text and alt text on a page, pages built from a different artifact, no credential, a Google 403, 404, and wrong-title response, fixture copy under production, CI, and Cloudflare settings, and a production deploy of a fixture build. The Google sign-in is exercised against a fake Google with a key generated in memory; no real credential is used. The suite needs a fixture build in `dist/` first (`npm run build:fixture`) and runs locally only, because fixture copy is refused in CI.
