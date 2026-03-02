# shared/tsconfig/

各テンプレートの tsconfig の共通ソースです。**まず .ts で定義し、`yarn generate:configs` で .json を生成**します。

- **react/** — `tsconfig.root.ts`, `tsconfig.app.ts`, `tsconfig.node.ts` → `templates/react/tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- **nextjs/** — `tsconfig.ts` → `templates/nextjs/tsconfig.json`
- **rails/** — `tsconfig.ts` → `templates/rails/tsconfig.json`

編集後は `yarn generate:configs` を実行して各テンプレートへ反映してください。
