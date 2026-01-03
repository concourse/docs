---
title: Serial job example
search:
  exclude: true
hide:
  - toc
---

Setting the [`job.serial`](https://concourse-ci.org/jobs.html#schema.job.serial) flag restricts a job to run one build
at a time.

<div>
  <div style="position:relative;padding-top:40%;">
    <iframe src="https://ci.concourse-ci.org/teams/examples/pipelines/serial-job" allowfullscreen
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
  </div>
</div>

By default, jobs are run in parallel. For some use cases this might be ideal (ex. testing all incoming commits from a
repository). For other use cases this might be less ideal (ex. deploying an application).

You can also set the [`job.max_in_flight`](https://concourse-ci.org/jobs.html#schema.job.max_in_flight) value to 1 to
disable parallel job runs.

## Pipeline Configuration

```yaml linenums="1"
--8<-- "libs/examples/pipelines/serial-job.yml"
```

## References

* [Jobs](https://concourse-ci.org/jobs.html)
* [Steps](https://concourse-ci.org/steps.html)
* [Tasks](https://concourse-ci.org/tasks.html)
