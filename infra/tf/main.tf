provider "aws" {
  region = "us-west-2"
}

terraform {
  backend "s3" {
    # TODO: Don't want this hardcoded but backends don't allow variables
    bucket = "tfstate-debatable"
    key    = "app.tfstate"
    region = "us-west-2"
  }
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
    Name = var.server_instance_name
  }
}

resource "aws_security_group" "server_sg" {
  name = var.server_sg_name
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
  key_name   = var.key_name
  public_key = var.public_key
}

resource "aws_s3_bucket" "website_bucket" {
  bucket = var.website_bucket_name
  acl    = "public-read"
  policy = file("policy.json")
  force_destroy = true

  website {
    index_document = "index.html"
  }
}

resource "aws_s3_bucket" "www_website_bucket" {
    bucket                      = var.www_website_bucket_name

    website {
        redirect_all_requests_to = var.website_bucket_name
    }
}

resource "aws_route53_zone" "website_r53_zone" {
    name         = var.r53_zone_name
}

resource "aws_route53_record" "website_r53_record_A_top" {
    zone_id = aws_route53_zone.website_r53_zone.id
    name    = ""
    type    = "A"

    alias {
        zone_id                = aws_s3_bucket.website_bucket.hosted_zone_id
        name                   = "s3-website-us-west-2.amazonaws.com"
        evaluate_target_health = false
    }
}

resource "aws_route53_record" "website_r53_record_A_www" {
    zone_id = aws_route53_zone.website_r53_zone.id
    name    = "www"
    type    = "A"

    alias {
        zone_id                = aws_s3_bucket.www_website_bucket.hosted_zone_id
        name                   = "s3-website-us-west-2.amazonaws.com"
        evaluate_target_health = false
    }
}

resource "aws_route53_record" "server_r53_record_A_api" {
  zone_id = aws_route53_zone.website_r53_zone.id
  name    = "api"
  records = [
    "${aws_instance.server_instance.public_ip}",
  ]
  ttl     = 300
  type    = "A"
}
