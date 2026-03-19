module DBSetup
  def self.create_database
    database_path = ENV.fetch('DATABASE_NAME', 'db/development.db')
    db_dir = File.dirname(database_path)
    FileUtils.mkdir_p(db_dir)
    if File.exist?(database_path)
      puts "Database '#{database_path}' already exists."
    else
      File.write(database_path, '')
      puts "Database '#{database_path}' created successfully!"
    end
  end

  def self.client
    @client ||= SQLiteClient.connect
  end

  def self.drop_database
    database_path = ENV.fetch('DATABASE_NAME', 'db/development.db')
    if File.exist?(database_path)
      File.delete(database_path)
      puts "Database '#{database_path}' dropped successfully!"
    else
      puts "Database '#{database_path}' does not exist."
    end
  end

  def self.create_table
    if client.table_exists?(:users)
      puts "Table 'users' already exists."
    else
      Sequel.extension :migration
      Sequel::Migrator.run(client, 'db/migrate')
      puts "Table 'users' created successfully!"
    end
  end

  def self.create_users_seed_data
    user_count = client[:users].count

    if user_count.zero?
      users = YAML.load_file(File.join(File.dirname(__FILE__), 'seeds/users.yml'))
      users.each do |user|
        client[:users].insert(name: user['name'], email: user['email'])
      end
      puts 'users data inserted successfully!'
    else
      puts 'users data already exists. No data inserted.'
    end
  end

  def self.generate_migrate_file(name)
    Sequel.extension :migration
    migration_file = File.join('db/migrate', "#{Time.now.strftime('%Y%m%d%H%M%S')}_#{name}.rb")
    File.write(migration_file, migration_template)
    puts "Migration file '#{migration_file}' created successfully!"
  end

  def self.migration_template
    <<~MIGRATION
      Sequel.migration do
        change do
          create_table(:users) do
            primary_key :id
            String :name, null: false
            String :email, null: false, unique: true
            DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
            DateTime :updated_at, default: Sequel::CURRENT_TIMESTAMP
          end
        end
      end
    MIGRATION
  end
end
