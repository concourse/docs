---
title: IDToken - GCP
---

GCP supports [workload identity federation](https://cloud.google.com/iam/docs/workload-identity-federation) with
external identity providers. Using this, you can allow identities managed by an external identity provider to
impersonate a service account in your GCP project.

In this scenario the external identity provider is Concourse and the identities are teams/pipelines/jobs. This means you
are able to grant a specific pipeline or job permission to perform actions in GCP (like deploying something), all
without managing service account keys or dealing with long-lived credentials.

## Create Workload Identity Pool and Provider

First, [create a workload identity pool and provider](https://cloud.google.com/iam/docs/workload-identity-federation-with-other-providers#configure)
for your GCP project.

1. Set the provider's `issuer_uri` to the external URL of your Concourse server (or the `--oidc-issuer-url` if you're
   using a separate OIDC issuer -
   see [Configuring a Separate OIDC Issuer](../../docs/operation/creds/id-token.md#configuring-a-separate-oidc-issuer)).
2. Map `google.subject` to `assertion.sub` so the pipeline's identity carries through to the impersonation check below.
3. For `allowed_audiences`, the full workload identity provider resource name is recommended, as shown below.

!!! note

    You have to use the same audience string later in the configuration of your [`idtoken` var source](../../docs/vars.md#id-token).

```hcl linenums="1"
--8<-- "examples/credentials/assets/idtoken-gcp-source.tf::47"
```

## Bind a Service Account

Next, create the service account your pipeline will impersonate, and
[bind it to the workload identity pool](https://cloud.google.com/iam/docs/workload-identity-federation-with-other-providers#allow-impersonation)
with a condition on the sub-claim.

```hcl linenums="49"
--8<-- "examples/credentials/assets/idtoken-gcp-source.tf:49:58"
```

!!! info

    This will allow ONLY that specific pipeline (and any instanced versions of it) to impersonate this service
    account using a JWT.

## Allow for an Action

Now, grant the service account a role that defines what it's allowed to do in your GCP project.

```hcl linenums="60"
--8<-- "examples/credentials/assets/idtoken-gcp-source.tf:60:"
```

## Use within the Pipeline

Now you can use the [
`gcloud` CLI's external account credential support](https://cloud.google.com/iam/docs/workload-identity-federation-with-other-providers#generate_a_credential_configuration)
to impersonate your service account via a JWT issued by Concourse. Since `gcloud` reads external credentials from a
config file rather than a single flag, the task writes the token to a file first, then assembles a small credential
config pointing at it:

```yaml linenums="1"
var_sources:
  - name: gcptoken
    type: idtoken
    config:
      audience:
        - "https://iam.googleapis.com/projects/<project_number>/locations/global/workloadIdentityPools/concourse-pool/providers/concourse-provider"

jobs:
  - name: gcp-deploy
    plan:
      - task: deploy
        config:
          platform: linux
          image_resource:
            type: registry-image
            source:
              repository: google/cloud-sdk
              tag: slim
          run:
            path: bash
            args:
              - -e
              - -c
              - |
                echo ((gcptoken:token)) > /tmp/gcp-token.jwt

                cat > /tmp/gcp-creds.json <<EOF
                {
                  "type": "external_account",
                  "audience": "//iam.googleapis.com/projects/<project_number>/locations/global/workloadIdentityPools/concourse-pool/providers/concourse-provider",
                  "subject_token_type": "urn:ietf:params:oauth:token-type:jwt",
                  "token_url": "https://sts.googleapis.com/v1/token",
                  "service_account_impersonation_url": "https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/concourse-deploy@<your_project_id>.iam.gserviceaccount.com:generateAccessToken",
                  "credential_source": {
                    "file": "/tmp/gcp-token.jwt"
                  }
                }
                EOF

                export GOOGLE_APPLICATION_CREDENTIALS=/tmp/gcp-creds.json
                gcloud auth login --cred-file="$GOOGLE_APPLICATION_CREDENTIALS"
                gsutil ls gs://my-bucket
                echo "Now do something with GCP using these impersonated credentials"
```