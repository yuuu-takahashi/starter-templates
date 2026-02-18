FactoryBot.define do
  factory :user do
    name { Faker::Name.name }
    email { Faker::Internet.email }
  end

  initialize_with { new(attributes.stringify_keys) }
end
