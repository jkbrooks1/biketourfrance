# BTF approved-copy mapping review — v01

Generated 2026-10-05T19:01:15.169102+00:00. Read-only snapshot of [BTF_Approved_Site_Copy](https://docs.google.com/spreadsheets/d/1vzlhoekeVcx437ajMMFU--1kIrE7DfKYvi8rKhlE9aw/edit?ouid=117419745612447434426) using john@biketourfrance.net. This compares tabs within the Sheet; it does not claim to compare deployed HTML. No Sheet writes, color changes, commits, pushes or deployments were performed.

## Review counts

| Status | Per-page rows | All mapping rows (includes live-only) |
| --- | --- | --- |
| identical | 153 | 153 |
| divergent | 55 | 55 |
| empty_in_live | 0 | 0 |
| empty_in_per_page | 7 | 140 |
| not_found_in_live | 6 | 6 |

- 221 source review rows across 11 per-page tabs, including one internal operator question. Header rows excluded only where positively identified; 02_TOURS row 1 included.
- 351 live fields; 218 distinct live fields covered by proposed mappings; 133 live-only rows appended. Total CSV/JSON review rows: 354.
- 8 blank/missing per-page copy cells; 0 blank live copy cells. One blank source row also has no live destination, so blank counts overlap not_found_in_live.
- 215 source keys do not exist verbatim in live. Of those, 209 have explicit proposed role aliases and 6 have no live mapping. Key-name absence is distinct from content absence.
- 300 copy cells are #FFFF00; 1 is #FFF2CC; 50 are white. Yellow means unapproved according to the owner; white is not independently confirmed approval. These are column B counts, not an estimate.

## How to use the decision template

Open the CSV and filter coverage=per_page. Review every divergent, blank, unmapped, or review_required row. The JSON contains the same rows plus the full source snapshot and bounded CellData color evidence. Every row has a blank review_decision, merged_version, and reviewer_notes, and all four choices in decision_template. No decision is prefilled.

1. **Approve live version** — retain the exact existing target cells.
2. **Adopt per-page version** — approve the exact source wording and the proposed target mapping. This is straightforward only for a reviewed one-to-one target.
3. **Use a merged version** — enter the complete proposed text in merged_version. For multiple targets, provide a JSON object keyed by each approved live field so fragments remain separate. No merged copy has been invented in this review.
4. **Escalate / needs clarification** — record the unresolved question in reviewer_notes.

A recommendation is a review suggestion, not approval. Blank per-page text never means delete the live value. Shared targets must receive one coordinated decision. live-only rows retain otherwise unpaired live fields for completeness. New fields require coordinated source readers and manifest changes; changing only the Sheet can fail validation.

## Matching and verbatim preservation

The 55 divergent rows include compound/partial-cell structure differences, not only wording changes. A sentence split across links or a label stored separately from its number is flagged for mapping review even when the rendered wording may agree. This comparison deliberately does not invent rendered text or mark compound cells identical.

field_key retains the original per-page key. mapped_live_field_keys_json identifies the proposed existing destinations. Exact-key matches take precedence; aliases were traced through the current Astro pages/components and the copy generator. No global equal-text heuristic or fuzzy matching was used. Every renamed key is flagged in review_notes and needs mapping review. One-to-many relationships and partial-cell relationships are explicitly marked; these are not ready-to-import substitutions.

For a single destination, live_tab_version is the exact live cell text. For multiple destinations it is a JSON array of exact cell texts in destination order. live_versions_json always provides the array form; source_snapshot retains original values and source coordinates. No joining, trim, spelling change, punctuation correction, placeholder substitution or POV rewrite is applied to source copy. The summary uses escaped Markdown for readability; CSV/JSON hold the verbatim content.

All populated A:D rows were read within the metadata-confirmed tab bounds (1268 rows for live, 1000 for the others). E:Z was read on tabs with those columns and returned no values. The questions tab has four columns. Eight per-page tabs have no header; policy and practical-info tabs have A/B/C headers; questions has A/B/C/D headers. No full grid was inferred from an export.

## Counts by source tab

| Tab | Rows | Identical | Divergent | Blank source | Unmapped |
| --- | --- | --- | --- | --- | --- |
| 00_GLOBAL | 38 | 23 | 12 | 1 | 3 |
| 02_TOURS | 16 | 5 | 10 | 1 | 0 |
| 03_CONTACT | 11 | 1 | 4 | 6 | 0 |
| 04_ABOUT | 4 | 4 | 0 | 0 | 0 |
| 05_CDM_TOUR | 50 | 35 | 15 | 0 | 0 |
| 06_RESOURCES | 41 | 36 | 5 | 0 | 0 |
| 07_FORMS | 14 | 13 | 1 | 0 | 0 |
| 08_COMPONENTS | 2 | 0 | 0 | 0 | 2 |
| JB_TOUR_OPERATOR_QUESTIONS | 1 | 0 | 0 | 0 | 1 |
| 08_POLICY_PAGES | 12 | 7 | 5 | 0 | 0 |
| 09_PRACTICAL_INFO | 32 | 29 | 3 | 0 | 0 |

## Quality issues and corrections to the initial assumptions

- **Tours have no header**: 02_TOURS!A1:B1 is data. The row is included. The same is true for the other seven headerless per-page tabs.
- **Pricing**: 02_TOURS!B16 says “Pricing is being worked on right now and will be announced before booking opens.” 05_CDM_TOUR!B20 and live /cdm-facts/copy_3 say “Pricing is to be determined and will be announced before bookings open.” This is a wording divergence, not a conflicting amount. Both map to the same live field and must be resolved together. The $250 coaching amount in 00_GLOBAL!B13 and live /hero/body_2 is a separate service, not a tour price.
- **Confirmed truncation**: 08_COMPONENTS!B2 is exactly “This page states only facts that can be confirmed from this”. The complete staging review note is currently a literal in src/components/ReviewNote.astro, not a live Sheet field. Do not adopt the fragment as complete copy.
- **Blank content**: /staging-banner, /tours/section_selfguided_info, and six 03_CONTACT fields have blank source B cells. The self-guided info maps to nonblank /tours/body_3. The staging banner is absent from live, but a full banner exists as a literal in BaseLayout.astro.
- **POV**: per-page self-guided/coaching text uses I/we/me; live /tours/body_2 and /tours/body_4 use John/he. Live /about/body_3 already uses I build. Choose the voice deliberately before consolidating.
- **Route inconsistency**: resources rd7/rd8 use Tourouzelle; live audio guide labels use Lézignan-Corbières. The per-page CDM itinerary itself uses Lézignan-Corbières. Confirm which itinerary and audio labels apply; do not silently correct either.
- **Michelin promise**: per-page dinner and inclusion copy promises a Michelin starred restaurant; live says Michelin restaurant without a star claim. Confirm the supplier/rating commitment before adoption.
- **Placeholders**: /canal-des-deux-mers/groups_size includes {min}, {target}, {max}; live has 6, 8, 12. Confirm whether template variables are intended and where they are resolved.
- **Possible test/editorial string**: 06_RESOURCES!B11 is “Helpful Sites (from approved-copy)”, compared with live “Helpful Sites”. No explicit TEST/test123/lorem/placeholder test string was observed; the annotation is flagged as suspicious, not declared an intentional test.
- **Internal question**: JB_TOUR_OPERATOR_QUESTIONS!A2 is “1”, with “should i tell people what hotels before they book?” in B2. This is not a site field key. It is included for review, excluded from publication recommendations.
- **Privacy/form mismatch**: per-page /privacy/section_1_text and live /privacy/frag_1 say the website has no sign-up form. 07_FORMS and current waitlist-2027.astro define a form. Live /contact-page/body_2 also says no online form yet. Verify the actual deployed collection behavior before owner approval.
- **Policy contradiction**: live /footer/policies claims cookie tracking/continued-use consent and webinar/calendar data collection, while /cookies/body_2 and the privacy text describe no cookies/analytics. This is an internal textual contradiction; the review does not determine current hosting or legal obligations.
- **Policy promise**: per-page /privacy/section_2_text adds “Your contact info will not be shared or sold” and changes to we/us. The live fragments do not include that assurance. Owner clarification is required.
- **Shared/compound fields**: home CDM title/lines share one multiline live field; CDM stats store numeric literals separately; day plans, contact text, resource intro text, and privacy text are split across cells and links. Each is flagged for coordinated merge/mapping decisions.
- **Transport information**: costs/times/bike rules are preserved; this task does not reverify operators. The live freshness value is June 2026, which should be considered in a later factual review.

## Missing fields and missing-page check

**Terms and Cookies are not missing from the live tab.** Terms has 10 /terms/* fields plus /nav/terms. Cookies has 8 /cookies/* fields plus /nav/cookies. Neither has a per-page source row in 08_POLICY_PAGES, which contains only Privacy. Do not recreate those pages from nonexistent per-page copy. Both are listed in the live-only inventory below.

The following source rows have no defensible live destination. Blank staging copy and internal question rows are distinguished from new public copy:

| Review ID | Source location | Field key | Source text / condition |
| --- | --- | --- | --- |
| R0006 | 00_GLOBAL!B6 | /nav/mobile_toggle | Menu |
| R0007 | 00_GLOBAL!B7 | /a11y/skip_link | Skip to main content |
| R0010 | 00_GLOBAL!B10 | /staging-banner | (blank) |
| R0175 | 08_COMPONENTS!B1 | /review-note/title | Draft for owner review. |
| R0176 | 08_COMPONENTS!B2 | /review-note/body | This page states only facts that can be confirmed from this |
| R0177 | JB_TOUR_OPERATOR_QUESTIONS!B2 | 1 | should i tell people what hotels before they book? |

**Self-guided info is not missing from live:** /tours/body_3 contains “Details and rates are shared by email, because each trip is different.” The per-page /tours/section_selfguided_info is blank.

**Review note and staging banner lack machine-read fields:** the two /review-note/* rows and /staging-banner are unmapped, though staging components contain literals. Menu and Skip to main content are also source keys absent from live; their literals currently have explicit verifier exemptions.

## All divergent source rows

| Review ID | Tab / row | Source field | Proposed live destination(s) | Suggested action |
| --- | --- | --- | --- | --- |
| R0012 | 00_GLOBAL!B12 | /home/hero/body1 | /hero/body_1 | adopt_per_page |
| R0013 | 00_GLOBAL!B13 | /home/hero/body2 | /hero/body_2 | adopt_per_page |
| R0015 | 00_GLOBAL!B15 | /home/readyToRide/summary1 | /ready-to-ride/summary_1 | adopt_per_page |
| R0020 | 00_GLOBAL!B20 | /home/readyToRide/includedHeading | /ready-to-ride/included_heading | adopt_per_page |
| R0022 | 00_GLOBAL!B22 | /home/readyToRide/included/2 | /ready-to-ride/included_2 | adopt_per_page |
| R0026 | 00_GLOBAL!B26 | /home/readyToRide/included/6 | /ready-to-ride/included_6 | adopt_per_page |
| R0029 | 00_GLOBAL!B29 | /home/readyToRide/cdmHeading | /ready-to-ride/cdm_heading | needs_decision |
| R0030 | 00_GLOBAL!B30 | /home/readyToRide/cdmLines/1 | /ready-to-ride/cdm_heading | needs_decision |
| R0031 | 00_GLOBAL!B31 | /home/readyToRide/cdmLines/2 | /ready-to-ride/cdm_heading | needs_decision |
| R0035 | 00_GLOBAL!B35 | /home/hero/waitlistCta | /hero/waitlist_cta | adopt_per_page |
| R0036 | 00_GLOBAL!B36 | /home/hero/mailingListCta | /hero/mailing_list_cta | adopt_per_page |
| R0037 | 00_GLOBAL!B37 | /contact/emailCta | /contact/email_cta | adopt_per_page |
| R0039 | 02_TOURS!B1 | /tours/heading | /tours/heading_1 | adopt_per_page |
| R0041 | 02_TOURS!B3 | /tours/lede | /tours/body_1 | needs_decision |
| R0042 | 02_TOURS!B4 | /tours/section_group_heading | /tours/heading_2 | adopt_per_page |
| R0043 | 02_TOURS!B5 | /tours/section_group_cta | /tours/cta_1 | adopt_per_page |
| R0044 | 02_TOURS!B6 | /tours/section_selfguided_heading | /tours/frag_1 | adopt_per_page |
| R0045 | 02_TOURS!B7 | /tours/section_selfguided_body | /tours/body_2 | needs_decision |
| R0047 | 02_TOURS!B9 | /tours/section_selfguided_cta | /tours/cta_2 | adopt_per_page |
| R0049 | 02_TOURS!B11 | /tours/section_coaching_body | /tours/body_4 | needs_decision |
| R0051 | 02_TOURS!B13 | /tours/cdm_facts/route | /cdm-facts/copy_4 | needs_decision |
| R0054 | 02_TOURS!B16 | /tours/cdm_facts/pricingNote | /cdm-facts/copy_3 | needs_decision |
| R0057 | 03_CONTACT!B3 | /contact/lede | /contact-page/body_1 | adopt_per_page |
| R0058 | 03_CONTACT!B4 | /contact/intro_text | /contact-page/frag_1, /contact/contact_email, /contact-page/frag_2 | needs_decision |
| R0060 | 03_CONTACT!B6 | /contact/link_1 | /contact-page/frag_3 | adopt_per_page |
| R0062 | 03_CONTACT!B8 | /contact/link_3 | /contact-page/frag_5 | adopt_per_page |
| R0072 | 05_CDM_TOUR!B3 | /canal-des-deux-mers/lede_extra | /cdm/frag_1 | adopt_per_page |
| R0076 | 05_CDM_TOUR!B7 | /canal-des-deux-mers/groups_size | /cdm-facts/group_size | needs_decision |
| R0084 | 05_CDM_TOUR!B15 | /canal-des-deux-mers/history_text | /cdm/frag_4, /cdm/frag_5 | merge |
| R0090 | 05_CDM_TOUR!B21 | /canal-des-deux-mers/stats/1 | /cdm-facts/text_1 | needs_decision |
| R0091 | 05_CDM_TOUR!B22 | /canal-des-deux-mers/stats/2 | /cdm-facts/text_2 | needs_decision |
| R0092 | 05_CDM_TOUR!B23 | /canal-des-deux-mers/stats/3 | /cdm-facts/t_1 | needs_decision |
| R0093 | 05_CDM_TOUR!B24 | /canal-des-deux-mers/stats/4 | /cdm-facts/stat_nights | needs_decision |
| R0104 | 05_CDM_TOUR!B35 | /canal-des-deux-mers/week_plan/friday | /cdm-facts/t_2, /cdm-facts/text_3 | merge |
| R0105 | 05_CDM_TOUR!B36 | /canal-des-deux-mers/week_plan/saturday | /cdm-facts/t_3, /cdm-facts/text_4 | merge |
| R0106 | 05_CDM_TOUR!B37 | /canal-des-deux-mers/week_plan/riding_days | /cdm-facts/t_4, /cdm-facts/text_5 | merge |
| R0107 | 05_CDM_TOUR!B38 | /canal-des-deux-mers/week_plan/monday | /cdm-facts/t_5, /cdm-facts/text_6 | merge |
| R0108 | 05_CDM_TOUR!B39 | /canal-des-deux-mers/week_plan/tuesday | /cdm-facts/t_6, /cdm-facts/text_7 | merge |
| R0109 | 05_CDM_TOUR!B40 | /canal-des-deux-mers/toulouse_dinner/text | /cdm-facts/text_8 | needs_decision |
| R0110 | 05_CDM_TOUR!B41 | /canal-des-deux-mers/toulouse_dinner/dress | /cdm-facts/copy_25 | adopt_per_page |
| R0115 | 05_CDM_TOUR!B46 | /canal-des-deux-mers/included/5 | /cdm-facts/copy_9 | needs_decision |
| R0122 | 06_RESOURCES!B3 | /resources/on_page_text | /resources-page/frag_1, /resources-page/frag_2, /resources-page/frag_3, /resources-page/heading_3, /resources/helpful_sites_heading | needs_decision |
| R0128 | 06_RESOURCES!B9 | /resources/french_text | /resources-page/frag_9, /resources-page/frag_10 | merge |
| R0130 | 06_RESOURCES!B11 | /resources/helpful_sites_heading | /resources/helpful_sites_heading | needs_decision |
| R0142 | 06_RESOURCES!B23 | /resources/audio_guides/rd7 | /resources-library/text_10 | needs_decision |
| R0143 | 06_RESOURCES!B24 | /resources/audio_guides/rd8 | /resources-library/text_11 | needs_decision |
| R0162 | 07_FORMS!B2 | /waitlist-2027/p | /waitlist/body_1 | adopt_per_page |
| R0181 | 08_POLICY_PAGES!B5 | /privacy/section_1_text | /privacy/frag_1, /privacy/frag_2 | needs_decision |
| R0183 | 08_POLICY_PAGES!B7 | /privacy/section_2_text | /privacy/frag_3, /contact/contact_email, /privacy/frag_4 | needs_decision |
| R0185 | 08_POLICY_PAGES!B9 | /privacy/section_3_text | /privacy/body_2 | adopt_per_page |
| R0187 | 08_POLICY_PAGES!B11 | /privacy/section_4_text | /privacy/body_3 | adopt_per_page |
| R0189 | 08_POLICY_PAGES!B13 | /privacy/section_5_text | /contact-page/frag_1, /contact/contact_email | needs_decision |
| R0192 | 09_PRACTICAL_INFO!B4 | /canal-des-deux-mers/practical-info/lede | /cdm-practical/body_2 | adopt_per_page |
| R0195 | 09_PRACTICAL_INFO!B7 | /canal-des-deux-mers/practical-info/bus_heading | /cdm-practical/heading_4 | adopt_per_page |
| R0198 | 09_PRACTICAL_INFO!B10 | /canal-des-deux-mers/practical-info/bus_choose_heading | /cdm-practical/heading_7 | adopt_per_page |

Read both verbatim versions and full flags in the CSV/JSON. Each row contains its own decision template.

## All blank source copy cells

| Review ID | Source location | Source key | Live destination / condition |
| --- | --- | --- | --- |
| R0010 | 00_GLOBAL!B10 | /staging-banner | (no live match) |
| R0046 | 02_TOURS!B8 | /tours/section_selfguided_info | /tours/body_3 |
| R0055 | 03_CONTACT!B1 | /contact/eyebrow | /nav/contact |
| R0056 | 03_CONTACT!B2 | /contact/h1 | /contact-page/meta_title |
| R0059 | 03_CONTACT!B5 | /contact/section_heading | /contact-page/heading_2 |
| R0061 | 03_CONTACT!B7 | /contact/link_2 | /contact-page/frag_4 |
| R0063 | 03_CONTACT!B9 | /contact/fallback_text | /contact-page/frag_6, /contact/contact_email, /contact-page/frag_7 |
| R0065 | 03_CONTACT!B11 | /contact/section_2_text | /contact-page/body_2 |

## All source keys absent verbatim from live

This is the full key-structure gap list, including aliases that map to existing content. Unmapped rows are not inferred deletions or automatic new fields.

| Review ID | Source key | Proposed live destination(s) |
| --- | --- | --- |
| R0006 | /nav/mobile_toggle | (none) |
| R0007 | /a11y/skip_link | (none) |
| R0008 | /footer/explore_heading | /footer/nav_explore_heading |
| R0009 | /footer/legal_heading | /footer/nav_legal_heading |
| R0010 | /staging-banner | (none) |
| R0011 | /home/hero/heading | /hero/heading |
| R0012 | /home/hero/body1 | /hero/body_1 |
| R0013 | /home/hero/body2 | /hero/body_2 |
| R0014 | /home/readyToRide/heading | /ready-to-ride/heading |
| R0015 | /home/readyToRide/summary1 | /ready-to-ride/summary_1 |
| R0016 | /home/readyToRide/summary2 | /ready-to-ride/summary_2 |
| R0017 | /home/readyToRide/summary3 | /ready-to-ride/summary_3 |
| R0018 | /home/readyToRide/summary4 | /ready-to-ride/summary_4 |
| R0019 | /home/readyToRide/rideFacts | /ready-to-ride/ride_facts |
| R0020 | /home/readyToRide/includedHeading | /ready-to-ride/included_heading |
| R0021 | /home/readyToRide/included/1 | /ready-to-ride/included_1 |
| R0022 | /home/readyToRide/included/2 | /ready-to-ride/included_2 |
| R0023 | /home/readyToRide/included/3 | /ready-to-ride/included_3 |
| R0024 | /home/readyToRide/included/4 | /ready-to-ride/included_4 |
| R0025 | /home/readyToRide/included/5 | /ready-to-ride/included_5 |
| R0026 | /home/readyToRide/included/6 | /ready-to-ride/included_6 |
| R0027 | /home/readyToRide/included/7 | /ready-to-ride/included_7 |
| R0028 | /home/readyToRide/included/8 | /ready-to-ride/included_8 |
| R0029 | /home/readyToRide/cdmHeading | /ready-to-ride/cdm_heading |
| R0030 | /home/readyToRide/cdmLines/1 | /ready-to-ride/cdm_heading |
| R0031 | /home/readyToRide/cdmLines/2 | /ready-to-ride/cdm_heading |
| R0032 | /home/about/heading | /about/heading |
| R0033 | /home/about/subheading | /about/subheading |
| R0034 | /home/gallery/heading | /gallery/heading |
| R0035 | /home/hero/waitlistCta | /hero/waitlist_cta |
| R0036 | /home/hero/mailingListCta | /hero/mailing_list_cta |
| R0037 | /contact/emailCta | /contact/email_cta |
| R0038 | /resources/libraryCta | /resources/helpful_stuff_library_cta |
| R0039 | /tours/heading | /tours/heading_1 |
| R0040 | /tours/eyebrow | /nav/tours |
| R0041 | /tours/lede | /tours/body_1 |
| R0042 | /tours/section_group_heading | /tours/heading_2 |
| R0043 | /tours/section_group_cta | /tours/cta_1 |
| R0044 | /tours/section_selfguided_heading | /tours/frag_1 |
| R0045 | /tours/section_selfguided_body | /tours/body_2 |
| R0046 | /tours/section_selfguided_info | /tours/body_3 |
| R0047 | /tours/section_selfguided_cta | /tours/cta_2 |
| R0048 | /tours/section_coaching_heading | /tours/heading_3 |
| R0049 | /tours/section_coaching_body | /tours/body_4 |
| R0050 | /tours/section_coaching_cta | /tours/cta_3 |
| R0051 | /tours/cdm_facts/route | /cdm-facts/copy_4 |
| R0052 | /tours/cdm_facts/departures | /cdm-facts/copy_1 |
| R0053 | /tours/cdm_facts/datesNote | /cdm-facts/copy_2 |
| R0054 | /tours/cdm_facts/pricingNote | /cdm-facts/copy_3 |
| R0055 | /contact/eyebrow | /nav/contact |
| R0056 | /contact/h1 | /contact-page/meta_title |
| R0057 | /contact/lede | /contact-page/body_1 |
| R0058 | /contact/intro_text | /contact-page/frag_1, /contact/contact_email, /contact-page/frag_2 |
| R0059 | /contact/section_heading | /contact-page/heading_2 |
| R0060 | /contact/link_1 | /contact-page/frag_3 |
| R0061 | /contact/link_2 | /contact-page/frag_4 |
| R0062 | /contact/link_3 | /contact-page/frag_5 |
| R0063 | /contact/fallback_text | /contact-page/frag_6, /contact/contact_email, /contact-page/frag_7 |
| R0064 | /contact/section_2_heading | /contact-page/heading_3 |
| R0065 | /contact/section_2_text | /contact-page/body_2 |
| R0066 | /about/section_how_heading | /about-page/heading_1 |
| R0067 | /about/section_who_heading | /about-page/heading_2 |
| R0068 | /about/contact_cta_heading | /about-x/p_1 |
| R0069 | /about/contact_cta_text | /about-x/p_2 |
| R0070 | /canal-des-deux-mers/eyebrow | /cdm/body_1 |
| R0071 | /canal-des-deux-mers/h1 | /cdm/heading_1 |
| R0072 | /canal-des-deux-mers/lede_extra | /cdm/frag_1 |
| R0073 | /canal-des-deux-mers/button_ask | /cdm/cta_1 |
| R0074 | /canal-des-deux-mers/at_a_glance_heading | /cdm/heading_2 |
| R0075 | /canal-des-deux-mers/route_same | /cdm/item_1 |
| R0076 | /canal-des-deux-mers/groups_size | /cdm-facts/group_size |
| R0077 | /canal-des-deux-mers/route_heading | /cdm/heading_3 |
| R0078 | /canal-des-deux-mers/stops_intro | /cdm/body_2 |
| R0079 | /canal-des-deux-mers/week_runs_heading | /cdm/heading_4 |
| R0080 | /canal-des-deux-mers/toulouse_dinner_heading | /cdm/heading_5 |
| R0081 | /canal-des-deux-mers/self_supported_heading | /cdm/heading_6 |
| R0082 | /canal-des-deux-mers/practical_link | /cdm/frag_3 |
| R0083 | /canal-des-deux-mers/history_heading | /cdm/heading_7 |
| R0084 | /canal-des-deux-mers/history_text | /cdm/frag_4, /cdm/frag_5 |
| R0085 | /canal-des-deux-mers/gallery_heading | /cdm/heading_8 |
| R0086 | /canal-des-deux-mers/facts/route | /cdm-facts/copy_4 |
| R0087 | /canal-des-deux-mers/facts/departures | /cdm-facts/copy_1 |
| R0088 | /canal-des-deux-mers/facts/datesNote | /cdm-facts/copy_2 |
| R0089 | /canal-des-deux-mers/facts/pricingNote | /cdm-facts/copy_3 |
| R0090 | /canal-des-deux-mers/stats/1 | /cdm-facts/text_1 |
| R0091 | /canal-des-deux-mers/stats/2 | /cdm-facts/text_2 |
| R0092 | /canal-des-deux-mers/stats/3 | /cdm-facts/t_1 |
| R0093 | /canal-des-deux-mers/stats/4 | /cdm-facts/stat_nights |
| R0094 | /canal-des-deux-mers/stops/1 | /cdm-facts/t_7 |
| R0095 | /canal-des-deux-mers/stops/2 | /cdm-facts/t_8 |
| R0096 | /canal-des-deux-mers/stops/3 | /cdm-facts/t_9 |
| R0097 | /canal-des-deux-mers/stops/4 | /cdm-facts/t_10 |
| R0098 | /canal-des-deux-mers/stops/5 | /cdm-facts/copy_24 |
| R0099 | /canal-des-deux-mers/stops/6 | /cdm-facts/t_11 |
| R0100 | /canal-des-deux-mers/stops/7 | /cdm-facts/t_12 |
| R0101 | /canal-des-deux-mers/stops/8 | /cdm-facts/t_13 |
| R0102 | /canal-des-deux-mers/stops/9 | /cdm-facts/t_14 |
| R0103 | /canal-des-deux-mers/stops/10 | /cdm-facts/t_15 |
| R0104 | /canal-des-deux-mers/week_plan/friday | /cdm-facts/t_2, /cdm-facts/text_3 |
| R0105 | /canal-des-deux-mers/week_plan/saturday | /cdm-facts/t_3, /cdm-facts/text_4 |
| R0106 | /canal-des-deux-mers/week_plan/riding_days | /cdm-facts/t_4, /cdm-facts/text_5 |
| R0107 | /canal-des-deux-mers/week_plan/monday | /cdm-facts/t_5, /cdm-facts/text_6 |
| R0108 | /canal-des-deux-mers/week_plan/tuesday | /cdm-facts/t_6, /cdm-facts/text_7 |
| R0109 | /canal-des-deux-mers/toulouse_dinner/text | /cdm-facts/text_8 |
| R0110 | /canal-des-deux-mers/toulouse_dinner/dress | /cdm-facts/copy_25 |
| R0111 | /canal-des-deux-mers/included/1 | /cdm-facts/copy_5 |
| R0112 | /canal-des-deux-mers/included/2 | /cdm-facts/copy_6 |
| R0113 | /canal-des-deux-mers/included/3 | /cdm-facts/copy_7 |
| R0114 | /canal-des-deux-mers/included/4 | /cdm-facts/copy_8 |
| R0115 | /canal-des-deux-mers/included/5 | /cdm-facts/copy_9 |
| R0116 | /canal-des-deux-mers/included/6 | /cdm-facts/copy_10 |
| R0117 | /canal-des-deux-mers/included/7 | /cdm-facts/copy_11 |
| R0118 | /canal-des-deux-mers/included/8 | /cdm-facts/copy_12 |
| R0119 | /canal-des-deux-mers/included/9 | /cdm-facts/copy_13 |
| R0120 | /resources/eyebrow | /nav/resources |
| R0121 | /resources/h1 | /resources-page/heading_1 |
| R0122 | /resources/on_page_text | /resources-page/frag_1, /resources-page/frag_2, /resources-page/frag_3, /resources-page/heading_3, /resources/helpful_sites_heading |
| R0123 | /resources/templates_heading | /resources-page/frag_2 |
| R0124 | /resources/audio_heading | /resources-page/heading_2 |
| R0125 | /resources/audio_intro | /resources-page/body_1 |
| R0126 | /resources/food_heading | /resources-page/frag_5 |
| R0127 | /resources/french_heading | /resources-page/frag_8 |
| R0128 | /resources/french_text | /resources-page/frag_9, /resources-page/frag_10 |
| R0129 | /resources/reading_heading | /resources-page/heading_3 |
| R0131 | /resources/contact_cta_heading | /resources-x/p_2 |
| R0132 | /resources/contact_cta_text | /resources-x/p_3 |
| R0133 | /resources/audio_guides/complete | /resources-library/text_1 |
| R0134 | /resources/audio_guides/intro | /resources-library/text_2 |
| R0135 | /resources/audio_guides/rd1 | /resources-library/text_3 |
| R0136 | /resources/audio_guides/rd2 | /resources-library/text_4 |
| R0137 | /resources/audio_guides/rd3 | /resources-library/text_5 |
| R0138 | /resources/audio_guides/rd4 | /resources-library/text_6 |
| R0139 | /resources/audio_guides/rest | /resources-library/text_7 |
| R0140 | /resources/audio_guides/rd5 | /resources-library/text_8 |
| R0141 | /resources/audio_guides/rd6 | /resources-library/text_9 |
| R0142 | /resources/audio_guides/rd7 | /resources-library/text_10 |
| R0143 | /resources/audio_guides/rd8 | /resources-library/text_11 |
| R0144 | /resources/audio_guides/rd9 | /resources-library/text_12 |
| R0145 | /resources/audio_guides/conclusion | /resources-library/text_13 |
| R0146 | /resources/food_audio | /resources-library/text_14 |
| R0147 | /resources/templates/packing_list | /resources-library/text_15 |
| R0148 | /resources/narratives/historical | /resources-library/text_17 |
| R0149 | /resources/trusted_sites/eurovelo | /resources-library/text_19 |
| R0150 | /resources/trusted_sites/france_velo | /resources-library/text_20 |
| R0151 | /resources/trusted_sites/komoot | /resources-library/text_21 |
| R0152 | /resources/trusted_sites/ridewithgps | /resources-library/t_1 |
| R0153 | /resources/trusted_sites/af3v | /resources-library/text_22 |
| R0154 | /resources/trusted_sites/sncf | /resources-library/text_23 |
| R0155 | /resources/trusted_sites/ign | /resources-library/text_24 |
| R0156 | /resources/trusted_sites/velo_territoires | /resources-library/text_25 |
| R0157 | /resources/trusted_sites/freewheeling | /resources-library/text_26 |
| R0158 | /resources/trusted_sites/adventure_cycling | /resources-library/text_27 |
| R0159 | /resources/trusted_sites/peak_coast | /resources-library/text_28 |
| R0160 | /resources/trusted_sites/azure | /resources-library/text_29 |
| R0161 | /waitlist-2027/h1 | /waitlist/heading_1 |
| R0162 | /waitlist-2027/p | /waitlist/body_1 |
| R0163 | /waitlist-2027/intro | /waitlist/body_2 |
| R0164 | /waitlist-2027/success_h2 | /waitlist/heading_2 |
| R0165 | /waitlist-2027/success_p | /waitlist/body_3 |
| R0166 | /waitlist-2027/first_name_label | /waitlist/label_1 |
| R0167 | /waitlist-2027/email_label | /waitlist/frag_1 |
| R0168 | /waitlist-2027/interest_legend | /waitlist/frag_2 |
| R0169 | /waitlist-2027/interest_spring | /waitlist/frag_3 |
| R0170 | /waitlist-2027/interest_fall | /waitlist/frag_4 |
| R0171 | /waitlist-2027/interest_either | /waitlist/label_2 |
| R0172 | /waitlist-2027/marketing_label | /waitlist/label_3 |
| R0173 | /waitlist-2027/consent_notice | /waitlist/consent_notice |
| R0174 | /waitlist-2027/submit_button | /waitlist/cta_1 |
| R0175 | /review-note/title | (none) |
| R0176 | /review-note/body | (none) |
| R0177 | 1 | (none) |
| R0178 | /privacy/h1 | /nav/privacy |
| R0179 | /privacy/lede | /privacy/body_1 |
| R0180 | /privacy/section_1_heading | /privacy/heading_1 |
| R0181 | /privacy/section_1_text | /privacy/frag_1, /privacy/frag_2 |
| R0182 | /privacy/section_2_heading | /privacy/heading_2 |
| R0183 | /privacy/section_2_text | /privacy/frag_3, /contact/contact_email, /privacy/frag_4 |
| R0184 | /privacy/section_3_heading | /privacy/heading_3 |
| R0185 | /privacy/section_3_text | /privacy/body_2 |
| R0186 | /privacy/section_4_heading | /privacy/heading_4 |
| R0187 | /privacy/section_4_text | /privacy/body_3 |
| R0188 | /privacy/section_5_heading | /privacy/heading_5 |
| R0189 | /privacy/section_5_text | /contact-page/frag_1, /contact/contact_email |
| R0190 | /canal-des-deux-mers/practical-info/eyebrow | /nav/practical_info |
| R0191 | /canal-des-deux-mers/practical-info/h1 | /cdm-practical/heading_1 |
| R0192 | /canal-des-deux-mers/practical-info/lede | /cdm-practical/body_2 |
| R0193 | /canal-des-deux-mers/practical-info/summary_heading | /cdm-practical/heading_2 |
| R0194 | /canal-des-deux-mers/practical-info/tram_heading | /cdm-practical/heading_3 |
| R0195 | /canal-des-deux-mers/practical-info/bus_heading | /cdm-practical/heading_4 |
| R0196 | /canal-des-deux-mers/practical-info/choose_heading | /cdm-practical/heading_5 |
| R0197 | /canal-des-deux-mers/practical-info/tram_choose_heading | /cdm-practical/heading_6 |
| R0198 | /canal-des-deux-mers/practical-info/bus_choose_heading | /cdm-practical/heading_7 |
| R0199 | /canal-des-deux-mers/practical-info/details_heading | /cdm-practical/frag_3 |
| R0200 | /canal-des-deux-mers/practical-info/contact_cta_heading | /canal-des-deux-mers-practical-info-x/p_1 |
| R0201 | /canal-des-deux-mers/practical-info/contact_cta_text | /canal-des-deux-mers-practical-info-x/p_2 |
| R0202 | /canal-des-deux-mers/practical-info/tram_summary/cost | /cdm-practical/list_1 |
| R0203 | /canal-des-deux-mers/practical-info/tram_summary/time | /cdm-practical/list_2 |
| R0204 | /canal-des-deux-mers/practical-info/tram_summary/frequency | /cdm-practical/list_3 |
| R0205 | /canal-des-deux-mers/practical-info/tram_summary/bike | /cdm-practical/list_4 |
| R0206 | /canal-des-deux-mers/practical-info/tram_summary/tickets | /cdm-practical/list_5 |
| R0207 | /canal-des-deux-mers/practical-info/tram_summary/best_for | /cdm-practical/list_6 |
| R0208 | /canal-des-deux-mers/practical-info/bus_summary/cost | /cdm-practical/list_7 |
| R0209 | /canal-des-deux-mers/practical-info/bus_summary/time | /cdm-practical/list_8 |
| R0210 | /canal-des-deux-mers/practical-info/bus_summary/schedule | /cdm-practical/list_9 |
| R0211 | /canal-des-deux-mers/practical-info/bus_summary/bike | /cdm-practical/list_10 |
| R0212 | /canal-des-deux-mers/practical-info/bus_summary/tickets | /cdm-practical/list_11 |
| R0213 | /canal-des-deux-mers/practical-info/bus_summary/best_for | /cdm-practical/list_12 |
| R0214 | /canal-des-deux-mers/practical-info/tram_choose/1 | /cdm-practical/list_13 |
| R0215 | /canal-des-deux-mers/practical-info/tram_choose/2 | /cdm-practical/list_14 |
| R0216 | /canal-des-deux-mers/practical-info/tram_choose/3 | /cdm-practical/list_15 |
| R0217 | /canal-des-deux-mers/practical-info/tram_choose/4 | /cdm-practical/list_16 |
| R0218 | /canal-des-deux-mers/practical-info/bus_choose/1 | /cdm-practical/list_17 |
| R0219 | /canal-des-deux-mers/practical-info/bus_choose/2 | /cdm-practical/list_18 |
| R0220 | /canal-des-deux-mers/practical-info/bus_choose/3 | /cdm-practical/list_19 |
| R0221 | /canal-des-deux-mers/practical-info/bus_choose/4 | /cdm-practical/list_20 |

## Shared live destinations

| Live field | Source review IDs | Source locations |
| --- | --- | --- |
| /nav/tours | R0002, R0040 | 00_GLOBAL!B2; 02_TOURS!B2 |
| /nav/resources | R0004, R0120 | 00_GLOBAL!B4; 06_RESOURCES!B1 |
| /nav/contact | R0005, R0055 | 00_GLOBAL!B5; 03_CONTACT!B1 |
| /ready-to-ride/cdm_heading | R0029, R0030, R0031 | 00_GLOBAL!B29; 00_GLOBAL!B30; 00_GLOBAL!B31 |
| /cdm-facts/copy_4 | R0051, R0086 | 02_TOURS!B13; 05_CDM_TOUR!B17 |
| /cdm-facts/copy_1 | R0052, R0087 | 02_TOURS!B14; 05_CDM_TOUR!B18 |
| /cdm-facts/copy_2 | R0053, R0088 | 02_TOURS!B15; 05_CDM_TOUR!B19 |
| /cdm-facts/copy_3 | R0054, R0089 | 02_TOURS!B16; 05_CDM_TOUR!B20 |
| /contact-page/frag_1 | R0058, R0189 | 03_CONTACT!B4; 08_POLICY_PAGES!B13 |
| /contact/contact_email | R0058, R0063, R0183, R0189 | 03_CONTACT!B4; 03_CONTACT!B9; 08_POLICY_PAGES!B7; 08_POLICY_PAGES!B13 |
| /resources-page/frag_2 | R0122, R0123 | 06_RESOURCES!B3; 06_RESOURCES!B4 |
| /resources-page/heading_3 | R0122, R0129 | 06_RESOURCES!B3; 06_RESOURCES!B10 |
| /resources/helpful_sites_heading | R0122, R0130 | 06_RESOURCES!B3; 06_RESOURCES!B11 |

## Live-only inventory

These live fields have no per-page counterpart in this snapshot. They are present in the mapping with coverage=live_only and status=empty_in_per_page. That status means the source row is absent, not that a live cell is blank. Retain until separately reviewed.

| Review ID | Live row | Field |
| --- | --- | --- |
| R0222 | 2 | /meta_title |
| R0223 | 3 | /meta_description |
| R0224 | 4 | /header/logo_text |
| R0225 | 26 | /ready-to-ride/cdm_cta |
| R0226 | 29 | /about/body_1 |
| R0227 | 30 | /about/body_2 |
| R0228 | 31 | /about/body_3 |
| R0229 | 32 | /about/body_4 |
| R0230 | 33 | /about/body_5 |
| R0231 | 34 | /about/body_6 |
| R0232 | 35 | /about/body_7 |
| R0233 | 36 | /footer/policies |
| R0234 | 39 | /resources/meta_description |
| R0235 | 40 | /resources/back_link |
| R0236 | 41 | /resources/helpful_stuff_heading |
| R0237 | 43 | /resources/helpful_stuff_body |
| R0238 | 44 | /resources/helpful_sites_body |
| R0239 | 45 | /resources/helpful_stuff_library_text |
| R0240 | 47 | /404/heading |
| R0241 | 48 | /404/body |
| R0242 | 49 | /404/home_cta |
| R0243 | 50 | /404/resources_cta |
| R0244 | 51 | /404/footer_note |
| R0245 | 52 | /footer/copyright |
| R0246 | 53 | /footer/small_commercial_bottom |
| R0247 | 56 | /buttons/read_more_about_john |
| R0248 | 57 | /buttons/more_tour_photos |
| R0249 | 59 | /404-page/body_1 |
| R0250 | 60 | /404-page/meta_description |
| R0251 | 63 | /about-page/meta_description |
| R0252 | 64 | /about-page/meta_title |
| R0253 | 81 | /cdm-practical/meta_description |
| R0254 | 82 | /cdm-practical/meta_title |
| R0255 | 83 | /cdm/aria_1 |
| R0256 | 96 | /cdm/meta_description |
| R0257 | 97 | /cdm/meta_title |
| R0258 | 102 | /contact-page/meta_description |
| R0259 | 104 | /cookies/body_1 |
| R0260 | 105 | /cookies/body_2 |
| R0261 | 106 | /cookies/body_3 |
| R0262 | 107 | /cookies/body_4 |
| R0263 | 108 | /cookies/heading_1 |
| R0264 | 109 | /cookies/heading_2 |
| R0265 | 110 | /cookies/heading_3 |
| R0266 | 111 | /cookies/meta_description |
| R0267 | 112 | /footer-ui/alt_1 |
| R0268 | 113 | /photos/text_1 |
| R0269 | 114 | /photos/text_10 |
| R0270 | 115 | /photos/text_11 |
| R0271 | 116 | /photos/text_12 |
| R0272 | 117 | /photos/text_13 |
| R0273 | 118 | /photos/text_14 |
| R0274 | 119 | /photos/text_15 |
| R0275 | 120 | /photos/text_16 |
| R0276 | 121 | /photos/text_17 |
| R0277 | 122 | /photos/text_18 |
| R0278 | 123 | /photos/text_19 |
| R0279 | 124 | /photos/text_2 |
| R0280 | 125 | /photos/text_20 |
| R0281 | 126 | /photos/text_3 |
| R0282 | 127 | /photos/text_4 |
| R0283 | 128 | /photos/text_5 |
| R0284 | 129 | /photos/text_6 |
| R0285 | 130 | /photos/text_7 |
| R0286 | 131 | /photos/text_8 |
| R0287 | 132 | /photos/text_9 |
| R0288 | 141 | /privacy/meta_description |
| R0289 | 149 | /resources-library/text_16 |
| R0290 | 151 | /resources-library/text_18 |
| R0291 | 175 | /terms/body_1 |
| R0292 | 176 | /terms/body_2 |
| R0293 | 177 | /terms/body_3 |
| R0294 | 178 | /terms/body_4 |
| R0295 | 179 | /terms/body_5 |
| R0296 | 180 | /terms/heading_1 |
| R0297 | 181 | /terms/heading_2 |
| R0298 | 182 | /terms/heading_3 |
| R0299 | 183 | /terms/heading_4 |
| R0300 | 184 | /terms/meta_description |
| R0301 | 195 | /tours/meta_description |
| R0302 | 196 | /tours/meta_title |
| R0303 | 206 | /waitlist/label_4 |
| R0304 | 212 | /cdm-facts/copy_14 |
| R0305 | 213 | /cdm-facts/copy_15 |
| R0306 | 214 | /cdm-facts/copy_16 |
| R0307 | 215 | /cdm-facts/copy_17 |
| R0308 | 216 | /cdm-facts/copy_18 |
| R0309 | 217 | /cdm-facts/copy_19 |
| R0310 | 219 | /cdm-facts/copy_20 |
| R0311 | 220 | /cdm-facts/copy_21 |
| R0312 | 221 | /cdm-facts/copy_22 |
| R0313 | 222 | /cdm-facts/copy_23 |
| R0314 | 237 | /nav/cdm_tour |
| R0315 | 240 | /nav/terms |
| R0316 | 241 | /nav/cookies |
| R0317 | 242 | /email/general_subject |
| R0318 | 243 | /email/waitlist_subject |
| R0319 | 244 | /email/waitlist_body |
| R0320 | 245 | /email/mailing_list_subject |
| R0321 | 246 | /email/mailing_list_body |
| R0322 | 247 | /email/planning_subject |
| R0323 | 248 | /email/planning_body |
| R0324 | 264 | /photos/t_1 |
| R0325 | 267 | /cdm-practical/frag_1 |
| R0326 | 268 | /cdm-practical/last_checked |
| R0327 | 269 | /cdm-practical/frag_2 |
| R0328 | 272 | /cdm/frag_2 |
| R0329 | 292 | /resources-page/frag_6 |
| R0330 | 293 | /resources-page/frag_7 |
| R0331 | 305 | /resources-x/p_1 |
| R0332 | 329 | /ui-included/frag_1 |
| R0333 | 330 | /ui-included/frag_2 |
| R0334 | 331 | /ui-included/frag_3 |
| R0335 | 332 | /cdm-practical/q1_title |
| R0336 | 333 | /cdm-practical/q1_tram |
| R0337 | 334 | /cdm-practical/q1_bus |
| R0338 | 335 | /cdm-practical/q2_title |
| R0339 | 336 | /cdm-practical/q2_tram |
| R0340 | 337 | /cdm-practical/q2_bus |
| R0341 | 338 | /cdm-practical/q3_title |
| R0342 | 339 | /cdm-practical/q3_tram |
| R0343 | 340 | /cdm-practical/q3_bus |
| R0344 | 341 | /cdm-practical/q4_title |
| R0345 | 342 | /cdm-practical/q4_tram |
| R0346 | 343 | /cdm-practical/q4_bus |
| R0347 | 344 | /cdm-practical/q5_title |
| R0348 | 345 | /cdm-practical/q5_tram |
| R0349 | 346 | /cdm-practical/q5_bus |
| R0350 | 347 | /cdm-practical/q6_title |
| R0351 | 348 | /cdm-practical/q6_tram |
| R0352 | 349 | /cdm-practical/q6_bus |
| R0353 | 351 | /waitlist/meta_title |
| R0354 | 352 | /waitlist/meta_description |

## Approval and consolidation prerequisites

The sync reads only the selected tab (first tab by default) and plain values; it does not inspect colors. Therefore identical text, yellow text, and successfully validated text are separate from owner approval. This review changes no authority or gate behavior. Before a future consolidation: review all mappings/wording, agree an explicit approval representation if desired, coordinate any new field readers with the manifest, and re-read current Sheet values before writing. No approvals are inferred from this report.

The active root has no 00_PROJECT RULES.md. The explicitly referenced canonical file is for BTF_CDM_STATUS_SUCCESSOR and names a different Sheet/project. This task followed the owner’s explicit BTF root/Sheet scope and the active root AGENTS.md. No rules files were modified.

## Verification and outputs

Drive modifiedTime stayed unchanged before/after the reads: 2026-10-05T16:37:20.985Z. Live CellData text matched the plain-value snapshot. Pale-yellow cell: Approved Site Copy!B268 (/cdm-practical/last_checked, June 2026).

- v01_COPY_MAPPING_FOR_REVIEW.csv: UTF-8 BOM, quoted fields, embedded newlines preserved; human review columns blank.
- v01_COPY_MAPPING_FOR_REVIEW.json: structured rows, read metadata, source snapshot, and live fill evidence.
- v01_COPY_REVIEW_SUMMARY.md: counts, all divergences, blank/unmapped keys, missing-page correction, shared targets and live-only inventory.
- Verified CSV/JSON row parity, exact source values and live values, unique review IDs, allowed statuses/actions, complete per-page and live coverage, blank decision columns and round-trip preservation.
- Site build not run: this is local documentation/data analysis and does not change source, dependencies or runtime behavior.
- No Sheet writes, Git commit/push, deployment, Pages settings, DNS, live-domain or Framer change. Existing uncommitted work retained.
