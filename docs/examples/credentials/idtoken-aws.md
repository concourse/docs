---
title: IDToken - AWS
---


AWS
supports [federation with external identity providers](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers.html).
Using this, you can allow identities managed by an external identity provider to perform actions in your AWS account.

In this scenario the external identity provider is Concourse and the identities are teams/pipelines/jobs. This means you
are able to grant a specific pipeline or job permission to perform actions in AWS (like deploying something), all
without managing IAM users or dealing with long-lived credentials.

## Create OIDC Provider

First you need
to [create an OpenID Connect identity provider](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)
in your AWS Account:

1. Set `url` to the external URL of your Concourse server (or the `--oidc-issuer-url` if you're using a separate OIDC
   issuer -
   see [Configuring a Separate OIDC Issuer](../../docs/operation/creds/id-token.md#configuring-a-separate-oidc-issuer)).
2. For `client_id_list`, you can choose any string you like, but using a value like `sts.amazonaws.com` is recommended.

!!! note

    You have to use the same string later in the configuration of your [`idtoken` var source](../../docs/vars.md#id-token).

```hcl linenums="1"
--8<-- "examples/credentials/assets/idtoken-aws-source.tf::35"
```

## Allow Role Assumption

Next you will need
to [create an IAM-Role that can be assumed using your JWT](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html#idp_oidc_Create).

1. Create a policy document that has allows for the Provider to call `sts:AssumeRoleWithWebIdentity`
2. Add a condition on the sub-claim with type `StringEquals` and value `main/deploy-to-aws`
3. Add a condition on the audience with type `StringEquals` and value `sts.amazonaws.com`

!!! info

    This will allow ONLY that specific pipeline (and any instanced versions of it) to assume that IAM Role using a JWT.

```hcl linenums="36"
--8<-- "examples/credentials/assets/idtoken-aws-source.tf:37:73"
```

## Allow for an Action

Now, assign the assumed role a policy that the Pipeline can use.

```hcl linenums="73"
--8<-- "examples/credentials/assets/idtoken-aws-source.tf:74:"
```

## Use within the Pipeline

Now you can use
the [AWS AssumeRoleWithWebIdentity API operation](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithWebIdentity.html)
to assume your role via a JWT issued by Concourse.

The easiest way is to do this is via
the [assume-role-with-web-identity AWS CLI command](https://docs.aws.amazon.com/cli/latest/reference/sts/assume-role-with-web-identity.html):

```yaml linenums="1"
var_sources:
  - name: awstoken
    type: idtoken
    config:
      audience:
        - "sts.amazonaws.com"

jobs:
  - name: aws-login
    plan:
      - task: print
        config:
          platform: linux
          image_resource:
            type: registry-image
            source:
              repository: amazon/aws-cli
          run:
            path: bash
            args:
              - -e
              - -c
              - |
                aws sts assume-role-with-web-identity \
                  --role-session-name Concourse \
                  --role-arn arn:aws:iam::<your_account>:role/s3_manager \
                  --web-identity-token ((awstoken:token)) > creds.json
                echo "Now do something with the temporary credentials in creds.json"
```