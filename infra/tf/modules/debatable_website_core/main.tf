module "helpers_spot_instance_ssh" {
  source = "ScottG489/helpers/aws//modules/spot_instance_ssh"
  version = "0.0.4"
  name = var.token_server_name
  instance_type = var.instance_type
  spot_type = var.spot_type
  spot_price = var.spot_price
  volume_size = var.volume_size
  public_key = var.public_key
}

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

resource "aws_route53_record" "r53_record_A_api" {
  zone_id = aws_route53_zone.r53_zone.id
  name = "api"
  records = [
    module.helpers_spot_instance_ssh.public_ip
  ]
  ttl = 300
  type = "A"
}
