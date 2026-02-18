FROM ruby:3.3

WORKDIR /workspace

RUN apt-get update -qq && apt-get install --no-install-recommends -y \
    curl \
    openssh-client \
    default-mysql-client \
    tree \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g yarn

COPY . .
