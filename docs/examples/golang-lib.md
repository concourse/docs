---
title: Golang library testing example
search:
  exclude: true
hide:
  - toc
---

You can run the tests for a Golang library across any specified versions.

<div>
  <div style="position:relative;padding-top:40%;">
    <iframe src="https://ci.concourse-ci.org/teams/examples/pipelines/golang-lib" allowfullscreen
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
  </div>
</div>

This example shows how to have multiple versions of a language, environment, or dependency fetched and integrated in to
a [Pipeline](https://concourse-ci.org/pipelines.html).

For these Docker images, defining them as [Resources](https://concourse-ci.org/resources.html) has two advantages for
this use case. First, this enables the pipeline to be triggered when there are new versions of those images available.
Second, referencing them in the task's [`task` step **`image`
**](https://concourse-ci.org/task-step.html#schema.task.image) param is helpful as it will ensure consistency between
the image versions fetched by the [Resource](https://concourse-ci.org/resources.html) and the image version running in
the job.

## Pipeline Configuration

```yaml linenums="1"
--8<-- "libs/examples/pipelines/golang-lib.yml"
```

## References

* [Jobs](https://concourse-ci.org/jobs.html)
* [Steps](https://concourse-ci.org/steps.html)
* [Tasks](https://concourse-ci.org/tasks.html)
