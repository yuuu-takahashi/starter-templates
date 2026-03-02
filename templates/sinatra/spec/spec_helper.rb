ENV['APP_ENV'] = 'test'

require 'factory_bot'
require 'rack/test'
require 'faker'

require_relative '../index'

Rake.application.init
Rake.application.load_rakefile

FactoryBot.definition_file_paths = %w[./spec/factories]
FactoryBot.find_definitions
FactoryBot.define do
  to_create do |instance|
    client = MySQLClient.connect
    begin
      klass = instance.class
      result = klass.create(instance.attributes)
      instance.instance_variable_set(:@attributes, result.attributes)
    ensure
      client.disconnect
    end
  end
end

RSpec.configure do |config|
  config.before(:suite) do
    Rake::Task['db:setup'].invoke
  end

  config.after(:suite) do
    Rake::Task['db:drop'].invoke
  end

  config.before(:each) do
    MySQLClient.with_database do |client|
      client.run('SET FOREIGN_KEY_CHECKS=0')
      client.tables.each do |table|
        MySQLClient.with_table(table) do |table_client|
          table_client.db.run("TRUNCATE TABLE #{table_client.first_source_table}")
        end
      end
      client.run('SET FOREIGN_KEY_CHECKS=1')
    end
  end

  config.include FactoryBot::Syntax::Methods
  config.include Rack::Test::Methods

  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  config.shared_context_metadata_behavior = :apply_to_host_groups

  def app
    Sinatra::Application
  end
end
