---
title: The AWS SSM credential manager
---

## Configuration

The ATC is configured with an access key and secret key or session token and the AWS region that your parameters are
stored within. If no access key, secret key, or session token is provided, Concourse will attempt to use environment
variables or the instance credentials assigned to the instance.

The ATC's configuration specifies the following:

**`aws-ssm-access-key`**: string

: A valid AWS access key.

: Environment variable `CONCOURSE_AWS_SSM_ACCESS_KEY`.

**`aws-ssm-secret-key`**: string

: The secret key that corresponds to the access key defined above.

: Environment variable `CONCOURSE_AWS_SSM_SECRET_KEY`.

**`aws-ssm-session-token`**: string

: A valid AWS session token.

: Environment variable `CONCOURSE_AWS_SSM_SESSION_TOKEN`.

**`aws-ssm-region`**: string

: The AWS region that requests to parameter store will be sent to.

: Environment variable `CONCOURSE_AWS_SSM_REGION`.

**`aws-ssm-pipeline-secret-template`**: string

: The base path used when attempting to locate a pipeline-level secret.

: Environment variable `CONCOURSE_AWS_SSM_PIPELINE_SECRET_TEMPLATE`.

: !!! example

        Default: `/concourse/{{.Team}}/{{.Pipeline}}/{{.Secret}}`

**`aws-ssm-team-secret-template`**: string

: The base path used when attempting to locate a team-level secret.

: Environment variable `CONCOURSE_AWS_SSM_TEAM_SECRET_TEMPLATE`.

: !!! example

        Default: `/concourse/{{.Team}}/{{.Secret}}`

For example, to launch the ATC and enable the parameter store, you may configure:

```shell
concourse web ... \
  --aws-ssm-region us-east-1 \
  --aws-ssm-access-key AKIAIOSFODNN7EXAMPLE \
  --aws-ssm-secret-key wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# or use env variables
CONCOURSE_AWS_SSM_REGION="us-east-1" \
CONCOURSE_AWS_SSM_ACCESS_KEY="AKIAIOSFODNN7EXAMPLE" \
CONCOURSE_AWS_SSM_SECRET_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" \
concourse web ...
```

A more secure method is to configure
an [IAM role](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html) for your EC2 ATC
instance so that credentials are fetched automatically from the EC2 metadata service.

## IAM Permissions

The following is an example of an IAM policy that can be used to grant permissions to an IAM user or instance role. Note
that the `Resource` section can contain a wildcard to a parameter or be restricted to an individual parameter.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAccessToSsmParameters",
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:GetParametersByPath"
      ],
      "Resource": [
        "arn:aws:ssm:::parameter/concourse/*",
        "arn:aws:ssm:::parameter/concourse/TEAM_NAME/*",
        "arn:aws:ssm:::parameter/concourse/TEAM_NAME/PIPELINE_NAME/*"
      ]
    },
    {
      "Sid": "AllowAccessToDecryptSsmParameters",
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt",
        "kms:DescribeKey"
      ],
      "Resource": "arn:aws:kms:::key/KMS_KEY_ID"
    },
    {
      "Sid": "AllowListKeys",
      "Effect": "Allow",
      "Action": [
        "kms:ListAliases",
        "kms:ListKeys"
      ],
      "Resource": "*"
    }
  ]
}
```

Note that the `TEAM_NAME`, `PIPELINE_NAME`, and `KMS_KEY_ID` text above should be replaced to fit your Concourse setup.

For more information on how to use IAM roles to restrict access to SSM parameters, review
the [official documentation](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-access.html).

## Credential Lookup Rules

When resolving a parameter such as `((foo_param))`, Concourse will look in the following paths, in order:

* `/concourse/TEAM_NAME/PIPELINE_NAME/foo_param`
* `/concourse/TEAM_NAME/foo_param`

The leading `/concourse` can be changed by specifying `--aws-ssm-pipeline-secret-template`
or `--aws-ssm-team-secret-template` variables.