/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'p-dark':  '#0a0f1a',
        'p-navy':  '#1a2e4a',
        'p-blue':  '#3b82f6',
        'p-glow':  '#60a5fa',
        'p-text':  '#e2e8f0',
        'p-muted': '#94a3b8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
