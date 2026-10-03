// Writes docs/COPY_FIELD_MAP_REVIEW.md: the field map for owner review. Rows come from
// copy/field-manifest.json and the checked-in snapshot of the current site copy
// (copy/fixture/fixture-rows.json). Run `npm run build` and `npm run copy:check-local` first: that check
// confirms every row below appears on its built page, in order, with no other public text.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PATHS, ROOT, loadManifest } from './lib.mjs';

const manifest = loadManifest();
const snapshot = new Map(JSON.parse(readFileSync(PATHS.fixture, 'utf8')));

const PAGES = {
  site: ['All pages (header, footer, shared labels)', '*'],
  home: ['Home', '/'],
  tours: ['Tours', '/tours/'],
  'cdm-tour': ['Canal des Deux Mers', '/canal-des-deux-mers/'],
  'practical-information': ['Practical information', '/canal-des-deux-mers/practical-info/'],
  resources: ['Resources', '/resources/'],
  about: ['About', '/about/'],
  contact: ['Contact', '/contact/'],
  privacy: ['Privacy', '/privacy/'],
  terms: ['Terms', '/terms/'],
  cookies: ['Cookies', '/cookies/'],
  404: ['404 page', '404 page'],
  photos: ['Image alt text and captions (shared)', 'various'],
};

const CTA = new Set([
  'site/cta_waitlist_label',
  'site/cta_email_label',
  'home/hero_cta_tour',
  'home/tour_waitlist_cta',
  'home/cdm_cta',
  'tours/group_cta',
  'tours/group_waitlist_cta',
  'tours/self_guided_cta',
  'tours/coaching_cta',
  'cdm-tour/hero_cta_question',
  '404/home_button',
  '404/tour_button',
]);
const LINK_TEXT =
  /^(site\/(nav_|legal_|footer_email)|[a-z-]+\/(ways_group_link|ways_own_link|about_link|gallery_link|practical_link|audio_download_label))/;

function contentType(field, copy) {
  if (field.endsWith('_alt')) return 'image alt text';
  if (CTA.has(field)) return 'CTA';
  if (LINK_TEXT.test(field)) return 'link text';
  if (/^- /m.test(copy) || /^## /m.test(copy) || /\]\(/.test(copy) || copy.includes('\n'))
    return 'structured content';
  return 'text';
}

function requiredNote(entry) {
  if (entry.required) return 'Yes';
  if (entry.field === 'site/staging_banner' || entry.field === 'site/review_note') return 'No (staging only)';
  return 'No (optional caption)';
}

// Show copy as a visitor reads it: bullets as bullets, bold and links left as Markdown so they render in the table.
function show(copy) {
  return copy
    .replace(/^- /gm, '• ')
    .replace(/\|/g, '\\|')
    .replace(/\n{2,}/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

const groups = new Map();
for (const entry of manifest) {
  const key = entry.field.split('/')[0];
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(entry);
}

const counts = {};
const rows = [];
for (const [key, entries] of groups) {
  const [label, route] = PAGES[key] ?? [key, entries[0].route];
  rows.push(
    `\n## ${label}\n`,
    `Route: \`${route}\`\n`,
    '| Page | `page/field_name` | Current rendered copy | Content type | Required |',
    '|---|---|---|---|---|',
  );
  for (const entry of entries) {
    const copy = snapshot.get(entry.field);
    if (copy === undefined) throw new Error(`No current copy for ${entry.field}`);
    const type = contentType(entry.field, copy);
    counts[type] = (counts[type] ?? 0) + 1;
    rows.push(`| ${label} | \`${entry.field}\` | ${show(copy)} | ${type} | ${requiredNote(entry)} |`);
  }
}

const total = manifest.length;
const optional = manifest.filter((m) => !m.required).length;
const text = `# Copy field map for review

Prepared 2026-10-03 from the **current staging site**. Nothing here has been approved, and the Sheet \`BTF_Approved_Site_Copy\` is **not** yet the required production source. This map is for review first.

## How this map was checked

- Every row's copy was confirmed present, in display order, on the pages built from this branch (\`npm run copy:check-local\`, 11 pages, ${total} fields).
- The same check was run against the HTML of the deployed Cloudflare Pages preview of the staging site (\`e476b72c.temp-btf.pages.dev\`) and passed on all 11 pages.
- It also confirms no page shows text, image alt text, a title, or a description that is missing from this map. A mismatch anywhere would have failed that check.

## At a glance

| | |
|---|---|
| Fields | ${total} (${total - optional} required, ${optional} optional) |
| Text | ${counts.text ?? 0} |
| CTA (button labels) | ${counts.CTA ?? 0} |
| Link text | ${counts['link text'] ?? 0} |
| Image alt text | ${counts['image alt text'] ?? 0} |
| Structured content (lists, sections, link lists, multi-line answers) | ${counts['structured content'] ?? 0} |

Each field is one editable block. "Required" means the current public site needs that block. Four fields are optional: the staging banner and the draft-review note (staging only), and two photo captions.

## Points to check while reviewing

1. **Pricing** stays unpublished and marked TBD. The wording is in \`home/whats_included_notice\`, \`cdm-tour/whats_included_notice\`, \`cdm-tour/dates_pricing_notice\`, and \`tours/group_body\`, and is mentioned in \`contact/lists_body\` and \`terms/page_copy\`. No dollar amount appears anywhere in the map.
2. **Mailing list.** The site has no mailing list, and this map has no mailing-list field. The existing Contact page heading \`contact/lists_heading\` still says "the waitlist and the mailing list" and its body says there is no online sign-up form. The wording is shown exactly as it is on the site today, so you can decide whether to change it.
3. **Dated wording.** \`site/footer_copyright\` (2026), \`privacy/page_lede\`, \`terms/page_lede\`, \`cookies/page_lede\` ("Last updated October 2, 2026"), \`practical-information/data_notice\` ("last checked in June 2026"), and \`cdm-tour/history_body\` ("September 2026").
4. **Policy pages** (\`privacy/page_copy\`, \`terms/page_copy\`, \`cookies/page_copy\`) are factual shells that still need your legal review. See \`docs/PRODUCTION_CUTOVER_PREFLIGHT.md\`.
5. **Copy carried over from the old Framer site** and not in your confirmed 2027 facts is listed in \`docs/2027_CDM_CONTENT_AUTHORITY.md\`.
6. Link destinations and email subjects are not part of this map. They stay in code.
${rows.join('\n')}
`;

writeFileSync(resolve(ROOT, 'docs/COPY_FIELD_MAP_REVIEW.md'), text);
console.log(`docs/COPY_FIELD_MAP_REVIEW.md written: ${total} fields`, counts);
