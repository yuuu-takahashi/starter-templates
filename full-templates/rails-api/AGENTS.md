# AI Agent Instructions

This is a production-ready Rails API template. When working with AI agents:

## Code Quality

- Follow Rails conventions (rails-omakase rubocop config)
- Use service layer for business logic
- Write request specs for API endpoints
- Use FactoryBot for test fixtures
- Coverage target: >80% (SimpleCov configured)

## Architecture

- Controllers: lightweight, route HTTP requests to services
- Services: implement business logic with `ApplicationService.call()` pattern
- Serialization: use Blueprinter for JSON responses
- Errors: rescue via `ApiErrorHandler` concern with structured logging

## Testing

- RSpec with ShouldaMatcher support
- Request specs for all API endpoints
- Transactional fixtures for speed
- Test helpers in `spec/support/`

## Security

- Bearer token auth via `ApiTokenAuthenticatable` concern
- CORS configured in `config/initializers/cors.rb`
- Brakeman for security scanning
- Bundle audit for dependency vulnerabilities

## Observability

- Sentry integration (if DSN provided)
- Structured logging with request tagging
- SimpleCov code coverage reports
- Sidekiq for background jobs

## Deployment

- Kamal for container orchestration
- Redis for caching and Sidekiq
- SQLite for development/test (upgrade to PostgreSQL for production)
