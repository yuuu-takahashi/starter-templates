/**
 * Generates README.md for each template.
 * Run via generate-configs.ts
 * Template: shared/readme/README.md.hbs
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import Handlebars from "handlebars";
import {
  TEMPLATE_README_CONFIGS,
  type TemplateReadmeConfig,
  type ExtensionSetKey,
} from "./template-readme-config.js";
import { ROOT, SHARED_NPM, SHARED_GEMFILE } from "./lib/utils.js";

const README_TEMPLATE_PATH = join(ROOT, "shared", "readme", "README.md.hbs");

// ── 説明マップ ─────────────────────────────────────────────────────────────────

const NPM_DESCRIPTIONS: Record<string, string> = {
  // フレームワーク・コアライブラリ
  "next": "React フルスタックフレームワーク",
  "react": "UI ライブラリ",
  "react-dom": "React の DOM レンダラー",
  "react-router": "ルーティングライブラリ",
  "react-on-rails": "Rails と React を統合",
  "react-refresh": "React Fast Refresh サポート",
  // ビルドツール
  "vite": "高速ビルドツール",
  "webpack": "モジュールバンドラー",
  "webpack-cli": "Webpack のコマンドラインツール",
  "webpack-dev-server": "開発用ホットリロードサーバー",
  "webpack-merge": "Webpack 設定のマージユーティリティ",
  "webpack-assets-manifest": "Webpack アセットのマニフェスト生成",
  "shakapacker": "Webpack 設定の Rails 向けラッパー",
  // Babel
  "@babel/core": "JavaScript トランスパイラのコア",
  "@babel/runtime": "Babel ランタイムヘルパー",
  "@babel/preset-env": "最新 JS を旧環境向けに変換",
  "@babel/preset-react": "JSX を変換",
  "@babel/preset-typescript": "TypeScript を変換",
  "@babel/plugin-transform-runtime": "ランタイムヘルパーの最適化",
  "@babel/plugin-proposal-class-properties": "クラスプロパティ構文のサポート",
  "@babel/plugin-proposal-object-rest-spread": "オブジェクトスプレッド構文のサポート",
  "babel-loader": "Webpack 用 Babel ローダー",
  "babel-plugin-macros": "Babel マクロのサポート",
  "babel-plugin-transform-react-remove-prop-types": "本番ビルドで PropTypes を除去",
  // CSS 関連
  "css-loader": "CSS ファイルを Webpack で読み込む",
  "style-loader": "CSS を DOM に注入",
  "mini-css-extract-plugin": "CSS を別ファイルとして出力",
  "css-minimizer-webpack-plugin": "CSS を最小化",
  "compression-webpack-plugin": "Webpack の gzip 圧縮プラグイン",
  "terser-webpack-plugin": "JavaScript を最小化",
  // TypeScript
  "typescript": "TypeScript コンパイラ",
  "ts-node": "TypeScript を直接実行",
  "ts-loader": "Webpack 用 TypeScript ローダー",
  // ESLint
  "eslint": "JavaScript / TypeScript の静的解析",
  "eslint-config-next": "Next.js 推奨 ESLint 設定",
  "eslint-config-prettier": "Prettier と競合する ESLint ルールを無効化",
  "eslint-import-resolver-typescript": "TypeScript パスの import 解決",
  "eslint-plugin-import": "import/export 構文のチェック",
  "eslint-plugin-jsx-a11y": "JSX のアクセシビリティチェック",
  "eslint-plugin-react": "React 向け ESLint ルール",
  "eslint-plugin-react-hooks": "React Hooks のルールチェック",
  "eslint-plugin-react-refresh": "React Fast Refresh のルールチェック",
  "eslint-plugin-unused-imports": "未使用 import の検出・削除",
  "@eslint/js": "ESLint の JavaScript 推奨ルール",
  "@eslint/eslintrc": "ESLint の設定ユーティリティ",
  "@typescript-eslint/eslint-plugin": "TypeScript 向け ESLint ルール",
  "@typescript-eslint/parser": "TypeScript の ESLint パーサー",
  "typescript-eslint": "TypeScript 向け ESLint プラグイン・パーサー",
  "@pmmmwh/react-refresh-webpack-plugin": "React Fast Refresh の Webpack プラグイン",
  // Prettier
  "prettier": "コードフォーマッター",
  // テスト
  "vitest": "Vite ベースのテストフレームワーク",
  "@vitest/coverage-v8": "V8 ベースのカバレッジプロバイダー",
  "@testing-library/jest-dom": "DOM のカスタムマッチャー",
  "@vitejs/plugin-react": "Vite 向け React プラグイン",
  "happy-dom": "テスト用の軽量 DOM 実装",
  // 型定義
  "@types/node": "Node.js の TypeScript 型定義",
  "@types/react": "React の TypeScript 型定義",
  "@types/react-dom": "React DOM の TypeScript 型定義",
  "@types/react-router-dom": "React Router DOM の TypeScript 型定義",
  "@types/babel__core": "Babel Core の TypeScript 型定義",
  "@types/webpack": "Webpack の TypeScript 型定義",
  // その他
  "globals": "グローバル変数の定義セット",
  "prop-types": "React の実行時 PropTypes チェック",
};

const GEM_DESCRIPTIONS: Record<string, string> = {
  // フレームワーク・コア
  "rails": "Ruby on Rails フレームワーク",
  "sinatra": "軽量 Web フレームワーク",
  "puma": "マルチスレッド Web サーバー",
  "rackup": "Rack アプリの起動ツール",
  "mysql2": "MySQL クライアント",
  // 認証・セキュリティ
  "bcrypt": "パスワードのハッシュ化",
  "brakeman": "セキュリティ脆弱性スキャナー",
  // 環境変数
  "dotenv": "環境変数を .env から読み込む",
  "dotenv-rails": "環境変数を .env から読み込む（Rails）",
  // フロントエンド連携
  "importmap-rails": "Import Maps による JS 管理",
  "stimulus-rails": "軽量 JavaScript フレームワーク（Stimulus）",
  "turbo-rails": "高速なページ遷移・フォーム送信（Turbo）",
  "sprockets-rails": "アセットパイプライン",
  "react_on_rails": "Rails と React を統合",
  "shakapacker": "Webpack 設定の Rails 向けラッパー",
  // ビュー
  "jbuilder": "JSON レスポンスを DSL で構築",
  "view_component": "再利用可能なビューコンポーネント",
  // API ドキュメント
  "rswag": "RSpec から Swagger ドキュメントを生成",
  // DB / ORM
  "sequel": "ORM / データベースツールキット",
  "nokogiri": "XML/HTML パーサー",
  // ミドルウェア
  "rack": "Ruby Web サーバーインターフェース",
  // タスク
  "rake": "Ruby のタスクランナー",
  // 開発ツール
  "bootsnap": "起動時間の高速化",
  "ruby-lsp": "Ruby 言語サーバー",
  "web-console": "開発環境の Rails コンソール",
  "debug": "Ruby デバッガー",
  "sinatra-contrib": "Sinatra 拡張機能コレクション",
  // 静的解析
  "rubocop": "Ruby の静的解析・フォーマッター",
  "rubocop-rails-omakase": "Rails 公式の RuboCop プリセット",
  "rubocop-rspec": "RSpec 向け RuboCop ルール",
  "erb_lint": "ERB テンプレートの静的解析",
  "htmlbeautifier": "ERB テンプレートのフォーマット",
  "prettier": "コードフォーマッター",
  // テスト
  "rspec-rails": "Rails 向けテストフレームワーク",
  "rspec": "Ruby のテストフレームワーク",
  "factory_bot_rails": "テスト用フィクスチャファクトリー（Rails）",
  "factory_bot": "テスト用フィクスチャファクトリー",
  "faker": "テスト用ダミーデータ生成",
  "capybara": "E2E テストの DSL",
  "selenium-webdriver": "ブラウザ自動操作（E2E テスト）",
  "rack-test": "Rack アプリのテストヘルパー",
  // その他
  "tzinfo-data": "タイムゾーンデータ（Windows 向け）",
};

const EXTENSION_DESCRIPTIONS: Record<string, string> = {
  "esbenp.prettier-vscode": "コードフォーマット（Prettier）",
  "dbaeumer.vscode-eslint": "ESLint の静的解析",
  "ms-dotnettools.csharp": "C# 言語サポート（IntelliSense・リファクタ等）",
  "ms-dotnettools.csdevkit": "C# Dev Kit（Solution Explorer・テスト・NuGet 等）",
  "golang.go": "Go 言語サポート（gopls・IntelliSense・テスト・デバッグ等）",
  "rust-lang.rust-analyzer": "Rust 言語サポート（補完・ナビゲーション・型チェック等）",
  "Shopify.ruby-extensions-pack": "Ruby 開発ツール一式（Ruby LSP など）",
  "aliariff.vscode-erb-beautify": "ERB テンプレートのフォーマット",
  "eamodio.gitlens": "Git 履歴・差分の強力な可視化",
  "Gruntfuggly.todo-tree": "TODO / FIXME コメントの一覧表示",
  "mhutchie.git-graph": "Git ツリーのグラフ表示",
  "streetsidesoftware.code-spell-checker": "スペルチェック",
  "donjayamanne.githistory": "Git ログの可視化",
  "github.vscode-github-actions": "GitHub Actions のサポート",
  "yzhang.markdown-all-in-one": "Markdown 編集支援",
  "DavidAnson.vscode-markdownlint": "Markdown の構文チェック",
  "ms-python.python": "Python 言語サポート（IntelliSense・デバッグ・テスト等）",
  "ms-python.vscode-pylance": "Python の型チェック・補完（Pylance）",
  "bmewburn.vscode-intelephense-client": "PHP の IntelliSense・補完（Intelephense）",
};

function withDesc(name: string, map: Record<string, string>): string {
  const desc = map[name];
  return desc ? `- ${name} — ${desc}` : `- ${name}`;
}

// ── セクション生成 ─────────────────────────────────────────────────────────────

function buildStackSection(
  c: TemplateReadmeConfig,
  devcontainerDefaults: { extensions: Record<ExtensionSetKey, string[]> }
): string | undefined {
  const parts: string[] = [];

  if (c.npmStack) {
    const npmPath = join(SHARED_NPM, `${c.npmStack}.json`);
    try {
      const pkg = JSON.parse(readFileSync(npmPath, "utf8")) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      const deps = Object.keys(pkg.dependencies ?? {}).sort();
      const devDeps = Object.keys(pkg.devDependencies ?? {}).sort();
      if (deps.length > 0 || devDeps.length > 0) {
        parts.push("### 主な npm パッケージ");
        parts.push("");
        if (deps.length > 0) {
          parts.push("（本番依存）");
          parts.push("");
          deps.forEach((name) => parts.push(withDesc(name, NPM_DESCRIPTIONS)));
          parts.push("");
        }
        if (devDeps.length > 0) {
          parts.push("（開発依存）");
          parts.push("");
          devDeps.forEach((name) => parts.push(withDesc(name, NPM_DESCRIPTIONS)));
          parts.push("");
        }
      }
    } catch {
      // ファイルが無い場合はスキップ
    }
  }

  if (c.gemfileStack) {
    const gemfilePath = join(SHARED_GEMFILE, `Gemfile.${c.gemfileStack}`);
    try {
      const gemfileContent = readFileSync(gemfilePath, "utf8");
      const gemNames = [...gemfileContent.matchAll(/gem\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);
      const unique = [...new Set(gemNames)].sort();
      if (unique.length > 0) {
        parts.push("### 主な Gem");
        parts.push("");
        unique.forEach((name) => parts.push(withDesc(name, GEM_DESCRIPTIONS)));
        parts.push("");
      }
    } catch {
      // ファイルが無い場合はスキップ
    }
  }

  if (c.stackLibs && c.stackLibs.length > 0) {
    parts.push("### 主なライブラリ");
    parts.push("");
    c.stackLibs.forEach((line) => parts.push(line.startsWith("-") ? line : `- ${line}`));
    parts.push("");
  }

  if (c.extensionSets && c.extensionSets.length > 0) {
    const extIds = new Set<string>();
    for (const set of c.extensionSets) {
      const list = devcontainerDefaults.extensions[set];
      if (Array.isArray(list)) list.forEach((id) => extIds.add(id));
    }
    if (extIds.size > 0) {
      parts.push("### Dev Container でインストールされる主な拡張機能");
      parts.push("");
      [...extIds].sort().forEach((id) => parts.push(withDesc(id, EXTENSION_DESCRIPTIONS)));
      parts.push("");
    }
  }

  if (parts.length === 0) return undefined;
  return parts.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd();
}

function prepareTemplateContext(
  config: TemplateReadmeConfig,
  stackSection: string | undefined
): Record<string, unknown> {
  const setupSteps = config.setupSteps.map((step, i) => ({
    num: i + 1,
    label: step.label,
    commands: step.commands,
    hasCommands: step.commands.length > 0,
  }));

  return {
    title: config.title,
    description: config.description,
    id: config.id,
    stackSection: stackSection ?? "",
    treeExclude: config.treeExclude ?? "",
    setupSteps,
    previewLine: config.previewUrl
      ? `ブラウザで <${config.previewUrl}> を開き、表示確認`
      : "",
    devGuide: config.devGuide,
    hasDevGuide: config.devGuide.length > 0,
    extraSections: config.extraSections ?? "",
  };
}

export async function run(): Promise<void> {
  const templateSource = readFileSync(README_TEMPLATE_PATH, "utf8");
  const template = Handlebars.compile(templateSource, {
    noEscape: true,
    strict: true,
  });

  const DEFAULTS_PATH = join(ROOT, "shared", "devcontainer", "defaults.json");
  const devcontainerDefaults = JSON.parse(readFileSync(DEFAULTS_PATH, "utf8")) as {
    extensions: Record<ExtensionSetKey, string[]>;
  };

  for (const config of TEMPLATE_README_CONFIGS) {
    const stackSection = buildStackSection(config, devcontainerDefaults);
    const context = prepareTemplateContext(config, stackSection);
    const content = template(context);
    const normalized = content.replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
    const outPath = join(ROOT, "templates", config.id, "README.md");
    writeFileSync(outPath, normalized, "utf8");
    console.log("Generated:", outPath);
  }
}
