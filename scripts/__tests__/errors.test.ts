import { describe, it, expect } from 'vitest';
import { join } from 'path';
import {
  GenerationError,
  ensureFileExists,
  ensureDirectoryExists,
  ensureDirectoryIsDir,
} from '../lib/errors.js';

describe('GenerationError', () => {
  it('正しいメッセージ形式でエラーを生成する', () => {
    const error = new GenerationError('eslint', '/path/to/file', 'File not found');
    expect(error.message).toBe('[eslint] File not found');
    expect(error.operation).toBe('eslint');
    expect(error.context).toBe('/path/to/file');
  });

  it('Error のインスタンスである', () => {
    const error = new GenerationError('test', '/path', 'Test error');
    expect(error instanceof Error).toBe(true);
  });

  it('name プロパティが GenerationError である', () => {
    const error = new GenerationError('test', '/path', 'Test error');
    expect(error.name).toBe('GenerationError');
  });
});

describe('ensureFileExists', () => {
  it('存在するファイルではエラーを投げない', () => {
    const filePath = join(process.cwd(), 'package.json');
    expect(() => ensureFileExists(filePath, 'test')).not.toThrow();
  });

  it('存在しないファイルで GenerationError を投げる', () => {
    const filePath = '/nonexistent/path/to/file.txt';
    expect(() => ensureFileExists(filePath, 'test')).toThrow(GenerationError);
  });

  it('エラーに正しいコンテキストが含まれる', () => {
    const filePath = '/nonexistent/file.txt';
    expect(() => ensureFileExists(filePath, 'myop')).toThrow(GenerationError);
  });
});

describe('ensureDirectoryExists', () => {
  it('存在するディレクトリではエラーを投げない', () => {
    const dirPath = process.cwd();
    expect(() => ensureDirectoryExists(dirPath, 'test')).not.toThrow();
  });

  it('存在しないディレクトリで GenerationError を投げる', () => {
    const dirPath = '/nonexistent/directory/path';
    expect(() => ensureDirectoryExists(dirPath, 'test')).toThrow(GenerationError);
  });

  it('エラーメッセージに "Directory not found" が含まれる', () => {
    const dirPath = '/nonexistent/dir';
    expect(() => ensureDirectoryExists(dirPath, 'test')).toThrow(GenerationError);
  });
});

describe('ensureDirectoryIsDir', () => {
  it('ディレクトリではエラーを投げない', () => {
    const dirPath = process.cwd();
    expect(() => ensureDirectoryIsDir(dirPath, 'test')).not.toThrow();
  });

  it('ファイルで GenerationError を投げる', () => {
    const filePath = join(process.cwd(), 'package.json');
    expect(() => ensureDirectoryIsDir(filePath, 'test')).toThrow(GenerationError);
  });

  it('エラーメッセージに "Not a directory" が含まれる', () => {
    const filePath = join(process.cwd(), 'package.json');
    expect(() => ensureDirectoryIsDir(filePath, 'test')).toThrow(GenerationError);
  });
});
