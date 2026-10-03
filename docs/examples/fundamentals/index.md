---
title: Fundamentals
hide:
  - toc
---

Bare pipeline files for the basics — copy one, deploy it with
[`fly set-pipeline`](../../docs/pipelines/setting-pipelines.md#fly-set-pipeline), and
poke at it. No walkthrough attached.

New to Concourse?

The [Getting Started tutorial](../../docs/getting-started/index.md) in the Docs covers
the same ground with full explanations and a guided setup — start there instead if
you haven't run a Concourse pipeline before.

<div class="grid cards" markdown>

-   __Hello World Pipeline__

    ---

    The smallest possible pipeline: one job, one task, one `echo`.
    See also: the tutorial version in
    [Getting Started](../../docs/getting-started/hello-world.md).

    [:octicons-arrow-right-24: View example](hello-world.md)

-   __Inputs and Outputs__

    ---

    Pass files between tasks in the same job using inputs and outputs.
    See also: the tutorial version in
    [Getting Started](../../docs/getting-started/inputs-outputs.md).

    [:octicons-arrow-right-24: View example](inputs-outputs.md)

-   __Set Pipeline Example__

    ---

    Use a `set_pipeline` step so a pipeline can configure other pipelines
    (or itself).

    [:octicons-arrow-right-24: View example](set-pipeline.md)

</div>

Once these feel familiar, move on to [Pipeline Patterns](../pipeline-patterns/index.md)
for more advanced shapes.