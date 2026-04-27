#!/usr/bin/env bash

readonly GIT_BRANCH="${GITHUB_HEAD_REF:-${GITHUB_REF#refs/heads/}}"
readonly DOCKER_IMAGE_TAG=$([ "$GIT_BRANCH" = "master" ] && echo "latest" || echo "$GIT_BRANCH" | sed 's/\//-/g')
readonly IMAGE_NAME="scottg489/debatable-build:$DOCKER_IMAGE_TAG"
readonly RUN_TASK=$1
readonly ID_RSA=$2
readonly AWS_CREDENTIALS=$3

read -r -d '' JSON_BODY <<- EOM
  {
  "RUN_TASK": "$RUN_TASK",
  "GIT_BRANCH": "$GIT_BRANCH",
  "ID_RSA": "$ID_RSA",
  "AWS_CREDENTIALS": "$AWS_CREDENTIALS"
  }
EOM

curl -v -sS -w '\n%{http_code}' \
  --data-binary "$JSON_BODY" \
  "https://api.conjob.io/job/run?image=$IMAGE_NAME&remove=true&remove_image=true" \
  | tee /tmp/foo \
  | sed '$d' && \
  [ "$(tail -1 /tmp/foo)" -eq 200 ]
