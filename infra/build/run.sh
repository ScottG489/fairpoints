#!/bin/bash
set -ex

source /opt/build/build_functions.sh

set +x
setup_credentials "$1"
set -x

PROJECT_NAME='debatable'
GIT_REPO='git@github.com:ScottG489/debatable.git'
TOKEN_SERVER_DOCKER_IMAGE_NAME='scottg489/debatable-token-server:latest'
# Used for the domain name but also the s3 bucket (AWS requires them to be the same)
DOMAIN_NAME='debate-table.com'
TFSTATE_BUCKET_NAME='tfstate-debatable'

git clone $GIT_REPO
cd $PROJECT_NAME

set +x
setup_token_server_creds "$1"
set -x

build_package_application

build_push_docker_image $TOKEN_SERVER_DOCKER_IMAGE_NAME

/opt/build/run-test.sh

tf_backend_init $TFSTATE_BUCKET_NAME

tf_apply "infra/tf"

setup_nameservers $DOMAIN_NAME

ansible_deploy "infra/tf"

ui_deploy

# Acceptance testing. Currently running against prod but once we have multiple environments this will point elsewhere
# TODO: Uncomment this once we have some cypress tests
#npx cypress run
