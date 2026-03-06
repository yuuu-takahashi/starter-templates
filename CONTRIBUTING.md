# Contributing

## 変更の流れ

1. ブランチを切って変更する
2. `yarn generate:all` を実行し、正本（`shared/`）から生成されるファイルに変更がある場合はコミットに含める
3. `yarn lint` でスクリプトの lint を通過させる
4. PR を作成する

## 正本のルール

- **編集する場所**: `templates/` 以下のファイルはスクリプトで生成されるため、**直接編集しない**。設定を変える場合は [shared/](shared/) 配下の該当ファイルを編集する。
- **生成の実行順序**: `yarn generate:all` は `generate:configs` → `generate:deps` → `generate:ci` → `generate:devcontainer` の順で実行される。ルートの `code-check.yml` は各テンプレートの `code-check.yml` を組み合わせて生成されるため、テンプレートの workflow を変えたあとに `generate:ci` が必要。

## スタック一覧の管理

テンプレート・スタックの一覧は **`scripts/lib/stacks.ts`** で一元管理している。新規テンプレートを追加するときは、まずここにエントリを追加し、必要に応じて他のスクリプト（`gen-tool-configs.ts`、`generate-devcontainer.ts` など）を足す。詳細は [README の「新テンプレート追加手順」](README.md#新テンプレート追加手順) を参照。

## ルートの Lint / Format

- `yarn lint` … `scripts/` 配下の TypeScript を ESLint でチェック
- `yarn lint:fix` … 自動修正
- `yarn format` … Prettier で `scripts/**/*.ts` をフォーマット
