#!/usr/bin/env tsx
/**
 * Generates .devcontainer/devcontainer.json (and docker-compose.yml where shared)
 * for each template. Edit this file to change devcontainer settings.
 * Run: yarn generate:devcontainer
 */

import { writeFileSync } from "fs";
import { join } from "path";

const ROOT: string = process.cwd();

// ── Shared VSCode extensions ──────────────────────────────────────────────────

const BASE_EXTENSIONS: string[] = ["esbenp.prettier-vscode"];
const NODE_EXTENSIONS: string[] = ["dbaeumer.vscode-eslint"];
const RUBY_EXTENSIONS: string[] = ["Shopify.ruby-extensions-pack"];
const ERB_EXTENSIONS: string[] = ["aliariff.vscode-erb-beautify"];

// ── Shared VSCode settings ────────────────────────────────────────────────────

type VscodeSettings = Record<string, unknown>;

const BASE_SETTINGS: VscodeSettings = {
  "editor.tabSize": 2,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": { "source.fixAll": "explicit" },
};

const RUBY_SETTINGS: VscodeSettings = {
  "[ruby]": { "editor.defaultFormatter": "Shopify.ruby-lsp" },
  "ruby.lint": { "rubocop": true },
};

const ERB_SETTINGS: VscodeSettings = {
  "[erb]": { "editor.defaultFormatter": "aliariff.vscode-erb-beautify" },
  "vscode-erb-beautify.useBundler": true,
};

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

const STACKS: Stack[] = [
  {
    dir: "templates/nextjs",
    config: {
      name: "template-nextjs",
      build: { dockerfile: "../../../.devcontainer/Dockerfile.node", context: "../../.." },
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
      build: { dockerfile: "../../../.devcontainer/Dockerfile.node", context: "../../.." },
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
            "eamodio.gitlens",
            "Gruntfuggly.todo-tree",
            "mhutchie.git-graph",
            "streetsidesoftware.code-spell-checker",
            "donjayamanne.githistory",
            "github.vscode-github-actions",
            "yzhang.markdown-all-in-one",
            "DavidAnson.vscode-markdownlint",
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

// From templates/<name>/.devcontainer/ → ".." is template dir, repo root is ../../..
const RUBY_DB_COMPOSE: string = `\
services:
  web:
    build:
      context: ..
      dockerfile: ../../../.devcontainer/Dockerfile.ruby
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
