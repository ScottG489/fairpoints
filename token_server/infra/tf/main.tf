provider "aws" {
  region = "us-west-2"
}

terraform {
  backend "s3" {
    bucket = "tfstate-debatable-token-server"
    key    = "app.tfstate"
    region = "us-west-2"
  }
}

resource "aws_instance" "server_instance" {
  ami           = "ami-09dd2e08d601bff67"
  instance_type = "t2.micro"
  vpc_security_group_ids = [aws_security_group.server_sg.id]
  key_name = aws_key_pair.server_key.key_name

  root_block_device {
    volume_type           = "gp2"
    volume_size           = 30
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

resource "aws_route53_zone" "server_r53_zone" {
    name         = var.server_r53_zone_name
}

resource "aws_route53_record" "server_r53_record_A" {
    zone_id = aws_route53_zone.server_r53_zone.id
    name    = ""
    records = [
        "${aws_instance.server_instance.public_ip}",
    ]
    ttl     = 300
    type    = "A"
}
