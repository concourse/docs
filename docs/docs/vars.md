---
title: Vars
---

Concourse supports value substitution in YAML configuration by way of `((vars))`.

Automation entails the use of all kinds of credentials. It's important to keep these values separate from the rest of
your configuration by using vars instead of hardcoding values. This allows your configuration to be placed under source
control and allows credentials to be tucked safely away into a secure credential manager like Vault instead of the
Concourse database.

Aside from credentials, vars may also be used for generic parameterization of pipeline configuration templates, allowing
a single pipeline config file to be configured multiple times with different parameters - e.g. `((branch_name))`.

## `((var))` syntax

The full syntax for vars is `((`_`source-name:secret-path.secret-field`_`))`.

The optional _source-name_ identifies the [var source](#var-sources-experimental) from which the value will be read. If
omitted (along with the `:` delimiter), the [cluster-wide credential manager](#the-cluster-wide-credential-manager) will
be used, or the value may be provided [statically](#static-vars). The special name `.` refers to
the [local var source](#local-var), while any other name refers to a [var source](#var-sources-experimental).

The required _secret-path_ identifies the location of the credential. The interpretation of this value depends on the
var source type. For example, with Vault this may be a path like `path/to/cred`. For the Kubernetes secret manager this
may just be the name of a secret. For credential managers which support path-based lookup, a secret-path without a
leading / may be queried relative to a predefined set of path prefixes. This is how the Vault credential manager
currently works; `foo` will be queried under `/concourse/(team name)/(pipeline name)/foo`.

The optional _secret-field_ specifies a field on the fetched secret to read. If omitted, the credential manager may
choose to read a 'default field' from the fetched credential if the field exists. For example, the Vault credential
manager will return the value of the `value` field if present. This is useful for simple single-value credentials where
typing `((foo.value))` would feel verbose.

The _secret-path_ and _secret-field_ may be surrounded by double quotes `"..."` if they contain special characters
like `.` and `:`. For instance, `((source:"my.secret"."field:1"))` will set the _secret-path_ to `my.secret` and the
_secret-field_ to `field:1`.

## The "`.`" var source {: #local-var }

The special var source name `.` refers to a "local var source."

The precise scope for these "local vars" depends on where they're being used. Currently, the only mechanism that uses
the local var source is the [`load_var` step](steps/load-var.md), which sets a var in a local var source provided to all
steps executed in the build.

## Interpolation

Values for vars are substituted structurally. That is, if you have `foo: ((bar))`, whatever value `((bar))` resolves to
will become the value of the `foo` field in the object. This can be a value of any type and structure: a boolean, a
simple string, a multiline credential like a certificate, or a complicated data structure like an array of objects.

This differs from text-based substitution in that it's impossible for a value to result in broken YAML syntax, and it
relieves the template author from having to worry about things like whitespace alignment.

When a `((var))` appears adjacent to additional string content, e.g. `foo: hello-((bar))-goodbye`, its value will be
concatenated with the surrounding content. If the `((var))` resolves to a non-string value, an error will be raised.

If you are using the YAML operator for merging `<<`, you will need to wrap it in double quotes like
so `"<<": ((foobars))`, to avoid a cryptic error message such as "error: yaml: map merge requires map or sequence of
maps as the value". This will allow you to merge in values from various vars.
See [YAML merge specification](https://yaml.org/type/merge.html) for more information on how this normally works.

## Static vars

Var values may also be specified statically using the [`set_pipeline` step](steps/set-pipeline.md)
and [`task` step](steps/task.md).

When running the [`fly` CLI](fly.md) equivalent
commands ([fly set-pipeline](pipelines/setting-pipelines.md#fly-set-pipeline)
and [fly execute](tasks.md#running-tasks-with-fly-execute)), var values may be provided using the following flags:

* `-v` or `--var NAME=VALUE` sets the string `VALUE` as the value for the var `NAME`.
* `-y` or `--yaml-var NAME=VALUE` parses `VALUE` as YAML and sets it as the value for the var `NAME`.
* `-i` or `--instance-var NAME=VALUE` parses `VALUE` as YAML and sets it as the value for the instance var `NAME`.
  See [Grouping Pipelines](pipelines/grouping-pipelines.md) to learn more about instance vars.
* `-l` or `--load-vars-from FILE` loads `FILE`, a YAML document containing mapping var names to values, and sets them
  all.

When used in combination with `-l`, the `-y` and `-v` flags take precedence. This way a vars file may be re-used,
overriding individual values by hand.

??? example "Setting values with the `task` step"

    Let's say we have a [task config](tasks.md#task-config-schema) like so:

    ```yaml
    platform: linux
    
    image_resource:
      type: registry-image
      source:
        repository: golang
        tag: ((tag))
    
    inputs:
      - name: booklit
    
    run:
      path: booklit/ci/unit
    ```

    We could use [vars](tasks.md#task-config-schema) to run this task against different versions of Go:

    ```yaml
    jobs:
      - name: unit
        plan:
          - get: booklit
            trigger: true
          - task: unit-1.13
            file: booklit/ci/unit.yml
            vars: { tag: 1.13 }
          - task: unit-1.8
            file: booklit/ci/unit.yml
            vars: { tag: 1.8 }
    ```

??? example "Setting values with `-v` and `-y`"

    With a pipeline template like so:

    ```yaml
    resources:
    - name: booklit
      type: booklit
      source:
        uri: https://github.com/concourse/booklit
        branch: ((branch))
        private_key: (("github.com".private_key))
    
    jobs:
    - name: unit
      plan:
      - get: booklit
        trigger: ((trigger))
      - task: unit
        file: booklit/ci/unit.yml
    ```

    Let's say we have a private key in a file called `private_key`.

    The [fly validate-pipeline](pipelines/setting-pipelines.md#fly-validate-pipeline) command may be used to test how 
    interpolation is applied, by passing the `--output` flag.

    ```shell
    fly validate-pipeline \
      -c pipeline.yml \
      -y trigger=true \
      -v \"github.com\".private_key="$(cat private_key)" \
      -v branch=master \
      --output
    ```

    The above incantation should print the following:

    ```yaml
    jobs:
      - name: unit
        plan:
          - get: booklit
            trigger: true
          - file: booklit/ci/unit.yml
            task: unit
    resources:
      - name: booklit
        type: booklit
        source:
          branch: master
          private_key: |
            -----BEGIN RSA PRIVATE KEY-----
            # ... snipped ...
            -----END RSA PRIVATE KEY-----
          uri: https://github.com/concourse/booklit
    ```

    Note that we had to use `-y` so that the `trigger: true` ends up with a boolean value instead of the 
    string `"true"`.

??? example "Loading values from files with `-l`"

    With a pipeline template like so:

    ```yaml
    resources:
      - name: booklit
        type: booklit
        source:
          uri: https://github.com/concourse/booklit
          branch: ((branch))
          private_key: (("github.com".private_key))
    
    jobs:
      - name: unit
        plan:
          - get: booklit
            trigger: ((trigger))
          - task: unit
            file: booklit/ci/unit.yml
    ```

    Let's say I've put the `private_key` var in a file called `vars.yml`, since it's quite large and hard to pass 
    through flags:

    ```yaml
    github.com:
      private_key: |
        -----BEGIN RSA PRIVATE KEY-----
        # ... snipped ...
        -----END RSA PRIVATE KEY-----
    ```

    The [fly validate-pipeline](pipelines/setting-pipelines.md#fly-validate-pipeline) command may be used to test how 
    interpolation is applied, by passing the `--output` flag.

    ```shell
    fly validate-pipeline \
      -c pipeline.yml \
      -l vars.yml \
      -y trigger=true \
      -v branch=master \
      --output
    ```
    
    The above incantation should print the following:

    ```yaml
    jobs:
      - name: unit
        plan:
          - get: booklit
            trigger: true
          - task: unit
            file: booklit/ci/unit.yml
    resources:
      - name: booklit
        type: booklit
        source:
          branch: master
          private_key: |
            -----BEGIN RSA PRIVATE KEY-----
            # ... snipped ...
            -----END RSA PRIVATE KEY-----
          uri: https://github.com/concourse/booklit
    ```

    Note that we had to use `-y` so that the `trigger: true` ends up with a boolean value instead of the 
    string `"true"`.

## Dynamic vars

Concourse can read values from "var sources" - typically credential managers like Vault - at runtime. This keeps them
out of your configuration and prevents sensitive values from being stored in your database. Values will be read from the
var source and optionally [cached](operation/creds/caching.md) to reduce load on the var source.

The following attributes can be parameterized through a var source:

* [resource.source](resources/index.md) under [pipeline.resources](pipelines/index.md#pipeline-schema)
* [resource_type.source](resource-types/index.md#resource_type-schema)
  under [pipeline.resources](pipelines/index.md#pipeline-schema)
* [resource.webhook_token](resources/index.md#resource-schema)
  under [pipeline.resources](pipelines/index.md#pipeline-schema)
* [task step params](tasks.md#task-config-schema) on a task step in a pipeline
* [tasks configuration](tasks.md) in their entirety - whether from task step file or task step config in a pipeline, or
  a config executed with [`fly execute`](tasks.md#running-tasks-with-fly-execute)

Concourse will fetch values for vars as late as possible - i.e. when a step using them is about to execute. This allows
the credentials to have limited lifetime and rapid rotation policies.

### Across Step & Dynamic Vars

For the [across step](steps/modifier-and-hooks/across.md), more fields can be dynamically interpolated during runtime:

* [set_pipeline step](steps/set-pipeline.md) identifier and [file](steps/set-pipeline.md) field
* [task step](steps/task.md) identifier, [input_mapping](steps/task.md), and [output_mapping](steps/task.md), in
  addition to the all other fields mentioned above for the task step

### Var sources (experimental)

!!! warning "Experimental Feature"

    `var_sources` was introduced in Concourse v5.8.0. It is considered an
    **experimental** feature until its implementation is complete. See
    [concourse/concourse#5229](https://github.com/concourse/concourse/issues/5229).

Var sources can be configured for a pipeline via [`pipeline.var_sources`](pipelines/index.md).

Each var source has a name which is then referenced as the _source-name_ in var syntax,
e.g. `((my-vault:test-user.username))` to fetch the `test-user` var from the `my-vault` var source.
See [`((var))` syntax](#var-syntax) for a detailed explanation of this syntax.

Currently, only these types are supported:

* [`vault`](#vault)
* [`dummy`](#dummy)
* [`ssm`](#ssm)
* [`secretmanager`](#secrets-manager) (since v7.7.0)
* [`idtoken`](#id-token) (since v7.14.0)

In the future we want to make use of something like
the [Prototypes (RFC #37)](https://github.com/concourse/rfcs/pull/37) so that third-party credential managers can be
used just like resource types.

#### `var_source` schema

??? warning "name: [string](config-basics.md#string-schema)"

    The name of the `((var))` source. This should be short and simple. This name will be referenced 
    [`((var))` syntax](#var-syntax) throughout the config.

!!! info "one of ..."

    === "Vault"
    
        ??? warning "**`type`**: `vault`"
    
            The `vault` type supports configuring a [Vault](https://www.vaultproject.io/) server as a `((var))` source.

        ??? warning "**`config`**: [`vault_config`](#vault_config-schema)"

            ### `vault_config` schema

            ??? warning "**`url`**: [`string`](config-basics.md#string-schema)"
            
                The URL of the Vault API.

            ??? info "**`ca_cert`**: [`string`](config-basics.md#string-schema)"

                The PEM encoded contents of a CA certificate to use when connecting to the API.

            ??? info "**`path_prefix`**: [`string`](config-basics.md#string-schema)"

                _Default `/concourse`_. A prefix under which to look for all credential values.

                See [Changing the path prefix](operation/creds/vault.md#changing-the-path-prefix) for more information.

            ??? info "**`lookup_templates`**: [`[string]`](config-basics.md#string-schema)"

                _Default `["/{{.Team}}/{{.Pipeline}}/{{.Secret}}", "/{{.Team}}/{{.Secret}}"]`_.

                A list of path templates to be expanded in a team and pipeline context subject to the `path_prefix` and 
                `namespace`.

                See [Changing the path templates](operation/creds/vault.md#changing-the-path-templates) for more 
                information.

            ??? info "**`shared_path`**: [`string`](config-basics.md#string-schema)"

                An additional path under which credentials will be looked up.

                See [Configuring a shared path](operation/creds/vault.md#configuring-a-shared-path) for more 
                information.

            ??? info "**`namespace`**: [`string`](config-basics.md#string-schema)"

                A [Vault namespace](https://www.vaultproject.io/docs/enterprise/namespaces/index.html) to operate under.

            ??? info "**`client_cert`**: [`string`](config-basics.md#string-schema)"

                A PEM encoded client certificate, for use with TLS based auth.

                See [Using the `cert` auth backend](operation/creds/vault.md#using-the-cert-auth-backend) for more 
                information.

            ??? info "**`client_key`**: [`string`](config-basics.md#string-schema)"

                A PEM encoded client key, for use with TLS based auth.

                See [Using the `cert` auth backend](operation/creds/vault.md#using-the-cert-auth-backend) for more 
                information.

            ??? info "**`server_name`**: [`string`](config-basics.md#string-schema)"

                The expected name of the server when connecting through TLS.

            ??? info "**`insecure_skip_verify`**: [`boolean`](config-basics.md#boolean-schema)"

                Skip TLS validation. Not recommended. Don't do it. No really, don't.

            ??? info "**`client_token`**: [`string`](config-basics.md#string-schema)"

                Authenticate via a periodic client token.

                See [Using a periodic token](operation/creds/vault.md#using-a-periodic-token) for more information.

            ??? info "**`auth_backend`**: [`string`](config-basics.md#string-schema)"

                Authenticate using an auth backend, e.g. `cert` or `approle`.

                See [Using the `approle` auth backend](operation/creds/vault.md#using-the-approle-auth-backend) or 
                [Using the `cert` auth backend](operation/creds/vault.md#using-the-cert-auth-backend) for more 
                information.

            ??? info "**`auth_params`**: [`env-vars`](config-basics.md#env-vars-schema)" 

                A key-value map of parameters to pass during authentication.

                See [Using the `approle` auth backend](operation/creds/vault.md#using-the-approle-auth-backend) for more
                information.

            ??? info "**`auth_max_ttl`**: [`duration`](config-basics.md#duration-schema)" 

                Maximum duration to elapse before forcing the client to log in again.

            ??? info "**`auth_retry_max`**: [`duration`](config-basics.md#duration-schema)" 

                When failing to authenticate, give up after this amount of time.

            ??? info "**`auth_retry_initial`**: [`duration`](config-basics.md#duration-schema)"

                When retrying during authentication, start with this retry interval. The interval will increase 
                exponentially until `auth_retry_max` is reached.
    
    === "Dummy"
    
        ??? warning "**`type`**: `dummy`"

            The `dummy` type supports configuring a static map of vars to values.

            This is really only useful if you have no better alternative for credential management but still have 
            sensitive values that you would like to [redact](operation/creds/redacting.md) them from build output.

        ??? warning "**`config`**: [`dummy_config`](#dummy_config-schema)"

            ### `dummy_config` schema

            ??? warning "**`vars`**: [`vars`](config-basics.md#vars-schema)"

                A mapping of var name to var value.
    
    === "SSM"
    
        ??? warning "**`type`**: `ssm`"

            The `SSM` type supports configuring an [AWS Systems Manager](https://aws.amazon.com/systems-manager/) 
            in a single region as a `((var))` source.
    
        ??? warning "**`config`**: [`ssm_config`](#ssm_config-schema)"

            ### `ssm_config` schema

            ??? warning "**`region`**: [`string`](config-basics.md#string-schema)"

                The AWS region to read secrets from.
    
    === "Secrets Manager"
    
        ??? warning "**`type`**: `secretsmanager`"

            The `secretsmanager` type supports configuring an [AWS Secrets 
            Manager](https://aws.amazon.com/secrets-manager/) in a single region as a `((var))` source.
    
        ??? warning "**`config`**: [`secretsmanager_config`](#secretsmanager_config-schema)"
    
            ### `secretsmanager_config` schema

            ??? warning "**`region`**: [`string`](config-basics.md#string-schema)"

                The AWS region to read secrets from.

    === "ID Token"
    
        ??? warning "**`type`**: `idtoken`"

            The `idtoken` type issues JWTs which are signed by concourse and contain information about the currently 
            running pipeline/job.

            These JWTs can be used to authenticate with external services.
    
        ??? warning "**`config`**: [`idtoken_config`](#idtoken_config-schema)"

            ### `idtoken_config` schema

            ??? warning "**`audience`**: [`[string]`](config-basics.md#string-schema)"

                A list of audience-values to place into the token's aud-claim.

            ??? info "**`subject_scope`**: `team` | `pipeline` | `instance` | `job` | [`string`](config-basics.md#string-schema)"
            
                _Default `pipeline`_.

                Determines what is put into the token's sub-claim. See 
                [Subject Scope](operation/creds/id-token.md#subject-scope) for a detailed explanation.

            ??? info "**`expires_in`**: [`duration`](config-basics.md#duration-schema)"

                _Default `1h`_. Cannot be longer than `24h`.

                How long the token should be valid.

            ??? info "**`algorithm`**: `RS256` | `ES256` | [`string`](config-basics.md#string-schema)"

                _Default `RS256`_.

                The signature algorithm to use for the token.

### The cluster-wide credential manager

Concourse can be configured with a single cluster-wide credential manager, which acts as a source for any vars which do
not specify a source name.

See [Credential Management](operation/creds/index.md) for more information.

!!! note

    In the future we would like to introduce support for multiple cluster-wide var sources, configured using the 
    [`var_source` schema](#var_source-schema), and begin deprecating the [cluster-wide credential 
    manager](#the-cluster-wide-credential-manager).