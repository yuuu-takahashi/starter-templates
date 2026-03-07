# starter-templates

各フレームワークのスターターテンプレートをまとめたモノレポです。新規プロジェクトは `yarn create-project` でテンプレートを選んで作成できます。

## 使い方

### 新規プロジェクトを作る

1. **リポジトリをクローンする**

   ```bash
   git clone git@github.com:yuuu-takahashi/starter-templates.git
   cd starter-templates
   ```

2. **`yarn create-project` でテンプレートを選び、プロジェクトを作成**

   ```bash
   yarn create-project
   ```

   番号でテンプレートを選び、作成先のパス（例: `../my-app`）を入力すると、選んだテンプレートがコピーされます。コピー先には **ESLint・Prettier・Dev Container・CI（GitHub Actions）** などが含まれており、表示されるコマンドで依存関係をインストールして開発を始めてください。

3. **代替: テンプレートを直接使う**  
   Dev Container で開く場合は、クローンしたリポジトリ内の `minimal-templates/<テンプレート名>` を開いてもかまいません。

## テンプレートの種類

| ディレクトリ | 用途 |
| ----------- | ---- |
| [minimal-templates/](minimal-templates/) | **最低限** — 最小構成。スクリプトで自動生成され、共通設定の正本は [shared/](shared/) にあります。 |
| [full-templates/](full-templates/) | **実用** — すぐ使える形に整えたテンプレート。手動管理。現在整備中です。 |

## テンプレート一覧（minimal-templates/）

各テンプレートは [minimal-templates/](minimal-templates/) 配下にあります。**各フォルダはこのリポジトリから切り出して単体プロジェクトとして利用できます。**

| テンプレート | 概要 |
| ---------- | ---- |
| [minimal-templates/nodejs](minimal-templates/nodejs) | Node.js |
| [minimal-templates/nextjs](minimal-templates/nextjs) | Next.js（App Router） |
| [minimal-templates/reactjs](minimal-templates/reactjs) | React + Vite |
| [minimal-templates/rails](minimal-templates/rails) | Ruby on Rails |
| [minimal-templates/rails-api](minimal-templates/rails-api) | Rails API |
| [minimal-templates/laravel](minimal-templates/laravel) | Laravel（PHP） |
| [minimal-templates/sinatra](minimal-templates/sinatra) | Sinatra |
| [minimal-templates/csharp](minimal-templates/csharp) | ASP.NET Core Minimal API（C#） |
| [minimal-templates/go](minimal-templates/go) | Go（Gin） |
| [minimal-templates/rust](minimal-templates/rust) | Rust（Axum） |
| [minimal-templates/django](minimal-templates/django) | Django（Python） |

## ファイルの正本について

`minimal-templates/` 以下のファイルは**スクリプトで自動生成**されます。直接編集しても次回の生成で上書きされます。
設定を変更する場合は [shared/](shared/) 配下のファイルを編集してください。

## スクリプト

| コマンド | 役割 |
| ------- | ---- |
| `yarn create-project` | テンプレートを対話で選び、指定先にコピーする（新規プロジェクト用） |
| `yarn generate:all` | 全スクリプトをまとめて実行 |
| `yarn generate:configs` | 設定ファイルを生成（ESLint / Prettier / tsconfig / workflow など） |
| `yarn generate:deps` | `package.json` と `Gemfile` を生成 |
| `yarn generate:devcontainer` | Dev Container 設定を生成 |
| `yarn generate:ci` | ルートの CI ワークフローを生成 |
| `yarn lint` | `scripts/` 配下の TypeScript を ESLint でチェック |
| `yarn lint:fix` | ESLint の自動修正 |
| `yarn format` | Prettier で `scripts/**/*.ts` をフォーマット |

テンプレートの README を変更する場合は `scripts/template-readme-config.ts` を編集してから `yarn generate:configs` を実行してください。

## CI の管理

- **各テンプレートの `.github/workflows/`** — 正本。テンプレートを単体利用するときに使うファイルです。
- **ルートの `.github/workflows/code-check.yml`** — 上記から生成したモノレポ用ファイル（path フィルタ付き）。手動編集不要。ワークフローを変更したら `yarn generate:ci` で再生成してください。

---

## Contributing

このリポジトリへの変更方法をまとめたガイドです。

### 変更の流れ

1. ブランチを切って変更する
2. `yarn generate:all` を実行し、正本（`shared/`）から生成されるファイルに変更がある場合はコミットに含める
3. `yarn lint` でスクリプトの lint を通過させる
4. PR を作成する

### 正本のルール

- **編集する場所**: `minimal-templates/` 以下のファイルはスクリプトで生成されるため、**直接編集しない**。設定を変える場合は [shared/](shared/) 配下の該当ファイルを編集する。
- **生成の実行順序**: `yarn generate:all` は `generate:configs` → `generate:deps` → `generate:ci` → `generate:devcontainer` の順で実行される。ルートの `code-check.yml` は各テンプレートの workflow を組み合わせて生成されるため、テンプレートの workflow を変えたあとに `generate:ci` が必要。

### スタック一覧の管理

テンプレート・スタックの一覧は **`scripts/lib/stacks.ts`** で一元管理している。新規テンプレートを追加するときは、まずここにエントリを追加し、必要に応じて他のスクリプト（`gen-tool-configs.ts`、`generate-devcontainer.ts` など）を足す。詳細は [新テンプレート追加手順](#新テンプレート追加手順) を参照。

### リポジトリ構造

```text
starter-templates/
├── scripts/          コード生成スクリプト
│   └── lib/          スクリプト共通ユーティリティ
├── shared/           正本（手動編集対象）
│   ├── devcontainer/ Dev Container 設定のソース
│   ├── docker/       Dockerfile のソース
│   ├── editorconfig/ .editorconfig のソース
│   ├── eslint/       eslint.config.js のソース
│   ├── gemfile/      Gemfile のソース
│   ├── gitignore/    .gitignore のソース
│   ├── npm/          package.json のソース
│   ├── prettier/     .prettierrc のソース
│   ├── rspec/        .rspec の共通設定
│   ├── rubocop/      .rubocop.yml のソース
│   ├── laravel/      Laravel Pint・PHPUnit のソース
│   ├── tsconfig/     tsconfig.json のソース
│   ├── versions.json Node.js / Ruby バージョンの正本
│   ├── vitest/       vitest.config.ts のソース
│   └── workflows/    GitHub Actions ワークフローのソース
├── minimal-templates/ 最低限（スクリプト生成・手動編集禁止）
│   ├── nextjs/
│   ├── nodejs/
│   ├── reactjs/
│   ├── rails/
│   ├── rails-api/
│   ├── laravel/
│   ├── sinatra/
│   ├── csharp/
│   ├── go/
│   ├── rust/
│   └── django/
└── full-templates/   実用（すぐ使える・手動管理）
```

### 正本 vs 生成ファイル

`minimal-templates/` 以下の多くはスクリプトで生成されます。**生成されるファイルは直接編集すると次回生成で上書きされます。** 一方、フレームワーク別（next.config.ts, vite.config.ts, Laravel の pint/phpunit, C# の .csproj/.sln 等）は **minimal-templates/<stack>/ 直下を正本として直接編集**します。

| ファイル | 正本（編集場所） | 生成スクリプト |
| ------- | ------------- | ----------- |
| `minimal-templates/*/package.json` | `shared/npm/<stack>.json` | `generate-deps.ts` |
| `minimal-templates/*/Gemfile` | `shared/gemfile/Gemfile.<stack>` | `generate-deps.ts` |
| `minimal-templates/csharp/global.json` の sdk.version | `shared/versions.json` の `dotnet` で上書き | `generate-deps.ts` |
| `minimal-templates/nextjs/next.config.ts` | **minimal-templates/nextjs/** を直接編集 | — |
| `minimal-templates/reactjs/vite.config.ts` | **minimal-templates/reactjs/** を直接編集 | — |
| `minimal-templates/laravel/pint.json`, `phpunit.xml` | **minimal-templates/laravel/** を直接編集 | — |
| `minimal-templates/csharp/*.csproj`, `global.json`, `*.sln` | **minimal-templates/csharp/** を直接編集 | — |
| `minimal-templates/*/.editorconfig` | `shared/lint-format/editorconfig/.editorconfig` | `gen-common-files.ts` |
| `minimal-templates/*/.gitignore` | `shared/gitignore/.gitignore.*` | `gen-common-files.ts` |
| `minimal-templates/*/.node-version` | `shared/versions.json` | `gen-common-files.ts` |
| `minimal-templates/*/.ruby-version` | `shared/versions.json` | `gen-common-files.ts` |
| `minimal-templates/*/eslint.config.js` | `shared/lint-format/eslint/eslint.config.<stack>.js` | `gen-tool-configs.ts` |
| `minimal-templates/*/.prettierrc.json` | `shared/lint-format/prettier/.prettierrc.ts` | `gen-tool-configs.ts` |
| `minimal-templates/*/tsconfig*.json` | `shared/tsconfig/<stack>/tsconfig*.ts` | `gen-tool-configs.ts` |
| `minimal-templates/*/vitest*.ts` | `shared/test/vitest/` | `gen-tool-configs.ts` |
| `minimal-templates/*/.rspec` | `shared/test/rspec/rspec.common` | `gen-ruby-configs.ts` |
| `minimal-templates/*/.rubocop.yml` | `shared/lint-format/rubocop/rubocop.*.yml` | `gen-ruby-configs.ts` |
| `minimal-templates/*/.github/workflows/*.yml` | `shared/workflows/*.yml` | `gen-workflows.ts` |
| `minimal-templates/*/.github/dependabot.yml` | `shared/workflows/dependabot.yml` | `gen-workflows.ts` |
| `minimal-templates/*/README.md` | `scripts/template-readme-config.ts` | `gen-readme.ts` |
| `minimal-templates/*/.devcontainer/` | `shared/devcontainer/`, `shared/docker/` | `generate-devcontainer.ts` |
| `.github/workflows/code-check.yml` | `scripts/generate-root-workflow.ts` | `generate-root-workflow.ts` |

### スクリプト一覧（詳細）

| コマンド | スクリプト | 役割 |
| ------- | --------- | ---- |
| `yarn generate:all` | — | configs → deps → ci → devcontainer の順で実行（テンプレートの workflow を生成してからルート CI を組み立てる） |
| `yarn generate:ci` | `generate-root-workflow.ts` | ルートの CI ワークフローを生成 |
| `yarn generate:devcontainer` | `generate-devcontainer.ts` | Dev Container 設定を生成 |
| `yarn generate:configs` | `generate-configs.ts` | 設定ファイル全般を生成（エントリポイント） |
| `yarn generate:deps` | `generate-deps.ts` | package.json / Gemfile / Go / Rust を生成。C# は global.json の sdk 版のみ上書き |

`generate-configs.ts` は以下のモジュールを呼び出します：

- `gen-common-files.ts` — .editorconfig / .gitignore / .node-version / .ruby-version / .go-version
- `gen-tool-configs.ts` — ESLint / Prettier / tsconfig / Vitest
- `gen-ruby-configs.ts` — .rubocop.yml / .rspec
- `gen-workflows.ts` — GitHub Actions ワークフロー / dependabot
- `gen-readme.ts` — README.md

### よくある変更シナリオ

- **ESLint 設定を変更する場合**: `shared/lint-format/eslint/eslint.config.<stack>.js` を編集 → `yarn generate:configs`
- **package.json を更新する場合**: `shared/npm/<stack>.json` を編集 → `yarn generate:deps`
- **バージョン（Node.js / Ruby）を変更する場合**: `shared/versions.json` を編集 → `yarn generate:configs`（必要に応じて `shared/docker/` も更新し `yarn generate:devcontainer`）
- **Gemfile を更新する場合**: `shared/gemfile/Gemfile.<stack>` を編集 → `yarn generate:deps`
- **Prettier / tsconfig などのツール設定を変更する場合**: `shared/lint-format/prettier/`, `shared/tsconfig/`, `shared/test/vitest/` 内の該当ファイルを編集 → `yarn generate:configs`
- **Next.js / React / Laravel / C# のフレームワーク設定を変更する場合**: `minimal-templates/nextjs/`, `minimal-templates/reactjs/`, `minimal-templates/laravel/`, `minimal-templates/csharp/` 内の該当ファイルを直接編集（生成されない）
- **README を更新する場合**: `scripts/template-readme-config.ts` を編集 → `yarn generate:configs`

### 新テンプレート追加手順

例として `minimal-templates/mystack` を追加する場合：

1. **`shared/npm/mystack.json`** を作成（package.json のソース）
2. **`shared/lint-format/eslint/eslint.config.mystack.js`** を作成（必要な場合）
3. **`scripts/lib/stacks.ts`** にエントリを追加（`TEMPLATE_DIRS` / `NPM_STACKS` / `GITIGNORE_SOURCE` / `CODE_CHECK_SOURCE` / `NODE_VERSION_DIRS` など、必要なもの）
4. **`scripts/gen-tool-configs.ts`** に ESLint / tsconfig などの生成処理を追加
5. **`scripts/template-readme-config.ts`** の `TEMPLATE_README_CONFIGS` にエントリを追加
6. **`scripts/generate-devcontainer.ts`** の `STACKS` に devcontainer 用のエントリを追加（必要な場合）
7. **`scripts/generate-root-workflow.ts`** は `stacks.ts` の `ROOT_STACKS` を参照するため、`stacks.ts` に追加すれば自動でルート CI に含まれる
8. `minimal-templates/mystack/` に手動で管理する残りのファイルを配置
9. `yarn generate:all` を実行して動作確認
