/**
 * 各テンプレートの README.md 生成用メタデータ。
 * scripts/generate-configs.ts → gen-readme.ts で各 templates/<id>/README.md を生成。
 * テンプレート: shared/readme/README.md.hbs
 * 共通の文面はテンプレート内で一元管理し、テンプレートごとの差分は config のみで指定する。
 *
 * ## TemplateReadmeConfig の主要フィールド
 *
 * - id: config の識別子（ファイルとの対応用）
 * - outputDir: README の出力先（例: 'full-templates/nextjs'）
 *   - 未指定時は minimal-templates/${id} に出力される
 *   - full-templates は outputDir で明示的に指定する（-full サフィックスハックなし）
 * - npmStack: shared/npm/${stack}.json を参照して「主なライブラリ」セクションを生成
 * - gemfileStack: shared/gemfile/Gemfile.${stack} を参照して「主な Gem」セクションを生成
 * - extensionSets: shared/devcontainer/defaults.json から拡張機能セットを取得
 * - devGuide: 開発ガイドのセクション（コマンド集）
 *
 * ## 出力先の決定ロジック
 *
 * ```
 * outputDir が定義されている
 *   → join(ROOT, outputDir) に出力
 * outputDir が undefined
 *   → join(ROOT, minimal-templates, id) に出力
 * ```
 *
 * これにより、minimal/full の差分を明示的に管理できます。
 */

import type { ExtensionSetKey } from './devcontainer-types.js';

// ── 共通コマンド定数 ──────────────────────────────────────────────────────

const CMD = {
  YARN_FORMAT_LINT: ['yarn format', 'yarn lint'] as string[],
  RUBOCOP_FIX: ['bundle exec rubocop -A'] as string[],
  RSPEC: ['bundle exec rspec'] as string[],
  ERB_LINT: ['bundle exec erb_lint app/views/**/*.erb'] as string[],
  HTML_BEAUTIFIER: [
    'find app/views -name "*.erb" -exec bundle exec htmlbeautifier {} \\;',
  ] as string[],
};

// ── プレビューURL・拡張機能セット定数 ──────────────────────────────────

const PREVIEW_URLS = {
  RAILS: 'http://localhost:3000',
  NEXTJS: 'http://localhost:3000',
  REACT: 'http://localhost:5173',
  SINATRA: 'http://localhost:4567',
  RAILS_API: 'http://localhost:3000/api-docs/index.html',
};

const EXT_SETS = {
  NODE: ['base', 'node'] as ExtensionSetKey[],
  RUBY: ['base', 'ruby'] as ExtensionSetKey[],
  RAILS: ['base', 'ruby', 'erb', 'node', 'tooling'] as ExtensionSetKey[],
  RAILS_API: ['base', 'ruby'] as ExtensionSetKey[],
  RAILS_API_FULL: ['base', 'ruby', 'tooling'] as ExtensionSetKey[],
  SINATRA: ['base', 'ruby', 'erb'] as ExtensionSetKey[],
  NEXTJS: ['base', 'node'] as ExtensionSetKey[],
  NEXTJS_FULL: ['base', 'node', 'markdownPreview'] as ExtensionSetKey[],
  REACT: ['base', 'node'] as ExtensionSetKey[],
};

// ── 型定義 ───────────────────────────────────────────────────────────────────

export type TemplateReadmeStep = {
  label?: string;
  commands: string[];
};

export type TemplateReadmeDevGuide = {
  title: string;
  commands: string[];
};

export type TemplateReadmeConfig = {
  id: string;
  title?: string;
  description: string;
  repoSlug: string;
  /** shared/npm/${npmStack}.json のパッケージを「主なライブラリ」に記載 */
  npmStack?: string;
  /** shared/gemfile/Gemfile.${gemfileStack} の gem を「主な Gem」に記載 */
  gemfileStack?: string;
  /** shared/devcontainer/defaults.json の拡張機能セットを「主な拡張機能」に記載 */
  extensionSets?: ExtensionSetKey[];
  /** 「主なライブラリ」に記載する項目（Go: Gin, Rust: Axum など） */
  stackLibs?: string[];
  setupSteps: TemplateReadmeStep[];
  previewUrl?: string;
  devGuide: TemplateReadmeDevGuide[];
  extraSectionsPath?: string;
  /** create-project の選択番号（full-templates 用など）。未指定時は minimal の並びから算出 */
  selectNumber?: number;
  /** create-project の表示名（full-templates 用など） */
  selectLabel?: string;
  /** README出力先（相対パス、例: 'full-templates/nextjs'）。未指定時は minimal-templates/${id} */
  outputDir?: string;
};

export const TEMPLATE_README_CONFIGS: TemplateReadmeConfig[] = [
  {
    id: 'nodejs',
    description: 'このリポジトリはNode.jsのテンプレートプロジェクトです。',
    repoSlug: 'template-nodejs',
    npmStack: 'nodejs',
    extensionSets: EXT_SETS.NODE,
    setupSteps: [],
    devGuide: [
      { title: 'コードの静的解析と修正', commands: CMD.YARN_FORMAT_LINT },
    ],
  },
  {
    id: 'nextjs',
    description: 'このリポジトリは Next.js のテンプレートプロジェクトです。',
    repoSlug: 'template-nextjs',
    npmStack: 'nextjs',
    extensionSets: EXT_SETS.NEXTJS,
    setupSteps: [
      { label: 'パッケージをインストール', commands: ['yarn'] },
      { label: '開発サーバー起動', commands: ['yarn dev'] },
    ],
    previewUrl: PREVIEW_URLS.NEXTJS,
    devGuide: [
      { title: 'テストの実行', commands: ['yarn test'] },
      { title: 'カバレッジレポートの生成', commands: ['yarn test:coverage'] },
      { title: 'コードの静的解析と修正', commands: CMD.YARN_FORMAT_LINT },
    ],
  },
  {
    id: 'nextjs-full',
    description:
      'このリポジトリは Next.js のテンプレートプロジェクトです。Storybook・E2E（Playwright）・Lighthouse CI などを含む実用向け構成です。',
    repoSlug: 'template-nextjs',
    npmStack: 'nextjs',
    outputDir: 'full-templates/nextjs',
    extensionSets: EXT_SETS.NEXTJS_FULL,
    setupSteps: [
      { label: 'パッケージをインストール', commands: ['yarn'] },
      { label: '開発サーバー起動', commands: ['yarn dev'] },
    ],
    previewUrl: PREVIEW_URLS.NEXTJS,
    devGuide: [
      { title: 'テストの実行', commands: ['yarn test'] },
      { title: 'カバレッジレポートの生成', commands: ['yarn test:coverage'] },
      { title: 'コードの静的解析と修正', commands: CMD.YARN_FORMAT_LINT },
      { title: 'Storybook の起動', commands: ['yarn storybook'] },
      { title: 'E2E テスト（Playwright）', commands: ['yarn test:e2e'] },
      { title: '型チェック', commands: ['yarn type-check'] },
    ],
    extraSectionsPath: 'shared/readme/extra-sections/nextjs-full-sentry.md',
    selectNumber: 2,
    selectLabel: 'Next.js (App Router) - 実用',
  },
  {
    id: 'react',
    description:
      'このリポジトリは React + Vite のテンプレートプロジェクトです。',
    repoSlug: 'template-react',
    npmStack: 'react',
    extensionSets: EXT_SETS.REACT,
    setupSteps: [
      { label: 'パッケージをインストール', commands: ['yarn'] },
      { label: '開発サーバー起動', commands: ['yarn dev'] },
    ],
    previewUrl: PREVIEW_URLS.REACT,
    devGuide: [
      { title: 'テストの実行', commands: ['yarn test'] },
      { title: 'コードの静的解析と修正', commands: CMD.YARN_FORMAT_LINT },
    ],
  },
  {
    id: 'rails',
    description:
      'このリポジトリは Ruby on Rails のテンプレートプロジェクトです。',
    repoSlug: 'template-rails',
    npmStack: 'rails',
    gemfileStack: 'rails',
    extensionSets: EXT_SETS.RAILS,
    setupSteps: [
      { label: 'データベース準備', commands: ['bin/rails db:prepare'] },
      { label: '開発サーバー起動', commands: ['bin/dev'] },
    ],
    previewUrl: PREVIEW_URLS.RAILS,
    devGuide: [
      { title: 'テストの実行', commands: CMD.RSPEC },
      {
        title: 'コードの静的解析と修正',
        commands: [
          'yarn format',
          'yarn lint',
          ...CMD.RUBOCOP_FIX,
          ...CMD.ERB_LINT,
          ...CMD.HTML_BEAUTIFIER,
        ],
      },
    ],
  },
  {
    id: 'rails-api',
    description:
      'このリポジトリは Ruby on Rails（API）のテンプレートプロジェクトです。',
    repoSlug: 'template-rails-api',
    npmStack: 'rails-api',
    gemfileStack: 'rails-api',
    extensionSets: EXT_SETS.RAILS_API,
    setupSteps: [
      { label: 'データベース準備', commands: ['bin/rails db:prepare'] },
      { label: '開発サーバー起動', commands: ['bin/rails s'] },
    ],
    previewUrl: PREVIEW_URLS.RAILS_API,
    devGuide: [
      { title: 'テストの実行', commands: CMD.RSPEC },
      {
        title: 'APIドキュメント生成',
        commands: ['bundle exec rake rswag:specs:swaggerize'],
      },
      {
        title: 'コードの静的解析と修正',
        commands: ['yarn format', 'yarn lint', ...CMD.RUBOCOP_FIX],
      },
    ],
  },
  {
    id: 'rails-api-full',
    description:
      'このリポジトリは Ruby on Rails（API）のテンプレートプロジェクトです。Service Layer・Serializer・背景ジョブ・包括的なテストとCI/CDを含む実用向け構成です。',
    repoSlug: 'template-rails-api',
    npmStack: 'rails-api',
    gemfileStack: 'rails-api-full',
    outputDir: 'full-templates/rails-api',
    extensionSets: EXT_SETS.RAILS_API_FULL,
    setupSteps: [
      { label: 'Gemfileインストール', commands: ['bundle install'] },
      { label: 'パッケージインストール', commands: ['yarn install'] },
      { label: 'データベース準備', commands: ['bin/rails db:create db:schema:load'] },
      { label: '開発サーバー起動', commands: ['bin/rails s'] },
    ],
    previewUrl: PREVIEW_URLS.RAILS_API,
    devGuide: [
      { title: 'テストの実行', commands: CMD.RSPEC },
      {
        title: 'カバレッジレポートの生成',
        commands: ['COVERAGE=true bundle exec rspec'],
      },
      {
        title: 'コードの静的解析と修正',
        commands: [
          'yarn format',
          'yarn markdownlint',
          ...CMD.RUBOCOP_FIX,
          'bundle exec brakeman',
          'bundle audit check --update',
          'yarn audit',
        ],
      },
      {
        title: 'バックグラウンドジョブの実行',
        commands: ['bundle exec sidekiq'],
      },
    ],
    selectNumber: 6,
    selectLabel: 'Rails API - 実用',
  },
  {
    id: 'sinatra',
    description: 'このリポジトリはSinatraのテンプレートプロジェクトです。',
    repoSlug: 'template-sinatra',
    npmStack: 'sinatra',
    gemfileStack: 'sinatra',
    extensionSets: EXT_SETS.SINATRA,
    setupSteps: [
      {
        label: 'データベース準備',
        commands: ['bundle exec rake db:setup', 'bundle exec rake db:seed'],
      },
      { label: '開発サーバー起動', commands: ['bundle exec ruby index.rb'] },
    ],
    previewUrl: PREVIEW_URLS.SINATRA,
    devGuide: [
      {
        title: 'マイグレーションファイルの追加',
        commands: ['bundle exec rake db:generate_migrate[ファイル名]'],
      },
      {
        title: 'マイグレーションの実行',
        commands: ['bundle exec rake db:migrate'],
      },
      { title: 'テストの実行', commands: CMD.RSPEC },
      {
        title: 'コードの静的解析と修正',
        commands: [
          'yarn format',
          ...CMD.RUBOCOP_FIX,
          ...CMD.ERB_LINT,
          ...CMD.HTML_BEAUTIFIER,
        ],
      },
    ],
  },
  {
    id: 'ruby',
    description: 'このリポジトリはRubyのテンプレートプロジェクトです。',
    repoSlug: 'template-ruby',
    npmStack: 'ruby',
    gemfileStack: 'ruby',
    extensionSets: EXT_SETS.RUBY,
    setupSteps: [],
    devGuide: [
      {
        title: 'コードの静的解析と修正',
        commands: ['yarn format', ...CMD.RUBOCOP_FIX],
      },
    ],
  },
];
