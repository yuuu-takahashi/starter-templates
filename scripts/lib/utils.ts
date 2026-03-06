/**
 * Shared constants and utilities for generate-configs scripts.
 */

import { readFileSync } from "fs";
import { join } from "path";
import { TEMPLATE_DIRS } from "./stacks.js";

export const ROOT: string = process.cwd();

export const VERSIONS = JSON.parse(
  readFileSync(join(ROOT, "shared", "versions.json"), "utf8")
) as { node: string; ruby: string; php?: string; go?: string; python?: string; dotnet?: string; rust?: string };

/** 横断的な共通設定を配るテンプレート一覧（Prettier / EditorConfig 対象） */
export const SHARED_CONFIG_STACKS: readonly string[] = TEMPLATE_DIRS;

/** フォーマッター・リンター設定の正本（一元管理・移行時はこの定数だけ変更） */
export const SHARED_LINT_FORMAT = join(ROOT, "shared", "lint-format");

export const SHARED_EDITORCONFIG = join(SHARED_LINT_FORMAT, "editorconfig", ".editorconfig");
export const GITIGNORE_DIR = join(ROOT, "shared", "gitignore");
/** テスト関連設定の正本（一元管理・移行時はこの定数だけ変更） */
export const SHARED_TEST = join(ROOT, "shared", "test");
export const RSPEC_COMMON = join(SHARED_TEST, "rspec", "rspec.common");
export const SHARED_ESLINT = join(SHARED_LINT_FORMAT, "eslint");
export const SHARED_PRETTIER = join(SHARED_LINT_FORMAT, "prettier");
export const SHARED_TSCONFIG = join(ROOT, "shared", "tsconfig");
export const SHARED_VITEST = join(SHARED_TEST, "vitest");

export const SHARED_NPM = join(ROOT, "shared", "npm");
export const SHARED_GEMFILE = join(ROOT, "shared", "gemfile");
export const SHARED_RUBOCOP = join(SHARED_LINT_FORMAT, "rubocop");

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
