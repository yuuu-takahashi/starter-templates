# Node 用ベース Dockerfile (context = テンプレートルート).
# generate-devcontainer が各 Node テンプレートの .devcontainer/Dockerfile にコピーする。

FROM node:22

WORKDIR /workspace

RUN apt-get update -qq && apt-get install --no-install-recommends -y curl openssh-client tree

COPY package.json yarn.lock ./

RUN yarn install

COPY . .
