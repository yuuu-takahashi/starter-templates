if ENV["SENTRY_DSN"].present?
  Sentry.init do |config|
    config.dsn = ENV["SENTRY_DSN"]
    config.traces_sample_rate = 1.0
    config.profiles_sample_rate = 1.0
    config.environment = Rails.env
  end
end
