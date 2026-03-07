RSpec.describe 'top_controller' do
  it '/' do
    get '/'
    expect(last_response).to be_ok
  end

  it 'returns not found' do
    get '/hoge'
    expect(last_response).to be_not_found
  end
end
