/**
 * Prettier 共通設定。generate-configs で .prettierrc.json を生成する。
 */
export default {
  semi: true,
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  trailingComma: "es5" as const,
  bracketSpacing: true,
  arrowParens: "always" as const,
  endOfLine: "lf" as const,
};
