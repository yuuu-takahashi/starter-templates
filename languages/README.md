# languages/

フレームワークに依存しない**言語レベル**の共通資産を置くディレクトリです。

- **node/** … Node/TypeScript 系テンプレート用（ベース Dockerfile、今後 tsconfig や ESLint/Prettier の雛形など）
- **ruby/** … Ruby 系テンプレート用（ベース Dockerfile、今後 .rubocop の雛形など）

`templates/` はフレームワーク単位（nextjs, rails, sinatra など）、ここは言語単位で共有する設定・Dockerfile をまとめます。  
generate スクリプトがここを参照して各テンプレートにコピーします。
