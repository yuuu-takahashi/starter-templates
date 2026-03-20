class ApplicationError < StandardError
  attr_reader :status, :code

  def initialize(message = nil, status: 500, code: "internal_error")
    super(message)
    @status = status
    @code = code
  end
end

class NotFoundError < ApplicationError
  def initialize(message = "Resource not found")
    super(message, status: 404, code: "not_found")
  end
end

class UnauthorizedError < ApplicationError
  def initialize(message = "Unauthorized")
    super(message, status: 401, code: "unauthorized")
  end
end

class ForbiddenError < ApplicationError
  def initialize(message = "Forbidden")
    super(message, status: 403, code: "forbidden")
  end
end

class ValidationError < ApplicationError
  def initialize(message = "Validation failed", errors: {})
    super(message, status: 422, code: "validation_error")
    @errors = errors
  end

  attr_reader :errors
end

class BadRequestError < ApplicationError
  def initialize(message = "Bad request")
    super(message, status: 400, code: "bad_request")
  end
end
