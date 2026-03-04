/**
 * React テンプレート用 tsconfig.app。generate-configs で tsconfig.app.json を生成。
 */
export default {
  compilerOptions: {
    tsBuildInfoFile: "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    target: "ES2023",
    useDefineForClassFields: true,
    lib: ["ES2023", "DOM", "DOM.Iterable"],
    module: "ESNext",
    skipLibCheck: true,
    paths: {
      "@/*": ["./src/*"],
    },
    moduleResolution: "bundler",
    allowImportingTsExtensions: true,
    isolatedModules: true,
    moduleDetection: "force",
    noEmit: true,
    jsx: "react-jsx",
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true,
    noUncheckedSideEffectImports: true,
  },
  include: ["src"],
};
