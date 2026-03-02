# テンプレート一覧

このディレクトリには各フレームワーク用のスターターテンプレートが入っています。

## 単体での利用

**各フォルダ（`nextjs`、`react`、`sinatra` など）は、このリポジトリから切り出して単体のプロジェクトとして利用できます。**

- 使いたいテンプレートのフォルダだけをコピーするか、サブツリーで clone して利用してください。
- Dev Container の Dockerfile は各テンプレートの `.devcontainer/` 内に含まれており、親リポジトリへの参照はありません。
- CI（`.github/workflows/code-check.yml` など）もテンプレート配下のパスのみを参照しているため、フォルダ単体でそのまま利用できます。

例: Next.js テンプレートだけを新規リポジトリとして使う場合

```bash
cp -r templates/nextjs my-app
cd my-app
# 必要に応じて git init など
```

各テンプレートの README でセットアップ手順を確認してください。
