import { defineConfig, globalIgnores } from 'eslint/config';

import { withBase } from './src/eslint/withBase.mjs';
import { withReact } from './src/eslint/withReact.mjs';

// eslint-disable-next-line import/no-default-export
export default defineConfig([
  ...withBase('.').map((config) => ({
    ...config,
    ignores: ['packages/**'],
  })),
  ...withBase('./packages/telraam-js'),
  ...withBase('./packages/telraam-downloader'),
  ...withBase('./packages/telraam-aggregator'),
  ...withReact('./packages/telraam-visualizer'),
  globalIgnores(['**/node_modules/**', '**/dist/**', '**/out/**', '**/build/**']),
]);
