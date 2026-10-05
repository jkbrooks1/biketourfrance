// Shared code for the approved-copy gate. See docs/APPROVED_COPY_GATE.md.
// Nothing here prints credentials. Error messages name the setting that is wrong, never its value.
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { resolve, dirname, join } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { normalizeCell, parseBlocks, linkTargets, MAIL_TARGETS } from './markup.mjs';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
// BTF_COPY_OUT_DIR lets the test suite write its artifacts somewhere else; normal builds never set it.
const OUT_DIR = process.env.BTF_COPY_OUT_DIR ? resolve(process.env.BTF_COPY_OUT_DIR) : resolve(ROOT, '.copy');
export const PATHS = {
  manifest: resolve(ROOT, 'copy/field-manifest.json'),
  rules: resolve(ROOT, 'copy/consistency-rules.json'),
  fixture: resolve(ROOT, 'copy/fixture/fixture-rows.json'),
  outDir: OUT_DIR,
  rows: resolve(OUT_DIR, 'sheet-rows.json'),
  artifact: resolve(OUT_DIR, 'approved-copy.generated.json'),
  stamp: resolve(OUT_DIR, 'rendered-verified.json'),
  // BTF_COPY_DIST_DIR lets the test suite point the checks at a copy of dist/; normal runs never set it.
  dist: process.env.BTF_COPY_DIST_DIR ? resolve(process.env.BTF_COPY_DIST_DIR) : resolve(ROOT, 'dist'),
};

export const SHEET_TITLE = 'BTF_Approved_Site_Copy';
export const APPROVED_COPY_TAB = 'Approved Site Copy';
// The only service account the gate accepts. It already exists (Google Cloud project btf-general).
export const EXPECTED_SERVICE_ACCOUNT = 'btf-sheets-access@btf-general.iam.gserviceaccount.com';
// Where the existing key lives on the owner's Mac. Used only for local runs (never in CI).
export const DEFAULT_KEY_FILE = join(homedir(), '.config/btf/google/service-account.json');
export const HEADERS = ['page/field_name', 'copy'];
// The authoritative Sheet predates the native Astro migration and uses root-relative
// page paths (for example `/hero/heading`). Keep those identifiers intact: the Sheet
// owns the identifier as well as the approved value.
export const FIELD_PATTERN = /^\/(?:[a-z0-9-]+\/)*[a-z0-9_]+$/;
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SHEETS_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

export class CopyError extends Error {}

export function loadManifest() {
  const manifest = JSON.parse(readFileSync(PATHS.manifest, 'utf8'));
  const seen = new Set();
  for (const entry of manifest) {
    if (!FIELD_PATTERN.test(entry.field))
      throw new CopyError(`Manifest field name is not page/field_name: ${entry.field}`);
    if (seen.has(entry.field)) throw new CopyError(`Manifest has a duplicate field: ${entry.field}`);
    seen.add(entry.field);
    for (const key of ['route', 'required', 'codeLocation']) {
      if (entry[key] === undefined) throw new CopyError(`Manifest entry ${entry.field} is missing "${key}"`);
    }
    if (Object.keys(entry).length !== 4)
      throw new CopyError(
        `Manifest entry ${entry.field} must have only field, route, required, codeLocation`,
      );
  }
  return manifest;
}

export function loadRules() {
  return existsSync(PATHS.rules) ? JSON.parse(readFileSync(PATHS.rules, 'utf8')) : [];
}

export function cleanArtifacts() {
  for (const file of [PATHS.rows, PATHS.artifact, PATHS.stamp]) if (existsSync(file)) unlinkSync(file);
}

export function writeJson(file, data) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(data, null, 1) + '\n');
}

/**
 * Decide where copy comes from. Fixture copy needs an explicit flag and is refused anywhere that
 * could deploy: CI, Cloudflare Pages builds, or when BTF_DEPLOY_ENV names staging or production.
 */
export function resolveMode(env = process.env) {
  const deployEnv = (env.BTF_DEPLOY_ENV || '').toLowerCase();
  const inCI = Boolean(env.CI || env.GITHUB_ACTIONS || env.CF_PAGES);
  if (env.BTF_COPY_FIXTURE === '1') {
    if (inCI || deployEnv) {
      throw new CopyError(
        'Fixture copy is not allowed here. BTF_COPY_FIXTURE=1 was set together with ' +
          [inCI ? 'a CI or Cloudflare Pages build' : '', deployEnv ? `BTF_DEPLOY_ENV=${deployEnv}` : '']
            .filter(Boolean)
            .join(' and ') +
          '. Staging and production builds must read BTF_Approved_Site_Copy.',
      );
    }
    return { mode: 'fixture', deployEnv, inCI };
  }
  return { mode: 'sheet', deployEnv, inCI };
}

// ---------------------------------------------------------------------------------- credentials

function parseServiceAccount(text, origin) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    try {
      data = JSON.parse(Buffer.from(text, 'base64').toString('utf8'));
    } catch {
      throw new CopyError(`${origin} is set but is not valid JSON (or base64-encoded JSON).`);
    }
  }
  const ok =
    data &&
    data.type === 'service_account' &&
    typeof data.client_email === 'string' &&
    typeof data.private_key === 'string' &&
    data.private_key.includes('BEGIN');
  if (!ok)
    throw new CopyError(
      `${origin} is not a Google service account key (needs type, client_email, and private_key).`,
    );
  return data;
}

function requireExpectedAccount(account, origin) {
  if (account.client_email !== EXPECTED_SERVICE_ACCOUNT) {
    throw new CopyError(
      `${origin} is for a different service account. The approved copy gate accepts only ${EXPECTED_SERVICE_ACCOUNT}.`,
    );
  }
  return account;
}

export function readCredentials(env, inCI) {
  const json = env.BTF_COPY_GOOGLE_SA_JSON;
  if (json && json.trim())
    return requireExpectedAccount(
      parseServiceAccount(json.trim(), 'BTF_COPY_GOOGLE_SA_JSON'),
      'BTF_COPY_GOOGLE_SA_JSON',
    );
  // Local runs may use a key file: BTF_COPY_GOOGLE_SA_FILE, or the existing BTF key at its usual path.
  const file = env.BTF_COPY_GOOGLE_SA_FILE || (inCI ? '' : DEFAULT_KEY_FILE);
  if (file && !inCI) {
    if (!existsSync(file)) {
      throw new CopyError(
        env.BTF_COPY_GOOGLE_SA_FILE
          ? 'BTF_COPY_GOOGLE_SA_FILE points to a file that does not exist.'
          : 'No key file was found at the usual BTF key location, and BTF_COPY_GOOGLE_SA_JSON is not set.',
      );
    }
    return requireExpectedAccount(
      parseServiceAccount(readFileSync(file, 'utf8'), 'The key file'),
      'The key file',
    );
  }
  throw new CopyError(
    'No Google credential is configured. Set BTF_COPY_GOOGLE_SA_JSON (the existing btf-sheets-access service account key, stored as a secret). ' +
      (inCI
        ? 'Key files are not accepted in CI.'
        : 'For local use the key file may be named in BTF_COPY_GOOGLE_SA_FILE.'),
  );
}

function b64url(value) {
  return Buffer.from(value).toString('base64url');
}

function makeJwt(account, nowSeconds) {
  const unsigned =
    b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' })) +
    '.' +
    b64url(
      JSON.stringify({
        iss: account.client_email,
        scope: SCOPE,
        aud: TOKEN_URL,
        iat: nowSeconds,
        exp: nowSeconds + 3000,
      }),
    );
  const signature = createSign('RSA-SHA256').update(unsigned).sign(account.private_key);
  return `${unsigned}.${b64url(signature)}`;
}

async function getJson(url, init, fetchImpl, what) {
  let response;
  try {
    response = await fetchImpl(url, { ...init, signal: AbortSignal.timeout(20000) });
  } catch (error) {
    throw new CopyError(`${what} failed: could not reach Google (${error.name}).`);
  }
  let body = null;
  try {
    body = await response.json();
  } catch {
    /* not JSON */
  }
  if (!response.ok) {
    const detail = body?.error?.status || (typeof body?.error === 'string' ? body.error : '') || '';
    const hint =
      response.status === 403
        ? ' Share the spreadsheet read-only (Viewer) with the service account, and enable the Google Sheets API for its project.'
        : response.status === 404
          ? ' The spreadsheet was not found, or it is not shared with the service account.'
          : '';
    throw new CopyError(`${what} failed (HTTP ${response.status}${detail ? ' ' + detail : ''}).${hint}`);
  }
  return body;
}

/** Read the raw A:Z grid of the approved copy sheet with a read-only service account. */
export async function readSheetGrid(
  env = process.env,
  { inCI = false, fetchImpl = fetch, now = () => Date.now() } = {},
) {
  const requestedTab = (env.BTF_COPY_SHEET_TAB || '').trim();
  if (requestedTab && requestedTab !== APPROVED_COPY_TAB) {
    throw new CopyError(
      `BTF_COPY_SHEET_TAB cannot select another tab. The copy authority is "${APPROVED_COPY_TAB}".`,
    );
  }
  const sheetId = (env.BTF_COPY_SHEET_ID || '').trim();
  if (!sheetId)
    throw new CopyError(
      'BTF_COPY_SHEET_ID is not set. It must hold the spreadsheet ID of BTF_Approved_Site_Copy.',
    );
  const account = readCredentials(env, inCI);

  const form = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: makeJwt(account, Math.floor(now() / 1000)),
  });
  const token = await getJson(
    TOKEN_URL,
    { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: form },
    fetchImpl,
    'Google sign-in',
  );
  if (!token?.access_token) throw new CopyError('Google sign-in returned no access token.');
  const auth = { headers: { authorization: `Bearer ${token.access_token}` } };

  const meta = await getJson(
    `${SHEETS_URL}/${encodeURIComponent(sheetId)}?fields=properties.title,sheets.properties.title`,
    auth,
    fetchImpl,
    'Reading spreadsheet details',
  );
  if (meta?.properties?.title !== SHEET_TITLE) {
    throw new CopyError(
      `The spreadsheet is titled "${meta?.properties?.title ?? '(unknown)'}", not "${SHEET_TITLE}". Check BTF_COPY_SHEET_ID.`,
    );
  }
  const tabs = (meta.sheets || []).map((s) => s.properties.title);
  const tab = APPROVED_COPY_TAB;
  if (!tabs.includes(tab)) {
    throw new CopyError(`The spreadsheet has no tab named "${APPROVED_COPY_TAB}". No copy was read.`);
  }

  const range = encodeURIComponent(`'${tab.replace(/'/g, "''")}'!A:Z`);
  const values = await getJson(
    `${SHEETS_URL}/${encodeURIComponent(sheetId)}/values/${range}?valueRenderOption=FORMATTED_VALUE&majorDimension=ROWS`,
    auth,
    fetchImpl,
    'Reading spreadsheet values',
  );
  return { title: meta.properties.title, tab, grid: values.values || [] };
}

// ---------------------------------------------------------------------------------- validation

const BANNED = [
  [/\$\s?\d/, 'contains a dollar amount (pricing must stay unpublished)'],
  [/\b3,?500\b|\b2,?000\b/, 'contains a provisional price figure'],
  [/by continuing|continued use/i, 'claims consent by continued use'],
  [/upcoming[^.]{0,80}2026|2026[^.]{0,80}upcoming/i, 'presents 2026 as upcoming'],
  [/Bike Tour France/i, 'brand written as "Bike Tour France" (use BikeTourFrance.net)'],
  [/BikeTourFrance(?!\.net)/, 'brand written without .net (use BikeTourFrance.net)'],
  [/<\/?[a-z][^>]*>/i, 'contains HTML (use the copy markup instead)'],
];

function fieldKind(field) {
  if (field.endsWith('/seo_title')) return 'seo_title';
  if (field.endsWith('/seo_description')) return 'seo_description';
  if (field.endsWith('_alt')) return 'alt';
  return 'general';
}

/**
 * Validate a sheet grid against the manifest. Returns {errors, fields}. An error has
 * {field, route, code, issue}. fields maps field name to normalized copy, and is only meant to be
 * used when errors is empty.
 */
export function validateGrid(grid, manifest, rules = []) {
  const errors = [];
  const byName = new Map(manifest.map((m) => [m.field, m]));
  const routes = new Set(manifest.map((m) => m.route).filter((r) => r !== '*' && r !== '/404.html'));
  const add = (field, issue) => {
    const m = byName.get(field);
    errors.push({ field, route: m?.route ?? '(not in manifest)', code: m?.codeLocation ?? '(none)', issue });
  };

  const header = (grid[0] || []).map((c) => String(c ?? '').trim());
  if (header.length < 2 || header[0] !== HEADERS[0] || header[1] !== HEADERS[1]) {
    errors.push({
      field: '(header row)',
      route: '-',
      code: '-',
      issue: `row 1 must be exactly "${HEADERS[0]}" and "${HEADERS[1]}"; found "${header.slice(0, 3).join('", "')}"`,
    });
  }
  const extra = grid.some((row) => row.slice(2).some((c) => String(c ?? '').trim() !== ''));
  if (extra)
    errors.push({
      field: '(columns)',
      route: '-',
      code: '-',
      issue: 'the sheet has data in column C or later; it must have exactly two columns',
    });

  const fields = {};
  const seen = new Map();
  grid.slice(1).forEach((row, i) => {
    const sheetRow = i + 2;
    const name = String(row[0] ?? '').trim();
    const copy = normalizeCell(row[1]);
    if (!name && !copy) return; // blank spacer row
    if (!name)
      return errors.push({
        field: `(row ${sheetRow})`,
        route: '-',
        code: '-',
        issue: 'copy with no page/field_name',
      });
    if (!FIELD_PATTERN.test(name))
      return errors.push({
        field: name,
        route: '-',
        code: '-',
        issue: `row ${sheetRow}: not a valid page/field_name (lowercase letters, digits, hyphen, then "/" and lowercase letters, digits, underscore)`,
      });
    if (seen.has(name)) return add(name, `duplicate field name (rows ${seen.get(name)} and ${sheetRow})`);
    seen.set(name, sheetRow);
    if (!byName.has(name))
      return add(
        name,
        `unrecognized field: it is in the sheet (row ${sheetRow}) but not in copy/field-manifest.json`,
      );
    fields[name] = copy;
  });

  for (const m of manifest) {
    const value = fields[m.field];
    if (value === undefined) {
      if (m.required) add(m.field, 'required field is missing from the sheet');
      continue;
    }
    if (value === '') {
      if (m.required) add(m.field, 'required field has blank copy');
      continue;
    }
    // The Sheet is the copy authority. Content-policy checks belong to the site
    // verifier; rejecting an approved value here would hide a real Sheet/site drift.
    if ((value.match(/\*\*/g) || []).length % 2 !== 0) add(m.field, 'unbalanced ** bold markers');
    const kind = fieldKind(m.field);
    if (kind !== 'general' && (/\n/.test(value) || /\*\*|\]\(/.test(value)))
      add(m.field, 'this field must be plain single-line text (no markup)');
    if (kind === 'seo_title' && value.length > 70)
      add(m.field, `title is ${value.length} characters; the limit is 70`);
    if (kind === 'seo_description' && (value.length < 50 || value.length > 200))
      add(m.field, `description is ${value.length} characters; it must be 50 to 200`);
    if (kind === 'alt' && value.length > 200)
      add(m.field, `alt text is ${value.length} characters; the limit is 200`);
    for (const target of linkTargets(value)) {
      if (target.startsWith('mail:')) {
        if (!MAIL_TARGETS.includes(target))
          add(m.field, `unknown mail link target "${target}" (allowed: ${MAIL_TARGETS.join(', ')})`);
      } else if (target.startsWith('#')) {
        if (!/^#[A-Za-z][\w-]*$/.test(target)) add(m.field, `bad anchor link "${target}"`);
      } else if (target.startsWith('/')) {
        if (!routes.has(target.split('#')[0]))
          add(m.field, `internal link "${target}" is not a route in the manifest`);
      } else if (target.startsWith('https://')) {
        try {
          new URL(target);
        } catch {
          add(m.field, `invalid link "${target}"`);
        }
      } else
        add(m.field, `link target "${target}" is not allowed (use /path/, #anchor, https://, or mail:*)`);
    }
    try {
      parseBlocks(value);
    } catch {
      add(m.field, 'copy markup could not be parsed');
    }
  }

    for (const rule of rules) {
    if (rule.rule === 'identical') {
      const values = rule.fields.map((f) => fields[f]);
      if (values.every((v) => v !== undefined) && new Set(values).size > 1) {
        add(
          rule.fields[0],
          `must be identical to ${rule.fields.slice(1).join(', ')} (consistency rule), but the copy differs`,
        );
      }
    }
  }
  return { errors, fields };
}

export function formatReport(errors) {
  const lines = [
    `Copy check FAILED: ${errors.length} problem${errors.length === 1 ? '' : 's'}`,
    '  field | route | code location | issue',
  ];
  for (const e of errors.slice(0, 80)) lines.push(`  - ${e.field} | ${e.route} | ${e.code} | ${e.issue}`);
  if (errors.length > 80) lines.push(`  ... and ${errors.length - 80} more`);
  return lines.join('\n');
}

export function fail(message, code = 1) {
  console.error(message);
  process.exit(code);
}
