output "bucket" {
  value = var.website_name
}

output "website_endpoint" {
  value = module.helpers_s3_website.website_endpoint
}

output "r53_zone_name" {
  value = aws_route53_zone.r53_zone.name
}

output "r53_zone_name_servers" {
  value = aws_route53_zone.r53_zone.name_servers
}
