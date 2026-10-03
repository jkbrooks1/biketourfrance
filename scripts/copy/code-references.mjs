// Keeps copy/field-manifest.json honest about the code. A field name used in src/ that is not in the
// manifest, or a manifest field that is not found in its code-location file, is a problem.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT } from './lib.mjs';

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

// t('x/y'), maybe('x/y'), raw('x/y'), has('x/y'), and any prop or key whose name ends in "field".
const REFERENCE =
  /(?:\b(?:t|maybe|raw|has)\(\s*|\b[A-Za-z]*[Ff]ield\s*[=:]\s*)['"]([a-z0-9-]+\/[a-z0-9_]+)['"]/g;

export function checkCodeReferences(manifest) {
  const errors = [];
  const known = new Map(manifest.map((m) => [m.field, m]));
  const used = new Set();
  const sources = walk(join(ROOT, 'src')).filter((f) => /\.(astro|ts|mjs)$/.test(f));
  for (const file of sources) {
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(REFERENCE)) {
      used.add(match[1]);
      if (!known.has(match[1])) {
        errors.push({
          field: match[1],
          route: '(not in manifest)',
          code: relative(ROOT, file),
          issue: 'used in code but not in copy/field-manifest.json (public copy with no approved field)',
        });
      }
    }
  }
  for (const m of manifest) {
    const file = join(ROOT, m.codeLocation);
    if (!existsSync(file)) {
      errors.push({
        field: m.field,
        route: m.route,
        code: m.codeLocation,
        issue: 'code location file does not exist',
      });
    } else if (
      !readFileSync(file, 'utf8').includes(`'${m.field}'`) &&
      !readFileSync(file, 'utf8').includes(`"${m.field}"`)
    ) {
      errors.push({
        field: m.field,
        route: m.route,
        code: m.codeLocation,
        issue: 'field is not referenced in its code location',
      });
    }
    if (!used.has(m.field)) {
      errors.push({
        field: m.field,
        route: m.route,
        code: m.codeLocation,
        issue: 'manifest field is not used anywhere in src/',
      });
    }
  }
  return errors;
}
