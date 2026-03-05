/**
 * Shared constants and utilities for generate-configs scripts.
 */

import { readFileSync } from "fs";
import { join } from "path";

export const ROOT: string = process.cwd();

export const VERSIONS = JSON.parse(
  readFileSync(join(ROOT, "shared", "versions.json"), "utf8")
) as { node: string; ruby: string; php?: string; go?: string };

// 横断的な共通設定を配るテンプレート一覧（Prettier / EditorConfig 対象）
export const SHARED_CONFIG_STACKS: string[] = [
  "templates/nextjs",
  "templates/nodejs",
  "templates/reactjs",
  "templates/rails",
  "templates/rails-api",
  "templates/laravel",
  "templates/sinatra",
  "templates/csharp",
  "templates/go",
  "templates/rust",
];

export const SHARED_EDITORCONFIG = join(ROOT, "shared", "editorconfig", ".editorconfig");
export const GITIGNORE_DIR = join(ROOT, "shared", "gitignore");
export const RSPEC_COMMON = join(ROOT, "shared", "rspec", "rspec.common");
export const SHARED_ESLINT = join(ROOT, "shared", "eslint");
export const SHARED_TSCONFIG = join(ROOT, "shared", "tsconfig");
export const SHARED_VITEST = join(ROOT, "shared", "vitest");

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
