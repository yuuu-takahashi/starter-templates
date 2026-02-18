# template

各フレームワークのスターターテンプレートをまとめたリポジトリです。

## テンプレート一覧

- **nextjs** - Next.js (App Router)
- **react** - React + Webpack
- **rails** - Ruby on Rails
- **rails-api** - Rails API
- **sinatra** - Sinatra

各ディレクトリの README を参照して利用してください。

## CI の管理

- **正本**: 各テンプレート配下の `.github/workflows/code-check.yml`（記事で共有する・eject でコピーするのはこれ）
- **ルートの `.github/workflows/code-check.yml`**: 上記から **生成** したファイル（モノレポ用の path フィルタ付き）。手で編集しないでください。
- テンプレートのワークフローを変更したら、ルートで次を実行してルートの workflow を更新してください:

  ```bash
  npm run generate:ci
  ```