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

module "debatable_website" {
  source = "./modules/debatable_website_core"
  website_name = var.website_name
  token_server_name = var.token_server_name
  instance_type = var.instance_type
  spot_price = var.spot_price
  spot_type = var.spot_type
  volume_size = var.volume_size
  public_key = var.public_key
  r53_zone_name = var.website_name
}

module "helpers_route53_domain_name_servers" {
  source  = "ScottG489/helpers/aws//modules/route53_domain_name_servers"
  version = "0.0.4"
  route53_zone_name = module.debatable_website.r53_zone_name
  route53_zone_name_servers = module.debatable_website.r53_zone_name_servers
}
