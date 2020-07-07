curl -v -sS -w '%{http_code}' \
  --data-binary '{"ID_RSA": "'"$1"'", "AWS_CREDENTIALS": "'"$2"'"}' \
  '{"ID_RSA": "'"$1"'", "DOCKER_CONFIG": "'"$2"'", "AWS_CREDENTIALS": "'"$3"'", "MAIN_KEY_PAIR": "'"$4"'", "TWILIO_ACCOUNT_SI": "'"$4"'", "TWILIO_API_KEY": "'"$4"'", "TWILIO_API_SECRET": "'"$4"'", "TWILIO_CHAT_SERVICE_SID": "'"$4"'"}' \
  'http://simple-ci.com/build?image=scottg489/debatable-token-server-build:latest' \
  | tee /tmp/foo \
  | sed '$d' && \
  [ "$(tail -1 /tmp/foo)" -eq 200 ]
