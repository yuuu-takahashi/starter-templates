# frozen_string_literal: true

class TextComponent < ViewComponent::Base
  def initialize(text:)
    super()
    @text = text
  end
end
