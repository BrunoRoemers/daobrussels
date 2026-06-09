import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.VERCEL_URL && process.env.VERCEL_ENV !== 'production' ? `https://${process.env.VERCEL_URL}` : 'https://dao.brussels',
  integrations: [svelte(), mdx(), sitemap(), tailwind()],
  output: 'static',
});
