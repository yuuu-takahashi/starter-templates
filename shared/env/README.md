# 環境変数テンプレート

DB 利用テンプレート（rails-api, sinatra）の `.env.example` / `.env.test` は、ここにあるテンプレートから `yarn generate:configs` で生成されます。

## 構成（共通化）

- **db.env** … DB まわり共通（`DATABASE_*`, `MYSQL_ROOT_PASSWORD`）。プレースホルダー: `{{TEMPLATE_ID}}`, `{{SUFFIX}}`（`_development` / `_test`）
- **rails.env.head** … Rails 用の先頭行（`RAILS_ENV={{ENV}}`）
- **sinatra.env.head** … Sinatra 用の先頭行（`APP_ENV={{ENV}}`, `RACK_ENV=development`）

生成時は「各 variant の .env.head」＋「db.env」を結合し、`{{TEMPLATE_ID}}`・`{{SUFFIX}}`・`{{ENV}}` を置換して各テンプレートへ出力します。

- **rails-api**: `rails.env.head` + `db.env` → `templates/rails-api/.env.example`, `.env.test`
- **sinatra**: `sinatra.env.head` + `db.env` → `templates/sinatra/.env.example`, `.env.test`

編集後は `yarn generate:configs` を実行して各テンプレートへ反映してください。
