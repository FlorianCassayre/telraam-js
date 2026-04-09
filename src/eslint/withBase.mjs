import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import typescriptEslint from 'typescript-eslint';

import { paths } from './paths.mjs';

export const withBase = (directory) => [
  ...typescriptEslint.configs.recommended,
  {
    files: [paths(directory)],
    plugins: {
      prettier,
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: `${directory}/tsconfig.json`,
        },
      },
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
      'import/no-duplicates': 'error',
      // Normalize Node imports
      'import/no-nodejs-modules': 'off',
      'import/enforce-node-protocol-usage': ['error', 'always'],
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
    },
    languageOptions: { parser: tsParser },
  },
];
