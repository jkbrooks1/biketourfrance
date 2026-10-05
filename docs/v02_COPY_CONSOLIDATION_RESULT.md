# Option 1 approved-copy consolidation — executed

Executed 2026-10-05T20:19:39Z with the owner's explicit instruction to adopt per-page wording, clear approved
row fill, hide source tabs, pin the sync, validate, commit and push. The owner separately approved
the exact 42-character self-guided CTA and a 42-character button limit.

The [Approved Site Copy tab](https://docs.google.com/spreadsheets/d/1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw/edit#gid=1957325162)
is now the sole visible machine-read copy tab. All 11 per-page tabs are hidden, not deleted; their
values are byte-for-byte unchanged in readback.

- 208 nonblank mapped source rows adopted into 214 distinct existing/new live fields.
- 45 existing B cells changed; three new fields appended at rows 353–355. Live fields: 351 → 354.
- Approval backgrounds cleared only on the 214 adopted rows, columns A:B. Fonts, borders,
  alignment, row/column dimensions, header and other cell values were preserved.
- Live B fills after readback: 237 white, 116 yellow, one pale-yellow. Retained rows without an
  adopted source remain unapproved; clearing fill does not add a programmatic approval column.
- Eight blank source rows retained live text/fill; five nonblank unmapped rows retained in the
  hidden source tabs. The old review mapping records six unmapped rows because it also includes
  the blank staging-banner row. Nothing blank was interpreted as deletion approval.

## Exact wording and mapping decisions

The original `docs/v01_COPY_MAPPING_FOR_REVIEW.csv` remains the review snapshot, unchanged.
`docs/proof/2026-10-05_copy_consolidation/consolidation-plan.json` records every source row,
its concrete destination(s), adopted text, projection and retained-row reason.

Three fields prevent competing per-page wordings from overwriting shared cells:

| Added live key | Source | Reader |
| --- | --- | --- |
| /tours/cdm_route | 02_TOURS!B13 | Tours route paragraph |
| /tours/pricing_note | 02_TOURS!B16 | Tours pricing paragraph |
| /resources-page/on_page_sites_label | 06_RESOURCES!B3, last contents label | Resources contents link |

CDM keeps its own fuller route and pricing text; Tours uses its revised wording. The Resources
contents sentence retains “Helpful sites”, while the separately edited heading is exactly
“Helpful Sites (from approved-copy)”. The Tourouzelle audio labels, first-person tour wording,
Michelin-star wording and revised privacy assurance were adopted as instructed; this task does
not claim those operational assertions were independently confirmed.

Compound sentences retain the existing links and fragment roles. Three home CDM lines join into
the existing multiline field. Week-plan day labels retain their source colons. Stats labels retain
the separate existing numeric values. Group-size template variables resolve using existing
CDM_FACTS values 6/8/12; literal unresolved braces are not rendered. Trailing source whitespace
is preserved in the Sheet; the existing build normalizes cell whitespace as before.

## Retained rows

| Review ID | Source tab | Source field | Reason |
| --- | --- | --- | --- |
| R0006 | 00_GLOBAL | /nav/mobile_toggle | retained_unmapped |
| R0007 | 00_GLOBAL | /a11y/skip_link | retained_unmapped |
| R0010 | 00_GLOBAL | /staging-banner | retained_blank_source |
| R0046 | 02_TOURS | /tours/section_selfguided_info | retained_blank_source |
| R0055 | 03_CONTACT | /contact/eyebrow | retained_blank_source |
| R0056 | 03_CONTACT | /contact/h1 | retained_blank_source |
| R0059 | 03_CONTACT | /contact/section_heading | retained_blank_source |
| R0061 | 03_CONTACT | /contact/link_2 | retained_blank_source |
| R0063 | 03_CONTACT | /contact/fallback_text | retained_blank_source |
| R0065 | 03_CONTACT | /contact/section_2_text | retained_blank_source |
| R0175 | 08_COMPONENTS | /review-note/title | retained_unmapped |
| R0176 | 08_COMPONENTS | /review-note/body | retained_unmapped |
| R0177 | JB_TOUR_OPERATOR_QUESTIONS | 1 | retained_unmapped |

Menu/skip-link literals remain under their existing verifier exemptions. The staging banner has
no supplied text. The review-note body is truncated and has no machine-read target; the existing
complete staging note remains in its component. Internal operator questions are not public copy.
Terms and Cookies were already in live and remain unchanged. Existing no-form/privacy/cookie
contradictions on retained rows still need content review; no corrective copy was invented.

## Sync and button enforcement

`scripts/copy/lib.mjs` selects the exact exported constant `APPROVED_COPY_TAB = 'Approved Site Copy'`.
Reordering tabs cannot redirect the sync. Missing tab fails closed. A conflicting
`BTF_COPY_SHEET_TAB` fails before authentication; setting it to the exact named authority stays
compatible. No fallback to the first tab remains.

The owner's 42-character decision is enforced in both `Button.astro` and `verify-dist.mjs`.
The build revealed that Button counted Astro's escaped apostrophe as multiple characters and
could double-escape it when rendered. It now counts the decoded visible label and renders the
original slot. The exact approved CTA is verified in built HTML.

## Verification

- `npm run build`: passed on the proposed deterministic fixture before the Sheet write.
- `npm run check`: 0 errors, 0 warnings, two pre-existing hints.
- `npm run copy:test`: four named-tab tests and ten existing checks passed.
- `npm run predeploy:approved-copy`: passed against the live named tab, 354 fields on 12 pages;
  rendered-copy verification, dist checks and deployability all passed.
- Readback matched all expected live values, fill changes and hidden flags; source values unchanged.
- Sheet fixture and manifest match the 354-field authority; generated TypeScript is current.
- Other existing hourly-sync/timestamp work was preserved separately and excluded from this commit.

The push is authorized and follows these checks; Git-connected `main` triggers staging on
`temp-btf`. No Pages setting, DNS, live-domain cutover, Framer account or service schema change
was made. The required two build logs and system register were updated before the commit.

## Evidence and rollback

- `docs/proof/2026-10-05_copy_consolidation/predeploy-proof.txt`: live Sheet-mode gate output.
- `consolidation-plan.json`: requests, before/after values, every source decision and expected rows.
- `sheet-before.json`, `sheet-after.json`, `verification.json`: source/readback and verification.
- `sheet-rollback.json`: targeted inverse payload. Re-read and reconcile subsequent Sheet edits
  before using it; it reverses this consolidation, not later owner work.

For repository rollback, revert the consolidation commit after reconciling newer copy changes;
for Sheet rollback, apply the reviewed inverse payload. Restoring the source-tab hidden flags is
reversible. No credential values are present in evidence or logs.
