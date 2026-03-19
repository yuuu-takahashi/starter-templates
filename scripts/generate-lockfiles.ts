#!/usr/bin/env tsx
/**
 * Automatically updates lockfiles (yarn.lock, Gemfile.lock) for all templates.
 * Runs after yarn generate:deps to ensure dependencies are installed.
 *
 * Run: yarn generate:lockfiles
 */

import { execSync } from 'node:child_process';
import { join } from 'path';
import { STACK_DEFINITIONS } from './lib/stacks.js';
import { ROOT } from './lib/utils.js';
import { logger } from './lib/logger.js';

const run = (): void => {
  logger.info('🔄 Starting lockfile generation...\n');

  let successCount = 0;
  let failureCount = 0;

  for (const stack of STACK_DEFINITIONS) {
    const dirs: string[] = [join(ROOT, stack.dir)];
    if (stack.fullDir) {
      dirs.push(join(ROOT, stack.fullDir));
    }

    for (const dir of dirs) {
      // yarn install for npm templates
      if (stack.hasNpm) {
        try {
          logger.info(`📦 Installing npm dependencies: ${dir}`);
          execSync('yarn install', { cwd: dir, stdio: 'inherit' });
          logger.success(`  yarn.lock updated: ${dir}`);
          successCount++;
        } catch (error) {
          logger.warn(`Failed to install npm dependencies in ${dir}`);
          if (error instanceof Error) {
            logger.error(`  Error: ${error.message}`);
          }
          failureCount++;
        }
      }
    }
  }

  logger.info(`\n✓ Lockfile generation completed`);
  logger.info(`  Succeeded: ${successCount}`);
  if (failureCount > 0) {
    logger.info(`  Failed: ${failureCount}`);
  }

  if (failureCount > 0) {
    process.exit(1);
  }
};

run();
