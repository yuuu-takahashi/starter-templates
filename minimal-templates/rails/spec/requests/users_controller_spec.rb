# frozen_string_literal: true

RSpec.describe UsersController, type: :request do
  describe 'GET /users' do
    it 'works! (now write some real specs)' do
      get users_path
      expect(response).to have_http_status(200)
    end

    it 'includes all users in the response' do
      user1 = create(:user)
      user2 = create(:user)
      get users_path
      # HTML エスケープされた名前で比較（例: O'Keefe → O&#39;Keefe）
      expect(response.body).to include(ERB::Util.html_escape(user1.name), ERB::Util.html_escape(user2.name))
    end
  end
end
