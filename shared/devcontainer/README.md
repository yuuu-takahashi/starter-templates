# devcontainer 共通定義

devcontainer で使う VSCode 拡張機能と設定の共通定義です。`scripts/generate-devcontainer.ts` がこのディレクトリの `defaults.json` を読み、各テンプレートの `.devcontainer/devcontainer.json` を生成します。

## ファイル

- **defaults.json** — 拡張機能グループ（`extensions`）と VSCode 設定（`settings`）の定義
  - `extensions.base` … 全テンプレート共通（Prettier など）
  - `extensions.node` … Node/JS 用（ESLint など）
  - `extensions.ruby` … Ruby 用
  - `extensions.erb` … ERB 用
  - `extensions.tooling` … Git・Markdown・スペルチェックなど（Rails テンプレートなどで利用）
  - `settings.base` / `settings.ruby` / `settings.erb` … 各言語・フォーマット用の設定

## 反映

`defaults.json` を編集したあとは、リポジトリルートで次を実行してください。

```bash
yarn generate:devcontainer
```

各テンプレートの `.devcontainer/devcontainer.json` が更新されます。
