require 'dotenv'

APP_ROOT = File.expand_path('..', __dir__)

env_file = File.join(APP_ROOT, ".env.#{ENV.fetch('APP_ENV', nil)}")

raise "Error: Env file not found at #{env_file}" unless File.exist?(env_file)

puts 'Env file found'

Dotenv.overload(env_file)
