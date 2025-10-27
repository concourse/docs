---
title: The Conjur credential manager
---

## Configuration

Concourse can be configured to pull credentials from a [CyberArk Conjur](https://conjur.org/) instance.

The ATC is configured with a Conjur host username and api key or session token. If no host username, api key, or session
token is provided, Concourse will attempt to use environment variables.

The ATC's configuration specifies the following:

**`conjur-appliance-url`**: string

: URL of the Conjur instance.

: Environment variable `CONCOURSE_CONJUR_APPLIANCE_URL`.

**`aws-secretsmanager-secret-key`**: string

: The secret key that corresponds to the access key defined above.

: Environment variable `CONCOURSE_CONJUR_ACCOUNT`.

**`aws-secretsmanager-session-token`**: string

: A valid Conjur host username.

: Environment variable `CONCOURSE_CONJUR_AUTHN_LOGIN`.

**`conjur-authn-api-key`**: string

: The api key that corresponds to the Conjur host username.

: Environment variable `CONCOURSE_CONJUR_AUTHN_API_KEY`.

**`conjur-authn-token-file`**: string

: Token file used if Conjur instance is running in k8s or iam.

: Environment variable `CONCOURSE_CONJUR_AUTHN_TOKEN_FILE`.

**`conjur-cert-file`**: string

: Cert file used if conjur instance is using a self-signed cert.

: Environment variable `CONCOURSE_CONJUR_CERT_FILE`.

**`conjur-pipeline-secret-template`**: string

: The base path used when attempting to locate a pipeline-level secret.

: Environment variable `CONCOURSE_CONJUR_PIPELINE_SECRET_TEMPLATE`.

: !!! example

        Default: `/concourse/{{.Team}}/{{.Secret}}`

**`conjur-team-secret-template`**: string

: The base path used when attempting to locate a team-level secret.

: Environment variable `CONCOURSE_CONJUR_TEAM_SECRET_TEMPLATE`.

: !!! example

        Default: `/concourse/{{.Team}}/{{.Secret}}`

**`conjur-secret-template`**: string

: The base path used when attempting to locate a vault or safe level secret.

: Environment variable `CONCOURSE_CONJUR_SECRET_TEMPLATE`.

: !!! example

        Default: `vaultName/{{.Secret}}`

For example, to launch the ATC and enable Conjur, you may configure:

```shell
concourse web ... \
  --conjur-appliance-url https://conjur-master.local \
  --conjur-account conjur \
  --conjur-authn-login host/concourse/dev \
  --conjur-authn-api-key 107eaqz167jkzm2q8wjv4mnyj0z12gfkws9wq9gzsjt29v2sn7yvy

# or use env variables
CONCOURSE_CONJUR_APPLIANCE_URL="https://conjur-master.local" \
CONCOURSE_CONJUR_ACCOUNT="conjur" \
CONCOURSE_CONJUR_AUTHN_LOGIN="host/concourse/dev" \
CONCOURSE_CONJUR_AUTHN_API_KEY="107eaqz167jkzm2q8wjv4mnyj0z12gfkws9wq9gzsjt29v2sn7yvy" \
concourse web ...
```

## Conjur Permissions

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

When resolving a parameter such as `((foo_param))`, Concourse will look in the following paths, in order:

* `/concourse/TEAM_NAME/PIPELINE_NAME/foo_param`
* `/concourse/TEAM_NAME/foo_param`
* `vaultName/foo_param`

The leading `/concourse` can be changed by specifying `--conjur-pipeline-secret-template`
or `--conjur-team-secret-template` variables.

The leading `vaultName` can be changed by specifying `--conjur-secret-template` variable.