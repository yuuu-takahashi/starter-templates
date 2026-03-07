ROUTES = {
  get: {
    '/' => [TopController, :index],
    '/users' => [UsersController, :index],
    '/users/:id' => [UsersController, :show]
  }
}.freeze

ROUTES.each do |http_method, paths|
  paths.each do |path, (controller, action)|
    send(http_method, path) do
      controller.send(action, self, params)
    end
  end
end
