---
title: Docs
---

Concourse is a pipeline-based continuous thing-doer.

The term "pipeline" has become widespread in CI discussions, so being precise about what this means is important;
Concourse's pipelines differ significantly from others.

Pipelines are built around Resources, which represent all external state, and Jobs, which interact with them. Concourse
pipelines function as dependency flows, similar to distributed Makefiles. Pipelines are designed to be self-contained to
minimize server-wide configuration. Maximizing portability also reduces risk, making it simpler for projects to recover
from CI disruptions.

Resources like the git resource and s3 resource are used to express source code, dependencies, deployments, and other
external states. This interface also models more abstract concepts like scheduled or interval triggers, via the time
resource.

Resource Types are defined within the pipeline itself, making the pipelines more self-sufficient while keeping Concourse
lean and versatile without needing a complex plugin system.

Jobs are sequences of get, put, and task steps to execute. These steps determine the job's inputs and outputs. Jobs are
designed to be idempotent and loosely coupled, allowing the pipeline to evolve with project needs without requiring
engineers to maintain too much context simultaneously.

Everything in Concourse runs in a container. Instead of modifying workers to install build tools, Tasks define their own
container image (typically using Docker images via the registry-image resource).

## ...What?

Concourse admittedly has a steeper learning curve initially, and depending on your background it might seem like a lot
to grasp. A key goal of this project is for that curve to flatten out shortly after and lead to greater productivity and
reduced stress over time.

If this all sounds confusing, that's OK - you may want to simply continue onward, start experimenting a bit, and use the
above as a quick reference of the "big picture" as your understanding develops.