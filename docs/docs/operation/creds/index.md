---
title: Credential Management
---

Going beyond [Encryption](../encryption.md), explicit credential management will provide credentials to your builds for
a brief amount of time, without being persisted anywhere. It also allows for credentials to be rotated and managed
external to the pipeline or team, and prevents them from being revealed by [
`fly get-pipeline`](../../pipelines/managing-pipelines.md#fly-get-pipeline).

Credential management works by replacing the credentials with `((vars))` in your pipeline or task config. When the
Concourse is about to run the step or `check` that is configured with vars, it will resolve them by fetching the values
from the credential manager. If the values are not present, the action will error.

The following configurations can be parameterized with a credential manager:

* resource.source under pipeline.resources
* resource_type.source under pipeline.resource_types
* resource.webhook_token under pipeline.resources
* task step params on a task step in a pipeline
* [Tasks](../../tasks.md) in their entirety - whether from task step file or task step config in a pipeline, or a config
  executed with [fly execute](../../tasks.md)

Where these values are looked up and how the credential manager is configured depends on the backend. Consult the
relevant section below for whichever backend you want to use.

<div class="grid cards" markdown>

- :simple-vault: Vault

    ---
  [:octicons-arrow-right-24: Configure](vault.md)

- :material-lock: CredHub

    ---
  [:octicons-arrow-right-24: Configure](credhub.md)

- :material-aws: AWS SSM

    ---
  [:octicons-arrow-right-24: Configure](aws-ssm.md)

- :material-aws: AWS Secrets Manager

    ---
  [:octicons-arrow-right-24: Configure](aws-secrets.md)

- :material-kubernetes: Kubernetes

    ---
  [:octicons-arrow-right-24: Configure](kubernetes.md)

- :material-lock: Conjur

    ---
  [:octicons-arrow-right-24: Configure](conjur.md)

- :material-openid: IDToken

    ---
  [:octicons-arrow-right-24: Configure](id-token.md)

</div>