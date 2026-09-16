---
title: IDToken - Azure
---

Azure
supports [federation with external identity providers](https://learn.microsoft.com/en-us/graph/api/resources/federatedidentitycredentials-overview?view=graph-rest-1.0)
through a feature called Federated Credentials. Using this, you can allow identities managed by an external identity
provider to perform actions in your Azure subscription.

In this scenario the external identity provider is Concourse and the identities are teams/pipelines/jobs. This means you
are able to grant a specific pipeline or job permission to perform actions in Azure (like deploying something), all
without managing service principal secrets or dealing with long-lived credentials.

## Create App Registration

First,
[create an EntraID App Registration](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)
along with the service principal that represents it. This app registration and its service principal are what your
pipeline will act as once it exchanges a Concourse-issued JWT for an Azure token.

```hcl linenums="1"
--8<-- "examples/credentials/assets/idtoken-azure-source.tf::31"
```

## Create Federated Credential

Next,
[create a federated credential](https://learn.microsoft.com/en-us/entra/workload-id/workload-identity-federation-create-trust?pivots=identity-wif-apps-methods-azp#other-identity-providers)
for the app registration you just created.

1. Set `issuer` to the external URL of your Concourse server (or the `--oidc-issuer-url` if you're using a separate OIDC
   issuer -
   see [Configuring a Separate OIDC Issuer](../../docs/operation/creds/id-token.md#configuring-a-separate-oidc-issuer)).
2. Set `subject` to `main/deploy-to-azure`. If you use the `subject_scope` setting to change the contents of your
   sub-claim, change this value here accordingly.
3. For `audiences`, you can choose any string you like, but using a value like `api://AzureADTokenExchange` is
   recommended.

!!! note

    You have to use the same string later in the configuration of your [`idtoken` var source](../../docs/vars.md#id-token).

```hcl linenums="33"
--8<-- "examples/credentials/assets/idtoken-azure-source.tf:33:43"
```

!!! info

    This will allow ONLY that specific pipeline (and any instanced versions of it) to obtain a token for this
    identity using a JWT.

## Assign Role Permissions

Now, assign the identity of the app registration an RBAC role that defines what it's allowed to do in your Azure
subscription.

```hcl linenums="45"
--8<-- "examples/credentials/assets/idtoken-azure-source.tf:45:"
```

## Use within the Pipeline

Your pipeline can now use the `az` CLI to log in to Azure using a JWT issued by Concourse, via
[
`az login`'s federated-token support](https://learn.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az-login):

```yaml linenums="1"
var_sources:
  - name: azuretoken
    type: idtoken
    config:
      audience: [ "api://AzureADTokenExchange" ]

jobs:
  - name: azure-deploy
    plan:
      - task: login
        config:
          platform: linux
          image_resource:
            type: registry-image
            source: { repository: mcr.microsoft.com/azure-cli }
          run:
            path: bash
            args:
              - -e
              - -c
              - |
                az login --service-principal \
                  -u <client_id of your app registration> \
                  --tenant <tenant_id of your app registration> \
                  --federated-token ((azuretoken:token))
                echo "You are now authenticated with Azure. Do something with it!"
```