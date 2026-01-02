---
title: Managing Pipelines
---

## `fly pipelines`

To list the currently-configured pipelines and their paused state, run:

```shell
fly -t example pipelines
```

By default, archived pipelines are not included in the output of this command. To view archived pipelines,
provide `--include-archived` flag.

## `fly rename-pipeline`

To rename a pipeline, run:

```shell
fly -t example rename-pipeline \
  --old-name my-pipeline \
  --new-name my-cool-pipeline
```

All job history is retained when renaming a pipeline.

## `fly pause-pipeline`

To pause a pipeline, run:

```shell
fly -t example pause-pipeline --pipeline my-pipeline
```

This will prevent jobs from being scheduled and stop the periodic checking for new versions of resources. Builds that
are in-flight will still finish.

## `fly unpause-pipeline`

To unpause a pipeline, run:

```shell
fly -t example unpause-pipeline --pipeline my-pipeline
```

This will resume job scheduling and resource checking.

## `fly expose-pipeline`

By default, newly configured pipelines are only visible to the pipeline's team. To make a pipeline viewable by other
teams and unauthenticated users, run:

```shell
fly -t example expose-pipeline --pipeline my-pipeline
```

This feature is useful if you're using Concourse for an open source project and you'd like your community to be able to
see into your build pipeline.

To undo this change, see [`fly hide-pipeline`](#fly-hide-pipeline).

Exposing a pipeline reveals basically everything except for build output and resource metadata.

To expose a resource's metadata, [resource.public](../resources/index.md) must be set to `true`.

To expose a job's build output, [job.public](../jobs.md) must be set to `true`. This will also reveal resource metadata
for any [`get` step](../steps/get.md) or [`put` steps](../steps/put.md) in the build output.

## `fly hide-pipeline`

If you realize that you've made a terrible mistake in [exposing your pipeline](#fly-expose-pipeline), you can run:

```shell
fly -t example hide-pipeline --pipeline my-pipeline
```

If you're panicking you can run the command's short form, `hp`, instead.

## `fly get-pipeline`

Fly can be used to fetch and update the configuration for your pipelines. This is achieved by using
the [`fly get-pipeline`](#fly-get-pipeline) and [`fly set-pipeline`](setting-pipelines.md#fly-set-pipeline)
commands. For example, to fetch the current configuration of your `my-pipeline` Concourse pipeline and print it
on `STDOUT` run the following:

```shell
fly -t example get-pipeline --pipeline my-pipeline
```

To get JSON instead of YAML you can use the `-j` or `--json` argument. This can be useful when inspecting your config
with [jq](http://stedolan.github.io/jq/).

## `fly destroy-pipeline`

Every now and then you just don't want a pipeline to be around anymore. Running `fly destroy-pipeline` will stop the
pipeline activity and remove all data collected by the pipeline, including build history and collected versions.

For example, to destroy the `my-pipeline` pipeline, you would run:

```shell
fly -t example destroy-pipeline --pipeline my-pipeline
```

## `fly order-pipelines`

To configure the ordering of pipelines, run:

```shell
fly -t example order-pipelines \
  --pipeline pipeline-1 \
  --pipeline pipeline-2 \
  --pipeline pipeline-3
```

Note that this command only ensures that the given pipelines are in the given order. If there are other pipelines that
you haven't included in the command, they may appear in-between, before, or after the given set.

!!! warning

    If you want to reorder instanced pipelines within an individual instance group, you should use
    the [`fly order-instanced-pipelines`](grouping-pipelines.md#fly-order-instanced-pipelines) command.

## `fly archive-pipeline`

A pipeline can be archived via fly. This means that the pipeline will be paused and hidden from the web UI. The pipeline
config will be deleted (so any secrets or interpolated [Vars](../vars.md) will be removed) while the build logs will be
retained.

```shell
fly -t example archive-pipeline -p pipeline-1
```

To unarchive a pipeline, simply set the pipeline again with the same name
using [fly set-pipeline](setting-pipelines.md#fly-set-pipeline). If a job in the new pipeline has the same name as a job
in the archived pipeline, the old build logs for that job will be restored.

Note that because the config is deleted, [`fly get-pipeline`](#fly-get-pipeline) will no longer work for archived
pipelines.