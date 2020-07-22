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

# TODO: We don't yet have acceptance tests
#echo "baseUri=http://${_INVENTORY}:80" > "$(git rev-parse --show-toplevel)/src/test/acceptance/resource/config.properties"
#echo "adminBaseUri=http://${_INVENTORY}:8081" >> "$(git rev-parse --show-toplevel)/src/test/acceptance/resource/config.properties"

#cd "$(git rev-parse --show-toplevel)"
# IPv4 flag is required due to docker weirdness: https://github.com/appropriate/docker-curl/issues/5
#curl -sS --ipv4 --retry-connrefused --retry 5 "$_INVENTORY"
#./gradlew --info acceptanceTest
