class BaseModel
  READONKY_COLUMNS = %i[created_at id updated_at].freeze

  attr_reader :attributes

  def initialize(params = {})
    @attributes = {}
    # TODO: 1回だけ読み取る
    define_columns
    assign_attributes(params)
  end

  def save
    MySQLClient.with_table(self.class.table_name) do |table|
      if id.nil?
        @attributes[:id] = table.insert(@attributes)
      else
        table.where(id: id).update(@attributes)
      end
      record = table.where(id: id).first
      instance_variable_set(:@attributes, record)
      true
    end
  end

  def self.create(params)
    user = new(params)
    user.save
    user
  end

  def update(params)
    assign_attributes(params)
    save
    self
  end

  def self.find(id)
    MySQLClient.with_table(table_name) do |table|
      record = table.where(id: id).first
      raise Sinatra::NotFound, "#{name} not found" unless record

      instantiate_from_record(record)
    end
  end

  def self.all
    Enumerator.new do |yielder|
      MySQLClient.with_table(table_name) do |table|
        table.each do |record|
          yielder << instantiate_from_record(record)
        end
      end
    end
  end

  def delete
    MySQLClient.with_table(self.class.table_name) do |table|
      table.where(id: id).delete.positive?
    end
  end

  def self.table_name
    "#{name.downcase}s"
  end

  def self.instantiate_from_record(record)
    instance = allocate
    instance.instance_variable_set(:@attributes, record)
    instance
  end

  private

  def define_columns
    MySQLClient.with_database do |client|
      client.schema(self.class.table_name).each do |col|
        column = col[0]
        define_getter(column)
        define_setter(column)
      end
    end
  end

  def define_getter(column)
    self.class.send(:define_method, column) { @attributes[column] }
  end

  def define_setter(column)
    return if READONKY_COLUMNS.include?(column)

    self.class.send(:define_method, "#{column}=") { |value| @attributes[column] = value }
  end

  def assign_attributes(params)
    params.each do |key, value|
      send("#{key}=", value) if respond_to?("#{key}=")
    end
  end
end
