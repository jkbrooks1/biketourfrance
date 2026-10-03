// Step 1 of the build: fetch the approved copy. Deletes any earlier artifact first, so a failed
// sync can never fall back to stale content. Sheet mode needs BTF_COPY_SHEET_ID and a read-only
// service account key (BTF_COPY_GOOGLE_SA_JSON). Fixture mode needs BTF_COPY_FIXTURE=1 and is refused
// in CI, on Cloudflare Pages, and whenever BTF_DEPLOY_ENV is set.
import { readFileSync } from 'node:fs';
import {
  CopyError,
  HEADERS,
  PATHS,
  cleanArtifacts,
  fail,
  readSheetGrid,
  resolveMode,
  writeJson,
} from './lib.mjs';

cleanArtifacts();
try {
  const { mode, deployEnv, inCI } = resolveMode();
  if (mode === 'fixture') {
    const rows = JSON.parse(readFileSync(PATHS.fixture, 'utf8'));
    writeJson(PATHS.rows, {
      source: 'fixture',
      title: 'fixture',
      tab: 'fixture',
      fetchedAt: new Date().toISOString(),
      grid: [HEADERS, ...rows],
    });
    console.warn(
      'copy:sync  FIXTURE MODE. Using copy/fixture/fixture-rows.json. This build is for local development only and cannot be deployed.',
    );
  } else {
    const { title, tab, grid } = await readSheetGrid(process.env, { inCI });
    writeJson(PATHS.rows, { source: 'sheet', title, tab, fetchedAt: new Date().toISOString(), grid });
    console.log(`copy:sync  read "${title}" (tab "${tab}"), ${Math.max(grid.length - 1, 0)} data rows`);
  }
} catch (error) {
  if (error instanceof CopyError)
    fail(`copy:sync FAILED. ${error.message}\nNo approved copy was fetched, so the build stops here.`);
  fail(
    `copy:sync FAILED with an unexpected error (${error?.name || 'Error'}). No approved copy was fetched.`,
  );
}
