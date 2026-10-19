import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { EXPECTED_SERVICE_ACCOUNT, PATHS, ROOT, readItineraryGrid } from './lib.mjs';
import {
  FORBIDDEN_ITINERARY_SOURCES,
  ITINERARY_HEADERS,
  ITINERARY_MODULE,
  ITINERARY_ORDER,
  ITINERARY_TAB,
  ITINERARY_TRACE_FILE,
  checkRenderedItinerary,
  itineraryStrings,
  renderItineraryModule,
  renderItineraryTrace,
  statsText,
  validateItineraryGrid,
} from './itinerary.mjs';

const fixture = () => JSON.parse(readFileSync(PATHS.itineraryFixture, 'utf8'));
const COL = Object.fromEntries(fixture()[0].map((h, i) => [h, i]));
// Row numbers are sheet rows (row 1 is the header).
const rowOf = (grid, id) => grid.findIndex((r, i) => i > 0 && r[COL['Ride Day']] === id);
const edit = (grid, id, header, value) => {
  const next = structuredClone(grid);
  const index = rowOf(next, id);
  while (next[index].length <= COL[header]) next[index].push('');
  next[index][COL[header]] = value;
  return next;
};
const messages = (grid) => validateItineraryGrid(grid).errors.map((e) => `${e.field} ${e.issue}`).join('\n');
const words = (n) => Array.from({ length: n }, (_, i) => `w${i}`).join(' ');

// ------------------------------------------------------------------ schema and fixture

test('the offline fixture is a valid itinerary with nine ride days and one Toulouse rest day', () => {
  const { errors, itinerary } = validateItineraryGrid(fixture());
  assert.deepEqual(errors, []);
  assert.deepEqual(
    itinerary.days.map((d) => d.id),
    ITINERARY_ORDER,
  );
  assert.equal(itinerary.days.filter((d) => d.kind === 'ride').length, 9);
  assert.equal(itinerary.days.filter((d) => d.kind === 'rest').length, 1);
  assert.equal(itinerary.days[4].kind, 'rest');
  assert.equal(itinerary.days[3].id, '4');
  assert.equal(itinerary.days[5].id, '5');
  assert.equal(itinerary.tab, ITINERARY_TAB);
});

test('every row keeps the sheet order and has two highlights and a 30-word description', () => {
  const { itinerary } = validateItineraryGrid(fixture());
  itinerary.days.forEach((d, i) => {
    assert.equal(d.row, i + 2);
    assert.equal(d.highlights.length, 2);
    assert.equal(d.description.split(/\s+/).length, 30);
  });
});

test('distance and elevation are the Sheet values, the units come from the Distance Unit and Elevation Unit keys, and the rest day has neither', () => {
  const grid = fixture();
  const { itinerary } = validateItineraryGrid(grid);
  const uiText = (key) => grid.find((r, i) => i > 0 && r[COL['UI Copy Key']] === key)[COL['Approved Text']];
  assert.equal(itinerary.distanceUnit, uiText('Distance Unit'));
  assert.equal(itinerary.elevationUnit, uiText('Elevation Unit'));
  assert.match(itinerary.days[0].distance, /^\d+(\.\d+)?$/);
  assert.match(itinerary.days[0].elevation, /^\d+$/);
  assert.equal(
    statsText(itinerary, itinerary.days[0]),
    `${itinerary.days[0].distance} ${uiText('Distance Unit')} / ${itinerary.days[0].elevation} ${uiText('Elevation Unit')}`,
  );
  assert.match(statsText(itinerary, itinerary.days[0]), /^\d+(\.\d+)? \S+ \/ \d+ \S+$/);
  assert.equal(itinerary.days[4].distance, undefined);
  assert.equal(itinerary.days[4].elevation, undefined);
  assert.equal(itinerary.days[4].lodging, undefined);
});

test('a missing, duplicated or unknown header fails closed', () => {
  const grid = fixture();
  const dropped = structuredClone(grid);
  dropped[0][COL['Elevation (feet)']] = '';
  assert.match(messages(dropped), /required header "Elevation \(feet\)" is missing/);
  const doubled = structuredClone(grid);
  doubled[0][COL['Start Town']] = 'End Town';
  assert.match(messages(doubled), /appears more than once/);
  const unknown = structuredClone(grid);
  unknown[0][0] = 'Ride Highlights';
  assert.match(messages(unknown), /unrecognized header "Ride Highlights"/);
});

test('data under a column with no header fails closed', () => {
  const grid = fixture();
  grid[1][0] = 'stray';
  assert.match(messages(grid), /has data but no recognized header/);
});

test('a duplicate, missing, extra or reordered day fails closed', () => {
  const grid = fixture();
  assert.match(messages(edit(grid, '3', 'Ride Day', '2')), /duplicate "Ride Day" value "2"/);
  assert.match(messages(edit(grid, '3', 'Ride Day', '')), /missing ride-day row "3"/);
  assert.match(messages(edit(grid, '9', 'Ride Day', '10')), /"10" is not a ride day 1 to 9/);
  const swapped = structuredClone(grid);
  [swapped[5], swapped[6]] = [swapped[6], swapped[5]];
  assert.match(messages(swapped), /rows must be in this order/);
});

test('the rest day is required, unique and must sit between ride days 4 and 5', () => {
  const grid = fixture();
  assert.match(messages(edit(grid, 'REST', 'Ride Day', '')), /missing rest-day row "REST"/);
  const moved = structuredClone(grid);
  const [rest] = moved.splice(rowOf(moved, 'REST'), 1);
  moved.splice(rowOf(moved, '6'), 0, rest);
  assert.match(messages(moved), /rest day sits between ride days 4 and 5/);
  assert.match(messages(edit(grid, '9', 'Ride Day', 'REST')), /duplicate "Ride Day" value "REST"/);
});

test('blank required fields fail closed, naming the row and header', () => {
  const grid = fixture();
  for (const header of ['Start Town', 'End Town', 'Distance (miles)', 'Elevation (feet)', 'Destination Lodging', 'Day highlights', 'Route description']) {
    assert.match(messages(edit(grid, '2', header, '')), new RegExp(`row 3: required field "${header.replace(/[()]/g, '\\$&')}" is blank`));
  }
  assert.match(messages(edit(grid, 'REST', 'Route description', '')), /required field "Route description" is blank/);
});

test('a route description that is not exactly 30 words fails closed', () => {
  const grid = fixture();
  assert.match(messages(edit(grid, '1', 'Route description', words(29))), /exactly 30 words; found 29/);
  assert.match(messages(edit(grid, '1', 'Route description', words(31))), /exactly 30 words; found 31/);
  assert.equal(validateItineraryGrid(edit(grid, '1', 'Route description', words(30))).errors.length, 0);
});

test('highlights must be exactly two "• Name — note" bullets', () => {
  const grid = fixture();
  assert.match(messages(edit(grid, '1', 'Day highlights', '• Only One — a note')), /exactly 2 bullets; found 1/);
  assert.match(messages(edit(grid, '1', 'Day highlights', '• A — a\n• B — b\n• C — c')), /exactly 2 bullets; found 3/);
  assert.match(messages(edit(grid, '1', 'Day highlights', '• A — a\n• B without a note')), /highlight 2 is not in the form/);
});

test('distance and elevation must be numbers, and the rest day must carry no ride figures', () => {
  const grid = fixture();
  assert.match(messages(edit(grid, '1', 'Distance (miles)', '53 km')), /must be a number/);
  assert.match(messages(edit(grid, '1', 'Elevation (feet)', '2,122')), /must be a whole number/);
  assert.match(messages(edit(grid, 'REST', 'Distance (miles)', '12')), /rest day must have "NA"/);
  assert.match(messages(edit(grid, 'REST', 'Destination Lodging', 'A hotel')), /rest day must have a blank "Destination Lodging"/);
  assert.match(messages(edit(grid, 'REST', 'Elevation (feet)', '10')), /rest day must have a blank "Elevation \(feet\)"/);
});

test('itinerary data with no Ride Day fails closed', () => {
  const grid = fixture();
  grid.push(['', '', 'Nowhere', 'Nowhere', '', '', '', '', '']);
  assert.match(messages(grid), /has itinerary data but a blank "Ride Day"/);
});

test('UI copy keys are all required, unique, known and non-blank', () => {
  const grid = fixture();
  const keyAt = (name) => grid.findIndex((r, i) => i > 0 && r[COL['UI Copy Key']] === name);
  const drop = structuredClone(grid);
  drop[keyAt('Details control')][COL['UI Copy Key']] = '';
  drop[keyAt('Details control')][COL['Approved Text']] = '';
  assert.match(messages(drop), /required UI copy key "Details control" is missing/);
  const dup = structuredClone(grid);
  dup[keyAt('Rest day title')][COL['UI Copy Key']] = 'Details control';
  assert.match(messages(dup), /duplicate UI copy key "Details control"/);
  const unknown = structuredClone(grid);
  unknown[keyAt('Details control')][COL['UI Copy Key']] = 'Extra label';
  assert.match(messages(unknown), /unrecognized UI copy key "Extra label"/);
  const blank = structuredClone(grid);
  blank[keyAt('Itinerary section heading')][COL['Approved Text']] = '';
  assert.match(messages(blank), /has blank "Approved Text"/);
});

test('the "Lodging Label" UI key is required, unique and non-blank, spelled exactly as the Sheet spells it', () => {
  const grid = fixture();
  const keyAt = (name) => grid.findIndex((r, i) => i > 0 && r[COL['UI Copy Key']] === name);
  assert.ok(keyAt('Lodging Label') > 0, 'the fixture holds the live key "Lodging Label"');
  const missing = structuredClone(grid);
  missing[keyAt('Lodging Label')][COL['UI Copy Key']] = '';
  missing[keyAt('Lodging Label')][COL['Approved Text']] = '';
  assert.match(messages(missing), /required UI copy key "Lodging Label" is missing/);
  const dup = structuredClone(grid);
  dup[keyAt('Rest day title')][COL['UI Copy Key']] = 'Lodging Label';
  assert.match(messages(dup), /duplicate UI copy key "Lodging Label"/);
  const empty = structuredClone(grid);
  empty[keyAt('Lodging Label')][COL['Approved Text']] = '';
  assert.match(messages(empty), /UI copy key "Lodging Label" has blank "Approved Text"/);
  const respelled = structuredClone(grid);
  respelled[keyAt('Lodging Label')][COL['UI Copy Key']] = 'Lodging label';
  assert.match(messages(respelled), /unrecognized UI copy key "Lodging label"/);
});

test('the "Distance Unit" and "Elevation Unit" UI keys are required, unique, non-blank and exactly spelled', () => {
  const grid = fixture();
  const keyAt = (name) => grid.findIndex((r, i) => i > 0 && r[COL['UI Copy Key']] === name);
  for (const key of ['Distance Unit', 'Elevation Unit']) {
    assert.ok(keyAt(key) > 0, `the fixture holds the live key "${key}"`);
    const missing = structuredClone(grid);
    missing[keyAt(key)][COL['UI Copy Key']] = '';
    missing[keyAt(key)][COL['Approved Text']] = '';
    assert.match(messages(missing), new RegExp(`required UI copy key "${key}" is missing`));
    const dup = structuredClone(grid);
    dup[keyAt('Rest day title')][COL['UI Copy Key']] = key;
    assert.match(messages(dup), new RegExp(`duplicate UI copy key "${key}"`));
    const empty = structuredClone(grid);
    empty[keyAt(key)][COL['Approved Text']] = '';
    assert.match(messages(empty), new RegExp(`UI copy key "${key}" has blank "Approved Text"`));
    const respelled = structuredClone(grid);
    respelled[keyAt(key)][COL['UI Copy Key']] = key.toLowerCase();
    assert.match(messages(respelled), /unrecognized UI copy key/);
  }
});

test('both unit keys trace to their tab, key and exact cell', () => {
  const { itinerary } = validateItineraryGrid(fixture());
  const values = JSON.parse(renderItineraryTrace(itinerary)).values;
  for (const [path, key, text] of [['distanceUnit', 'Distance Unit', itinerary.distanceUnit], ['elevationUnit', 'Elevation Unit', itinerary.elevationUnit]]) {
    const entry = values.find((t) => t.path === path);
    assert.equal(entry.tab, ITINERARY_TAB);
    assert.equal(entry.key, key);
    assert.match(entry.cell, /^L\d+$/);
    assert.equal(entry.value, text);
  }
});

test('the lodging label traces to its tab, key and exact cell', () => {
  const { itinerary } = validateItineraryGrid(fixture());
  const entry = JSON.parse(renderItineraryTrace(itinerary)).values.find((t) => t.path === 'lodgingLabel');
  assert.equal(entry.tab, ITINERARY_TAB);
  assert.equal(entry.key, 'Lodging Label');
  assert.match(entry.cell, /^L\d+$/);
  assert.equal(entry.value, itinerary.lodgingLabel);
});

test('HTML in a cell is rejected', () => {
  assert.match(messages(edit(fixture(), '1', 'Start Town', '<b>Bordeaux</b>')), /contains HTML/);
});

// ------------------------------------------------------------------ generation and traceability

test('the committed generated module and trace equal what the committed fixture generates', () => {
  const { itinerary } = validateItineraryGrid(fixture());
  assert.equal(readFileSync(join(ROOT, ITINERARY_MODULE), 'utf8'), renderItineraryModule(itinerary));
  assert.equal(readFileSync(join(ROOT, ITINERARY_TRACE_FILE), 'utf8'), renderItineraryTrace(itinerary));
});

test('every generated value traces to a tab, row and header of the fixture, and the cell holds it', () => {
  const grid = fixture();
  const { itinerary } = validateItineraryGrid(grid);
  const trace = JSON.parse(renderItineraryTrace(itinerary)).values;
  // 6 UI values (heading, details control, rest day title, lodging label, distance unit, elevation unit) + 9 ride days x 10 (start, end, distance, elevation, lodging, 2x2 highlight parts,
  // description) + the rest day x 7 (start, end, 2x2 highlight parts, description).
  assert.equal(trace.length, 6 + 9 * 10 + 7);
  for (const t of trace) {
    assert.equal(t.tab, ITINERARY_TAB);
    assert.ok(ITINERARY_HEADERS.includes(t.header), t.header);
    const cellText = String(grid[t.row - 1][COL[t.header]] ?? '').replace(/\r\n?/g, '\n');
    assert.ok(cellText.includes(String(t.value).split(' ')[0]), `${t.path}: "${t.value}" not in ${t.header} row ${t.row}`);
    if (!t.unitFromHeader && !t.part) assert.equal(cellText.trim(), t.value, t.path);
  }
});

test('every string the page may render comes from a trace entry', () => {
  const { itinerary } = validateItineraryGrid(fixture());
  const traced = new Set(JSON.parse(renderItineraryTrace(itinerary)).values.map((t) => t.value));
  const stats = new Set(itinerary.days.filter((d) => d.kind === 'ride').map((d) => statsText(itinerary, d)));
  for (const s of itineraryStrings(itinerary)) {
    if (stats.has(s)) continue; // composed from three traced values: distance, unit, elevation, unit
    assert.ok(traced.has(s), s);
  }
  for (const d of itinerary.days.filter((x) => x.kind === 'ride')) {
    for (const v of [d.distance, d.elevation, itinerary.distanceUnit, itinerary.elevationUnit]) assert.ok(traced.has(v), v);
  }
});

test('no retired itinerary source text exists in source or copy files', () => {
  const skip = new Set(['node_modules', '.git', 'dist', '.copy', '.astro', 'proof', 'docs']);
  // The list itself and the two tests that inject banned text are the only files allowed to name it.
  const namesBannedText = new Set(['itinerary.mjs', 'itinerary.test.mjs', 'negative-tests.mjs']);
  const hits = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      if (skip.has(name)) continue;
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(astro|ts|json|mjs|css|csv|yml)$/.test(name) && !namesBannedText.has(name)) {
        const text = readFileSync(full, 'utf8');
        for (const banned of FORBIDDEN_ITINERARY_SOURCES) if (text.includes(banned)) hits.push(`${full}: ${banned}`);
      }
    }
  };
  for (const dir of ['src', 'copy', 'scripts', '.github']) walk(join(ROOT, dir));
  assert.deepEqual(hits, []);
});

// ------------------------------------------------------------------ reading the tab

test('the itinerary tab is read by its exact name with the same read-only sign-in', async () => {
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const env = {
    BTF_COPY_SHEET_ID: 'unit-test-spreadsheet',
    BTF_COPY_GOOGLE_SA_JSON: JSON.stringify({
      type: 'service_account',
      client_email: EXPECTED_SERVICE_ACCOUNT,
      private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }),
    }),
  };
  const reads = [];
  const fetchImpl = async (url) => {
    reads.push(String(url));
    let body;
    if (String(url).includes('oauth2.googleapis.com')) body = { access_token: 'unit-test-only' };
    else if (String(url).includes('/values/')) body = { values: [['Ride Day']] };
    else body = { properties: { title: 'BTF_Approved_Site_Copy' }, sheets: [{ properties: { title: ITINERARY_TAB } }] };
    return { ok: true, json: async () => body };
  };
  const result = await readItineraryGrid(env, { fetchImpl });
  assert.equal(result.tab, ITINERARY_TAB);
  const valueReads = reads.filter((u) => u.includes('/values/'));
  assert.equal(valueReads.length, 1);
  assert.equal(decodeURIComponent(valueReads[0].split('/values/')[1].split('?')[0]), `'${ITINERARY_TAB}'!A:Z`);
  await assert.rejects(
    readItineraryGrid(env, {
      fetchImpl: async (url) =>
        String(url).includes('oauth2')
          ? { ok: true, json: async () => ({ access_token: 'x' }) }
          : { ok: true, json: async () => ({ properties: { title: 'BTF_Approved_Site_Copy' }, sheets: [{ properties: { title: 'Other' } }] }) },
    }),
    /no tab named "CDM_Itinerary_for_BTF_Site"/,
  );
});

// ------------------------------------------------------------------ rendered-page check

function page(itinerary, tweak = {}) {
  const row = (d) => {
    const names = d.highlights.map((h) => `<span>${h.name}</span>`).join('');
    const head =
      d.kind === 'ride'
        ? `<span>${d.id}</span><span>${d.startTown} → ${d.endTown}</span><span>${statsText(itinerary, d)}</span>`
        : `<span>${itinerary.restDayTitle}</span>`;
    const summary = tweak.summaryExtra?.(d) ?? '';
    const panel =
      `<p>${d.description}</p><dl>${d.highlights.map((h) => `<div><dt>${h.name}</dt><dd>${h.note}</dd></div>`).join('')}</dl>` +
      (d.lodging ? `${tweak.noLabel ? `<p>${d.lodging}</p>` : `<dl><dt>${itinerary.lodgingLabel}</dt><dd>${d.lodging}</dd></dl>`}${tweak.panelExtra ? tweak.panelExtra(d) : ''}` : '') +
      (d.kind === 'rest' && tweak.restLabel ? `<dl><dt>${itinerary.lodgingLabel}</dt></dl>` : '');
    return `<li><details${tweak.open ? ' open' : ''} data-itin-day="${d.id}"><summary>${head}${names}<span>${itinerary.detailsControl}</span>${summary}</summary><div>${panel}</div></details></li>`;
  };
  const days = tweak.days ?? itinerary.days;
  return `<body><section id="ready-heading"></section><div class="journey-map"><picture></picture></div><section data-cdm-itinerary><h2>${tweak.heading ?? itinerary.heading}</h2><ul>${days.map(row).join('')}</ul></section><section id="cdm-heading"></section></body>`;
}

test('the rendered-page check accepts a correct itinerary', () => {
  const { itinerary } = validateItineraryGrid(fixture());
  assert.deepEqual(checkRenderedItinerary(page(itinerary), itinerary), []);
});

test('the rendered-page check rejects a missing, reordered or open row and a wrong heading', () => {
  const { itinerary } = validateItineraryGrid(fixture());
  const without = itinerary.days.filter((d) => d.id !== '7');
  assert.match(checkRenderedItinerary(page(itinerary, { days: without }), itinerary).join('\n'), /itinerary rows are/);
  const reordered = [...itinerary.days].reverse();
  assert.match(checkRenderedItinerary(page(itinerary, { days: reordered }), itinerary).join('\n'), /itinerary rows are/);
  assert.match(checkRenderedItinerary(page(itinerary, { open: true }), itinerary).join('\n'), /open by default/);
  assert.match(checkRenderedItinerary(page(itinerary, { heading: 'Invented heading' }), itinerary).join('\n'), /approved heading/);
});

test('the rendered-page check requires the stats string when closed and no elevation in the expanded panel', () => {
  const { itinerary } = validateItineraryGrid(fixture());
  assert.deepEqual(checkRenderedItinerary(page(itinerary), itinerary), []);
  const leaksElevation = page(itinerary, { panelExtra: (d) => (d.elevation ? `<p>${d.elevation} ${itinerary.elevationUnit}</p>` : '') });
  assert.match(checkRenderedItinerary(leaksElevation, itinerary).join('\n'), /elevation must appear only in the closed row stats/);
  const noStats = page(itinerary).replace(/<span>\d+(\.\d+)? \S+ \/ \d+ \S+<\/span>/g, '');
  assert.match(checkRenderedItinerary(noStats, itinerary).join('\n'), /closed row is missing distance and elevation stats/);
  const wrongUnit = page(itinerary).replace(new RegExp(` ${itinerary.distanceUnit} / `, 'g'), ' xx / ');
  assert.match(checkRenderedItinerary(wrongUnit, itinerary).join('\n'), /closed row is missing distance and elevation stats/);
});

test('the rendered-page check requires the itinerary directly below the map', () => {
  const { itinerary } = validateItineraryGrid(fixture());
  const html = page(itinerary).replace('<section data-cdm-itinerary>', '<p>Stray text</p><section data-cdm-itinerary>');
  assert.match(checkRenderedItinerary(html, itinerary).join('\n'), /sits between the map and the itinerary/);
  const map = '<div class="journey-map"><picture></picture></div>';
  const above = page(itinerary).replace(map, '').replace('</body>', `${map}</body>`);
  assert.match(checkRenderedItinerary(above, itinerary).join('\n'), /not below the map/);
});

test('the rendered-page check requires the lodging label directly before the lodging text on ride days only', () => {
  const { itinerary } = validateItineraryGrid(fixture());
  assert.match(checkRenderedItinerary(page(itinerary, { noLabel: true }), itinerary).join('\n'), /lodging label directly before the lodging text/);
  assert.match(checkRenderedItinerary(page(itinerary, { restLabel: true }), itinerary).join('\n'), /rest day must not show the lodging label/);
});
