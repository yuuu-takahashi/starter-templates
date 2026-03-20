import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();
  return {
    ...actual,
    existsSync: vi.fn(),
    unlinkSync: vi.fn(),
  };
});

vi.mock('../lib/bundle-vendor-path.js', () => ({
  bundleInstallVendorPath: vi.fn(),
}));

import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { bundleInstallVendorPath } from '../lib/bundle-vendor-path.js';
import { setupRubyDeps } from '../setup-templates.js';
import type { StackDefinition } from '../lib/stacks.js';

const mockExistsSync = existsSync as ReturnType<typeof vi.fn>;
const mockExecSync = execSync as ReturnType<typeof vi.fn>;
const mockBundleInstall = bundleInstallVendorPath as ReturnType<typeof vi.fn>;

const baseStack: StackDefinition = {
  dir: 'minimal-templates/rails',
  id: 'rails',
  runtime: 'ruby',
  codeCheckWorkflow: 'code-check-ruby-erb.yml',
  testWorkflow: 'test-rails.yml',
  gitignore: '.gitignore.rails',
  devcontainerDockerfile: 'Dockerfile.ruby',
  hasNpm: true,
  hasGemfile: true,
  monorepoPrefix: false,
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ── setupRubyDeps ─────────────────────────────────────────────────────────

describe('setupRubyDeps', () => {
  it('Gemfile が存在しない場合は何もしない', () => {
    mockExistsSync.mockReturnValue(false);
    setupRubyDeps(baseStack, '/tmp/rails');
    expect(mockBundleInstall).not.toHaveBeenCalled();
  });

  it('bundler がインストールされていない場合は bundle install をスキップする', () => {
    mockExistsSync.mockReturnValue(true);
    mockExecSync.mockImplementationOnce(() => {
      throw new Error('command not found: bundle');
    });
    setupRubyDeps(baseStack, '/tmp/rails');
    expect(mockBundleInstall).not.toHaveBeenCalled();
  });

  it('Gemfile が存在し bundler がある場合は bundleInstallVendorPath を呼ぶ', () => {
    mockExistsSync.mockReturnValue(true);
    mockExecSync.mockReturnValue(Buffer.from('Bundler version 2.x'));
    setupRubyDeps(baseStack, '/tmp/rails');
    expect(mockBundleInstall).toHaveBeenCalledWith('/tmp/rails');
  });

  it('Rails テンプレートでは db:migrate を実行する', () => {
    mockExistsSync.mockReturnValue(true);
    mockExecSync.mockReturnValue(Buffer.from('Bundler version 2.x'));
    setupRubyDeps(baseStack, '/tmp/rails');
    expect(mockExecSync).toHaveBeenCalledWith(
      'bundle exec rails db:migrate',
      expect.objectContaining({ cwd: '/tmp/rails' }),
    );
  });

  it('non-Rails テンプレートでは db:migrate を実行しない', () => {
    const rubyStack: StackDefinition = {
      ...baseStack,
      dir: 'minimal-templates/ruby',
      id: 'ruby',
    };
    mockExistsSync.mockReturnValue(true);
    mockExecSync.mockReturnValue(Buffer.from('Bundler version 2.x'));
    setupRubyDeps(rubyStack, '/tmp/ruby');
    const migrateCalls = mockExecSync.mock.calls.filter(
      (args: unknown[]) => typeof args[0] === 'string' && args[0].includes('db:migrate'),
    );
    expect(migrateCalls).toHaveLength(0);
  });
});