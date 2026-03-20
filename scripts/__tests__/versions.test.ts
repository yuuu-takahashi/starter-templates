import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ROOT } from '../lib/utils.js';

const VERSIONS_PATH = join(ROOT, 'shared', 'versions.json');

describe('shared/versions.json', () => {
  let versions: Record<string, string>;

  beforeAll(() => {
    const raw = readFileSync(VERSIONS_PATH, 'utf8');
    versions = JSON.parse(raw) as Record<string, string>;
  });

  it('存在し、有効な JSON である', () => {
    expect(versions).toBeDefined();
    expect(typeof versions).toBe('object');
    expect(Array.isArray(versions)).toBe(false);
  });

  it('必須キー node, ruby を持つ', () => {
    expect(versions).toHaveProperty('node');
    expect(versions).toHaveProperty('ruby');
  });

  it('全キーの値が非空文字列である', () => {
    for (const [key, value] of Object.entries(versions)) {
      expect(typeof value, `${key} が文字列でない`).toBe('string');
      expect(value.length, `${key} が空`).toBeGreaterThan(0);
    }
  });

  it('node がセマンティックなバージョン形式（数字または数字.x）である', () => {
    expect(versions.node).toMatch(/^\d+(\.\d+)?(\.\d+)?$/);
  });

  it('テンプレート用ランタイムは node, ruby のみである', () => {
    expect(Object.keys(versions).sort()).toEqual(['node', 'ruby']);
  });
});
