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
  | 'php'
  | 'python'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'tooling';

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
    id: 'reactjs',
    title: 'template-reactjs',
    description:
      'このリポジトリは React + Vite のテンプレートプロジェクトです。',
    repoSlug: 'template-reactjs',
    npmStack: 'reactjs',
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
    id: 'laravel',
    title: 'template-laravel',
    description:
      'このリポジトリは Laravel（PHP）のテンプレートプロジェクトです。',
    repoSlug: 'template-laravel',
    extensionSets: ['base', 'php', 'tooling'],
    setupSteps: [
      {
        label: '環境変数と依存関係のセットアップ',
        commands: [
          'cp .env.example .env',
          'php artisan key:generate --force',
          'composer install --no-interaction',
        ],
      },
      {
        label: 'データベース準備（SQLite）',
        commands: ['touch database/database.sqlite', 'php artisan migrate'],
      },
      { label: '開発サーバー起動', commands: ['php artisan serve'] },
    ],
    previewUrl: 'http://localhost:8000',
    devGuide: [
      { title: 'テストの実行', commands: 'php artisan test' },
      {
        title: 'コードスタイル（Laravel Pint）',
        commands: './vendor/bin/pint',
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
    id: 'csharp',
    title: 'template-csharp',
    description:
      'このリポジトリは ASP.NET Core Minimal API（C#）のテンプレートプロジェクトです。',
    repoSlug: 'template-csharp',
    extensionSets: ['base', 'csharp'],
    setupSteps: [
      { label: 'パッケージの復元', commands: ['dotnet restore'] },
      { label: '開発サーバー起動', commands: ['dotnet run'] },
    ],
    previewUrl: 'http://localhost:5000',
    devGuide: [
      { title: 'テストの実行', commands: 'dotnet test' },
      { title: 'ビルド', commands: 'dotnet build' },
    ],
  },
  {
    id: 'go',
    title: 'template-go',
    description: 'このリポジトリは Go のテンプレートプロジェクトです。',
    repoSlug: 'template-go',
    extensionSets: ['base', 'go'],
    stackLibs: ['gin — 軽量 Web フレームワーク（Sinatra 的）'],
    setupSteps: [
      { label: '依存関係の取得（go.sum の生成）', commands: ['go mod tidy'] },
      { label: '開発サーバー起動', commands: ['go run .'] },
    ],
    previewUrl: 'http://localhost:8080',
    devGuide: [
      { title: 'ビルド', commands: 'go build ./...' },
      { title: 'リンター（golangci-lint）', commands: 'golangci-lint run' },
    ],
  },
  {
    id: 'rust',
    title: 'template-rust',
    description: 'このリポジトリは Rust のテンプレートプロジェクトです。',
    repoSlug: 'template-rust',
    extensionSets: ['base', 'rust'],
    stackLibs: [
      'axum — 軽量 Web フレームワーク（Sinatra 的）',
      'tokio — 非同期ランタイム',
    ],
    setupSteps: [
      { label: '開発サーバー起動', commands: ['cargo run'] },
    ],
    previewUrl: 'http://localhost:8080',
    devGuide: [
      { title: 'ビルド', commands: 'cargo build' },
      { title: 'フォーマットチェック', commands: 'cargo fmt --all -- --check' },
      {
        title: 'リンター（Clippy）',
        commands: 'cargo clippy --all-targets -- -D warnings',
      },
    ],
  },
  {
    id: 'django',
    title: 'template-django',
    description:
      'このリポジトリは Django（Python）のテンプレートプロジェクトです。',
    repoSlug: 'template-django',
    extensionSets: ['base', 'python'],
    stackLibs: ['Django — Python Web フレームワーク'],
    setupSteps: [
      {
        label: '仮想環境と依存関係のインストール',
        commands: [
          'python -m venv .venv',
          '. .venv/bin/activate && pip install -r requirements.txt',
        ],
      },
      {
        label: 'マイグレーション（任意）',
        commands: ['. .venv/bin/activate && python manage.py migrate'],
      },
      {
        label: '開発サーバー起動',
        commands: ['. .venv/bin/activate && python manage.py runserver'],
      },
    ],
    previewUrl: 'http://localhost:8000',
    devGuide: [
      {
        title: 'マイグレーションの作成',
        commands: '. .venv/bin/activate && python manage.py makemigrations',
      },
      {
        title: 'マイグレーションの実行',
        commands: '. .venv/bin/activate && python manage.py migrate',
      },
      {
        title: 'テストの実行',
        commands: '. .venv/bin/activate && python manage.py test',
      },
      {
        title: 'コードの静的解析（Ruff / Black）',
        commands: '. .venv/bin/activate && ruff check . && black --check .',
      },
    ],
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
];
