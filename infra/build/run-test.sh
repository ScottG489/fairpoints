#!/bin/bash
set -ex

source /opt/build/build_functions.sh

ROOT_DIR="$(git rev-parse --show-toplevel)"

trap cleanup EXIT
cleanup() {
  cd "$ROOT_DIR/infra/tf/test-env"
  terraform destroy --auto-approve
}

tf_apply "infra/tf/test-env"

ui_deploy "infra/tf/test-env"

run_tests "infra/tf/test-env"
