/**
 * Generates .rubocop.yml and .rspec for Ruby-based templates.
 * Run via generate-configs.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import YAML from "yaml";
import { ROOT, RSPEC_COMMON, SHARED_RUBOCOP, deepMerge } from "../lib/utils.js";
import { TEMPLATES_DIR } from "../lib/stacks.js";

export function run(): void {
  // ── .rspec（共通オプション + 各 template の --require）────────────────────

  const rspecCommonContent = readFileSync(RSPEC_COMMON, "utf8");
  const td = TEMPLATES_DIR;
  const RSPEC_REQUIRES: Record<string, string[]> = {
    [`${td}/rails`]: ["rails_helper"],
    [`${td}/rails-api`]: ["rails_helper", "swagger_helper"],
    [`${td}/sinatra`]: ["spec_helper"],
  };
  for (const [dir, requires] of Object.entries(RSPEC_REQUIRES)) {
    const requireLines = requires.map((r) => `--require ${r}`).join("\n");
    const content = requireLines + "\n" + rspecCommonContent;
    const outPath = join(ROOT, dir, ".rspec");
    writeFileSync(outPath, content, "utf8");
    console.log("Generated:", outPath);
  }

  // ── .rubocop.yml（ベース + テンプレート用 fragment をマージ）──────────────

  const parseYaml = (path: string): Record<string, unknown> => {
    const parsed = YAML.parse(readFileSync(path, "utf8"));
    return parsed === null || parsed === undefined ? {} : (parsed as Record<string, unknown>);
  };

  const rubocopBase = parseYaml(join(SHARED_RUBOCOP, "rubocop.base.yml"));
  const rubocopPureRuby = parseYaml(join(SHARED_RUBOCOP, "rubocop.pure-ruby.yml"));

  const rubocopRails = parseYaml(join(SHARED_RUBOCOP, "rubocop.rails.yml"));
  const rubocopSinatra = parseYaml(join(SHARED_RUBOCOP, "rubocop.sinatra.yml"));
  const rubocopRuby = parseYaml(join(SHARED_RUBOCOP, "rubocop.ruby.yml"));
  const rubocopRailsApi = readFileSync(join(SHARED_RUBOCOP, "rubocop.rails_api.yml"), "utf8");

  const rubocopRailsMerged = deepMerge(rubocopBase, rubocopRails);
  const rubocopSinatraMerged = deepMerge(deepMerge(rubocopBase, rubocopPureRuby), rubocopSinatra);
  const rubocopRubyMerged = deepMerge(deepMerge(rubocopBase, rubocopPureRuby), rubocopRuby);

  const RUBOCOP_OUT: Array<{ dir: string; content: string }> = [
    { dir: `${td}/rails`, content: YAML.stringify(rubocopRailsMerged) },
    { dir: `${td}/sinatra`, content: YAML.stringify(rubocopSinatraMerged) },
    { dir: `${td}/ruby`, content: YAML.stringify(rubocopRubyMerged) },
    { dir: `${td}/rails-api`, content: rubocopRailsApi },
  ];
  for (const { dir, content } of RUBOCOP_OUT) {
    const outPath = join(ROOT, dir, ".rubocop.yml");
    writeFileSync(outPath, content, "utf8");
    console.log("Generated:", outPath);
  }
}
