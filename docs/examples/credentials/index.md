---
title: Credentials & Identity Federation
---

# Credentials & Identity Federation

Guides for authenticating pipelines to external services using
Concourse-issued JWTs (the [`idtoken` var source](../../docs/operation/creds/id-token.md))
instead of storing long-lived secrets. For general credential management —
Vault, AWS Secrets Manager, and other cluster-wide credential managers — see
[Credential Management](../../docs/operation/creds/index.md) in the Docs.

<div class="grid cards" markdown>

-   :material-shield-key-outline:{ .lg .middle } __Authenticating to Vault via IDToken__

    ---

    Let a pipeline log in to Vault directly, beyond what Concourse's
    native Vault integration offers.

    [:octicons-arrow-right-24: View guide](idtoken-vault.md)

-   :material-aws:{ .lg .middle } __Authenticating to AWS via IDToken__

    ---

    Assume an IAM role from a pipeline without managing IAM users or
    long-lived access keys.

    [:octicons-arrow-right-24: View guide](idtoken-aws.md)

-   :material-microsoft-azure:{ .lg .middle } __Authenticating to Azure via IDToken__

    ---

    Log in to Azure from a pipeline using a federated credential.

    [:octicons-arrow-right-24: View guide](idtoken-azure.md)

-   :material-google-cloud:{ .lg .middle } __Authenticating to GCP via IDToken__

    ---

    Impersonate a GCP service account from a pipeline using workload
    identity federation.

    [:octicons-arrow-right-24: View guide](idtoken-gcp.md)

</div>

For details on JWT claims, key rotation, and the `subject_scope` setting, see the
[IDToken credential manager](../../docs/operation/creds/id-token.md) reference page.