// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import partytown from '@astrojs/partytown';

export default defineConfig({
  site: 'https://atrahdis.id',
  output: 'server',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/sbu'),
      i18n: { defaultLocale: 'id', locales: { id: 'id-ID' } },
    }),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
});
