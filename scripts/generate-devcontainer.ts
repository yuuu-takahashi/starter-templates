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

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { getFirewallDomainsForStack } from './lib/firewall-domains.js';
import { logger } from './lib/logger.js';
import {
  DEVCONTAINER_DOCKERFILE_MAP,
  STACK_DEFINITIONS,
  TEMPLATES_DIR,
} from './lib/stacks.js';
import { ROOT } from './lib/utils.js';

// ── Shared devcontainer defaults (extensions + settings) ───────────────────────
// 共通定義: shared/devcontainer/defaults.json を編集すること。

const DEFAULTS_PATH = join(ROOT, 'shared', 'devcontainer', 'defaults.json');
const DEFAULTS = JSON.parse(readFileSync(DEFAULTS_PATH, 'utf8')) as {
  features?: Record<string, Record<string, unknown>>;
  /** full-templates のみに適用する features（例: github-cli） */
  featuresFullOnly?: Record<string, Record<string, unknown>>;
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
    markdownPreview: string[];
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
const MARKDOWN_PREVIEW_EXTENSIONS = DEFAULTS.extensions.markdownPreview;

type VscodeSettings = Record<string, unknown>;

const BASE_SETTINGS: VscodeSettings = DEFAULTS.settings.base;
const RUBY_SETTINGS: VscodeSettings = DEFAULTS.settings.ruby;
const ERB_SETTINGS: VscodeSettings = DEFAULTS.settings.erb;

// ── Per-project devcontainer.json definitions ─────────────────────────────────

interface DevcontainerBuild {
  dockerfile: string;
  context: string;
  args?: Record<string, string>;
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
  workspaceMount?: string;
  remoteUser?: string;
  mounts?: string[];
  runArgs?: string[];
  containerEnv?: Record<string, string>;
  postStartCommand?: string;
  waitFor?: string;
  forwardPorts?: number[];
  portsAttributes?: Record<string, { label: string; onAutoForward: string }>;
  postCreateCommand?: string | string[];
  features?: Record<string, Record<string, unknown>>;
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
const NODE_DOCKERFILE_SRC = join(ROOT, 'shared', 'docker', 'Dockerfile.node');
const RUBY_DOCKERFILE_SRC = join(ROOT, 'shared', 'docker', 'Dockerfile.ruby');
const RUBY_MONOREPO_DOCKERFILE_SRC = join(
  ROOT,
  'shared',
  'docker',
  'Dockerfile.ruby-monorepo',
);
const DOTNET_DOCKERFILE_SRC = join(
  ROOT,
  'shared',
  'docker',
  'Dockerfile.dotnet',
);
const GO_DOCKERFILE_SRC = join(ROOT, 'shared', 'docker', 'Dockerfile.go');
const RUST_DOCKERFILE_SRC = join(ROOT, 'shared', 'docker', 'Dockerfile.rust');
const PHP_DOCKERFILE_SRC = join(ROOT, 'shared', 'docker', 'Dockerfile.php');
const PYTHON_DOCKERFILE_SRC = join(
  ROOT,
  'shared',
  'docker',
  'Dockerfile.python',
);

// Common devcontainer options (reference: anthropics/claude-code .devcontainer)
const WORKSPACE_MOUNT =
  'source=${localWorkspaceFolder},target=/workspace,type=bind,consistency=delegated';
const BUILD_ARGS_TZ: Record<string, string> = { TZ: '${localEnv:TZ:UTC}' };
// All non-Node Dockerfiles install Node + Claude Code + firewall; need these build args
const BUILD_ARGS_DEVCONTAINER: Record<string, string> = {
  ...BUILD_ARGS_TZ,
  CLAUDE_CODE_VERSION: 'latest',
};
const RUN_ARGS_FIREWALL = ['--cap-add=NET_ADMIN', '--cap-add=NET_RAW'];
const POST_START_FIREWALL = 'sudo /usr/local/bin/init-firewall.sh';

// Mounts for Claude Code and shell (reference: anthropics/claude-code devcontainer)
const CLAUDE_BASE_MOUNTS = [
  'source=${localWorkspaceFolderBasename}-bashhistory-${devcontainerId},target=/commandhistory,type=volume',
  'source=${localWorkspaceFolderBasename}-claude-config-${devcontainerId},target=/home/node/.claude,type=volume',
];

// Node-specific (firewall, zsh, git-delta, bash history, Claude config)
// Note: node_modules is NOT mounted separately; bind mount with delegated consistency is sufficient
const NODE_MOUNTS = CLAUDE_BASE_MOUNTS;
const NODE_BUILD_ARGS: Record<string, string> = {
  ...BUILD_ARGS_TZ,
  CLAUDE_CODE_VERSION: 'latest',
  GIT_DELTA_VERSION: '0.18.2',
  ZSH_IN_DOCKER_VERSION: '1.2.0',
};
const NODE_RUN_ARGS = RUN_ARGS_FIREWALL;
// Claude Code and shell (reference: anthropics/claude-code devcontainer)
const CONTAINER_ENV_CLAUDE: Record<string, string> = {
  CLAUDE_CONFIG_DIR: '/home/node/.claude',
  POWERLEVEL9K_DISABLE_GITSTATUS: 'true',
};
const NODE_CONTAINER_ENV: Record<string, string> = {
  ...CONTAINER_ENV_CLAUDE,
  NODE_OPTIONS: '--max-old-space-size=4096',
};
const NODE_POST_START = POST_START_FIREWALL;
const CONTAINER_ENV_FIREWALL = CONTAINER_ENV_CLAUDE;
const NODE_TERMINAL_SETTINGS = {
  'terminal.integrated.defaultProfile.linux': 'zsh',
  'terminal.integrated.profiles.linux': {
    bash: { path: 'bash', icon: 'terminal-bash' },
    zsh: { path: 'zsh' },
  },
};

const STACKS: Stack[] = [
  {
    dir: `${TEMPLATES_DIR}/nextjs`,
    config: {
      name: 'template-nextjs',
      build: { dockerfile: 'Dockerfile', context: '..', args: NODE_BUILD_ARGS },
      workspaceFolder: '/workspace',
      workspaceMount: WORKSPACE_MOUNT,
      remoteUser: 'node',
      mounts: NODE_MOUNTS,
      runArgs: NODE_RUN_ARGS,
      containerEnv: NODE_CONTAINER_ENV,
      postStartCommand: NODE_POST_START,
      waitFor: 'postStartCommand',
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...NODE_EXTENSIONS],
          settings: {
            ...BASE_SETTINGS,
            ...NODE_TERMINAL_SETTINGS,
            'eslint.validate': [
              'javascript',
              'javascriptreact',
              'typescript',
              'typescriptreact',
            ],
          },
        },
      },
    },
  },
  {
    dir: 'full-templates/nextjs',
    config: {
      name: 'full-template-nextjs',
      build: { dockerfile: 'Dockerfile', context: '..', args: NODE_BUILD_ARGS },
      workspaceFolder: '/workspace',
      workspaceMount: WORKSPACE_MOUNT,
      remoteUser: 'node',
      mounts: NODE_MOUNTS,
      runArgs: NODE_RUN_ARGS,
      containerEnv: NODE_CONTAINER_ENV,
      postStartCommand: NODE_POST_START,
      waitFor: 'postStartCommand',
      customizations: {
        vscode: {
          extensions: [
            ...BASE_EXTENSIONS,
            ...NODE_EXTENSIONS,
            ...MARKDOWN_PREVIEW_EXTENSIONS,
          ],
          settings: {
            ...BASE_SETTINGS,
            ...NODE_TERMINAL_SETTINGS,
            'eslint.validate': [
              'javascript',
              'javascriptreact',
              'typescript',
              'typescriptreact',
            ],
          },
        },
      },
    },
  },
  {
    dir: `${TEMPLATES_DIR}/nodejs`,
    config: {
      name: 'template-nodejs',
      build: { dockerfile: 'Dockerfile', context: '..', args: NODE_BUILD_ARGS },
      workspaceFolder: '/workspace',
      workspaceMount: WORKSPACE_MOUNT,
      remoteUser: 'node',
      mounts: NODE_MOUNTS,
      runArgs: NODE_RUN_ARGS,
      containerEnv: NODE_CONTAINER_ENV,
      postStartCommand: NODE_POST_START,
      waitFor: 'postStartCommand',
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...NODE_EXTENSIONS],
          settings: {
            ...BASE_SETTINGS,
            ...NODE_TERMINAL_SETTINGS,
            'eslint.validate': ['javascript'],
          },
        },
      },
    },
  },
  {
    dir: `${TEMPLATES_DIR}/react`,
    config: {
      name: 'template-react',
      build: { dockerfile: 'Dockerfile', context: '..', args: NODE_BUILD_ARGS },
      workspaceFolder: '/workspace',
      workspaceMount: WORKSPACE_MOUNT,
      remoteUser: 'node',
      mounts: NODE_MOUNTS,
      runArgs: NODE_RUN_ARGS,
      containerEnv: NODE_CONTAINER_ENV,
      postStartCommand: NODE_POST_START,
      waitFor: 'postStartCommand',
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...NODE_EXTENSIONS],
          settings: {
            ...BASE_SETTINGS,
            ...NODE_TERMINAL_SETTINGS,
            'eslint.validate': [
              'javascript',
              'javascriptreact',
              'typescript',
              'typescriptreact',
            ],
          },
        },
      },
    },
  },
  {
    dir: `${TEMPLATES_DIR}/sinatra`,
    config: {
      name: 'template-sinatra',
      dockerComposeFile: './docker-compose.yml',
      service: 'web',
      workspaceFolder: '/workspace',
      workspaceMount: WORKSPACE_MOUNT,
      remoteUser: 'node',
      mounts: CLAUDE_BASE_MOUNTS,
      runArgs: RUN_ARGS_FIREWALL,
      containerEnv: CONTAINER_ENV_FIREWALL,
      postStartCommand: POST_START_FIREWALL,
      waitFor: 'postStartCommand',
      customizations: {
        vscode: {
          extensions: [
            ...BASE_EXTENSIONS,
            ...RUBY_EXTENSIONS,
            ...ERB_EXTENSIONS,
          ],
          settings: { ...BASE_SETTINGS, ...RUBY_SETTINGS, ...ERB_SETTINGS },
        },
      },
    },
  },
  {
    dir: `${TEMPLATES_DIR}/ruby`,
    config: {
      name: 'template-ruby',
      build: {
        dockerfile: 'Dockerfile',
        context: '..',
        args: BUILD_ARGS_DEVCONTAINER,
      },
      workspaceFolder: '/workspace',
      workspaceMount: WORKSPACE_MOUNT,
      remoteUser: 'node',
      mounts: CLAUDE_BASE_MOUNTS,
      runArgs: RUN_ARGS_FIREWALL,
      containerEnv: CONTAINER_ENV_FIREWALL,
      postStartCommand: POST_START_FIREWALL,
      waitFor: 'postStartCommand',
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...RUBY_EXTENSIONS],
          settings: { ...BASE_SETTINGS, ...RUBY_SETTINGS },
        },
      },
    },
  },
  {
    dir: `${TEMPLATES_DIR}/rails-api`,
    config: {
      name: 'template-rails-api',
      dockerComposeFile: './docker-compose.yml',
      service: 'web',
      workspaceFolder: '/workspace',
      workspaceMount: WORKSPACE_MOUNT,
      remoteUser: 'node',
      mounts: CLAUDE_BASE_MOUNTS,
      runArgs: RUN_ARGS_FIREWALL,
      containerEnv: CONTAINER_ENV_FIREWALL,
      postStartCommand: POST_START_FIREWALL,
      waitFor: 'postStartCommand',
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...RUBY_EXTENSIONS],
          settings: { ...BASE_SETTINGS, ...RUBY_SETTINGS },
        },
      },
    },
  },
  {
    dir: `${TEMPLATES_DIR}/rails`,
    config: {
      name: 'template-rails',
      dockerComposeFile: './docker-compose.yml',
      service: 'web',
      workspaceFolder: '/workspace',
      workspaceMount: WORKSPACE_MOUNT,
      remoteUser: 'node',
      mounts: CLAUDE_BASE_MOUNTS,
      runArgs: RUN_ARGS_FIREWALL,
      containerEnv: CONTAINER_ENV_FIREWALL,
      postStartCommand: POST_START_FIREWALL,
      waitFor: 'postStartCommand',
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
            'eslint.validate': ['javascript'],
          },
        },
      },
    },
  },
  {
    dir: `${TEMPLATES_DIR}/csharp`,
    config: {
      name: 'template-csharp',
      build: {
        dockerfile: 'Dockerfile',
        context: '..',
        args: BUILD_ARGS_DEVCONTAINER,
      },
      workspaceFolder: '/workspace',
      workspaceMount: WORKSPACE_MOUNT,
      remoteUser: 'node',
      mounts: CLAUDE_BASE_MOUNTS,
      runArgs: RUN_ARGS_FIREWALL,
      containerEnv: CONTAINER_ENV_FIREWALL,
      postStartCommand: POST_START_FIREWALL,
      waitFor: 'postStartCommand',
      forwardPorts: [3005],
      portsAttributes: {
        '3005': { label: 'ASP.NET Core', onAutoForward: 'openPreview' },
      },
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...CSHARP_EXTENSIONS],
          settings: { ...BASE_SETTINGS },
        },
      },
    },
  },
  {
    dir: `${TEMPLATES_DIR}/go`,
    config: {
      name: 'template-go',
      build: {
        dockerfile: 'Dockerfile',
        context: '..',
        args: BUILD_ARGS_DEVCONTAINER,
      },
      workspaceFolder: '/workspace',
      workspaceMount: WORKSPACE_MOUNT,
      remoteUser: 'node',
      mounts: CLAUDE_BASE_MOUNTS,
      runArgs: RUN_ARGS_FIREWALL,
      containerEnv: CONTAINER_ENV_FIREWALL,
      postStartCommand: POST_START_FIREWALL,
      waitFor: 'postStartCommand',
      forwardPorts: [3008],
      portsAttributes: {
        '3008': { label: 'Go (Gin)', onAutoForward: 'openPreview' },
      },
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...GO_EXTENSIONS],
          settings: { ...BASE_SETTINGS },
        },
      },
    },
  },
  {
    dir: `${TEMPLATES_DIR}/rust`,
    config: {
      name: 'template-rust',
      build: {
        dockerfile: 'Dockerfile',
        context: '..',
        args: BUILD_ARGS_DEVCONTAINER,
      },
      workspaceFolder: '/workspace',
      workspaceMount: WORKSPACE_MOUNT,
      remoteUser: 'node',
      mounts: CLAUDE_BASE_MOUNTS,
      runArgs: RUN_ARGS_FIREWALL,
      containerEnv: CONTAINER_ENV_FIREWALL,
      postStartCommand: POST_START_FIREWALL,
      waitFor: 'postStartCommand',
      customizations: {
        vscode: {
          extensions: [...BASE_EXTENSIONS, ...RUST_EXTENSIONS],
          settings: { ...BASE_SETTINGS },
        },
      },
    },
  },
  {
    dir: `${TEMPLATES_DIR}/laravel`,
    config: {
      name: 'template-laravel',
      build: {
        dockerfile: 'Dockerfile',
        context: '..',
        args: BUILD_ARGS_DEVCONTAINER,
      },
      workspaceFolder: '/workspace',
      workspaceMount: WORKSPACE_MOUNT,
      remoteUser: 'node',
      mounts: CLAUDE_BASE_MOUNTS,
      runArgs: RUN_ARGS_FIREWALL,
      containerEnv: CONTAINER_ENV_FIREWALL,
      postStartCommand: POST_START_FIREWALL,
      waitFor: 'postStartCommand',
      forwardPorts: [3009],
      portsAttributes: {
        '3009': { label: 'Laravel', onAutoForward: 'openPreview' },
      },
      customizations: {
        vscode: {
          extensions: [
            ...BASE_EXTENSIONS,
            ...PHP_EXTENSIONS,
            ...TOOLING_EXTENSIONS,
          ],
          settings: { ...BASE_SETTINGS },
        },
      },
    },
  },
  {
    dir: `${TEMPLATES_DIR}/django`,
    config: {
      name: 'template-django',
      build: {
        dockerfile: 'Dockerfile',
        context: '..',
        args: BUILD_ARGS_DEVCONTAINER,
      },
      workspaceFolder: '/workspace',
      workspaceMount: WORKSPACE_MOUNT,
      remoteUser: 'node',
      mounts: CLAUDE_BASE_MOUNTS,
      runArgs: RUN_ARGS_FIREWALL,
      containerEnv: CONTAINER_ENV_FIREWALL,
      postStartCommand: POST_START_FIREWALL,
      waitFor: 'postStartCommand',
      forwardPorts: [3006],
      portsAttributes: {
        '3006': { label: 'Django', onAutoForward: 'openPreview' },
      },
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

const RUBY_DB_COMPOSE_SRC = join(
  ROOT,
  'shared',
  'docker',
  'docker-compose.ruby-db.yml',
);
const RAILS_COMPOSE_SRC = join(
  ROOT,
  'shared',
  'docker',
  'docker-compose.rails.yml',
);
const INIT_FIREWALL_SRC = join(ROOT, 'shared', 'docker', 'init-firewall.sh');

// ── Generator ─────────────────────────────────────────────────────────────────

const JSON_HEADER: string =
  '// Generated by scripts/generate-devcontainer.ts — edit that file instead.\n';
const YAML_HEADER_RUBY_DB: string =
  '# Generated by scripts/generate-devcontainer.ts — edit shared/docker/docker-compose.ruby-db.yml instead.\n';
const YAML_HEADER_RAILS: string =
  '# Generated by scripts/generate-devcontainer.ts — edit shared/docker/docker-compose.rails.yml instead.\n';

const DOCKERFILE_SRCS: Record<string, string> = {
  'Dockerfile.node': NODE_DOCKERFILE_SRC,
  'Dockerfile.ruby': RUBY_DOCKERFILE_SRC,
  'Dockerfile.ruby-monorepo': RUBY_MONOREPO_DOCKERFILE_SRC,
  'Dockerfile.dotnet': DOTNET_DOCKERFILE_SRC,
  'Dockerfile.go': GO_DOCKERFILE_SRC,
  'Dockerfile.rust': RUST_DOCKERFILE_SRC,
  'Dockerfile.php': PHP_DOCKERFILE_SRC,
  'Dockerfile.python': PYTHON_DOCKERFILE_SRC,
};

function dockerfileHeader(srcFile: string): string {
  return `# Generated by scripts/generate-devcontainer.ts — edit shared/docker/${srcFile} and re-run.\n\n`;
}

const FIREWALL_PLACEHOLDER = '__ALLOWED_FIREWALL_DOMAINS__';

/** Build the firewall domain block for init-firewall.sh based on a list of domains */
export function buildFirewallDomainBlock(domains: string[]): string {
  if (domains.length === 0) {
    return '';
  }
  if (domains.length === 1) {
    return `  "${domains[0]}"`;
  }
  return domains
    .map((d, i) =>
      i === 0
        ? `"${d}" \\`
        : i < domains.length - 1
          ? `  "${d}" \\`
          : `  "${d}"`,
    )
    .join('\n');
}

// Copy Dockerfiles and init-firewall.sh to each template (domain list is per-stack)
function writeInitFirewall(outDir: string, templateDir: string): void {
  const slug = templateDir.replace(/^(minimal|full)-templates\//, '');
  const domains = getFirewallDomainsForStack(slug);
  const domainBlock = buildFirewallDomainBlock(domains);

  const firewallOut = join(outDir, 'init-firewall.sh');
  let firewallContent = readFileSync(INIT_FIREWALL_SRC, 'utf8');
  if (!firewallContent.includes(FIREWALL_PLACEHOLDER)) {
    throw new Error(`init-firewall.sh missing placeholder ${FIREWALL_PLACEHOLDER}`);
  }
  firewallContent = firewallContent.replace(FIREWALL_PLACEHOLDER, domainBlock);

  const lines = firewallContent.split('\n');
  const withHeader = [
    lines[0],
    '# Generated by scripts/generate-devcontainer.ts — edit shared/docker/init-firewall.sh and scripts/lib/firewall-domains.ts, then re-run.',
    '',
    ...lines.slice(1),
  ].join('\n');
  writeFileSync(firewallOut, withHeader, 'utf8');
  logger.generated(firewallOut);
}

const FULL_DEVCONTAINER_DOCKERFILE_MAP: Record<string, string | null> =
  Object.fromEntries(
    STACK_DEFINITIONS.filter((s) => s.fullDir != null).map((s) => [
      s.fullDir!,
      s.devcontainerDockerfile,
    ]),
  );

export function run(): void {
  for (const [dir, dockerfileName] of Object.entries({
    ...DEVCONTAINER_DOCKERFILE_MAP,
    ...FULL_DEVCONTAINER_DOCKERFILE_MAP,
  })) {
    if (dockerfileName === null) continue;
    const outDir = join(ROOT, dir, '.devcontainer');
    mkdirSync(outDir, { recursive: true });
    const outPath = join(outDir, 'Dockerfile');
    const content = readFileSync(DOCKERFILE_SRCS[dockerfileName], 'utf8');
    writeFileSync(outPath, dockerfileHeader(dockerfileName) + content, 'utf8');
    logger.generated(outPath);
    writeInitFirewall(outDir, dir);
  }

  // Repository root: Ruby 3.3 + Node (monorepo maintenance / yarn dev / bundle in templates)
  const ROOT_DEVCONTAINER_DIR = join(ROOT, '.devcontainer');
  mkdirSync(ROOT_DEVCONTAINER_DIR, { recursive: true });
  const rootDockerfileOut = join(ROOT_DEVCONTAINER_DIR, 'Dockerfile');
  writeFileSync(
    rootDockerfileOut,
    dockerfileHeader('Dockerfile.ruby-monorepo') +
      readFileSync(RUBY_MONOREPO_DOCKERFILE_SRC, 'utf8'),
    'utf8',
  );
  logger.generated(rootDockerfileOut);
  writeInitFirewall(ROOT_DEVCONTAINER_DIR, 'monorepo');

  const DEVCONTAINER_FEATURES = DEFAULTS.features ?? {};
  const DEVCONTAINER_FEATURES_FULL_ONLY = DEFAULTS.featuresFullOnly ?? {};
  const isFullTemplate = (d: string) => d.startsWith('full-templates/');

  for (const { dir, config } of STACKS) {
    const outPath = join(ROOT, dir, '.devcontainer', 'devcontainer.json');
    const features =
      Object.keys(DEVCONTAINER_FEATURES).length > 0 ||
      Object.keys(DEVCONTAINER_FEATURES_FULL_ONLY).length > 0
        ? {
            ...DEVCONTAINER_FEATURES,
            ...(isFullTemplate(dir) ? DEVCONTAINER_FEATURES_FULL_ONLY : {}),
          }
        : undefined;
    const configWithCursor = {
      ...config,
      ...(features && Object.keys(features).length > 0 && { features }),
      customizations: {
        vscode: config.customizations.vscode,
        cursor: config.customizations.vscode,
      },
    };
    writeFileSync(
      outPath,
      JSON_HEADER + JSON.stringify(configWithCursor, null, 2) + '\n',
      'utf8',
    );
    logger.generated(outPath);
  }

  const rootDevcontainerConfig: DevcontainerConfig = {
    name: 'starter-templates',
    build: {
      dockerfile: 'Dockerfile',
      context: '..',
      args: BUILD_ARGS_DEVCONTAINER,
    },
    workspaceFolder: '/workspace',
    workspaceMount: WORKSPACE_MOUNT,
    remoteUser: 'node',
    mounts: NODE_MOUNTS,
    runArgs: NODE_RUN_ARGS,
    containerEnv: NODE_CONTAINER_ENV,
    postStartCommand: NODE_POST_START,
    waitFor: 'postStartCommand',
    postCreateCommand: 'yarn install',
    forwardPorts: [3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009],
    customizations: {
      vscode: {
        extensions: [
          ...BASE_EXTENSIONS,
          ...NODE_EXTENSIONS,
          ...RUBY_EXTENSIONS,
          ...ERB_EXTENSIONS,
          ...TOOLING_EXTENSIONS,
        ],
        settings: {
          ...BASE_SETTINGS,
          ...NODE_TERMINAL_SETTINGS,
          ...RUBY_SETTINGS,
          ...ERB_SETTINGS,
          'eslint.validate': ['javascript', 'typescript'],
        },
      },
    },
  };
  const rootFeatures =
    Object.keys(DEVCONTAINER_FEATURES).length > 0
      ? DEVCONTAINER_FEATURES
      : undefined;
  const rootDevcontainerPath = join(ROOT_DEVCONTAINER_DIR, 'devcontainer.json');
  const rootConfigWithCursor = {
    ...rootDevcontainerConfig,
    ...(rootFeatures && Object.keys(rootFeatures).length > 0 && { features: rootFeatures }),
    customizations: {
      vscode: rootDevcontainerConfig.customizations.vscode,
      cursor: rootDevcontainerConfig.customizations.vscode,
    },
  };
  writeFileSync(
    rootDevcontainerPath,
    JSON_HEADER + JSON.stringify(rootConfigWithCursor, null, 2) + '\n',
    'utf8',
  );
  logger.generated(rootDevcontainerPath);

  const rubyDbComposeContent = readFileSync(RUBY_DB_COMPOSE_SRC, 'utf8');
  for (const dir of [`${TEMPLATES_DIR}/sinatra`, `${TEMPLATES_DIR}/rails-api`]) {
    const outPath = join(ROOT, dir, '.devcontainer', 'docker-compose.yml');
    writeFileSync(outPath, YAML_HEADER_RUBY_DB + rubyDbComposeContent, 'utf8');
    logger.generated(outPath);
  }

  const railsComposeContent = readFileSync(RAILS_COMPOSE_SRC, 'utf8');
  const railsComposeOut = join(
    ROOT,
    `${TEMPLATES_DIR}/rails`,
    '.devcontainer',
    'docker-compose.yml',
  );
  writeFileSync(railsComposeOut, YAML_HEADER_RAILS + railsComposeContent, 'utf8');
  logger.generated(railsComposeOut);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
