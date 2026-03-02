# shared/

**言語をまたぐ**共通設定のソースです。`yarn generate:configs` で各テンプレートにコピーされます。

- **prettier/** — `.prettierrc.json`（全テンプレート）※ツール互換のため .json のまま
- **editorconfig/** — `.editorconfig`（全テンプレート）
- **gitignore/** — `.gitignore`（スタック別: `.gitignore.node` / `.gitignore.rails` / `.gitignore.ruby`）
- **workflows/** — 各テンプレートの `.github/` の元（`static-analysis.yml` / `code-check.yml` / `test.yml` / `dependabot.yml` をテンプレート種別に応じて生成）
- **devcontainer/** — devcontainer 用の VSCode 拡張機能・設定の共通定義（`yarn generate:devcontainer` で各テンプレートに反映）

各テンプレートの **README.md** は `scripts/template-readme-config.ts` の共通文面（`SHARED_README_*` 定数）とテンプレート別の設定（`TEMPLATE_README_CONFIGS`）から `yarn generate:configs` で生成されます。

編集後は `yarn generate:configs`（prettier / editorconfig / workflows）または `yarn generate:devcontainer`（devcontainer）を実行して反映してください。

設定ファイルの形式方針（.ts / .json / .yaml の使い分け）は [docs/config-file-formats.md](../docs/config-file-formats.md) を参照。
