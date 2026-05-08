provider "aws" {
  region = "us-west-2"
}

terraform {
  backend "s3" {
    # TODO: Don't want this hardcoded but backends don't allow variables
    bucket = "tfstate-fairpoints"
    key    = "app.tfstate"
    region = "us-west-2"
  }
}

module "fairpoints_website" {
  source        = "./modules/fairpoints_website_core"
  website_name  = var.website_name
  r53_zone_name = var.website_name
}

module "helpers_route53_domain_name_servers" {
  source                    = "ScottG489/helpers/aws//modules/route53_domain_name_servers"
  version                   = "1.5.0"
  route53_zone_name         = module.fairpoints_website.r53_zone_name
  route53_zone_name_servers = module.fairpoints_website.r53_zone_name_servers
}
