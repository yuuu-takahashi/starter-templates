import { describe, it, expect } from 'vitest';
import { example } from './example.js';

describe('example', () => {
  it('runs without error', () => {
    expect(() => example()).not.toThrow();
  });
});
