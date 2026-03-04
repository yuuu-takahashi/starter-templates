# starter-templates

各フレームワークのスターターテンプレートをまとめたモノレポです。

## テンプレート一覧

各テンプレートは [templates/](templates/) 配下にあります。**各フォルダはこのリポジトリから切り出して単体プロジェクトとして利用できます。**

| テンプレート | 概要 |
|------------|------|
| [templates/nodejs](templates/nodejs) | Node.js |
| [templates/nextjs](templates/nextjs) | Next.js（App Router） |
| [templates/react](templates/react) | React + Vite |
| [templates/rails](templates/rails) | Ruby on Rails |
| [templates/rails-api](templates/rails-api) | Rails API |
| [templates/ruby](templates/ruby) | Ruby |
| [templates/sinatra](templates/sinatra) | Sinatra |

## ファイルの正本について

`templates/` 以下のファイルは**スクリプトで自動生成**されます。直接編集しても次回の生成で上書きされます。
設定を変更する場合は [shared/](shared/) 配下のファイルを編集してください。

詳細は [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

## スクリプト

| コマンド | 役割 |
|---------|------|
| `yarn generate:all` | 全スクリプトをまとめて実行 |
| `yarn generate:configs` | 設定ファイルを生成（ESLint / Prettier / tsconfig / workflow など） |
| `yarn generate:deps` | `package.json` と `Gemfile` を生成 |
| `yarn generate:devcontainer` | Dev Container 設定を生成 |
| `yarn generate:ci` | ルートの CI ワークフローを生成 |

テンプレートの README を変更する場合は `scripts/template-readme-config.ts` を編集してから `yarn generate:configs` を実行してください。

## CI の管理

- **各テンプレートの `.github/workflows/`** — 正本。テンプレートを単体利用するときに使うファイルです。
- **ルートの `.github/workflows/code-check.yml`** — 上記から生成したモノレポ用ファイル（path フィルタ付き）。手動編集不要。ワークフローを変更したら `yarn generate:ci` で再生成してください。
