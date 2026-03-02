# 環境変数テンプレート

DB 利用テンプレート（rails-api, sinatra）の `.env.example` / `.env.test` は、ここにあるテンプレートから `yarn generate:configs` で生成されます。

- **rails**: `rails.env.example`, `rails.env.test` → `templates/rails-api/`
- **sinatra**: `sinatra.env.example`, `sinatra.env.test` → `templates/sinatra/`

プレースホルダー `{{TEMPLATE_ID}}` は生成時に各テンプレートの ID（例: `template-rails-api`）に置換されます。
編集後は `yarn generate:configs` を実行して各テンプレートへ反映してください。
