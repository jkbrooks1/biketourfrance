// Final step of `npm run predeploy:approved-copy`. After the production-mode check, prove that this
// dist/ was compared against a current snapshot of the approved Sheet and matched it: the artifact came
// from the Sheet (not fixture copy), it is fresh, the rendered-page check wrote its stamp for this exact
// artifact, and dist/ was built after the artifact was fetched. Exits non-zero otherwise.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { PATHS, SHEET_TITLE, fail } from './lib.mjs';

const reasons = [];
if ((process.env.BTF_DEPLOY_ENV || '').toLowerCase() !== 'production')
  reasons.push('BTF_DEPLOY_ENV is not "production"');
if (process.env.BTF_COPY_FIXTURE === '1') reasons.push('BTF_COPY_FIXTURE=1 is set');
if (!existsSync(PATHS.artifact)) reasons.push('the approved copy artifact is missing');
if (!existsSync(PATHS.stamp)) reasons.push('the rendered-page check has not passed for this artifact');
const entry = join(PATHS.dist, 'index.html');
if (!existsSync(entry)) reasons.push('dist/ is missing');

if (!reasons.length) {
  const artifact = JSON.parse(readFileSync(PATHS.artifact, 'utf8'));
  const stamp = JSON.parse(readFileSync(PATHS.stamp, 'utf8'));
  if (artifact.source !== 'sheet')
    reasons.push(`the approved copy source is "${artifact.source}", not "sheet"`);
  if (artifact.sheetTitle !== SHEET_TITLE) reasons.push(`the artifact did not come from ${SHEET_TITLE}`);
  if (Date.now() - Date.parse(artifact.fetchedAt) > 60 * 60 * 1000)
    reasons.push('the Sheet snapshot is more than an hour old');
  if (stamp.source !== 'sheet' || stamp.fetchedAt !== artifact.fetchedAt)
    reasons.push('the rendered-page check was run against a different snapshot');
  if (statSync(entry).mtimeMs < Date.parse(artifact.fetchedAt))
    reasons.push('dist/ is older than the Sheet snapshot (build it after the sync)');
}

if (reasons.length)
  fail(
    `predeploy BLOCKED. This build must not be deployed:\n${[...new Set(reasons)].map((r) => `  - ${r}`).join('\n')}`,
  );
console.log(`predeploy OK: dist/ matches a current snapshot of ${SHEET_TITLE} and is deployable.`);
