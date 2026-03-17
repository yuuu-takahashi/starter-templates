#!/usr/bin/env tsx
/**
 * テンプレートを対話で選び、指定先にコピーする。
 * Run: yarn create-project
 */

import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import * as readline from "node:readline";
import { fileURLToPath } from "node:url";
import { STACK_DEFINITIONS, TEMPLATES_DIR } from "../lib/stacks.js";
import { TEMPLATE_LABELS } from "../lib/template-labels.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");

function slug(dir: string): string {
  return dir.replace(new RegExp(`^${TEMPLATES_DIR}/`), "");
}

function ask(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve((answer ?? "").trim()));
  });
}

/** ディレクトリの中身を削除する（.git, .claude は残す）。ディレクトリ自体は残す。 */
function clearDir(dir: string): void {
  const preserve = new Set([".git", ".claude"]);
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (preserve.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      fs.rmSync(p, { recursive: true });
    } else {
      fs.unlinkSync(p);
    }
  }
}

function copyTemplate(sourceDir: string, destDir: string): void {
  const exclude = new Set([
    "node_modules",
    ".git",
    ".claude",
    "vendor",
    "__pycache__",
    ".venv",
    "bin",
    "obj",
  ]);

  function shouldExclude(name: string): boolean {
    return exclude.has(name);
  }

  fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
  for (const ent of entries) {
    const src = path.join(sourceDir, ent.name);
    const dest = path.join(destDir, ent.name);
    if (shouldExclude(ent.name)) continue;
    if (ent.isDirectory()) {
      copyTemplate(src, dest);
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

async function main(): Promise<void> {
  const templates: { dir: string; id: string; slug: string; label: string }[] = [];
  for (const s of STACK_DEFINITIONS) {
    templates.push({
      dir: s.dir,
      id: s.id,
      slug: slug(s.dir),
      label: TEMPLATE_LABELS[s.id] ?? s.id,
    });
    if (s.fullDir) {
      const fullId = `${s.id}_full`;
      const fullSlug = `${s.id}-full`;
      templates.push({
        dir: s.fullDir,
        id: fullId,
        slug: fullSlug,
        label: TEMPLATE_LABELS[fullId] ?? `${TEMPLATE_LABELS[s.id] ?? s.id} - 実用`,
      });
    }
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log("\nテンプレートを選んでください:\n");
  templates.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t.label}`);
  });
  console.log("");

  const numStr = await ask(rl, "番号を入力 (1–" + templates.length + "): ");
  const num = parseInt(numStr, 10);
  if (Number.isNaN(num) || num < 1 || num > templates.length) {
    console.error("無効な番号です。");
    rl.close();
    process.exit(1);
  }

  const chosen = templates[num - 1];
  const sourceDir = path.join(REPO_ROOT, chosen.dir);
  if (!fs.existsSync(sourceDir)) {
    console.error(`テンプレートが見つかりません: ${chosen.dir}`);
    rl.close();
    process.exit(1);
  }

  const destInput = await ask(
    rl,
    "作成先のパス (未入力ならこのリポジトリをテンプレートで完全に入れ替え): "
  );
  rl.close();

  const pathEmpty = !destInput.trim();
  const cwd = process.cwd();
  const insideRepo = cwd === REPO_ROOT || cwd.startsWith(REPO_ROOT + path.sep);

  let destDir: string;
  let destPath: string;
  let replaceCurrentDir = false;

  if (pathEmpty) {
    replaceCurrentDir = true;
    destPath = ".";
    destDir = insideRepo ? REPO_ROOT : cwd;
  } else {
    destPath = destInput.trim();
    destDir = path.resolve(cwd, destPath);
  }

  if (replaceCurrentDir) {
    console.log("\nテンプレートを一時保存しています...");
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `starter-templates-${chosen.slug}-`));
    try {
      copyTemplate(sourceDir, tempDir);
      console.log("このリポジトリをクリアしています（.git を残す）...");
      clearDir(destDir);
      console.log(`${chosen.label} をルートにコピーしています...`);
      copyTemplate(tempDir, destDir);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  } else {
    if (fs.existsSync(destDir) && fs.readdirSync(destDir).length > 0) {
      console.error(`作成先が既に存在するか、空ではありません: ${destDir}`);
      process.exit(1);
    }
    console.log(`\n${chosen.label} を ${destDir} にコピーしています...`);
    copyTemplate(sourceDir, destDir);
  }
  console.log("完了しました。\n");
  if (replaceCurrentDir) {
    console.log("このディレクトリがプロジェクトルートです。");
  } else {
    console.log("次のコマンドでプロジェクトに移動してください:");
    console.log(`  cd ${destPath}`);
  }
  console.log("\n依存関係のインストール:");
  if (chosen.slug === "rails" || chosen.slug === "rails-api" || chosen.slug === "sinatra") {
    console.log("  bundle install && yarn install");
  } else if (chosen.slug === "laravel") {
    console.log("  composer install");
  } else if (chosen.slug === "django") {
    console.log("  pip install -r requirements.txt");
  } else if (chosen.slug === "csharp") {
    console.log("  dotnet restore");
  } else if (chosen.slug === "go" || chosen.slug === "rust") {
    console.log("  (必要に応じて依存取得)");
  } else {
    console.log("  yarn install");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
