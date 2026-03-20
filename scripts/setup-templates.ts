/**
 * Setup script to initialize templates after generation.
 * - bundle install (vendor/bundle via local config) + rails db:migrate for Ruby/Rails templates
 * - npm install for Node.js templates
 */

import { execSync } from 'child_process';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { bundleInstallVendorPath } from './lib/bundle-vendor-path.js';
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
          let hasBundler = false;
          try {
            execSync('bundle --version', { stdio: 'pipe' });
            hasBundler = true;
          } catch {
            console.log(`⏭️  Skipping bundle install (bundler not installed)`);
          }

          if (hasBundler) {
            // Project-local gems (Bundler 3+: config set path, not --path)
            console.log(
              `   → bundle config set --local path vendor/bundle && bundle install`,
            );
            bundleInstallVendorPath(templatePath);

            // Run migrations for Rails-based templates
            if (stack.dir.includes('rails')) {
              console.log(`   → bundle exec rails db:migrate`);
              execSync('bundle exec rails db:migrate', {
                cwd: templatePath,
                stdio: 'inherit',
              });
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
