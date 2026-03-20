FROM ruby:3.3.6-slim as base

RUN apt-get update && apt-get install -y \
  build-essential \
  git \
  curl \
  postgresql-client \
  sqlite3 \
  && rm -rf /var/lib/apt/lists/*

FROM base as builder

WORKDIR /tmp
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install -y nodejs

WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN bundle install --frozen --jobs 4 --retry 3

FROM base

WORKDIR /app

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash - && \
  apt-get install -y nodejs && \
  rm -rf /var/lib/apt/lists/*

# Copy gems from builder
COPY --from=builder /usr/local/bundle /usr/local/bundle
COPY --from=builder /app/Gemfile* ./

# Copy application
COPY . .

EXPOSE 4000
CMD ["bundle", "exec", "puma"]
