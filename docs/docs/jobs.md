---
title: Jobs
---

Jobs determine the actions of your pipeline. They determine how [resources](resources/index.md) progress through it, and
how the pipeline is visualized.

The most important attribute of a job is its build plan, configured as job.plan. This determines the sequence
of [Steps](steps/index.md) to execute in any builds of the job.

A pipeline's jobs are listed under [`pipeline.jobs`](pipelines/index.md#pipeline-schema) with the following schema:

## `job` schema

??? warning "**`name`**: [`identifier`](config-basics.md#identifier-schema) (required)"

    The name of the job. This should be short; it will show up in URLs. If you want to rename a job, use `job.old_name`.

??? warning "`steps`: [`[step]`](steps/index.md) (required)"

    The sequence of [steps](steps/index.md) to execute.

??? info "**`old_name`**: [`identifier`](config-basics.md#identifier-schema)"

    The old name of the job. If configured, the history of old job will be inherited to the new one. Once the pipeline 
    is set, this field can be removed as the builds have been transfered.

    ??? example "Renaming a job"
    
        This can be used to rename a job without losing its history, like so:
        
        ```yaml
        jobs:
          - name: new-name
            old_name: current-name
            plan:
              - get: 10m
        ```
        
        After the pipeline is set, because the builds have been inherited, the job can have the field removed:
        
        ```yaml
        jobs:
          - name: new-name
            plan:
              - get: 10m
        ```

??? info "**`serial`**: [`boolean`](config-basics.md#boolean-schema)"

    _Default `false`_. If set to `true`, builds will queue up and execute one-by-one, rather than executing in parallel.

??? info "**`serial_groups`**: [`[identifier]`](config-basics.md#identifier-schema)"

    _Default `[]`_. When set to an array of arbitrary tag-like strings, builds of this job and other jobs referencing 
    the same tags will be serialized.

    ??? example "Limiting parallelism"
    
        This can be used to ensure that certain jobs do not run at the same time, like so:
        
        ```yaml
        jobs:
          - name: job-a
            serial_groups:
              - some-tag
        
          - name: job-b
            serial_groups:
              - some-tag
              - some-other-tag
        
          - name: job-c
            serial_groups:
              - some-other-tag
        ```
        
        In this example, `job-a` and `job-c` can run concurrently, but neither job can run builds at the same time as 
        `job-b`.
        
        The builds are executed in their order of creation, across all jobs with common tags.

??? info "**`max_in_flight`**: [`number`](config-basics.md#number-schema)"

    If set, specifies a maximum number of builds to run at a time. If `serial` or `serial_groups` are set, they take 
    precedence and force this value to be `1`.

??? info "**`build_log_retention`**: [`build_log_retention_policy`](#build_log_retention_policy-schema)"

    Configures the retention policy for build logs. This is useful if you have a job that runs often but after some 
    amount of time the logs aren't worth keeping around.

    Builds which are not retained by the configured policy will have their logs reaped. If this configuration is 
    omitted, logs are kept forever (unless [Build log retention](install/running-web.md#build-log-retention) is 
    configured globally).

    ??? example "A complicated example"

        The following example will keep logs for any builds that have completed in the last 2 days, while also keeping 
        the last 1000 builds and at least 1 succeeded build.

        ```yaml
        jobs:
          - name: smoke-tests
            build_log_retention:
              days: 2
              builds: 1000
              minimum_succeeded_builds: 1
            plan:
              - get: 10m
              - task: smoke-tests
                # ...
        ```

        If more than 1000 builds finish in the past 2 days, _all_ of them will be retained thanks to the `days` 
        configuration. Similarly, if there are 1000 builds spanning more than 2 days, they will also be kept thanks to 
        the `builds` configuration. And if they all happened to have failed, the `minimum_succeeded_builds` will keep 
        around at least one successful build. All policies operate independently.

    ### `build_log_retention_policy` schema

    ??? info "**`days`**: [`number`](config-basics.md#number-schema)"
    
        Keep logs for builds which have finished within the specified number of days.
    
    ??? info "**`builds`**: [`number`](config-basics.md#number-schema)"
    
        Keep logs for the last specified number of builds.
    
    ??? info "**`minimum_succeeded_builds`**: [`number`](config-basics.md#number-schema)"
    
        Keep a minimum number of successful build logs that would normally be reaped.
    
        Requires `builds` to be set to an integer higher than 0 in order to work. For example, if `builds` is set to 5, 
        and this attribute to 1, say a job has the following build history: 7(f), 6(f), 5(f), 4(f), 3(f), 2(f), 1(s), 
        where f means failed and s means succeeded, then builds 2 and 3 will be reaped, because it retains 5 build logs,
        and at least 1 succeeded build log. Default is 0.

??? info "`public`: [`boolean`](config-basics.md#boolean-schema)"

    _Default `false`_. If set to `true`, the build log of this job will be viewable by unauthenticated users. 
    Unauthenticated users will always be able to see the inputs, outputs, and build status history of a job. This is 
    useful if you would like to expose your pipeline publicly without showing sensitive information in the build log.

    !!! note
    
        When this is set to `true`, any [`get` step](steps/get.md) and [`put` steps](steps/put.md) will show the 
        metadata for their resource version, regardless of whether the resource itself has set 
        [`resource.public`](resources/index.md#resource-schema) to `true`.

??? info "`disable_manual_trigger`: [`boolean`](config-basics.md#boolean-schema)"

    _Default `false`_. If set to `true`, manual triggering of the job (via the web UI or 
    [`fly trigger-job`](#fly-trigger-job)) will be disabled.

??? info "`interruptible`: [`boolean`](config-basics.md#boolean-schema)"

    _Default `false`_. Normally, when a worker is shutting down it will wait for builds with containers running on that 
    worker to finish before exiting. If this value is set to `true`, the worker will not wait on the builds of this job.
    You may want this if you have a self-deploying Concourse or long-running-but-low-importance jobs.

??? info "`on_success`: [`step`](steps/index.md)"

    Step to execute when the job succeeds. Equivalent to the [`on_success`](steps/modifier-and-hooks/on-success.md) 
    hook.

??? info "`on_failure`: [`step`](steps/index.md)"

    Step to execute when the job fails. Equivalent to the [`on_failure`](steps/modifier-and-hooks/on-failure.md) 
    hook.

??? info "`on_error`: [`step`](steps/index.md)"

    Step to execute when the job errors. Equivalent to the [`on_error`](steps/modifier-and-hooks/on-error.md) 
    hook.

??? info "`on_abort`: [`step`](steps/index.md)"

    Step to execute when the job aborts. Equivalent to the [`on_abort`](steps/modifier-and-hooks/on-abort.md) 
    hook.

??? info "`ensure`: [`step`](steps/index.md)"

    Step to execute regardless of whether the job succeeds, fails, errors, or aborts. Equivalent to the 
    [`ensure`](steps/modifier-and-hooks/ensure.md) hook.

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
