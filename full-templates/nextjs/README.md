# Next.js Starter Template

[Next.js 15](https://nextjs.org/)のApp Routerを使用したSSR（Server-Side Rendering）構成のWebアプリケーション開発を素早く立ち上げることを目的としたテンプレートプロジェクトです。

以下の特徴を持つWebアプリケーションを素早く立ち上げることを目的としています：

- Next.js 15 App Routerによる最新のSSR/SSG/SPA対応
- TypeScriptによる型安全な開発環境
- Dev Containerによる一貫した開発環境
- Storybook統合によるコンポーネント駆動開発

## Features

- ✅ **Next.js 15 App Router** - 最新のApp Routerによるルーティングとレンダリング
- ✅ **TypeScript** - 型安全性を確保した開発環境
- ✅ **Vanilla Extract** - CSS-in-JSによる型安全なスタイリング
- ✅ **Storybook** - コンポーネントの開発・テスト・ドキュメント化
- ✅ **Dev Container** - Dockerベースの一貫した開発環境
- ✅ **Vitest + Testing Library** - モダンなテスト環境
- ✅ **ESLint + Prettier** - コード品質の自動チェックとフォーマット
- ✅ **豊富なコンポーネントライブラリ** - Button、Input、Select、DatePickerなど20以上の基本コンポーネント
- ✅ **レンダリングモード切り替え** - SSR/SSG/SPAの設定方法を提供

## ディレクトリ構成

```
template-nextjs-my-starter/
├── .devcontainer/          # Dev Container設定
├── .github/                # GitHub Actions設定
│   └── workflows/          # CI/CDワークフロー
├── config/                 # 設定ファイル
├── docs/                   # ドキュメント
├── public/                 # 静的ファイル
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (site)/       # サイトページ
│   │   ├── up/           # ヘルスチェックエンドポイント
│   │   └── layout.tsx    # ルートレイアウト
│   ├── components/       # Reactコンポーネント
│   │   ├── base/         # 基本コンポーネント（Button、Input、Selectなど）
│   │   ├── layouts/      # レイアウトコンポーネント
│   │   └── pages/        # ページコンポーネント
│   ├── config/           # 設定ファイル（環境変数、メタデータなど）
│   ├── styles/           # グローバルスタイル定義
│   └── utils/            # ユーティリティ関数
├── .storybook/           # Storybook設定
├── next.config.ts        # Next.js設定
├── package.json          # 依存関係
├── tsconfig.json         # TypeScript設定
└── vitest.config.ts      # Vitest設定
```

## Getting Started

### 前提条件

- [VS Code](https://code.visualstudio.com/)
- [Docker](https://www.docker.com/ja-jp/)
- VS Codeの[Dev Containers拡張機能](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### セットアップ手順

1. **リポジトリのクローン**

```bash
git clone <your-repository-url>
cd template-nextjs-my-starter
```

2. **Dev Containerで起動**

VS Codeの左下「><」アイコンをクリックし、「Remote-Containers: Reopen in Container」を選択してコンテナを起動します。

3. **依存関係のインストール**

```bash
yarn install
```

4. **環境変数の設定**

```bash
cp .env.example .env.local
```

5. **環境変数の編集**

`.env.local` を開き、必要な値を設定してください。

6. **開発サーバーの起動**

```bash
yarn dev
```

ブラウザで <http://localhost:3000> を開き、表示を確認してください。

Storybookは <http://localhost:6006> で起動します。

## Environment Variables

環境変数は、以下の4つのカテゴリに分類されます：

### 分類

| 種類      | タイミング   | 使用場所       | 公開されるか | 機密情報 | 例                             |
| --------- | ------------ | -------------- | ------------ | -------- | ------------------------------ |
| **種類0** | ビルド時     | ビルドツール   | ❌           | ❌       | `NODE_ENV`                     |
| **種類1** | ビルド時     | クライアント側 | ✅           | ❌       | `NEXT_PUBLIC_APP_URL`          |
| **種類2** | ランタイム時 | サーバー側     | ❌           | ❌       | `APP_ENV`, `LOG_LEVEL`         |
| **種類3** | ランタイム時 | サーバー側     | ❌           | ✅       | `API_KEY`, `DATABASE_PASSWORD` |

### 主要な環境変数

| 変数名                | 説明                  | 種類  | 必須 | デフォルト値             |
| --------------------- | --------------------- | ----- | ---- | ------------------------ |
| `NEXT_PUBLIC_APP_URL` | アプリケーションのURL | 種類1 | ✅   | `http://localhost:3000/` |
| `APP_ENV`             | アプリケーション環境  | 種類2 | ❌   | `development`            |

### セットアップ

1. `.env.example`をコピーして`.env.local`を作成

   ```bash
   cp .env.example .env.local
   ```

2. `.env.local`を編集して実際の値を設定

詳細は以下のドキュメントを参照してください：

- [環境変数管理ガイド](./docs/environment-variables.md) - 詳細な説明と実装例
- [.env.example](./.env.example) - 環境変数のテンプレート

## Scripts

| コマンド               | 説明                             |
| ---------------------- | -------------------------------- |
| `yarn dev`             | 開発サーバーとStorybookを起動    |
| `yarn build`           | 開発環境用にビルド               |
| `yarn build:prod`      | 本番環境用にビルド               |
| `yarn start`           | 開発環境用サーバーを起動         |
| `yarn start:prod`      | 本番環境用サーバーを起動         |
| `yarn test`            | テストを実行                     |
| `yarn lint`            | ESLintでコードをチェック         |
| `yarn lint:fix`        | ESLintでコードを自動修正         |
| `yarn lint:tsc`        | TypeScriptの型チェック           |
| `yarn format`          | Prettierでフォーマットをチェック |
| `yarn format:fix`      | Prettierでフォーマットを自動修正 |
| `yarn storybook`       | Storybookを起動                  |
| `yarn build-storybook` | Storybookをビルド                |

## 技術選定の背景

### なぜ Next.js 15 App Router か？

- 最新のReact Server Componentsを活用できる
- ファイルベースルーティングによる直感的な開発体験
- SSR/SSG/SPAの柔軟な切り替えが可能
- 優れたパフォーマンスとSEO対応

### なぜ TypeScript か？

- 型安全性によるバグの早期発見
- IDEの優れた補完機能
- リファクタリングの安全性向上
- チーム開発でのコード品質向上

### なぜ Vanilla Extract か？

- TypeScriptによる型安全なスタイリング
- ゼロランタイムのCSS-in-JS
- ビルド時の最適化による高いパフォーマンス
- CSS Modulesのようなスコープ化

### なぜ Dev Container か？

- 環境の一貫性確保
- セットアップ時間の短縮
- チーム全体での環境統一
- 依存関係の管理が容易

詳細は [docs/concept.md](./docs/concept.md) を参照してください。

## Testing

### テストの実行

```bash
# 全テストの実行
yarn test

# カバレッジレポート（Vitestに統合済み）
yarn test --coverage
```

### テスト戦略

- **単体テスト**: Vitest + Testing Library
- **コンポーネントテスト**: Storybook + Vitest統合
- **E2Eテスト**: Playwright（オプション）
- **カバレッジ目標**: 80%以上（推奨）

## レンダリングモードの設定

このプロジェクトはデフォルトでSSR（Server-Side Rendering）構成になっていますが、SSG（Static Site Generation）やSPA（Single Page Application）に変更することも可能です。

### SSR（Server-Side Rendering）- デフォルト設定

リクエストごとにサーバーでHTMLを生成するモードです。

#### 設定方法

`next.config.ts` に以下を設定：

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
};
```

#### 特徴

- リクエストごとにサーバーでHTMLを生成
- 動的なコンテンツに対応可能
- API RoutesやServer Actionsが使用可能
- サーバーが必要（`next start`で起動）

#### ビルドと起動

```bash
yarn build:prod
yarn start:prod
```

### SSG（Static Site Generation）

ビルド時にすべてのページを静的HTMLとして生成するモードです。

#### 設定方法

1. `next.config.ts` を以下のように変更：

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // 静的エクスポート時は画像最適化を無効化
  },
};
```

2. 動的機能を無効化：

- API Routes（`app/**/route.ts`）は使用不可
- Server Actionsは使用不可
- `generateStaticParams`を使用して動的ルートを事前生成

#### 特徴

- ビルド時にすべてのページを静的HTMLとして生成
- サーバー不要（静的ホスティングサービスで配信可能）
- 高速なページ表示
- 動的なコンテンツには対応不可

#### ビルドとデプロイ

```bash
yarn build:prod
# out/ ディレクトリに静的ファイルが生成される
# これを静的ホスティングサービス（Vercel、Netlify、GitHub Pagesなど）にデプロイ
```

### SPA（Single Page Application）

クライアントサイドのみで動作するシングルページアプリケーションです。

#### 設定方法

1. `next.config.ts` を以下のように変更：

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};
```

2. ルーティングをクライアントサイドのみに制限：

- すべてのページで`'use client'`ディレクティブを使用
- API Routesは使用不可
- ルーティングはNext.jsの`useRouter`を使用

#### 特徴

- クライアントサイドのみで動作
- サーバー不要（静的ホスティングサービスで配信可能）
- ページ遷移が高速
- SEOには不利（必要に応じてメタタグを動的に設定）

#### ビルドとデプロイ

```bash
yarn build:prod
# out/ ディレクトリに静的ファイルが生成される
# これを静的ホスティングサービスにデプロイ
```

### 各モードの比較

| モード | サーバー | 動的コンテンツ  | SEO  | パフォーマンス | 使用例                             |
| ------ | -------- | --------------- | ---- | -------------- | ---------------------------------- |
| SSR    | 必要     | 対応可能        | 良好 | 中〜高         | ブログ、ECサイト                   |
| SSG    | 不要     | 対応不可        | 良好 | 最高           | コーポレートサイト、ポートフォリオ |
| SPA    | 不要     | 対応可能（CSR） | 低   | 高             | ダッシュボード、管理画面           |

## ヘルスチェック

アプリケーションの稼働状況は以下で確認できます：

<http://localhost:3000/up>

## License

このプロジェクトはMITライセンスの下で公開されています。
