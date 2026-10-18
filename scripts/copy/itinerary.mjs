// Structured approved-copy source: tab "CDM_Itinerary_for_BTF_Site" of the BTF_Approved_Site_Copy workbook.
//
// The tab is a second governed tab in the same workbook as "Approved Site Copy". It is read by the same
// sync, validated here, and turned into committed generated data (src/data/cdm-itinerary.ts) plus a
// per-value trace (copy/cdm-itinerary-trace.json). This file contains NO itinerary copy of its own: header
// names, UI key names and structural rules only. Every rendered value must come from the tab.
import { normalizeCell } from './markup.mjs';

export const ITINERARY_TAB = 'CDM_Itinerary_for_BTF_Site';
export const ITINERARY_MODULE = 'src/data/cdm-itinerary.ts';
export const ITINERARY_TRACE_FILE = 'copy/cdm-itinerary-trace.json';
export const ITINERARY_ROUTE = '/';

// Columns are matched by current header name, never by column letter.
const COLUMNS = {
  day: 'Ride Day',
  start: 'Start Town',
  end: 'End Town',
  distance: 'Distance (miles)',
  elevation: 'Elevation (feet)',
  lodging: 'Destination Lodging',
  highlights: 'Day highlights',
  description: 'Route description',
  uiKey: 'UI Copy Key',
  uiText: 'Approved Text',
};
export const ITINERARY_HEADERS = Object.values(COLUMNS);

// UI copy lives in the key/text columns of the same tab.
const UI_KEYS = {
  heading: 'Itinerary section heading',
  details: 'Details control',
  rest: 'Rest day title',
  lodgingLabel: 'Lodging Label',
};

export const REST_ID = 'REST';
export const ITINERARY_ORDER = ['1', '2', '3', '4', REST_ID, '5', '6', '7', '8', '9'];
const DESCRIPTION_WORDS = 30;
const HIGHLIGHTS_PER_DAY = 2;

// Strings that must never reappear: retired itinerary sources.
export const FORBIDDEN_ITINERARY_SOURCES = [
  'Ride Highlights',
  'RDE_Highlights',
  'ARCHIVED_DO_NOT_USE',
  '1CAgDBRAsneSE1HOPcpMYT6jRqWN5yuPylV_Mpu1KgtI',
];

const columnLetter = (index) => String.fromCharCode(65 + index);
const unitOf = (header) => header.match(/\(([^)]+)\)\s*$/)?.[1] ?? '';
const wordCount = (text) => text.split(/\s+/).filter(Boolean).length;

/** "• Name — note" -> {name, note}, or null when the bullet is not in that shape. */
function parseHighlight(line) {
  const match = line.match(/^•\s+(.+?)\s+—\s+(.+)$/);
  if (!match) return null;
  const [, name, note] = match;
  return name.trim() && note.trim() ? { name: name.trim(), note: note.trim() } : null;
}

/**
 * Validate the raw A:Z grid of the itinerary tab. Returns {errors, itinerary}. An error has
 * {field, route, code, issue}, like the errors from validateGrid. itinerary is null when errors exist.
 */
export function validateItineraryGrid(grid) {
  const errors = [];
  const err = (field, issue) =>
    errors.push({ field, route: ITINERARY_ROUTE, code: ITINERARY_MODULE, issue });

  const header = (grid[0] || []).map((c) => normalizeCell(c));
  const col = {};
  for (const [key, name] of Object.entries(COLUMNS)) {
    const hits = header.flatMap((h, i) => (h === name ? [i] : []));
    if (hits.length === 0) err(`(header "${name}")`, `required header "${name}" is missing from row 1`);
    else if (hits.length > 1) err(`(header "${name}")`, `header "${name}" appears more than once in row 1`);
    else col[key] = hits[0];
  }
  header.forEach((h, i) => {
    if (h && !ITINERARY_HEADERS.includes(h))
      err('(header row)', `column ${columnLetter(i)} has the unrecognized header "${h}"`);
  });
  const known = new Set(Object.values(col));
  grid.slice(1).forEach((row, r) => {
    row.forEach((value, i) => {
      if (!known.has(i) && normalizeCell(value) !== '')
        err(`(row ${r + 2})`, `column ${columnLetter(i)} has data but no recognized header`);
    });
  });
  if (errors.length) return { errors, itinerary: null };

  const cell = (row, key) => normalizeCell(row[col[key]]);
  const trace = [];
  const note = (path, row, header, extra = {}) => trace.push({ path, tab: ITINERARY_TAB, row, header, ...extra });

  // ---- UI copy key / text pairs
  const ui = {};
  const uiRows = {};
  grid.slice(1).forEach((row, r) => {
    const sheetRow = r + 2;
    const key = cell(row, 'uiKey');
    const text = cell(row, 'uiText');
    if (!key && !text) return;
    if (!key) return err(`(row ${sheetRow})`, `"${COLUMNS.uiText}" has text but "${COLUMNS.uiKey}" is blank`);
    if (!Object.values(UI_KEYS).includes(key))
      return err(`(row ${sheetRow})`, `unrecognized UI copy key "${key}"`);
    if (key in ui) return err(`(row ${sheetRow})`, `duplicate UI copy key "${key}"`);
    if (!text) return err(`(row ${sheetRow})`, `UI copy key "${key}" has blank "${COLUMNS.uiText}"`);
    if (/<\/?[a-z][^>]*>/i.test(text)) return err(`(row ${sheetRow})`, `UI copy key "${key}" contains HTML`);
    ui[key] = text;
    uiRows[key] = sheetRow;
  });
  for (const key of Object.values(UI_KEYS))
    if (!(key in ui)) err(`(UI key "${key}")`, `required UI copy key "${key}" is missing`);

  // ---- itinerary rows
  const rows = [];
  grid.slice(1).forEach((row, r) => {
    const sheetRow = r + 2;
    const id = cell(row, 'day');
    if (!id) {
      const stray = ['start', 'end', 'distance', 'elevation', 'lodging', 'highlights', 'description'].filter(
        (k) => cell(row, k) !== '',
      );
      if (stray.length) err(`(row ${sheetRow})`, `has itinerary data but a blank "${COLUMNS.day}"`);
      return;
    }
    rows.push({ id, sheetRow, row });
  });

  const seen = new Set();
  for (const { id, sheetRow } of rows) {
    if (seen.has(id)) err(`(day ${id})`, `duplicate "${COLUMNS.day}" value "${id}" (row ${sheetRow})`);
    seen.add(id);
    if (!ITINERARY_ORDER.includes(id))
      err(`(day ${id})`, `row ${sheetRow}: "${id}" is not a ride day 1 to 9 or ${REST_ID}`);
  }
  for (const id of ITINERARY_ORDER)
    if (!seen.has(id)) err(`(day ${id})`, `missing ${id === REST_ID ? 'rest-day' : 'ride-day'} row "${id}"`);
  if (!errors.length) {
    const order = rows.map((r) => r.id);
    if (order.join(',') !== ITINERARY_ORDER.join(','))
      err(
        '(row order)',
        `rows must be in this order: ${ITINERARY_ORDER.join(', ')} (the rest day sits between ride days 4 and 5); found ${order.join(', ')}`,
      );
  }

  const distanceUnit = unitOf(COLUMNS.distance);
  const elevationUnit = unitOf(COLUMNS.elevation);
  const days = [];
  rows.forEach(({ id, sheetRow, row }, index) => {
    const rest = id === REST_ID;
    const label = `(day ${id})`;
    const need = (key) => {
      const value = cell(row, key);
      if (!value) err(label, `row ${sheetRow}: required field "${COLUMNS[key]}" is blank`);
      return value;
    };
    const forbid = (key, shown) => {
      if (cell(row, key) !== shown)
        err(label, `row ${sheetRow}: the rest day must have ${shown ? `"${shown}"` : 'a blank'} "${COLUMNS[key]}"`);
    };
    const day = { id, kind: rest ? 'rest' : 'ride', row: sheetRow };
    const path = (field) => `days[${index}].${field}`;

    day.startTown = need('start');
    note(path('startTown'), sheetRow, COLUMNS.start);
    day.endTown = need('end');
    note(path('endTown'), sheetRow, COLUMNS.end);

    if (rest) {
      forbid('distance', 'NA');
      forbid('elevation', '');
      forbid('lodging', '');
    } else {
      const distance = need('distance');
      if (distance && !/^\d+(\.\d+)?$/.test(distance))
        err(label, `row ${sheetRow}: "${COLUMNS.distance}" must be a number; found "${distance}"`);
      day.distance = `${distance} ${distanceUnit}`;
      note(path('distance'), sheetRow, COLUMNS.distance, { unitFromHeader: distanceUnit });
      const elevation = need('elevation');
      if (elevation && !/^\d+$/.test(elevation))
        err(label, `row ${sheetRow}: "${COLUMNS.elevation}" must be a whole number; found "${elevation}"`);
      day.elevation = `${elevation} ${elevationUnit}`;
      note(path('elevation'), sheetRow, COLUMNS.elevation, { unitFromHeader: elevationUnit });
      day.lodging = need('lodging');
      note(path('lodging'), sheetRow, COLUMNS.lodging);
    }

    const lines = need('highlights')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length !== HIGHLIGHTS_PER_DAY)
      err(label, `row ${sheetRow}: "${COLUMNS.highlights}" must hold exactly ${HIGHLIGHTS_PER_DAY} bullets; found ${lines.length}`);
    day.highlights = lines.flatMap((line, h) => {
      const parsed = parseHighlight(line);
      if (!parsed) {
        err(label, `row ${sheetRow}: highlight ${h + 1} is not in the form "• Name — note"`);
        return [];
      }
      note(path(`highlights[${h}].name`), sheetRow, COLUMNS.highlights, { part: `bullet ${h + 1} name` });
      note(path(`highlights[${h}].note`), sheetRow, COLUMNS.highlights, { part: `bullet ${h + 1} note` });
      return [parsed];
    });

    day.description = need('description');
    if (day.description && wordCount(day.description) !== DESCRIPTION_WORDS)
      err(label, `row ${sheetRow}: "${COLUMNS.description}" must be exactly ${DESCRIPTION_WORDS} words; found ${wordCount(day.description)}`);
    note(path('description'), sheetRow, COLUMNS.description);

    for (const [key, value] of Object.entries(day))
      if (typeof value === 'string' && /<\/?[a-z][^>]*>/i.test(value))
        err(label, `row ${sheetRow}: "${key}" contains HTML`);
    days.push(day);
  });

  if (errors.length) return { errors, itinerary: null };
  // UI values trace to their key and their exact cell (tab, key, cell).
  const uiNote = (path, key) =>
    note(path, uiRows[key], COLUMNS.uiText, { key, cell: `${columnLetter(col.uiText)}${uiRows[key]}` });
  uiNote('heading', UI_KEYS.heading);
  uiNote('detailsControl', UI_KEYS.details);
  uiNote('restDayTitle', UI_KEYS.rest);
  uiNote('lodgingLabel', UI_KEYS.lodgingLabel);
  return {
    errors,
    itinerary: {
      tab: ITINERARY_TAB,
      heading: ui[UI_KEYS.heading],
      detailsControl: ui[UI_KEYS.details],
      restDayTitle: ui[UI_KEYS.rest],
      lodgingLabel: ui[UI_KEYS.lodgingLabel],
      days,
      trace,
    },
  };
}

const valueAt = (data, path) =>
  path
    .split(/\.|\[|\]/)
    .filter(Boolean)
    .reduce((node, part) => node?.[part], data);

/** Every approved string the page may render for the itinerary, in display order. */
export function itineraryStrings(itinerary) {
  const out = [itinerary.heading, itinerary.detailsControl, itinerary.restDayTitle, itinerary.lodgingLabel];
  for (const d of itinerary.days) {
    out.push(d.startTown, d.endTown);
    if (d.distance) out.push(d.distance);
    if (d.elevation) out.push(d.elevation);
    if (d.lodging) out.push(d.lodging);
    for (const h of d.highlights) out.push(h.name, h.note);
    out.push(d.description);
  }
  return out;
}

/** Trace entries with the generated value attached, for audit. */
export function traceWithValues(itinerary) {
  return itinerary.trace.map((t) => ({ ...t, value: valueAt(itinerary, t.path) }));
}

/** The committed generated module read by Astro. Deterministic: no timestamps. */
export function renderItineraryModule(itinerary) {
  const { trace, ...data } = itinerary;
  return `// GENERATED FILE - DO NOT EDIT BY HAND.
// Written by scripts/copy/generate-ts.mjs from tab "${data.tab}" of the Google workbook
// "BTF_Approved_Site_Copy". The workbook is the source of truth. Each value below maps to a tab,
// row and header in ${ITINERARY_TRACE_FILE}.

export interface ItineraryHighlight {
  name: string;
  note: string;
}

export interface ItineraryDay {
  id: string;
  kind: 'ride' | 'rest';
  row: number;
  startTown: string;
  endTown: string;
  distance?: string;
  elevation?: string;
  lodging?: string;
  highlights: ItineraryHighlight[];
  description: string;
}

export const ITINERARY: {
  tab: string;
  heading: string;
  detailsControl: string;
  restDayTitle: string;
  lodgingLabel: string;
  days: ItineraryDay[];
} = ${JSON.stringify(data, null, 2)};
`;
}

/** The committed per-value trace. Deterministic. */
export function renderItineraryTrace(itinerary) {
  return (
    JSON.stringify(
      {
        workbook: 'BTF_Approved_Site_Copy',
        tab: itinerary.tab,
        note: 'Each generated value in src/data/cdm-itinerary.ts, with the workbook tab, sheet row and header it came from.',
        values: traceWithValues(itinerary),
      },
      null,
      1,
    ) + '\n'
  );
}

// ------------------------------------------------------------------------- rendered page check

const decodeEntities = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
const squash = (s) => decodeEntities(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, '');
const spaced = (s) => decodeEntities(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

/**
 * Check the built home page against the validated itinerary. Returns a list of problem strings.
 * Contract with src/components/CdmItinerary.astro:
 *   <section data-cdm-itinerary> with <h2>, then one <details data-itin-day="ID"> per row, each holding a
 *   <summary> (closed state) and a panel (expanded state).
 */
export function checkRenderedItinerary(html, itinerary) {
  const problems = [];
  const bad = (issue) => problems.push(issue);
  const sectionAt = html.indexOf('data-cdm-itinerary');
  if (sectionAt < 0) return ['the itinerary section (data-cdm-itinerary) is not on the page'];
  const sectionStart = html.lastIndexOf('<section', sectionAt);
  const sectionEnd = html.indexOf('</section>', sectionAt);
  const section = html.slice(sectionStart, sectionEnd);

  // Directly beneath the map: only markup (no text) between the map block and the itinerary section.
  const mapAt = html.indexOf('class="journey-map');
  if (mapAt < 0) bad('the illustrated map block (journey-map) is not on the page');
  else if (mapAt > sectionStart) bad('the itinerary is not below the map');
  else {
    const mapEnd = html.indexOf('</div>', mapAt);
    if (spaced(html.slice(mapEnd, sectionStart)) !== '') bad('something other than markup sits between the map and the itinerary');
  }

  const heading = section.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/);
  if (!heading || spaced(heading[1]) !== itinerary.heading) bad('the itinerary heading is not the approved heading');

  const found = [...section.matchAll(/<details\b[^>]*data-itin-day="([^"]*)"[^>]*>([\s\S]*?)<\/details>/g)];
  const ids = found.map((m) => m[1]);
  if (ids.join(',') !== itinerary.days.map((d) => d.id).join(','))
    bad(`itinerary rows are ${ids.join(', ') || '(none)'}; expected ${itinerary.days.map((d) => d.id).join(', ')}`);
  if (found.some((m) => /<details\b[^>]*\sopen[\s>=]/.test(m[0].slice(0, m[0].indexOf('>') + 1))))
    bad('an itinerary row is open by default');

  for (const day of itinerary.days) {
    const hit = found.find((m) => m[1] === day.id);
    if (!hit) continue;
    const summary = hit[2].match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/);
    if (!summary) {
      bad(`row ${day.id}: no <summary> disclosure control`);
      continue;
    }
    const closed = squash(summary[1]);
    const panel = squash(hit[2].slice(hit[2].indexOf('</summary>')));
    const inClosed = (label, value) => {
      if (!closed.includes(squash(value))) bad(`row ${day.id}: closed row is missing ${label} "${value.slice(0, 50)}"`);
    };
    const inPanel = (label, value) => {
      if (!panel.includes(squash(value))) bad(`row ${day.id}: expanded panel is missing ${label} "${value.slice(0, 50)}"`);
    };
    const notClosed = (label, value) => {
      if (closed.includes(squash(value))) bad(`row ${day.id}: ${label} must appear only in the expanded panel`);
    };
    inClosed('details control', itinerary.detailsControl);
    for (const h of day.highlights) {
      inClosed('highlight name', h.name);
      inPanel('highlight name', h.name);
      inPanel('highlight note', h.note);
      notClosed('highlight note', h.note);
    }
    inPanel('route description', day.description);
    notClosed('route description', day.description);
    if (day.kind === 'ride') {
      inClosed('start town', day.startTown);
      inClosed('end town', day.endTown);
      if (spaced(summary[1]).split(' ')[0] !== day.id) bad(`row ${day.id}: closed row does not start with the ride day`);
      inClosed('distance', day.distance);
      inPanel('elevation', day.elevation);
      inPanel('destination lodging', day.lodging);
      inPanel('lodging label directly before the lodging text', itinerary.lodgingLabel + day.lodging);
      notClosed('lodging label', itinerary.lodgingLabel);
      notClosed('elevation', day.elevation);
      notClosed('destination lodging', day.lodging);
    } else {
      inClosed('rest day title', itinerary.restDayTitle);
      if (panel.includes(squash(itinerary.lodgingLabel))) bad(`row ${day.id}: the rest day must not show the lodging label`);
    }
  }
  return problems;
}
