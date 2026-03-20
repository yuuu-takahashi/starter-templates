module ApiErrorHandler
  extend ActiveSupport::Concern

  included do
    rescue_from ApplicationError, with: :handle_application_error
    rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found
    rescue_from ActionController::ParameterMissing, with: :handle_parameter_missing
    rescue_from StandardError, with: :handle_internal_error
  end

  private

  def handle_application_error(error)
    render_error(
      error.code,
      error.message,
      status: error.status,
      errors: error.is_a?(ValidationError) ? error.errors : {}
    )
  end

  def handle_not_found(error)
    render_error("not_found", "Resource not found", status: :not_found)
  end

  def handle_parameter_missing(error)
    render_error("bad_request", error.message, status: :bad_request)
  end

  def handle_internal_error(error)
    Sentry.capture_exception(error) if defined?(Sentry)
    render_error("internal_error", "Internal server error", status: :internal_server_error)
  end

  def render_error(code, message, status: 500, errors: {})
    render json: {
      error: {
        code: code,
        message: message,
        errors: errors
      }
    }, status: status
  end
end
