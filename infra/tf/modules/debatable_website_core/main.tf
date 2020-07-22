module "helpers_s3_website" {
  source = "ScottG489/helpers/aws//modules/s3_website"
  version = "0.0.4"
  name = var.website_name
}

resource "aws_route53_zone" "r53_zone" {
  name = var.website_name
}

module "helpers_s3_website_route53_records" {
  source = "ScottG489/helpers/aws//modules/s3_website_route53_records"
  version = "0.0.4"
  route53_zone_id = aws_route53_zone.r53_zone.id
  s3_website_hosted_zone_id = module.helpers_s3_website.website_hosted_zone_id
}
