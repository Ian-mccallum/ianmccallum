import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const nonIndexablePaths = new Set(['/404', '/thank-you']);

export default defineConfig({
  site: 'https://www.ianmccallum.com',
  output: 'static',
  trailingSlash: 'never',
  integrations: [sitemap({
    filter: (page) => {
      const pathname = new URL(page).pathname.replace(/\/$/, '') || '/';
      return !nonIndexablePaths.has(pathname);
    },
  })],
  build: { format: 'directory' },
  compressHTML: true,
});
