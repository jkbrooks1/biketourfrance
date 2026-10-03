// Developer step: build copy/field-map.json from the committed Framer export in site/
// and the baseline snapshot. The map records, for every Sheet row, where its text sits
// in the HTML and in the page's JavaScript module, using exact surrounding context.
// Run only when site/ is regenerated. The render step never needs this script.
//
//   node scripts/copy/generate-field-map.mjs
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import {
  FIELD_MAP_PATH,
  SITE_DIR,
  SNAPSHOT_PATH,
  escAttr,
  escHtml,
  escJs,
  joinParts,
  loadJson,
  validateSnapshot,
} from './lib.mjs';

const HOME_MODULE = 'assets/framerusercontent.com/sites/2Ukbahq5dqkKAVHqKdIQ4q/LpnyAzOkU9IXmrpQpGLSSnQy67SWFToUfPQ-7ITCPN4.DakdoxNX.mjs';
const RES_MODULE = 'assets/framerusercontent.com/sites/2Ukbahq5dqkKAVHqKdIQ4q/GrdZAGyUZi3hWZCS92MJVB5PhXM47f0_dG1cC5YTEuw.DggkZJVe.mjs';
const SHARED_LIB = 'assets/framerusercontent.com/sites/2Ukbahq5dqkKAVHqKdIQ4q/shared-lib.DU-USDIa.mjs';
const PAGE_FILES = {
  '/': ['index.html', HOME_MODULE],
  '/resources/': ['resources/index.html', RES_MODULE],
};

const E = (baseline) => ({ baseline, fixed: false });
const F = (baseline) => ({ baseline, fixed: true });
const BR = { baseline: '\n', fixed: true, br: true };

// Fields whose text is split by bold labels or line breaks.
const PARTS = {
  '/ready-to-ride/cdm_heading': [
    F('Canal des Deux Mers'),
    E(' Tour (CDM)  '),
    BR,
    E('Spring & Fall of 2027! Bordeaux start '),
    BR,
    E('Atlantic to Mediterranean'),
  ],
  '/footer/policies': [
    F('Privacy Policy:'),
    E(' We collect email and calendar data for webinar registration and scheduling. Data is stored securely and never shared with third parties. '),
    F('Terms of Service:'),
    E(' By using our site, you agree to follow all applicable laws and accept our liability limits. BikeTourFrance.net provides advisory services without warranties; users are responsible for their own tour planning and execution. '),
    F('Cookie Policy:'),
    E(' We use cookies to track site usage and improve your experience. By continuing to use this site, you consent to cookie usage as required by GDPR and CCPA. '),
    F('Disclaimer:'),
    E(' All content is advisory only. We are not liable for injuries, equipment failure, or planning errors resulting from our guidance.'),
  ],
};

// Identical text used by two fields: choose occurrences by position among the accepted
// matches in each file (document order).
const ASSIGN = {
  // Route metadata in shared-lib: the home route's own title comes first; the Resources
  // title is taken from the site-level metadata function that follows it.
  '/meta_title': { js: [0] },
  '/resources/meta_title': { js: [1] },
  '/header/logo_text': { html: [0], js: [0] },
  '/self-guided/subtitle': { html: [1, 2, 3], js: [1, 2] },
  '/resources/helpful_stuff_library_text': { html: [0], js: [0] },
  '/resources/helpful_sites_library_text': { html: [1], js: [1] },
  '/resources/helpful_stuff_library_cta': { html: [0], js: [0] },
  '/resources/helpful_sites_library_cta': { html: [1], js: [1] },
};

const META_KEYS = new Set(['/meta_title', '/meta_description', '/resources/meta_title', '/resources/meta_description']);
const pageOf = (key) => (key.startsWith('/404/') ? null : key.startsWith('/resources/') ? '/resources/' : '/');

const snapshot = validateSnapshot(loadJson(SNAPSHOT_PATH));
const files = new Map();
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = resolve(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(html|mjs|js|json)$/.test(name)) files.set(relative(SITE_DIR, p), readFileSync(p, 'utf8'));
  }
};
walk(SITE_DIR);

const isJs = (f) => /\.mjs$|\.js$/.test(f);
const headEnd = (text) => text.indexOf('</head>');

function occurrences(file, core, wantMeta) {
  const text = files.get(file);
  const found = [];
  const kinds = isJs(file) ? [['js', escJs(core)], ['htmljs', escJs(escHtml(core))]] : [['html', escHtml(core)], ['attr', escAttr(core)]];
  const seenAt = new Set();
  for (const [kind, esc] of kinds) {
    let from = 0;
    for (;;) {
      const i = text.indexOf(esc, from);
      if (i < 0) break;
      from = i + 1;
      if (seenAt.has(i)) continue;
      const before = text.slice(0, i);
      const after = text.slice(i + esc.length);
      const lb = before.replace(/\s+$/, '');
      const ra = after.replace(/^\s+/, '');
      let ok = false;
      let useKind = kind;
      if (!isJs(file)) {
        const inHead = headEnd(text) > i;
        if (inHead !== wantMeta) continue;
        if (kind === 'attr') ok = before.endsWith('content="') && after.startsWith('"');
        else ok = lb.endsWith('>') && ra.startsWith('<');
        if (wantMeta && kind === 'html' && lb.endsWith('>') && ra.startsWith('</title>') === false && ra.startsWith('<')) ok = ok && /<title>\s*$/.test(before);
      } else {
        if (wantMeta) {
          // Route metadata: title:`...` or description:`...` inside shared-lib.
          if (!(lb.endsWith('title:`') || lb.endsWith('description:`')) || ra[0] !== '`') continue;
          if (kind !== 'js') continue;
          seenAt.add(i);
          found.push({ index: i, kind: 'js', esc });
          continue;
        }
        const lc = lb.slice(-1);
        const rc = ra.slice(0, 1);
        if (!((lc === '`' || lc === '>') && (rc === '`' || rc === '<'))) continue;
        if (/name"?:$/i.test(lb.slice(0, -1)) && lc === '`') continue;
        ok = true;
        useKind = lc === '>' ? 'htmljs' : 'js';
        if (useKind !== kind) continue;
      }
      if (!ok) continue;
      seenAt.add(i);
      found.push({ index: i, kind: useKind, esc });
    }
  }
  return found.sort((a, b) => a.index - b.index);
}

const fields = {};
const problems = [];
for (const { key, copy } of snapshot.rows) {
  const page = pageOf(key);
  if (!page) continue; // /404/ rows render in src/pages/404.astro
  const parts = PARTS[key] ?? [E(copy)];
  if (joinParts(parts) !== copy) problems.push(`${key}: parts do not rebuild the Sheet value.`);
  const wantMeta = META_KEYS.has(key);
  const targets = [];
  parts.forEach((p, partIndex) => {
    if (p.fixed || p.br) return;
    const core = p.baseline.trim();
    const searchFiles = wantMeta ? [PAGE_FILES[page][0], SHARED_LIB] : PAGE_FILES[page];
    for (const file of searchFiles) {
      let occ = occurrences(file, core, wantMeta);
      const kindOfFile = isJs(file) ? 'js' : 'html';
      const pick = ASSIGN[key]?.[kindOfFile];
      if (pick) occ = pick.map((n) => occ[n]).filter(Boolean);
      if (occ.length === 0) {
        problems.push(`${key} part ${partIndex}: no match in ${file}`);
        continue;
      }
      const text = files.get(file);
      const groups = new Map();
      for (const o of occ) {
        const left = text.slice(Math.max(0, o.index - 48), o.index);
        const right = text.slice(o.index + o.esc.length, o.index + o.esc.length + 24);
        const gk = `${o.kind}\u0000${left}\u0000${right}`;
        if (!groups.has(gk)) groups.set(gk, { file, part: partIndex, esc: o.kind, left, right, occ: [], escCore: o.esc });
        groups.get(gk).occ.push(o.index);
      }
      for (const g of groups.values()) {
        const needle = g.left + g.escCore + g.right;
        const all = [];
        for (let i = text.indexOf(needle); i >= 0; i = text.indexOf(needle, i + 1)) all.push(i + g.left.length);
        const nth = g.occ.map((idx) => all.indexOf(idx));
        if (nth.some((n) => n < 0)) problems.push(`${key}: context lookup failed in ${file}`);
        targets.push({ file: g.file, part: g.part, esc: g.esc, left: g.left, right: g.right, total: all.length, nth });
      }
    }
  });
  fields[key] = { page, parts: parts.map((p) => ({ baseline: p.baseline, fixed: !!p.fixed, ...(p.br ? { br: true } : {}) })), targets };
}

// Report which copy lives in files other than the two pages and their modules.
const covered = new Set([...Object.values(PAGE_FILES).flat(), SHARED_LIB]);
const extra = [];
for (const [file, text] of files) {
  if (covered.has(file)) continue;
  for (const { key, copy } of snapshot.rows) {
    if (!pageOf(key)) continue;
    const parts = PARTS[key] ?? [E(copy)];
    for (const p of parts) {
      if (p.fixed || p.br) continue;
      const core = p.baseline.trim();
      if (core.length > 24 && (text.includes(core) || text.includes(escHtml(core)) || text.includes(escJs(core)))) extra.push(`${file}: ${key}`);
    }
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
const map = {
  schema: 1,
  note: 'Generated by scripts/copy/generate-field-map.mjs from the committed Framer export in site/. Baseline text describes the committed export, not the live Sheet.',
  baselineSnapshotSha256: snapshot.contentSha256,
  files: { '/': PAGE_FILES['/'], '/resources/': PAGE_FILES['/resources/'], metadata: [SHARED_LIB] },
  fields,
};
writeFileSync(FIELD_MAP_PATH, `${JSON.stringify(map, null, 2)}\n`);
console.log(`Field map written: ${FIELD_MAP_PATH}`);
console.log(`Fields mapped: ${Object.keys(fields).length}`);
let total = 0;
for (const f of Object.values(fields)) for (const t of f.targets) total += t.nth.length;
console.log(`Replacement sites: ${total}`);
console.log(extra.length ? `Copy also found in other files (not patched):\n${[...new Set(extra)].join('\n')}` : 'No copy found in other site files.');
