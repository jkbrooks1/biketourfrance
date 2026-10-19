import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { HEADERS, PATHS, ROOT, loadManifest, loadRules, validateGrid } from './lib.mjs';
import { validateItineraryGrid } from './itinerary.mjs';

const rows = JSON.parse(readFileSync(PATHS.fixture, 'utf8'));
const grid = (value) => [HEADERS, ...value];
const manifest = loadManifest();
const rules = loadRules();
const checks = [];
function check(name, fn) { try { fn(); checks.push([true, name]); } catch (error) { checks.push([false, `${name}: ${error.message}`]); } }
function run(script, env = {}, args = []) { return spawnSync(process.execPath, [join(ROOT, script), ...args], { cwd: ROOT, encoding: 'utf8', env: { PATH: process.env.PATH, HOME: '/nonexistent', ...env } }); }
check('fixture is structurally valid', () => assert.equal(validateGrid(grid(rows), manifest, rules).errors.length, 0));
check('missing approved field fails closed', () => assert.match(JSON.stringify(validateGrid(grid(rows.filter(([f]) => f !== '/hero/heading')), manifest, rules).errors), /required field is missing/));
check('conflicting duplicate approved field fails closed', () => assert.match(JSON.stringify(validateGrid(grid([...rows, [rows[3][0], rows[3][1] + ' (changed)']]), manifest, rules).errors), /duplicate field/));
check('identical duplicate approved field is allowed with a warning', () => { const baseline = validateGrid(grid(rows), manifest, rules); const result = validateGrid(grid([...rows, rows[3]]), manifest, rules); assert.equal(result.errors.length, 0); assert.equal(result.warnings.length, baseline.warnings.length + 1); });
check('unknown approved field fails closed', () => assert.match(JSON.stringify(validateGrid(grid([...rows, ['/unknown/value', 'x']]), manifest, rules).errors), /unrecognized field/));
check('third Sheet column fails closed', () => { const bad = grid(rows); bad[1] = [...bad[1], 'x']; assert.match(JSON.stringify(validateGrid(bad, manifest, rules).errors), /exactly two columns/); });
check('fixture is refused in deployment contexts', () => assert.notEqual(run('scripts/copy/sync.mjs', { BTF_COPY_FIXTURE: '1', CI: 'true' }).status, 0));
check('missing credentials fail closed', () => assert.notEqual(run('scripts/copy/sync.mjs', { BTF_COPY_SHEET_ID: 'x', CI: 'true' }).status, 0));
check('rendered native site matches the local deterministic snapshot', () => { assert.equal(run('scripts/copy/sync.mjs', { BTF_COPY_FIXTURE: '1' }).status, 0); assert.equal(run('scripts/copy/validate.mjs').status, 0); assert.equal(run('scripts/copy/verify-rendered.mjs').status, 0); });
check('deliberate copy mismatch fails the rendered gate', () => { const dir = mkdtempSync(join(tmpdir(), 'btf-copy-')); const artifact = JSON.parse(readFileSync(PATHS.artifact, 'utf8')); artifact.fields['/hero/heading'] = 'Deliberate mismatch'; const file = join(dir, 'artifact.json'); writeFileSync(file, JSON.stringify(artifact)); assert.notEqual(run('scripts/copy/verify-rendered.mjs', {}, ['--artifact', file]).status, 0); });
// Guards the "no uncovered text" (page -> Sheet) check. Dropping a field that a page renders must
// fail the gate, because that page text then has no approved source. This check was once removed
// from verify-rendered.mjs while its header still claimed to enforce it, which let hardcoded copy
// ship for weeks (docs/2026-10-05_UNAPPROVED_COPY_AUDIT.md). This test exists so that cannot recur.
check('rendered text with no approved field fails the rendered gate', () => {
  const dir = mkdtempSync(join(tmpdir(), 'btf-copy-'));
  const artifact = JSON.parse(readFileSync(PATHS.artifact, 'utf8'));
  delete artifact.fields['/tours/heading_1'];
  const file = join(dir, 'artifact.json');
  writeFileSync(file, JSON.stringify(artifact));
  assert.notEqual(run('scripts/copy/verify-rendered.mjs', {}, ['--artifact', file]).status, 0);
});
// Itinerary (second governed tab) gates. Each case damages a copy of the artifact or of dist/ and requires
// the rendered gate to fail. The first run above leaves a valid fixture artifact in .copy/.
function artifactWith(change) {
  const dir = mkdtempSync(join(tmpdir(), 'btf-copy-'));
  const artifact = JSON.parse(readFileSync(PATHS.artifact, 'utf8'));
  change(artifact);
  const file = join(dir, 'artifact.json');
  writeFileSync(file, JSON.stringify(artifact));
  return file;
}
check('itinerary fixture is structurally valid', () => assert.equal(validateItineraryGrid(JSON.parse(readFileSync(PATHS.itineraryFixture, 'utf8'))).errors.length, 0));
check('lodging label key missing from the itinerary tab fails validation', () => { const bad = JSON.parse(readFileSync(PATHS.itineraryFixture, 'utf8')); const at = bad[0].indexOf('UI Copy Key'); const row = bad.find((r, i) => i > 0 && r[at] === 'Lodging Label'); row[at] = ''; assert.match(JSON.stringify(validateItineraryGrid(bad).errors), /required UI copy key \\"Lodging Label\\" is missing/); });
for (const key of ['Distance Unit', 'Elevation Unit']) {
  check(`${key} key missing from the itinerary tab fails validation`, () => { const bad = JSON.parse(readFileSync(PATHS.itineraryFixture, 'utf8')); const at = bad[0].indexOf('UI Copy Key'); const row = bad.find((r, i) => i > 0 && r[at] === key); row[at] = ''; assert.match(JSON.stringify(validateItineraryGrid(bad).errors), new RegExp(`required UI copy key \\\\"${key}\\\\" is missing`)); });
}
check('unit text that differs from the workbook fails the rendered gate', () => assert.notEqual(run('scripts/copy/verify-rendered.mjs', {}, ['--artifact', artifactWith((a) => { a.itinerary.distanceUnit = 'miles'; })]).status, 0));
check('lodging label missing from the approved artifact fails the rendered gate', () => assert.notEqual(run('scripts/copy/verify-rendered.mjs', {}, ['--artifact', artifactWith((a) => { a.itinerary.lodgingLabel = 'Invented label'; })]).status, 0));
check('itinerary row missing from the approved artifact fails the rendered gate', () => assert.notEqual(run('scripts/copy/verify-rendered.mjs', {}, ['--artifact', artifactWith((a) => a.itinerary.days.splice(6, 1))]).status, 0));
check('itinerary text that differs from the workbook fails the rendered gate', () => assert.notEqual(run('scripts/copy/verify-rendered.mjs', {}, ['--artifact', artifactWith((a) => { a.itinerary.days[2].description = 'Deliberate mismatch ' + a.itinerary.days[2].description; })]).status, 0));
check('missing itinerary in the approved artifact fails the rendered gate', () => assert.notEqual(run('scripts/copy/verify-rendered.mjs', {}, ['--artifact', artifactWith((a) => { delete a.itinerary; })]).status, 0));
check('rendered itinerary prose absent from the workbook fails the rendered gate', () => {
  const dir = mkdtempSync(join(tmpdir(), 'btf-dist-'));
  cpSync(PATHS.dist, dir, { recursive: true });
  const file = join(dir, 'index.html');
  const first = JSON.parse(readFileSync(PATHS.artifact, 'utf8')).itinerary.days[0].highlights[0].note;
  writeFileSync(file, readFileSync(file, 'utf8').replace(first, 'Invented itinerary prose that the workbook does not contain.'));
  assert.notEqual(run('scripts/copy/verify-rendered.mjs', {}, ['--dist', dir]).status, 0);
});
check('retired Ride Highlights text on a page fails the rendered gate', () => {
  const dir = mkdtempSync(join(tmpdir(), 'btf-dist-'));
  cpSync(PATHS.dist, dir, { recursive: true });
  const file = join(dir, 'index.html');
  writeFileSync(file, readFileSync(file, 'utf8').replace('</body>', '<!-- Ride Highlights --></body>'));
  assert.notEqual(run('scripts/copy/verify-rendered.mjs', {}, ['--dist', dir]).status, 0);
});
check('unmodified dist still passes after the itinerary cases', () => assert.equal(run('scripts/copy/verify-rendered.mjs').status, 0));
for (const [ok, name] of checks) console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
const failed = checks.filter(([ok]) => !ok); console.log(`copy:test  ${checks.length - failed.length} passed, ${failed.length} failed`); if (failed.length) process.exit(1);
