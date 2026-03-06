#!/usr/bin/env tsx
/**
 * Generates .devcontainer/devcontainer.json (and docker-compose.yml where shared)
 * for each template.
 *
 * - 拡張機能・VSCode 設定の共通定義 → shared/devcontainer/defaults.json を編集
 * - 各テンプレートのビルド・マウント・どの組み合わせを使うか → このファイルの STACKS を編集
 *
 * Run: yarn generate:devcontainer
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { DEVCONTAINER_DOCKERFILE_MAP } from "./lib/stacks.js";
import { ROOT } from "./lib/utils.js";

// ── Shared devcontainer defaults (extensions + settings) ───────────────────────
// 共通定義: shared/devcontainer/defaults.json を編集すること。

const DEFAULTS_PATH = join(ROOT, "shared", "devcontainer", "defaults.json");
const DEFAULTS = JSON.parse(
  readFileSync(DEFAULTS_PATH, "utf8")
) as {
  extensions: {
    base: string[];
    node: string[];
    ruby: string[];
    erb: string[];
    php: string[];
    python: string[];
    csharp: string[];
    go: string[];
    rust: string[];
    tooling: string[];
  };
  settings: {
    base: Record<string, unknown>;
    ruby: Record<string, unknown>;
    erb: Record<string, unknown>;
  };
};

const BASE_EXTENSIONS = DEFAULTS.extensions.base;
const NODE_EXTENSIONS = DEFAULTS.extensions.node;
const RUBY_EXTENSIONS = DEFAULTS.extensions.ruby;
const ERB_EXTENSIONS = DEFAULTS.extensions.erb;
const CSHARP_EXTENSIONS = DEFAULTS.extensions.csharp;
const GO_EXTENSIONS = DEFAULTS.extensions.go;
const RUST_EXTENSIONS = DEFAULTS.extensions.rust;
const PHP_EXTENSIONS = DEFAULTS.extensions.php;
const PYTHON_EXTENSIONS = DEFAULTS.extensions.python;
const TOOLING_EXTENSIONS = DEFAULTS.extensions.tooling;

type VscodeSettings = Record<string, unknown>;

const BASE_SETTINGS: VscodeSettings = DEFAULTS.settings.base;
const RUBY_SETTINGS: VscodeSettings = DEFAULTS.settings.ruby;
const ERB_SETTINGS: VscodeSettings = DEFAULTS.settings.erb;

// ── Per-project devcontainer.json definitions ─────────────────────────────────

interface DevcontainerBuild {
  dockerfile: string;
  context: string;
}

interface VscodeCustomization {
  extensions: string[];
  settings: VscodeSettings;
}

interface DevcontainerConfig {
  name: string;
  build?: DevcontainerBuild;
  dockerComposeFile?: string;
  service?: string;
  workspaceFolder: string;
  remoteUser?: string;
  mounts?: string[];
  containerEnv?: Record<string, string>;
  forwardPorts?: number[];
  portsAttributes?: Record<string, { label: string; onAutoForward: string }>;
  postCreateCommand?: string | string[];
  customizations: {
    vscode: VscodeCustomization;
    cursor: VscodeCustomization;
  };
}

interface Stack {
  dir: string;
  config: DevcontainerConfig;
}

// Dockerfile paths in shared/docker/ (single source of truth)
const NODE_DOCKERFILE_SRC = join(ROOT, "shared", "docker", "Dockerfile.node");
const RUBY_DOCKERFILE_SRC = join(ROOT, "shared", "docker", "Dockerfile.ruby");
const DOTNET_DOCKERFILE_SRC = join(ROOT, "shared", "docker", "Dockerfile.dotnet");
const GO_DOCKERFILE_SRC = join(ROOT, "shared", "docker", "Dockerfile.go");
const RUST_DOCKERFILE_SRC = join(ROOT, "shared", "docker", "Dockerfile.rust");
const PHP_DOCKERFILE_SRC = join(ROOT, "shared", "docker", "Dockerfile.php");
const PYTHON_DOCKERFILE_SRC = join(ROOT, "shared", "docker", "Dockerfile.python");

// Node devcontainer options (reference: anthropics/claude-code .devcontainer)
const NODE_MOUNTS = [
  "source=${localWorkspaceFolder},target=/workspace,type=bind,consistency=delegated",
  "source=${localWorkspaceFolderBasename}_node_modules,target=/workspace/node_modules,type=volume",
  "source=${localWorkspaceFolderBasename}-bashhistory-${devcontainerId},target=/commandhistory,type=volume",
];
const NODE_CONTAINER_ENV = { NODE_OPTIONS: "--max-old-space-size=4096" };
const NODE_TERMINAL_SETTINGS = {
  "terminal.integrated.defaultProfile.linux": "zsh",
  "terminal.integrated.profiles.linux": {
    bash: { path: "bash", icon: "terminal-bash" },
    zsh: { path: "zsh" },
  },
};

const STACKS: Stack[] = [
  {
    dir: "templates/nextjs",
    config: {
      name: "template-nextjs",
      build: { dockerfile: "Dockerfile", context: ".." },
      workspaceFolder: "/workspace",
      remoteUser: "node",
      mounts: NODE_MOUNTS,
      containerEnv: NODE_CONTAINER_ENV,
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...NODE_EXTENSIONS],
          settings: {
            ...BASE_SETTINGS,
            ...NODE_TERMINAL_SETTINGS,
            "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
          },
        },
      },
    },
  },
  {
    dir: "templates/nodejs",
    config: {
      name: "template-nodejs",
      build: { dockerfile: "Dockerfile", context: ".." },
      workspaceFolder: "/workspace",
      remoteUser: "node",
      mounts: NODE_MOUNTS,
      containerEnv: NODE_CONTAINER_ENV,
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...NODE_EXTENSIONS],
          settings: {
            ...BASE_SETTINGS,
            ...NODE_TERMINAL_SETTINGS,
            "eslint.validate": ["javascript"],
          },
        },
      },
    },
  },
  {
    dir: "templates/reactjs",
    config: {
      name: "template-reactjs",
      build: { dockerfile: "Dockerfile", context: ".." },
      workspaceFolder: "/workspace",
      remoteUser: "node",
      mounts: NODE_MOUNTS,
      containerEnv: NODE_CONTAINER_ENV,
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...NODE_EXTENSIONS],
          settings: {
            ...BASE_SETTINGS,
            ...NODE_TERMINAL_SETTINGS,
            "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
          },
        },
      },
    },
  },
  {
    dir: "templates/sinatra",
    config: {
      name: "template-sinatra",
      dockerComposeFile: "./docker-compose.yml",
      service: "web",
      workspaceFolder: "/workspace",
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...RUBY_EXTENSIONS, ...ERB_EXTENSIONS],
          settings: { ...BASE_SETTINGS, ...RUBY_SETTINGS, ...ERB_SETTINGS },
        },
      },
    },
  },
  {
    dir: "templates/rails-api",
    config: {
      name: "template-rails-api",
      dockerComposeFile: "./docker-compose.yml",
      service: "web",
      workspaceFolder: "/workspace",
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...RUBY_EXTENSIONS],
          settings: { ...BASE_SETTINGS, ...RUBY_SETTINGS },
        },
      },
    },
  },
  {
    dir: "templates/rails",
    config: {
      name: "template-rails",
      dockerComposeFile: "./docker-compose.yml",
      service: "web",
      workspaceFolder: "/workspace",
      customizations: {
        vscode: {
          extensions: [
            ...BASE_EXTENSIONS,
            ...RUBY_EXTENSIONS,
            ...ERB_EXTENSIONS,
            ...NODE_EXTENSIONS,
            ...TOOLING_EXTENSIONS,
          ],
          settings: {
            ...BASE_SETTINGS,
            ...RUBY_SETTINGS,
            ...ERB_SETTINGS,
            "eslint.validate": ["javascript"],
          },
        },
      },
    },
  },
  {
    dir: "templates/csharp",
    config: {
      name: "template-csharp",
      build: { dockerfile: "Dockerfile", context: ".." },
      workspaceFolder: "/workspace",
      mounts: [
        "source=${localWorkspaceFolder},target=/workspace,type=bind",
      ],
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...CSHARP_EXTENSIONS],
          settings: { ...BASE_SETTINGS },
        },
      },
    },
  },
  {
    dir: "templates/go",
    config: {
      name: "template-go",
      build: { dockerfile: "Dockerfile", context: ".." },
      workspaceFolder: "/workspace",
      mounts: [
        "source=${localWorkspaceFolder},target=/workspace,type=bind",
      ],
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...GO_EXTENSIONS],
          settings: { ...BASE_SETTINGS },
        },
      },
    },
  },
  {
    dir: "templates/rust",
    config: {
      name: "template-rust",
      build: { dockerfile: "Dockerfile", context: ".." },
      workspaceFolder: "/workspace",
      mounts: [
        "source=${localWorkspaceFolder},target=/workspace,type=bind",
      ],
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...RUST_EXTENSIONS],
          settings: { ...BASE_SETTINGS },
        },
      },
    },
  },
  {
    dir: "templates/laravel",
    config: {
      name: "template-laravel",
      build: { dockerfile: "Dockerfile", context: ".." },
      workspaceFolder: "/workspace",
      mounts: [
        "source=${localWorkspaceFolder},target=/workspace,type=bind",
      ],
      postCreateCommand: [
        "bash -c '[ -f .env ] || cp .env.example .env'",
        "php artisan key:generate --force",
        "composer install --no-interaction",
      ],
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...PHP_EXTENSIONS, ...TOOLING_EXTENSIONS],
          settings: { ...BASE_SETTINGS },
        },
      },
    },
  },
  {
    dir: "templates/django",
    config: {
      name: "template-django",
      build: { dockerfile: "Dockerfile", context: ".." },
      workspaceFolder: "/workspace",
      mounts: [
        "source=${localWorkspaceFolder},target=/workspace,type=bind",
      ],
      forwardPorts: [8000],
      portsAttributes: {
        "8000": { label: "Django", onAutoForward: "openPreview" },
      },
      postCreateCommand: [
        "python -m venv .venv",
        ". .venv/bin/activate && pip install -r requirements.txt",
      ],
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...PYTHON_EXTENSIONS],
          settings: { ...BASE_SETTINGS },
        },
      },
    },
  },
];

// ── Shared docker-compose ──────────────────────────────────────────────────────
// ruby-db: sinatra, rails-api. rails: rails only (different env/command).

const RUBY_DB_COMPOSE_SRC = join(ROOT, "shared", "docker", "docker-compose.ruby-db.yml");
const RAILS_COMPOSE_SRC = join(ROOT, "shared", "docker", "docker-compose.rails.yml");

// ── Generator ─────────────────────────────────────────────────────────────────

const JSON_HEADER: string =
  "// Generated by scripts/generate-devcontainer.ts — edit that file instead.\n";
const YAML_HEADER_RUBY_DB: string =
  "# Generated by scripts/generate-devcontainer.ts — edit shared/docker/docker-compose.ruby-db.yml instead.\n";
const YAML_HEADER_RAILS: string =
  "# Generated by scripts/generate-devcontainer.ts — edit shared/docker/docker-compose.rails.yml instead.\n";

const DOCKERFILE_SRCS: Record<string, string> = {
  "Dockerfile.node": NODE_DOCKERFILE_SRC,
  "Dockerfile.ruby": RUBY_DOCKERFILE_SRC,
  "Dockerfile.dotnet": DOTNET_DOCKERFILE_SRC,
  "Dockerfile.go": GO_DOCKERFILE_SRC,
  "Dockerfile.rust": RUST_DOCKERFILE_SRC,
  "Dockerfile.php": PHP_DOCKERFILE_SRC,
  "Dockerfile.python": PYTHON_DOCKERFILE_SRC,
};

function dockerfileHeader(srcFile: string): string {
  return `# Generated by scripts/generate-devcontainer.ts — edit shared/docker/${srcFile} and re-run.\n\n`;
}

// Copy Dockerfiles to each template that needs one (null = uses docker-compose)
for (const [dir, dockerfileName] of Object.entries(DEVCONTAINER_DOCKERFILE_MAP)) {
  if (dockerfileName === null) continue;
  const outDir = join(ROOT, dir, ".devcontainer");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "Dockerfile");
  const content = readFileSync(DOCKERFILE_SRCS[dockerfileName], "utf8");
  writeFileSync(outPath, dockerfileHeader(dockerfileName) + content, "utf8");
  console.log("Generated:", outPath);
}

for (const { dir, config } of STACKS) {
  const outPath = join(ROOT, dir, ".devcontainer", "devcontainer.json");
  const configWithCursor = {
    ...config,
    customizations: {
      vscode: config.customizations.vscode,
      cursor: config.customizations.vscode,
    },
  };
  writeFileSync(outPath, JSON_HEADER + JSON.stringify(configWithCursor, null, 2) + "\n", "utf8");
  console.log("Generated:", outPath);
}

const rubyDbComposeContent = readFileSync(RUBY_DB_COMPOSE_SRC, "utf8");
for (const dir of ["templates/sinatra", "templates/rails-api"]) {
  const outPath = join(ROOT, dir, ".devcontainer", "docker-compose.yml");
  writeFileSync(outPath, YAML_HEADER_RUBY_DB + rubyDbComposeContent, "utf8");
  console.log("Generated:", outPath);
}

const railsComposeContent = readFileSync(RAILS_COMPOSE_SRC, "utf8");
const railsComposeOut = join(ROOT, "templates/rails", ".devcontainer", "docker-compose.yml");
writeFileSync(railsComposeOut, YAML_HEADER_RAILS + railsComposeContent, "utf8");
console.log("Generated:", railsComposeOut);
