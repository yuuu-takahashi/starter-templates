module StructuredLogging
  extend ActiveSupport::Concern

  included do
    before_action :set_request_context
    after_action :log_request_info
  end

  private

  def set_request_context
    request_id = request.headers["X-Request-ID"] || SecureRandom.uuid
    Rails.logger.tagged(request_id) do
      request.env["REQUEST_ID"] = request_id
    end
  end

  def log_request_info
    Rails.logger.info(
      action: "#{controller_name}##{action_name}",
      method: request.method,
      path: request.path,
      status: response.status,
      duration_ms: ((Time.current - request.env["REQUEST_START"]) * 1000).round(2)
    )
  end
end
