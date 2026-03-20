/**
 * Error handling utilities for generation scripts.
 */

import { existsSync, statSync } from 'fs';

export class GenerationError extends Error {
  constructor(
    public readonly operation: string,
    public readonly context: string,
    message: string,
  ) {
    super(`[${operation}] ${message}`);
    this.name = 'GenerationError';
  }
}

export const ensureFileExists = (filePath: string, operation: string): void => {
  if (!existsSync(filePath)) {
    throw new GenerationError(
      operation,
      filePath,
      `File not found: ${filePath}`,
    );
  }
};

export const ensureDirectoryExists = (
  dirPath: string,
  operation: string,
): void => {
  if (!existsSync(dirPath)) {
    throw new GenerationError(
      operation,
      dirPath,
      `Directory not found: ${dirPath}`,
    );
  }
};

export const ensureDirectoryIsDir = (
  dirPath: string,
  operation: string,
): void => {
  const stats = statSync(dirPath);
  if (!stats.isDirectory()) {
    throw new GenerationError(
      operation,
      dirPath,
      `Not a directory: ${dirPath}`,
    );
  }
};

export function handleGenerationError(error: unknown): never {
  if (error instanceof GenerationError) {
    console.error(`\n❌ ${error.message}`);
    console.error(`   Context: ${error.context}`);
  } else if (error instanceof Error) {
    console.error(`\n❌ Unexpected error: ${error.message}`);
    console.error(error.stack);
  } else {
    console.error('\n❌ Unknown error occurred');
  }
  process.exit(1);
}
