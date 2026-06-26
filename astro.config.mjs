import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://compoundinterestcalculator.example.com',
  output: 'static',
  integrations: [sitemap(), tailwind()],
});
