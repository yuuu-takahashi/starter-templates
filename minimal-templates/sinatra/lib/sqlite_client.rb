module SQLiteClient
  def self.with_database
    client = SQLiteClient.connect
    yield(client)
  ensure
    client.disconnect
  end

  def self.with_table(table_name)
    with_database do |client|
      yield(client[table_name.to_sym])
    end
  end

  def self.connect
    connect_to_database(database: ENV.fetch('DATABASE_NAME', 'db/development.db'))
  end

  def connect_to_database(database: nil)
    Sequel.connect(
      adapter: 'sqlite',
      database: database
    )
  end

  module_function :connect_to_database
end
