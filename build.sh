curl -v -sS -w '%{http_code}' \
  --data-binary '{"ID_RSA": "'"$1"'", "DOCKER_CONFIG": "'"$2"'", "AWS_CREDENTIALS": "'"$3"'", "MAIN_KEY_PAIR": "'"$4"'", "TWILIO_ACCOUNT_SID": "'"$5"'", "TWILIO_API_KEY": "'"$6"'", "TWILIO_API_SECRET": "'"$7"'", "TWILIO_CHAT_SERVICE_SID": "'"$8"'"}' \
  'http://simple-ci.com/build?image=scottg489/debatable-build:latest' \
  | tee /tmp/foo \
  | sed '$d' && \
  [ "$(tail -1 /tmp/foo)" -eq 200 ]
