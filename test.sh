#!/bin/bash
set -ex

declare ID_RSA_CONTENTS_BASE64
declare AWS_CREDENTIALS_CONTENTS_BASE64
# Change the location of these files based on where they are on your system
ID_RSA_CONTENTS_BASE64=$(base64 ~/.ssh/id_rsa | tr -d '\n') ;
AWS_CREDENTIALS_CONTENTS_BASE64=$(base64 ~/.aws/credentials | tr -d '\n') ;

[[ -n $ID_RSA_CONTENTS_BASE64 ]]
[[ -n $AWS_CREDENTIALS_CONTENTS_BASE64 ]]

read -r -d '\' JSON_BODY <<- EOM
  {
  "RUN_TASK": "test",
  "ID_RSA": "$ID_RSA_CONTENTS_BASE64",
  "AWS_CREDENTIALS": "$AWS_CREDENTIALS_CONTENTS_BASE64"
  }\\
EOM

# The local fs is mounted into the container and as such any files it writes will have their permissions changed.
#   This will change the permissions back and clean up other files we don't want hanging around.
sudo chown -R "$(whoami)":"$(whoami)" . || true
find . -name '*terraform.tfstate*' -exec rm {} \; || true
find . -name '.terraform' -type d -prune -exec rm -rf {} \; || true

LOCAL_IMAGE_TAG="fairpoints-build-test-$(uuidgen | cut -c -8)"
docker build infra/build -t $LOCAL_IMAGE_TAG && \
docker run -it \
  --volume "$PWD:/opt/build/fairpoints" \
  $LOCAL_IMAGE_TAG "$JSON_BODY"
