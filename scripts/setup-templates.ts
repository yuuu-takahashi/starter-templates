/**
 * Setup script to initialize templates after generation.
 * - bundle install + rails db:migrate for Ruby/Rails templates
 * - npm install for Node.js templates
 */

import { execSync } from 'child_process';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { STACK_DEFINITIONS } from './lib/stacks.js';
import { ROOT } from './lib/utils.js';

async function setupTemplates() {
  console.log('🚀 Setting up templates...\n');

  for (const stack of STACK_DEFINITIONS) {
    const templatePath = join(ROOT, stack.dir);

    if (!existsSync(templatePath)) {
      console.log(`⚠️  ${stack.dir} does not exist, skipping`);
      continue;
    }

    console.log(`📦 Setting up ${stack.dir}...`);

    try {
      // Setup Gemfile dependencies (Rails, Sinatra, Ruby)
      if (stack.hasGemfile) {
        const gemfilePath = join(templatePath, 'Gemfile');
        if (existsSync(gemfilePath)) {
          try {
            // Check if bundler is available
            execSync('bundle --version', { stdio: 'pipe' });

            console.log(`   → bundle install`);
            execSync('bundle install', {
              cwd: templatePath,
              stdio: 'inherit',
            });

            // Run migrations for Rails-based templates
            if (stack.dir.includes('rails')) {
              console.log(`   → rails db:migrate`);
              execSync('rails db:migrate', {
                cwd: templatePath,
                stdio: 'inherit',
              });
            }
          } catch (error) {
            if ((error as Error).message.includes('bundle')) {
              console.log(`⏭️  Skipping bundle install (bundler not installed)`);
            } else {
              throw error;
            }
          }
        }
      }

      // Setup npm dependencies
      if (stack.hasNpm) {
        const packageJsonPath = join(templatePath, 'package.json');
        if (existsSync(packageJsonPath)) {
          console.log(`   → npm install`);
          execSync('npm install', {
            cwd: templatePath,
            stdio: 'inherit',
          });

          // Remove package-lock.json (use yarn.lock instead)
          const packageLockPath = join(templatePath, 'package-lock.json');
          if (existsSync(packageLockPath)) {
            unlinkSync(packageLockPath);
          }
        }
      }

      console.log(`✅ ${stack.dir} setup complete\n`);
    } catch (error) {
      console.error(
        `❌ Error setting up ${stack.dir}: ${(error as Error).message}\n`,
      );
      process.exit(1);
    }
  }

  console.log('🎉 All templates setup complete!');
}

setupTemplates().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
