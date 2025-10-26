---
title: Steps
---

Each [job](../jobs.md) has a single build plan configured as [`job.plan`](../jobs.md#job-schema). A build plan is a 
recipe for what to run when a build of the job is created.

A build plan is a sequence of steps:

* the [`task` step](task.md) runs a [task](../tasks.md)
* the [`get` step](get.md) fetches a [resource](../resources/index.md)
* the [`put` step](put.md) updates a [resource](../resources/index.md)
* the [`set_pipeline` step](set-pipeline.md) configures a [pipeline](../pipelines/index.md)
* the [`load_var` step](load-var.md) loads a value into a [local var](../vars.md#local-var)
* the [`in_parallel` step](in-parallel.md) runs steps in parallel
* the [`do` step](do.md) runs steps in sequence
* the [`across` step](modifier-and-hooks/across.md) modifier runs a step multiple times; once for each combination of
  variable values
* the [`try` step](try.md) attempts to run a step and succeeds even if the step fails

When a new version is available for a `get` step with `trigger: true` configured, a new build of the job will be created
from the build plan.

When viewing the job in the pipeline, resources that are used as `get` steps appear as inputs, and resources that are
used in `put` steps appear as outputs. Jobs are rendered downstream of any jobs they reference in `passed` constraints,
connected by the resource.

If any step in the build plan fails, the build will fail and subsequent steps will not be executed. Additional steps may
be configured to run after failure by configuring [`on_failure`](modifier-and-hooks/on-failure.md)
or [`ensure`](modifier-and-hooks/ensure.md) (or the job equivalents, `job.on_failure` and `job.ensure`).