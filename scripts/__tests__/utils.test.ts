import { describe, it, expect } from "vitest";
import { deepMerge } from "../lib/utils.js";

describe("deepMerge", () => {
  it("プリミティブ値を上書きする", () => {
    const a = { foo: "old", bar: 1 };
    const b = { foo: "new" };
    expect(deepMerge(a, b)).toEqual({ foo: "new", bar: 1 });
  });

  it("ネストしたオブジェクトを再帰的にマージする", () => {
    const a = { rules: { "no-console": "warn", "no-var": "error" } };
    const b = { rules: { "no-console": "error" } };
    expect(deepMerge(a, b)).toEqual({
      rules: { "no-console": "error", "no-var": "error" },
    });
  });

  it("b のキーが null のときは上書きする", () => {
    const a = { foo: { bar: 1 } };
    const b = { foo: null } as Record<string, unknown>;
    expect(deepMerge(a, b)).toEqual({ foo: null });
  });

  it("配列はオブジェクトとして扱わず置換する", () => {
    const a = { list: [1, 2, 3] };
    const b = { list: [4, 5] };
    expect(deepMerge(a, b)).toEqual({ list: [4, 5] });
  });

  it("a に存在しないキーを b から追加する", () => {
    const a = { existing: true };
    const b = { newKey: "hello" };
    expect(deepMerge(a, b)).toEqual({ existing: true, newKey: "hello" });
  });

  it("元のオブジェクトを変更しない（immutability）", () => {
    const a = { nested: { x: 1 } };
    const b = { nested: { x: 2 } };
    deepMerge(a, b);
    expect(a.nested.x).toBe(1);
  });
});
