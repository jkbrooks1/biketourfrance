// Proves the approved-copy gate fails closed, and can also pass. Run with `npm run copy:test`
// (needs a built site in dist/: `npm run build` first). Tests use temp folders and never touch real
// credentials. The RSA key below is generated in memory for a fake Google sign-in.
import assert from 'node:assert/strict';
import { generateKeyPairSync, createVerify } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, writeFileSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  CopyError,
  EXPECTED_SERVICE_ACCOUNT,
  HEADERS,
  PATHS,
  ROOT,
  SHEET_TITLE,
  loadManifest,
  loadRules,
  readCredentials,
  readSheetGrid,
  resolveMode,
  validateGrid,
} from './lib.mjs';
import { checkManifestLocations } from './code-references.mjs';

const manifest = loadManifest();
const rules = loadRules();
const fixtureRows = JSON.parse(readFileSync(PATHS.fixture, 'utf8'));
const grid = (rows) => [HEADERS, ...rows.map((r) => [...r])];
const messages = (r) => r.errors.map((e) => `${e.field} | ${e.route} | ${e.code} | ${e.issue}`).join('\n');
const results = [];
const test = async (name, fn) => {
  try {
    await fn();
    results.push([true, name]);
  } catch (error) {
    results.push([false, `${name}\n      ${String(error.message).split('\n').slice(0, 3).join('\n      ')}`]);
  }
};
const run = (script, env = {}, args = []) =>
  spawnSync(process.execPath, [join(ROOT, script), ...args], {
    env: { PATH: process.env.PATH, HOME: '/nonexistent-home', ...env },
    encoding: 'utf8',
    cwd: ROOT,
  });
const tmp = () => mkdtempSync(join(tmpdir(), 'btf-copy-test-'));
const SECRET_MARKER = /BEGIN (RSA )?PRIVATE KEY|private_key|access_token/;

// ---- validation: the Sheet side
await test('valid fixture rows pass validation', () =>
  assert.equal(validateGrid(grid(fixtureRows), manifest, rules).errors.length, 0));

await test('MISSING required field is rejected, naming field, route and code location', () => {
  const rows = fixtureRows.filter((r) => r[0] !== 'home/hero_heading');
  assert.match(
    messages(validateGrid(grid(rows), manifest, rules)),
    /home\/hero_heading \| \/ \| src\/pages\/index\.astro \| required field is missing from the sheet/,
  );
});

await test('DUPLICATE field name is rejected', () => {
  const rows = [...fixtureRows, ['home/hero_heading', 'A second heading']];
  assert.match(
    messages(validateGrid(grid(rows), manifest, rules)),
    /home\/hero_heading .* duplicate field name/,
  );
});

await test('UNKNOWN / unrecognized sheet field is rejected', () => {
  const rows = [...fixtureRows, ['home/not_in_manifest', 'Surprise copy']];
  assert.match(
    messages(validateGrid(grid(rows), manifest, rules)),
    /home\/not_in_manifest .* unrecognized field/,
  );
});

await test('MISMATCHED copy between pages that must match is rejected (consistency rule)', () => {
  const rows = fixtureRows.map((r) =>
    r[0] === 'cdm-tour/whats_included' ? [r[0], r[1].replace('All breakfasts.', 'Some breakfasts.')] : r,
  );
  assert.match(
    messages(validateGrid(grid(rows), manifest, rules)),
    /home\/whats_included .* must be identical to cdm-tour\/whats_included/,
  );
});

await test('blank copy in a required field is rejected', () => {
  const rows = fixtureRows.map((r) => (r[0] === 'about/who_body' ? [r[0], '   '] : r));
  assert.match(messages(validateGrid(grid(rows), manifest, rules)), /about\/who_body .* blank copy/);
});

await test('blank copy in an OPTIONAL field is allowed', () => {
  const rows = fixtureRows.map((r) => (r[0] === 'photos/creon_caption' ? [r[0], ''] : r));
  assert.equal(validateGrid(grid(rows), manifest, rules).errors.length, 0);
});

await test('a header-only sheet (the real sheet before it is filled in) fails with every required field missing', () => {
  const result = validateGrid([HEADERS], manifest, rules);
  assert.equal(
    result.errors.filter((e) => /required field is missing/.test(e.issue)).length,
    manifest.filter((m) => m.required).length,
  );
});

await test('wrong header names are rejected', () => {
  assert.match(
    messages(validateGrid([['field', 'text'], ...fixtureRows], manifest, rules)),
    /header row.*exactly "page\/field_name" and "copy"/,
  );
});

await test('a third column is rejected (exactly two columns)', () => {
  const bad = grid(fixtureRows);
  bad[3] = [...bad[3], 'status: approved'];
  assert.match(messages(validateGrid(bad, manifest, rules)), /exactly two columns/);
});

await test('a dollar price in copy is rejected (pricing stays unpublished)', () => {
  const rows = fixtureRows.map((r) => (r[0] === 'tours/group_body' ? [r[0], r[1] + ' From $3,500.'] : r));
  assert.match(messages(validateGrid(grid(rows), manifest, rules)), /tours\/group_body .* dollar amount/);
});

await test('consent-by-use wording and broken link targets are rejected', () => {
  const rows = fixtureRows.map((r) =>
    r[0] === 'cookies/page_copy'
      ? [r[0], r[1] + '\n\nBy continuing you accept. [Elsewhere](http://example.com) [Gone](/no-such-page/)']
      : r,
  );
  const text = messages(validateGrid(grid(rows), manifest, rules));
  assert.match(text, /consent by continued use/);
  assert.match(text, /not allowed/);
  assert.match(text, /not a route in the manifest/);
});

await test('manifest check flags a code location that does not exist', () => {
  const bad = [
    ...manifest,
    { field: 'home/phantom_field', route: '/', required: true, codeLocation: 'src/pages/nowhere.astro' },
  ];
  assert.match(
    checkManifestLocations(bad)
      .map((e) => `${e.field} ${e.issue}`)
      .join('\n'),
    /home\/phantom_field code location file does not exist/,
  );
  assert.equal(checkManifestLocations(manifest).length, 0);
});

// ---- mode and credentials
await test('fixture copy is REFUSED for production, staging, CI, and Cloudflare Pages builds', () => {
  for (const env of [
    { BTF_DEPLOY_ENV: 'production' },
    { BTF_DEPLOY_ENV: 'staging' },
    { CI: 'true' },
    { GITHUB_ACTIONS: 'true' },
    { CF_PAGES: '1' },
  ]) {
    assert.throws(() => resolveMode({ BTF_COPY_FIXTURE: '1', ...env }), CopyError, JSON.stringify(env));
  }
  assert.equal(resolveMode({ BTF_COPY_FIXTURE: '1' }).mode, 'fixture');
  assert.equal(resolveMode({}).mode, 'sheet');
});

await test('sheet mode with no credential fails clearly and prints no secret', async () => {
  await assert.rejects(
    readSheetGrid({ BTF_COPY_SHEET_ID: 'abc' }, { inCI: true }),
    (e) => e instanceof CopyError && /No Google credential/.test(e.message) && !SECRET_MARKER.test(e.message),
  );
  await assert.rejects(readSheetGrid({}), /BTF_COPY_SHEET_ID is not set/);
  await assert.rejects(
    readSheetGrid({ BTF_COPY_SHEET_ID: 'abc', BTF_COPY_GOOGLE_SA_JSON: '{not json' }),
    (e) => /not valid JSON/.test(e.message) && !e.message.includes('{not json'),
  );
});

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const pem = privateKey.export({ type: 'pkcs8', format: 'pem' });
const account = (email) => JSON.stringify({ type: 'service_account', client_email: email, private_key: pem });
const fakeAccount = account(EXPECTED_SERVICE_ACCOUNT);

await test('a key for any OTHER service account is rejected (only btf-sheets-access is accepted)', () => {
  assert.throws(
    () =>
      readCredentials(
        { BTF_COPY_GOOGLE_SA_JSON: account('someone-else@example.iam.gserviceaccount.com') },
        true,
      ),
    (e) => /different service account/.test(e.message) && !SECRET_MARKER.test(e.message),
  );
  assert.equal(
    readCredentials({ BTF_COPY_GOOGLE_SA_JSON: fakeAccount }, true).client_email,
    EXPECTED_SERVICE_ACCOUNT,
  );
});

await test('a key file IS accepted locally, including under the production command (not CI)', () => {
  const file = join(tmp(), 'key.json');
  writeFileSync(file, fakeAccount);
  assert.equal(
    readCredentials({ BTF_COPY_GOOGLE_SA_FILE: file }, false).client_email,
    EXPECTED_SERVICE_ACCOUNT,
  );
});

await test('key files are not accepted in CI', () => {
  assert.throws(
    () => readCredentials({ BTF_COPY_GOOGLE_SA_FILE: '/some/file.json' }, true),
    /No Google credential/,
  );
});

// ---- the Google path, end to end, against a fake Google
const fakeGoogle = ({ title = SHEET_TITLE, status = 200, values = grid(fixtureRows) } = {}) => {
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    calls.push(String(url));
    const ok = (body) => ({ ok: true, status: 200, json: async () => body });
    if (String(url).startsWith('https://oauth2.googleapis.com/token')) {
      const [h, c, sig] = new URLSearchParams(String(init.body)).get('assertion').split('.');
      assert.ok(
        createVerify('RSA-SHA256').update(`${h}.${c}`).verify(publicKey, Buffer.from(sig, 'base64url')),
        'JWT signature did not verify',
      );
      const claims = JSON.parse(Buffer.from(c, 'base64url'));
      assert.equal(claims.scope, 'https://www.googleapis.com/auth/spreadsheets.readonly');
      assert.equal(claims.iss, EXPECTED_SERVICE_ACCOUNT);
      return ok({ access_token: 'fake-token' });
    }
    if (status !== 200)
      return {
        ok: false,
        status,
        json: async () => ({
          error: { status: status === 403 ? 'PERMISSION_DENIED' : 'NOT_FOUND', message: 'nope' },
        }),
      };
    if (String(url).includes('/values/')) return ok({ values });
    return ok({ properties: { title }, sheets: [{ properties: { title: 'Approved Site Copy' } }] });
  };
  return { fetchImpl, calls };
};
const env = { BTF_COPY_SHEET_ID: 'sheet-id', BTF_COPY_GOOGLE_SA_JSON: fakeAccount };

await test('sheet path: signs a read-only JWT as btf-sheets-access, reads A:Z, returns the grid', async () => {
  const g = fakeGoogle();
  const result = await readSheetGrid(env, { fetchImpl: g.fetchImpl, inCI: true });
  assert.equal(result.title, SHEET_TITLE);
  assert.equal(result.grid.length, fixtureRows.length + 1);
  assert.ok(
    g.calls.some((u) => u.includes('A%3AZ')),
    'did not request A:Z',
  );
  assert.equal(validateGrid(result.grid, manifest, rules).errors.length, 0);
});
await test('sheet path: HTTP 403 says to share read-only; HTTP 404 says not found; no secret printed', async () => {
  await assert.rejects(
    readSheetGrid(env, { fetchImpl: fakeGoogle({ status: 403 }).fetchImpl, inCI: true }),
    (e) => /HTTP 403/.test(e.message) && /Viewer/.test(e.message) && !SECRET_MARKER.test(e.message),
  );
  await assert.rejects(
    readSheetGrid(env, { fetchImpl: fakeGoogle({ status: 404 }).fetchImpl, inCI: true }),
    /HTTP 404/,
  );
});
await test('sheet path: a spreadsheet with the wrong title is rejected', async () => {
  await assert.rejects(
    readSheetGrid(env, { fetchImpl: fakeGoogle({ title: 'Some other sheet' }).fetchImpl, inCI: true }),
    /not "BTF_Approved_Site_Copy"/,
  );
});

// ---- scripts as the production command runs them
await test('copy:sync in sheet mode without credentials exits non-zero and leaves NO artifact', () => {
  const out = tmp();
  const r = run('scripts/copy/sync.mjs', { BTF_COPY_OUT_DIR: out, BTF_COPY_SHEET_ID: 'abc', CI: 'true' });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /copy:sync FAILED/);
  assert.ok(
    !existsSync(join(out, 'sheet-rows.json')) && !existsSync(join(out, 'approved-copy.generated.json')),
  );
});

await test('copy:sync refuses fixture copy under BTF_DEPLOY_ENV=production', () => {
  const out = tmp();
  const r = run('scripts/copy/sync.mjs', {
    BTF_COPY_OUT_DIR: out,
    BTF_COPY_FIXTURE: '1',
    BTF_DEPLOY_ENV: 'production',
  });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /Fixture copy is not allowed/);
  assert.ok(!existsSync(join(out, 'sheet-rows.json')));
});

await test('a stale artifact is deleted by sync, so a failed sync cannot fall back to old copy', () => {
  const out = tmp();
  writeFileSync(join(out, 'approved-copy.generated.json'), '{"source":"sheet","fields":{}}');
  writeFileSync(join(out, 'rendered-verified.json'), '{"source":"sheet"}');
  const r = run('scripts/copy/sync.mjs', { BTF_COPY_OUT_DIR: out, CI: 'true' });
  assert.notEqual(r.status, 0);
  assert.ok(
    !existsSync(join(out, 'approved-copy.generated.json')) &&
      !existsSync(join(out, 'rendered-verified.json')),
  );
});

await test('copy:validate without fetched rows fails and writes no artifact', () => {
  const out = tmp();
  const r = run('scripts/copy/validate.mjs', { BTF_COPY_OUT_DIR: out });
  assert.notEqual(r.status, 0);
  assert.ok(!existsSync(join(out, 'approved-copy.generated.json')));
});

await test('copy:validate on a Sheet with a missing field fails with a mismatch report and no artifact', () => {
  const out = tmp();
  const rows = fixtureRows.filter((r) => r[0] !== 'cdm-tour/hero_heading');
  writeFileSync(
    join(out, 'sheet-rows.json'),
    JSON.stringify({
      source: 'sheet',
      title: SHEET_TITLE,
      tab: 't',
      fetchedAt: new Date().toISOString(),
      grid: grid(rows),
    }),
  );
  const r = run('scripts/copy/validate.mjs', { BTF_COPY_OUT_DIR: out });
  assert.notEqual(r.status, 0);
  assert.match(
    r.stderr,
    /cdm-tour\/hero_heading \| \/canal-des-deux-mers\/ \| src\/pages\/canal-des-deux-mers\/index\.astro/,
  );
  assert.ok(!existsSync(join(out, 'approved-copy.generated.json')));
});

// ---- rendered pages (needs a normal build in dist/)
if (!existsSync(join(PATHS.dist, 'index.html'))) {
  results.push([false, 'rendered-page tests need dist/ from "npm run build" (run it first)']);
} else {
  const dir = tmp();
  const distCopy = join(dir, 'dist');
  cpSync(PATHS.dist, distCopy, { recursive: true });
  // A validated fixture artifact (the checked-in snapshot of the current site copy) made in a temp folder.
  const fixtureOut = join(dir, 'fixture-out');
  const syncResult = run('scripts/copy/sync.mjs', { BTF_COPY_OUT_DIR: fixtureOut, BTF_COPY_FIXTURE: '1' });
  const validateResult = run('scripts/copy/validate.mjs', { BTF_COPY_OUT_DIR: fixtureOut });
  assert.equal(syncResult.status, 0, syncResult.stderr);
  assert.equal(validateResult.status, 0, validateResult.stderr);
  const fixtureArtifact = join(fixtureOut, 'approved-copy.generated.json');
  const baseArtifact = JSON.parse(readFileSync(fixtureArtifact, 'utf8'));
  const withArtifact = (mutate) => {
    const a = structuredClone(baseArtifact);
    mutate(a);
    const file = join(dir, `artifact-${Math.random().toString(36).slice(2)}.json`);
    writeFileSync(file, JSON.stringify(a));
    return file;
  };
  const verify = (artifact, distDir = distCopy, extraEnv = {}) =>
    run('scripts/copy/verify-rendered.mjs', extraEnv, ['--artifact', artifact, '--dist', distDir]);

  await test('rendered check passes: the built site matches the snapshot of its current copy', () => {
    const r = verify(fixtureArtifact);
    assert.equal(r.status, 0, r.stderr);
  });
  await test('rendered check FAILS when approved copy differs from the page (mismatch)', () => {
    const r = verify(withArtifact((a) => (a.fields['home/hero_heading'] = 'A different heading')));
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /home\/hero_heading/);
  });
  await test('rendered check FAILS when a required field is missing from the approved copy', () => {
    const r = verify(withArtifact((a) => delete a.fields['about/who_body']));
    assert.notEqual(r.status, 0);
    assert.match(
      r.stderr,
      /about\/who_body \| \/about\/ \| src\/pages\/about\/index\.astro \| required field is missing/,
    );
  });
  await test('rendered check FAILS on public text that has no approved field', () => {
    const copy = join(dir, 'dist-injected');
    cpSync(distCopy, copy, { recursive: true });
    const file = join(copy, 'about', 'index.html');
    writeFileSync(
      file,
      readFileSync(file, 'utf8').replace(
        '</main>',
        '<p>An unapproved promise: free bikes for everyone.</p></main>',
      ),
    );
    const r = verify(fixtureArtifact, copy);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /uncovered text.*\/about\/.*unapprovedpromise/is);
  });
  await test('rendered check FAILS on image alt text that has no approved field', () => {
    const copy = join(dir, 'dist-alt');
    cpSync(distCopy, copy, { recursive: true });
    const file = join(copy, 'index.html');
    writeFileSync(
      file,
      readFileSync(file, 'utf8').replace('</main>', '<img src="x.jpg" alt="Free unapproved caption"></main>'),
    );
    const r = verify(fixtureArtifact, copy);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /uncovered alt text/);
  });
  await test('rendered check FAILS when a page title or description differs from the approved copy', () => {
    const r = verify(withArtifact((a) => (a.fields['tours/seo_title'] = 'A different title')));
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /tours\/seo_title/);
  });

  // The production assertion, in a temp output folder so real artifacts are never touched.
  const gate = (mutate, { skipStamp = false, env: extra = {} } = {}) => {
    const out = tmp();
    const artifact = structuredClone(baseArtifact);
    // pretend this snapshot came from the Sheet, fetched just before the dist copy was built
    const distTime = new Date();
    artifact.source = 'sheet';
    artifact.sheetTitle = SHEET_TITLE;
    artifact.fetchedAt = new Date(distTime.getTime() - 5000).toISOString();
    mutate?.(artifact);
    writeFileSync(join(out, 'approved-copy.generated.json'), JSON.stringify(artifact));
    utimesSync(join(distCopy, 'index.html'), distTime, distTime);
    const env = { BTF_COPY_OUT_DIR: out, BTF_COPY_DIST_DIR: distCopy, ...extra };
    const verified = run('scripts/copy/verify-rendered.mjs', env);
    if (skipStamp) run('scripts/copy/sync.mjs', { BTF_COPY_OUT_DIR: out, CI: 'true' }); // sync deletes artifacts; re-write below
    if (skipStamp) writeFileSync(join(out, 'approved-copy.generated.json'), JSON.stringify(artifact));
    return {
      verified,
      result: run('scripts/copy/assert-deployable.mjs', { ...env, BTF_DEPLOY_ENV: 'production' }),
    };
  };
  await test('PRODUCTION GATE can pass: a current Sheet snapshot that matches the built pages is deployable', () => {
    const { verified, result } = gate();
    assert.equal(verified.status, 0, verified.stderr);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /predeploy OK/);
  });
  await test('PRODUCTION GATE BLOCKS when the Sheet copy does not match the pages', () => {
    const { verified, result } = gate(
      (a) => (a.fields['resources/page_heading'] = 'Something the Sheet changed'),
    );
    assert.notEqual(verified.status, 0);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /predeploy BLOCKED/);
  });
  await test('PRODUCTION GATE BLOCKS fixture copy', () => {
    const { result } = gate((a) => (a.source = 'fixture'));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /is "fixture", not "sheet"/);
  });
  await test('PRODUCTION GATE BLOCKS a Sheet snapshot older than an hour', () => {
    const { result } = gate((a) => (a.fetchedAt = new Date(Date.now() - 2 * 3600 * 1000).toISOString()));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /more than an hour old/);
  });
  await test('PRODUCTION GATE BLOCKS when the rendered-page check has not passed', () => {
    const { result } = gate(undefined, { skipStamp: true });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /rendered-page check has not passed/);
  });
  await test('PRODUCTION GATE BLOCKS when BTF_DEPLOY_ENV is not production', () => {
    const r = run('scripts/copy/assert-deployable.mjs', {});
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /BTF_DEPLOY_ENV is not "production"/);
  });
}

const failed = results.filter((r) => !r[0]);
for (const [ok, name] of results) console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
console.log(`\ncopy:test  ${results.length - failed.length} passed, ${failed.length} failed`);
process.exit(failed.length ? 1 : 0);
