---
title: IDToken credential manager
---

This idtoken credential manager is a bit special. It doesn't load any credentials from an external source but instead
generates [JWTs](https://datatracker.ietf.org/doc/html/rfc7519) which are signed by concourse and contain information
about the pipeline/job that is currently running. It can NOT be used as a cluster-wide credential manager, but must
instead be used as a [var source](../../vars.md#var-sources-experimental).

These JWTs can be used to authenticate with external services via "identity federation" with the identity of the
pipeline.

Examples for services that support authentication via JWTs are:

* [Vault](https://vaultproject.io/)
* [AWS](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers.html)
* [Azure](https://learn.microsoft.com/en-us/graph/api/resources/federatedidentitycredentials-overview?view=graph-rest-1.0)

External services can verify if JWTs are actually issued by your Concourse, by checking the signatures on the JWTs
against the public keys published by your Concourse.

The public keys for verification are published as [JWKS](https://datatracker.ietf.org/doc/html/rfc7517) at:

```
https://your-concourse-server.com/.well-known/jwks.json
```

Concourse also offers a [OIDC Discovery Endpoint](https://openid.net/specs/openid-connect-discovery-1_0.html), which
allows external services to auto-discover the JWKS-URL.

## Usage

You create a [var source](../../vars.md#var-sources-experimental) of type `idtoken` with the configuration you want (
see [Configuration](#configuration)) in your pipeline. That var source then exposes a single variable with a single
field, token, which contains the JWT and can be used in any step of your pipeline.

You can also have multiple `idtoken` var sources in the same pipeline, each with different audiences, lifetimes etc.

```yaml
var_sources:
  - name: myidtoken
    type: idtoken
    config:
      audience: [ "sts.amazonaws.com" ]

jobs:
  - name: print-creds
    plan:
      - task: print
        config:
          platform: linux
          image_resource:
            type: mock
            source: { mirror_self: true }
          run:
            path: bash
            args:
              - -c
              - |
                echo myidtoken: ((myidtoken:token))
```

## Configuration

You can pass several config options to the `idtoken` var source to customize the generated JWTs. For example, you can
configure the `aud` claim, token expiration, or granularity of the `sub` claim.
See [`idtoken` var source](../../vars.md#id-token) for all config options.

### Subject Scope

Some external services (like AWS) only perform exact-matches on a token's sub-claim and ignore most other claims. To
enable use-cases like "_all pipelines of a team should be able to assume an AWS-Role_", Concourse offers the option to
configure how granular the `sub` claim's value should be.

This is configured via the `subject_scope` setting of the [`idtoken` var source](../../vars.md#id-token).

Depending on the value of `subject_scope`, the content of the JWT's `sub` claim will differ:

| `subject_scope` | `sub` Value in JWT                                           |
|-----------------|--------------------------------------------------------------|
| `team`          | `<team_name>`                                                |
| `pipeline`      | `<team_name>/<pipeline_name>`                                |
| `instance`      | `<team_name>/<pipeline_name>/<instance_vars>`[^1]            |
| `job`           | `<team_name>/<pipeline_name>/<instance_vars>/<job_name>`[^2] |

[^1]: Instance vars are rendered as comma-separated key-value pairs. e.g. `my-var:my-value,hello:world`
[^2]:

    If a path element is empty (for example because you chose `job` on a pipeline with no instance-vars), the empty 
    element is still added. e.g. `my-team/my-pipeline//my-job`. Note the double forward-slashes between the pipeline and
    job name, where instance vars would go.

This way all your pipelines can simply get a token with `subject_scope: team` and use this token to assume an AWS-Role
that matches on `sub: "your_team_name"`.

## Example JWT

The generated tokens usually look something like this:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3lvdXItY29uY291cnNlLmV4YW1wbGUuY29tIiwiZXhwIjoxNzUxMDE1NzM0LCJhdWQiOlsiYXBpOi8vQXp1cmVBRFRva2VuRXhjaGFuZ2UiXSwic3ViIjoibWFpbi9leGFtcGxlLXBpcGVsaW5lIiwidGVhbSI6Im1haW4iLCJwaXBlbGluZSI6ImV4YW1wbGUtcGlwZWxpbmUiLCJqb2IiOiJleGFtcGxlLWpvYiJ9.my7l44tH0wfz8vc6z3fMmzTMxZ8_orhjcsOti3BKSNo
```

And after decoding, looks like this:

```json
{
  "aud": "sts.amazonaws.com",
  "exp": 1751282764,
  "iat": 1751279164,
  "iss": "https://your-concourse-server.com",
  "job": "print-creds",
  "pipeline": "mypipeline",
  "sub": "main/mypipeline",
  "team": "main"
}
```

Here is a short explanation of the different claims:

* `iss`: Who issued the token. Contains the OIDC issuer URL if `--oidc-issuer-url` is configured, otherwise the external
  URL of your Concourse.
* `exp`: When the token will expire
* `aud`: Who the token is intended for. (In the above example it's for Azure's Identity Federation API)
* `team`: The team of the pipeline this token was generated for
* `pipeline`: The pipeline this token was generated for
* `job`: The name of the job (inside the pipeline) this token was generated for
* `instance_vars`: Any instance vars for the pipeline (if it is an instanced pipeline). Will be a comma-separated list
  of key-value pairs. e.g. `hello:world,my-var:my-value`
* `sub`: A combination of team + pipeline + instance_vars + job. Which parts are used here is configurable,
  see [Subject Scope](#subject-scope).

## Automatic Key Rotation

Concourse will automatically rotate the signing keys used for creating the JWTs. The default rotation period
is `7 days`. The previously used keys are being kept around for a while (by default `24h`) so that verification of
currently existing JWTs doesn't fail during key rotation.

This behavior can be configured via the following ATC flags:

* `CONCOURSE_SIGNING_KEY_ROTATION_PERIOD`: How often to rotate the signing keys. Default: `7d`. A value of `0` means
  don't rotate at all.
* `CONCOURSE_SIGNING_KEY_GRACE_PERIOD`: How long to keep previously used signing keys published in the JWKs after they
  have been rotated. Default: `24h`.
* `CONCOURSE_SIGNING_KEY_CHECK_INTERVAL`: How often to check if new keys are needed or if old ones should be removed.
  Default: `10m`

## Configuring a Separate OIDC Issuer

By default, Concourse uses the `--external-url`  as the OIDC issuer in generated tokens. You can configure a separate
OIDC issuer URL using the `--oidc-issuer-url` flag:

```shell
concourse web \
    --external-url https://concourse.internal.example.com \
    --oidc-issuer-url https://oidc.example.com
```

When `--oidc-issuer-url` is configured:

* The `iss` claim in generated JWT tokens will contain the OIDC issuer URL instead of the external URL
* The OIDC discovery endpoints (`/.well-known/openid-configuration` and `/.well-known/jwks.json`) will return the OIDC
  issuer URL
* Your Concourse web UI and API continue to use the external URL

This is useful for private network deployments where you want to serve OIDC discovery from a separate public endpoint
while keeping your Concourse instance private.

!!! warning

    When the signing keys rotate, Concourse immediately uses the new key for signing tokens. If your OIDC issuer URL is 
    out of sync with Concourse's JWKS, token verification will fail. The recommended approach is to use a reverse proxy 
    that forwards requests to your private Concourse in real-time, eliminating sync delays during key rotation.

## Guides

For end-to-end setup with a specific provider, see:

- [Authenticating to Vault via IDToken](../../../examples/credentials/idtoken-vault.md)
- [Authenticating to AWS via IDToken](../../../examples/credentials/idtoken-aws.md)
- [Authenticating to Azure via IDToken](../../../examples/credentials/idtoken-azure.md)
- [Authenticating to GCP via IDToken](../../../examples/credentials/idtoken-gcp.md)
