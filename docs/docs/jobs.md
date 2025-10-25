---
title: Jobs
---

Jobs determine the actions of your pipeline. They determine how [resources](resources/index.md) progress through it, and
how the pipeline is visualized.

The most important attribute of a job is its build plan, configured as job.plan. This determines the sequence
of [Steps](steps/index.md) to execute in any builds of the job.

A pipeline's jobs are listed under [`pipeline.jobs`](pipelines/index.md#pipeline-schema) with the following schema:

## `job` schema

## Managing Jobs

### `fly jobs`

To list the jobs configured in a pipeline, run:

```shell
fly -t example jobs -p my-pipeline
```

### `fly trigger-job`

To immediately queue a new build of a job, run:

```shell
fly -t example trigger-job --job my-pipeline/my-job
```

This will enqueue a new build of the `my-job` job in the `my-pipeline` pipeline.

To start watching the newly created build, append the `--watch` flag like so:

```shell
fly -t example trigger-job --job my-pipeline/my-job --watch
```

You can also queue new builds by clicking the `+` button on the job or build pages in the web UI.

### `fly rerun-build`

To queue a new build of a job with exactly the same inputs as a given build of the same job, run:

```shell
To queue a new build of a job with exactly the same inputs as a given build of the same job, run:
```

This will enqueue a new build of the `my-job` job in the `my-pipeline` pipeline, using the same input versions as build
number 4.

To start watching the newly created build, append the `--watch` flag like so:

```shell
fly -t example rerun-build --job my-pipeline/my-job --build 4 --watch
```

You can also rerun builds by visiting the build page for the build in question in the web UI and clicking the rerun
button.

### `fly pause-job`

To prevent scheduling and running builds of a job, run:

```shell
fly -t example pause-job --job my-pipeline/my-job
```

This will prevent pending builds of the job from being scheduled, though builds that are in-flight will still run, and
pending builds will still be created as normal.

### `fly unpause-job`

To resume scheduling of a job, run:

```shell
fly -t example unpause-job --job my-pipeline/my-job
```

This will resume scheduling of builds queued for the job.

### `fly clear-task-cache`

If you've got a [task cache](tasks.md#task-config-schema) that you need to clear out for whatever reason, this can be
done like so:

```shell
fly -t example clear-task-cache --job my-pipeline/my-job --step my-step-name
```

This will immediately invalidate the caches - they'll be garbage collected asynchronously and subsequent builds will run
with empty caches.

You can also clear out a particular path for the given step's cache, using `--cache-path`:

```shell
fly -t example clear-task-cache \
    --job my-pipeline/my-job \
    --step my-step-name \
    --cache-path go/pkg
```

If `--cache-path` is not specified, all caches for the given step will be cleared.