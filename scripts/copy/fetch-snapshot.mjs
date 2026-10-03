// Local-only step: fetch the approved-copy Sheet and write a committed snapshot.
//
// Usage:
//   BTF_COPY_KEY_FILE=/path/to/service-account.json npm run copy:fetch
//
// Uses an existing service account with the read-only Sheets scope. The key file
// path comes from the environment. Key contents are never printed, logged, or
// written. Cloudflare never runs this script; the build uses the committed snapshot.
import { createSign } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import {
  EMPTY_ALLOWED_KEYS,
  KEY_PATTERN,
  SHEET_HEADER,
  SHEET_ID,
  SHEET_TAB,
  SNAPSHOT_PATH,
  contentHash,
  validateSnapshot,
} from './lib.mjs';

const keyFile = process.env.BTF_COPY_KEY_FILE;
if (!keyFile) {
  console.error('BTF_COPY_KEY_FILE is not set. Point it at the existing BTF service account key file.');
  process.exit(2);
}

const b64url = (buf) => Buffer.from(buf).toString('base64url');

async function accessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 600,
    }),
  );
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claim}`);
  const signature = b64url(signer.sign(sa.private_key));
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claim}.${signature}`,
    }),
  });
  if (!res.ok) throw new Error(`Token request failed: HTTP ${res.status}`);
  return (await res.json()).access_token;
}

const sa = JSON.parse(readFileSync(keyFile, 'utf8'));
if (sa.type !== 'service_account' || !sa.client_email || !sa.private_key) {
  throw new Error('Key file is not a service account key.');
}
const token = await accessToken(sa);
const range = encodeURIComponent(`'${SHEET_TAB}'!A:B`);
const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`, {
  headers: { authorization: `Bearer ${token}` },
});
if (!res.ok) {
  const body = await res.json().catch(() => ({}));
  throw new Error(`Sheet fetch failed: HTTP ${res.status} ${body.error?.status ?? ''}`.trim());
}
const values = (await res.json()).values ?? [];
if (values.length < 2) throw new Error('Sheet has no data rows.');
if (values[0][0] !== SHEET_HEADER[0] || values[0][1] !== SHEET_HEADER[1] || values[0].length !== 2) {
  throw new Error(`Unexpected header row: ${JSON.stringify(values[0])}`);
}
const rows = values.slice(1).map((v, i) => {
  if (!v[0] || v.length > 2) throw new Error(`Sheet row ${i + 2} is blank or has extra cells.`);
  if (!KEY_PATTERN.test(v[0])) throw new Error(`Sheet row ${i + 2} has a bad key: ${JSON.stringify(v[0])}`);
  const copy = v[1] ?? '';
  if (copy === '' && !EMPTY_ALLOWED_KEYS.includes(v[0])) throw new Error(`Sheet row ${i + 2} (${v[0]}) is empty and may not be.`);
  return { key: v[0], copy };
});

const snapshot = {
  schema: 1,
  sheetId: SHEET_ID,
  tab: SHEET_TAB,
  fetchedAt: new Date().toISOString(),
  rowCount: rows.length,
  contentSha256: contentHash(rows),
  rows,
};
validateSnapshot(snapshot);
writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Snapshot written: ${SNAPSHOT_PATH}`);
console.log(`Sheet ${SHEET_ID}, tab "${SHEET_TAB}", ${rows.length} rows`);
console.log(`Fetched at ${snapshot.fetchedAt}`);
console.log(`Content SHA-256 ${snapshot.contentSha256}`);
