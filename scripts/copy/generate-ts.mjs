// Step 3 of the production check: generate src/data/approved-copy.ts from the validated artifact.
//
// The Google Sheet is the only source of approved copy. This script translates the Sheet's
// field naming (/section/field_name, snake_case) into the shape the Astro components consume
// (nested camelCase). It contains NO copy text of its own: if the Sheet is missing a value the
// code needs, the build fails and names the missing rows.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PATHS, fail } from './lib.mjs';

const artifactPath = PATHS.artifact;
const outputPath = resolve(process.cwd(), 'src/data/approved-copy.ts');

if (!existsSync(artifactPath)) {
  fail(`copy:generate-ts FAILED. ${artifactPath} is missing. Run "npm run copy:validate" first.`);
}

const artifact = JSON.parse(readFileSync(artifactPath, 'utf8'));
const { fields, sheetTitle, tab } = artifact;

// Sheet field -> code property. Every value the components read must appear here.
const SCALARS = [
  ['metaDescription', '/meta_description'],
  ['footerPolicies', '/footer/policies'],
  ['copyright', '/footer/copyright'],
  ['smallCommercialBottom', '/footer/small_commercial_bottom'],
  ['footerNav.exploreHeading', '/footer/nav_explore_heading'],
  ['footerNav.legalHeading', '/footer/nav_legal_heading'],
  ['hero.heading', '/hero/heading'],
  ['hero.body1', '/hero/body_1'],
  ['hero.body2', '/hero/body_2'],
  ['hero.mailingListCta', '/hero/mailing_list_cta'],
  ['hero.waitlistCta', '/hero/waitlist_cta'],
  ['readyToRide.heading', '/ready-to-ride/heading'],
  ['readyToRide.summary1', '/ready-to-ride/summary_1'],
  ['readyToRide.summary2', '/ready-to-ride/summary_2'],
  ['readyToRide.summary3', '/ready-to-ride/summary_3'],
  ['readyToRide.summary4', '/ready-to-ride/summary_4'],
  ['readyToRide.rideFacts', '/ready-to-ride/ride_facts'],
  ['readyToRide.includedHeading', '/ready-to-ride/included_heading'],
  ['readyToRide.cdmHeading', '/ready-to-ride/cdm_heading'],
  ['readyToRide.cdmCta', '/ready-to-ride/cdm_cta'],
  ['about.heading', '/about/heading'],
  ['about.subheading', '/about/subheading'],
  ['about.body1', '/about/body_1'],
  ['about.body2', '/about/body_2'],
  ['about.body3', '/about/body_3'],
  ['about.body4', '/about/body_4'],
  ['about.body5', '/about/body_5'],
  ['about.body6', '/about/body_6'],
  ['about.body7', '/about/body_7'],
  ['gallery.heading', '/gallery/heading'],
  ['buttons.readMoreAboutJohn', '/buttons/read_more_about_john'],
  ['buttons.moreTourPhotos', '/buttons/more_tour_photos'],
  ['contact.emailCta', '/contact/email_cta'],
  ['contact.contactEmail', '/contact/contact_email'],
  ['resources.metaDescription', '/resources/meta_description'],
  ['resources.backLink', '/resources/back_link'],
  ['resources.helpfulStuffHeading', '/resources/helpful_stuff_heading'],
  ['resources.helpfulSitesHeading', '/resources/helpful_sites_heading'],
  ['resources.helpfulStuffBody', '/resources/helpful_stuff_body'],
  ['resources.helpfulSitesBody', '/resources/helpful_sites_body'],
  ['resources.libraryText', '/resources/helpful_stuff_library_text'],
  ['resources.libraryCta', '/resources/helpful_stuff_library_cta'],
  ['notFound.heading', '/404/heading'],
  ['notFound.body', '/404/body'],
  ['notFound.homeCta', '/404/home_cta'],
  ['notFound.resourcesCta', '/404/resources_cta'],
  ['notFound.footerNote', '/404/footer_note'],
];

// Numbered Sheet rows that become an array, e.g. /ready-to-ride/included_1..n
const LISTS = [['readyToRide.included', '/ready-to-ride/included_']];

const copy = {};
const missing = [];

function setPath(target, path, value) {
  const parts = path.split('.');
  let node = target;
  for (let i = 0; i < parts.length - 1; i += 1) {
    if (!node[parts[i]]) node[parts[i]] = {};
    node = node[parts[i]];
  }
  node[parts[parts.length - 1]] = value;
}

for (const [codePath, sheetPath] of SCALARS) {
  const value = fields[sheetPath];
  if (typeof value !== 'string' || value.trim() === '') {
    missing.push({ sheetPath, codePath });
    continue;
  }
  setPath(copy, codePath, value);
}

for (const [codePath, prefix] of LISTS) {
  const items = [];
  for (let i = 1; ; i += 1) {
    const value = fields[`${prefix}${i}`];
    if (typeof value !== 'string' || value.trim() === '') break;
    items.push(value);
  }
  if (items.length === 0) {
    missing.push({ sheetPath: `${prefix}1`, codePath });
    continue;
  }
  setPath(copy, codePath, items);
}

if (missing.length > 0) {
  const rows = missing.map((m) => `  - ${m.sheetPath}   (code reads COPY.${m.codePath})`).join('\n');
  fail(
    `copy:generate-ts FAILED. The Sheet is missing ${missing.length} field(s) that the site renders.\n` +
      `Add these rows to the approved-copy Sheet (mark unapproved cells YELLOW), then re-run:\n${rows}`
  );
}

// Derived: the CDM heading's first line is the title; the remaining lines render as separate lines.
copy.readyToRide.cdmLines = copy.readyToRide.cdmHeading
  .split('\n')
  .slice(1)
  .map((line) => line.trim())
  .filter(Boolean);

function serialize(value, indent) {
  const pad = ' '.repeat(indent);
  const padInner = ' '.repeat(indent + 2);
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return `[\n${value.map((v) => `${padInner}${serialize(v, indent + 2)}`).join(',\n')}\n${pad}]`;
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    const body = entries
      .map(([key, v]) => `${padInner}${key}: ${serialize(v, indent + 2)}`)
      .join(',\n');
    return `{\n${body}\n${pad}}`;
  }
  return JSON.stringify(value);
}

const source = `// GENERATED FILE - DO NOT EDIT BY HAND.
// Written by scripts/copy/generate-ts.mjs from the approved-copy Google Sheet
// "${sheetTitle}" (tab "${tab}"), read during the build. The Sheet is the source of truth.

export const COPY = ${serialize(copy, 0)} as const;

export function footerPolicyParts(): { label: string; text: string }[] {
  return COPY.footerPolicies
    .split(/(?=(?:Privacy Policy|Terms of Service|Cookie Policy|Disclaimer): )/)
    .map((part) => {
      const [label, ...rest] = part.split(': ');
      return { label, text: rest.join(': ').trim() };
    });
}
`;

writeFileSync(outputPath, source);
console.log(
  `copy:generate-ts  OK: ${SCALARS.length} fields + ${LISTS.length} list(s) -> ${outputPath}`
);
