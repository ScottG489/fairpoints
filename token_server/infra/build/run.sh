#!/bin/bash
set -e

ID_RSA_CONTENTS=$(echo -n $1 | jq -r .ID_RSA | base64 --decode)
MAINKEYPAIR_CONTENTS=$(echo -n $1 | jq -r .MAIN_KEY_PAIR | base64 --decode)
AWS_CREDENTIALS_CONTENTS=$(echo -n $1 | jq -r .AWS_CREDENTIALS | base64 --decode)
DOCKER_CONFIG_CONTENTS=$(echo -n $1 | jq -r .DOCKER_CONFIG | base64 --decode)

TWILIO_ACCOUNT_SID=$(echo -n $1 | jq -r .TWILIO_ACCOUNT_SID | base64 --decode)
TWILIO_API_KEY=$(echo -n $1 | jq -r .TWILIO_API_KEY | base64 --decode)
TWILIO_API_SECRET=$(echo -n $1 | jq -r .TWILIO_API_SECRET | base64 --decode)
TWILIO_CHAT_SERVICE_SID=$(echo -n $1 | jq -r .TWILIO_CHAT_SERVICE_SID | base64 --decode)

printf -- "$ID_RSA_CONTENTS" > /root/.ssh/id_rsa
printf -- "$MAINKEYPAIR_CONTENTS" > /root/.ssh/mainkeypair.pem
printf -- "$AWS_CREDENTIALS_CONTENTS" > /root/.aws/credentials
printf -- "$DOCKER_CONFIG_CONTENTS" > /root/.docker/config.json

chmod 400 /root/.ssh/id_rsa
chmod 400 /root/.ssh/mainkeypair.pem

set -x

GIT_REPO='git@github.com:ScottG489/debatable.git'
PROJECT_NAME='debatable'
DOCKER_IMAGE_NAME='scottg489/debatable-token-server:latest'
TFSTATE_BACKEND_BUCKET_NAME='tfstate-debatable-token-server'

git clone $GIT_REPO
cd $PROJECT_NAME
ROOT_DIR="$(git rev-parse --show-toplevel)/token_server"
cd $ROOT_DIR

npm install
pkg -t node10-linux-x64 token_server/index.js

docker build -t $DOCKER_IMAGE_NAME .
docker push $DOCKER_IMAGE_NAME

/opt/build/run-test.sh

# Initialize terraform backend on first deploy
cd "$ROOT_DIR/infra/tf/backend-init"
aws s3 ls $TFSTATE_BACKEND_BUCKET_NAME && \
  (terraform init && \
  terraform import aws_s3_bucket.backend_bucket $TFSTATE_BACKEND_BUCKET_NAME)
terraform init
terraform plan
terraform apply --auto-approve

cd "$ROOT_DIR/infra/tf"
terraform init
terraform plan
terraform apply --auto-approve
_INVENTORY=$(terraform show --json | jq --raw-output '.values.root_module.resources[] | select(.address == "aws_instance.server_instance") | .values.public_dns')

cd "$ROOT_DIR/infra/ansible"
{
    echo "twilio_account_sid: $TWILIO_ACCOUNT_SID"
    echo "twilio_api_key: $TWILIO_API_KEY"
    echo "twilio_api_secret: $TWILIO_API_SECRET"
    echo "twilio_chat_service_sid: $TWILIO_CHAT_SERVICE_SID"
} >> vars.yml
ansible-playbook -v -u ubuntu -e ansible_ssh_private_key_file=/root/.ssh/mainkeypair.pem --inventory $_INVENTORY, master-playbook.yml
