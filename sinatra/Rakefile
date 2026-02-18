require_relative 'index'

namespace :db do
  task :create do
    DBSetup.create_database
  end

  task :drop do
    DBSetup.drop_database
  end

  task :migrate do
    DBSetup.create_table
  end

  task :seed do
    DBSetup.create_users_seed_data
  end

  task setup: %i[create migrate] do
    puts 'Database setup completed!'
  end

  task :generate_migrate, [:name] do |_t, args|
    migration_name = args[:name]
    puts "Generating migration for: #{migration_name}"
    DBSetup.generate_migrate_file(migration_name)
  end
end
