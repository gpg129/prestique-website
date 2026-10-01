import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { readdirSync, readFileSync } from 'node:fs';

// Sitemap <lastmod> for blog posts only: updatedDate ?? pubDate from each post's frontmatter.
// updatedDate is stamped by Group B when a post gains real content (merge winner, FAQ refresh),
// never for link-only edits. Static and integration pages get no lastmod: we have no truthful
// "content changed" date for them, and Google ignores lastmod on sites where it proves unreliable.
const BLOG_DIR = new URL('./src/content/blog/', import.meta.url);
const blogLastmod = new Map();
for (const file of readdirSync(BLOG_DIR)) {
  if (!/\.mdx?$/.test(file) || file.startsWith('_')) continue;
  const fm = readFileSync(new URL(file, BLOG_DIR), 'utf8').match(/^---\n([\s\S]*?)\n---/);
  if (!fm) continue;
  const field = (k) => fm[1].match(new RegExp(`^${k}:\\s*['"]?([0-9]{4}-[0-9]{2}-[0-9]{2})`, 'm'))?.[1];
  const date = field('updatedDate') ?? field('pubDate');
  if (date) blogLastmod.set(`/blog/${file.replace(/\.mdx?$/, '')}`, date);
}

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
  integrations: [
    tailwindBaseStyles,
    sitemap({
      serialize(item) {
        const date = blogLastmod.get(new URL(item.url).pathname.replace(/\/$/, ''));
        if (date) item.lastmod = date;
        return item;
      },
    }),
  ],
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
