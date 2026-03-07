<!-- Format aligned with minimal-templates/nextjs/README.md — edit shared/readme for generated templates -->

# template-nextjs

このリポジトリは Next.js のテンプレートプロジェクトです。Storybook・E2E（Playwright）・Lighthouse CI などを含む実用向け構成です。
このプロジェクトは、[Dev Container](https://code.visualstudio.com/docs/devcontainers/containers)での利用を想定した構成になっています。VS Code・Cursor のどちらでも利用できます。

## 主なライブラリ・Gem・拡張機能

### 主な npm パッケージ

（本番依存）

- next — React フルスタックフレームワーク
- react — UI ライブラリ
- react-dom — React の DOM レンダラー
- @next/third-parties — Next.js サードパーティ統合
- @sentry/nextjs — Sentry エラートラッキング

（開発依存）

- @eslint/eslintrc — ESLint の設定ユーティリティ
- @testing-library/jest-dom — DOM のカスタムマッチャー
- @vitejs/plugin-react — Vite 向け React プラグイン
- @vitest/coverage-v8 — V8 ベースのカバレッジプロバイダー
- @types/node — Node.js の TypeScript 型定義
- @types/react — React の TypeScript 型定義
- @types/react-dom — React DOM の TypeScript 型定義
- eslint — JavaScript / TypeScript の静的解析
- eslint-config-next — Next.js 推奨 ESLint 設定
- eslint-config-prettier — Prettier と競合する ESLint ルールを無効化
- eslint-plugin-jsx-a11y — JSX のアクセシビリティチェック
- eslint-plugin-unused-imports — 未使用 import の検出・削除
- happy-dom — テスト用の軽量 DOM 実装
- prettier — コードフォーマッター
- ts-node — TypeScript を直接実行
- typescript — TypeScript コンパイラ
- vitest — Vite ベースのテストフレームワーク
- @playwright/test — E2E テスト
- @dotenvx/dotenvx — 環境変数ロード
- husky — Git フック
- lint-staged — ステージファイルへのリンター実行
- knip — 未使用ファイル・export の検出
- secretlint — シークレット検出
- markdownlint-cli2 — Markdown リンター
- markuplint — HTML/マークアップリンター
- Storybook 関連（@storybook/nextjs-vite, storybook, @storybook/addon-* など）— コンポーネント開発・カタログ
- @lhci/cli — Lighthouse CI

### Dev Container でインストールされる主な拡張機能

- anthropic.claude-code
- dbaeumer.vscode-eslint — ESLint の静的解析
- eamodio.gitlens — Git 履歴・差分の強力な可視化
- esbenp.prettier-vscode — コードフォーマット（Prettier）

## 開発環境構築

### このテンプレートを取得する方法

```bash
git clone git@github.com:yuuu-takahashi/starter-templates.git
cd starter-templates
yarn create-project
```

次のような番号付きのテンプレート一覧が表示されます。**実用テンプレート（本 README）を選ぶなら `2`（Next.js (App Router) - 実用）を選択**し、作成先パスの入力を求められたら未入力でこのリポジトリを入れ替え、または別のパスを指定してください。最低限の構成は `1`（Next.js (App Router)）です。

```text
テンプレートを選んでください:

  1. Next.js (App Router) (nextjs)
  2. Next.js (App Router) - 実用 (nextjs-full)
  3. Node.js (nodejs)
  4. React + Vite (reactjs)
  ...
番号を入力 (1–12):
```

プロジェクト作成後、VS Code / Cursor の左下「><」アイコンをクリックし、「Reopen in Container」を選択して起動してください。`full-templates/nextjs` をそのまま使う場合は、このディレクトリを Dev Container で開いてください。

### 必要なツール

- [VS Code](https://code.visualstudio.com/) または [Cursor](https://www.cursor.com/)
- [Docker](https://www.docker.com/ja-jp/)
- VS Code の場合: [Dev Containers拡張機能](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### 開発環境の準備

1. パッケージをインストール

   ```bash
   yarn
   ```

2. 環境変数（任意）

   ```bash
   cp .env.example .env.local
   ```

   `.env.local` を編集して必要な値を設定してください。

3. 開発サーバー起動

   ```bash
   yarn dev
   ```

ブラウザで <http://localhost:3000> を開き、表示確認。Storybook は `yarn storybook` で <http://localhost:6006> で起動します。

## 開発作業ガイド

- テストの実行

```bash
yarn test
```

- カバレッジレポートの生成

```bash
yarn test:coverage
```

- コードの静的解析と修正

```bash
yarn format
yarn lint
```

- Storybook の起動

```bash
yarn storybook
```

- E2E テスト（Playwright）

```bash
yarn test:e2e
```

- 型チェック

```bash
yarn type-check
```
