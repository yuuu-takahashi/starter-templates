import { describe, it, expect } from "vitest";
import { existsSync } from "fs";
import { join } from "path";
import {
  TEMPLATE_DIRS,
  TEMPLATES_DIR,
  CODE_CHECK_SOURCE,
  TEST_SOURCE,
  GITIGNORE_SOURCE,
  DOCKERIGNORE_SOURCE,
  DEVCONTAINER_DOCKERFILE_MAP,
  ROOT_STACKS,
  NODE_VERSION_DIRS,
  RUBY_VERSION_DIRS,
  PYTHON_VERSION_DIRS,
  NPM_STACKS,
  GEMFILE_STACKS,
  MONOREPO_PREFIX_STACKS,
  PHP_VERSION_DIRS,
  GO_VERSION_DIRS,
} from "../lib/stacks.js";
import { ROOT } from "../lib/utils.js";

describe("stacks.ts 整合性", () => {
  it("TEMPLATE_DIRS の全エントリが CODE_CHECK_SOURCE に存在する", () => {
    for (const dir of TEMPLATE_DIRS) {
      expect(CODE_CHECK_SOURCE, `${dir} が CODE_CHECK_SOURCE に未定義`).toHaveProperty(dir);
    }
  });

  it("TEMPLATE_DIRS の全エントリが GITIGNORE_SOURCE に存在する", () => {
    for (const dir of TEMPLATE_DIRS) {
      expect(GITIGNORE_SOURCE, `${dir} が GITIGNORE_SOURCE に未定義`).toHaveProperty(dir);
    }
  });

  it("TEMPLATE_DIRS の全エントリが DEVCONTAINER_DOCKERFILE_MAP に存在する", () => {
    for (const dir of TEMPLATE_DIRS) {
      expect(
        DEVCONTAINER_DOCKERFILE_MAP,
        `${dir} が DEVCONTAINER_DOCKERFILE_MAP に未定義`
      ).toHaveProperty(dir);
    }
  });

  it("ROOT_STACKS の dir が全て TEMPLATE_DIRS に含まれる", () => {
    for (const entry of ROOT_STACKS) {
      expect(TEMPLATE_DIRS, `ROOT_STACKS の dir="${entry.dir}" が TEMPLATE_DIRS に未登録`).toContain(
        entry.dir
      );
    }
  });

  it("TEMPLATE_DIRS と ROOT_STACKS の件数が一致する", () => {
    expect(ROOT_STACKS.length).toBe(TEMPLATE_DIRS.length);
  });

  it("NODE_VERSION_DIRS / RUBY_VERSION_DIRS / PYTHON_VERSION_DIRS は TEMPLATE_DIRS のサブセット", () => {
    const all = new Set(TEMPLATE_DIRS);
    for (const dir of [...NODE_VERSION_DIRS, ...RUBY_VERSION_DIRS, ...PYTHON_VERSION_DIRS]) {
      expect(all, `${dir} が TEMPLATE_DIRS に存在しない`).toContain(dir);
    }
  });

  it("PHP_VERSION_DIRS / GO_VERSION_DIRS は TEMPLATE_DIRS のサブセット", () => {
    const all = new Set(TEMPLATE_DIRS);
    for (const dir of [...PHP_VERSION_DIRS, ...GO_VERSION_DIRS]) {
      expect(all, `${dir} が TEMPLATE_DIRS に存在しない`).toContain(dir);
    }
  });

  it("MONOREPO_PREFIX_STACKS の各 slug は TEMPLATE_DIRS の dir から導出できる", () => {
    const dirSlugs = new Set(
      TEMPLATE_DIRS.map((d) => d.replace(new RegExp(`^${TEMPLATES_DIR}/`), ""))
    );
    for (const slug of MONOREPO_PREFIX_STACKS) {
      expect(dirSlugs, `MONOREPO_PREFIX_STACKS の ${slug} が TEMPLATE_DIRS に存在しない`).toContain(
        slug
      );
    }
  });

  it("TEMPLATE_DIRS の dir が重複していない", () => {
    const seen = new Set<string>();
    for (const dir of TEMPLATE_DIRS) {
      expect(seen.has(dir), `重複: ${dir}`).toBe(false);
      seen.add(dir);
    }
  });

  it("ROOT_STACKS の id が重複していない", () => {
    const ids = ROOT_STACKS.map((s) => s.id);
    expect(ids.length).toBe(new Set(ids).size);
  });
});

describe("stacks.ts ファイル存在確認", () => {
  it("GITIGNORE_SOURCE の参照先ファイルが全て存在する", () => {
    for (const [, filename] of Object.entries(GITIGNORE_SOURCE)) {
      const path = join(ROOT, "shared", "gitignore", filename);
      expect(existsSync(path), `${path} が存在しない`).toBe(true);
    }
  });

  it("CODE_CHECK_SOURCE の参照先ファイルが全て存在する", () => {
    for (const [, filename] of Object.entries(CODE_CHECK_SOURCE)) {
      const path = join(ROOT, "shared", "workflows", filename);
      expect(existsSync(path), `${path} が存在しない`).toBe(true);
    }
  });

  it("TEST_SOURCE の参照先ファイルが全て存在する", () => {
    for (const [, filename] of Object.entries(TEST_SOURCE)) {
      const path = join(ROOT, "shared", "workflows", filename);
      expect(existsSync(path), `${path} が存在しない`).toBe(true);
    }
  });

  it("DEVCONTAINER_DOCKERFILE_MAP の参照先 Dockerfile が全て存在する", () => {
    for (const [, dockerfileName] of Object.entries(DEVCONTAINER_DOCKERFILE_MAP)) {
      if (dockerfileName === null) continue;
      const path = join(ROOT, "shared", "docker", dockerfileName);
      expect(existsSync(path), `${path} が存在しない`).toBe(true);
    }
  });

  it("DOCKERIGNORE_SOURCE の参照先ファイルが全て存在する", () => {
    for (const [, filename] of Object.entries(DOCKERIGNORE_SOURCE)) {
      const path = join(ROOT, "shared", "docker", filename);
      expect(existsSync(path), `${path} が存在しない`).toBe(true);
    }
  });

  it("NPM_STACKS の各 slug に対応する shared/npm/<slug>.json が存在する", () => {
    for (const slug of NPM_STACKS) {
      const path = join(ROOT, "shared", "npm", `${slug}.json`);
      expect(existsSync(path), `${path} が存在しない`).toBe(true);
    }
  });

  it("GEMFILE_STACKS の各 slug に対応する shared/gemfile/Gemfile.<slug> が存在する", () => {
    for (const slug of GEMFILE_STACKS) {
      const path = join(ROOT, "shared", "gemfile", `Gemfile.${slug}`);
      expect(existsSync(path), `${path} が存在しない`).toBe(true);
    }
  });

  it("TEMPLATE_DIRS の各 dir が実ディレクトリとして存在する", () => {
    for (const dir of TEMPLATE_DIRS) {
      const path = join(ROOT, dir);
      expect(existsSync(path), `${path} が存在しない`).toBe(true);
    }
  });
});
