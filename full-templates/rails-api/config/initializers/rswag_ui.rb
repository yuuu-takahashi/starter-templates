Rswag::Ui.configure do |c|
  c.openapi_endpoint "/api-docs/swagger.json", title: "API V1"
  c.config_object = {
    deepLinking: true,
  }
end
