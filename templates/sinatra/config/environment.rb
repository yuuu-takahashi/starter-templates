require 'dotenv'

APP_ROOT = File.expand_path('..', __dir__)

# 単一 .env を読み込む（.env.example をコピーして .env を作成する運用）
env_file = File.join(APP_ROOT, '.env')
Dotenv.load(env_file) if File.exist?(env_file)
