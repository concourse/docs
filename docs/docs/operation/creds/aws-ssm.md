---
title: The AWS Systems Manager credential manager
---

Concourse can be configured to pull credentials
from [AWS Systems Manager]([https://aws.amazon.com/secrets-manager/](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)).

## Configuration

To enable this credential manager, configure the following environment variables on the [
`web` node](../../install/running-web.md):

```properties
CONCOURSE_AWS_SSM_REGION=us-east-1
CONCOURSE_AWS_SSM_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
CONCOURSE_AWS_SSM_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

### Session Token Configuration

AWS Systems Manager can also be configured to use a Session Token for short lived credentials by using the following
environment variables:

```properties
CONCOURSE_AWS_SSM_REGION=us-east-1
CONCOURSE_AWS_SSM_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
CONCOURSE_AWS_SSM_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
CONCOURSE_AWS_SSM_SESSION_TOKEN=AQoDYXdzEJr...<remainder of session token>
```

### Instance Profile Configuration

AWS Systems Manager can also be configured to use an
[IAM role](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html) assigned on the [
`web` node](../../install/running-web.md). When using an IAM Role, credentials are fetched automatically from the EC2
metadata service and only the region needs to be configured:

```properties
CONCOURSE_AWS_SSM_REGION=us-east-1
```

### IAM Permissions

The following is an example of an IAM policy that can be used to grant permissions to an IAM user or instance role.

!!! note

    The `Resource` section can contain a wildcard to a secret or be restricted to an individual secret.

=== "JSON"

    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "AllowListKeys",

          "Effect": "Allow",

          "Action": [
            "kms:ListAliases",
            "kms:ListKeys"
          ],

          "Resource": "*"
        },
        {
          "Sid": "AllowAccessToSsmParameters",

          "Effect": "Allow",

          "Action": [
            "ssm:GetParameter",
            "ssm:GetParametersByPath"
          ],

          "Resource": [
            "arn:aws:ssm:::parameter/concourse/*",
          ]
        },
        {
          "Sid": "AllowAccessToDecryptSsmParameters",

          "Effect": "Allow",

          "Action": [
            "kms:Decrypt",
            "kms:DescribeKey"
          ],

          "Resource": [
            "arn:aws:kms:::key/KMS_KEY_ID"
          ]
        },
      ]
    }
    ```

=== "Terraform / OpenTofu"

    ```hcl
    variable "kms_key_id" {
      type    = string
    }
    
    data "aws_iam_policy_document" "params_lookup" {
      statement {
        sid = "AllowListKeys"
    
        effect = "Allow"
    
        actions = [
          "kms:ListAliases",
          "kms:ListKeys"
        ]
    
        resources = [
          "*",
        ]
      }
    
      statement {
        sid = "AllowAccessToSsmParameters"
    
        effect = "Allow"
    
        actions = [
          "ssm:GetParameter",
          "ssm:GetParametersByPath"
        ]
    
        resources = [
          "arn:aws:ssm:::parameter/concourse/*",
        ]
      }
    
      statement {
        sid = "AllowAccessToDecryptSsmParameters"
    
        effect = "Allow"
    
        actions = [
          "kms:Decrypt",
          "kms:DescribeKey"
        ]
    
        resources = [
          "arn:aws:kms:::key/${var.kms_key_id}",
        ]
      }
    }
    ```

If you wish to restrict Concourse to only have access to parameters for a specific pipeline, you can replace
`"arn:aws:ssm:::parameter/concourse/*"` in the example above with:

=== "JSON"

    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "AllowListKeys",

          "Effect": "Allow",

          "Action": [
            "kms:ListAliases",
            "kms:ListKeys"
          ],

          "Resource": "*"
        },
        {
          "Sid": "AllowAccessToSsmParameters",

          "Effect": "Allow",

          "Action": [
            "ssm:GetParameter",
            "ssm:GetParametersByPath"
          ],

          "Resource": [
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

          "Resource": [
            "arn:aws:kms:::key/KMS_KEY_ID"
          ]
        },
      ]
    }
    ```

=== "Terraform / OpenTofu"

    ```hcl
    variable "team_name" {
      type    = string
      default = "my_team"
    }
    
    variable "pipeline_name" {
      type    = string
      default = "my_pipeline"
    }
    
    variable "kms_key_id" {
      type    = string
    }
    
    data "aws_iam_policy_document" "params_lookup" {
      statement {
        sid = "AllowListKeys"
    
        effect = "Allow"
    
        actions = [
          "kms:ListAliases",
          "kms:ListKeys"
        ]
    
        resources = [
          "*",
        ]
      }
    
      statement {
        sid = "AllowAccessToSsmParameters"
    
        effect = "Allow"
    
        actions = [
          "ssm:GetParameter",
          "ssm:GetParametersByPath"
        ]
    
        resources = [
          "arn:aws:ssm:::parameter/concourse/${var.team_name}/*",
          "arn:aws:ssm:::parameter/concourse/${var.team_name}/${var.pipeline_name}/*",
        ]
      }
    
      statement {
        sid = "AllowAccessToDecryptSsmParameters"
    
        effect = "Allow"
    
        actions = [
          "kms:Decrypt",
          "kms:DescribeKey"
        ]
    
        resources = [
          "arn:aws:kms:::key/${var.kms_key_id}",
        ]
      }
    }
    ```

where `TEAM_NAME`, `PIPELINE_NAME`, and `KMS_KEY_ID` are replaced with the team, pipeline, and key id in question.

For more information on how to use IAM roles to restrict access to SSM parameters, review
the [official documentation](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-access.html).

## Credential Lookup Rules

When resolving a parameter such as `((foo_param))`, it will look in the following paths, in order:

* `/concourse/TEAM_NAME/PIPELINE_NAME/foo_param`
* `/concourse/TEAM_NAME/foo_param`

If the action is being run in the context of a pipeline (e.g. a `check` or a step in a build of a job), the ATC will
first look in the pipeline path. If it's not found there, it will look in the team path. This allows credentials to be
scoped widely if they're common across many pipelines.

When executing a one-off task, there is no pipeline: so in this case, only the team path `/concourse/TEAM_NAME/foo` is
searched.

There are several ways to customize the lookup logic:

1. Add a "shared path", for secrets common to all teams.
2. Change the team- and pipeline-dependent path templates.

Each of these can be controlled by Concourse command line flags, or environment variables.

### Configuring a shared path

A "shared path" can also be configured for credentials that you would like to share across all teams and pipelines,
foregoing the default team/pipeline namespacing. Use with care!

```properties
CONCOURSE_AWS_SSM_SHARED_PATH=some-shared-path
```

This path must exist under the configured path prefix. The above configuration would correspond to
`/concourse/some-shared-path` with the default `/concourse` prefix.

### Changing the path templates

You can choose your own list of templates, which will expand to team- or pipeline-specific paths. By default, the
templates used are:

```properties
CONCOURSE_AWS_SSM_TEAM_SECRET_TEMPLATE=/concourse/{{.Team}}/{{.Secret}}
CONCOURSE_AWS_SSM_PIPELINE_SECRET_TEMPLATE=/concourse/{{.Team}}/{{.Pipeline}}/{{.Secret}}

```

When secrets are to be looked up, these are evaluated where `{{.Team}}` expands to the current team, `{{.Pipeline}}` to
the current pipeline (if any), and `{{.Secret}}` to the name of the secret. So if the settings are:

```properties
CONCOURSE_AWS_SSM_TEAM_SECRET_TEMPLATE=/{{.Team}}/concourse/{{.Secret}}
CONCOURSE_AWS_SSM_PIPELINE_SECRET_TEMPLATE=/{{.Team}}/concourse/{{.Pipeline}}/{{.Secret}}
CONCOURSE_AWS_SSM_SHARED_PATH=/common/{{.Secret}}
```

and `((password))` is used in team `myteam` and pipeline `mypipeline`, Concourse will look for the following, in order:

1. `/myteam/concourse/mypipeline/password`
2. `/myteam/concourse/password`
3. `/common/password`
