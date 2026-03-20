module Api
  class BaseController < ActionController::API
    include ApiTokenAuthenticatable
    include ApiErrorHandler
    include StructuredLogging
  end
end
