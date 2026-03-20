ENV['RAILS_ENV'] = 'test'

# テスト用の環境変数。未設定時のみセット。CI（GitHub Actions は ENV['CI'] を設定）では host=db、ローカルでは localhost。
require 'dotenv'
env_file = File.expand_path('../.env.test', __dir__)
Dotenv.overload(env_file) if File.exist?(env_file)
ENV['DATABASE_HOST']     ||= ENV['CI'] == 'true' ? 'db' : 'localhost'
ENV['DATABASE_USER']     ||= 'root'
ENV['DATABASE_PASSWORD'] ||= 'password'

require_relative '../config/environment'
abort("The Rails environment is running in production mode!") if Rails.env.production?
require 'rspec/rails'

begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  warn e.to_s.strip
  exit 1
end

RSpec.configure do |config|
  config.include FactoryBot::Syntax::Methods

  config.fixture_paths = [ "#{::Rails.root}/spec/fixtures" ]
  config.use_transactional_fixtures = true

  config.infer_spec_type_from_file_location!

  config.filter_rails_from_backtrace!

  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  config.shared_context_metadata_behavior = :apply_to_host_groups
end
