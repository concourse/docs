---
title: Steps
---

Each [job](../jobs.md) has a single build plan configured as [`job.plan`](../jobs.md#job-schema). A build plan is a 
recipe for what to run when a build of the job is created.

A build plan is a sequence of steps:

<div class="grid cards" markdown>

-  Task

    ---
    Run a pure function of code

    [:octicons-arrow-right-24: Configure](task.md)

-  Get

    ---
    Fetch data from a [Resource](../resources/index.md)

    [:octicons-arrow-right-24: Configure](get.md)

-  Put

    ---
    Update data of a [Resource](../resources/index.md)

    [:octicons-arrow-right-24: Configure](put.md)

-  Set Pipeline

    ---
    Configure a pipeline using a pipeline

    [:octicons-arrow-right-24: Configure](set-pipeline.md)

-  In Parallel

    ---
    Run multiple steps at a time

    [:octicons-arrow-right-24: Configure](in-parallel.md)

-  Load Var

    ---
    Create a new variable scoped to the job

    [:octicons-arrow-right-24: Configure](load-var.md)

-  Do

    ---
    Run multiple steps serially

    [:octicons-arrow-right-24: Configure](do.md)

-  Try

    ---
    Continue regardless of outcome

    [:octicons-arrow-right-24: Configure](try.md)

</div>

When a new version is available for a `get` step with `trigger: true` configured, a new build of the job will be created
from the build plan.

When viewing the job in the pipeline, resources that are used as `get` steps appear as inputs, and resources that are
used in `put` steps appear as outputs. Jobs are rendered downstream of any jobs they reference in `passed` constraints,
connected by the resource.

If any step in the build plan fails, the build will fail and subsequent steps
will not be executed. Additional steps may be configured to run after failure by
configuring [`on_failure`](modifier-and-hook/on-failure.md) or
[`ensure`](modifier-and-hook/ensure.md) (or the job equivalents,
[`job.on_failure`](../jobs.md) and [`job.ensure`](../jobs.md)) using [Hooks and
Modifiers](modifier-and-hooks).
