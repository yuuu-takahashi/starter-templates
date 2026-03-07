import { sum } from '@/utils/sum';
import { describe, expect, it } from 'vitest';

describe('sum関数', () => {
  it('1 + 2 が 3 になることを確認', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('負の数の足し算が正しく動作する', () => {
    expect(sum(-1, -2)).toBe(-3);
  });

  it('0を含む足し算が正しく動作する', () => {
    expect(sum(0, 5)).toBe(5);
    expect(sum(5, 0)).toBe(5);
  });
});
