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

module "helpers_spot_instance_ssh" {
  source = "ScottG489/helpers/aws//modules/spot_instance_ssh"
  version = "0.0.3"
  name = var.name
  instance_type = var.instance_type
  spot_type = var.spot_type
  spot_price = var.spot_price
  volume_size = var.volume_size
  public_key = var.public_key
}

module "helpers_s3_website" {
  source  = "ScottG489/helpers/aws//modules/s3_website"
  version = "0.0.3"
  name = var.name
}

resource "aws_route53_zone" "r53_zone" {
    name         = var.r53_zone_name
}
module "helpers_s3_website_route53_records" {
  source  = "ScottG489/helpers/aws//modules/s3_website_route53_records"
  version = "0.0.3"
  route53_zone_id = aws_route53_zone.r53_zone.id
  s3_website_hosted_zone_id = module.helpers_s3_website.website_hosted_zone_id
}

module "helpers_api_route53_records" {
  source  = "ScottG489/helpers/aws//modules/api_route53_records"
  version = "0.0.3"
  # insert the 2 required variables here
  route53_zone_id = aws_route53_zone.r53_zone.id
  public_ip = module.helpers_spot_instance_ssh.public_ip
}
