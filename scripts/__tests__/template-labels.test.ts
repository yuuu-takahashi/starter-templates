import { describe, it, expect } from 'vitest';
import { TEMPLATE_LABELS } from '../lib/template-labels.js';
import {
  NPM_DESCRIPTIONS,
  GEM_DESCRIPTIONS,
  EXTENSION_DESCRIPTIONS,
} from '../lib/readme-descriptions.js';
import { STACK_DEFINITIONS } from '../lib/stacks.js';

describe('template-labels', () => {
  describe('TEMPLATE_LABELS 整合性', () => {
    it('全キーが STACK_DEFINITIONS に含まれる', () => {
      const stackIds = new Set(
        STACK_DEFINITIONS.map((s) => s.id).concat(
          STACK_DEFINITIONS.filter((s) => s.fullDir != null).map(
            (s) => `${s.id}_full`
          )
        )
      );
      for (const key of Object.keys(TEMPLATE_LABELS)) {
        expect(stackIds.has(key)).toBe(true);
      }
    });

    it('全値が非空文字列', () => {
      for (const value of Object.values(TEMPLATE_LABELS)) {
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      }
    });
  });

  describe('説明ファイルのインポート', () => {
    it('NPM_DESCRIPTIONS は Record<string, string> 形式', () => {
      expect(typeof NPM_DESCRIPTIONS).toBe('object');
      expect(NPM_DESCRIPTIONS).not.toBe(null);
    });

    it('GEM_DESCRIPTIONS は Record<string, string> 形式', () => {
      expect(typeof GEM_DESCRIPTIONS).toBe('object');
      expect(GEM_DESCRIPTIONS).not.toBe(null);
    });

    it('EXTENSION_DESCRIPTIONS は Record<string, string> 形式', () => {
      expect(typeof EXTENSION_DESCRIPTIONS).toBe('object');
      expect(EXTENSION_DESCRIPTIONS).not.toBe(null);
    });

    it('NPM_DESCRIPTIONS の全値が文字列', () => {
      for (const value of Object.values(NPM_DESCRIPTIONS)) {
        expect(typeof value).toBe('string');
      }
    });

    it('GEM_DESCRIPTIONS の全値が文字列', () => {
      for (const value of Object.values(GEM_DESCRIPTIONS)) {
        expect(typeof value).toBe('string');
      }
    });

    it('EXTENSION_DESCRIPTIONS の全値が文字列', () => {
      for (const value of Object.values(EXTENSION_DESCRIPTIONS)) {
        expect(typeof value).toBe('string');
      }
    });
  });
});
