# shared/

**言語をまたぐ**共通設定のソースです。`yarn generate:configs` で各テンプレートにコピーされます。

- **prettier/** — `.prettierrc.json`（全テンプレート）※ツール互換のため .json のまま
- **editorconfig/** — `.editorconfig`（全テンプレート）
- **workflows/** — 各テンプレートの `.github/workflows/static-analysis.yml` の元

編集後は `yarn generate:configs` を実行して反映してください。

設定ファイルの形式方針（.ts / .json / .yaml の使い分け）は [docs/config-file-formats.md](../docs/config-file-formats.md) を参照。
