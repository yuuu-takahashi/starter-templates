import { formatDate, formatDateTime } from '@/utils/formatDate';
import { describe, expect, it } from 'vitest';

describe('formatDate関数', () => {
  it('日付が正しくフォーマットされる', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('2024-01-15');
  });

  it('月と日が1桁の場合、0埋めされる', () => {
    const date = new Date('2024-03-05');
    expect(formatDate(date)).toBe('2024-03-05');
  });

  it('年末の日付が正しくフォーマットされる', () => {
    const date = new Date('2024-12-31');
    expect(formatDate(date)).toBe('2024-12-31');
  });
});

describe('formatDateTime関数', () => {
  it('日時が正しくフォーマットされる', () => {
    const date = new Date('2024-01-15T14:30:45');
    expect(formatDateTime(date)).toBe('2024-01-15 14:30:45');
  });

  it('時間が1桁の場合、0埋めされる', () => {
    const date = new Date('2024-01-15T09:05:02');
    expect(formatDateTime(date)).toBe('2024-01-15 09:05:02');
  });

  it('深夜の時間が正しくフォーマットされる', () => {
    const date = new Date('2024-01-15T00:00:00');
    expect(formatDateTime(date)).toBe('2024-01-15 00:00:00');
  });
});
