/**
 * テンプレート・スタックの一覧を一元定義。
 * 新規テンプレート追加時はここにエントリを追加し、各スクリプトはこのファイルを参照する。
 */

/** 全テンプレートのディレクトリ（templates/ からの相対パス） */
export const TEMPLATE_DIRS: readonly string[] = [
  "templates/nextjs",
  "templates/nodejs",
  "templates/reactjs",
  "templates/rails",
  "templates/rails-api",
  "templates/laravel",
  "templates/sinatra",
  "templates/csharp",
  "templates/go",
  "templates/rust",
];

/** package.json を shared/npm/<stack>.json から生成するスタック */
export const NPM_STACKS: readonly string[] = [
  "nextjs",
  "nodejs",
  "reactjs",
  "rails",
  "rails-api",
  "sinatra",
];

/** Gemfile を shared/gemfile/ から生成するスタック */
export const GEMFILE_STACKS: readonly string[] = ["rails", "rails-api", "sinatra"];

/** .node-version を配布するテンプレート */
export const NODE_VERSION_DIRS: readonly string[] = [
  "templates/nextjs",
  "templates/nodejs",
  "templates/reactjs",
  "templates/rails",
  "templates/rails-api",
  "templates/sinatra",
];

/** .ruby-version を配布するテンプレート */
export const RUBY_VERSION_DIRS: readonly string[] = [
  "templates/rails",
  "templates/rails-api",
  "templates/sinatra",
];

/** code-check.yml の元ワークフロー名（shared/workflows/ 内のファイル名） */
export const CODE_CHECK_SOURCE: Readonly<Record<string, string>> = {
  "templates/nextjs": "code-check-node.yml",
  "templates/nodejs": "code-check-node.yml",
  "templates/reactjs": "code-check-node.yml",
  "templates/rails-api": "code-check-ruby.yml",
  "templates/sinatra": "code-check-ruby-erb.yml",
  "templates/rails": "code-check-ruby-erb.yml",
  "templates/laravel": "code-check-laravel.yml",
  "templates/csharp": "code-check-dotnet.yml",
  "templates/go": "code-check-go.yml",
  "templates/rust": "code-check-rust.yml",
};

/** test.yml を生成するテンプレートと元ワークフロー名 */
export const TEST_SOURCE: Readonly<Record<string, string>> = {
  "templates/reactjs": "test-node.yml",
  "templates/sinatra": "test-sinatra.yml",
  "templates/rails": "test-rails.yml",
  "templates/rails-api": "test-rails-api.yml",
  "templates/laravel": "test-laravel.yml",
  "templates/csharp": "test-dotnet.yml",
};

/** .gitignore の元ファイル名（shared/gitignore/ 内） */
export const GITIGNORE_SOURCE: Readonly<Record<string, string>> = {
  "templates/nextjs": ".gitignore.node",
  "templates/nodejs": ".gitignore.node",
  "templates/reactjs": ".gitignore.node",
  "templates/rails": ".gitignore.rails",
  "templates/rails-api": ".gitignore.rails",
  "templates/laravel": ".gitignore.laravel",
  "templates/sinatra": ".gitignore.ruby",
  "templates/csharp": ".gitignore.dotnet",
  "templates/go": ".gitignore.go",
  "templates/rust": ".gitignore.rust",
};

/** ルート CI（generate-root-workflow）用: id / dir / pathFilter */
export interface RootStackEntry {
  id: string;
  dir: string;
  pathFilter: string;
}

export const ROOT_STACKS: readonly RootStackEntry[] = [
  { id: "nextjs", dir: "templates/nextjs", pathFilter: "templates/nextjs/**" },
  { id: "nodejs", dir: "templates/nodejs", pathFilter: "templates/nodejs/**" },
  { id: "reactjs", dir: "templates/reactjs", pathFilter: "templates/reactjs/**" },
  { id: "rails", dir: "templates/rails", pathFilter: "templates/rails/**" },
  { id: "rails_api", dir: "templates/rails-api", pathFilter: "templates/rails-api/**" },
  { id: "laravel", dir: "templates/laravel", pathFilter: "templates/laravel/**" },
  { id: "sinatra", dir: "templates/sinatra", pathFilter: "templates/sinatra/**" },
  { id: "csharp", dir: "templates/csharp", pathFilter: "templates/csharp/**" },
  { id: "go", dir: "templates/go", pathFilter: "templates/go/**" },
  { id: "rust", dir: "templates/rust", pathFilter: "templates/rust/**" },
];
