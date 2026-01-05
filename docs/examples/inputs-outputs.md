---
title: Task inputs and outputs example
search:
  exclude: true
hide:
  - toc
---

A task can pass an artifacts to another task in the same job.

<div>
  <div style="position:relative;padding-top:40%;">
    <iframe src="https://ci.concourse-ci.org/teams/examples/pipelines/task-passing-artifact/jobs/create-and-consume/builds/1" allowfullscreen
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
  </div>
</div>

Tasks within a job have the ability to pass artifacts directly inbetween them to allow you to process artifacts in many
ways.

While you are free to create as many jobs as you'd like for your pipeline, you have to use resources to pass artifacts
inbetween them.

These constructs give you the ability to design a pipeline that can process artifacts in many different ways
via [Tasks](../docs/tasks.md), and then store those processed artifacts externally
via [Resources](../docs/resources/index.md).

## Pipeline Configuration

```yaml linenums="1"
--8<-- "libs/examples/pipelines/task-passing-artifact.yml"
```

## References

* [`task-config.outputs`](../docs/tasks.md#output-schema)
* [Jobs](../docs/jobs.md)
* [Steps](../docs/steps/index.md)
* [Tasks](../docs/tasks.md)
