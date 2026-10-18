// Step 1 of the build: fetch the approved copy. Deletes any earlier artifact first, so a failed
// sync can never fall back to stale content. Sheet mode needs BTF_COPY_SHEET_ID and a read-only
// service account key (BTF_COPY_GOOGLE_SA_JSON). Fixture mode needs BTF_COPY_FIXTURE=1 and is refused
// in CI, on Cloudflare Pages, and whenever BTF_DEPLOY_ENV is set.
//
// Two governed tabs of BTF_Approved_Site_Copy are read in one sync: "Approved Site Copy" (field/copy
// pairs) and "CDM_Itinerary_for_BTF_Site" (structured itinerary). Both must be read or the sync fails.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import {
  CopyError,
  HEADERS,
  PATHS,
  cleanArtifacts,
  fail,
  readItineraryGrid,
  readSheetGrid,
  resolveMode,
  writeJson,
} from './lib.mjs';

cleanArtifacts();
try {
  const { mode, deployEnv, inCI } = resolveMode();
  const fetchedAt = new Date().toISOString();
  if (mode === 'fixture') {
    const rows = JSON.parse(readFileSync(PATHS.fixture, 'utf8'));
    writeJson(PATHS.rows, {
      source: 'fixture',
      title: 'fixture',
      tab: 'fixture',
      fetchedAt,
      grid: [HEADERS, ...rows],
    });
    writeJson(PATHS.itineraryRows, {
      source: 'fixture',
      title: 'fixture',
      tab: 'fixture',
      fetchedAt,
      grid: JSON.parse(readFileSync(PATHS.itineraryFixture, 'utf8')),
    });
    console.warn(
      'copy:sync  FIXTURE MODE. Using copy/fixture/fixture-rows.json and copy/fixture/cdm-itinerary-rows.json. This build is for local development only and cannot be deployed.',
    );
  } else {
    const { title, tab, grid } = await readSheetGrid(process.env, { inCI });
    writeJson(PATHS.rows, { source: 'sheet', title, tab, fetchedAt, grid });
    console.log(`copy:sync  read "${title}" (tab "${tab}"), ${Math.max(grid.length - 1, 0)} data rows`);
    const itinerary = await readItineraryGrid(process.env, { inCI });
    writeJson(PATHS.itineraryRows, {
      source: 'sheet',
      title: itinerary.title,
      tab: itinerary.tab,
      fetchedAt,
      grid: itinerary.grid,
    });
    console.log(
      `copy:sync  read "${itinerary.title}" (tab "${itinerary.tab}"), ${Math.max(itinerary.grid.length - 1, 0)} data rows`,
    );
    // Keep the committed offline fixture equal to the last Sheet snapshot (as gallery:sync does for
    // the main fixture), so the scheduled sync can commit a changed itinerary.
    const fixtureText = JSON.stringify(itinerary.grid, null, 1) + '\n';
    if (!existsSync(PATHS.itineraryFixture) || readFileSync(PATHS.itineraryFixture, 'utf8') !== fixtureText)
      writeFileSync(PATHS.itineraryFixture, fixtureText);
  }
} catch (error) {
  if (error instanceof CopyError)
    fail(`copy:sync FAILED. ${error.message}\nNo approved copy was fetched, so the build stops here.`);
  fail(
    `copy:sync FAILED with an unexpected error (${error?.name || 'Error'}). No approved copy was fetched.`,
  );
}
