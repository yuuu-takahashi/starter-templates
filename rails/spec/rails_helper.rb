require 'view_component/test_helpers'

ENV['RAILS_ENV'] = 'test'
require_relative '../config/environment'
require 'rspec/rails'

puts "RAILS_ENV: #{Rails.env}"
puts "Connected to database: #{ActiveRecord::Base.connection.current_database}"

begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end

RSpec.configure do |config|
  # Ensure that if we are running js tests, we are using latest webpack assets
  # This will use the defaults of :js and :server_rendering meta tags
  ReactOnRails::TestHelper.configure_rspec_to_compile_assets(config)

  config.include ViewComponent::TestHelpers, type: :component
  config.include FactoryBot::Syntax::Methods

  config.fixture_paths = [Rails.root.join('spec/fixtures')]
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
