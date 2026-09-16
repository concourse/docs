---
title: Templating with ytt
hide:
  - toc
---

Concourse deliberately has no built-in templating (see [Config Basics](../../docs/config-basics.md) for why), so if a
pipeline's YAML is getting repetitive, the recommended path is to reach for an external templating tool and render plain
YAML before you set the pipeline. These guides use [ytt](https://carvel.dev/ytt/), the Carvel project's YAML templating
tool, since it understands YAML structure natively rather than treating it as text.

Both guides follow the same shape: template files in, `ytt -f <path> > out.yml`
to render, then `fly set-pipeline` (or a `set_pipeline` step) on the result.

<div class="grid cards" markdown>

-   __Templating a Single Pipeline__

    ---

    Start here. Extract repeated values into a data values file and
    render a single pipeline with ytt.

    [:octicons-arrow-right-24: View guide](ytt-single-pipeline.md)

-   __Templating Across Multiple Files__

    ---

    Split a template across multiple files — useful once a pipeline's
    template grows past what's comfortable in one file — and render
    them together.

    [:octicons-arrow-right-24: View guide](ytt-multi-file-pipeline.md)

</div>

Looking to automate the render-and-set step itself, rather than run `ytt` locally? See how the Concourse project does it
in [`set-pipelines.yml`](https://github.com/concourse/examples/blob/main/pipelines/set-pipelines.yml), which runs `ytt`
inside a task and feeds the rendered output straight into `set_pipeline` steps.

For other approaches to keeping pipeline config maintainable — not specific to ytt —
see [Managing Pipeline Configurations](../pipeline-patterns/managing-pipeline-configs.md).