provider "aws" {
  region = "us-west-2"
}

resource "aws_instance" "server_instance" {
  ami           = "ami-09dd2e08d601bff67"
  instance_type = "t2.nano"
  vpc_security_group_ids = [aws_security_group.server_sg.id]
  key_name = aws_key_pair.server_key.key_name

  root_block_device {
    volume_type           = "gp2"
    volume_size           = 8
  }

  tags = {
    Name = "${var.instance_tag_name}_${random_uuid.rand.result}"
  }
}

resource "aws_security_group" "server_sg" {
  name = "${var.sg_name}_${random_uuid.rand.result}"
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "server_key" {
  key_name   = "${var.key_pair_name}_${random_uuid.rand.result}"
  public_key = var.public_key
}

resource "aws_s3_bucket" "website_bucket" {
  bucket = "${var.website_bucket_name}-${random_uuid.rand.result}"
  acl    = "public-read"
  policy = templatefile("policy.json.tmpl", { bucket_name: "${var.website_bucket_name}-${random_uuid.rand.result}" })
  force_destroy = true

  website {
    index_document = "index.html"
  }
}

resource "aws_s3_bucket" "www_website_bucket" {
  bucket = "${var.www_website_bucket_name}-${random_uuid.rand.result}"

  website {
    redirect_all_requests_to = aws_s3_bucket.website_bucket.bucket
  }
}

resource "random_uuid" "rand" { }