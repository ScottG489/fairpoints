#!/bin/bash
set -e

ROOT_DIR="$(git rev-parse --show-toplevel)/token_server"

trap cleanup EXIT
cleanup() {
  cd "$ROOT_DIR/infra/tf/test-env"
  terraform destroy --auto-approve
}

cd "$ROOT_DIR/infra/tf/test-env"

terraform init
terraform plan
terraform apply --auto-approve

_INVENTORY=$(terraform show --json | jq --raw-output '.values.root_module.resources[] | select(.address == "aws_instance.server_instance") | .values.public_dns')

cd "$ROOT_DIR/infra/ansible"
ansible-playbook -vvv -u ubuntu -e ansible_ssh_private_key_file=/root/.ssh/mainkeypair.pem --inventory $_INVENTORY, master-playbook.yml

# TODO: We don't yet have acceptance tests for the token server
#echo "baseUri=http://${_INVENTORY}:80" > "$(git rev-parse --show-toplevel)/src/test/acceptance/resource/config.properties"
#echo "adminBaseUri=http://${_INVENTORY}:8081" >> "$(git rev-parse --show-toplevel)/src/test/acceptance/resource/config.properties"

#cd "$(git rev-parse --show-toplevel)"
# IPv4 flag is required due to docker weirdness: https://github.com/appropriate/docker-curl/issues/5
#curl -sS --ipv4 --retry-connrefused --retry 5 "$_INVENTORY"
#./gradlew --info acceptanceTest
