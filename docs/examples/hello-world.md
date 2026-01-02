---
title: Hello World pipeline
hide:
  - toc
---

A single job is the simplest form of pipeline.

<div>
  <div style="position:relative;padding-top:40%;">
    <iframe src="https://ci.concourse-ci.org/teams/examples/pipelines/job" allowfullscreen
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
  </div>
</div>

While this is less of an example pipeline, this is a simple introduction to a critical primitive to form pipelines.

Also, due to the fact that there are minimal external factors ([Resources](https://concourse-ci.org/resources.html)) for
the system to check and resolve, this is often used to test overall system health.

## Pipeline Configuration

```yaml linenums="1"
--8<-- "libs/examples/pipelines/hello-world.yml"
```

## References

* [Jobs](https://concourse-ci.org/jobs.html)
* [Steps](https://concourse-ci.org/steps.html)
* [Tasks](https://concourse-ci.org/tasks.html)