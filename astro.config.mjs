// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Static output. Calculators hydrate as islands; article pages ship no runtime.
// See `decisions/framework-and-hosting.md`, Decisions 1 and 2.
export default defineConfig({
  site: 'https://boltwright.dev',
  integrations: [mdx()],
});
