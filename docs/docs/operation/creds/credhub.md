---
title: CredHub credential manager
---

Concourse can be configured to pull credentials from a [CredHub](https://github.com/cloudfoundry/credhub) instance.

## Configuration

To enable this credential manager, configure the following environment variables on the [
`web` node](../../install/running-web.md):

```properties
CONCOURSE_CREDHUB_URL=https://credhub-server:9000
CONCOURSE_CREDHUB_CLIENT_ID=db02de05-fa39-4855-059b-67221c5c2f63
CONCOURSE_CREDHUB_CLIENT_SECRET=6a174c20-f6de-a53c-74d2-6018fcceff64
```

### TLS Configuration

If your CredHub instance is signed with TLS by a local Certificate Authority, you can use the following environment
variable:

```properties
CONCOURSE_CREDHUB_CA_CERT=/etc/ca.crt
```

??? danger "Skip SSL Verification"

    CredHub can also be configured to skip SSL Verification. This property should not be used within production.

    ```properties
    CONCOURSE_CREDHUB_INSECURE_SKIP_VERIFY=true
    ```

### mTLS Configuration

CredHub can also be configured to authenticate
using [Mutual TLS (mTLS)](https://github.com/cloudfoundry/credhub/blob/main/docs/mutual-tls.md) instead of traditional
password or token-based methods. This can be accomplished using the following environment variables:

```properties
CONCOURSE_CREDHUB_URL=https://credhub-server:9000
CONCOURSE_CREDHUB_CA_CERT=/etc/ca.crt
CONCOURSE_CREDHUB_CLIENT_CERT=/etc/client.crt
CONCOURSE_CREDHUB_CLIENT_KEY=/etc/client.pem
```

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
2. Change the path prefix from `/concourse` to something else.

Each of these can be controlled by Concourse command line flags, or environment variables.

### Configuring a shared path

A "shared path" can also be configured for credentials that you would like to share across all teams and pipelines,
foregoing the default team/pipeline namespacing. Use with care!

```properties
CONCOURSE_CREDHUB_SHARED_PATH=some-shared-path
```

This path must exist under the configured path prefix. The above configuration would correspond to
`/concourse/some-shared-path` with the default `/concourse` prefix.

### Changing the path prefix

The leading `/concourse` can be changed by specifying the following:

```properties
CONCOURSE_CREDHUB_PATH_PREFIX=/some-other-prefix
```