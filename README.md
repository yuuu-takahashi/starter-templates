# starter-templates

各フレームワークのスターターテンプレートをまとめたモノレポです。新規プロジェクトは `yarn create-project` でテンプレートを選んで作成できます。

## 使い方

### ローカル環境の準備（ローカルで実行する場合）

このリポジトリで `yarn create-project` や `yarn generate:all` などを**ローカルで実行する**には、Node.js と Yarn が必要です。Dev Container で開く場合は不要です。

- **Node.js**（推奨: v22 以上。テンプレートは Node 24 を想定）

  - [nodejs.org](https://nodejs.org/ja/) から LTS をインストールする
  - または [nodenv](https://github.com/nodenv/nodenv) を使う場合:

    ```bash
    # nodenv の例（rbenv と同じ思想。Rails などと合わせて使いやすい）
    nodenv install 24
    nodenv local 24
    ```

- **Yarn**

  Node.js に同梱の **Corepack** で有効化する方法（推奨）:

  ```bash
  corepack enable
  yarn --version   # 利用可能か確認
  ```

  または npm でグローバルにインストール:

  ```bash
  npm install -g yarn
  ```

- **依存関係のインストール**

  リポジトリのルートで:

  ```bash
  yarn install
  ```

### Dev Container（リポジトリルート）

モノレポ全体を Dev Containers で開く場合は、クローンしたリポジトリの**ルート**を開き、エディタの **Reopen in Container** から起動できます。ビルド定義の正本は [shared/docker/Dockerfile.ruby-monorepo](shared/docker/Dockerfile.ruby-monorepo) で、Ruby 3.3・Node.js 24・Yarn・Claude Code CLI（他テンプレートの `Dockerfile.ruby` と同系）が入ります。コンテナ作成後に `yarn install` が自動で走ります。Ruby テンプレート用の gem は各プロジェクトで `bundle config set --local path vendor/bundle` のあと `bundle install`（または `yarn setup:templates`）が必要です。設定を変えたら [scripts/generate-devcontainer.ts](scripts/generate-devcontainer.ts) を編集し、`yarn generate:devcontainer` を実行してください。

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
   Dev Container で開く場合は、クローンしたリポジトリ内の `minimal-templates/<テンプレート名>` または `full-templates/<テンプレート名>` を開いてもかまいません。

## テンプレートの種類

| ディレクトリ | 用途 |
| ----------- | ---- |
| [minimal-templates/](minimal-templates/) | **最低限** — 最小構成。スクリプトで自動生成され、共通設定の正本は [shared/](shared/) にあります。 |
| [full-templates/](full-templates/) | **実用** — すぐ使える形に整えたテンプレート。スクリプトで自動生成され、設定の正本は [shared/](shared/) にあります。 |

## テンプレート一覧（minimal-templates/）

各テンプレートは [minimal-templates/](minimal-templates/) 配下にあります。**各フォルダはこのリポジトリから切り出して単体プロジェクトとして利用できます。**

| テンプレート | 概要 |
| ---------- | ---- |
| [minimal-templates/nodejs](minimal-templates/nodejs) | Node.js |
| [minimal-templates/nextjs](minimal-templates/nextjs) | Next.js（App Router） |
| [minimal-templates/react](minimal-templates/react) | React + Vite |
| [minimal-templates/rails](minimal-templates/rails) | Ruby on Rails |
| [minimal-templates/rails-api](minimal-templates/rails-api) | Rails API |
| [minimal-templates/laravel](minimal-templates/laravel) | Laravel（PHP） |
| [minimal-templates/sinatra](minimal-templates/sinatra) | Sinatra |
| [minimal-templates/csharp](minimal-templates/csharp) | ASP.NET Core Minimal API（C#） |
| [minimal-templates/go](minimal-templates/go) | Go（Gin） |
| [minimal-templates/rust](minimal-templates/rust) | Rust（Axum） |
| [minimal-templates/django](minimal-templates/django) | Django（Python） |

## テンプレート一覧（full-templates/）

各テンプレートは [full-templates/](full-templates/) 配下にあります。Storybook・E2E・Lighthouse など実運用を想定したツールが含まれます。

| テンプレート | 概要 |
| ---------- | ---- |
| [full-templates/nextjs](full-templates/nextjs) | Next.js（App Router）+ Storybook / Vitest / Playwright / Lighthouse CI |

## ファイルの正本について

`minimal-templates/` と `full-templates/` 以下の生成対象ファイルは**スクリプトで自動生成**されます。直接編集しても次回の生成で上書きされます。
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
