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

// Generate TypeScript code with proper formatting
const header = `// Page copy taken from the approved-copy Google Sheet "${sheetTitle}" (tab "${tab}",
// read from Sheet during build). The Sheet is the source of truth for this wording.

export const COPY = ${JSON.stringify(nested, null, 2)} as const;

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
