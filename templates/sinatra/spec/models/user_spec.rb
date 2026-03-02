RSpec.describe User do
  include FactoryBot::Syntax::Methods

  describe 'Attributes' do
    let(:user) { User.new(name: 'John Doe', email: 'john.doe@example.com') }

    it 'responds to attributes' do
      %i[name email id created_at updated_at].each do |attribute|
        expect(user).to respond_to(attribute)
      end

      %i[name= email=].each do |attribute|
        expect(user).to respond_to(attribute)
      end

      %i[id= created_at= updated_at=].each do |attribute|
        expect(user).not_to respond_to(attribute)
      end
    end

    it 'assigns attributes correctly' do
      user = User.new(name: 'Jane Doe', email: 'jane.doe@example.com')
      expect(user.name).to eq('Jane Doe')
      expect(user.email).to eq('jane.doe@example.com')
    end
  end

  describe 'Database operations' do
    let(:user) { create(:user, name: 'John Doe', email: 'hoge@example.com') }

    it 'creates and assigns attributes' do
      expect(user.id).not_to be_nil
      expect(user.created_at).not_to be_nil
      expect(user.updated_at).not_to be_nil
      expect(user.email).to eq('hoge@example.com')
      expect(user.name).to eq('John Doe')
    end

    it 'updates attributes' do
      user.update(name: 'new_name')

      expect(user.id).not_to be_nil
      expect(user.created_at).not_to be_nil
      expect(user.updated_at).not_to be_nil
      expect(user.email).to eq('hoge@example.com')
      expect(user.name).to eq('new_name')
    end

    it 'finds user by ID' do
      expect(User.find(user.id).id).to eq(user.id)
    end

    describe 'returns all users' do
      before do
        create_list(:user, 3)
      end

      it 'does not access the database when initializing the enumerator' do
        expect(MySQLClient).not_to receive(:with_table)

        enumerator = User.all
        expect(enumerator).to be_an(Enumerator)
      end

      it 'accesses the database only when the enumerator is executed' do
        allow(MySQLClient).to receive(:with_table).and_call_original

        enumerator = User.all

        expect(MySQLClient).not_to have_received(:with_table)

        enumerator.each { |_| }
        expect(MySQLClient).to have_received(:with_table).once
      end
    end

    it 'returns correct table name' do
      expect(User.table_name).to eq('users')
    end

    it 'raises error when finding deleted user' do
      user.delete
      expect { User.find(user.id) }.to raise_error(Sinatra::NotFound)
    end
  end
end
