require 'dotenv'

APP_ROOT = File.expand_path('..', __dir__)

env_file = File.join(APP_ROOT, ".env.#{ENV.fetch('APP_ENV', 'development')}")
if File.exist?(env_file)
  Dotenv.overload(env_file)
  puts 'Env file loaded'
else
  # Dev/CI: rely on environment (e.g. docker-compose or GitHub Actions env)
  puts 'Using process environment'
end
