class UsersController < Sinatra::Base
  before do
    content_type :json
  end

  def self.index(_app, _params = {})
    users = User.all
    users.map(&:attributes).to_json
  end

  def self.show(_app, params = {})
    user = User.find(params[:id])
    user.attributes.to_json
  end
end
