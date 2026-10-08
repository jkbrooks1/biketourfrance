import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import test from 'node:test';
import { APPROVED_COPY_TAB, EXPECTED_SERVICE_ACCOUNT, HEADERS, readSheetGrid, validateGrid } from './lib.mjs';

// A fresh in-memory key exercises the real JWT signing path without reading or storing credentials.
const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const env = {
  BTF_COPY_SHEET_ID: 'unit-test-spreadsheet',
  BTF_COPY_GOOGLE_SA_JSON: JSON.stringify({
    type: 'service_account',
    client_email: EXPECTED_SERVICE_ACCOUNT,
    private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }),
  }),
};

function mockGoogle(titles) {
  const reads = [];
  const fetchImpl = async (url, options) => {
    reads.push(String(url));
    let body;
    if (String(url).includes('oauth2.googleapis.com')) {
      assert.equal(options.method, 'POST');
      body = { access_token: 'unit-test-only' };
    } else if (String(url).includes('/values/')) {
      assert.equal(decodeURIComponent(String(url).split('/values/')[1].split('?')[0]), "'Approved Site Copy'!A:Z");
      body = { values: [HEADERS, ['/hero/heading', 'Owner wording']] };
    } else {
      body = {
        properties: { title: 'BTF_Approved_Site_Copy' },
        sheets: titles.map((title) => ({ properties: { title } })),
      };
    }
    return { ok: true, json: async () => body };
  };
  return { reads, fetchImpl };
}

test('reads the named copy authority when tabs are reordered', async () => {
  const mock = mockGoogle(['02_TOURS', APPROVED_COPY_TAB, '00_GLOBAL']);
  const result = await readSheetGrid(env, { fetchImpl: mock.fetchImpl });
  assert.equal(result.tab, APPROVED_COPY_TAB);
  assert.deepEqual(result.grid, [HEADERS, ['/hero/heading', 'Owner wording']]);
  assert.equal(mock.reads.filter((u) => u.includes('/values/')).length, 1);
});

test('missing named tab fails without reading a substitute', async () => {
  const mock = mockGoogle(['02_TOURS', '00_GLOBAL']);
  await assert.rejects(readSheetGrid(env, { fetchImpl: mock.fetchImpl }), /no tab named "Approved Site Copy"/);
  assert.equal(mock.reads.filter((u) => u.includes('/values/')).length, 0);
});

test('a conflicting legacy tab override fails before authentication', async () => {
  const mock = mockGoogle(['02_TOURS', APPROVED_COPY_TAB]);
  await assert.rejects(
    readSheetGrid({ ...env, BTF_COPY_SHEET_TAB: '02_TOURS' }, { fetchImpl: mock.fetchImpl }),
    /cannot select another tab/,
  );
  assert.equal(mock.reads.length, 0);
});

test('the matching legacy override remains compatible', async () => {
  const mock = mockGoogle(['02_TOURS', APPROVED_COPY_TAB]);
  const result = await readSheetGrid(
    { ...env, BTF_COPY_SHEET_TAB: APPROVED_COPY_TAB },
    { fetchImpl: mock.fetchImpl },
  );
  assert.equal(result.tab, APPROVED_COPY_TAB);
});

const dupManifest = [{ field: '/x/a', route: '/', required: true, codeLocation: 'src/pages/index.astro' }];

test('identical duplicate keys are kept once with a warning and no error', () => {
  const grid = [HEADERS, ['/x/a', 'Same text'], [], ['/x/a', 'Same text']];
  const { errors, fields, warnings } = validateGrid(grid, dupManifest);
  assert.deepEqual(errors, []);
  assert.equal(fields['/x/a'], 'Same text');
  assert.equal(warnings.length, 1);
  assert.equal(warnings[0].field, '/x/a');
  assert.match(warnings[0].issue, /rows 2 and 4/);
});

test('conflicting duplicate keys are rejected and the first row wins', () => {
  const grid = [HEADERS, ['/x/a', 'First text'], ['/x/a', 'Second text']];
  const { errors, fields, warnings } = validateGrid(grid, dupManifest);
  assert.equal(errors.length, 1);
  assert.equal(errors[0].field, '/x/a');
  assert.match(errors[0].issue, /duplicate field name \(rows 2 and 3\)/);
  assert.equal(fields['/x/a'], 'First text');
  assert.equal(warnings.length, 0);
});
