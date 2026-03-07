/**
 * Knip 設定（Next.js テンプレート用）
 *
 * 未使用のエクスポート・依存関係を検出
 * @see https://knip.dev/
 */

import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    'src/app/**/*.{ts,tsx}',
    'src/components/**/*.{ts,tsx}',
    'src/config/env.ts',
    'src/lib/**/*.{ts,tsx}',
    'src/styles/**/*.{ts,tsx,css}',
    'src/hooks/**/*.{ts,tsx}',
    'src/utils/**/*.{ts,tsx}',
    'src/pages/**/*.{ts,tsx}',
    'src/**/*.stories.{ts,tsx}',
  ],
  project: ['src/**/*.{ts,tsx}'],
  ignoreDependencies: [
    '@dotenvx/dotenvx',
    '@markuplint/jsx-parser',
    '@markuplint/react-spec',
    '@sentry/nextjs',
    '@secretlint/secretlint-rule-preset-recommend',
    'eslint-config-next',
    'lint-staged',
    'ts-node',
    'webpack-bundle-analyzer',
  ],
  ignore: [
    '.next/**',
    'out/**',
    'dist/**',
    'build/**',
    'coverage/**',
    '.vercel/**',
    '.storybook/**',
    'src/config/path.ts',
  ],
  prettier: true,
  eslint: true,
  vitest: true,
  playwright: true,
  storybook: true,
  husky: true,
};

export default config;
