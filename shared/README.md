# shared/ — テンプレート共有設定

このディレクトリは、すべてのテンプレート（`minimal-templates/` と `full-templates/`）で共有される設定ファイルのソースです。

**重要：** `shared/` 内のファイルは手編集してください。`templates/` 内のファイルは自動生成されるため、直接編集しないでください。

## ディレクトリ構造

```
shared/
├── config/                     # 設定ファイル全般
│   ├── lint-format/            # ESLint・Prettier・Rubocop・Markuplint・Markdownlint
│   ├── test/                   # テストツール設定（Vitest・RSpec・Playwright・Mock）
│   ├── tsconfig/               # TypeScript 設定
│   ├── devcontainer/           # 開発コンテナのデフォルト設定
│   └── docker/                 # Dockerfile・docker-compose・.dockerignore
├── dependencies/               # 依存管理
│   ├── npm/                    # npm package.json テンプレート
│   └── gemfile/                # Ruby Gem 定義ファイル
├── ci/                         # CI/CD 設定
│   ├── workflows/              # GitHub Actions ワークフロー
│   └── actions/                # GitHub Actions の再利用可能アクション
├── templates/                  # テンプレートテキスト
│   ├── gitignore/              # .gitignore テンプレート
│   ├── readme/                 # README.md テンプレート
│   └── docker/                 # Dockerfile テンプレート（共有イメージ定義）
├── framework-specific/         # フレームワーク固有設定
│   ├── sentry/                 # Sentry 設定
│   ├── knip/                   # knip（不使用ファイル検出）設定
│   ├── lighthouse/             # Lighthouse CI 設定
│   └── playwright/             # Playwright E2E テスト仕様
└── versions.json               # Node.js・Ruby バージョン定義
```

## 生成スクリプト

すべてのテンプレートへの生成は自動化されています：

```bash
# 全設定を生成
yarn generate:all

# 特定の生成のみ
yarn generate:configs     # 共有設定
yarn generate:deps        # package.json・Gemfile
yarn generate:ci          # ルート CI
yarn generate:devcontainer # .devcontainer
```

詳細は [scripts/README.md](../scripts/README.md) を参照。

## ファイル管理ガイド

### config/devcontainer/

VS Code Dev Container のデフォルト設定。
- `defaults.json` — 拡張機能・設定・フィーチャ定義

### config/docker/

コンテナイメージ・構成定義。

**Dockerfile:**
- `Dockerfile.node` — Node.js 環境
- `Dockerfile.ruby` — Ruby 環境
- `Dockerfile.php` / `Dockerfile.python` / `Dockerfile.go` / `Dockerfile.rust` / `Dockerfile.dotnet` — 各言語

**docker-compose:**
- `docker-compose.ruby-db.yml` — MySQL 付き（sinatra, rails-api）
- `docker-compose.rails.yml` — SQLite のみ（rails）

**.dockerignore:**
- `dockerignore.<framework>` — ビルドコンテキスト除外設定

**init-firewall.sh:**
- WSL2 / Mac M-series での Dev Container ネットワーク初期化

### config/lint-format/

**eslint/:**
- `eslint.config.nodejs.js` — nodejs
- `eslint.config.react.js` — react
- `eslint.config.nextjs.js` — nextjs（minimal）
- `eslint.config.nextjs-full.js` — nextjs（full）
- `eslint.config.rails.js` — rails

**prettier/:**
- `.prettierrc.ts` — Node.js テンプレート共通

**rubocop/:**
- `rubocop.base.yml` — 基本設定
- `rubocop.rails.yml` / `rubocop.rails_api.yml` / `rubocop.sinatra.yml` / `rubocop.ruby.yml` / `rubocop.pure-ruby.yml`

**markuplint/:**
- `.markuplintrc.react.json` — React 向け HTML 検証

**markdownlint/:**
- `.markdownlint.json` — Markdown 検証

**editorconfig/:**
- `.editorconfig` — エディタ基本設定

### config/test/

テストツール設定。

**vitest/:**
- `vitest.config.react-ts.ts` / `vitest.config.react-ts.minimal.ts`
- `vitest.setup.ts` / `vitest.setup.minimal.ts`
- `vitest-env.d.ts` — 型定義

**rspec/:**
- `rspec.common` — Rails・Sinatra・Ruby 共通設定

**mocks/:**
- `handlers.ts` — MSW（Mock Service Worker）ハンドラ
- `server.ts` — MSW サーバー設定

### config/tsconfig/

TypeScript 設定ファイル。
- `nextjs/tsconfig.ts` — Next.js テンプレート
- `react/tsconfig.*.ts` — React テンプレート（root / app / node）
- `rails/tsconfig.ts` — Rails テンプレート

### dependencies/gemfile/

Ruby Gem 定義。
- `Gemfile.rails` / `Gemfile.rails_api` / `Gemfile.sinatra` / `Gemfile.ruby`

### dependencies/npm/

package.json テンプレート。
- `nextjs.json` / `react.json` / `nodejs.json` — Node.js フレームワーク
- `rails.json` / `rails.json` / `sinatra.json` / `ruby.json` — Rails・Ruby
- `<framework>-full.diff.json` — full-templates 追加パッケージ

### ci/actions/

GitHub Actions の再利用可能アクション。
- `setup-node-yarn/action.yml` — Node.js・yarn セットアップ
- `setup-ruby-bundle/action.yml` — Ruby・bundler セットアップ

### ci/workflows/

GitHub Actions ワークフロー。

**基本:**
- `static-analysis.yml` — ESLint / Prettier / Rubocop（全テンプレート）
- `code-check-*.yml` — フレームワーク別コード品質チェック
- `test-*.yml` — フレームワーク別テスト実行
- `dependabot.yml` — 依存パッケージ更新

**full-templates 向け:**
- `ci-nextjs-full.yml` / `ci-e2e-nextjs.yml` / `ci-lighthouse-nextjs.yml` — Next.js E2E・Lighthouse

### templates/gitignore/

.gitignore テンプレート。
- `gitignore.node` / `gitignore.rails` / `gitignore.ruby` など

### templates/readme/

README.md テンプレート。
- `README.md.hbs` — Handlebars テンプレート
- `npm-descriptions.json` — npm パッケージ説明
- `gem-descriptions.json` — Gem 説明
- `extension-descriptions.json` — VS Code 拡張機能説明

### framework-specific/lighthouse/

Lighthouse CI 設定。
- `.lighthouserc.js` — Lighthouse CI 設定

### framework-specific/knip/

不使用ファイル検出ツール（knip）設定。
- `knip.config.nextjs.ts` — Next.js テンプレート向け

### framework-specific/playwright/

Playwright E2E テスト仕様。
- `specs/top.spec.ts` — トップページテスト例
- `playwright.config.nextjs.ts` — Next.js テンプレート向け設定

### framework-specific/sentry/

Sentry エラートラッキング設定。
- `instrumentation.nextjs.ts` — Next.js 計測設定
- `sentry.config.nextjs.ts` — 基本設定
- `sentry.client.config.nextjs.ts` — クライアント設定
- `sentry.server.config.nextjs.ts` — サーバー設定
- `sentry.edge.config.nextjs.ts` — Edge Runtime 設定

## テンプレート対応関係

生成対象テンプレートの定義は `scripts/lib/stacks.ts` で管理：

```typescript
{
  dir: 'minimal-templates/rails',
  fullDir: 'full-templates/rails',
  id: 'rails',
  codeCheckWorkflow: 'code-check-ruby-erb.yml',
  testWorkflow: 'test-rails.yml',
  gitignore: '.gitignore.rails',
  ...
}
```

新しいフレームワーク追加時：
1. `scripts/lib/stacks.ts` に `StackDefinition` を追加
2. `shared/` に必要なファイルを追加
3. 生成スクリプト（`scripts/gen-*.ts`）を更新

## 編集ガイドライン

### ✅ DO: こうしましょう
- `shared/` 内でファイルを編集
- テンプレート間で共有する設定値はここに集約
- ファイル変更後は `yarn generate:all` で反映

### ❌ DON'T: こうしないで
- `templates/` 内で直接編集（自動生成で上書きされます）
- 一部テンプレートのみ異なる設定にしたい場合は `shared/` でファイル分割

## よくある質問

**Q: Rails と Rails API で異なる設定を使いたい**
A: `shared/` でファイルを分けます。例：`shared/config/lint-format/rubocop/rubocop.rails.yml` と `rubocop.rails_api.yml`

**Q: 新しいツール（例：Biome）を追加したい**
A: `shared/config/lint-format/` に新規ディレクトリを作成し、生成スクリプトを更新

**Q: テンプレート固有の設定がしたい**
A: `shared/` で管理せず、テンプレート内で手編集してください
