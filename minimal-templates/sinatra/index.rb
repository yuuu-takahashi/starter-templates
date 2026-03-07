require 'sinatra'
require 'sinatra/reloader' if development?
require 'sequel'
require 'sequel/extensions/migration'
require 'yaml'
require 'json'
require 'rake'

require_relative 'config/environment'

Dir[File.join(__dir__, '{app,config,db,lib}/**/*.rb')].each do |file|
  relative_path = file.sub("#{__dir__}/", '').sub(/\.rb$/, '')
  require_relative relative_path
  also_reload relative_path if development?
end

configure :development do
  set :static_cache_control, [:public, { max_age: 0 }]
end

set :bind, '0.0.0.0'
set :port, 4567
set :views, File.expand_path('./app/views', __dir__)
set :public_folder, File.expand_path('./app/public', __dir__)

get '/db_check' do
  MySQLClient.connect
  'Database connection is active'
rescue StandardError => e
  "Database connection error: #{e.message}"
end

not_found do
  erb :not_found
end
