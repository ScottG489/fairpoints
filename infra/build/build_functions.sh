#!/bin/bash
set -e

get_git_root_dir() {
  echo -n "$(git rev-parse --show-toplevel)"
}

setup_credentials() {
  set +x
  ID_RSA_CONTENTS=$(echo -n $1 | jq -r .ID_RSA | base64 --decode)
  MAINKEYPAIR_CONTENTS=$(echo -n $1 | jq -r .MAIN_KEY_PAIR | base64 --decode)
  AWS_CREDENTIALS_CONTENTS=$(echo -n $1 | jq -r .AWS_CREDENTIALS | base64 --decode)
  DOCKER_CONFIG_CONTENTS=$(echo -n $1 | jq -r .DOCKER_CONFIG | base64 --decode)

  printf -- "$ID_RSA_CONTENTS" >/root/.ssh/id_rsa
  printf -- "$MAINKEYPAIR_CONTENTS" >/root/.ssh/mainkeypair.pem
  printf -- "$AWS_CREDENTIALS_CONTENTS" >/root/.aws/credentials
  printf -- "$DOCKER_CONFIG_CONTENTS" >/root/.docker/config.json

  chmod 400 /root/.ssh/id_rsa
  chmod 400 /root/.ssh/mainkeypair.pem
}

setup_token_server_creds() {
  set +x
  ROOT_DIR=$(get_git_root_dir)

  TWILIO_ACCOUNT_SID=$(echo -n $1 | jq -r .TWILIO_ACCOUNT_SID | base64 --decode)
  TWILIO_API_KEY=$(echo -n $1 | jq -r .TWILIO_API_KEY | base64 --decode)
  TWILIO_API_SECRET=$(echo -n $1 | jq -r .TWILIO_API_SECRET | base64 --decode)
  TWILIO_CHAT_SERVICE_SID=$(echo -n $1 | jq -r .TWILIO_CHAT_SERVICE_SID | base64 --decode)

  {
    echo "twilio_account_sid: $TWILIO_ACCOUNT_SID"
    echo "twilio_api_key: $TWILIO_API_KEY"
    echo "twilio_api_secret: $TWILIO_API_SECRET"
    echo "twilio_chat_service_sid: $TWILIO_CHAT_SERVICE_SID"
  } >> "$ROOT_DIR/infra/ansible/vars.yml"
}

build_package_application() {
  ROOT_DIR=$(get_git_root_dir)
  cd "$ROOT_DIR"

  npm install

  # Build and package front-end
  CI=true npm run test
  npm run build

  # Package token server
  pkg --output token_server/index --targets node10-linux-x64 token_server/index.js
}

build_push_docker_image() {
  ROOT_DIR=$(get_git_root_dir)
  DOCKER_IMAGE_NAME=$1

  docker build -t "$DOCKER_IMAGE_NAME" $ROOT_DIR/token_server
  docker push "$DOCKER_IMAGE_NAME"
}

tf_backend_init() {
  TFSTATE_BACKEND_BUCKET_NAME=$1
  ROOT_DIR=$(get_git_root_dir)

  cd "$ROOT_DIR/infra/tf/backend-init"

  # Initialize terraform backend on first deploy
  aws s3 ls "$TFSTATE_BACKEND_BUCKET_NAME" &&
    (terraform init &&
      terraform import aws_s3_bucket.backend_bucket "$TFSTATE_BACKEND_BUCKET_NAME")
  terraform init
  terraform plan
  terraform apply --auto-approve
}

tf_apply() {
  RELATIVE_PATH_TO_TF_DIR=$1
  ROOT_DIR=$(get_git_root_dir)

  cd "$ROOT_DIR/$RELATIVE_PATH_TO_TF_DIR"

  terraform init
  terraform plan
  terraform apply --auto-approve
}

setup_nameservers() {
  DOMAIN_NAME=$1
  ROOT_DIR=$(get_git_root_dir)

  cd "$ROOT_DIR/infra/tf"

  # Terraform can't manage domains. This gets the nameservers off the hosted zone and sets them as the nameservers for the domain
  _NS1=$(terraform show --json | jq --raw-output '.values.root_module.resources[] | select(.address == "aws_route53_zone.website_r53_zone") | .values.name_servers[0]')
  _NS2=$(terraform show --json | jq --raw-output '.values.root_module.resources[] | select(.address == "aws_route53_zone.website_r53_zone") | .values.name_servers[1]')
  _NS3=$(terraform show --json | jq --raw-output '.values.root_module.resources[] | select(.address == "aws_route53_zone.website_r53_zone") | .values.name_servers[2]')
  _NS4=$(terraform show --json | jq --raw-output '.values.root_module.resources[] | select(.address == "aws_route53_zone.website_r53_zone") | .values.name_servers[3]')
  aws --region us-east-1 route53domains update-domain-nameservers --domain-name "$DOMAIN_NAME" --nameservers Name="$_NS1" Name="$_NS2" Name="$_NS3" Name="$_NS4"
}

ansible_deploy() {
  RELATIVE_PATH_TO_TF_DIR=$1
  ROOT_DIR=$(get_git_root_dir)

  cd "$ROOT_DIR/$RELATIVE_PATH_TO_TF_DIR"

  _INVENTORY=$(terraform show --json | jq --raw-output '.values.root_module.resources[] | select(.address == "aws_instance.server_instance") | .values.public_dns')

  cd "$ROOT_DIR/infra/ansible"
  ansible-playbook -v -u ubuntu -e ansible_ssh_private_key_file=/root/.ssh/mainkeypair.pem --inventory $_INVENTORY, master-playbook.yml
}

ui_deploy() {
  ROOT_DIR=$(get_git_root_dir)
  cd "$ROOT_DIR"

  aws s3 sync build/ s3://$DOMAIN_NAME
}
