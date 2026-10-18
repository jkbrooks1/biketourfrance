// Qualification tests for scripts/assert-canonical-root.mjs (release-worktree mode).
// Fixtures are created under FIXTURE_ROOT (default: a fresh directory in the OS temp folder).
// Fixtures are not deleted by these tests; the directory is printed so it can be kept as evidence.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, realpathSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const GUARD = resolve(dirname(fileURLToPath(import.meta.url)), '../assert-canonical-root.mjs');
const REMOTE = 'https://github.com/jkbrooks1/biketourfrance.git';
const FIXTURE_ROOT = process.env.FIXTURE_ROOT || mkdtempSync(join(tmpdir(), 'btf-guard-fixtures-'));
const CI_KEYS = ['CI', 'GITHUB_ACTIONS', 'GITLAB_CI', 'BUILDKITE', 'CF_PAGES', 'CF_PAGES_BRANCH', 'BTF_RELEASE_WORKTREE'];

const git = (cwd, ...args) =>
  execFileSync('git', ['-c', 'user.name=guard-test', '-c', 'user.email=guard-test@example.invalid', ...args], { cwd, encoding: 'utf8' }).trim();

function writeProject(dir, canonicalRoot) {
  mkdirSync(join(dir, 'src/layouts'), { recursive: true });
  mkdirSync(join(dir, 'src/styles'), { recursive: true });
  writeFileSync(join(dir, 'src/layouts/BaseLayout.astro'), "---\nimport '../styles/global.css';\n---\n<html></html>\n");
  writeFileSync(join(dir, 'src/styles/global.css'), 'body { margin: 0; }\n');
  writeFileSync(join(dir, 'astro.config.mjs'), 'export default {};\n');
  writeFileSync(
    join(dir, '.btf-canonical-root.json'),
    JSON.stringify({
      schemaVersion: 1,
      projectId: 'biketourfrance-native-astro',
      canonicalLocalRoot: canonicalRoot,
      developmentBranch: 'main',
      productionBranch: 'main',
      githubRemote: REMOTE,
      architecture: 'native-astro',
    }, null, 2) + '\n',
  );
}

// Runs the guard in cwd with an explicit environment. CI-related variables are removed so the
// tests always exercise the local (non-CI) path, whatever runner executes them.
function runGuard(cwd, releaseWorktree) {
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !CI_KEYS.includes(k)));
  if (releaseWorktree !== undefined) env.BTF_RELEASE_WORKTREE = releaseWorktree;
  const r = spawnSync('node', [GUARD], { cwd, env, encoding: 'utf8' });
  return { code: r.status, out: (r.stdout + r.stderr).trim() };
}

const results = [];
function record(name, expected, actual, code) {
  results.push({ name, expected, actual, code });
}

// --- fixtures ---------------------------------------------------------------
const base = mkdtempSync(join(FIXTURE_ROOT, 'run-'));
const canon = join(base, 'canonical');
const wt = join(base, 'release-worktree');
const copy = join(base, 'copied-folder');
const plain = join(base, 'plain-directory');
const unrelated = join(base, 'unrelated-repo');

mkdirSync(canon);
execFileSync('git', ['init', '-q', '-b', 'main', canon]);
const canonReal = realpathSync(canon);
writeProject(canon, canonReal);
git(canon, 'add', '-A');
git(canon, 'commit', '-q', '-m', 'fixture: canonical');
git(canon, 'remote', 'add', 'origin', REMOTE);
git(canon, 'branch', 'feature/guard-fixture');
git(canon, 'worktree', 'add', '-q', wt, 'feature/guard-fixture');
const wtReal = realpathSync(wt);

cpSync(wt, copy, { recursive: true });
mkdirSync(plain);
writeProject(plain, canonReal);
mkdirSync(unrelated);
execFileSync('git', ['init', '-q', '-b', 'main', unrelated]);
writeProject(unrelated, canonReal);
git(unrelated, 'add', '-A');
git(unrelated, 'commit', '-q', '-m', 'fixture: unrelated');
git(unrelated, 'remote', 'add', 'origin', 'https://github.com/example/unrelated.git');

// --- cases --------------------------------------------------------------------
test('1. default: unauthorized path is rejected with the original message', () => {
  const r = runGuard(wt, undefined);
  record('default rejection of unauthorized path (no opt-in)', 'exit 1, "Wrong local root"', r.out.includes('Wrong local root') ? 'Wrong local root' : r.out.slice(0, 120), r.code);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /Wrong local root/);
});

test('2. explicit: plain directory with opt-in is rejected', () => {
  const r = runGuard(plain, plain);
  record('plain directory with opt-in', 'exit 1, not a registered worktree', r.out.match(/Not a registered worktree[^\n]*/)?.[0] ?? r.out.slice(0, 120), r.code);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /Not a registered worktree/);
});

test('3. explicit: copied folder of a real worktree with opt-in is rejected', () => {
  const r = runGuard(copy, copy);
  record('copied folder of worktree with opt-in', 'exit 1, not registered or not a worktree', r.out.match(/(Not a registered worktree|not registered)[^\n]*/)?.[0] ?? r.out.slice(0, 120), r.code);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /Not a registered worktree|not registered/);
});

test('4. explicit: unrelated Git repository with opt-in is rejected', () => {
  const r = runGuard(unrelated, unrelated);
  record('unrelated Git repository with opt-in', 'exit 1, not a registered worktree', r.out.match(/Not a registered worktree[^\n]*/)?.[0] ?? r.out.slice(0, 120), r.code);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /Not a registered worktree/);
});

test('5. rejection when opt-in is absent (registered worktree, no env)', () => {
  const r = runGuard(wt, undefined);
  record('registered worktree without opt-in', 'exit 1, "Wrong local root"', r.out.includes('Wrong local root') ? 'Wrong local root' : r.out.slice(0, 120), r.code);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /Wrong local root/);
});

test('6. spoof: opt-in names a real worktree but the current directory is another folder', () => {
  const r = runGuard(copy, wt);
  record('opt-in names other worktree (spoof)', 'exit 1, does not name the current directory', r.out.match(/does not name the current directory/)?.[0] ?? r.out.slice(0, 120), r.code);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /does not name the current directory/);
});

test('7. positive: correctly registered release worktree with opt-in is accepted', () => {
  const sha = git(wt, 'rev-parse', 'HEAD');
  const r = runGuard(wt, wtReal);
  record('registered release worktree with opt-in', `exit 0, PASS with worktree, branch, sha=${sha.slice(0, 12)}`, r.out.split('\n').find((l) => l.includes('PASS')) ?? r.out.slice(0, 160), r.code);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /canonical-root: PASS \(release worktree\)/);
  assert.ok(r.out.includes(`sha=${sha}`));
  assert.ok(r.out.includes('branch=feature/guard-fixture'));
});

test('8. preservation: uncommitted change in the release worktree is rejected', () => {
  writeFileSync(join(wt, 'dirty.txt'), 'dirty\n');
  const r = runGuard(wt, wtReal);
  record('dirty release worktree with opt-in', 'exit 1, uncommitted changes', r.out.match(/uncommitted changes[^\n]*/)?.[0] ?? r.out.slice(0, 120), r.code);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /uncommitted changes/);
  // The untracked fixture file is kept on purpose as evidence; it is not deleted.
});

test('9. preservation: existing branch check still applies in default mode', () => {
  git(canon, 'checkout', '-q', '-b', 'other/not-allowed');
  const r = runGuard(canon, undefined);
  record('default mode, disallowed branch', 'exit 1, Wrong development branch', r.out.match(/Wrong development branch[^\n]*/)?.[0] ?? r.out.slice(0, 120), r.code);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /Wrong development branch/);
  git(canon, 'checkout', '-q', 'main');
});

test('10. preservation: default canonical checkout still passes', () => {
  const r = runGuard(canon, undefined);
  record('default canonical checkout on main', 'exit 0, PASS (native-astro)', r.out.split('\n').pop(), r.code);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /canonical-root: PASS \(native-astro\)/);
});

test('report', () => {
  console.log('\nGUARD QUALIFICATION RESULTS');
  console.log(`fixtures kept at: ${base}`);
  for (const r of results) {
    console.log(`- ${r.name}\n    expected: ${r.expected}\n    actual:   ${r.actual}\n    exit:     ${r.code}`);
  }
});
