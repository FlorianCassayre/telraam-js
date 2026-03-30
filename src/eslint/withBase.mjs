import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

import { paths } from './paths.mjs';

export const withBase = (directory) => [
  {
    files: [paths(directory)],
    plugins: {
      prettier,
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'all',
          semi: true,
          tabWidth: 2,
          singleQuote: true,
          printWidth: 120,
          endOfLine: 'auto',
          arrowParens: 'always',
        },
        {
          usePrettierrc: false,
        },
      ],
      // Imports sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      // No extensions on imports
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
          mjs: 'always',
        },
      ],
      // No empty block imports
      'import/no-empty-named-blocks': 'error',
      // Enforce new line between imports and rest
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
      ],
      // No default exports
      'import/no-default-export': 'error',
      // No unused
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
    },
    languageOptions: { parser: tsParser },
  },
];
