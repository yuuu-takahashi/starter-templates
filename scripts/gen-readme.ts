/**
 * Generates README.md for each template.
 * Run via generate-configs.ts
 * Template: shared/readme/README.md.hbs
 *
 * ## 生成プロセス
 *
 * 1. TEMPLATE_README_CONFIGS から各テンプレートの設定を取得
 * 2. buildStackSection() で「主なライブラリ」「主な Gem」「拡張機能」セクションを生成
 *    - npm/gemfile ファイルが存在しない場合は existsSync でチェック（エラーなく黙ってスキップ）
 * 3. prepareTemplateContext() で Handlebars テンプレート用のコンテキストを準備
 * 4. shared/readme/README.md.hbs で README.md を生成
 * 5. outputDir で出力先を決定
 *
 * ## outputDir の重要性
 *
 * - minimal テンプレート: outputDir なし → minimal-templates/${id} に出力
 * - full テンプレート: outputDir 指定 → full-templates/${id} に出力
 *
 * 従来のハック（-full サフィックスから出力先を計算）は廃止され、
 * 明示的な outputDir で管理する構造に変更されました。
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';
import {
  TEMPLATE_README_CONFIGS,
  type TemplateReadmeConfig,
} from './lib/template-readme-config.js';
import type { ExtensionSetKey } from './lib/devcontainer-types.js';
import { STACK_DEFINITIONS, TEMPLATES_DIR, slug } from './lib/stacks.js';
import { TEMPLATE_LABELS } from './lib/template-labels.js';
import {
  NPM_DESCRIPTIONS,
  GEM_DESCRIPTIONS,
  EXTENSION_DESCRIPTIONS,
} from './lib/readme-descriptions.js';
import { ROOT, SHARED_NPM, SHARED_GEMFILE } from './lib/utils.js';
import { handleGenerationError } from './lib/errors.js';

const README_TEMPLATE_PATH = join(ROOT, 'shared', 'readme', 'README.md.hbs');

function withDesc(name: string, map: Record<string, string>): string {
  const desc = map[name];
  return desc ? `- ${name} — ${desc}` : `- ${name}`;
}

// ── セクション生成 ─────────────────────────────────────────────────────────────

export function buildStackSection(
  c: TemplateReadmeConfig,
  devcontainerDefaults: { extensions: Record<ExtensionSetKey, string[]> },
): string | undefined {
  const parts: string[] = [];

  if (c.npmStack) {
    const npmPath = join(SHARED_NPM, `${c.npmStack}.json`);
    if (existsSync(npmPath)) {
      const pkg = JSON.parse(readFileSync(npmPath, 'utf8')) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      const deps = Object.keys(pkg.dependencies ?? {}).sort();
      const devDeps = Object.keys(pkg.devDependencies ?? {}).sort();
      if (deps.length > 0 || devDeps.length > 0) {
        parts.push('### 主な npm パッケージ');
        parts.push('');
        if (deps.length > 0) {
          parts.push('（本番依存）');
          parts.push('');
          deps.forEach((name) => parts.push(withDesc(name, NPM_DESCRIPTIONS)));
          parts.push('');
        }
        if (devDeps.length > 0) {
          parts.push('（開発依存）');
          parts.push('');
          devDeps.forEach((name) =>
            parts.push(withDesc(name, NPM_DESCRIPTIONS)),
          );
          parts.push('');
        }
      }
    }
  }

  if (c.gemfileStack) {
    const gemfilePath = join(SHARED_GEMFILE, `Gemfile.${c.gemfileStack}`);
    if (existsSync(gemfilePath)) {
      const gemfileContent = readFileSync(gemfilePath, 'utf8');
      const gemNames = [
        ...gemfileContent.matchAll(/gem\s+['"]([^'"]+)['"]/g),
      ].map((m) => m[1]);
      const unique = [...new Set(gemNames)].sort();
      if (unique.length > 0) {
        parts.push('### 主な Gem');
        parts.push('');
        unique.forEach((name) => parts.push(withDesc(name, GEM_DESCRIPTIONS)));
        parts.push('');
      }
    }
  }

  if (c.stackLibs && c.stackLibs.length > 0) {
    parts.push('### 主なライブラリ');
    parts.push('');
    c.stackLibs.forEach((line) =>
      parts.push(line.startsWith('-') ? line : `- ${line}`),
    );
    parts.push('');
  }

  if (c.extensionSets && c.extensionSets.length > 0) {
    const extIds = new Set<string>();
    for (const set of c.extensionSets) {
      const list = devcontainerDefaults.extensions[set];
      if (Array.isArray(list)) list.forEach((id) => extIds.add(id));
    }
    if (extIds.size > 0) {
      parts.push('### Dev Container でインストールされる主な拡張機能');
      parts.push('');
      [...extIds]
        .sort()
        .forEach((id) => parts.push(withDesc(id, EXTENSION_DESCRIPTIONS)));
      parts.push('');
    }
  }

  if (parts.length === 0) return undefined;
  return parts
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd();
}

export function prepareTemplateContext(
  config: TemplateReadmeConfig,
  stackSection: string | undefined,
): Record<string, unknown> {
  const setupSteps = config.setupSteps.map((step, i) => ({
    num: i + 1,
    label: step.label,
    commands: step.commands,
    hasCommands: step.commands.length > 0,
  }));

  const stackIndex = STACK_DEFINITIONS.findIndex(
    (s) => slug(s.dir) === config.id,
  );
  const stack = stackIndex >= 0 ? STACK_DEFINITIONS[stackIndex] : null;
  const selectNumber =
    config.selectNumber ?? (stackIndex >= 0 ? stackIndex + 1 : 0);
  const selectLabel =
    config.selectLabel ??
    (stack ? (TEMPLATE_LABELS[stack.id] ?? config.id) : config.id);

  return {
    title: config.title,
    description: config.description,
    id: config.id,
    stackSection: stackSection ?? '',
    selectNumber,
    selectLabel,
    setupSteps,
    previewLine: config.previewUrl
      ? `ブラウザで <${config.previewUrl}> を開き、表示確認`
      : '',
    devGuide: config.devGuide,
    hasDevGuide: config.devGuide.length > 0,
    extraSections: config.extraSections ?? '',
  };
}

export async function run(): Promise<void> {
  try {
    const templateSource = readFileSync(README_TEMPLATE_PATH, 'utf8');
    const template = Handlebars.compile(templateSource, {
      noEscape: true,
      strict: true,
    });

    const DEFAULTS_PATH = join(ROOT, 'shared', 'devcontainer', 'defaults.json');
    const devcontainerDefaults = JSON.parse(
      readFileSync(DEFAULTS_PATH, 'utf8'),
    ) as {
      extensions: Record<ExtensionSetKey, string[]>;
    };

    for (const config of TEMPLATE_README_CONFIGS) {
      const stackSection = buildStackSection(config, devcontainerDefaults);
      const context = prepareTemplateContext(config, stackSection);
      const content = template(context);
      const normalized = content.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
      const outDir = config.outputDir
        ? join(ROOT, config.outputDir)
        : join(ROOT, TEMPLATES_DIR, config.id);
      const outPath = join(outDir, 'README.md');
      writeFileSync(outPath, normalized, 'utf8');
      console.log('Generated:', outPath);
    }
  } catch (error) {
    handleGenerationError(error);
  }
}
