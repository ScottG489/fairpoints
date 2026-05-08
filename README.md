# fair points
![CI](https://github.com/ScottG489/debatable/workflows/CI/badge.svg)

Pick a stance on a topic and be matched up with someone with a differing viewpoint

## Development
Here is an example of developing the build in conjunction with the application locally.
Make sure you change the file locations of the desired secrets to your actual location.

```bash
ID_RSA_CONTENTS_BASE64=$(base64 ~/.ssh/id_rsa | tr -d '\n') ;
AWS_CREDENTIALS_CONTENTS_BASE64=$(base64 ~/.aws/credentials | tr -d '\n') ;
docker build infra/build -t app-test
docker run -it --volume "$PWD:/opt/build/debatable" app-test '{"ID_RSA": "'"$ID_RSA_CONTENTS_BASE64"'", "AWS_CREDENTIALS": "'"$AWS_CREDENTIALS_CONTENTS_BASE64"'"}'
```

1. Initialize the secrets as envars (these will be passed in as the arguments to the container)
2. Build the image locally
3. Run the image with the path to your local repository mounted where the code would normally be cloned to

Note that you'll need to comment out the `git clone` in the build otherwise it will fail since you've mounted a directory there
You'll also want to comment out the prod deploy steps (everything after `run-test.sh` is run)
