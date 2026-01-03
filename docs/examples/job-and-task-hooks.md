---
title: Job & task hooks example
search:
  exclude: true
hide:
  - toc
---

Job hooks like [`job.on_success`](https://concourse-ci.org/jobs.html#schema.job.on_success) and Step hooks like [
`on_success`](https://concourse-ci.org/on-success-step.html#schema.on_success) are available to perform actions based on
the success, failure, or abortion of a job.

<div>
  <div style="position:relative;padding-top:40%;">
    <iframe src="https://ci.concourse-ci.org/teams/examples/pipelines/hooks" allowfullscreen
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
  </div>
</div>

## Pipeline Configuration

```yaml linenums="1"
--8<-- "libs/examples/pipelines/job-and-task-hooks.yml"
```

## References

* [`job.on_success`](https://concourse-ci.org/jobs.html#schema.job.on_success)
* [`job.on_failure`](https://concourse-ci.org/jobs.html#schema.job.on_failure)
* [`job.on_abort`](https://concourse-ci.org/jobs.html#schema.job.on_abort)
* [`on_success`](https://concourse-ci.org/on-success-step.html#schema.on_success)
* [`on_failure`](https://concourse-ci.org/on-failure-hook.html#schema.on_failure)
* [`on_abort`](https://concourse-ci.org/on-abort-hook.html#schema.on_abort)
* [Jobs](https://concourse-ci.org/jobs.html)
* [Steps](https://concourse-ci.org/steps.html)
* [Tasks](https://concourse-ci.org/tasks.html)
