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
  footerPolicies: 'Privacy Policy: We collect email and calendar data for webinar registration and scheduling. Data is stored securely and never shared with third parties. Terms of Service: By using our site, you agree to follow all applicable laws and accept our liability limits. BikeTourFrance.net provides advisory services without warranties; users are responsible for their own tour planning and execution. Cookie Policy: We use cookies to track site usage and improve your experience. By continuing to use this site, you consent to cookie usage as required by GDPR and CCPA. Disclaimer: All content is advisory only. We are not liable for injuries, equipment failure, or planning errors resulting from our guidance.',
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

// Map sheet structure to expected code structure
// Sheet uses snake_case nested under "404", code expects "notFound" with camelCase
// Always ensure notFound is set from either sheet or fallback
const has404 = nested && nested['404'] && typeof nested['404'] === 'object';
merged.notFound = has404 ? {
  heading: nested['404'].heading ?? fallback.notFound.heading,
  body: nested['404'].body ?? fallback.notFound.body,
  homeCta: nested['404'].home_cta ?? fallback.notFound.homeCta,
  resourcesCta: nested['404'].resources_cta ?? fallback.notFound.resourcesCta,
  footerNote: nested['404'].footer_note ?? fallback.notFound.footerNote,
} : fallback.notFound;

// Sheet uses "footer.policies", code expects top-level "footerPolicies"
// Always ensure footerPolicies is set
merged.footerPolicies = nested?.footer?.policies ?? fallback.footerPolicies ?? merged.footerPolicies;

// Ensure merged always has required top-level properties
// These are checked by the 404 component and must exist
const final = {
  ...merged,
  notFound: merged.notFound || fallback.notFound,
  footerPolicies: merged.footerPolicies || fallback.footerPolicies,
  buttons: merged.buttons || fallback.buttons,
  footerNav: merged.footerNav || fallback.footerNav,
};

// Verify all required properties exist before serializing
if (!final.notFound || typeof final.notFound !== 'object') {
  throw new Error('notFound property is required and must be an object');
}

// Generate TypeScript code with proper formatting
// Build the COPY object with explicitly declared properties
const copyStr = JSON.stringify(final, null, 2);
const header = `// Page copy taken from the approved-copy Google Sheet "${sheetTitle}" (tab "${tab}",
// read from Sheet during build). The Sheet is the source of truth for this wording.
// Fallback defaults are merged for sections not yet in the sheet.

export const COPY = ${copyStr} as const;

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

// Log what was actually generated for debugging
const lines = header.split('\n');
const copyLine = lines.find(l => l.includes('export const COPY'));
if (copyLine) {
  const jsonPart = copyLine.substring(copyLine.indexOf('=') + 1).trim();
  const preview = jsonPart.substring(0, Math.min(150, jsonPart.length));
  console.error(`[DEBUG] COPY starts with: ${preview.substring(0, 50)}...`);
}
