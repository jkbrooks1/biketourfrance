import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Map group originals (canal map and France locator) are large source PNGs. Only their optimized
// variants are delivered, so the unreferenced originals are omitted from dist.
const omitUnusedMapOriginal = {
  name: 'omit-unused-map-original',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const output = fileURLToPath(dir);
      const files = readdirSync(output, { recursive: true });
      const originals = files.filter((file) =>
        /^_astro\/(?:canal-des-deux-mers-illustrated-map|btf-cdm-france-locator-map)\.[^.]+\.png$/.test(file),
      );
      const textFiles = files.filter((file) => /\.(?:html|css|js|json|xml)$/.test(file));
      for (const original of originals) {
        const name = original.split('/').at(-1);
        if (textFiles.some((file) => readFileSync(join(output, file), 'utf8').includes(name))) {
          throw new Error(`The original map-group PNG is referenced by ${name}; it cannot be omitted.`);
        }
        unlinkSync(join(output, original));
      }
    },
  },
};

// Native Astro build for biketourfrance.net, deployed from GitHub to the Cloudflare Pages project temp-btf.
// Static files that must be served as-is (robots.txt, _headers, favicon) live in public/.
// The earlier Framer export in site/ is kept in git only as a reference and is no longer served.
// The canonical origin is the production domain. Staging stays noindex through public/_headers,
// public/robots.txt, and the SITE.indexingEnabled flag in src/data/site.ts.
export default defineConfig({
  site: 'https://biketourfrance.net',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') }), omitUnusedMapOriginal],
});
