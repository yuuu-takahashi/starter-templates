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
      request.env["REQUEST_START"] = Time.current
    end
  end

  def log_request_info
    start_time = request.env["REQUEST_START"]
    duration_ms = start_time ? ((Time.current - start_time) * 1000).round(2) : nil

    Rails.logger.info(
      action: "#{controller_name}##{action_name}",
      method: request.method,
      path: request.path,
      status: response.status,
      duration_ms: duration_ms
    )
  end
end
