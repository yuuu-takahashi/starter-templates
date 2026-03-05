#!/usr/bin/env tsx
/**
 * Generates shared config files for all templates.
 * 方針: まず .ts で生成し、ツールが求める場合のみ .json を生成する。
 *
 * .ts で出力: eslint.config.ts, vitest.config.ts 等
 * .ts ソースから .json を生成: .prettierrc.json（shared/prettier/.prettierrc.ts）, tsconfig（shared/tsconfig/ 内の .ts）
 *
 * Run: yarn generate:configs
 */

import { run as genCommonFiles } from "./gen-common-files.js";
import { run as genToolConfigs } from "./gen-tool-configs.js";
import { run as genRubyConfigs } from "./gen-ruby-configs.js";
import { run as genLaravelConfigs } from "./gen-laravel-configs.js";
import { run as genWorkflows } from "./gen-workflows.js";
import { run as genReadme } from "./gen-readme.js";

async function run(): Promise<void> {
  genCommonFiles();
  await genToolConfigs();
  genRubyConfigs();
  genLaravelConfigs();
  genWorkflows();
  await genReadme();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
