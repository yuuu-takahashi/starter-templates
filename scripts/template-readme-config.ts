/**
 * 各テンプレートの README.md 生成用メタデータ。
 * scripts/generate-configs.ts から参照され、各 templates/<id>/README.md を生成する。
 * 共通の文面は SHARED_README_* 定数で一元管理し、テンプレートごとの差分は config のみで指定する。
 */

// ── 共通文面（全テンプレートで同じ文言）────────────────────────────────────────

const SHARED_README_DEV_CONTAINER_NOTE =
  "このプロジェクトは、[Dev Container](https://code.visualstudio.com/docs/devcontainers/containers)での利用を想定した構成になっています。VS Code・Cursor のどちらでも利用できます。";

const SHARED_README_SECTION_DIRECTORY = "## ディレクトリ構成";
const SHARED_README_SECTION_SETUP = "## 開発環境構築";
const SHARED_README_SECTION_REQUIRED_TOOLS = "### 必要なツール";
const SHARED_README_SECTION_PREPARE = "### 開発環境の準備";
const SHARED_README_SECTION_DEV_GUIDE = "## 開発作業ガイド";

const SHARED_README_REQUIRED_TOOLS_LIST = [
  "- [VS Code](https://code.visualstudio.com/) または [Cursor](https://www.cursor.com/)",
  "- [Docker](https://www.docker.com/ja-jp/)",
  "- VS Code の場合: [Dev Containers拡張機能](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)",
];

const SHARED_README_PREVIEW_LINE = (url: string) =>
  `ブラウザで <${url}> を開き、表示確認`;

// ── 型定義 ───────────────────────────────────────────────────────────────────

export type TemplateReadmeStep = {
  label?: string;
  commands: string[];
};

export type TemplateReadmeDevGuide = {
  title: string;
  commands: string;
};

/** Dev Container の拡張機能セット（shared/devcontainer/defaults.json の extensions キー） */
export type ExtensionSetKey = "base" | "node" | "ruby" | "erb" | "csharp" | "go" | "rust" | "tooling";

export type TemplateReadmeConfig = {
  id: string;
  title: string;
  description: string;
  repoSlug: string;
  treeExclude?: string;
  /** shared/npm/${npmStack}.json のパッケージを「主なライブラリ」に記載 */
  npmStack?: string;
  /** shared/gemfile/Gemfile.${gemfileStack} の gem を「主な Gem」に記載 */
  gemfileStack?: string;
  /** shared/devcontainer/defaults.json の拡張機能セットを「主な拡張機能」に記載 */
  extensionSets?: ExtensionSetKey[];
  setupSteps: TemplateReadmeStep[];
  previewUrl?: string;
  devGuide: TemplateReadmeDevGuide[];
  extraSections?: string;
};

const cloneStep = (templateId: string): TemplateReadmeStep => ({
  label: "リポジトリをクローンし、テンプレートディレクトリに移動",
  commands: [
    "git clone git@github.com:yuuu-takahashi/starter-templates.git",
    `cd starter-templates/templates/${templateId}`,
  ],
});

export const TEMPLATE_README_CONFIGS: TemplateReadmeConfig[] = [
  {
    id: "nodejs",
    title: "template-nodejs",
    description: "このリポジトリはNode.jsのテンプレートプロジェクトです。",
    repoSlug: "template-nodejs",
    npmStack: "nodejs",
    extensionSets: ["base", "node"],
    treeExclude: "node_modules",
    setupSteps: [
      cloneStep("nodejs"),
      { label: "VS Code / Cursor の左下「><」アイコンをクリックし、「Reopen in Container」を選択し、起動", commands: [] },
    ],
    devGuide: [
      { title: "コードの静的解析と修正", commands: "yarn format\nyarn lint" },
    ],
  },
  {
    id: "nextjs",
    title: "template-nextjs",
    description: "このリポジトリは Next.js のテンプレートプロジェクトです。",
    repoSlug: "template-nextjs",
    npmStack: "nextjs",
    extensionSets: ["base", "node"],
    treeExclude: "vendor|node_modules",
    setupSteps: [
      cloneStep("nextjs"),
      { label: "VS Code / Cursor の左下「><」アイコンをクリックし、「Reopen in Container」を選択し、起動", commands: [] },
      { label: "パッケージをインストール", commands: ["yarn"] },
      { label: "開発サーバー起動", commands: ["yarn dev"] },
    ],
    previewUrl: "http://localhost:3000",
    devGuide: [
      { title: "テストの実行", commands: "yarn test" },
      { title: "カバレッジレポートの生成", commands: "yarn test:coverage" },
      { title: "コードの静的解析と修正", commands: "yarn format\nyarn lint" },
    ],
  },
  {
    id: "reactjs",
    title: "template-reactjs",
    description: "このリポジトリは React + Webpack のテンプレートプロジェクトです。",
    repoSlug: "template-reactjs",
    npmStack: "reactjs",
    extensionSets: ["base", "node"],
    treeExclude: "vendor|node_modules",
    setupSteps: [
      cloneStep("reactjs"),
      { label: "VS Code / Cursor の左下「><」アイコンをクリックし、「Reopen in Container」を選択し、起動", commands: [] },
      { label: "パッケージをインストール", commands: ["yarn"] },
      { label: "開発サーバー起動", commands: ["yarn dev"] },
    ],
    previewUrl: "http://localhost:5173",
    devGuide: [
      { title: "テストの実行", commands: "yarn test" },
      { title: "コードの静的解析と修正", commands: "yarn format\nyarn lint" },
    ],
  },
  {
    id: "rails",
    title: "template-rails",
    description: "このリポジトリは Ruby on Rails のテンプレートプロジェクトです。",
    repoSlug: "template-rails",
    npmStack: "rails",
    gemfileStack: "rails",
    extensionSets: ["base", "ruby", "erb", "node", "tooling"],
    treeExclude: "vendor|node_modules|tmp",
    setupSteps: [
      cloneStep("rails"),
      { label: "VS Code / Cursor の左下「><」アイコンをクリックし、「Reopen in Container」を選択し、起動", commands: [] },
      { label: "データベース準備", commands: ["bin/rails db:prepare"] },
      { label: "開発サーバー起動", commands: ["bin/dev"] },
    ],
    previewUrl: "http://localhost:3000",
    devGuide: [
      { title: "テストの実行", commands: "bundle exec rspec" },
      { title: "コードの静的解析と修正", commands: "yarn format\nyarn lint\nbundle exec rubocop -A\nbundle exec erb_lint app/views/**/*.erb\nfind app/views -name \"*.erb\" -exec bundle exec htmlbeautifier {} \\;" },
    ],
  },
  {
    id: "rails-api",
    title: "template-rails-api",
    description: "このリポジトリは Ruby on Rails（API）のテンプレートプロジェクトです。",
    repoSlug: "template-rails-api",
    npmStack: "rails-api",
    gemfileStack: "rails-api",
    extensionSets: ["base", "ruby"],
    treeExclude: "vendor|node_modules|tmp",
    setupSteps: [
      cloneStep("rails-api"),
      { label: "環境変数の設定", commands: ["cp .env.example .env.development"] },
      { label: "VS Code / Cursor の左下「><」アイコンをクリックし、「Reopen in Container」を選択し、起動", commands: [] },
      { label: "データベース準備", commands: ["bin/rails db:prepare"] },
      { label: "開発サーバー起動", commands: ["bin/rails s"] },
    ],
    previewUrl: "http://localhost:3000/api-docs/index.html",
    devGuide: [
      { title: "テストの実行", commands: "bundle exec rspec" },
      { title: "APIドキュメント生成", commands: "bundle exec rake rswag:specs:swaggerize" },
      { title: "コードの静的解析と修正", commands: "yarn format\nbundle exec rubocop -A" },
    ],
  },
  {
    id: "ruby",
    title: "template-ruby",
    description: "このリポジトリはRubyのテンプレートプロジェクトです。",
    repoSlug: "template-ruby",
    gemfileStack: "ruby",
    extensionSets: ["base", "ruby"],
    setupSteps: [
      cloneStep("ruby"),
      { label: "VS Code / Cursor の左下「><」アイコンをクリックし、「Reopen in Container」を選択し、起動", commands: [] },
    ],
    devGuide: [
      { title: "コードの静的解析と修正", commands: "bundle exec rubocop -A" },
    ],
  },
  {
    id: "csharp",
    title: "template-csharp",
    description: "このリポジトリは ASP.NET Core Minimal API（C#）のテンプレートプロジェクトです。",
    repoSlug: "template-csharp",
    extensionSets: ["base", "csharp"],
    treeExclude: "bin|obj",
    setupSteps: [
      cloneStep("csharp"),
      { label: "VS Code / Cursor の左下「><」アイコンをクリックし、「Reopen in Container」を選択し、起動", commands: [] },
      { label: "パッケージの復元", commands: ["dotnet restore"] },
      { label: "開発サーバー起動", commands: ["dotnet run"] },
    ],
    previewUrl: "http://localhost:5000",
    devGuide: [
      { title: "テストの実行", commands: "dotnet test" },
      { title: "ビルド", commands: "dotnet build" },
    ],
  },
  {
    id: "go",
    title: "template-go",
    description: "このリポジトリは Go のテンプレートプロジェクトです。",
    repoSlug: "template-go",
    extensionSets: ["base", "go"],
    treeExclude: "bin|vendor",
    setupSteps: [
      cloneStep("go"),
      { label: "VS Code / Cursor の左下「><」アイコンをクリックし、「Reopen in Container」を選択し、起動", commands: [] },
    ],
    devGuide: [
      { title: "ビルド", commands: "go build ./..." },
      { title: "リンター（golangci-lint）", commands: "golangci-lint run" },
    ],
  },
  {
    id: "rust",
    title: "template-rust",
    description: "このリポジトリは Rust のテンプレートプロジェクトです。",
    repoSlug: "template-rust",
    extensionSets: ["base", "rust"],
    treeExclude: "target",
    setupSteps: [
      cloneStep("rust"),
      { label: "VS Code / Cursor の左下「><」アイコンをクリックし、「Reopen in Container」を選択し、起動", commands: [] },
    ],
    devGuide: [
      { title: "ビルド", commands: "cargo build" },
      { title: "フォーマットチェック", commands: "cargo fmt --all -- --check" },
      { title: "リンター（Clippy）", commands: "cargo clippy --all-targets -- -D warnings" },
    ],
  },
  {
    id: "sinatra",
    title: "template-sinatra",
    description: "このリポジトリはSinatraのテンプレートプロジェクトです。",
    repoSlug: "template-sinatra",
    npmStack: "sinatra",
    gemfileStack: "sinatra",
    extensionSets: ["base", "ruby", "erb"],
    treeExclude: "vendor|node_modules",
    setupSteps: [
      cloneStep("sinatra"),
      { label: "環境変数の設定", commands: ["cp .env.example .env.development"] },
      { label: "VS Code / Cursor の左下「><」アイコンをクリックし、「Reopen in Container」を選択し、起動", commands: [] },
      { label: "データベース準備", commands: ["bundle exec rake db:setup", "bundle exec rake db:seed"] },
      { label: "開発サーバー起動", commands: ["bundle exec ruby index.rb"] },
    ],
    previewUrl: "http://localhost:4567",
    devGuide: [
      { title: "マイグレーションファイルの追加", commands: "bundle exec rake db:generate_migrate[ファイル名]" },
      { title: "マイグレーションの実行", commands: "bundle exec rake db:migrate" },
      { title: "テストの実行", commands: "bundle exec rspec" },
      { title: "コードの静的解析と修正", commands: "yarn format\nbundle exec rubocop -A\nbundle exec erb_lint app/views/**/*.erb\nfind app/views -name \"*.erb\" -exec bundle exec htmlbeautifier {} \\;" },
    ],
  },
];

const SHARED_README_SECTION_STACK = "## 主なライブラリ・Gem・拡張機能";

function renderReadme(c: TemplateReadmeConfig, stackSection?: string): string {
  const lines: string[] = [];

  lines.push(`# ${c.title}`);
  lines.push("");
  lines.push(`${c.description}`);
  lines.push(SHARED_README_DEV_CONTAINER_NOTE);
  lines.push("");

  if (stackSection) {
    lines.push(stackSection);
    lines.push("");
  }

  if (c.treeExclude) {
    lines.push(SHARED_README_SECTION_DIRECTORY);
    lines.push("");
    lines.push("```bash");
    lines.push(`tree -I '${c.treeExclude}'`);
    lines.push("```");
    lines.push("");
  }

  lines.push(SHARED_README_SECTION_SETUP);
  lines.push("");
  lines.push(SHARED_README_SECTION_REQUIRED_TOOLS);
  lines.push("");
  SHARED_README_REQUIRED_TOOLS_LIST.forEach((item) => lines.push(item));
  lines.push("");
  lines.push(SHARED_README_SECTION_PREPARE);
  lines.push("");

  c.setupSteps.forEach((step, i) => {
    const num = i + 1;
    if (step.label) {
      lines.push(`${num}. ${step.label}`);
      lines.push("");
    }
    if (step.commands.length > 0) {
      lines.push("   ```bash");
      step.commands.forEach((cmd) => lines.push(`   ${cmd}`));
      lines.push("   ```");
      lines.push("");
    }
  });

  if (c.previewUrl) {
    lines.push(SHARED_README_PREVIEW_LINE(c.previewUrl));
    lines.push("");
  }

  if (c.devGuide.length > 0) {
    lines.push(SHARED_README_SECTION_DEV_GUIDE);
    lines.push("");
    c.devGuide.forEach((g) => {
      lines.push(`- ${g.title}`);
      lines.push("");
      lines.push("```bash");
      lines.push(g.commands);
      lines.push("```");
      lines.push("");
    });
  }

  if (c.extraSections) {
    lines.push(c.extraSections);
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}

export function getGeneratedReadmeContent(
  config: TemplateReadmeConfig,
  options?: { stackSection?: string }
): string {
  const header = "<!-- Generated by scripts/generate-configs.ts — edit scripts/template-readme-config.ts instead. -->\n\n";
  return header + renderReadme(config, options?.stackSection);
}

export { SHARED_README_SECTION_STACK };
