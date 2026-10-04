import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve('.');
if (!existsSync('.btf-canonical-root.json')) throw new Error('Canonical-root marker is missing.');
const marker = JSON.parse(readFileSync('.btf-canonical-root.json', 'utf8'));
const ci = Boolean(process.env.CI || process.env.GITHUB_ACTIONS || process.env.GITLAB_CI || process.env.BUILDKITE);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
if (root.includes('/99_ARCHIVE/') || root.includes('btf-migration')) throw new Error('Archived BTF migration directories cannot be build roots.');
if (!ci && root !== marker.canonicalLocalRoot) throw new Error(`Wrong local root: ${root}. Use ${marker.canonicalLocalRoot}.`);
for (const path of ['src/layouts/BaseLayout.astro', 'src/styles/global.css', 'astro.config.mjs']) if (!existsSync(path)) throw new Error(`Native Astro structure is missing ${path}.`);
if (!readFileSync('src/layouts/BaseLayout.astro', 'utf8').includes('global.css')) throw new Error('BaseLayout.astro must import src/styles/global.css.');
if (/publicDir\s*:\s*['\"]site/.test(readFileSync('astro.config.mjs', 'utf8'))) throw new Error('Framer wrapper configuration serving site/ is forbidden.');
if (git('remote', 'get-url', 'origin') !== marker.githubRemote) throw new Error('Origin does not match the canonical remote.');
const branch = git('branch', '--show-current');
if (!ci && branch !== marker.developmentBranch) throw new Error(`Wrong development branch: ${branch}.`);
if (ci && ![marker.developmentBranch, marker.productionBranch].includes(branch)) throw new Error(`CI branch is not authorized: ${branch}.`);
console.log(`canonical-root: PASS (${marker.architecture})`);
