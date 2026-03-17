FROM ubuntu:24.04@sha256:d1e2e92c075e5ca139d51a140fff46f84315c0fdce203eab2807c7e495eff4f9

RUN apt-get update && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y \
  ca-certificates=20240203 \
  git=1:2.43.0-1ubuntu7.3 \
  openssh-client=1:9.6p1-3ubuntu13.15 \
  jq=1.7.1-3ubuntu0.24.04.1 \
  curl=8.5.0-2ubuntu10.8 \
  unzip=6.0-28ubuntu4.1 \
  # Required for Cypress
  libgtk-3-0t64=3.24.41-4ubuntu1.3 \
  libgbm-dev=25.2.8-0ubuntu0.24.04.1 \
  libnotify-dev=0.8.3-1build2 \
  libnss3=2:3.98-1ubuntu0.1 \
  libxss1=1:1.2.3-1build3 \
  libasound2t64=1.2.11-1ubuntu0.2 \
  libxtst6=2:1.2.3-1.1build1 \
  xauth=1:1.1.2-1build1 \
  xvfb=2:21.1.12-1ubuntu1.5 \
   && apt-get clean \
   && rm -rf /var/lib/apt/lists/*

ARG TERRAFORM_VERSION=1.14.7
RUN curl https://releases.hashicorp.com/terraform/$TERRAFORM_VERSION/terraform_${TERRAFORM_VERSION}_linux_amd64.zip -o /tmp/terraform.zip && \
  unzip -d /usr/local/bin /tmp/terraform.zip && \
  rm /tmp/terraform.zip

ARG AWSCLI_VERSION=2.34.10
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-$AWSCLI_VERSION.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install && \
  rm -rf aws awscliv2.zip

ENV HOME=/root

ARG NVM_VERSION=0.40.4
ARG NODE_VERSION=24.14.0
ENV NODE_VERSION=$NODE_VERSION
ENV NVM_DIR=${HOME}/.nvm

# Install nvm with node and npm
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN curl https://raw.githubusercontent.com/nvm-sh/nvm/v${NVM_VERSION}/install.sh | bash
RUN . $NVM_DIR/nvm.sh \
    && nvm alias default $NODE_VERSION \
    && nvm use default

COPY known_hosts /root/.ssh/known_hosts

RUN mkdir /root/.aws
COPY config /root/.aws/config

RUN mkdir /root/.docker

RUN mkdir -p /opt/build
COPY run.sh /opt/build/run.sh
COPY run-test.sh /opt/build/run-test.sh
COPY build_functions.sh /opt/build/build_functions.sh

WORKDIR /opt/build
ENTRYPOINT ["./run.sh"]
