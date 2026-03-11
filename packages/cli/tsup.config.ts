import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { cli: 'src/cli.ts' },
    format: ['esm'],
    dts: false,
    clean: true,
    splitting: false,
    sourcemap: true,
    outExtension: () => ({ js: '.mjs' }),
    external: ['geo-ai-core'],
    banner: { js: '#!/usr/bin/env node' },
  },
  {
    entry: { index: 'src/index.ts' },
    format: ['esm'],
    dts: true,
    clean: false,
    splitting: false,
    sourcemap: true,
    outExtension: () => ({ js: '.mjs' }),
    external: ['geo-ai-core'],
  },
]);
