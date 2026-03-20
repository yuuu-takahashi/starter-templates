require "swagger_helper"

describe "Health", type: :request do
  path "/api/v1/health" do
    get "Health check" do
      tags "Health"
      produces "application/json"

      response "200", "successful" do
        schema type: :object,
               properties: {
                 status: { type: :string },
                 timestamp: { type: :string, format: "date-time" },
               },
               required: ["status", "timestamp"]

        run_test!
      end
    end
  end
end
