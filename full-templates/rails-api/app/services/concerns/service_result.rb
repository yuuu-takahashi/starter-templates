module ServiceResult
  Result = Struct.new(:success?, :data, :error, :errors, keyword_init: true) do
    def failure?
      !success?
    end
  end

  def self.success(data = nil)
    Result.new(success?: true, data: data, error: nil, errors: {})
  end

  def self.failure(error, errors = {})
    Result.new(success?: false, data: nil, error: error, errors: errors)
  end
end
