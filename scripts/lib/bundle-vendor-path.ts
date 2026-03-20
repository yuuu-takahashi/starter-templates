/**
 * Install gems under vendor/bundle (Bundler 3+ no longer supports `bundle install --path`).
 */
import { execSync } from 'node:child_process';

export function bundleInstallVendorPath(cwd: string): void {
  execSync('bundle config set --local path vendor/bundle', {
    cwd,
    stdio: 'inherit',
  });
  execSync('bundle install', { cwd, stdio: 'inherit' });
}
