RSpec.describe 'UserAPI' do
  path '/api/v1/users' do
    get 'Get all users' do
      tags 'Users'
      produces 'application/json'

      response '200', 'users found' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :integer },
              name: { type: :string },
              email: { type: :string }
            }
          }

        run_test!
      end
    end
  end
end
