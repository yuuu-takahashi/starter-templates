/**
 * テンプレート・スタックの一覧を一元定義。
 * 新規テンプレート追加時は STACK_DEFINITIONS に1エントリ追加するだけで、
 * TEMPLATE_DIRS / CODE_CHECK_SOURCE / ROOT_STACKS 等はすべてここから導出される。
 */

/** ランタイム種別（.xxx-version の配布先判定に使用） */
export type Runtime = "node" | "ruby" | "python" | "php" | "go" | "dotnet" | "rust";

/** 1テンプレート分の定義。ここだけ編集すれば他定数は自動で整合する */
export interface StackDefinition {
  /** テンプレートディレクトリ（templates/ からの相対） */
  dir: string;
  /** ルートワークフロー用 ID（path_filter のキー、ハイフンはアンダースコア） */
  id: string;
  /** ランタイム（.node-version / .ruby-version 等の配布先） */
  runtime: Runtime;
  /** code-check.yml の元ファイル（shared/workflows/ 内） */
  codeCheckWorkflow: string;
  /** test.yml の元ファイル（shared/workflows/ 内）。未定義なら test.yml は生成しない */
  testWorkflow?: string;
  /** .gitignore の元ファイル（shared/gitignore/ 内） */
  gitignore: string;
  /** .devcontainer 用 Dockerfile（shared/docker/ 内）。null は docker-compose のみ */
  devcontainerDockerfile: string | null;
  /** package.json を shared/npm/<slug>.json から生成する */
  hasNpm: boolean;
  /** Gemfile を shared/gemfile/Gemfile.<slug> から生成する */
  hasGemfile: boolean;
  /** ルート CI でモノレポ向け path/working-directory 変換を適用する */
  monorepoPrefix: boolean;
}

/** スタック名（dir の "templates/" 以降、例: nextjs, rails-api） */
function slug(dir: string): string {
  return dir.replace(/^templates\//, "");
}

export const STACK_DEFINITIONS: readonly StackDefinition[] = [
  { dir: "templates/nextjs", id: "nextjs", runtime: "node", codeCheckWorkflow: "code-check-node.yml", testWorkflow: "test-node.yml", gitignore: ".gitignore.node", devcontainerDockerfile: "Dockerfile.node", hasNpm: true, hasGemfile: false, monorepoPrefix: false },
  { dir: "templates/nodejs", id: "nodejs", runtime: "node", codeCheckWorkflow: "code-check-node.yml", testWorkflow: "test-node.yml", gitignore: ".gitignore.node", devcontainerDockerfile: "Dockerfile.node", hasNpm: true, hasGemfile: false, monorepoPrefix: false },
  { dir: "templates/reactjs", id: "reactjs", runtime: "node", codeCheckWorkflow: "code-check-node.yml", testWorkflow: "test-node.yml", gitignore: ".gitignore.node", devcontainerDockerfile: "Dockerfile.node", hasNpm: true, hasGemfile: false, monorepoPrefix: false },
  { dir: "templates/rails", id: "rails", runtime: "ruby", codeCheckWorkflow: "code-check-ruby-erb.yml", testWorkflow: "test-rails.yml", gitignore: ".gitignore.rails", devcontainerDockerfile: null, hasNpm: true, hasGemfile: true, monorepoPrefix: false },
  { dir: "templates/rails-api", id: "rails_api", runtime: "ruby", codeCheckWorkflow: "code-check-ruby.yml", testWorkflow: "test-rails-api.yml", gitignore: ".gitignore.rails", devcontainerDockerfile: "Dockerfile.ruby", hasNpm: true, hasGemfile: true, monorepoPrefix: false },
  { dir: "templates/laravel", id: "laravel", runtime: "php", codeCheckWorkflow: "code-check-laravel.yml", testWorkflow: "test-laravel.yml", gitignore: ".gitignore.laravel", devcontainerDockerfile: "Dockerfile.php", hasNpm: false, hasGemfile: false, monorepoPrefix: true },
  { dir: "templates/sinatra", id: "sinatra", runtime: "ruby", codeCheckWorkflow: "code-check-ruby-erb.yml", testWorkflow: "test-sinatra.yml", gitignore: ".gitignore.ruby", devcontainerDockerfile: "Dockerfile.ruby", hasNpm: true, hasGemfile: true, monorepoPrefix: false },
  { dir: "templates/csharp", id: "csharp", runtime: "dotnet", codeCheckWorkflow: "code-check-dotnet.yml", testWorkflow: "test-dotnet.yml", gitignore: ".gitignore.dotnet", devcontainerDockerfile: "Dockerfile.dotnet", hasNpm: false, hasGemfile: false, monorepoPrefix: true },
  { dir: "templates/go", id: "go", runtime: "go", codeCheckWorkflow: "code-check-go.yml", testWorkflow: "test-go.yml", gitignore: ".gitignore.go", devcontainerDockerfile: "Dockerfile.go", hasNpm: false, hasGemfile: false, monorepoPrefix: true },
  { dir: "templates/rust", id: "rust", runtime: "rust", codeCheckWorkflow: "code-check-rust.yml", testWorkflow: "test-rust.yml", gitignore: ".gitignore.rust", devcontainerDockerfile: "Dockerfile.rust", hasNpm: false, hasGemfile: false, monorepoPrefix: true },
  { dir: "templates/django", id: "django", runtime: "python", codeCheckWorkflow: "code-check-django.yml", testWorkflow: "test-django.yml", gitignore: ".gitignore.python", devcontainerDockerfile: "Dockerfile.python", hasNpm: false, hasGemfile: false, monorepoPrefix: true },
];

// ── 以下は STACK_DEFINITIONS から導出（手で直さない）────────────────────────────

/** 全テンプレートのディレクトリ（templates/ からの相対パス） */
export const TEMPLATE_DIRS: readonly string[] = STACK_DEFINITIONS.map((s) => s.dir);

/** package.json を shared/npm/<stack>.json から生成するスタック名一覧 */
export const NPM_STACKS: readonly string[] = STACK_DEFINITIONS.filter((s) => s.hasNpm).map((s) => slug(s.dir));

/** Gemfile を shared/gemfile/ から生成するスタック名一覧 */
export const GEMFILE_STACKS: readonly string[] = STACK_DEFINITIONS.filter((s) => s.hasGemfile).map((s) => slug(s.dir));

/** .node-version を配布するテンプレート */
export const NODE_VERSION_DIRS: readonly string[] = STACK_DEFINITIONS.filter((s) => s.runtime === "node").map((s) => s.dir);

/** .ruby-version を配布するテンプレート */
export const RUBY_VERSION_DIRS: readonly string[] = STACK_DEFINITIONS.filter((s) => s.runtime === "ruby").map((s) => s.dir);

/** .python-version を配布するテンプレート */
export const PYTHON_VERSION_DIRS: readonly string[] = STACK_DEFINITIONS.filter((s) => s.runtime === "python").map((s) => s.dir);

/** .php-version を配布するテンプレート */
export const PHP_VERSION_DIRS: readonly string[] = STACK_DEFINITIONS.filter((s) => s.runtime === "php").map((s) => s.dir);

/** .go-version を配布するテンプレート */
export const GO_VERSION_DIRS: readonly string[] = STACK_DEFINITIONS.filter((s) => s.runtime === "go").map((s) => s.dir);

/** code-check.yml の元ワークフロー名（shared/workflows/ 内のファイル名） */
export const CODE_CHECK_SOURCE: Readonly<Record<string, string>> = Object.fromEntries(STACK_DEFINITIONS.map((s) => [s.dir, s.codeCheckWorkflow]));

/** test.yml を生成するテンプレートと元ワークフロー名 */
export const TEST_SOURCE: Readonly<Record<string, string>> = Object.fromEntries(
  STACK_DEFINITIONS.filter((s) => s.testWorkflow != null).map((s) => [s.dir, s.testWorkflow!])
);

/** .gitignore の元ファイル名（shared/gitignore/ 内） */
export const GITIGNORE_SOURCE: Readonly<Record<string, string>> = Object.fromEntries(STACK_DEFINITIONS.map((s) => [s.dir, s.gitignore]));

/** .dockerignore の元ファイル名（shared/docker/ 内）。フレームワーク数だけ用意し、テンプレートごとに1ファイル */
export const DOCKERIGNORE_SOURCE: Readonly<Record<string, string>> = Object.fromEntries(
  STACK_DEFINITIONS.map((s) => [s.dir, `dockerignore.${slug(s.dir)}`])
);

/** .devcontainer/Dockerfile のコピー元（shared/docker/ 内）。null は docker-compose のみ */
export const DEVCONTAINER_DOCKERFILE_MAP: Readonly<Record<string, string | null>> = Object.fromEntries(
  STACK_DEFINITIONS.map((s) => [s.dir, s.devcontainerDockerfile])
);

/** ルート CI でモノレポ向け path 変換を適用するスタック名（slug） */
export const MONOREPO_PREFIX_STACKS: readonly string[] = STACK_DEFINITIONS.filter((s) => s.monorepoPrefix).map((s) => slug(s.dir));

/** ルート CI（generate-root-workflow）用: id / dir / pathFilter / runtime */
export interface RootStackEntry {
  id: string;
  dir: string;
  pathFilter: string;
  runtime: Runtime;
}

export const ROOT_STACKS: readonly RootStackEntry[] = STACK_DEFINITIONS.map((s) => ({
  id: s.id,
  dir: s.dir,
  pathFilter: `${s.dir}/**`,
  runtime: s.runtime,
}));
