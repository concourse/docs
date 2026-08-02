---
title: The Conjur credential manager
---

Concourse can be configured to pull credentials from a [CyberArk Conjur](https://conjur.org/) instance.

## Configuration

To enable this credential manager, configure the following environment variables on the [
`web` node](../../install/running-web.md):

```properties
CONCOURSE_CONJUR_APPLIANCE_URL=https://credhub-server:9000
CONCOURSE_CONJUR_ACCOUNT=db02de05-fa39-4855-059b-67221c5c2f63
CONCOURSE_CONJUR_AUTHN_LOGIN=6a174c20-f6de-a53c-74d2-6018fcceff64
CONCOURSE_CONJUR_AUTHN_API_KEY=6a174c20-f6de-a53c-74d2-6018fcceff64
```

### Token File Configuration

Conjur can also be configured to use a token file instead of login and API keys by configuring the following environment
variable:

```properties
CONCOURSE_CONJUR_AUTHN_TOKEN_FILE=/etc/token
```

### TLS Configuration

If your Conjur instance is signed with TLS by a local Certificate Authority, you can use the following environment
variable:

```properties
CONCOURSE_CONJUR_CERT_FILE=/etc/ca.crt
```

### Permissions

The following is an example Conjur policy that can be used to grant permissions to a Conjur host. In this
example `host/concourse` will have permissions to read and update all the secrets within the `TEAM_NAME`
and `PIPELINE_NAME` policies.

```yaml
- !host concourse
- !policy
  id: concourse
  owner: !host concourse
  body:
    - !policy
      id: TEAM_NAME
      body:
        - !variable team-secret-variable
        - !policy
          id: PIPELINE_NAME
          body:
            - !variable pipeline-secret-variable
```

Note that the `TEAM_NAME` and `PIPELINE_NAME` text above should be replaced to fit your Concourse setup.

For more information on how to create and load Conjur policies, review
the [official documentation](https://docs.conjur.org/Latest/en/Content/Operations/Policy/policy-overview.htm?tocpath=Fundamentals%7CPolicy%20Management%7C_____0).

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
2. Change the team-, pipeline-, and absolute secret dependent path templates.

Each of these can be controlled by Concourse command line flags, or environment variables.

### Configuring a shared path

A "shared path" can also be configured for credentials that you would like to share across all teams and pipelines,
foregoing the default team/pipeline namespacing. Use with care!

```properties
CONCOURSE_CONJUR_SHARED_PATH=some-shared-path
```

This path must exist under the configured path prefix. The above configuration would correspond to
`/concourse/some-shared-path` with the default `/concourse` prefix.

### Changing the path templates

You can choose your own list of templates, which will expand to team-, pipeline-, and absolute secret specific paths. By
default, the templates used are:

```properties
CONCOURSE_CONJUR_TEAM_SECRET_TEMPLATE="concourse/{{.Team}}/{{.Secret}}
CONCOURSE_CONJUR_PIPELINE_SECRET_TEMPLATE=/concourse/{{.Team}}/{{.Pipeline}}/{{.Secret}}
CONCOURSE_CONJUR_SECRET_TEMPLATE=vaultName/{{.Secret}}
```

When secrets are to be looked up, these are evaluated where `{{.Team}}` expands to the current team, `{{.Pipeline}}` to
the current pipeline (if any), and `{{.Secret}}` to the name of the secret. So if the settings are:

```properties
CONCOURSE_CONJUR_TEAM_SECRET_TEMPLATE="{{.Team}}/concourse/{{.Secret}}
CONCOURSE_CONJUR_PIPELINE_SECRET_TEMPLATE=/{{.Team}}/concourse/{{.Pipeline}}/{{.Secret}}
CONCOURSE_CONJUR_SECRET_TEMPLATE=conjur/{{.Secret}}
CONCOURSE_CONJUR_SHARED_PATH=common
```

and `((password))` is used in team `myteam` and pipeline `mypipeline`, Concourse will look for the following, in order:

1. `/myteam/concourse/mypipeline/password`
2. `/myteam/concourse/password`
3. `/conjur/password`
4. `/common/password`