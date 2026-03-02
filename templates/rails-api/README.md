# template-rails-api

このリポジトリはRuby on Railsのテンプレートプロジェクトです。
このプロジェクトは、[Dev Container](https://code.visualstudio.com/docs/devcontainers/containers)での利用を想定した構成になっています。

## ディレクトリ構成

TODO:

```bash
tree -I 'vendor|node_modules|tmp'
```

## 開発環境構築

### 必要なツール

- [VS Code](https://code.visualstudio.com/)
- [Docker](https://www.docker.com/ja-jp/)
- VS Codeの[Dev Containers拡張機能](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

1. リポジトリをクローン

   ```bash
   git clone git@github.com:yuuu-takahashi/template-rails-api.git
   cd template-rails-api
   ```

2. 環境変数の設定

   ```bash
   cp example.env .env.development
   ```

3. VS Codeのの左下「><」アイコンをクリックし、「Remote-Containers: Reopen in Container」を選択し、起動

4. データベース準備

   ```bash
   bin/rails db:prepare
   ```

5. 開発サーバー起動

   ```bash
   bin/rails s
   ```

ブラウザで <http://localhost:3000/api-docs/index.html> を開き、APIドキュメント表示確認

## 開発作業ガイド

### APIドキュメント生成

```bash
bundle exec rake rswag:specs:swaggerize
```

TODO:
