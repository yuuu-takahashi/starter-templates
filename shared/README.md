# shared/

このディレクトリは、テンプレートに配布される設定ファイルの**正本**です。
`templates/` 以下のファイルはスクリプトによって自動生成されるため、直接編集せず、このディレクトリ内のファイルを編集してください。

## ディレクトリ一覧

| ディレクトリ / ファイル | 内容 | 生成先 | 生成スクリプト |
|----------------------|------|--------|-------------|
| `editorconfig/` | `.editorconfig` | `templates/*/.editorconfig` | `gen-common-files.ts` |
| `gitignore/` | `.gitignore.node`, `.gitignore.rails`, `.gitignore.ruby` | `templates/*/.gitignore` | `gen-common-files.ts` |
| `versions.json` | Node.js / Ruby のバージョン | `templates/*/.node-version`, `templates/*/.ruby-version` | `gen-common-files.ts` |
| `eslint/` | `eslint.config.<stack>.js` | `templates/*/eslint.config.js` | `gen-tool-configs.ts` |
| `prettier/` | `.prettierrc.ts`（TypeScript で記述し JSON に変換） | `templates/*/.prettierrc.json` | `gen-tool-configs.ts` |
| `tsconfig/` | `tsconfig*.ts`（TypeScript で記述し JSON に変換） | `templates/*/tsconfig*.json` | `gen-tool-configs.ts` |
| `vitest/` | `vitest.config.*.ts`, `vitest.setup.ts` など | `templates/nextjs/vitest*.ts` など | `gen-tool-configs.ts` |
| `rspec/` | `rspec.common`（共通の rspec オプション） | `templates/*/.rspec`（`--require` 行と結合） | `gen-ruby-configs.ts` |
| `rubocop/` | `rubocop.base.yml`, `rubocop.<stack>.yml` | `templates/*/.rubocop.yml`（マージして生成） | `gen-ruby-configs.ts` |
| `workflows/` | `code-check-*.yml`, `test-*.yml`, `static-analysis.yml`, `dependabot.yml` | `templates/*/.github/workflows/`, `templates/*/.github/dependabot.yml` | `gen-workflows.ts` |
| `env/` | `*.env.head`, `db.env` | `templates/*/.env.example`, `.env.test`, `.env.development` | `gen-workflows.ts` |
| `npm/` | `<stack>.json`（package.json のソース） | `templates/*/package.json` | `generate-deps.ts` |
| `gemfile/` | `Gemfile.<stack>` | `templates/*/Gemfile` | `generate-deps.ts` |
| `devcontainer/` | `defaults.json`, `devcontainer.json.ts` など | `templates/*/.devcontainer/devcontainer.json` | `generate-devcontainer.ts` |
| `docker/` | `Dockerfile.<stack>` | `templates/*/.devcontainer/Dockerfile` | `generate-devcontainer.ts` |

## バージョン管理

Node.js と Ruby のバージョンは `versions.json` で一元管理しています：

```json
{
  "node": "22.x.x",
  "ruby": "3.x.x"
}
```

このファイルを編集後、`yarn generate:configs` を実行すると `.node-version` / `.ruby-version` に反映されます。

## rubocop の構成

`rubocop.base.yml` をベースに、スタック別の差分（`rubocop.rails.yml` など）を `deepMerge` で合成して生成しています。`rails-api` は独立した `rubocop.rails_api.yml` をそのままコピーしています。
