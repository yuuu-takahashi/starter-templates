/**
 * 各テンプレートの README.md 生成用メタデータ。
 * scripts/generate-configs.ts → gen-readme.ts で各 templates/<id>/README.md を生成。
 * テンプレート: shared/readme/README.md.hbs
 * 共通の文面はテンプレート内で一元管理し、テンプレートごとの差分は config のみで指定する。
 */

// ── 型定義 ───────────────────────────────────────────────────────────────────

export type TemplateReadmeStep = {
  label?: string;
  commands: string[];
};

export type TemplateReadmeDevGuide = {
  title: string;
  commands: string;
};

/** Dev Container の拡張機能セット（shared/devcontainer/defaults.json の extensions キー） */
export type ExtensionSetKey =
  | 'base'
  | 'node'
  | 'ruby'
  | 'erb'
  | 'tooling'
  | 'markdownPreview';

export type TemplateReadmeConfig = {
  id: string;
  title: string;
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
  extraSections?: string;
  /** create-project の選択番号（full-templates 用など）。未指定時は minimal の並びから算出 */
  selectNumber?: number;
  /** create-project の表示名（full-templates 用など） */
  selectLabel?: string;
};

export const TEMPLATE_README_CONFIGS: TemplateReadmeConfig[] = [
  {
    id: 'nodejs',
    title: 'template-nodejs',
    description: 'このリポジトリはNode.jsのテンプレートプロジェクトです。',
    repoSlug: 'template-nodejs',
    npmStack: 'nodejs',
    extensionSets: ['base', 'node'],
    setupSteps: [],
    devGuide: [
      { title: 'コードの静的解析と修正', commands: 'yarn format\nyarn lint' },
    ],
  },
  {
    id: 'nextjs',
    title: 'template-nextjs',
    description: 'このリポジトリは Next.js のテンプレートプロジェクトです。',
    repoSlug: 'template-nextjs',
    npmStack: 'nextjs',
    extensionSets: ['base', 'node'],
    setupSteps: [
      { label: 'パッケージをインストール', commands: ['yarn'] },
      { label: '開発サーバー起動', commands: ['yarn dev'] },
    ],
    previewUrl: 'http://localhost:3000',
    devGuide: [
      { title: 'テストの実行', commands: 'yarn test' },
      { title: 'カバレッジレポートの生成', commands: 'yarn test:coverage' },
      { title: 'コードの静的解析と修正', commands: 'yarn format\nyarn lint' },
    ],
  },
  {
    id: 'nextjs-full',
    title: 'template-nextjs',
    description:
      'このリポジトリは Next.js のテンプレートプロジェクトです。Storybook・E2E（Playwright）・Lighthouse CI などを含む実用向け構成です。',
    repoSlug: 'template-nextjs',
    npmStack: 'nextjs',
    extensionSets: ['base', 'node', 'markdownPreview'],
    setupSteps: [
      { label: 'パッケージをインストール', commands: ['yarn'] },
      { label: '開発サーバー起動', commands: ['yarn dev'] },
    ],
    previewUrl: 'http://localhost:3000',
    devGuide: [
      { title: 'テストの実行', commands: 'yarn test' },
      { title: 'カバレッジレポートの生成', commands: 'yarn test:coverage' },
      { title: 'コードの静的解析と修正', commands: 'yarn format\nyarn lint' },
      { title: 'Storybook の起動', commands: 'yarn storybook' },
      { title: 'E2E テスト（Playwright）', commands: 'yarn test:e2e' },
      { title: '型チェック', commands: 'yarn type-check' },
    ],
    extraSections: `## Sentry エラートラッキング設定

このテンプレートには、Sentry によるエラートラッキング機能が統合されています。

### Sentry のセットアップ

1. **Sentry プロジェクトを作成**

   - [Sentry.io](https://sentry.io) にアクセスしてアカウントを作成
   - 新しいプロジェクトを作成（プラットフォーム: **Next.js**）
   - Project Settings → Client Keys (DSN) から **DSN** をコピー

2. **環境変数を設定**

   \`\`\`bash
   # .env.local（開発環境）
   SENTRY_DSN=https://your-key@your-org.ingest.sentry.io/your-project-id
   \`\`\`

   本番環境では \`.env.production\` に設定してください。

3. **Sentry の有効化**

   - 本番環境（\`APP_ENV=production\`）のみで自動的に有効化されます
   - 開発環境ではデフォルトで無効化されています

### 設定値の説明

| 環境変数 | 説明 | 必須 |
| --- | --- | --- |
| \`SENTRY_DSN\` | Sentry の Data Source Name | 本番環境 |
| \`SENTRY_ENVIRONMENT\` | 環境名（production, staging など） | ❌ |
| \`NEXT_PUBLIC_SENTRY_RELEASE\` | リリースバージョン | ❌ |
| \`SENTRY_DEBUG\` | デバッグモード（開発時のトラブルシューティング用） | ❌ |

### 動作確認

テスト用のエラーを送信してみる（開発環境では動作しません）：

\`\`\`typescript
import * as Sentry from '@sentry/nextjs';

// エラーをキャプチャ
try {
  // エラーを発生させるコード
} catch (error) {
  Sentry.captureException(error);
}
\`\`\`

### カスタマイズ

Sentry の設定は \`src/config/sentry.config.ts\` で管理されます。本番環境でのサンプリング率は以下の通り：

- エラー時のリプレイ: 100%
- セッションリプレイ: 10%
- トレース: 100%

### トラブルシューティング

#### 開発環境で Sentry が動作しない場合

これは正常な動作です。開発環境では意図的に無効化されています。本番環境に対して設定を確認してください。

#### 本番環境でエラーが送信されない場合

1. \`SENTRY_DSN\` が正しく設定されているか確認
2. \`APP_ENV=production\` が設定されているか確認
3. ネットワーク接続を確認`,
    selectNumber: 2,
    selectLabel: 'Next.js (App Router) - 実用',
  },
  {
    id: 'react',
    title: 'template-react',
    description:
      'このリポジトリは React + Vite のテンプレートプロジェクトです。',
    repoSlug: 'template-react',
    npmStack: 'react',
    extensionSets: ['base', 'node'],
    setupSteps: [
      { label: 'パッケージをインストール', commands: ['yarn'] },
      { label: '開発サーバー起動', commands: ['yarn dev'] },
    ],
    previewUrl: 'http://localhost:5173',
    devGuide: [
      { title: 'テストの実行', commands: 'yarn test' },
      { title: 'コードの静的解析と修正', commands: 'yarn format\nyarn lint' },
    ],
  },
  {
    id: 'rails',
    title: 'template-rails',
    description:
      'このリポジトリは Ruby on Rails のテンプレートプロジェクトです。',
    repoSlug: 'template-rails',
    npmStack: 'rails',
    gemfileStack: 'rails',
    extensionSets: ['base', 'ruby', 'erb', 'node', 'tooling'],
    setupSteps: [
      { label: 'データベース準備', commands: ['bin/rails db:prepare'] },
      { label: '開発サーバー起動', commands: ['bin/dev'] },
    ],
    previewUrl: 'http://localhost:3000',
    devGuide: [
      { title: 'テストの実行', commands: 'bundle exec rspec' },
      {
        title: 'コードの静的解析と修正',
        commands:
          'yarn format\nyarn lint\nbundle exec rubocop -A\nbundle exec erb_lint app/views/**/*.erb\nfind app/views -name "*.erb" -exec bundle exec htmlbeautifier {} \\;',
      },
    ],
  },
  {
    id: 'rails-api',
    title: 'template-rails-api',
    description:
      'このリポジトリは Ruby on Rails（API）のテンプレートプロジェクトです。',
    repoSlug: 'template-rails-api',
    npmStack: 'rails-api',
    gemfileStack: 'rails-api',
    extensionSets: ['base', 'ruby'],
    setupSteps: [
      { label: 'データベース準備', commands: ['bin/rails db:prepare'] },
      { label: '開発サーバー起動', commands: ['bin/rails s'] },
    ],
    previewUrl: 'http://localhost:3000/api-docs/index.html',
    devGuide: [
      { title: 'テストの実行', commands: 'bundle exec rspec' },
      {
        title: 'APIドキュメント生成',
        commands: 'bundle exec rake rswag:specs:swaggerize',
      },
      {
        title: 'コードの静的解析と修正',
        commands: 'yarn format\nyarn lint\nbundle exec rubocop -A',
      },
    ],
  },
  {
    id: 'rails-api-full',
    title: 'template-rails-api',
    description:
      'このリポジトリは Ruby on Rails（API）のテンプレートプロジェクトです。Service Layer・Serializer・背景ジョブ・包括的なテストとCI/CDを含む実用向け構成です。',
    repoSlug: 'template-rails-api',
    npmStack: 'rails-api',
    gemfileStack: 'rails-api-full',
    extensionSets: ['base', 'ruby', 'tooling'],
    setupSteps: [
      { label: 'Gemfileインストール', commands: ['bundle install'] },
      { label: 'パッケージインストール', commands: ['yarn install'] },
      { label: 'データベース準備', commands: ['bin/rails db:create db:schema:load'] },
      { label: '開発サーバー起動', commands: ['bin/rails s'] },
    ],
    previewUrl: 'http://localhost:3000/api-docs/index.html',
    devGuide: [
      { title: 'テストの実行', commands: 'bundle exec rspec' },
      {
        title: 'カバレッジレポートの生成',
        commands: 'COVERAGE=true bundle exec rspec',
      },
      {
        title: 'コードの静的解析と修正',
        commands:
          'yarn format\nyarn markdownlint\nbundle exec rubocop -A\nbundle exec brakeman\nbundle audit check --update\nyarn audit',
      },
      {
        title: 'バックグラウンドジョブの実行',
        commands: 'bundle exec sidekiq',
      },
    ],
    selectNumber: 6,
    selectLabel: 'Rails API - 実用',
  },
  {
    id: 'sinatra',
    title: 'template-sinatra',
    description: 'このリポジトリはSinatraのテンプレートプロジェクトです。',
    repoSlug: 'template-sinatra',
    npmStack: 'sinatra',
    gemfileStack: 'sinatra',
    extensionSets: ['base', 'ruby', 'erb'],
    setupSteps: [
      {
        label: 'データベース準備',
        commands: ['bundle exec rake db:setup', 'bundle exec rake db:seed'],
      },
      { label: '開発サーバー起動', commands: ['bundle exec ruby index.rb'] },
    ],
    previewUrl: 'http://localhost:4567',
    devGuide: [
      {
        title: 'マイグレーションファイルの追加',
        commands: 'bundle exec rake db:generate_migrate[ファイル名]',
      },
      {
        title: 'マイグレーションの実行',
        commands: 'bundle exec rake db:migrate',
      },
      { title: 'テストの実行', commands: 'bundle exec rspec' },
      {
        title: 'コードの静的解析と修正',
        commands:
          'yarn format\nbundle exec rubocop -A\nbundle exec erb_lint app/views/**/*.erb\nfind app/views -name "*.erb" -exec bundle exec htmlbeautifier {} \\;',
      },
    ],
  },
  {
    id: 'ruby',
    title: 'template-ruby',
    description: 'このリポジトリはRubyのテンプレートプロジェクトです。',
    repoSlug: 'template-ruby',
    npmStack: 'ruby',
    gemfileStack: 'ruby',
    extensionSets: ['base', 'ruby'],
    setupSteps: [],
    devGuide: [
      {
        title: 'コードの静的解析と修正',
        commands: 'yarn format\nbundle exec rubocop -A',
      },
    ],
  },
];
