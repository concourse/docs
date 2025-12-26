---
title: Docs
---

Concourse is a pipeline-based continuous thing-doer.

The term "pipeline" has become widespread in CI discussions, so being precise about what this means is important;
Concourse's pipelines differ significantly from others.

[Pipelines](pipelines/index.md) are built around [Resources](resources/index.md), which represent all external state,
and [Jobs](jobs.md), which interact with them. Concourse pipelines function as dependency flows, similar to distributed
`Makefile`s. Pipelines are designed to be self-contained to minimize server-wide configuration. Maximizing portability
also reduces risk, making it simpler for projects to recover from CI disruptions.

[Resources](resources/index.md) like the [`git` resource](https://github.com/concourse/git-resource) and [
`s3`](https://github.com/concourse/s3-resource) resource are used to express source code, dependencies, deployments, and
other external states. This interface also models more abstract concepts like scheduled or interval triggers, via
the [time resource](https://github.com/concourse/time-resource).

[Resource Types](resource-types/index.md) are defined within the pipeline itself, making the pipelines more
self-sufficient while keeping Concourse lean and versatile without needing a complex plugin system.

[Jobs](jobs.md) are sequences of [`get`](steps/get.md), [`put`](steps/put.md), and [`task`](steps/task.md) steps to
execute. These [steps](steps/index.md) determine the job's inputs and outputs. Jobs are designed to be idempotent and
loosely coupled, allowing the pipeline to evolve with project needs without requiring engineers to maintain too much
context simultaneously.

Everything in Concourse runs in a container. Instead of modifying workers to install build tools, [Tasks](tasks.md)
define their own container image (typically using Docker images via the [
`registry-image` resource](https://github.com/concourse/registry-image-resource)).

## ...What?

Concourse admittedly has a steeper learning curve initially, and depending on your background it might seem like a lot
to grasp. A key goal of this project is for that curve to flatten out shortly after and lead to greater productivity and
reduced stress over time.

If this all sounds confusing, that's OK - you may want to simply continue onward, start experimenting a bit, and use the
above as a quick reference of the "big picture" as your understanding develops.