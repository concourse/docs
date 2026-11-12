---
title: GCP Secret Manager credential manager
tags:
  - Credential
---

Concourse can read credentials from [Google Cloud Secret Manager](https://cloud.google.com/security/products/secret-manager).

## Configuration

To enable this credential manager, set the GCP project that contains your secrets on the [
`web` node](../../install/running-web.md). The value can be a project ID or a project number. Concourse does not
accept domain-scoped project IDs, such as `example.com:my-project`.

```properties
CONCOURSE_GCP_SECRETMANAGER_PROJECT=my-project
```

### Authentication

If you set no credentials, the `web` node uses
[Application Default Credentials](https://cloud.google.com/docs/authentication/application-default-credentials) (ADC).
On GKE, ADC fetches credentials from
[Workload Identity Federation for GKE](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity). On
Compute Engine, ADC uses the service account of the VM. This method is recommended because there is no key to store or
rotate.

To use a service account key instead, set one of the following environment variables. If you set both, the `web` node will fail to start.

```properties
# Path to a JSON key file on the web node
CONCOURSE_GCP_SECRETMANAGER_CREDENTIALS_FILE=/etc/concourse/gcp-key.json

# Or, the contents of a JSON key
CONCOURSE_GCP_SECRETMANAGER_CREDENTIALS_JSON='{"type": "service_account", ...}'
```

!!! note

    These two settings accept only service account keys. To use a different credential type, such as a
    [Workload Identity Federation](https://cloud.google.com/iam/docs/workload-identity-federation) configuration file,
    set `GOOGLE_APPLICATION_CREDENTIALS` on the `web` node and leave both settings empty. ADC then reads the file.

### IAM Permissions

The identity that Concourse uses needs the `secretmanager.versions.access` permission. The
[Secret Manager Secret Accessor](https://cloud.google.com/secret-manager/docs/access-control) role
(`roles/secretmanager.secretAccessor`) gives this permission.

Concourse only reads secrets. It does not list, create or change them.

!!! warning

    Concourse continues to the next lookup path only when a secret is not found. Any other error fails the build,
    for example `PERMISSION_DENIED` or a timeout. Thus, give access to all the secret IDs that your templates can
    produce, not only to the secrets that exist.

The easiest method is to keep the Concourse secrets in a dedicated project, and grant the role on that project:

=== "gcloud"

    ```shell
    gcloud projects add-iam-policy-binding my-project \
      --member="serviceAccount:concourse-web@my-project.iam.gserviceaccount.com" \
      --role="roles/secretmanager.secretAccessor"
    ```

=== "Terraform / OpenTofu"

    ```hcl
    resource "google_project_iam_member" "concourse_secret_accessor" {
      project = "my-project"
      role    = "roles/secretmanager.secretAccessor"
      member  = "serviceAccount:concourse-web@my-project.iam.gserviceaccount.com"
    }
    ```

If the project also contains other secrets, use an
[IAM condition](https://cloud.google.com/iam/docs/conditions-overview) to limit access to the Concourse secret IDs.
The condition must include the shared root and the health check secret (see [Scaling](#scaling)). In a condition,
the resource name contains the project number, not the project ID:

=== "gcloud"

    ```shell
    gcloud projects add-iam-policy-binding my-project \
      --member="serviceAccount:concourse-web@my-project.iam.gserviceaccount.com" \
      --role="roles/secretmanager.secretAccessor" \
      --condition='title=concourse-secrets,expression=resource.name.startsWith("projects/123456789012/secrets/concourse--") || resource.name.startsWith("projects/123456789012/secrets/concourse-shared--") || resource.name.startsWith("projects/123456789012/secrets/__concourse-health-check")'
    ```

=== "Terraform / OpenTofu"

    ```hcl
    data "google_project" "secrets" {
      project_id = "my-project"
    }

    locals {
      secrets_prefix = "projects/${data.google_project.secrets.number}/secrets"
    }

    resource "google_project_iam_member" "concourse_secret_accessor" {
      project = data.google_project.secrets.project_id
      role    = "roles/secretmanager.secretAccessor"
      member  = "serviceAccount:concourse-web@my-project.iam.gserviceaccount.com"

      condition {
        title      = "concourse-secrets"
        expression = join(" || ", [
          "resource.name.startsWith(\"${local.secrets_prefix}/concourse--\")",
          "resource.name.startsWith(\"${local.secrets_prefix}/concourse-shared--\")",
          "resource.name.startsWith(\"${local.secrets_prefix}/__concourse-health-check\")",
        ])
      }
    }
    ```

These prefixes match the default templates. If you change the templates, change the prefixes to match. See
[Secret IDs](#secret-ids) for how Concourse makes a secret ID from a template.

### Scaling

If your cluster has a large workload, in particular if there are many resources, Concourse can send many requests to
GCP. As a result, GCP might limit the rate of requests.

To monitor the error rate, poll the `/api/v1/info/creds` endpoint as a
[Concourse Admin](../../auth-and-teams/user-roles.md#concourse-admin). The health check in this response reads the
`__concourse-health-check` secret. This secret does not have to exist, but Concourse must have permission to read it.

To decrease rate-limit errors, you can [cache credentials](caching.md) and [retry failed fetches](retrying-failed.md).
Choose these settings based on how you update secrets and on your reliability requirements.

#### Configuring Request Timeout

Concourse stops each request to Secret Manager after 10 seconds. To change this limit, set the following environment
variable:

```properties
CONCOURSE_GCP_SECRETMANAGER_REQUEST_TIMEOUT=20s
```

A value of `0` sets the default. A negative value is not valid.

## Credential Lookup Rules

When Concourse resolves a parameter such as `((foo_param))`, it looks in the following paths, in order:

1. `/concourse/TEAM_NAME/PIPELINE_NAME/foo_param`
2. `/concourse/TEAM_NAME/foo_param`
3. `/concourse-shared/foo_param`

Concourse uses the first secret that it finds. Thus, a pipeline secret overrides a team secret with the same name, and
a team secret overrides a shared secret.

A one-off task has no pipeline. For a one-off task, Concourse looks only in the team path and the shared path.

Secret Manager does not allow `/` in a secret ID, so Concourse changes each path into a secret ID before the lookup.
See [Secret IDs](#secret-ids).

### Secret IDs

Concourse makes a secret ID from a path in two steps:

1. Remove the first `/`.
2. Replace each remaining `/` with `--`.

For example, if pipeline `my-pipeline` in team `main` uses `((foo_param))`, Concourse reads these secret IDs, in
order:

1. `concourse--main--my-pipeline--foo_param`
2. `concourse--main--foo_param`
3. `concourse-shared--foo_param`

To keep the secrets of each team separate, every part of a secret ID must be a valid _segment_. A segment is valid
when it:

* contains at least one character
* contains only ASCII letters (`A-Z`, `a-z`), numerals (`0-9`), hyphens (`-`) and underscores (`_`)
* does not start or end with a hyphen (`-`)
* does not contain `--`

These rules have different results for var names and for team and pipeline names:

* **Var names**: If a var name is not a valid segment, the build fails. For example, `((my--secret))` fails. Concourse
  does not try the next path.
* **Team and pipeline names**: Concourse allows some names that are not valid segments, for example `my.pipeline`. For
  these names, Concourse skips the paths that contain the name, and uses the remaining paths. For example, in the
  pipeline `my.pipeline`, Concourse reads only the team and shared secrets. If Concourse skips all the paths, every
  lookup fails.

Secret Manager allows a maximum of 255 characters in a secret ID. If a path makes a longer ID, Concourse treats the
secret as not found and tries the next path.

### Changing the path templates

To change the paths, set one or more of these templates. The values below are the defaults:

```properties
CONCOURSE_GCP_SECRETMANAGER_PIPELINE_SECRET_TEMPLATE=/concourse/{{.Team}}/{{.Pipeline}}/{{.Secret}}
CONCOURSE_GCP_SECRETMANAGER_TEAM_SECRET_TEMPLATE=/concourse/{{.Team}}/{{.Secret}}
CONCOURSE_GCP_SECRETMANAGER_SHARED_SECRET_TEMPLATE=/concourse-shared/{{.Secret}}
```

Write templates as paths with `/`, as for other credential managers. Do not write `--` in a template. Concourse
changes the result into a secret ID, as described in [Secret IDs](#secret-ids).

In a template, `{{.Team}}` expands to the current team, `{{.Pipeline}}` to the current pipeline (if any), and
`{{.Secret}}` to the name of the secret. So if the settings are:

```properties
CONCOURSE_GCP_SECRETMANAGER_PIPELINE_SECRET_TEMPLATE=/ci/{{.Team}}/{{.Pipeline}}/{{.Secret}}
CONCOURSE_GCP_SECRETMANAGER_TEAM_SECRET_TEMPLATE=/ci/{{.Team}}/{{.Secret}}
CONCOURSE_GCP_SECRETMANAGER_SHARED_SECRET_TEMPLATE=/common/{{.Secret}}
```

and pipeline `mypipeline` in team `myteam` uses `((password))`, Concourse looks for the following, in order:

1. `ci--myteam--mypipeline--password`
2. `ci--myteam--password`
3. `common--password`

Concourse checks the templates when the `web` node starts. If a template does not obey these rules, the `web` node does
not start. In these rules, a _literal segment_ is a segment that contains no placeholder.

* A template can contain only the placeholders `{{.Team}}`, `{{.Pipeline}}` and `{{.Secret}}`. Other template
  actions, such as `{{if}}` or functions, are not permitted.
* A template must start with a literal segment, for example `/concourse/`. The first `/` is optional.
* A template must contain `{{.Secret}}`.
* A template that contains `{{.Pipeline}}` must also contain `{{.Team}}`.
* Each placeholder must fill a full segment between two `/` characters. For example, Concourse accepts
  `/concourse/{{.Team}}/{{.Secret}}`, but not `/concourse/team-{{.Team}}/{{.Secret}}`.
* Each placeholder can occur only one time in a template.
* Each literal segment must be a valid segment, as described in [Secret IDs](#secret-ids).
* Two templates must not be able to make the same secret ID. A placeholder can match any literal segment, so give
  each template a different literal segment at a position where both templates have a literal segment. Or, give each
  template a different number of segments.
* The shared template must start with a different literal segment from the pipeline and team templates.

## Saving credentials in Secret Manager

Concourse always reads the `latest` version of a secret. If the `latest` version is disabled or destroyed, Concourse
treats the secret as not found.

Concourse compares the payload with the CRC32C checksum from Secret Manager. If the checksum does not match, the build
fails.

Concourse reads the payload of a secret in one of three ways:

* **Text**: If the payload is not a JSON object, Concourse uses the full payload as a string. This includes JSON
  strings, numbers, arrays and `null`. For example, the payload `"foo"` resolves to `"foo"`, with the quotes.
* **JSON object**: If the payload is a JSON object, you can read its fields. For example, if the secret `db` contains
  `{"username": "admin", "password": "hunter2"}`, then `((db.username))` resolves to `admin`.
* **JSON object with a `value` key**: If the object has a `value` key, the var resolves to the value of that key.
  Concourse ignores the other keys. For example, if the secret `token` contains `{"value": "abc123"}`, then
  `((token))` resolves to `abc123`. This is the same as the [Vault](vault.md) credential manager.

To read the full object of a secret that has a `value` key, disable this behavior:

```properties
CONCOURSE_GCP_SECRETMANAGER_DISABLE_VALUE_UNWRAP=true
```

!!! warning

    Concourse does not remove a newline at the end of a text payload. The `echo` command adds a newline, so do not
    use it to create a secret. Use `printf` instead:

    ```shell
    printf '%s' 'my-secret-value' | gcloud secrets create concourse--main--my-pipeline--foo_param \
      --project=my-project --data-file=-
    ```

## Using a var source

You can also configure Secret Manager for one pipeline as a [var source](../../vars.md#var-sources-experimental), with
the type `gcpsecretmanager`:

```yaml
var_sources:
- name: gcp
  type: gcpsecretmanager
  config:
    project: my-project
    credentials_json: ((gcp-service-account-key))

jobs:
- name: deploy
  plan:
  - task: deploy
    params:
      DB_PASSWORD: ((gcp:db.password))
    # ...
```

A var source must have `credentials_json`. It cannot use `credentials_file`, and it cannot use the credentials of the
`web` node. Without this rule, a pipeline could use the identity of the `web` node to read secrets of other teams.

Do not write the key in the pipeline config. Store the key in the
[cluster-wide credential manager](index.md) and refer to it with a `((var))`, as in the example above.

Concourse checks the var source config when you set the pipeline. At that time, Concourse does not resolve
`((vars))` from a credential manager. Thus, all keys except `credentials_json` must be literal values or
[`fly set-pipeline`](../../pipelines/setting-pipelines.md) vars. Concourse also rejects keys that it does not know.
Concourse checks the contents of `credentials_json` only when it uses the var source.

For all the configuration options, see the [`gcpsecretmanager` var source schema](../../vars.md#gcpsecretmanager_config-schema).
