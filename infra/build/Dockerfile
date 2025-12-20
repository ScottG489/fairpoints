FROM ubuntu:24.04@sha256:c35e29c9450151419d9448b0fd75374fec4fff364a27f176fb458d472dfc9e54

RUN apt-get update && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y \
  ca-certificates=20240203 \
  git=1:2.43.0-1ubuntu7 \
  openssh-client=1:9.6p1-3ubuntu13 \
  jq=1.7.1-3ubuntu0.24.04.1 \
  curl=8.5.0-2ubuntu10.6 \
  unzip=6.0-28ubuntu4 \
  # Required for Cypress
  libgtk-3-0t64=3.24.41-4ubuntu1 \
  libgbm-dev=25.0.7-0ubuntu0.24.04.2 \
  libnotify-dev=0.8.3-1build2 \
  libnss3=2:3.98-1build1 \
  libxss1=1:1.2.3-1build3 \
  libasound2t64=1.2.11-1ubuntu0.1 \
  libxtst6=2:1.2.3-1.1build1 \
  xauth=1:1.1.2-1build1 \
  xvfb=2:21.1.12-1ubuntu1 \
   && apt-get clean \
   && rm -rf /var/lib/apt/lists/*

ARG TERRAFORM_VERSION=1.14.3
RUN curl https://releases.hashicorp.com/terraform/$TERRAFORM_VERSION/terraform_${TERRAFORM_VERSION}_linux_amd64.zip -o /tmp/terraform.zip && \
  unzip -d /usr/local/bin /tmp/terraform.zip && \
  rm /tmp/terraform.zip

ARG AWSCLI_VERSION=2.32.21
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-$AWSCLI_VERSION.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install && \
  rm -rf aws awscliv2.zip

ENV HOME=/root

ARG NVM_VERSION=0.40.3
ARG NODE_VERSION=24.12.0
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
