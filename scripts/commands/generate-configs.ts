#!/usr/bin/env tsx
/**
 * Generates shared config files for all templates.
 * 方針: まず .ts で生成し、ツールが求める場合のみ .json を生成する。
 *
 * .ts で出力: eslint.config.ts, vitest.config.ts 等
 * .ts ソースから .json を生成: .prettierrc.json（shared/config/lint-format/prettier/.prettierrc.ts）, tsconfig（shared/config/tsconfig/ 内の .ts）
 *
 * Run: yarn generate:configs
 */

import { run as genCommonFiles } from "../generators/gen-common-files.js";
import { run as genToolConfigs } from "../generators/gen-tool-configs.js";
import { run as genRubyConfigs } from "../generators/gen-ruby-configs.js";
import { run as genWorkflows } from "../generators/gen-workflows.js";
import { run as genReadme } from "../generators/gen-readme.js";
import { logger } from "../lib/logger.js";

const run = async (): Promise<void> => {
  logger.info('🔄 Starting configuration generation...\n');

  try {
    logger.info('📝 Generating common files...');
    genCommonFiles();
    logger.info('✓ Common files generated\n');

    logger.info('🔧 Generating tool configs...');
    await genToolConfigs();
    logger.info('✓ Tool configs generated\n');

    logger.info('💎 Generating Ruby configs...');
    genRubyConfigs();
    logger.info('✓ Ruby configs generated\n');

    logger.info('⚙️ Generating workflows...');
    genWorkflows();
    logger.info('✓ Workflows generated\n');

    logger.info('📚 Generating READMEs...');
    await genReadme();
    logger.info('✓ READMEs generated\n');

    logger.success('All configurations generated successfully!');
  } catch (error) {
    logger.error('Configuration generation failed', error instanceof Error ? error : undefined);
    process.exit(1);
  }
};

run();
