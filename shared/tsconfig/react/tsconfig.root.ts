/**
 * React テンプレート用 tsconfig（references のみ）。generate-configs で tsconfig.json を生成。
 */
export default {
  files: [] as string[],
  references: [
    { path: "./tsconfig.app.json" },
    { path: "./tsconfig.node.json" },
  ],
};
