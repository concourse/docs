---
title: Setting Pipelines
---

Pipelines are configured entirely via the [`fly` CLI](../fly.md) or the [
`set_pipeline` step](https://concourse-ci.org/set-pipeline-step.html#set-pipeline). There is no GUI for configuring
pipelines.

## `fly set-pipeline`

To submit a pipeline configuration to Concourse from a file on your local disk you can use the `-c` or `--config` flag,
like so:

```shell
fly -t example set-pipeline \
    --pipeline my-pipeline \
    --config pipeline.yml
```

This will present a diff of the changes and ask you to confirm the changes. If you accept then Concourse's pipeline
configuration will switch to the pipeline definition in the YAML file specified.

The `-c` or `--config` flag can also take in the value `-` to indicate reading from `stdin`:

```shell
cat pipeline.yml | fly -t example set-pipeline \
    --pipeline my-pipeline \
    --config -
```

Note that reading from `stdin` disables the confirmation prompt - the pipeline will be set automatically.

### Providing static values for vars

The pipeline configuration can contain [Vars](../vars.md) which may be replaced
with [static values](../vars.md#static-vars) or [loaded at runtime](../vars.md#dynamic-vars). This allows for
credentials to be extracted from a pipeline config, making it safe to check in to a public repository or pass around.

For example, if you have a `pipeline.yml` as follows:

```yaml
resources:
  - name: private-repo
    type: git
    source:
      uri: git@...
      branch: master
      private_key: ((private-repo-key))
```

... you could then configure this pipeline like so:

```shell
fly -t example set-pipeline \
    --pipeline my-pipeline \
    --config pipeline.yml \
    --var "private-repo-key=$(cat id_rsa)"
```

Or, if you had a `vars.yml` as follows:

```yaml
private-repo-key: |
  -----BEGIN RSA PRIVATE KEY-----
  ...
  -----END RSA PRIVATE KEY-----
```

... you could configure it like so:

```shell
fly -t example set-pipeline \
    --pipeline my-pipeline \
    --config pipeline.yml \
    --load-vars-from vars.yml
```

You can use nested fields in your `pipeline.yml` as follows:

```yaml
resources:
  - name: private-repo
    type: git
    source:
      uri: git@((repo.uri))
      branch: ((repo.branch))
      private_key: (("github.com".private-repo-key))
```

... you could configure it by `--load-vars-from` with a `vars.yml` as follows:

```yaml
repo:
  uri: github.com/...
  branch: master
github.com:
  private-repo-key: |
    -----BEGIN RSA PRIVATE KEY-----
    ...
    -----END RSA PRIVATE KEY-----
```

... or you could also configure it by passing the vars as flags:

```shell
fly -t example set-pipeline \
    --pipeline my-pipeline \
    --config pipeline.yml \
    --var "repo.uri=github.com" \
    --var "repo.branch=master" \
    --var "\"github.com\".private-repo-key=$(cat id_rsa)"
```

When configuring a pipeline, any vars not provided statically will be left to
resolve [at runtime](../vars.md#dynamic-vars). To check that all vars are resolvable, you can pass the `--check-creds`
flag:

```shell
fly -t example set-pipeline \
    --pipeline my-pipeline \
    --config pipeline.yml \
    --load-vars-from vars.yml \
    --check-creds
```

This will fill in all statically-provided vars and then attempt to resolve all remaining vars server-side. If any fail
to resolve, configuring the pipeline will fail.

## `fly validate-pipeline`

To validate a local pipeline configuration without submitting it to Concourse, run `validate-pipeline`:

```shell
fly validate-pipeline --config pipeline.yml
```

By default, pipeline errors will cause `validate-pipeline` to fail, but warnings won't. To fail on both errors and
warnings, pass the `--strict` flag.

## `fly format-pipeline`

To format a pipeline config in a "canonical" form (i.e. keys are in normal order, with `name` first for example), run:

```shell
fly format-pipeline --config pipeline.yml
```

This will print the formatted pipeline config to `stdout`. To update the file in-place, pass `--write/-w`.