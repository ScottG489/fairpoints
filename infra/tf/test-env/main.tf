provider "aws" {
  region = "us-west-2"
}

module "debatable_website_test" {
  source = "../modules/debatable_website_core"
  website_name = random_id.name.hex
  token_server_name = random_id.name.hex
  instance_type = var.instance_type
  spot_price = var.spot_price
  spot_type = var.spot_type
  volume_size = var.volume_size
  public_key = var.public_key
  r53_zone_name = random_id.name.hex
}

resource "random_id" "name" {
  byte_length = 4
  prefix = "${var.name_prefix}-"
}
