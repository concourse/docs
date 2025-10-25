---
title: Set Pipeline Step
---

# `set_pipeline` Step

Configures a [pipeline](../pipelines/index.md). Expand each section below for more details and examples.

Pipelines configured with the `set_pipeline` step are connected to the [job](../jobs.md) that configured them and will
be automatically archived in the following scenarios:

* When the job that previously set a pipeline runs a successful build which did not configure the pipeline (i.e.
  the `set_pipeline` step was removed for that specific pipeline).
* When the job is removed from its pipeline configuration (see [`job.old_name`](../jobs.md) for renaming instead of
  removing).
* When the job's pipeline is archived or destroyed.

This means any job that uses `set_pipeline` should set all still-desired pipelines in each build, rather than setting
them one-by-one through many builds.

See [`fly archive-pipeline`](../pipelines/managing-pipelines.md#fly-archive-pipeline) for what happens when a pipeline
is archived.