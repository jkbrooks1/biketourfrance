// Proves the approved-copy gate fails closed. Run with `npm run copy:test` (needs a fixture build in
// dist/ for the rendered-page tests: `npm run build:fixture` first). Tests use temp folders and never
// touch real credentials. The RSA key below is generated in memory for the fake Google sign-in.
import assert from 'node:assert/strict';
import { generateKeyPairSync, createVerify } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  CopyError,
  HEADERS,
  PATHS,
  ROOT,
  SHEET_TITLE,
  loadManifest,
  loadRules,
  readSheetGrid,
  resolveMode,
  validateGrid,
} from './lib.mjs';
import { checkCodeReferences } from './code-references.mjs';

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
    env: { PATH: process.env.PATH, HOME: process.env.HOME, ...env },
    encoding: 'utf8',
    cwd: ROOT,
  });
const tmp = () => mkdtempSync(join(tmpdir(), 'btf-copy-test-'));
const SECRET_MARKER = /BEGIN (RSA )?PRIVATE KEY|private_key|access_token/;

// ---- validation: the sheet side
await test('valid fixture rows pass validation', () =>
  assert.equal(validateGrid(grid(fixtureRows), manifest, rules).errors.length, 0));

await test('MISSING required field is rejected, naming field, route and code location', () => {
  const rows = fixtureRows.filter((r) => r[0] !== 'home/hero_heading');
  const text = messages(validateGrid(grid(rows), manifest, rules));
  assert.match(
    text,
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
  const required = manifest.filter((m) => m.required).length;
  assert.equal(result.errors.filter((e) => /required field is missing/.test(e.issue)).length, required);
});

await test('wrong header names are rejected', () => {
  const bad = [['field', 'text'], ...fixtureRows];
  assert.match(
    messages(validateGrid(bad, manifest, rules)),
    /header row.*exactly "page\/field_name" and "copy"/,
  );
});

await test('a third column is rejected (exactly two columns)', () => {
  const bad = grid(fixtureRows);
  bad[3] = [...bad[3], 'status: approved'];
  assert.match(messages(validateGrid(bad, manifest, rules)), /exactly two columns/);
});

await test('a dollar price in copy is rejected', () => {
  const rows = fixtureRows.map((r) => (r[0] === 'tours/group_body' ? [r[0], r[1] + ' From $3,500.'] : r));
  assert.match(messages(validateGrid(grid(rows), manifest, rules)), /tours\/group_body .* dollar amount/);
});

await test('consent-by-use wording and a broken link target are rejected', () => {
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

await test('manifest/code check flags an unused manifest field and an unknown code field', () => {
  const extra = [
    ...manifest,
    { field: 'home/phantom_field', route: '/', required: true, codeLocation: 'src/pages/index.astro' },
  ];
  assert.match(
    checkCodeReferences(extra)
      .map((e) => `${e.field} ${e.issue}`)
      .join('\n'),
    /home\/phantom_field/,
  );
  assert.match(
    checkCodeReferences(manifest.slice(1))
      .map((e) => `${e.field} ${e.issue}`)
      .join('\n'),
    /not in copy\/field-manifest\.json/,
  );
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
    readSheetGrid({ BTF_COPY_SHEET_ID: 'abc' }),
    (e) => e instanceof CopyError && /No Google credential/.test(e.message) && !SECRET_MARKER.test(e.message),
  );
  await assert.rejects(readSheetGrid({}), /BTF_COPY_SHEET_ID is not set/);
  await assert.rejects(
    readSheetGrid({ BTF_COPY_SHEET_ID: 'abc', BTF_COPY_GOOGLE_SA_JSON: '{not json' }),
    (e) => /not valid JSON/.test(e.message) && !e.message.includes('{not json'),
  );
});

// ---- the Google path, end to end, against a fake Google
const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const fakeAccount = JSON.stringify({
  type: 'service_account',
  client_email: 'reader@test.invalid',
  private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }),
});
const fakeGoogle = ({ title = SHEET_TITLE, status = 200, values = grid(fixtureRows) } = {}) => {
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    calls.push(String(url));
    const ok = (body) => ({ ok: true, status: 200, json: async () => body });
    if (String(url).startsWith('https://oauth2.googleapis.com/token')) {
      const assertion = new URLSearchParams(String(init.body)).get('assertion');
      const [h, c, sig] = assertion.split('.');
      const verifier = createVerify('RSA-SHA256').update(`${h}.${c}`);
      assert.ok(verifier.verify(publicKey, Buffer.from(sig, 'base64url')), 'JWT signature did not verify');
      assert.equal(
        JSON.parse(Buffer.from(c, 'base64url')).scope,
        'https://www.googleapis.com/auth/spreadsheets.readonly',
      );
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

await test('sheet path: signs a read-only JWT, reads A:Z, returns the grid', async () => {
  const g = fakeGoogle();
  const result = await readSheetGrid(env, { fetchImpl: g.fetchImpl });
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
    readSheetGrid(env, { fetchImpl: fakeGoogle({ status: 403 }).fetchImpl }),
    (e) => /HTTP 403/.test(e.message) && /read-only/.test(e.message) && !SECRET_MARKER.test(e.message),
  );
  await assert.rejects(readSheetGrid(env, { fetchImpl: fakeGoogle({ status: 404 }).fetchImpl }), /HTTP 404/);
});
await test('sheet path: a spreadsheet with the wrong title is rejected', async () => {
  await assert.rejects(
    readSheetGrid(env, { fetchImpl: fakeGoogle({ title: 'Some other sheet' }).fetchImpl }),
    /not "BTF_Approved_Site_Copy"/,
  );
});

// ---- scripts as the build runs them
await test('copy:sync in sheet mode without credentials exits non-zero and leaves NO artifact', () => {
  const out = tmp();
  const r = run('scripts/copy/sync.mjs', { BTF_COPY_OUT_DIR: out, BTF_COPY_SHEET_ID: 'abc' });
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
  const r = run('scripts/copy/sync.mjs', { BTF_COPY_OUT_DIR: out });
  assert.notEqual(r.status, 0);
  assert.ok(!existsSync(join(out, 'approved-copy.generated.json')));
});

await test('copy:validate without fetched rows fails and writes no artifact', () => {
  const out = tmp();
  const r = run('scripts/copy/validate.mjs', { BTF_COPY_OUT_DIR: out });
  assert.notEqual(r.status, 0);
  assert.ok(!existsSync(join(out, 'approved-copy.generated.json')));
});

await test('copy:validate on a sheet with a missing field fails with a mismatch report and no artifact', () => {
  const out = tmp();
  const rows = fixtureRows.filter((r) => r[0] !== 'cdm-tour/whats_included');
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
    /cdm-tour\/whats_included \| \/canal-des-deux-mers\/ \| src\/pages\/canal-des-deux-mers\/index\.astro/,
  );
  assert.ok(!existsSync(join(out, 'approved-copy.generated.json')));
});

// ---- rendered pages (needs a fixture build in dist/)
const haveBuild = existsSync(join(PATHS.dist, 'index.html')) && existsSync(PATHS.artifact);
const walk = (dir) =>
  readdirSync(dir).flatMap((n) =>
    statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)],
  );
if (!haveBuild) {
  results.push([
    false,
    'rendered-page tests need dist/ and .copy/ from "npm run build:fixture" (run it first)',
  ]);
} else {
  const dir = tmp();
  cpSync(PATHS.dist, join(dir, 'dist'), { recursive: true });
  const artifactCopy = JSON.parse(readFileSync(PATHS.artifact, 'utf8'));
  const withArtifact = (mutate) => {
    const a = structuredClone(artifactCopy);
    mutate(a);
    const file = join(dir, `artifact-${Math.random().toString(36).slice(2)}.json`);
    writeFileSync(file, JSON.stringify(a));
    return file;
  };
  const verify = (artifact, distDir = join(dir, 'dist')) =>
    run('scripts/copy/verify-rendered.mjs', {}, ['--artifact', artifact, '--dist', distDir]);

  await test('rendered check passes on an untouched fixture build', () => {
    const r = verify(PATHS.artifact);
    assert.equal(r.status, 0, r.stderr);
  });
  await test('rendered check FAILS when approved copy changed after the build (mismatch)', () => {
    const r = verify(withArtifact((a) => (a.fields['home/hero_heading'] = 'A different heading')));
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /home\/hero_heading/);
  });
  await test('rendered check FAILS when a required field is missing from the artifact', () => {
    const r = verify(withArtifact((a) => delete a.fields['about/who_body']));
    assert.notEqual(r.status, 0);
    assert.match(
      r.stderr,
      /about\/who_body \| \/about\/ \| src\/pages\/about\/index\.astro \| required field is missing/,
    );
  });
  await test('rendered check FAILS on public text that has no approved field', () => {
    const copy = join(dir, 'dist-injected');
    cpSync(join(dir, 'dist'), copy, { recursive: true });
    const file = join(copy, 'about', 'index.html');
    writeFileSync(
      file,
      readFileSync(file, 'utf8').replace(
        '</main>',
        '<p>An unapproved promise: free bikes for everyone.</p></main>',
      ),
    );
    const r = verify(PATHS.artifact, copy);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /uncovered text.*\/about\/.*unapproved promise/s);
  });
  await test('rendered check FAILS on image alt text that has no approved field', () => {
    const copy = join(dir, 'dist-alt');
    cpSync(join(dir, 'dist'), copy, { recursive: true });
    const file = join(copy, 'index.html');
    writeFileSync(
      file,
      readFileSync(file, 'utf8').replace('</main>', '<img src="x.jpg" alt="Free unapproved caption"></main>'),
    );
    const r = verify(PATHS.artifact, copy);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /uncovered alt text/);
  });
  await test('rendered check FAILS when pages were built from a different artifact', () => {
    const r = verify(withArtifact((a) => (a.fields['site/footer_copyright'] = '© 2027 BikeTourFrance.net')));
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /not built from this approved copy artifact|footer_copyright/);
  });
  await test('PRODUCTION GATE: assert-deployable BLOCKS a fixture build', () => {
    const r = run('scripts/copy/assert-deployable.mjs', { BTF_DEPLOY_ENV: 'production' });
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /predeploy BLOCKED/);
    assert.match(r.stderr, /source is "fixture"|not marked as built from the sheet|fixture banner/);
  });
  await test('PRODUCTION GATE: assert-deployable BLOCKS when the environment is not production', () => {
    const r = run('scripts/copy/assert-deployable.mjs', {});
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /BTF_DEPLOY_ENV is not "production"/);
  });
}

const failed = results.filter((r) => !r[0]);
for (const [ok, name] of results) console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
console.log(`\ncopy:test  ${results.length - failed.length} passed, ${failed.length} failed`);
process.exit(failed.length ? 1 : 0);
