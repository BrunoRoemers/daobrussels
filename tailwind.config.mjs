/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Geometric Commons palette — ink on paper, no muted blue.
        ink: '#0a0a0a',
        paper: '#fafaf7',
        muted: '#1a1a1a',
        // Legacy `dao` aliases retained so existing markdown/prose styles keep
        // working until every reference is migrated.
        dao: {
          green: '#0a0a0a',
          light: '#0a0a0a',
          dark: '#0a0a0a',
          bg: '#fafaf7',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        // Mono caps labels used throughout the design.
        widercaps: '0.12em',
        widestcaps: '0.14em',
      },
      maxWidth: {
        canvas: '1280px',
      },
    },
  },
  plugins: [],
};
