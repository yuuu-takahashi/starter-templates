FROM node:22

WORKDIR /workspace

RUN apt-get update -qq && apt-get install --no-install-recommends -y curl openssh-client

COPY ../package.json ../yarn.lock ./

RUN yarn install

COPY . .
