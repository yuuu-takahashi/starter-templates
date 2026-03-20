require "rails_helper"

RSpec.configure do |config|
  config.openapi_root = Rails.root.join("swagger").to_s

  config.openapi_specs = {
    "v1/swagger.json" => {
      openapi: "3.0.3",
      info: {
        title: "Rails API",
        version: "v1",
      },
      servers: [
        {
          url: "http://localhost:3000",
          variables: {
            basePath: {
              default: "/api/v1",
            },
          },
        },
      ],
      components: {
        securitySchemes: {
          bearer_auth: {
            type: :http,
            scheme: :bearer,
            description: "Bearer token authentication",
          },
        },
      },
      paths: {},
    },
  }

  config.openapi_format = :json
end
