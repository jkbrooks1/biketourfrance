// Keeps copy/field-manifest.json honest about where copy lives in the code: every codeLocation must be
// an existing file. (The site itself does not read the Sheet. Its text lives in those files.)
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib.mjs';

export function checkManifestLocations(manifest) {
  return manifest
    .filter((m) => !existsSync(join(ROOT, m.codeLocation)))
    .map((m) => ({
      field: m.field,
      route: m.route,
      code: m.codeLocation,
      issue: 'code location file does not exist',
    }));
}
