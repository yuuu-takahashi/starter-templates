/**
 * Shared constants and utilities for generate-configs scripts.
 */

import { readFileSync } from "fs";
import { TEMPLATE_DIRS, FULL_TEMPLATE_DIRS } from "./stacks.js";
import {
  ROOT,
  VERSIONS_JSON,
  SHARED_LINT_FORMAT,
  SHARED_EDITORCONFIG,
  GITIGNORE_DIR,
  SHARED_TEST,
  RSPEC_COMMON,
  SHARED_ESLINT,
  SHARED_PRETTIER,
  SHARED_TSCONFIG,
  SHARED_VITEST,
  SHARED_NPM,
  SHARED_GEMFILE,
  SHARED_RUBOCOP,
  SHARED_DOCKER,
} from "./paths.js";

export {
  ROOT,
  SHARED_LINT_FORMAT,
  SHARED_EDITORCONFIG,
  GITIGNORE_DIR,
  SHARED_TEST,
  RSPEC_COMMON,
  SHARED_ESLINT,
  SHARED_PRETTIER,
  SHARED_TSCONFIG,
  SHARED_VITEST,
  SHARED_NPM,
  SHARED_GEMFILE,
  SHARED_RUBOCOP,
  SHARED_DOCKER,
};

export const VERSIONS = JSON.parse(
  readFileSync(VERSIONS_JSON, "utf8")
) as { node: string; ruby: string; php?: string; go?: string; python?: string; dotnet?: string; rust?: string };

/** 横断的な共通設定を配るテンプレート一覧（Prettier / EditorConfig 対象） */
export const SHARED_CONFIG_STACKS: readonly string[] = [
  ...TEMPLATE_DIRS,
  ...FULL_TEMPLATE_DIRS,
];

export function deepMerge<T extends Record<string, unknown>>(a: T, b: Record<string, unknown>): T {
  const r = { ...a } as Record<string, unknown>;
  for (const k of Object.keys(b)) {
    const av = r[k];
    const bv = b[k];
    if (
      bv != null &&
      typeof bv === "object" &&
      !Array.isArray(bv) &&
      av != null &&
      typeof av === "object" &&
      !Array.isArray(av)
    ) {
      r[k] = deepMerge(av as Record<string, unknown>, bv as Record<string, unknown>);
    } else {
      r[k] = bv;
    }
  }
  return r as T;
}
