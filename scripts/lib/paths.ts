/**
 * Centralized file paths for the generation scripts.
 * Single source of truth for all shared/ directory references.
 */

import { join } from "path";

export const ROOT = process.cwd();

// ────────────────────────────────────────────────────────────────────────
// shared/versions.json
// ────────────────────────────────────────────────────────────────────────
export const VERSIONS_JSON = join(ROOT, "shared", "versions.json");

// ────────────────────────────────────────────────────────────────────────
// shared/config/ (configuration files)
// ────────────────────────────────────────────────────────────────────────
export const SHARED_CONFIG = join(ROOT, "shared", "config");

// Lint & Format
export const SHARED_LINT_FORMAT = join(SHARED_CONFIG, "lint-format");
export const SHARED_EDITORCONFIG = join(SHARED_LINT_FORMAT, "editorconfig", ".editorconfig");
export const SHARED_ESLINT = join(SHARED_LINT_FORMAT, "eslint");
export const SHARED_PRETTIER = join(SHARED_LINT_FORMAT, "prettier");
export const SHARED_MARKUPLINT = join(SHARED_LINT_FORMAT, "markuplint");
export const SHARED_MARKDOWNLINT = join(SHARED_LINT_FORMAT, "markdownlint");
export const SHARED_RUBOCOP = join(SHARED_LINT_FORMAT, "rubocop");

// Test
export const SHARED_TEST = join(SHARED_CONFIG, "test");
export const SHARED_VITEST = join(SHARED_TEST, "vitest");
export const RSPEC_COMMON = join(SHARED_TEST, "rspec", "rspec.common");
export const SHARED_MOCKS = join(SHARED_TEST, "mocks");

// TypeScript
export const SHARED_TSCONFIG = join(SHARED_CONFIG, "tsconfig");

// Dev Container
export const SHARED_DEVCONTAINER = join(SHARED_CONFIG, "devcontainer");
export const DEVCONTAINER_DEFAULTS = join(SHARED_DEVCONTAINER, "defaults.json");

// Docker
export const SHARED_DOCKER = join(SHARED_CONFIG, "docker");
export const DOCKERFILE_NODE = join(SHARED_DOCKER, "Dockerfile.node");
export const DOCKERFILE_RUBY = join(SHARED_DOCKER, "Dockerfile.ruby");
export const DOCKERFILE_DOTNET = join(SHARED_DOCKER, "Dockerfile.dotnet");
export const DOCKERFILE_GO = join(SHARED_DOCKER, "Dockerfile.go");
export const DOCKERFILE_RUST = join(SHARED_DOCKER, "Dockerfile.rust");
export const DOCKERFILE_PHP = join(SHARED_DOCKER, "Dockerfile.php");
export const DOCKERFILE_PYTHON = join(SHARED_DOCKER, "Dockerfile.python");
export const DOCKER_COMPOSE_RUBY_DB = join(SHARED_DOCKER, "docker-compose.ruby-db.yml");
export const DOCKER_COMPOSE_RAILS = join(SHARED_DOCKER, "docker-compose.rails.yml");
export const INIT_FIREWALL = join(SHARED_DOCKER, "init-firewall.sh");

// ────────────────────────────────────────────────────────────────────────
// shared/dependencies/ (package management)
// ────────────────────────────────────────────────────────────────────────
export const SHARED_DEPENDENCIES = join(ROOT, "shared", "dependencies");
export const SHARED_NPM = join(SHARED_DEPENDENCIES, "npm");
export const SHARED_GEMFILE = join(SHARED_DEPENDENCIES, "gemfile");

// ────────────────────────────────────────────────────────────────────────
// shared/ci/ (CI/CD)
// ────────────────────────────────────────────────────────────────────────
export const SHARED_CI = join(ROOT, "shared", "ci");
export const SHARED_WORKFLOWS = join(SHARED_CI, "workflows");
export const SHARED_ACTIONS = join(SHARED_CI, "actions");

// ────────────────────────────────────────────────────────────────────────
// shared/templates/ (template files)
// ────────────────────────────────────────────────────────────────────────
export const SHARED_TEMPLATES = join(ROOT, "shared", "templates");
export const GITIGNORE_DIR = join(SHARED_TEMPLATES, "gitignore");
export const SHARED_README = join(SHARED_TEMPLATES, "readme");
export const README_TEMPLATE = join(SHARED_README, "README.md.hbs");

// ────────────────────────────────────────────────────────────────────────
// shared/extensions/ (optional stack-specific tools)
// ────────────────────────────────────────────────────────────────────────
export const SHARED_EXTENSIONS = join(ROOT, "shared", "extensions");
export const SHARED_KNIP = join(SHARED_EXTENSIONS, "knip");
export const SHARED_LIGHTHOUSE = join(SHARED_EXTENSIONS, "lighthouse");
export const SHARED_PLAYWRIGHT = join(SHARED_EXTENSIONS, "playwright");
export const SHARED_SENTRY = join(SHARED_EXTENSIONS, "sentry");
