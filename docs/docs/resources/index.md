---
title: Resources
---

Resources are the heart and soul of Concourse. They represent all external inputs to and outputs of [jobs](../jobs.md)
in the pipeline.

Each resource represents a versioned artifact with an external source of truth. Configuring the same resource in any
pipeline on any Concourse cluster will behave the exact same way. Concourse will continuously `check` each configured
resource to discover new versions. These versions then flow through the pipeline via [`get` steps](../steps/get.md)
configured on [Jobs](../jobs.md).

More concretely, resources are containers that run on your workers.
See [Implementing a Resource Type](../resource-types/implementing.md) for more details.

A pipeline's resources are listed under [`pipeline.resources`](../pipelines/index.md#pipeline-schema) with the following
schema.

## `resource` schema