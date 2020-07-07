FROM ubuntu:20.04

RUN apt-get update && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y \
  git \
  npm \
  awscli \
  docker.io \
  jq \
  ansible \
  curl \
  unzip

RUN curl https://releases.hashicorp.com/terraform/0.12.26/terraform_0.12.26_linux_amd64.zip -o /tmp/terraform.zip && \
  unzip -d /usr/local/bin /tmp/terraform.zip && \
  rm /tmp/terraform.zip

# Necessary due to "Error: write after end" bug. Remove once this has been fixed (seems to be issue with npm)
RUN npm install -g npm
RUN npm install -g pkg

RUN mkdir /root/.ssh
COPY known_hosts /root/.ssh/known_hosts

RUN mkdir /root/.aws
COPY config /root/.aws/config

RUN mkdir /root/.docker

RUN mkdir -p /opt/build
COPY run.sh /opt/build/run.sh
COPY run-test.sh /opt/build/run-test.sh

WORKDIR /opt/build
ENTRYPOINT ["./run.sh"]
