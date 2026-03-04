FROM golang:1.22-bookworm

WORKDIR /workspace

RUN apt-get update -qq && apt-get install --no-install-recommends -y curl openssh-client tree
