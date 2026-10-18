import { existsSync, lstatSync, readFileSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

// Release-worktree mode (opt-in): set BTF_RELEASE_WORKTREE to the absolute path of a
// registered git worktree of the canonical repository. The opt-in alone is never accepted;
// every Git-metadata check below must also pass for the current directory. See
// docs/CANONICAL_ROOT_GUARD.md.
const RELEASE_ENV = 'BTF_RELEASE_WORKTREE';

const root = resolve('.');
if (!existsSync('.btf-canonical-root.json')) throw new Error('Canonical-root marker is missing.');
const marker = JSON.parse(readFileSync('.btf-canonical-root.json', 'utf8'));
const ci = Boolean(process.env.CI || process.env.GITHUB_ACTIONS || process.env.GITLAB_CI || process.env.BUILDKITE || process.env.CF_PAGES);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const gitIn = (dir, ...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' }).trim();
const normalize = (url) => url.replace(/\.git$/, '');
if (root.includes('/99_ARCHIVE/') || root.includes('btf-migration')) throw new Error('Archived BTF migration directories cannot be build roots.');

function verifyReleaseWorktree() {
  const declared = process.env[RELEASE_ENV];
  if (!declared) throw new Error(`Wrong local root: ${root}. Use ${marker.canonicalLocalRoot}.`);
  if (!declared.startsWith('/')) throw new Error(`${RELEASE_ENV} must be an absolute path.`);
  const here = realpathSync(root);
  if (realpathSync(declared) !== here) throw new Error(`${RELEASE_ENV} does not name the current directory.`);
  if (!existsSync(marker.canonicalLocalRoot)) throw new Error('Canonical checkout is not present; release worktree cannot be verified.');
  const canonical = realpathSync(marker.canonicalLocalRoot);
  if (canonical === here) throw new Error('Current directory is the canonical checkout; release-worktree mode does not apply.');

  // A registered worktree has a `.git` file pointing into the canonical repository. A copied
  // folder or a separate clone has a `.git` directory (or no `.git`).
  const dotGit = resolve(root, '.git');
  if (!existsSync(dotGit) || !lstatSync(dotGit).isFile()) throw new Error('Not a registered worktree: .git is not a worktree pointer file (copied folder or clone).');
  const pointer = readFileSync(dotGit, 'utf8').match(/^gitdir:\s*(.+)$/m);
  if (!pointer) throw new Error('Not a registered worktree: .git pointer is malformed.');

  const worktreeGitDir = realpathSync(resolve(root, pointer[1].trim()));
  const commonFromWorktree = realpathSync(resolve(root, gitIn(root, 'rev-parse', '--git-common-dir')));
  const commonFromCanonical = realpathSync(resolve(canonical, gitIn(canonical, 'rev-parse', '--git-common-dir')));
  if (commonFromWorktree !== commonFromCanonical) throw new Error('Common Git directory differs from the canonical repository.');
  if (worktreeGitDir === commonFromCanonical) throw new Error('Current directory is the main working tree, not a linked worktree.');
  if (!worktreeGitDir.startsWith(commonFromCanonical + '/worktrees/')) throw new Error('Worktree metadata is not under the canonical repository.');

  // The canonical repository must list this exact directory as a registered worktree.
  const listing = gitIn(canonical, 'worktree', 'list', '--porcelain').split(/\n\n+/);
  const entry = listing
    .map((block) => Object.fromEntries(block.split('\n').map((line) => line.split(/ (.*)/s).slice(0, 2))))
    .find((e) => e.worktree && existsSync(e.worktree) && realpathSync(e.worktree) === here);
  if (!entry) throw new Error('Directory is not registered in the canonical repository worktree list.');
  if (entry.prunable !== undefined) throw new Error('Registered worktree is prunable; it cannot be verified.');

  // Repository identity, from the shared config.
  const remote = gitIn(root, 'config', '--get', 'remote.origin.url');
  if (normalize(remote) !== normalize(marker.githubRemote)) throw new Error('Origin does not match the canonical remote.');

  // The checked-out state must be exactly what the registry records, with a clean tree.
  const sha = gitIn(root, 'rev-parse', 'HEAD');
  const branch = gitIn(root, 'branch', '--show-current');
  if (sha !== entry.HEAD) throw new Error('Worktree HEAD does not match the registered worktree HEAD.');
  if (entry.branch !== `refs/heads/${branch}`) throw new Error('Worktree branch does not match the registered branch.');
  if (gitIn(root, 'status', '--porcelain') !== '') throw new Error('Release worktree has uncommitted changes; commit or discard them before the gate.');
  const featureOk = /^feature\/[a-z0-9][a-z0-9._/-]*$/.test(branch);
  const mainOk = branch === marker.developmentBranch && sha === gitIn(root, 'rev-parse', 'refs/remotes/origin/main');
  if (!featureOk && !mainOk) throw new Error(`Release worktree branch is not allowed: ${branch}.`);

  console.log(`canonical-root: PASS (release worktree) worktree=${here} common=${commonFromCanonical} branch=${branch} sha=${sha}`);
  return { here, branch, sha };
}

if (!ci && root !== marker.canonicalLocalRoot) verifyReleaseWorktree();
for (const path of ['src/layouts/BaseLayout.astro', 'src/styles/global.css', 'astro.config.mjs']) if (!existsSync(path)) throw new Error(`Native Astro structure is missing ${path}.`);
if (!readFileSync('src/layouts/BaseLayout.astro', 'utf8').includes('global.css')) throw new Error('BaseLayout.astro must import src/styles/global.css.');
if (/publicDir\s*:\s*['\"]site/.test(readFileSync('astro.config.mjs', 'utf8'))) throw new Error('Framer wrapper configuration serving site/ is forbidden.');
if (!ci) {
  const actualRemote = git('remote', 'get-url', 'origin');
  if (normalize(actualRemote) !== normalize(marker.githubRemote)) throw new Error('Origin does not match the canonical remote.');
}
const branch = process.env.CF_PAGES_BRANCH || git('branch', '--show-current');
const featureBranch = /^feature\/[a-z0-9][a-z0-9._/-]*$/.test(branch);
if (!ci && branch !== marker.developmentBranch && !featureBranch) throw new Error(`Wrong development branch: ${branch}.`);
if (ci && ![marker.developmentBranch, marker.productionBranch].includes(branch) && !featureBranch) throw new Error(`CI branch is not authorized: ${branch}.`);
console.log(`canonical-root: PASS (${marker.architecture})`);
