import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://prestique.ai',
  // One URL per page: no trailing slash. Pairs with vercel.json
  // (cleanUrls + trailingSlash:false) and src/lib/canonical.ts.
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [tailwind(), sitemap()],
  output: 'static',
});
