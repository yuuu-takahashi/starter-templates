import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { join } from 'path';
import { deepMerge, ROOT, VERSIONS } from '../lib/utils.js';

describe('ROOT', () => {
  it('process.cwd() に一致する', () => {
    expect(ROOT).toBe(process.cwd());
  });

  it('shared/versions.json が ROOT 配下に存在する', () => {
    expect(existsSync(join(ROOT, 'shared', 'versions.json'))).toBe(true);
  });
});

describe('VERSIONS', () => {
  it('node と ruby を必ず持つ', () => {
    expect(VERSIONS).toHaveProperty('node');
    expect(VERSIONS).toHaveProperty('ruby');
    expect(typeof VERSIONS.node).toBe('string');
    expect(typeof VERSIONS.ruby).toBe('string');
  });

  it('node / ruby が空文字でない', () => {
    expect(VERSIONS.node.length).toBeGreaterThan(0);
    expect(VERSIONS.ruby.length).toBeGreaterThan(0);
  });
});

describe('deepMerge', () => {
  it('プリミティブ値を上書きする', () => {
    const a = { foo: 'old', bar: 1 };
    const b = { foo: 'new' };
    expect(deepMerge(a, b)).toEqual({ foo: 'new', bar: 1 });
  });

  it('ネストしたオブジェクトを再帰的にマージする', () => {
    const a = { rules: { 'no-console': 'warn', 'no-var': 'error' } };
    const b = { rules: { 'no-console': 'error' } };
    expect(deepMerge(a, b)).toEqual({
      rules: { 'no-console': 'error', 'no-var': 'error' },
    });
  });

  it('b のキーが null のときは上書きする', () => {
    const a = { foo: { bar: 1 } };
    const b = { foo: null } as Record<string, unknown>;
    expect(deepMerge(a, b)).toEqual({ foo: null });
  });

  it('配列はオブジェクトとして扱わず置換する', () => {
    const a = { list: [1, 2, 3] };
    const b = { list: [4, 5] };
    expect(deepMerge(a, b)).toEqual({ list: [4, 5] });
  });

  it('a に存在しないキーを b から追加する', () => {
    const a = { existing: true };
    const b = { newKey: 'hello' };
    expect(deepMerge(a, b)).toEqual({ existing: true, newKey: 'hello' });
  });

  it('元のオブジェクトを変更しない（immutability）', () => {
    const a = { nested: { x: 1 } };
    const b = { nested: { x: 2 } };
    deepMerge(a, b);
    expect(a.nested.x).toBe(1);
  });
});
