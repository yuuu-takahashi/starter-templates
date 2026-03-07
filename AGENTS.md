# starter-templates

各フレームワークのスターターテンプレートをまとめたモノレポです。`templates/` 配下はスクリプトで自動生成されるため、**設定変更は `shared/` を編集してください**。

## Build & Test コマンド

- 全生成を実行: `yarn generate:all`
- 設定ファイル生成: `yarn generate:configs`
- 依存関係生成: `yarn generate:deps`
- Dev Container 生成: `yarn generate:devcontainer`
- CI ワークフロー生成: `yarn generate:ci`
- Lint: `yarn lint`（ESLint + markdownlint）
- フォーマット: `yarn format`

## プロジェクト構造

| パス | 役割 |
| ---- | ---- |
| `shared/` | **正本** — 編集対象。ESLint / Prettier / devcontainer / workflows などのソース |
| `shared/readme/README.md.hbs` | 各テンプレートの README.md 用 Handlebars テンプレート |
| `templates/` | **生成物** — スクリプトで上書きされる。直接編集禁止 |
| `scripts/` | コード生成スクリプト（TypeScript） |
| `scripts/lib/stacks.ts` | テンプレート・スタック一覧の一元管理 |

## 編集ルール

- **NEVER** `templates/*/` 内の生成対象ファイルを直接編集する（次回 `yarn generate:*` で上書きされる）
- 設定変更は `shared/` 配下の該当ファイルを編集する
- Next.js / React / Laravel / C# のフレームワーク固有設定は `templates/<stack>/` 直下を直接編集可能（生成されない部分のみ）
- 新規テンプレート追加時は `scripts/lib/stacks.ts` にエントリを追加する

## コードスタイル

- `scripts/` 配下の TypeScript は ESLint + Prettier で統一
- Markdown は markdownlint でチェック
- 既存のスクリプトパターン（`gen-*.ts`, `generate-*.ts`）に合わせる
- `shared/` 内のソースは各言語の慣習に従う（JS/TS, Ruby, PHP など）

## Security Boundaries

- **NEVER** `.env` や API キーをコミットする
- **NEVER** `shared/versions.json` を不用意に変更する（全テンプレートに影響）
- **ASK** 大規模な構造変更（`stacks.ts` のスキーマ変更など）の前に確認する

## Git ワークフロー

1. ブランチを切って変更
2. `yarn generate:all` を実行し、生成ファイルの差分があればコミットに含める
3. `yarn lint` でスクリプトの lint を通す
4. PR 作成
