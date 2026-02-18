import globals from 'globals';
import pluginJs from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,tsx}'] },
  {
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },
  {
    // TODO:
    ignores: [
      'vendor',
      'public/assets',
      'public/packs',
      '.ruby-lsp',
      'babel.config.js',
      'app/assets/config/manifest.js',
      'app/views/pwa/service-worker.js',
      'config/webpack/webpackConfig.ts',
      'eslint.config.js ',
    ],
  },
  ...[pluginJs.configs.recommended],
  ...[prettier],
];
