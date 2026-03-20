/**
 * Setup script to initialize templates after generation.
 * - bundle install (vendor/bundle via local config) + rails db:migrate for Ruby/Rails templates
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { bundleInstallVendorPath } from './lib/bundle-vendor-path.js';
import { STACK_DEFINITIONS, type StackDefinition } from './lib/stacks.js';
import { ROOT } from './lib/utils.js';
import { logger } from './lib/logger.js';

export function setupRubyDeps(
  stack: StackDefinition,
  templatePath: string,
): void {
  const gemfilePath = join(templatePath, 'Gemfile');
  if (!existsSync(gemfilePath)) return;

  let hasBundler = false;
  try {
    execSync('bundle --version', { stdio: 'pipe' });
    hasBundler = true;
  } catch {
    logger.info(`⏭️  Skipping bundle install (bundler not installed)`);
  }

  if (!hasBundler) return;

  logger.info(
    `   → bundle config set --local path vendor/bundle && bundle install`,
  );
  bundleInstallVendorPath(templatePath);

  if (stack.dir.includes('rails')) {
    logger.info(`   → bundle exec rails db:migrate`);
    try {
      execSync('bundle exec rails db:migrate', {
        cwd: templatePath,
        stdio: 'inherit',
      });
    } catch {
      logger.warn(
        `⏭️  db:migrate failed (may be due to native extensions in this environment). Continuing setup...`,
      );
    }
  }
}


export async function setupTemplates(): Promise<void> {
  logger.info('🚀 Setting up templates...\n');

  for (const stack of STACK_DEFINITIONS) {
    const templatePath = join(ROOT, stack.dir);

    if (!existsSync(templatePath)) {
      logger.warn(`${stack.dir} does not exist, skipping`);
      continue;
    }

    logger.info(`📦 Setting up ${stack.dir}...`);

    try {
      if (stack.hasGemfile) {
        setupRubyDeps(stack, templatePath);
      }

      logger.success(`${stack.dir} setup complete\n`);
    } catch (error) {
      logger.error(
        `Error setting up ${stack.dir}`,
        error instanceof Error ? error : new Error(String(error)),
      );
      process.exit(1);
    }

    // Setup full-templates variant if it exists
    if (stack.fullDir) {
      const fullTemplatePath = join(ROOT, stack.fullDir);

      if (!existsSync(fullTemplatePath)) {
        logger.warn(`${stack.fullDir} does not exist, skipping`);
        continue;
      }

      logger.info(`📦 Setting up ${stack.fullDir}...`);

      try {
        if (stack.hasGemfile) {
          setupRubyDeps(stack, fullTemplatePath);
        }

        logger.success(`${stack.fullDir} setup complete\n`);
      } catch (error) {
        logger.error(
          `Error setting up ${stack.fullDir}`,
          error instanceof Error ? error : new Error(String(error)),
        );
        process.exit(1);
      }
    }
  }

  logger.success('All templates setup complete!');
}

setupTemplates().catch((error: unknown) => {
  logger.error(
    'Fatal error',
    error instanceof Error ? error : new Error(String(error)),
  );
  process.exit(1);
});
