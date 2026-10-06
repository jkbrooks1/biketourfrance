// Uses the same existing service account and read-only scope as the copy pipeline.
import { createSign } from 'node:crypto';
import { readCredentials, SHEET_TITLE } from '../copy/lib.mjs';
import { TABS } from './review-lib.mjs';

export async function readReviewSheet(env = process.env) {
  const id = env.BTF_COPY_SHEET_ID;
  if (!id) throw new Error('BTF_COPY_SHEET_ID is required to read the photo-review tabs');
  const account = readCredentials(env, Boolean(env.CI || env.GITHUB_ACTIONS));
  const now = Math.floor(Date.now() / 1000);
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const unsigned = encode({ alg: 'RS256', typ: 'JWT' }) + '.' + encode({ iss: account.client_email, scope: 'https://www.googleapis.com/auth/spreadsheets.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3000 });
  const assertion = unsigned + '.' + createSign('RSA-SHA256').update(unsigned).sign(account.private_key, 'base64url');
  async function json(url, options = {}) {
    const response = await fetch(url, { ...options, signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Photo review Google API failed with HTTP ${response.status}; no previous review is used as fallback`);
    return response.json();
  }
  const token = await json('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }) });
  if (!token.access_token) throw new Error('Photo review Google sign-in failed');
  const auth = { headers: { authorization: `Bearer ${token.access_token}` } };
  const base = 'https://sheets.googleapis.com/v4/spreadsheets/' + encodeURIComponent(id);
  const meta = await json(base + '?fields=properties.title,sheets.properties.title', auth);
  if (meta.properties.title !== SHEET_TITLE) throw new Error('Photo review must use BTF_Approved_Site_Copy');
  const tabs = meta.sheets.map((sheet) => sheet.properties.title);
  if (!Object.values(TABS).every((tab) => tabs.includes(tab))) throw new Error('Photo review tabs are missing; build stops without a stale fallback');
  const ranges = [...Object.values(TABS).map((tab) => `'${tab}'!A1:K500`), "'Approved Site Copy'!A1:B1268"];
  const query = new URLSearchParams({ valueRenderOption: 'UNFORMATTED_VALUE' });
  ranges.forEach((range) => query.append('ranges', range));
  const values = await json(base + '/values:batchGet?' + query, auth);
  return { collections: Object.fromEntries(Object.keys(TABS).map((key, index) => [key, values.valueRanges[index].values || []])), approved: values.valueRanges[2].values || [] };
}
