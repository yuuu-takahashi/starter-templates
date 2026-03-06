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
  "templates/django",
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

/** .python-version を配布するテンプレート */
export const PYTHON_VERSION_DIRS: readonly string[] = ["templates/django"];

/** .php-version を配布するテンプレート */
export const PHP_VERSION_DIRS: readonly string[] = ["templates/laravel"];

/** .go-version を配布するテンプレート */
export const GO_VERSION_DIRS: readonly string[] = ["templates/go"];

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
  "templates/django": "code-check-django.yml",
};

/** test.yml を生成するテンプレートと元ワークフロー名 */
export const TEST_SOURCE: Readonly<Record<string, string>> = {
  "templates/nextjs": "test-node.yml",
  "templates/reactjs": "test-node.yml",
  "templates/sinatra": "test-sinatra.yml",
  "templates/rails": "test-rails.yml",
  "templates/rails-api": "test-rails-api.yml",
  "templates/laravel": "test-laravel.yml",
  "templates/csharp": "test-dotnet.yml",
  "templates/go": "test-go.yml",
  "templates/rust": "test-rust.yml",
  "templates/django": "test-django.yml",
};

/** .dockerignore の元ファイル名（shared/docker/ 内） */
export const DOCKERIGNORE_SOURCE: Readonly<Record<string, string>> = {
  "templates/rails": "dockerignore.rails",
  "templates/rails-api": "dockerignore.rails-api",
  "templates/laravel": "dockerignore.laravel",
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
  "templates/django": ".gitignore.python",
};

/** .devcontainer/Dockerfile のコピー元（shared/docker/ 内のファイル名）。null は docker-compose を使うため Dockerfile コピー不要 */
export const DEVCONTAINER_DOCKERFILE_MAP: Readonly<Record<string, string | null>> = {
  "templates/nextjs": "Dockerfile.node",
  "templates/nodejs": "Dockerfile.node",
  "templates/reactjs": "Dockerfile.node",
  "templates/sinatra": "Dockerfile.ruby",
  "templates/rails-api": "Dockerfile.ruby",
  "templates/rails": null,
  "templates/csharp": "Dockerfile.dotnet",
  "templates/go": "Dockerfile.go",
  "templates/rust": "Dockerfile.rust",
  "templates/laravel": "Dockerfile.php",
  "templates/django": "Dockerfile.python",
};

/** ルート CI でモノレポ向けパス変換（transformStepsForMonorepo）を適用するスタック */
export const MONOREPO_PREFIX_STACKS: readonly string[] = ["csharp", "go", "rust", "laravel", "django"];

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
  { id: "django", dir: "templates/django", pathFilter: "templates/django/**" },
];
