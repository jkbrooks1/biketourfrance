// Runtime access to approved copy. Every public text block on the site comes from here, keyed by
// page/field_name. The data is the generated artifact written by `npm run copy:validate` from the
// BTF_Approved_Site_Copy sheet (or from the fixture, only for local development).
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { toPlain } from './copy-markup.mjs';

export const ARTIFACT_PATH = resolve(process.cwd(), '.copy/approved-copy.generated.json');
export const FIXTURE_BANNER =
  'FIXTURE COPY. This is a local development build. The text on this page is not approved copy. Never deploy it.';
const MAX_AGE_MS = 3 * 60 * 60 * 1000;

function load() {
  if (!existsSync(ARTIFACT_PATH)) {
    throw new Error(
      'Approved copy artifact is missing (.copy/approved-copy.generated.json). Run "npm run copy:sync && npm run copy:validate" ' +
        '(or "npm run dev:fixture" for local fixture copy).',
    );
  }
  const artifact = JSON.parse(readFileSync(ARTIFACT_PATH, 'utf8'));
  if (artifact.source !== 'sheet' && artifact.source !== 'fixture')
    throw new Error('Approved copy artifact has an unknown source.');
  // A sheet-sourced artifact must be fresh when a production build runs. Fixture copy has no age limit.
  const isBuild = Boolean(import.meta.env?.PROD);
  if (isBuild && artifact.source === 'sheet' && Date.now() - Date.parse(artifact.fetchedAt) > MAX_AGE_MS) {
    throw new Error(
      'Approved copy artifact is stale (older than 3 hours). Run "npm run copy:sync && npm run copy:validate" again.',
    );
  }
  return artifact;
}

const artifact = load();

export const COPY_SOURCE = artifact.source; // 'sheet' | 'fixture'
export const COPY_ID = createHash('sha256')
  .update(JSON.stringify(artifact.fields))
  .digest('hex')
  .slice(0, 16);

/** Raw approved cell text. Throws if the field is not in the artifact. */
export function raw(field) {
  const value = artifact.fields[field];
  if (value === undefined) throw new Error(`Approved copy field is missing: ${field}`);
  return value;
}

/** Raw cell text, or '' when an optional field is absent or blank. */
export function maybe(field) {
  return artifact.fields[field] ?? '';
}

export function has(field) {
  return artifact.fields[field] !== undefined && artifact.fields[field] !== '';
}

/** Plain text of a field (markup removed). Use for headings, labels, and attributes. */
export function t(field) {
  return toPlain(raw(field));
}
