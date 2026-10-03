# Approved copy gate (local development; not active)

**Status, 2026-10-03: built and tested locally. No live copy gate exists.** The normal site build, Cloudflare preview builds, and the live staging site do not use Google or the Sheet and are unchanged. The gate is a separate, production-only command that the owner will activate later.

**BTF_Approved_Site_Copy** is intended to become the authority for public copy. Until the owner approves activation, the site's text lives in the repository exactly as before (`src/pages/`, `src/components/`, `src/data/`).

## 1. What the gate does

`npm run predeploy:approved-copy` reads the Sheet, checks it, builds the site, and compares the built pages to the Sheet. It fails, and so blocks a production deployment, if:

- the Sheet cannot be read, or its header, columns, or title are wrong;
- a field is missing, blank (when required), duplicated, or not in the field manifest;
- linked blocks that must match (the "What is included" block on the home and CDM pages) differ;
- the copy breaks a content rule (a dollar amount, consent by continued use, "upcoming" next to 2026, the wrong brand spelling, HTML, a bad link);
- a required field's approved text is not on its page, or is out of display order;
- a page title, meta description, or image alt text differs from the approved copy;
- any page shows text, alt text, a title, or a description that has no approved field;
- the Sheet snapshot is not from the real Sheet, is older than an hour, or the rendered-page check did not pass for that exact snapshot.

The comparison ignores whitespace, because markup can join or split words without changing the copy a visitor reads.

## 2. The Sheet

| Item | Value |
|---|---|
| Spreadsheet name | `BTF_Approved_Site_Copy` (the script checks the title exactly) |
| Tab | The first tab, or the tab named in `BTF_COPY_SHEET_TAB`. It is currently named "Approved Site Copy". |
| Columns | Exactly two: `page/field_name` and `copy` in row 1. Any value in column C or beyond fails the check. |
| Rows | One field per row. Blank spacer rows are ignored. |

There are no status, owner, approval, or change columns. The spreadsheet's version history is the change record.

**Current state:** the spreadsheet exists and holds only the header row. It is not populated and nobody has been asked to import or approve fields yet. Review `docs/COPY_FIELD_MAP_REVIEW.md` first.

### Copy format (column B)

| Write | You get |
|---|---|
| A blank line between blocks | Separate paragraphs |
| `## Heading` or `### Heading` on its own | A heading (policy pages) |
| Lines starting `- ` | A bullet list |
| `**bold**` | Bold |
| A single line break inside a paragraph | A line break |
| `[text](/path/)`, `[text](#anchor)`, `[text](https://...)` | A link (the path must be in the manifest) |
| `[text](mail:general)`, `mail:waitlist`, `mail:planning` | A mailto link (the code owns the address and subject) |

Fields ending `_alt`, `/seo_title`, and `/seo_description` are plain single-line text. SEO titles are at most 70 characters, descriptions 50 to 200, alt text at most 200. A list item that links a title and adds a note is written `- [Title](https://...) — note`.

## 3. Field names and files

Convention: `page/field_name`: lowercase letters, digits, and hyphens, then `/`, then lowercase letters, digits, and underscores (for example `cdm-tour/hero_heading`). One field per independently editable block. The 224 current fields are in `copy/field-manifest.json` in display order, and `docs/COPY_FIELD_MAP_REVIEW.md` shows each with its current copy, type, and whether it is required.

| File | Purpose |
|---|---|
| `copy/field-manifest.json` | Per field: `field`, `route`, `required`, `codeLocation` (where the text lives in the code). **No copy text.** A route of `*` means every page. |
| `copy/consistency-rules.json` | Pairs of fields that must hold identical copy |
| `copy/fixture/fixture-rows.json` | A snapshot of the **current site copy**. It exists to test the gate locally. It is not approved copy, and it is refused in CI, on Cloudflare Pages, and whenever `BTF_DEPLOY_ENV` is set. |
| `copy/seed/BTF_Approved_Site_Copy.seed.csv` | The snapshot as a two-column CSV. **Do not import it yet.** It exists so the Sheet can be filled after the field map is reviewed. |
| `scripts/copy/` | `sync`, `validate`, `verify-rendered`, `assert-deployable`, `generate-field-map-review`, `negative-tests`, and shared code |
| `.copy/` (git-ignored) | Generated artifacts: the fetched rows, the validated copy, and the rendered-check stamp. No credentials. |

## 4. Commands

| Command | What it does | Needs Google? |
|---|---|---|
| `npm run build` | The normal site build (`astro build`). Cloudflare Pages runs this. Unchanged by the gate. | No |
| `npm run verify` | Structural checks on `dist/` | No |
| `npm run copy:check-local` | Compares the built pages to the checked-in snapshot of current copy (needs `npm run build` first) | No |
| `npm run copy:test` | 37 tests that the gate fails closed and can also pass (needs `npm run build` first) | No |
| `npm run copy:field-map` | Regenerates `docs/COPY_FIELD_MAP_REVIEW.md` | No |
| `npm run predeploy:approved-copy` | **The production-only gate** (sections 1 and 5) | Yes |
| `npm test` | Type check, build, verify, `copy:check-local`, `copy:test` | No |

`npm run predeploy:approved-copy` runs, in order, and stops at the first failure: `copy:sync`, `copy:validate`, `astro build`, `copy:verify-rendered`, `npm run verify`, then `assert-deployable`. Each run starts by deleting earlier artifacts, so it can never use stale content.

## 5. Activation plan (nothing below is done; the owner decides when)

### The service account (already exists)

`btf-sheets-access@btf-general.iam.gserviceaccount.com`, in Google Cloud project `btf-general`. The gate accepts **only** this account: a key for any other account is rejected. No new service account or key is created. It reads with the read-only scope `https://www.googleapis.com/auth/spreadsheets.readonly`. The existing key is on the owner's Mac at `~/.config/btf/google/service-account.json`; the script uses it automatically for local runs.

### Step 1: the one thing needed now (owner)

Share `BTF_Approved_Site_Copy` with `btf-sheets-access@btf-general.iam.gserviceaccount.com` as **Viewer**. Nothing else is needed from the owner at this point. (If the first real read after sharing says the Google Sheets API is not enabled for the project, enabling it on `btf-general` is the only other action.)

### Step 2: first real-Sheet check (done by Claude after step 1; no new secret is created or stored)

From the project folder, with the spreadsheet ID as the only setting passed on the command line:

```
BTF_COPY_SHEET_ID=<spreadsheet ID> npm run copy:sync && npm run copy:validate
```

While the Sheet is empty this fails with "required field is missing" for every field. That proves the Sheet is reachable and the gate blocks. It will pass only after the Sheet is populated and approved.

### Step 3: review and populate (owner)

Review `docs/COPY_FIELD_MAP_REVIEW.md`, then decide how the Sheet is filled and approved. No import happens before that.

### Step 4: secret names for automation (owner adds them; none exist yet)

| Name | Holds | Where it would go |
|---|---|---|
| `BTF_COPY_GOOGLE_SA_JSON` | The existing `btf-sheets-access` key (raw JSON, or base64 of it) | GitHub Actions repository secret |
| `BTF_COPY_SHEET_ID` | The spreadsheet ID of `BTF_Approved_Site_Copy` (not a secret, but kept out of the public repository) | GitHub Actions repository secret |
| `BTF_COPY_SHEET_TAB` (optional) | A tab name, only if the copy is not on the first tab | Same place |

No Cloudflare Pages variables are needed, because the Cloudflare build command stays `npm run build`. Do not copy the key into any file in the repository. Do not paste it into chat.

### Step 5: turn the check on (owner approval needed)

1. In `.github/workflows/approved-copy-check.yml`, add the `pull_request` and `push` triggers for `main` (the file's header says exactly what to add). Until then the workflow runs only when started by hand.
2. In GitHub, require the status check **Approved copy check** by branch protection on `main`. Production deploys come only from `main`, so nothing reaches production unless the check passes.
3. Optional, stronger, separate decision: set the Cloudflare Pages **production** build command to `npm run predeploy:approved-copy` and add the two secrets as encrypted Pages variables. This is not planned and needs explicit approval, because a missing Sheet would then block builds in Cloudflare.

### Step 6: day-to-day after activation

The Sheet is the authority. To change public copy, edit the Sheet and make the matching edit in the code (`src/pages/`, `src/components/`, `src/data/`). Running `npm run predeploy:approved-copy` tells you exactly which field, route, and code location still disagree. Adding, renaming, or removing a field means changing the manifest, the snapshot, the Sheet, and the code together, and the manifest on `main` and the Sheet must agree.

A different design, where the site renders its text directly from the Sheet, was built and tested earlier on this branch (commit `07bb2c6`). It is not used. It can be brought back later if the owner wants it.

## 6. Local development

- No change. `npm run dev` and `npm run build` read the repository as before, with no Google access and no credentials.
- The fixture snapshot is only for `copy:check-local` and `copy:test`.
- A developer who wants to try the real Sheet locally can run `npm run copy:sync && npm run copy:validate`. The key is found automatically on the owner's Mac, or set `BTF_COPY_GOOGLE_SA_FILE` to a key file elsewhere. Key files are refused in CI.

## 7. When the check fails

| Message | Meaning | Fix |
|---|---|---|
| `BTF_COPY_SHEET_ID is not set` / `No Google credential is configured` | A setting is missing here | Add it (section 5, step 4) |
| `... is for a different service account` | The key is not for `btf-sheets-access` | Use the existing key |
| `... failed (HTTP 403 ...)` | The account cannot read the Sheet | Share the Sheet with it as Viewer; check the Sheets API is enabled on `btf-general` |
| `... failed (HTTP 404 ...)` | Wrong ID, or not shared | Check `BTF_COPY_SHEET_ID` and the sharing |
| `The spreadsheet is titled "...", not "BTF_Approved_Site_Copy"` | The ID points at another file | Correct the ID |
| `row 1 must be exactly ...` / `data in column C or later` | Header changed or an extra column exists | Restore the two header names; delete extra columns |
| `required field is missing` / `blank copy` | A row is missing or empty | Restore or fill it. The line names the field, route, and code location |
| `duplicate field name` / `unrecognized field` | Two rows share a name, or a row is not in the manifest | Delete or rename; or finish adding the field |
| `must be identical to ...` | Linked blocks differ | Make them match |
| `contains a dollar amount`, `claims consent by continued use`, and similar | The copy breaks a content rule | Edit the cell |
| `approved text not found on the page` | The Sheet and the page disagree | Make the page (or the cell) match |
| `visible text with no approved field` | A page shows text the Sheet does not cover | Add a field for it, or remove the text |
| `predeploy BLOCKED` | Not deployable (not from the Sheet, too old, or not verified) | Run `npm run predeploy:approved-copy` again from a clean state |

## 8. Rollback

Nothing is live, so there is nothing to roll back in production. To remove the gate: revert the gate commits on the branch (the normal build never depended on them). Once active: restore an earlier Sheet version in Google Sheets version history; or promote the previous Cloudflare Pages deployment; or deactivate by removing the triggers from the workflow. Do not bypass the check.

## 9. What the tests prove

`npm run copy:test` (37 tests) covers: a missing, duplicate, unrecognized, blank, and mismatched field; a wrong header, an extra column, and a header-only Sheet; a price, consent-by-use wording, and bad links in copy; no credential; a key for the wrong account; key files in CI; the Google sign-in against a fake Google (403, 404, wrong title, correct read-only scope, correct account); fixture copy refused under production, staging, CI, and Cloudflare settings; stale artifacts deleted; copy changed after the build; text and alt text with no approved field; wrong title or description; and the production assertion, which **passes** for a current, verified Sheet snapshot and **blocks** a mismatch, fixture copy, an old snapshot, a missing verification, and a non-production environment. No real credential is used by the tests.
