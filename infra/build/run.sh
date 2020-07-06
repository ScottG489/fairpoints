#!/bin/bash
set -e

ID_RSA_CONTENTS=$(echo -n $1 | jq -r .ID_RSA | base64 --decode)
AWS_CREDENTIALS_CONTENTS=$(echo -n $1 | jq -r .AWS_CREDENTIALS | base64 --decode)

printf -- "$ID_RSA_CONTENTS" > /root/.ssh/id_rsa
printf -- "$AWS_CREDENTIALS_CONTENTS" > /root/.aws/credentials

chmod 400 /root/.ssh/id_rsa

set -x

_PROJECT_NAME='debatable'
# Used for the domain name but also the s3 bucket (AWS requires them to be the same)
_DOMAIN_NAME='debate-table.com'
_TERRAFORM_STATE_BUCKET_NAME='tfstate-debatable'

git clone git@github.com:ScottG489/"$_PROJECT_NAME".git
cd $_PROJECT_NAME
npm install
CI=true npm run test
npm run build

# Initialize terraform backend on first deploy
cd "$(git rev-parse --show-toplevel)/infra/tf/backend-init"
aws s3 ls $_TERRAFORM_STATE_BUCKET_NAME && \
  (terraform init && \
  terraform import aws_s3_bucket.backend_bucket $_TERRAFORM_STATE_BUCKET_NAME)
terraform init
terraform plan
terraform apply --auto-approve

cd "$(git rev-parse --show-toplevel)/infra/tf"
terraform init
terraform plan
terraform apply --auto-approve

# Terraform can't manage domains. This gets the nameservers off the hosted zone and sets them as the nameservers for the domain
_NS1=$(terraform show --json | jq --raw-output '.values.root_module.resources[] | select(.address == "aws_route53_zone.website_r53_zone") | .values.name_servers[0]')
_NS2=$(terraform show --json | jq --raw-output '.values.root_module.resources[] | select(.address == "aws_route53_zone.website_r53_zone") | .values.name_servers[1]')
_NS3=$(terraform show --json | jq --raw-output '.values.root_module.resources[] | select(.address == "aws_route53_zone.website_r53_zone") | .values.name_servers[2]')
_NS4=$(terraform show --json | jq --raw-output '.values.root_module.resources[] | select(.address == "aws_route53_zone.website_r53_zone") | .values.name_servers[3]')
aws --region us-east-1 route53domains update-domain-nameservers --domain-name $_DOMAIN_NAME --nameservers Name="$_NS1" Name="$_NS2" Name="$_NS3" Name="$_NS4"

cd "$(git rev-parse --show-toplevel)"
aws s3 sync build/ s3://$_DOMAIN_NAME

# Acceptance testing. Currently running against prod but once we have multiple environments this will point elsewhere
# TODO: Uncomment this once we have some cypress tests
#npx cypress run
