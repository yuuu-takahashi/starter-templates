import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { ROOT } from '../lib/utils.js';
import { DEVCONTAINER_DOCKERFILE_MAP, TEMPLATE_DIRS } from '../lib/stacks.js';
import { buildFirewallDomainBlock } from '../generate-devcontainer.js';

const DEFAULTS_PATH = join(ROOT, 'shared', 'devcontainer', 'defaults.json');
const INIT_FIREWALL_PATH = join(ROOT, 'shared', 'docker', 'init-firewall.sh');

describe('generate-devcontainer が参照する共有ファイル', () => {
  it('shared/devcontainer/defaults.json が存在する', () => {
    expect(existsSync(DEFAULTS_PATH)).toBe(true);
  });

  it('defaults.json が extensions.base / extensions.node / settings.base を持つ', () => {
    const defaults = JSON.parse(readFileSync(DEFAULTS_PATH, 'utf8')) as Record<
      string,
      unknown
    >;
    expect(defaults.extensions).toBeDefined();
    const ext = defaults.extensions as Record<string, unknown>;
    expect(Array.isArray(ext.base)).toBe(true);
    expect(Array.isArray(ext.node)).toBe(true);
    expect(defaults.settings).toBeDefined();
    const settings = defaults.settings as Record<string, unknown>;
    expect(settings.base).toBeDefined();
  });

  it('shared/docker/init-firewall.sh が存在する', () => {
    expect(existsSync(INIT_FIREWALL_PATH)).toBe(true);
  });

  it('init-firewall.sh が shebang で始まる', () => {
    const content = readFileSync(INIT_FIREWALL_PATH, 'utf8');
    expect(content.startsWith('#!/bin/bash')).toBe(true);
  });

  it('init-firewall.sh にドメインリスト用プレースホルダーが含まれる', () => {
    const content = readFileSync(INIT_FIREWALL_PATH, 'utf8');
    expect(content).toContain('__ALLOWED_FIREWALL_DOMAINS__');
  });
});

describe('DEVCONTAINER_DOCKERFILE_MAP とテンプレート整合性', () => {
  it('全 TEMPLATE_DIRS が DEVCONTAINER_DOCKERFILE_MAP に含まれる', () => {
    for (const dir of TEMPLATE_DIRS) {
      expect(DEVCONTAINER_DOCKERFILE_MAP).toHaveProperty(dir);
    }
  });

  it('Dockerfile を参照するテンプレートは .devcontainer に init-firewall をコピーする前提で参照先が存在する', () => {
    for (const [, dockerfileName] of Object.entries(
      DEVCONTAINER_DOCKERFILE_MAP,
    )) {
      if (dockerfileName === null) continue;
      const dockerfilePath = join(ROOT, 'shared', 'docker', dockerfileName);
      const content = readFileSync(dockerfilePath, 'utf8');
      if (content.includes('init-firewall.sh')) {
        expect(
          existsSync(INIT_FIREWALL_PATH),
          'init-firewall.sh が Dockerfile で参照されるが存在しない',
        ).toBe(true);
      }
    }
  });
});

describe('buildFirewallDomainBlock', () => {
  it('ドメイン1件の場合は適切な形式で返す', () => {
    const result = buildFirewallDomainBlock(['example.com']);
    expect(result).toBe('  "example.com"');
  });

  it('ドメイン2件以上の場合、1行目にバックスラッシュが付く', () => {
    const result = buildFirewallDomainBlock(['example.com', 'another.com']);
    expect(result).toContain('"example.com" \\');
  });

  it('複数ドメインの場合、最終行にバックスラッシュがない', () => {
    const result = buildFirewallDomainBlock(['example.com', 'another.com']);
    const lines = result.split('\n');
    expect(lines[lines.length - 1]).not.toContain('\\');
  });

  it('空配列の場合は空文字列を返す', () => {
    const result = buildFirewallDomainBlock([]);
    expect(result).toBe('');
  });
});
