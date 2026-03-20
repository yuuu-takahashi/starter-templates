/**
 * ファイアウォール許可ドメイン: カテゴリ別管理。
 * init-firewall.sh 生成時に scripts/generate-devcontainer.ts で参照する。
 *
 * 設計: npm install / pip install / bundle install / docker pull など
 * 全パッケージマネージャが通るよう、カテゴリごとに整理する。
 */

// ── GitHub ─────────────────────────────────────────────────────────────────
// init-firewall.sh では meta API で web/api/git の IP レンジを取得しているが、
// raw.githubusercontent.com / ghcr.io 等の補完のため明示追加。
export const GITHUB_FIREWALL_DOMAINS: readonly string[] = [
  'github.com',
  'api.github.com',
  'raw.githubusercontent.com',
  'objects.githubusercontent.com',
  'codeload.github.com',
  'ghcr.io',
];

// ── OS（apt / dnf 等）───────────────────────────────────────────────────────
export const OS_FIREWALL_DOMAINS: readonly string[] = [
  'deb.debian.org',
  'security.debian.org',
  'archive.ubuntu.com',
];

// ── Container（Docker pull 等）───────────────────────────────────────────────
export const CONTAINER_FIREWALL_DOMAINS: readonly string[] = [
  'registry-1.docker.io',
  'auth.docker.io',
  'production.cloudflare.docker.com',
];

// ── COMMON（全スタック共通：パッケージレジストリ・ツール・技術サイト等）────
export const COMMON_FIREWALL_DOMAINS: readonly string[] = [
  // Node / パッケージ
  'registry.npmjs.org',
  'registry.yarnpkg.com',
  'deb.nodesource.com',
  // AI・監視
  'api.anthropic.com',
  'sentry.io',
  'statsig.anthropic.com',
  'statsig.com',
  // VS Code / Cursor
  'marketplace.visualstudio.com',
  'vscode.blob.core.windows.net',
  'update.code.visualstudio.com',
  'code.visualstudio.com',
  // 海外技術サイト
  'stackoverflow.com',
  'cdn.sstatic.net',
  'developer.mozilla.org',
  'dev.to',
  'readthedocs.io',
  // 日本技術サイト
  'qiita.com',
  'zenn.dev',
  'teratail.com',
  // 公式ドキュメント
  'docs.python.org',
  'nodejs.org',
  'go.dev',
  'pkg.go.dev',
  'rust-lang.org',
  'doc.rust-lang.org',
  'docs.rs',
  'learn.microsoft.com',
  'docs.microsoft.com',
  'ruby-lang.org',
  'www.php.net',
  'laravel.com',
  'nextjs.org',
  'react.dev',
  'vuejs.org',
  'getcomposer.org',
  'github.io',
  // インフラ・クラウド
  'docs.aws.amazon.com',
  'aws.amazon.com',
  'console.aws.amazon.com',
  'registry.terraform.io',
  'developer.hashicorp.com',
  'cloud.google.com',
  'azure.microsoft.com',
  'kubernetes.io',
  'conoha.jp',
  'www.conoha.jp',
];

// ── STACK（スタック別：パッケージレジストリ等）─────────────────────────────
export const STACK_FIREWALL_DOMAINS: Readonly<Record<string, string[]>> = {
  // リポジトリルート devcontainer（各テンプレートで bundle install するため）
  monorepo: ['rubygems.org'],
  nextjs: [],
  nodejs: [],
  react: [],
  rails: ['rubygems.org'],
  'rails-api': ['rubygems.org'],
  ruby: ['rubygems.org'],
  sinatra: ['rubygems.org'],
  laravel: ['packagist.org', 'repo.packagist.org'],
  django: ['pypi.org', 'files.pythonhosted.org'],
  csharp: ['api.nuget.org', 'nuget.org', 'globalcdn.nuget.org'],
  go: ['proxy.golang.org', 'sum.golang.org'],
  rust: ['crates.io', 'static.crates.io'],
};

/**
 * 指定スタック（slug）用の許可ドメイン一覧を返す。
 * GITHUB + OS + CONTAINER + COMMON + STACK をマージし、重複を除去。
 */
export function getFirewallDomainsForStack(slug: string): string[] {
  const all = [
    ...GITHUB_FIREWALL_DOMAINS,
    ...OS_FIREWALL_DOMAINS,
    ...CONTAINER_FIREWALL_DOMAINS,
    ...COMMON_FIREWALL_DOMAINS,
    ...(STACK_FIREWALL_DOMAINS[slug] ?? []),
  ];
  return [...new Set(all)];
}
