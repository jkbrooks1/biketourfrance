import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { HEADERS, PATHS, ROOT, loadManifest, loadRules, validateGrid } from './lib.mjs';

const rows = JSON.parse(readFileSync(PATHS.fixture, 'utf8'));
const grid = (value) => [HEADERS, ...value];
const manifest = loadManifest();
const rules = loadRules();
const checks = [];
function check(name, fn) { try { fn(); checks.push([true, name]); } catch (error) { checks.push([false, `${name}: ${error.message}`]); } }
function run(script, env = {}, args = []) { return spawnSync(process.execPath, [join(ROOT, script), ...args], { cwd: ROOT, encoding: 'utf8', env: { PATH: process.env.PATH, HOME: '/nonexistent', ...env } }); }
check('fixture is structurally valid', () => assert.equal(validateGrid(grid(rows), manifest, rules).errors.length, 0));
check('missing approved field fails closed', () => assert.match(JSON.stringify(validateGrid(grid(rows.filter(([f]) => f !== '/hero/heading')), manifest, rules).errors), /required field is missing/));
check('duplicate approved field fails closed', () => assert.match(JSON.stringify(validateGrid(grid([...rows, rows[3]]), manifest, rules).errors), /duplicate field/));
check('unknown approved field fails closed', () => assert.match(JSON.stringify(validateGrid(grid([...rows, ['/unknown/value', 'x']]), manifest, rules).errors), /unrecognized field/));
check('third Sheet column fails closed', () => { const bad = grid(rows); bad[1] = [...bad[1], 'x']; assert.match(JSON.stringify(validateGrid(bad, manifest, rules).errors), /exactly two columns/); });
check('fixture is refused in deployment contexts', () => assert.notEqual(run('scripts/copy/sync.mjs', { BTF_COPY_FIXTURE: '1', CI: 'true' }).status, 0));
check('missing credentials fail closed', () => assert.notEqual(run('scripts/copy/sync.mjs', { BTF_COPY_SHEET_ID: 'x', CI: 'true' }).status, 0));
check('rendered native site matches the local deterministic snapshot', () => { assert.equal(run('scripts/copy/sync.mjs', { BTF_COPY_FIXTURE: '1' }).status, 0); assert.equal(run('scripts/copy/validate.mjs').status, 0); assert.equal(run('scripts/copy/verify-rendered.mjs').status, 0); });
check('deliberate copy mismatch fails the rendered gate', () => { const dir = mkdtempSync(join(tmpdir(), 'btf-copy-')); const artifact = JSON.parse(readFileSync(PATHS.artifact, 'utf8')); artifact.fields['/hero/heading'] = 'Deliberate mismatch'; const file = join(dir, 'artifact.json'); writeFileSync(file, JSON.stringify(artifact)); assert.notEqual(run('scripts/copy/verify-rendered.mjs', {}, ['--artifact', file]).status, 0); });
for (const [ok, name] of checks) console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
const failed = checks.filter(([ok]) => !ok); console.log(`copy:test  ${checks.length - failed.length} passed, ${failed.length} failed`); if (failed.length) process.exit(1);
