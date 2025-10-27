---
title: The AWS Secrets Manager credential manager
---

## Configuration

In order to integrate with AWS Secrets Manager for credential management, the web node must be configured with:

* an access key and secret key, or a session token
* the AWS region that your parameters are stored within.

If no access key, secret key, or session token is provided, Concourse will attempt to use environment variables or the
instance credentials assigned to the instance.

The web node's configuration specifies the following:

**`aws-secretsmanager-access-key`**: string

: A valid AWS access key.

: Environment variable `CONCOURSE_AWS_SECRETSMANAGER_ACCESS_KEY`.

**`aws-secretsmanager-secret-key`**: string

: The secret key that corresponds to the access key defined above.

: Environment variable `CONCOURSE_AWS_SECRETSMANAGER_SECRET_KEY`.

**`aws-secretsmanager-session-token`**: string

: A valid AWS session token.

: Environment variable `CONCOURSE_AWS_SECRETSMANAGER_SESSION_TOKEN`.

**`aws-secretsmanager-region`**: string

: The AWS region that requests to Secrets Manager will be sent to.

: Environment variable `CONCOURSE_AWS_SECRETSMANAGER_REGION`.

**`aws-secretsmanager-pipeline-secret-template`**: string

: The base path used when attempting to locate a pipeline-level secret.

: Environment variable `CONCOURSE_AWS_SECRETSMANAGER_PIPELINE_SECRET_TEMPLATE`.

: !!! example

        Default: `/concourse/{{.Team}}/{{.Pipeline}}/{{.Secret}}`

**`aws-secretsmanager-team-secret-template`**: string

: The base path used when attempting to locate a team-level secret.

: Environment variable `CONCOURSE_AWS_SECRETSMANAGER_TEAM_SECRET_TEMPLATE`.

: !!! example

        Default: `/concourse/{{.Team}}/{{.Secret}}`

For example, to launch the ATC and enable Secrets Manager, you may configure:

```shell
concourse web ... \
  --aws-secretsmanager-region us-east-1 \
  --aws-secretsmanager-access-key AKIAIOSFODNN7EXAMPLE \
  --aws-secretsmanager-secret-key wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# or use env variables
CONCOURSE_AWS_SECRETSMANAGER_REGION="us-east-1" \
CONCOURSE_AWS_SECRETSMANAGER_ACCESS_KEY="AKIAIOSFODNN7EXAMPLE" \
CONCOURSE_AWS_SECRETSMANAGER_SECRET_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" \
concourse web ...
```

A more secure method is to configure
an [IAM role](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html) for your EC2 ATC
instance so that credentials are fetched automatically from the EC2 metadata service.

## Saving credentials in AWS

It seems to be best to use the 'other type of secret' option and the 'plaintext' entry (otherwise your secrets will be
interpolated as JSON) for best results. Make sure your secret locations match the lookup templates exactly; include the
leading `/`, for example.

## IAM Permissions

The following is an example of an IAM policy that can be used to grant permissions to an IAM user or instance role. Note
that the `Resource` section can contain a wildcard to a secret or be restricted to an individual secret. In order for
the health check to work properly (see [Scaling](#scaling)), Concourse needs to have access to
the `__concourse-health-check` secret.

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

If you wish to restrict concourse to only have access to secrets for a specific pipeline, you can
replace `"arn:aws:secretsmanager:*:*:secret:/concourse/*"` in the example above with:

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

where `TEAM_NAME` and `PIPELINE_NAME` are replaced with the team and name of the pipeline in question.

For more information on how to use IAM roles to restrict access to Secrets Manager, review
the [official documentation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html).

## Credential Lookup Rules

When resolving a parameter such as `((foo_param))`, Concourse will look in the following paths, in order:

* `/concourse/TEAM_NAME/PIPELINE_NAME/foo_param`
* `/concourse/TEAM_NAME/foo_param`

The leading `/concourse` can be changed by specifying `--aws-secretsmanager-pipeline-secret-template`
or `--aws-secretsmanager-team-secret-template` variables.

!!! note

    If Concourse does not have [permission](#iam-permissions) to access the pipeline-scoped paths, then credential 
    lookups will fail even for credentials which are stored at the team level.

## Scaling

If your cluster has a large workload, in particular if there are many resources, Concourse can generate a lot of traffic
to AWS and subsequently get rate-limited.

As long as Concourse has permission to get the value of the `__concourse-health-check` secret, you should be able to
measure an error rate by polling the `/api/v1/info/creds` endpoint when authenticated as
a [Concourse Admin](../../auth-and-teams/user-roles.md#concourse-admin).

Depending on your workflow for updating secrets and your reliability requirements it may be
worth [Caching credentials](caching.md) and/or [Retrying failed fetches](retrying-failed.md) to mitigate
rate-limit-related errors.