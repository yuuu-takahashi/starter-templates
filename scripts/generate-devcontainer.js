#!/usr/bin/env node
/**
 * Generates .devcontainer/devcontainer.json (and docker-compose.yml where shared)
 * for each template. Edit this file to change devcontainer settings.
 * Run: yarn generate:devcontainer
 */

import { writeFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();

// ── Shared VSCode settings ────────────────────────────────────────────────────

const BASE_SETTINGS = {
  "editor.tabSize": 2,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": { "source.fixAll": "explicit" },
};

const RUBY_SETTINGS = {
  "[ruby]": { "editor.defaultFormatter": "Shopify.ruby-lsp" },
  "ruby.lint": { "rubocop": true },
};

const ERB_SETTINGS = {
  "[erb]": { "editor.defaultFormatter": "aliariff.vscode-erb-beautify" },
  "vscode-erb-beautify.useBundler": true,
};

// ── Per-project devcontainer.json definitions ─────────────────────────────────

const STACKS = [
  {
    dir: "nextjs",
    config: {
      name: "template-nextjs",
      build: { dockerfile: "../../.devcontainer/Dockerfile.node", context: ".." },
      workspaceFolder: "/workspace",
      mounts: [
        "source=${localWorkspaceFolder},target=/workspace,type=bind",
        "source=${localWorkspaceFolderBasename}_node_modules,target=/workspace/node_modules,type=volume",
      ],
      customizations: {
        vscode: {
          extensions: ["esbenp.prettier-vscode", "dbaeumer.vscode-eslint"],
          settings: {
            ...BASE_SETTINGS,
            "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
          },
        },
      },
    },
  },
  {
    dir: "react",
    config: {
      name: "template-react",
      build: { dockerfile: "../../.devcontainer/Dockerfile.node", context: ".." },
      workspaceFolder: "/workspace",
      mounts: [
        "source=${localWorkspaceFolder},target=/workspace,type=bind",
        "source=${localWorkspaceFolderBasename}_node_modules,target=/workspace/node_modules,type=volume",
      ],
      customizations: {
        vscode: {
          extensions: ["esbenp.prettier-vscode", "dbaeumer.vscode-eslint"],
          settings: {
            ...BASE_SETTINGS,
            "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
          },
        },
      },
    },
  },
  {
    dir: "sinatra",
    config: {
      name: "template-sinatra",
      dockerComposeFile: "./docker-compose.yml",
      service: "web",
      workspaceFolder: "/workspace",
      customizations: {
        vscode: {
          extensions: [
            "esbenp.prettier-vscode",
            "Shopify.ruby-extensions-pack",
            "aliariff.vscode-erb-beautify",
          ],
          settings: { ...BASE_SETTINGS, ...RUBY_SETTINGS, ...ERB_SETTINGS },
        },
      },
    },
  },
  {
    dir: "rails-api",
    config: {
      name: "template-rails-api",
      dockerComposeFile: "./docker-compose.yml",
      service: "web",
      workspaceFolder: "/workspace",
      customizations: {
        vscode: {
          extensions: ["esbenp.prettier-vscode", "Shopify.ruby-extensions-pack"],
          settings: { ...BASE_SETTINGS, ...RUBY_SETTINGS },
        },
      },
    },
  },
  {
    dir: "rails",
    config: {
      name: "template-rails",
      dockerComposeFile: "./docker-compose.yml",
      service: "web",
      workspaceFolder: "/workspace",
      customizations: {
        vscode: {
          extensions: [
            "esbenp.prettier-vscode",
            "Shopify.ruby-extensions-pack",
            "aliariff.vscode-erb-beautify",
            "dbaeumer.vscode-eslint",
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
    dir: "ruby",
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
          extensions: ["esbenp.prettier-vscode", "Shopify.ruby-extensions-pack"],
          settings: { ...BASE_SETTINGS, ...RUBY_SETTINGS },
        },
      },
    },
  },
];

// ── Shared docker-compose for Ruby+DB stacks ──────────────────────────────────
// Used by sinatra and rails-api (identical configuration).

const RUBY_DB_COMPOSE = `\
services:
  web:
    build:
      context: ..
      dockerfile: ../.devcontainer/Dockerfile.ruby
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

const JSON_HEADER =
  "// Generated by scripts/generate-devcontainer.js — edit that file instead.\n";
const YAML_HEADER =
  "# Generated by scripts/generate-devcontainer.js — edit that file instead.\n";

for (const { dir, config } of STACKS) {
  const outPath = join(ROOT, dir, ".devcontainer", "devcontainer.json");
  writeFileSync(outPath, JSON_HEADER + JSON.stringify(config, null, 2) + "\n", "utf8");
  console.log("Generated:", outPath);
}

for (const dir of ["sinatra", "rails-api"]) {
  const outPath = join(ROOT, dir, ".devcontainer", "docker-compose.yml");
  writeFileSync(outPath, YAML_HEADER + RUBY_DB_COMPOSE, "utf8");
  console.log("Generated:", outPath);
}
