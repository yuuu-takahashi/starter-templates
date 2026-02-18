RSpec.describe 'users_controller' do
  it 'users' do
    create_list(:user, 3)
    get '/users'
    expect(last_response).to be_ok
    expect(JSON.parse(last_response.body).size).to eq(3)
  end

  it 'user' do
    user = create(:user)
    get "/users/#{user.id}"
    expect(last_response).to be_ok
  end

  it 'user not found' do
    get '/users/99999'
    expect(last_response).to be_not_found
  end
end
