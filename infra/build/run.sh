#!/bin/bash
set -ex

source /opt/build/build_functions.sh

set +x
setup_credentials "$1"
set -x

# These are prefixed with an _ because they have global scope and the build_function lib may have overlap
declare -r _PROJECT_NAME='debatable'
declare -r _GIT_REPO='git@github.com:ScottG489/debatable.git'
# Used for the domain name but also the s3 bucket (AWS requires them to be the same)
declare -r _DOMAIN_NAME='debate-table.com'
declare -r _TFSTATE_BUCKET_NAME='tfstate-debatable'

git clone $_GIT_REPO
cd $_PROJECT_NAME

build_application

/opt/build/run-test.sh

tf_backend_init $_TFSTATE_BUCKET_NAME

tf_apply "infra/tf"

ui_deploy $_DOMAIN_NAME

# Acceptance testing. Currently running against prod but once we have multiple environments this will point elsewhere
# TODO: Uncomment this once we have some cypress tests
#npx cypress run
