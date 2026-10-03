terraform {
  required_providers {
    tls = {
      source  = "hashicorp/tls"
      version = "4.2.1"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "6.36.0"
    }
  }
}

variable "aws_concourse_url" {
  description = "Concourse URL"
  type        = string

  default = "https://ci.concourse-ci.org"
}

data "tls_certificate" "root_certificate" {
  url = var.aws_concourse_url
}

resource "aws_iam_openid_connect_provider" "oidc_provider" {
  url = var.aws_concourse_url

  client_id_list = [
    "sts.amazonaws.com"
  ]

  thumbprint_list = [
    data.tls_certificate.root_certificate.certificates[0].sha1_fingerprint
  ]
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    sid     = "ConcourseOIDCWebIdentity"
    effect  = "Allow"
    actions = [
      "sts:AssumeRoleWithWebIdentity"
    ]

    principals {
      type        = "Federated"
      identifiers = [
        aws_iam_openid_connect_provider.oidc_provider.arn
      ]
    }

    condition {
      test     = "StringEquals"
      variable = "${aws_iam_openid_connect_provider.oidc_provider.arn}:aud"
      values   = [
        "sts.amazonaws.com"
      ]
    }

    condition {
      test     = "StringEquals"
      variable = "${aws_iam_openid_connect_provider.oidc_provider.arn}:sub"
      values   = [
        "main/deploy-to-aws"
      ]
    }
  }
}

resource "aws_iam_role" "role" {
  name               = "s3_manager"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

data "aws_iam_policy_document" "manage_s3" {
  statement {
    sid    = "ManageS3"
    effect = "Allow"

    actions = [
      "s3:*"
    ]

    resources = [
      "*"
    ]
  }
}

resource "aws_iam_policy" "assumed_policy" {
  name   = "s3_manager_policy"
  policy = data.aws_iam_policy_document.manage_s3.json
}

resource "aws_iam_role_policy_attachment" "role_policy_attachment" {
  role       = aws_iam_role.role.name
  policy_arn = aws_iam_policy.assumed_policy.arn
}

