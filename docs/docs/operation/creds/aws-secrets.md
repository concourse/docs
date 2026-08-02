---
title: The AWS Secrets Manager credential manager
---

Concourse can be configured to pull credentials from [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/).

## Configuration

To enable this credential manager, configure the following environment variables on the [
`web` node](../../install/running-web.md):

```properties
CONCOURSE_AWS_SECRETSMANAGER_REGION=us-east-1
CONCOURSE_AWS_SECRETSMANAGER_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
CONCOURSE_AWS_SECRETSMANAGER_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

### Session Token Configuration

AWS Secrets Manager can also be configured to use a Session Token for short lived credentials by using the following
environment variables:

```properties
CONCOURSE_AWS_SECRETSMANAGER_REGION=us-east-1
CONCOURSE_AWS_SECRETSMANAGER_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
CONCOURSE_AWS_SECRETSMANAGER_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
CONCOURSE_AWS_SECRETSMANAGER_SESSION_TOKEN=AQoDYXdzEJr...<remainder of session token>
```

### Instance Profile Configuration

AWS Secrets Manager can also be configured to use an
[IAM role](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html) assigned on the [
`web` node](../../install/running-web.md). When using an IAM Role, credentials are fetched automatically from the EC2
metadata service and only the region needs to be configured:

```properties
CONCOURSE_AWS_SECRETSMANAGER_REGION=us-east-1
```

### IAM Permissions

The following is an example of an IAM policy that can be used to grant permissions to an IAM user or instance role.

!!! note

    The `Resource` section can contain a wildcard to a secret or be restricted to an individual secret. 

In order for the health check to work properly (see [Scaling](#scaling)), Concourse needs to have access to the
`__concourse-health-check` secret.

=== "JSON"

    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "AllowAccessToSecretManagerParameters",

          "Effect": "Allow",

          "Action": [
            "secretsmanager:ListSecrets"
          ],

          "Resource": "*"
        },
        {
          "Sid": "AllowAccessGetSecret",

          "Effect": "Allow",

          "Action": [
            "secretsmanager:GetSecretValue",
            "secretsmanager:DescribeSecret"
          ],

          "Resource": [
            "arn:aws:secretsmanager:*:*:secret:/concourse/*",
            "arn:aws:secretsmanager:*:*:secret:__concourse-health-check-??????"
          ]
        }
      ]
    }
    ```

=== "Terraform / OpenTofu"

    ```hcl
    data "aws_iam_policy_document" "secrets_lookup" {
      statement {
        sid = "AllowAccessToSecretManagerParameters"
    
        effect = "Allow"
        
        actions = [
          "secretsmanager:ListSecrets"
        ]
    
        resources = [
          "*",
        ]
      }
      
      statement {
        sid = "AllowAccessGetSecret"
    
        effect = "Allow"
        
        actions = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
    
        resources = [
          "arn:aws:secretsmanager:*:*:secret:/concourse/*",
          "arn:aws:secretsmanager:*:*:secret:__concourse-health-check-??????"
        ]
      }
    }
    ```

If you wish to restrict concourse to only have access to secrets for a specific pipeline, you can replace
`"arn:aws:secretsmanager:*:*:secret:/concourse/*"` in the example above with:

=== "JSON"

    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "AllowAccessToSecretManagerParameters",
          
          "Effect": "Allow",
          
          "Action": [
            "secretsmanager:ListSecrets"
          ],
          
          "Resource": "*"
        },
        {
          "Sid": "AllowAccessGetSecret",
          
          "Effect": "Allow",
          
          "Action": [
            "secretsmanager:GetSecretValue",
            "secretsmanager:DescribeSecret"
          ],
          
          "Resource": [
            "arn:aws:secretsmanager:*:*:secret:/concourse/TEAM_NAME/*",
            "arn:aws:secretsmanager:*:*:secret:/concourse/TEAM_NAME/PIPELINE_NAME/*",
            "arn:aws:secretsmanager:*:*:secret:__concourse-health-check-??????"
          ]
        }
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
    
    data "aws_iam_policy_document" "secrets_lookup" {
      statement {
        sid = "AllowAccessToSecretManagerParameters"
    
        effect = "Allow"
    
        actions = [
          "secretsmanager:ListSecrets"
        ]
    
        resources = [
          "*",
        ]
      }
    
      statement {
        sid = "AllowAccessGetSecret"
    
        effect = "Allow"
    
        actions = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
    
        resources = [
          "arn:aws:secretsmanager:*:*:secret:/concourse/${var.team_name}/*",
          "arn:aws:secretsmanager:*:*:secret:/concourse/${var.team_name}/${var.pipeline_name}/*",
          "arn:aws:secretsmanager:*:*:secret:__concourse-health-check-??????"
        ]
      }
    }
    ```

where `TEAM_NAME` and `PIPELINE_NAME` are replaced with the team and name of the pipeline in question.

For more information on how to use IAM roles to restrict access to Secrets Manager, review
the [official documentation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html).

### Scaling

If your cluster has a large workload, in particular if there are many resources, Concourse can generate a lot of traffic
to AWS and subsequently get rate-limited.

As long as Concourse has permission to get the value of the `__concourse-health-check` secret, you should be able to
measure an error rate by polling the `/api/v1/info/creds` endpoint when authenticated as
a [Concourse Admin](../../auth-and-teams/user-roles.md#concourse-admin).

Depending on your workflow for updating secrets and your reliability requirements it may be
worth [Caching credentials](caching.md) and/or [Retrying failed fetches](retrying-failed.md) to mitigate
rate-limit-related errors.

## Credential Lookup Rules

When resolving a parameter such as `((foo_param))`, it will look in the following paths, in order:

* `/concourse/TEAM_NAME/PIPELINE_NAME/foo_param`
* `/concourse/TEAM_NAME/foo_param`

CredHub credentials actually have different types, which may contain multiple values. For example, the `user` type
specifies both `username` and `password.` You can specify the field to grab via `.` syntax, e.g.
`((foo_param.username))`.

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
CONCOURSE_AWS_SECRETSMANAGER_SHARED_SECRET_TEMPLATE=some-shared-path
```

This path must exist under the configured path prefix. The above configuration would correspond to
`/concourse/some-shared-path` with the default `/concourse` prefix.

### Changing the path templates

You can choose your own list of templates, which will expand to team- or pipeline-specific paths. By default, the
templates used are:

```properties
CONCOURSE_AWS_SECRETSMANAGER_TEAM_SECRET_TEMPLATE=/concourse/{{.Team}}/{{.Secret}}
CONCOURSE_AWS_SECRETSMANAGER_PIPELINE_SECRET_TEMPLATE=/concourse/{{.Team}}/{{.Pipeline}}/{{.Secret}}

```

When secrets are to be looked up, these are evaluated where `{{.Team}}` expands to the current team, `{{.Pipeline}}` to
the current pipeline (if any), and `{{.Secret}}` to the name of the secret. So if the settings are:

```properties
CONCOURSE_AWS_SECRETSMANAGER_TEAM_SECRET_TEMPLATE=/{{.Team}}/concourse/{{.Secret}}
CONCOURSE_AWS_SECRETSMANAGER_PIPELINE_SECRET_TEMPLATE=/{{.Team}}/concourse/{{.Pipeline}}/{{.Secret}}
CONCOURSE_AWS_SECRETSMANAGER_SHARED_SECRET_TEMPLATE=/common/{{.Secret}}
```

and `((password))` is used in team `myteam` and pipeline `mypipeline`, Concourse will look for the following, in order:

1. `/myteam/concourse/mypipeline/password`
2. `/myteam/concourse/password`
3. `/common/password`

## Saving credentials in AWS

It seems to be best to use the 'other type of secret' option and the 'plaintext' entry (otherwise your secrets will be
interpolated as JSON) for best results. Make sure your secret locations match the lookup templates exactly; include the
leading `/`, for example.