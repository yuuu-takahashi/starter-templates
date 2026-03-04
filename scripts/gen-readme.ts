/**
 * Generates README.md for each template.
 * Run via generate-configs.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import {
  TEMPLATE_README_CONFIGS,
  getGeneratedReadmeContent,
  SHARED_README_SECTION_STACK,
  type TemplateReadmeConfig,
  type ExtensionSetKey,
} from "./template-readme-config.js";
import { ROOT } from "./lib/utils.js";

function buildStackSection(
  c: TemplateReadmeConfig,
  devcontainerDefaults: { extensions: Record<ExtensionSetKey, string[]> }
): string | undefined {
  const SHARED_NPM = join(ROOT, "shared", "npm");
  const SHARED_GEMFILE = join(ROOT, "shared", "gemfile");
  const parts: string[] = [];

  if (c.npmStack) {
    const npmPath = join(SHARED_NPM, `${c.npmStack}.json`);
    try {
      const pkg = JSON.parse(readFileSync(npmPath, "utf8")) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      const deps = Object.keys(pkg.dependencies ?? {}).sort();
      const devDeps = Object.keys(pkg.devDependencies ?? {}).sort();
      if (deps.length > 0 || devDeps.length > 0) {
        parts.push("### 主な npm パッケージ");
        parts.push("");
        if (deps.length > 0) {
          parts.push("（本番依存）");
          parts.push("");
          deps.forEach((name) => parts.push(`- ${name}`));
          parts.push("");
        }
        if (devDeps.length > 0) {
          parts.push("（開発依存）");
          parts.push("");
          devDeps.forEach((name) => parts.push(`- ${name}`));
          parts.push("");
        }
      }
    } catch {
      // ファイルが無い場合はスキップ
    }
  }

  if (c.gemfileStack) {
    const gemfilePath = join(SHARED_GEMFILE, `Gemfile.${c.gemfileStack}`);
    try {
      const gemfileContent = readFileSync(gemfilePath, "utf8");
      const gemNames = [...gemfileContent.matchAll(/gem\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);
      const unique = [...new Set(gemNames)].sort();
      if (unique.length > 0) {
        parts.push("### 主な Gem");
        parts.push("");
        unique.forEach((name) => parts.push(`- ${name}`));
        parts.push("");
      }
    } catch {
      // ファイルが無い場合はスキップ
    }
  }

  if (c.extensionSets && c.extensionSets.length > 0) {
    const extIds = new Set<string>();
    for (const set of c.extensionSets) {
      const list = devcontainerDefaults.extensions[set];
      if (Array.isArray(list)) list.forEach((id) => extIds.add(id));
    }
    if (extIds.size > 0) {
      parts.push("### Dev Container でインストールされる主な拡張機能");
      parts.push("");
      [...extIds].sort().forEach((id) => parts.push(`- \`${id}\``));
      parts.push("");
    }
  }

  if (parts.length === 0) return undefined;
  return SHARED_README_SECTION_STACK + "\n\n" + parts.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd();
}

export async function run(): Promise<void> {
  const DEFAULTS_PATH = join(ROOT, "shared", "devcontainer", "defaults.json");
  const devcontainerDefaults = JSON.parse(readFileSync(DEFAULTS_PATH, "utf8")) as {
    extensions: Record<ExtensionSetKey, string[]>;
  };

  for (const config of TEMPLATE_README_CONFIGS) {
    const stackSection = buildStackSection(config, devcontainerDefaults);
    const outPath = join(ROOT, "templates", config.id, "README.md");
    writeFileSync(outPath, getGeneratedReadmeContent(config, { stackSection }), "utf8");
    console.log("Generated:", outPath);
  }
}
