# template-sinatra

このリポジトリはSinatraのテンプレートプロジェクトです。
このプロジェクトは、[Dev Container](https://code.visualstudio.com/docs/devcontainers/containers)での利用を想定した構成になっています。

## ディレクトリ構成

```bash
tree -I 'vendor|node_modules'
.
├── Gemfile                      # Rubyの依存関係を定義
├── Gemfile.lock                 # 依存関係のバージョン
├── Rakefile                     # Rakeタスクを定義
├── app                          # アプリケーションの主要ロジック
│   ├── controllers              # コントローラー：リクエスト/レスポンス処理
│   └── models                   # モデル：ビジネスロジックやDB操作
├── config                       # 環境設定ファイル
│   ├── environment.rb           # 環境変数などの設定
│   └── routes.rb                # アプリのルーティング
├── db                           # データベース関連
│   ├── migrate                  # マイグレーションファイル
│   ├── schema.rb                # データベーススキーマ
│   ├── seeds                    # 初期データを投入するファイル
│   ├── setup.rb                 # DBセットアップ処理
│   └── utilities.rb             # DBユーティリティ関数など
├── index.rb                     # エントリーポイント
├── lib                          # 共通ライブラリ
│   └── database_client.rb       # DBクライアント処理
├── package.json                 # Node.jsの依存関係を定義
├── spec                         # テストコード
│   ├── controllers              # コントローラーのテスト
│   ├── factories                # テストデータ生成用FactoryBot設定
│   ├── models                   # モデルのテスト
│   ├── spec_helper.rb           # RSpecの設定
└── yarn.lock                    # 依存関係のバージョン
```

## 開発環境構築

## 必要なツール

- [VS Code](https://code.visualstudio.com/)
- [Docker](https://www.docker.com/ja-jp/)
- VS Codeの[Dev Containers拡張機能](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### 開発環境の準備

1. リポジトリをクローン

   ```bash
   git clone git@github.com:yuuu-takahashi/template-sinatra.git
   cd template-sinatra
   ```

2. 環境変数の設定

   ```bash
   cp example.env .env.development
   ```

3. VS Codeのの左下「><」アイコンをクリックし、「Remote-Containers: Reopen in Container」を選択し、起動

4. データベース準備

   ```bash
   bundle exec rake db:setup
   bundle exec rake db:seed
   ```

5. 開発サーバー起動

   ```bash
   bundle exec ruby index.rb
   ```

ブラウザで <http://localhost:4567> を開き、表示確認

## 開発作業ガイド

- マイグレーションファイルの追加

```bash
bundle exec rake db:generate_migrate[ファイル名]
```

例: usersテーブル作成用のマイグレーションファイルを生成する場合

```bash
bundle exec rake db:generate_migrate[create_users]
```

- マイグレーションの実行

```bash
bundle exec rake db:migrate
```

- テストの実行

```bash
bundle exec rspec
```

- コードの静的解析と修正

```bash
yarn format
bundle exec rubocop -A
bundle exec erb_lint app/views/**/*.erb
find app/views -name "*.erb" -exec bundle exec htmlbeautifier {} \;
```

## トラブルシューティング

TODO:
