# template

各フレームワークのスターターテンプレートをまとめたリポジトリです。

## テンプレート一覧

各テンプレートは [templates/](templates/) 配下にあります。**各フォルダはこのリポジトリから切り出して単体プロジェクトとして利用できます**（[templates/README.md](templates/README.md) 参照）。

- **templates/nextjs** - Next.js (App Router)
- **templates/react** - React + Webpack
- **templates/rails** - Ruby on Rails
- **templates/rails-api** - Rails API
- **templates/sinatra** - Sinatra

各ディレクトリの README を参照して利用してください。

## CI の管理

- **正本**: 各テンプレート配下の `.github/workflows/code-check.yml`（例: `templates/nextjs/.github/workflows/code-check.yml`）。記事で共有する・eject でコピーするのはこれ。
- **ルートの `.github/workflows/code-check.yml`**: 上記から **生成** したファイル（モノレポ用の path フィルタ付き）。手で編集しないでください。
- テンプレートのワークフローを変更したら、ルートで次を実行してルートの workflow を更新してください:

  ```bash
  npm run generate:ci
  ```