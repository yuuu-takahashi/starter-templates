source "https://rubygems.org"

gem "rails", "~> 8.0.1"
gem "mysql2", "~> 0.5"
gem "puma", ">= 5.0"
gem "tzinfo-data", platforms: %i[ mswin mswin64 mingw x64_mingw jruby ]
gem "rswag"
gem "bootsnap", require: false

group :development, :test do
  gem "debug", platforms: %i[ mri mswin mswin64 mingw x64_mingw ], require: "debug/prelude"
  gem "brakeman", require: false
  gem "rubocop-rails-omakase", require: false
  gem "dotenv-rails"
end

group :test do
  gem "faker"
  gem "factory_bot_rails"
  gem "rspec-rails", "~> 7.0"
end
