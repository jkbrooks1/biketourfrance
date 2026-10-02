import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') })],
});
