RSpec.describe TextComponent, type: :component do
  it 'renders something useful' do
    expect(
      render_inline(described_class.new(text: 'Hello, components!')).to_html
    ).to include('Hello, components!')
  end
end
