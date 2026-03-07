/**
 * Error handling utilities for generation scripts.
 */

import { existsSync, statSync } from 'fs';

export class GenerationError extends Error {
  constructor(
    public readonly operation: string,
    public readonly context: string,
    message: string
  ) {
    super(`[${operation}] ${message}`);
    this.name = 'GenerationError';
  }
}

export function ensureFileExists(filePath: string, operation: string): void {
  if (!existsSync(filePath)) {
    throw new GenerationError(
      operation,
      filePath,
      `File not found: ${filePath}`
    );
  }
}

export function ensureDirectoryExists(dirPath: string, operation: string): void {
  if (!existsSync(dirPath)) {
    throw new GenerationError(
      operation,
      dirPath,
      `Directory not found: ${dirPath}`
    );
  }
}

export function ensureDirectoryIsDir(dirPath: string, operation: string): void {
  const stats = statSync(dirPath);
  if (!stats.isDirectory()) {
    throw new GenerationError(
      operation,
      dirPath,
      `Not a directory: ${dirPath}`
    );
  }
}
