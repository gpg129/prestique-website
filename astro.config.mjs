import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Tailwind 3 via PostCSS. Replaces the deprecated @astrojs/tailwind
// integration (it has no Astro 6/7 release) with exactly what it did:
// tailwindcss + autoprefixer as PostCSS plugins, and the Tailwind base
// layers injected on every page (its default `applyBaseStyles: true`).
const tailwindBaseStyles = {
  name: 'tailwind-base-styles',
  hooks: {
    'astro:config:setup': ({ injectScript }) => {
      injectScript('page-ssr', `import '/src/styles/tailwind-base.css';`);
    },
  },
};

export default defineConfig({
  site: 'https://prestique.ai',
  // One URL per page: no trailing slash. Pairs with vercel.json
  // (cleanUrls + trailingSlash:false) and src/lib/canonical.ts.
  trailingSlash: 'never',
  build: { format: 'file' },
  // Astro 7 changed the default to 'jsx', which strips whitespace between
  // inline elements. Keep the Astro 5 behavior so rendered text is unchanged.
  compressHTML: true,
  integrations: [tailwindBaseStyles, sitemap()],
  vite: {
    // Vite 8 raised its default browser target to "baseline-widely-available"
    // and minifies CSS with Lightning CSS, which then emits media-query range
    // syntax (`@media (width>=640px)`) that Safari < 16.4 ignores. Pin the
    // Vite 6 default targets so the output keeps working on the same browsers.
    build: {
      target: ['edge88', 'firefox78', 'chrome87', 'safari14'],
      cssTarget: ['edge88', 'firefox78', 'chrome87', 'safari14'],
      cssMinify: 'esbuild',
    },
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    },
  },
  output: 'static',
});
