output "token_server_public_ip" {
  value = module.helpers_spot_instance_ssh.public_ip
}

output "r53_zone_name" {
  value = aws_route53_zone.r53_zone.name
}

output "r53_zone_name_servers" {
  value = aws_route53_zone.r53_zone.name_servers
}
