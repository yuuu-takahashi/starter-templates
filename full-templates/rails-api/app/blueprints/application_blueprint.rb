class ApplicationBlueprint < Blueprinter::Base
  # Base blueprint for all API serializers
  # Usage: object blueprint in controller or service
  #
  # class UserBlueprint < ApplicationBlueprint
  #   fields :id, :email, :created_at
  # end
end
