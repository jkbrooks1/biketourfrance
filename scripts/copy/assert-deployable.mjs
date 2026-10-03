// Final production gate (npm run predeploy). After a production-mode build, prove that the output
// came from the approved sheet: not fixture copy, a fresh and validated artifact, and pages whose
// head records the sheet as the copy source. Exits non-zero otherwise.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { PATHS, fail } from './lib.mjs';

const reasons = [];
if ((process.env.BTF_DEPLOY_ENV || '').toLowerCase() !== 'production')
  reasons.push('BTF_DEPLOY_ENV is not "production"');
if (process.env.BTF_COPY_FIXTURE === '1') reasons.push('BTF_COPY_FIXTURE=1 is set');
if (!existsSync(PATHS.artifact)) reasons.push('the approved copy artifact is missing');
if (!existsSync(PATHS.dist)) reasons.push('dist/ is missing');

if (!reasons.length) {
  const artifact = JSON.parse(readFileSync(PATHS.artifact, 'utf8'));
  if (artifact.source !== 'sheet')
    reasons.push(`the approved copy source is "${artifact.source}", not "sheet"`);
  if (artifact.sheetTitle !== 'BTF_Approved_Site_Copy')
    reasons.push('the artifact did not come from BTF_Approved_Site_Copy');
  if (Date.now() - Date.parse(artifact.fetchedAt) > 60 * 60 * 1000)
    reasons.push('the approved copy was fetched more than an hour ago');
  const id = createHash('sha256').update(JSON.stringify(artifact.fields)).digest('hex').slice(0, 16);
  const walk = (dir) =>
    readdirSync(dir).flatMap((n) =>
      statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)],
    );
  const html = walk(PATHS.dist).filter((f) => f.endsWith('.html'));
  if (!html.length) reasons.push('dist/ has no pages');
  for (const file of html) {
    const text = readFileSync(file, 'utf8');
    if (!text.includes('name="btf-copy-source" content="sheet"'))
      reasons.push(`${file.replace(PATHS.dist, 'dist')} is not marked as built from the sheet`);
    if (!text.includes(`name="btf-copy-id" content="${id}"`))
      reasons.push(`${file.replace(PATHS.dist, 'dist')} was not built from the current artifact`);
    if (text.includes('FIXTURE COPY'))
      reasons.push(`${file.replace(PATHS.dist, 'dist')} contains the fixture banner`);
  }
}

if (reasons.length)
  fail(
    `predeploy BLOCKED. This build must not be deployed:\n${[...new Set(reasons)].map((r) => `  - ${r}`).join('\n')}`,
  );
console.log(
  'predeploy OK: dist/ was built from the validated BTF_Approved_Site_Copy sheet and is deployable.',
);
