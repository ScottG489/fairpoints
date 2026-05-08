provider "aws" {
  region = "us-west-2"
}

module "fairpoints_website" {
  source = "../modules/fairpoints_website_core"
  website_name = random_id.name.hex
  r53_zone_name = random_id.name.hex
}

resource "random_id" "name" {
  byte_length = 4
  prefix = "${var.name_prefix}-"
}
