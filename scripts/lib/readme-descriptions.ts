/**
 * README 用の説明マップ（shared/templates/readme/*.json から読み込み）
 */

import { readFileSync } from "fs";
import { join } from "path";
import { SHARED_README } from "./paths.js";

const README_BASE = SHARED_README;

function loadJson<T>(filename: string): T {
  const raw = readFileSync(join(README_BASE, filename), "utf8");
  return JSON.parse(raw) as T;
}

export const NPM_DESCRIPTIONS = loadJson<Record<string, string>>(
  "npm-descriptions.json"
);
export const GEM_DESCRIPTIONS = loadJson<Record<string, string>>(
  "gem-descriptions.json"
);
export const EXTENSION_DESCRIPTIONS = loadJson<Record<string, string>>(
  "extension-descriptions.json"
);
