# Contributing

このリポジトリへの変更方法をまとめたガイドです。

## リポジトリ構造

```
starter-templates/
├── scripts/          コード生成スクリプト
│   └── lib/          スクリプト共通ユーティリティ
├── shared/           正本（手動編集対象）
│   ├── devcontainer/ Dev Container 設定のソース
│   ├── docker/       Dockerfile のソース
│   ├── editorconfig/ .editorconfig のソース
│   ├── env/          .env.* のテンプレート
│   ├── eslint/       eslint.config.js のソース
│   ├── gemfile/      Gemfile のソース
│   ├── gitignore/    .gitignore のソース
│   ├── npm/          package.json のソース
│   ├── prettier/     .prettierrc のソース
│   ├── rspec/        .rspec の共通設定
│   ├── rubocop/      .rubocop.yml のソース
│   ├── tsconfig/     tsconfig.json のソース
│   ├── versions.json Node.js / Ruby バージョンの正本
│   ├── vitest/       vitest.config.ts のソース
│   └── workflows/    GitHub Actions ワークフローのソース
├── templates/        生成されたテンプレート（手動編集禁止）
│   ├── nextjs/
│   ├── nodejs/
│   ├── rails/
│   ├── rails-api/
│   ├── react/
│   ├── ruby/
│   └── sinatra/
└── languages/        言語別の補助設定（Ruby など）
```

## 正本 vs 生成ファイル

`templates/` 以下のファイルはすべてスクリプトで生成されます。**直接編集しても次回生成時に上書きされます。**

| ファイル | 正本（編集場所） | 生成スクリプト |
|---------|---------------|-------------|
| `templates/*/package.json` | `shared/npm/<stack>.json` | `generate-deps.ts` |
| `templates/*/Gemfile` | `shared/gemfile/Gemfile.<stack>` | `generate-deps.ts` |
| `templates/*/.editorconfig` | `shared/editorconfig/.editorconfig` | `gen-common-files.ts` |
| `templates/*/.gitignore` | `shared/gitignore/.gitignore.*` | `gen-common-files.ts` |
| `templates/*/.node-version` | `shared/versions.json` | `gen-common-files.ts` |
| `templates/*/.ruby-version` | `shared/versions.json` | `gen-common-files.ts` |
| `templates/*/eslint.config.js` | `shared/eslint/eslint.config.<stack>.js` | `gen-tool-configs.ts` |
| `templates/*/.prettierrc.json` | `shared/prettier/.prettierrc.ts` | `gen-tool-configs.ts` |
| `templates/*/tsconfig*.json` | `shared/tsconfig/<stack>/tsconfig*.ts` | `gen-tool-configs.ts` |
| `templates/*/vitest*.ts` | `shared/vitest/` | `gen-tool-configs.ts` |
| `templates/*/.rspec` | `shared/rspec/rspec.common` | `gen-ruby-configs.ts` |
| `templates/*/.rubocop.yml` | `shared/rubocop/rubocop.*.yml` | `gen-ruby-configs.ts` |
| `templates/*/.github/workflows/*.yml` | `shared/workflows/*.yml` | `gen-workflows.ts` |
| `templates/*/.github/dependabot.yml` | `shared/workflows/dependabot.yml` | `gen-workflows.ts` |
| `templates/*/.env.*` | `shared/env/` | `gen-workflows.ts` |
| `templates/*/README.md` | `scripts/template-readme-config.ts` | `gen-readme.ts` |
| `templates/*/.devcontainer/` | `shared/devcontainer/`, `shared/docker/` | `generate-devcontainer.ts` |
| `.github/workflows/code-check.yml` | `scripts/generate-root-workflow.ts` | `generate-root-workflow.ts` |

## スクリプト一覧

| コマンド | スクリプト | 役割 |
|---------|-----------|------|
| `yarn generate:all` | — | 以下をすべて順番に実行 |
| `yarn generate:ci` | `generate-root-workflow.ts` | ルートの CI ワークフローを生成 |
| `yarn generate:devcontainer` | `generate-devcontainer.ts` | Dev Container 設定を生成 |
| `yarn generate:configs` | `generate-configs.ts` | 設定ファイル全般を生成（エントリポイント） |
| `yarn generate:deps` | `generate-deps.ts` | package.json と Gemfile を生成 |

`generate-configs.ts` は以下のモジュールを呼び出します：

- `gen-common-files.ts` — .editorconfig / .gitignore / .node-version / .ruby-version
- `gen-tool-configs.ts` — ESLint / Prettier / tsconfig / Vitest
- `gen-ruby-configs.ts` — .rubocop.yml / .rspec
- `gen-workflows.ts` — GitHub Actions ワークフロー / dependabot / .env.*
- `gen-readme.ts` — README.md

## よくある変更シナリオ

### ESLint 設定を変更する場合

1. `shared/eslint/eslint.config.<stack>.js` を編集
2. `yarn generate:configs` を実行

### package.json を更新する場合

1. `shared/npm/<stack>.json` を編集
2. `yarn generate:deps` を実行

### バージョン（Node.js / Ruby）を変更する場合

1. `shared/versions.json` を編集
2. `yarn generate:configs` を実行（.node-version / .ruby-version に反映）
3. 必要に応じて `shared/docker/` 内の Dockerfile も更新し `yarn generate:devcontainer` を実行

### Gemfile を更新する場合

1. `shared/gemfile/Gemfile.<stack>` を編集
2. `yarn generate:deps` を実行

### Prettier / tsconfig などのツール設定を変更する場合

1. `shared/prettier/`, `shared/tsconfig/`, `shared/vitest/` 内の該当ファイルを編集
2. `yarn generate:configs` を実行

### README を更新する場合

1. `scripts/template-readme-config.ts` を編集（テンプレートごとのメタデータ）
2. `yarn generate:configs` を実行

## 新テンプレート追加手順

例として `templates/mystack` を追加する場合：

1. **`shared/npm/mystack.json`** を作成（package.json のソース）
2. **`shared/eslint/eslint.config.mystack.js`** を作成（必要な場合）
3. **`scripts/generate-deps.ts`** の `NPM_STACKS` に `"mystack"` を追加
4. **`scripts/lib/utils.ts`** の `SHARED_CONFIG_STACKS` に `"templates/mystack"` を追加（Prettier / editorconfig 配布対象にする場合）
5. **`scripts/gen-common-files.ts`** の `GITIGNORE_SOURCE` / バージョン配布先リストに追加
6. **`scripts/gen-tool-configs.ts`** に ESLint / tsconfig などの生成処理を追加
7. **`scripts/gen-workflows.ts`** に CI ワークフロー生成処理を追加
8. **`scripts/template-readme-config.ts`** の `TEMPLATE_README_CONFIGS` にエントリを追加
9. **`scripts/generate-root-workflow.ts`** にルート CI への追加が必要か確認
10. `templates/mystack/` に手動で管理する残りのファイルを配置
11. `yarn generate:all` を実行して動作確認
