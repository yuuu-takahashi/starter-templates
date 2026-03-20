module ApiTokenAuthenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_api_token!, unless: :skip_authentication?
  end

  private

  def authenticate_api_token!
    token = extract_bearer_token
    raise UnauthorizedError, "Missing or invalid API token" unless valid_token?(token)
  end

  def extract_bearer_token
    authorization_header = request.headers["Authorization"]
    return nil unless authorization_header

    authorization_header.gsub(/^Bearer /, "")
  end

  def valid_token?(token)
    return true if skip_authentication?

    token.present? && token == ENV["API_TOKEN"]
  end

  def skip_authentication?
    Rails.env.development? || Rails.env.test?
  end
end
