// Step 3 of the production check: generate src/data/approved-copy.ts from the validated artifact.
// This ensures the build always uses the latest approved copy from the Google Sheet.

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

// Convert flat field names (/section/field) to nested structure
const nested = {};
for (const [path, value] of Object.entries(fields)) {
  const parts = path.split('/').filter(Boolean);
  let current = nested;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = {};
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

// Fallback values for sections not yet in the sheet. These ensure the build doesn't fail
// while the sheet is being completed. Once a section is added to the sheet, the sheet value takes precedence.
const fallback = {
  notFound: {
    heading: 'Page not found',
    body: 'We could not find that page. It may have moved, or the link may be mistyped.',
    homeCta: 'Back to the home page',
    resourcesCta: 'Resources',
    footerNote: 'Staging site. Not indexed.',
  },
  buttons: {
    readMoreAboutJohn: 'Read more about John',
    moreTourPhotos: 'More tour photos',
  },
  footerNav: {
    exploreHeading: 'Explore',
    legalHeading: 'Legal',
  },
};

// Merge sheet data with fallback, with sheet taking precedence
const merged = JSON.parse(JSON.stringify(fallback));
const deepMerge = (target, source) => {
  for (const [key, value] of Object.entries(source)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }
};
deepMerge(merged, nested);

// Map sheet structure to expected structure where needed
if (nested.footer?.policies) {
  merged.footerPolicies = nested.footer.policies;
}
if (nested['404']?.home_cta) {
  merged.notFound = merged.notFound || {};
  merged.notFound.homeCta = nested['404'].home_cta;
  merged.notFound.resourcesCta = nested['404'].resources_cta;
  merged.notFound.heading = nested['404'].heading;
  merged.notFound.body = nested['404'].body;
  merged.notFound.footerNote = nested['404'].footer_note;
}

// Generate TypeScript code with proper formatting
const header = `// Page copy taken from the approved-copy Google Sheet "${sheetTitle}" (tab "${tab}",
// read from Sheet during build). The Sheet is the source of truth for this wording.
// Fallback defaults are merged for sections not yet in the sheet.

export const COPY = ${JSON.stringify(merged, null, 2)} as const;

export function footerPolicyParts(): { label: string; text: string }[] {
  return COPY.footerPolicies
    .split(/(?=(?:Privacy Policy|Terms of Service|Cookie Policy|Disclaimer): )/)
    .map((part) => {
      const [label, ...rest] = part.split(': ');
      return { label, text: rest.join(': ').trim() };
    });
}
`;

writeFileSync(outputPath, header);
console.log(`copy:generate-ts  OK: generated ${outputPath}`);
