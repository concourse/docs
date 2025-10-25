---
title: Grouping Pipelines
---

!!! warning "Experimental Feature"

    Instanced Pipelines/Instance Groups are currently experimental, and are subject to change.

    To experiment with Instanced Pipelines on your deployment, you need to set the feature flag 
    `--enable-pipeline-instances` (`CONCOURSE_ENABLE_PIPELINE_INSTANCES=true`)

Although pipelines operate independently of one another, it's not uncommon to have several pipelines that are highly
related, and possibly derived from the same pipeline template. It's useful to be able to group these pipelines to reduce
clutter and improve navigation. For this, Concourse has the concept of Instanced Pipelines and Instance Groups, where an
Instance Group composes several related Instanced Pipelines.

For instance, suppose you support multiple version lines of your software (v1.0.x and v2.0.x, say), and want a pipeline
for each version line in order to facilitate delivering patch releases. You create a common pipeline template that
uses [Vars](../vars.md) to specialize each pipeline:

```yaml
resources:
  - name: repo
    type: git
    source:
      uri: git@...
      # The only difference between the pipelines is the git branch to use
      branch: release/v((version))

jobs:
  - name: test
    plan: [ ... ]

  - name: deploy-to-staging
    plan: [ ... ]

  - name: release
    plan: [ ... ]
```

Before Concourse v7.0.0, you might set multiple pipelines with the version information encoded in the pipeline name,
e.g.:

```shell
fly -t example set-pipeline \
    --pipeline release-1.0.x \
    --config template.yml \
    --var version=1.0.x

fly -t example set-pipeline \
    --pipeline release-2.0.x \
    --config template.yml \
    --var version=2.0.x
```

The downside to this approach is that things can get disorganized quickly as the number of pipelines increases, which
can make the UI cluttered and hard to navigate. Additionally, not everything can easily be encoded into the pipeline
name, especially with the restrictions on [identifiers](../config-basics.md#identifier-schema) - while it's readable in
this case, it can get unwieldy as the number of variables in the template grows.

The recommended approach is to construct an Instance Group where each version has its own Instanced Pipeline:

```shell
fly -t example set-pipeline \
    --pipeline release \
    --config template.yml \
    --instance-var version=1.0.x

fly -t example set-pipeline \
    --pipeline release \
    --config template.yml \
    --instance-var version=2.0.x
```

There are only a few differences from the previous approach in terms of creating the pipelines:

1. We give each Instanced Pipeline the same name (in this case, `release`), and
2. We use the `--instance-var` flag instead of `--var`. Doing so makes the variable name and value a part of the
   pipeline's identifier ([Managing Instanced Pipelines](#managing-instanced-pipelines) describes how to work with
   Instanced Pipelines in [fly](../fly.md))

!!! warning

      The `-i` or `--instance-var` flag behaves like the `-y` or `--yaml-var`, meaning instance vars can hold arbitrary 
      YAML/JSON data. The `-v` or `--var` flag, on the other hand, only defines strings. See 
      [Static vars](../vars.md#static-vars) to learn the difference between the flags

!!! note

      There are no [fly](../fly.md) commands for constructing an Instance Group - Concourse logically groups all 
      Instanced Pipelines with the same name into a single Instance Group. Instanced Pipelines have the same pipeline 
      semantics as other pipelines - they are just organized and identified in a different way.

## Managing Instanced Pipelines

Instanced Pipelines can be managed via [fly](../fly.md) as described in [Managing Pipelines](managing-pipelines.md),
with one important distinction - since instance vars are a part of the pipeline's identifier, the `--pipeline` flag must
include both the name of the Instance Group as well as the instance vars. The `--pipeline` flag takes the form:

```shell
fly ... --pipeline group/var1:value1,var2:value2
```

As a concrete example, to pause the `release` Instanced Pipeline with `version:1.0.x`, you would issue the following
command:

```shell
fly -t example pause-pipeline --pipeline release/version:1.0.x
```

Let's look at a more complicated example - suppose you have an Instanced Pipeline that was set using one of the
following commands:

```shell
fly -t example set-pipeline \
    --pipeline upgrade \
    --config template.yml \
    --instance-var version.from=1.0.0 \
    --instance-var version.to=2.0.0 \
    --instance-var branch=feature/foo
# ...or equivalently
fly -t example set-pipeline \
    --pipeline upgrade \
    --config template.yml \
    --instance-var 'version={from: 1.0.0, to: 2.0.0}' \
    --instance-var branch=feature/foo
```

!!! tip

      Using dot-notation here (as in the first command) is recommended since YAML is finicky about spaces.
      
      For instance, had we used `--instance-var 'version={from:1.0.0, to:2.0.0}'` (no spaces between keys and values), 
      we would end up with the following object (represented as JSON):
      
      ```json
      {"from:1.0.0": null, "to:2.0.0": null}
      ```
      
      Specifying each field individually using dot-notation is harder to mess up.

Here, there are two instance vars: `version`, that contains the object `{"from": "1.0.0", "to": "2.0.0"}`, and `branch`,
that contains the string `"feature/foo"`. In order to pause this pipeline, you could issue one of the following
commands:

```shell
fly -t example pause-pipeline \
    --pipeline 'upgrade/version.from:1.0.0,version.to:2.0.0,branch:"feature/foo"'
# ... or equivalently
fly -t example pause-pipeline \
    --pipeline 'upgrade/version:{from: 1.0.0, to: 2.0.0},branch:"feature/foo"'
```

For accessing sub-fields of an object, we can either use dot-notation as described
in [Providing static values for vars](setting-pipelines.md#providing-static-values-for-vars), or we can define the
object in full as valid YAML.

!!! warning

      If the instance var name or value contains a "special character" (`.`, `,`, `/`, `{`, `}`, or whitespace), it 
      must be surrounded by double quotes `"`. Depending on your shell, this usually means the entire flag must be 
      quoted, since otherwise your shell will try to expand the quotes.

### `fly order-instanced-pipelines`

To configure the ordering of instanced pipelines within an individual instance group, run:

```shell
fly -t example order-instanced-pipelines \
    --group group \
    --pipeline key1:value1 \
    --pipeline key2:value2 \
    --pipeline key3:value3
```

!!! note

      This command only ensures that the given pipelines are in the given order. If there are other pipelines that you 
      haven't included in the command, they may appear in-between, before, or after the given set.

!!! warning

      If you want to reorder pipelines outside of an individual instance group, you should use the 
      [`fly order-pipelines`](managing-pipelines.md#fly-order-pipelines) command.

### Managing Jobs and Resources

[Managing Jobs](../jobs.md) and [Managing Resources](../resources/managing-resources.md) walk you through some of the
commands you can use to manage jobs and resources within pipelines. For Instanced Pipelines, we need to encode the
instance vars in the `--job` and `--resource` flags. These flags now take the form:

```shell
fly ... --job group/var1:value1,var2:value2/job
```

and

```shell
fly ... --resource group/var1:value1,var2:value2/resource
```

For instance, to trigger the `test` job of `release/version:1.0.x`, we issue the following command:

```shell
fly -t example trigger-job --job release/version:1.0.x/test
```

To check the `repo` resource of `release/version:1.0.x`, we issue the following command:

```shell
fly -t example check-resource --resource release/version:1.0.x/repo
```