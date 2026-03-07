module MySQLClient
  def self.with_database
    client = MySQLClient.connect
    yield(client)
  ensure
    client.disconnect
  end

  def self.with_table(table_name)
    with_database do |client|
      yield(client[table_name.to_sym])
    end
  end

  def self.connect_without_database
    connect_to_database
  end

  def self.connect
    connect_to_database(database: ENV.fetch('DATABASE_NAME', nil))
  end

  def connect_to_database(database: nil)
    Sequel.connect(
      adapter: 'mysql2',
      host: ENV.fetch('DATABASE_HOST', nil),
      user: ENV.fetch('DATABASE_USER', nil),
      password: ENV.fetch('DATABASE_PASSWORD', nil),
      database: database
    )
  end

  module_function :connect_to_database
end
