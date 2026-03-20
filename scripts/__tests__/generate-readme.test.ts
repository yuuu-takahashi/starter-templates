import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { ROOT } from '../lib/utils.js';
import { TEMPLATE_README_CONFIGS } from '../lib/template-readme-config.js';
import {
  buildStackSection,
  prepareTemplateContext,
} from '../generate-readme.js';

// ── 生成済み README ファイル ─────────────────────────────────────────────────

const README_ENTRIES = TEMPLATE_README_CONFIGS.map((c) => ({
  id: c.id,
  path: c.id.endsWith('-full')
    ? join(ROOT, 'full-templates', c.id.replace(/-full$/, ''), 'README.md')
    : join(ROOT, 'minimal-templates', c.id, 'README.md'),
  title: c.title ?? `template-${c.id}`,
}));

describe('gen-readme: 生成済み README ファイル存在確認', () => {
  it.each(README_ENTRIES)('$id/README.md が存在する', ({ path }) => {
    expect(existsSync(path)).toBe(true);
  });
});

describe('gen-readme: 生成済み README 内容確認', () => {
  it.each(README_ENTRIES)('$id/README.md がタイトルを含む', ({ path, title }) => {
    const content = readFileSync(path, 'utf8');
    expect(content).toContain(title);
  });

  it.each(README_ENTRIES)('$id/README.md が空でない', ({ path }) => {
    const content = readFileSync(path, 'utf8');
    expect(content.trim().length).toBeGreaterThan(0);
  });
});

// ── buildStackSection ────────────────────────────────────────────────────────

const DEFAULTS_PATH = join(ROOT, 'shared', 'devcontainer', 'defaults.json');
const devcontainerDefaults = JSON.parse(
  readFileSync(DEFAULTS_PATH, 'utf8'),
) as { extensions: Record<string, string[]> };

describe('buildStackSection', () => {
  it('npmStack 指定時は npm パッケージセクションを含む', () => {
    const result = buildStackSection(
      {
        id: 'nextjs',
        title: 'template-nextjs',
        description: '',
        repoSlug: '',
        npmStack: 'nextjs',
        setupSteps: [],
        devGuide: [],
      },
      devcontainerDefaults,
    );
    expect(result).toContain('npm パッケージ');
  });

  it('gemfileStack 指定時は Gem セクションを含む', () => {
    const result = buildStackSection(
      {
        id: 'rails',
        title: 'template-rails',
        description: '',
        repoSlug: '',
        gemfileStack: 'rails',
        setupSteps: [],
        devGuide: [],
      },
      devcontainerDefaults,
    );
    expect(result).toContain('主な Gem');
  });

  it('extensionSets 指定時は拡張機能セクションを含む', () => {
    const result = buildStackSection(
      {
        id: 'nodejs',
        title: 'template-nodejs',
        description: '',
        repoSlug: '',
        extensionSets: ['base'],
        setupSteps: [],
        devGuide: [],
      },
      devcontainerDefaults,
    );
    expect(result).toContain('拡張機能');
  });

  it('何も指定しない場合は undefined を返す', () => {
    const result = buildStackSection(
      {
        id: 'empty',
        title: 'empty',
        description: '',
        repoSlug: '',
        setupSteps: [],
        devGuide: [],
      },
      devcontainerDefaults,
    );
    expect(result).toBeUndefined();
  });

  it('stackLibs 指定時はライブラリセクションを含む', () => {
    const result = buildStackSection(
      {
        id: 'custom',
        title: 'custom',
        description: '',
        repoSlug: '',
        stackLibs: ['- Gin — Web framework'],
        setupSteps: [],
        devGuide: [],
      },
      devcontainerDefaults,
    );
    expect(result).toContain('主なライブラリ');
    expect(result).toContain('Gin');
  });

  it('存在しない npmStack を指定した場合はスキップして undefined を返す', () => {
    const result = buildStackSection(
      {
        id: 'nonexistent',
        title: 'nonexistent',
        description: '',
        repoSlug: '',
        npmStack: 'nonexistent-stack-xyz',
        setupSteps: [],
        devGuide: [],
      },
      devcontainerDefaults,
    );
    expect(result).toBeUndefined();
  });
});

// ── prepareTemplateContext ───────────────────────────────────────────────────

describe('prepareTemplateContext', () => {
  it('title / description / id をそのまま返す', () => {
    const config = {
      id: 'nextjs',
      title: 'template-nextjs',
      description: 'Next.js テンプレート',
      repoSlug: 'template-nextjs',
      setupSteps: [],
      devGuide: [],
    };
    const ctx = prepareTemplateContext(config, undefined);
    expect(ctx.title).toBe('template-nextjs');
    expect(ctx.description).toBe('Next.js テンプレート');
    expect(ctx.id).toBe('nextjs');
  });

  it('setupSteps が番号付きで展開される', () => {
    const config = {
      id: 'nextjs',
      title: 'template-nextjs',
      description: '',
      repoSlug: '',
      setupSteps: [
        { label: 'パッケージをインストール', commands: ['yarn'] },
        { label: '開発サーバー起動', commands: ['yarn dev'] },
      ],
      devGuide: [],
    };
    const ctx = prepareTemplateContext(config, undefined);
    const steps = ctx.setupSteps as Array<{ num: number; label: string }>;
    expect(steps[0].num).toBe(1);
    expect(steps[1].num).toBe(2);
    expect(steps[0].label).toBe('パッケージをインストール');
  });

  it('stackSection が undefined のとき空文字列になる', () => {
    const config = {
      id: 'nodejs',
      title: 'template-nodejs',
      description: '',
      repoSlug: '',
      setupSteps: [],
      devGuide: [],
    };
    const ctx = prepareTemplateContext(config, undefined);
    expect(ctx.stackSection).toBe('');
  });

  it('stackSection が渡されたときそのまま返す', () => {
    const config = {
      id: 'nodejs',
      title: 'template-nodejs',
      description: '',
      repoSlug: '',
      setupSteps: [],
      devGuide: [],
    };
    const ctx = prepareTemplateContext(config, '### npm packages\n');
    expect(ctx.stackSection).toBe('### npm packages\n');
  });

  it('previewUrl が指定されたとき previewLine に URL が含まれる', () => {
    const config = {
      id: 'nextjs',
      title: 'template-nextjs',
      description: '',
      repoSlug: '',
      setupSteps: [],
      devGuide: [],
      previewUrl: 'http://localhost:3000',
    };
    const ctx = prepareTemplateContext(config, undefined);
    expect(ctx.previewLine).toContain('http://localhost:3000');
  });

  it('previewUrl がない場合 previewLine は空文字列', () => {
    const config = {
      id: 'ruby',
      title: 'template-ruby',
      description: '',
      repoSlug: '',
      setupSteps: [],
      devGuide: [],
    };
    const ctx = prepareTemplateContext(config, undefined);
    expect(ctx.previewLine).toBe('');
  });

  it('devGuide が空のとき hasDevGuide が false', () => {
    const config = {
      id: 'ruby',
      title: 'template-ruby',
      description: '',
      repoSlug: '',
      setupSteps: [],
      devGuide: [],
    };
    const ctx = prepareTemplateContext(config, undefined);
    expect(ctx.hasDevGuide).toBe(false);
  });

  it('devGuide があるとき hasDevGuide が true', () => {
    const config = {
      id: 'nextjs',
      title: 'template-nextjs',
      description: '',
      repoSlug: '',
      setupSteps: [],
      devGuide: [{ title: 'テスト', commands: ['yarn test'] }],
    };
    const ctx = prepareTemplateContext(config, undefined);
    expect(ctx.hasDevGuide).toBe(true);
  });
});
