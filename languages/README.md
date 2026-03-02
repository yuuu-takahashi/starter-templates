# languages/

フレームワークに依存しない**言語レベル**の共通資産を置くディレクトリです。

- **node/** … Node/TypeScript 系テンプレート用（Dockerfile、`eslint.config.base.mjs` → nodejs にコピー）
- **ruby/** … Ruby 系テンプレート用（Dockerfile、`.rspec.common`、`.rubocop_base.yml` + テンプレート用 fragment → 各 .rubocop.yml を生成）

`templates/` はフレームワーク単位（nextjs, rails, sinatra など）、ここは言語単位で共有する設定・Dockerfile をまとめます。  
generate スクリプトがここを参照して各テンプレートにコピーします。

設定の形式方針（.ts / .json / .yaml）は [docs/config-file-formats.md](../docs/config-file-formats.md) を参照。
