/**
 * 各テンプレートの README.md 生成用メタデータ。
 * scripts/generate-configs.ts から参照され、各 templates/<id>/README.md を生成する。
 */

export type TemplateReadmeStep = {
  label?: string;
  commands: string[];
};

export type TemplateReadmeDevGuide = {
  title: string;
  commands: string;
};

export type TemplateReadmeConfig = {
  id: string;
  title: string;
  description: string;
  repoSlug: string;
  treeExclude?: string;
  setupSteps: TemplateReadmeStep[];
  previewUrl?: string;
  devGuide: TemplateReadmeDevGuide[];
  extraSections?: string;
};

export const TEMPLATE_README_CONFIGS: TemplateReadmeConfig[] = [
  {
    id: "nodejs",
    title: "template-nodejs",
    description: "このリポジトリはNode.jsのテンプレートプロジェクトです。",
    repoSlug: "template-nodejs",
    treeExclude: "node_modules",
    setupSteps: [
      { label: "リポジトリをクローン", commands: ["git clone git@github.com:yuuu-takahashi/template-nodejs.git", "cd template-nodejs"] },
      { label: "VS Codeの左下「><」アイコンをクリックし、「Remote-Containers: Reopen in Container」を選択し、起動", commands: [] },
    ],
    devGuide: [
      { title: "テストの実行", commands: "yarn test" },
      { title: "コードの静的解析と修正", commands: "yarn format\nyarn lint" },
    ],
  },
  {
    id: "nextjs",
    title: "template-nextjs",
    description: "このリポジトリは Nextjs のテンプレートプロジェクトです。",
    repoSlug: "template-nextjs",
    treeExclude: "vendor|node_modules",
    setupSteps: [
      { label: "リポジトリをクローン", commands: ["git clone git@github.com:yuuu-takahashi/template-nextjs.git", "cd template-nextjs"] },
      { label: "VS Codeの左下「><」アイコンをクリックし、「Remote-Containers: Reopen in Container」を選択し、起動", commands: [] },
      { label: "パッケージをインストール", commands: ["yarn"] },
      { label: "開発サーバー起動", commands: ["yarn dev"] },
    ],
    previewUrl: "http://localhost:3000",
    devGuide: [
      { title: "テストの実行", commands: "yarn test" },
      { title: "コードの静的解析と修正", commands: "yarn format\nyarn lint" },
    ],
  },
  {
    id: "react",
    title: "template-react",
    description: "このプロジェクトは React + Webpack のテンプレートです。",
    repoSlug: "template-react",
    treeExclude: "vendor|node_modules",
    setupSteps: [
      { label: "リポジトリをクローン", commands: ["git clone git@github.com:yuuu-takahashi/template-react.git", "cd template-react"] },
      { label: "VS Codeの左下「><」アイコンをクリックし、「Remote-Containers: Reopen in Container」を選択し、起動", commands: [] },
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
    description: "このプロジェクトは Ruby on Rails のテンプレートです。",
    repoSlug: "template-rails",
    treeExclude: "vendor|node_modules|tmp",
    setupSteps: [
      { label: "リポジトリをクローン", commands: ["git clone git@github.com:yuuu-takahashi/template-rails.git", "cd template-rails"] },
      { label: "VS Codeの左下「><」アイコンをクリックし、「Remote-Containers: Reopen in Container」を選択し、起動", commands: [] },
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
    description: "このリポジトリはRuby on Railsのテンプレートプロジェクトです。",
    repoSlug: "template-rails-api",
    treeExclude: "vendor|node_modules|tmp",
    setupSteps: [
      { label: "リポジトリをクローン", commands: ["git clone git@github.com:yuuu-takahashi/template-rails-api.git", "cd template-rails-api"] },
      { label: "環境変数の設定", commands: ["cp example.env .env.development"] },
      { label: "VS Codeの左下「><」アイコンをクリックし、「Remote-Containers: Reopen in Container」を選択し、起動", commands: [] },
      { label: "データベース準備", commands: ["bin/rails db:prepare"] },
      { label: "開発サーバー起動", commands: ["bin/rails s"] },
    ],
    previewUrl: "http://localhost:3000/api-docs/index.html",
    devGuide: [
      { title: "APIドキュメント生成", commands: "bundle exec rake rswag:specs:swaggerize" },
    ],
  },
  {
    id: "ruby",
    title: "template-ruby",
    description: "このリポジトリはRubyのテンプレートプロジェクトです。",
    repoSlug: "template-ruby",
    setupSteps: [
      { label: "リポジトリをクローン", commands: ["git clone git@github.com:yuuu-takahashi/template-ruby.git", "cd template-ruby"] },
      { label: "VS Codeの左下「><」アイコンをクリックし、「Remote-Containers: Reopen in Container」を選択して起動します。", commands: [] },
    ],
    devGuide: [],
  },
  {
    id: "sinatra",
    title: "template-sinatra",
    description: "このリポジトリはSinatraのテンプレートプロジェクトです。",
    repoSlug: "template-sinatra",
    treeExclude: "vendor|node_modules",
    setupSteps: [
      { label: "リポジトリをクローン", commands: ["git clone git@github.com:yuuu-takahashi/template-sinatra.git", "cd template-sinatra"] },
      { label: "環境変数の設定", commands: ["cp example.env .env.development"] },
      { label: "VS Codeの左下「><」アイコンをクリックし、「Remote-Containers: Reopen in Container」を選択し、起動", commands: [] },
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

function renderReadme(c: TemplateReadmeConfig): string {
  const lines: string[] = [];

  lines.push(`# ${c.title}`);
  lines.push("");
  lines.push(`${c.description}`);
  lines.push("このプロジェクトは、[Dev Container](https://code.visualstudio.com/docs/devcontainers/containers)での利用を想定した構成になっています。");
  lines.push("");

  if (c.treeExclude) {
    lines.push("## ディレクトリ構成");
    lines.push("");
    lines.push("```bash");
    lines.push(`tree -I '${c.treeExclude}'`);
    lines.push("```");
    lines.push("");
  }

  lines.push("## 開発環境構築");
  lines.push("");
  lines.push("### 必要なツール");
  lines.push("");
  lines.push("- [VS Code](https://code.visualstudio.com/)");
  lines.push("- [Docker](https://www.docker.com/ja-jp/)");
  lines.push("- VS Codeの[Dev Containers拡張機能](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)");
  lines.push("");
  lines.push("### 開発環境の準備");
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
    lines.push(`ブラウザで <${c.previewUrl}> を開き、表示確認`);
    lines.push("");
  }

  if (c.devGuide.length > 0) {
    lines.push("## 開発作業ガイド");
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

export function getGeneratedReadmeContent(config: TemplateReadmeConfig): string {
  const header = "<!-- Generated by scripts/generate-configs.ts — edit scripts/template-readme-config.ts instead. -->\n\n";
  return header + renderReadme(config);
}
