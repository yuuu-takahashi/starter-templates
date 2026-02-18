class TopController < Sinatra::Base
  def self.index(app, _params = {})
    app.erb :top
  end
end
