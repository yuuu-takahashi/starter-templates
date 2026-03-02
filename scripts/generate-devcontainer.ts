#!/usr/bin/env tsx
/**
 * Generates .devcontainer/devcontainer.json (and docker-compose.yml where shared)
 * for each template. Edit this file to change devcontainer settings.
 * Run: yarn generate:devcontainer
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT: string = process.cwd();

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
  mounts?: string[];
  customizations: {
    vscode: VscodeCustomization;
  };
}

interface Stack {
  dir: string;
  config: DevcontainerConfig;
}

// Node/Ruby Dockerfiles: read from languages/ (single source of truth)
const NODE_DOCKERFILE_SRC = join(ROOT, "languages", "node", "Dockerfile");
const RUBY_DOCKERFILE_SRC = join(ROOT, "languages", "ruby", "Dockerfile");

const STACKS: Stack[] = [
  {
    dir: "templates/nextjs",
    config: {
      name: "template-nextjs",
      build: { dockerfile: "Dockerfile", context: ".." },
      workspaceFolder: "/workspace",
      mounts: [
        "source=${localWorkspaceFolder},target=/workspace,type=bind",
        "source=${localWorkspaceFolderBasename}_node_modules,target=/workspace/node_modules,type=volume",
      ],
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...NODE_EXTENSIONS],
          settings: {
            ...BASE_SETTINGS,
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
      mounts: [
        "source=${localWorkspaceFolder},target=/workspace,type=bind",
        "source=${localWorkspaceFolderBasename}_node_modules,target=/workspace/node_modules,type=volume",
      ],
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...NODE_EXTENSIONS],
          settings: {
            ...BASE_SETTINGS,
            "eslint.validate": ["javascript"],
          },
        },
      },
    },
  },
  {
    dir: "templates/react",
    config: {
      name: "template-react",
      build: { dockerfile: "Dockerfile", context: ".." },
      workspaceFolder: "/workspace",
      mounts: [
        "source=${localWorkspaceFolder},target=/workspace,type=bind",
        "source=${localWorkspaceFolderBasename}_node_modules,target=/workspace/node_modules,type=volume",
      ],
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...NODE_EXTENSIONS],
          settings: {
            ...BASE_SETTINGS,
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
    dir: "templates/ruby",
    config: {
      name: "Ruby",
      build: { dockerfile: "Dockerfile", context: ".." },
      workspaceFolder: "/workspace",
      mounts: [
        "source=${localWorkspaceFolder},target=/workspace,type=bind",
        "source=${localWorkspaceFolderBasename}_node_modules,target=/workspace/node_modules,type=volume",
        "source=${localWorkspaceFolderBasename}_bundle,target=/workspace/vendor/bundle,type=volume",
      ],
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...RUBY_EXTENSIONS],
          settings: { ...BASE_SETTINGS, ...RUBY_SETTINGS },
        },
      },
    },
  },
];

// ── Shared docker-compose for Ruby+DB stacks ──────────────────────────────────
// Used by sinatra and rails-api (identical configuration).

// docker-compose for Ruby+DB (sinatra, rails-api). Dockerfile is in .devcontainer/ (standalone).
const RUBY_DB_COMPOSE: string = `\
services:
  web:
    build:
      context: ..
      dockerfile: Dockerfile
    volumes:
      - ..:/workspace
      - node_modules_cache:/workspace/node_modules
      - gem_cache:/workspace/vendor/bundle
    env_file: ../.env.development
    tty: true
    stdin_open: true
    command: ['sleep', 'infinity']
    depends_on:
      - db

  db:
    image: mysql:8
    env_file: ../.env.development
    volumes:
      - db_data:/var/lib/mysql

volumes:
  node_modules_cache:
  gem_cache:
  db_data:
`;

// ── Generator ─────────────────────────────────────────────────────────────────

const JSON_HEADER: string =
  "// Generated by scripts/generate-devcontainer.ts — edit that file instead.\n";
const YAML_HEADER: string =
  "# Generated by scripts/generate-devcontainer.ts — edit that file instead.\n";
const DOCKERFILE_HEADER: string =
  "# Generated by scripts/generate-devcontainer.ts — edit languages/node/Dockerfile or languages/ruby/Dockerfile and re-run.\n\n";

// Node templates: copy languages/node/Dockerfile so each template works standalone
const NODE_TEMPLATE_DIRS = ["templates/nextjs", "templates/nodejs", "templates/react"];
const nodeDockerfileContent = readFileSync(NODE_DOCKERFILE_SRC, "utf8");
for (const dir of NODE_TEMPLATE_DIRS) {
  const outPath = join(ROOT, dir, ".devcontainer", "Dockerfile");
  writeFileSync(outPath, DOCKERFILE_HEADER + nodeDockerfileContent, "utf8");
  console.log("Generated:", outPath);
}

// Ruby+DB templates: copy languages/ruby/Dockerfile so folder works standalone
const rubyDockerfileContent = readFileSync(RUBY_DOCKERFILE_SRC, "utf8");
for (const dir of ["templates/sinatra", "templates/rails-api"]) {
  const outPath = join(ROOT, dir, ".devcontainer", "Dockerfile");
  writeFileSync(outPath, DOCKERFILE_HEADER + rubyDockerfileContent, "utf8");
  console.log("Generated:", outPath);
}

for (const { dir, config } of STACKS) {
  const outPath = join(ROOT, dir, ".devcontainer", "devcontainer.json");
  writeFileSync(outPath, JSON_HEADER + JSON.stringify(config, null, 2) + "\n", "utf8");
  console.log("Generated:", outPath);
}

for (const dir of ["templates/sinatra", "templates/rails-api"]) {
  const outPath = join(ROOT, dir, ".devcontainer", "docker-compose.yml");
  writeFileSync(outPath, YAML_HEADER + RUBY_DB_COMPOSE, "utf8");
  console.log("Generated:", outPath);
}
