---
title: The Vault credential manager
---

Concourse can be configured to pull credentials from a [Vault](https://vaultproject.io/) instance.

To configure this, first configure the URL of your Vault server by setting the following env on
the [`web` node](../../install/running-web.md):

```properties
CONCOURSE_VAULT_URL=https://vault.example.com:8200
```

You may also need to configure the CA cert for Vault:

```properties
CONCOURSE_VAULT_CA_CERT=path/to/ca.crt
```

You'll also need to configure how the `web` node authenticates with Vault -
see [Authenticating with Vault](#authenticating-with-vault) for
more details as that step is quite involved.

## Credential lookup rules

Vault lets you organize secrets into hierarchies, which is useful for when they should be accessible for particular
pipelines or teams. When you have a parameter like `((foo))` in a pipeline definition, Concourse will (by default) look
for it in the following paths, in order:

* `/concourse/TEAM_NAME/PIPELINE_NAME/foo`
* `/concourse/TEAM_NAME/foo`

Vault credentials are actually key-value, so for `((foo))` Concourse will default to the field name value. You can
specify the field to grab via `.` syntax, e.g. `((foo.bar))`.

If you have multiple, intermediate levels in your path, you can use the `/` separator to reach your intended field,
e.g. `((foo/bar/baz.qux))`.

When executing a one-off task, there is no pipeline: so in this case, only the team path `/concourse/TEAM_NAME/foo` is
searched.

There are several ways to customize the lookup logic:

1. Add a "shared path", for secrets common to all teams.
2. Change the team- and pipeline-dependent path templates.
3. Change the path prefix from `/concourse` to something else.
4. Set a [Vault namespace](https://www.vaultproject.io/docs/enterprise/namespaces/) for isolation within a Vault
   Enterprise installation.

Each of these can be controlled by Concourse command line flags, or environment variables.

### Configuring a shared path

A "shared path" can also be configured for credentials that you would like to share across all teams and pipelines,
foregoing the default team/pipeline namespacing. Use with care!

```properties
CONCOURSE_VAULT_SHARED_PATH=some-shared-path
```

This path must exist under the configured path prefix. The above configuration would correspond
to `/concourse/some-shared-path` with the default `/concourse` prefix.

### Changing the path templates

You can choose your own list of templates, which will expand to team- or pipeline-specific paths. These are subject to
the path prefix. By default, the templates used are:

```properties
CONCOURSE_VAULT_LOOKUP_TEMPLATES=/{{.Team}}/{{.Pipeline}}/{{.Secret}},/{{.Team}}/{{.Secret}}
```

When secrets are to be looked up, these are evaluated subject to the configured path prefix, where `{{.Team}}` expands
to the current team, `{{.Pipeline}}` to the current pipeline (if any), and `{{.Secret}}` to the name of the secret. So
if the settings are:

```properties
CONCOURSE_VAULT_PATH_PREFIX=/secrets
CONCOURSE_VAULT_LOOKUP_TEMPLATES=/{{.Team}}/concourse/{{.Pipeline}}/{{.Secret}},/{{.Team}}/concourse/{{.Secret}},/common/{{.Secret}}
```

and `((password))` is used in team `myteam` and pipeline `mypipeline`, Concourse will look for the following, in order:

1. `/secrets/myteam/concourse/mypipeline/password`
2. `/secrets/myteam/concourse/password`
3. `/secrets/common/password`

### Changing the path prefix

The leading `/concourse` can be changed by specifying the following:

```properties
CONCOURSE_VAULT_PATH_PREFIX=/some-other-prefix
```

### Using a Vault namespace

If you are using Vault Enterprise, you can make secret lookups and authentication happen under a namespace.

```properties
CONCOURSE_VAULT_NAMESPACE=chosen/namespace/path
```

This setting applies to all teams equally.

## Configuring the secrets engine

Concourse is currently limited to looking under a single path, meaning enabling only one secrets engine is
supported: `kv`, or `kv_v2`. This may change in the future - we're still collecting ideas
in [RFC #21](https://github.com/concourse/rfcs/pull/21).

Using kv version 2 enables versioned secrets and the ability to restore previous versions or deleted secrets. Concourse
will read the latest version of a secret at all times and if it is deleted it will appear as if the secret does not
exist. More information regarding the Vault KV backend and the differences in versions can be
found [here](https://www.vaultproject.io/docs/secrets/kv).

So, let's configure the kv secrets engine and mount it at `/concourse`:

```shell
vault secrets enable -version=1 -path=concourse kv
```

To enable kv_v2 and versioned secrets:

```shell
vault secrets enable -version=2 -path=concourse kv
```

Next, you'll want to create a policy to allow Concourse to read from this path.

```hcl
path "concourse/*" {
  capabilities = ["read"]
}
```

Save this to `concourse-policy.hcl`, and then run:

```shell
vault policy write concourse ./concourse-policy.hcl
```

This configuration will allow Concourse to read all credentials under `/concourse`. This should match your configured
path prefix.

## Authenticating with Vault

There are many ways to authenticate with a Vault server. The `web` node can be configured with either a token or an
arbitrary auth backend and arbitrary auth params, so just about all of them should be configurable.

When the `web` node acquires a token, either by logging in with an auth backend or by being given one directly, it will
continuously renew the token to ensure it doesn't expire. The renewal interval is half of the token's lease duration.

### Using a periodic token

The simplest way to authenticate is by generating a periodic token:

```shell
$ vault token create --policy concourse --period 1h
Key                Value
---                -----
token              s.mSNnbhGAqxK2ZbMasOQ91rIA
token_accessor     0qsib5YcYvROm86cT08IFxIT
token_duration     1h
token_renewable    true
token_policies     [concourse default]
```

!!! warning

      Choose your `--period` wisely, as the timer starts counting down as soon as the token is created. You should also
      use a duration long enough to account for any planned `web` node downtime.

Once you have the token, just set the following env on the `web` node:

```properties
CONCOURSE_VAULT_CLIENT_TOKEN=s.mSNnbhGAqxK2ZbMasOQ91rIA
```

Periodic tokens are the quickest way to get started, but they have one fatal flaw: if the `web` node is down for longer
than the token's configured period, the token will expire and a new one will have to be created and configured. This can
be avoided by using the [`approle` auth backend](#using-the-approle-auth-backend).

### Using the `userpass` auth backend

The [`userpass`](https://www.vaultproject.io/docs/auth/userpass.html) backend allows for _users_ (in this case,
Concourse) to authenticate with a _user_ pre-configured in Vault.

With this backend, the [`web` node](../../install/running-web.md) is configured with a `username` corresponding to a
pre-configured user, and a `password` which is used to authenticate and acquire a token.

The `userpass` backend must first be configured in Vault. Vault's `userpass` backend allows for a few parameters which you
may want to set to determine the permissions and lifecycle of its issued tokens:

`policies=names`

: This determines the policies (comma-separated) to set on each token. Be sure to set one that has access to the secrets
path - see [Configuring the secrets engine](#configuring-the-secrets-engine) for more information.

`token_ttl=duration`

: This determines the TTL for each token granted. The token can be continuously renewed, as long as it is renewed before
the TTL elapses.

`token_max_ttl=duration`

: This sets a maximum lifetime for each token, after which the token can no longer be renewed.

: If configured, be sure to set the same value on the `web` node so that it can re-auth before this duration is reached:
```properties
CONCOURSE_VAULT_AUTH_BACKEND_MAX_TTL=1h
```

`period=duration`

: If configured, tokens issued will be [periodic](https://www.vaultproject.io/docs/concepts/tokens.html#periodic-tokens)
. Periodic tokens are not bound by any configured max TTL, and can be renewed continuously. It does not make sense to
configure both `period` and `token_max_ttl` as the max TTL will be ignored.

`token_num_uses=count`

: This sets a limit on how often a token can be used. **We do not recommend setting this value**, as it will effectively
hamstring Concourse after a few credential acquisitions. The `web` node does not currently know to re-acquire a token
when this limit is reached.

: For a full list of options refer to [userpass api docs](https://developer.hashicorp.com/vault/api-docs/auth/userpass#parameters).
```shell
$ vault auth enable userpass
Success! Enabled userpass auth method at: userpass/
$ vault write auth/userpass/users/concourse policies=concourse period=1h password=<....>
Success! Data written to: auth/userpass/users/concourse
```

Now that the backend is configured, we can use the `username` and `password`:

These should then be set on the [`web` node](../../install/running-web.md) like so:

```properties
CONCOURSE_VAULT_AUTH_BACKEND="userpass"
CONCOURSE_VAULT_AUTH_PARAM="username:concourse,password:<....>"
```

### Using the `approle` auth backend

The [`approle`](https://www.vaultproject.io/docs/auth/approle.html) backend allows for an _app_ (in this case,
Concourse) to authenticate with a _role_ pre-configured in Vault.

With this backend, the [`web` node](../../install/running-web.md) is configured with a `role_id` corresponding to a
pre-configured role, and a `secret_id` which is used to authenticate and acquire a token.

The `approle` backend must first be configured in Vault. Vault's `approle` backend allows for a few parameters which you
may want to set to determine the permissions and lifecycle of its issued tokens:

`policies=names`

: This determines the policies (comma-separated) to set on each token. Be sure to set one that has access to the secrets
path - see [Configuring the secrets engine](#configuring-the-secrets-engine) for more information.

`token_ttl=duration`

: This determines the TTL for each token granted. The token can be continuously renewed, as long as it is renewed before
the TTL elapses.

`token_max_ttl=duration`

: This sets a maximum lifetime for each token, after which the token can no longer be renewed.

: If configured, be sure to set the same value on the `web` node so that it can re-auth before this duration is reached:
```properties
CONCOURSE_VAULT_AUTH_BACKEND_MAX_TTL=1h
```

`period=duration`

: If configured, tokens issued will be [periodic](https://www.vaultproject.io/docs/concepts/tokens.html#periodic-tokens)
. Periodic tokens are not bound by any configured max TTL, and can be renewed continuously. It does not make sense to
configure both `period` and `token_max_ttl` as the max TTL will be ignored.

`token_num_uses=count`

: This sets a limit on how often a token can be used. **We do not recommend setting this value**, as it will effectively
hamstring Concourse after a few credential acquisitions. The `web` node does not currently know to re-acquire a token
when this limit is reached.

`secret_id_ttl=duration` and `secret_id_num_uses=count`

: These two configurations will result in the secret ID expiring after the configured time or configured number of
log-ins, respectively.

: You should only set these if you have something periodically re-generating secret IDs and re-configuring your `web`
nodes accordingly.

Given all that, a typical configuration may look something like this:

```shell
$ vault auth enable approle
Success! Enabled approle auth method at: approle/
$ vault write auth/approle/role/concourse policies=concourse period=1h
Success! Data written to: auth/approle/role/concourse
```

Now that the backend is configured, we'll need to obtain the `role_id` and generate a `secret_id`:

```shell
$ vault read auth/approle/role/concourse/role-id
Key        Value
---        -----
role_id    5f3420cd-3c66-2eff-8bcc-0e8e258a7d18
$ vault write -f auth/approle/role/concourse/secret-id
Key                   Value
---                   -----
secret_id             f7ec2ac8-ad07-026a-3e1c-4c9781423155
secret_id_accessor    1bd17fc6-dae1-0c82-d325-3b8f9b5654ee
```

These should then be set on the [`web` node](../../install/running-web.md) like so:

```properties
CONCOURSE_VAULT_AUTH_BACKEND="approle"
CONCOURSE_VAULT_AUTH_PARAM="role_id:5f3420cd-3c66-2eff-8bcc-0e8e258a7d18,secret_id:f7ec2ac8-ad07-026a-3e1c-4c9781423155"
```

### Using the `cert` auth backend

The [`cert`](https://www.vaultproject.io/docs/auth/cert.html) auth method allows authentication using SSL/TLS client
certificates.

With this backend, the [`web` node](../../install/running-web.md) is configured with a client cert and a client key.
Vault must be configured with TLS, which you should be almost certainly be doing anyway.

The `cert` backend must first be configured in Vault. Vault's `cert` backend allows for a few parameters which you may
want to set to determine the lifecycle of its issued tokens:

`policies=names`

: This determines the policies (comma-separated) to set on each token. Be sure to set one that has access to the secrets
path -
see [Configuring the secrets engine](#configuring-the-secrets-engine)
for more information.

`ttl=duration`

: This determines the TTL for each token granted. The token can be continuously renewed, as long as it is renewed before
the TTL elapses.

`max_ttl=duration`

: This sets a maximum lifetime for each token, after which the token can no longer be renewed.

: If configured, be sure to set the same value on the `web` node so that it can re-auth before this duration is reached:
```properties
CONCOURSE_VAULT_AUTH_BACKEND_MAX_TTL=1h
```

`period=duration`
: If configured, tokens issued will be [
_periodic_](https://www.vaultproject.io/docs/concepts/tokens.html#periodic-tokens). Periodic tokens are not bound by any
configured max TTL, and can be renewed continuously. It does not make sense to configure both `period` and `max_ttl` as
the max TTL will be ignored.

```shell
$ vault auth enable cert
Success! Enabled cert auth method at: cert/
$ vault write auth/cert/certs/concourse policies=concourse certificate=@out/vault-ca.crt ttl=1h
Success! Data written to: auth/cert/certs/concourse
```

Once that's all set up, you'll just need to configure the client cert and key on the `web` node like so:

```properties
CONCOURSE_VAULT_AUTH_BACKEND="cert"
CONCOURSE_VAULT_CLIENT_CERT=vault-certs/concourse.crt
CONCOURSE_VAULT_CLIENT_KEY=vault-certs/concourse.key
```

In this case no additional auth params are necessary, as the Vault's TLS auth backend will check the certificate against
all roles if no name is specified.
