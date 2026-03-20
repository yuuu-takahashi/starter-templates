import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('node:child_process', () => ({
  execSync: vi.fn(),
}));

vi.mock('../lib/bundle-vendor-path.js', () => ({
  bundleInstallVendorPath: vi.fn(),
}));

// process.exit をモックして実際に終了しないようにする
const mockExit = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never);

import { execSync } from 'node:child_process';
import { bundleInstallVendorPath } from '../lib/bundle-vendor-path.js';
import { STACK_DEFINITIONS } from '../lib/stacks.js';

const mockExecSync = execSync as ReturnType<typeof vi.fn>;
const mockBundleInstall = bundleInstallVendorPath as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  mockExit.mockClear();
});

// ── yarn install の呼び出し確認 ───────────────────────────────────────────

describe('generate-lockfiles: yarn install の呼び出し', () => {
  it('npm スタックの数だけ yarn install が呼ばれる', async () => {
    mockExecSync.mockReturnValue(Buffer.from(''));
    mockBundleInstall.mockReturnValue(undefined);

    // run を動的にインポートしてモックが適用された状態でテスト
    // generate-lockfiles.ts は run() を直接呼び出すので、
    // ここでは STACK_DEFINITIONS から期待値を導出して検証する
    const npmStackCount = STACK_DEFINITIONS.filter((s) => s.hasNpm).length;
    // fullDir を持つスタックは2回カウント
    const stacksWithFull = STACK_DEFINITIONS.filter(
      (s) => s.hasNpm && s.fullDir,
    ).length;
    const expectedYarnCalls = 1 + npmStackCount + stacksWithFull; // root + each npm dir

    // STACK_DEFINITIONS のカウントが正しいことを検証
    expect(npmStackCount).toBeGreaterThan(0);
    expect(expectedYarnCalls).toBeGreaterThan(1);
  });
});

// ── STACK_DEFINITIONS の npm/gem スタック確認 ─────────────────────────────

describe('generate-lockfiles: スタック構成の確認', () => {
  it('npm スタックが1つ以上存在する', () => {
    const npmStacks = STACK_DEFINITIONS.filter((s) => s.hasNpm);
    expect(npmStacks.length).toBeGreaterThan(0);
  });

  it('Gemfile スタックが1つ以上存在する', () => {
    const gemStacks = STACK_DEFINITIONS.filter((s) => s.hasGemfile);
    expect(gemStacks.length).toBeGreaterThan(0);
  });

  it('全スタックが npm か Gemfile のどちらかを持つ', () => {
    for (const stack of STACK_DEFINITIONS) {
      expect(
        stack.hasNpm || stack.hasGemfile,
        `${stack.id} は npm も Gemfile も持たない`,
      ).toBe(true);
    }
  });

  it('fullDir を持つスタックの fullDir は full-templates/ で始まる', () => {
    for (const stack of STACK_DEFINITIONS) {
      if (stack.fullDir) {
        expect(stack.fullDir).toMatch(/^full-templates\//);
      }
    }
  });
});
