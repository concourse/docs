---
title: Job & task hooks example
search:
  exclude: true
hide:
  - toc
---

Job hooks like [`job.on_success`](../docs/jobs.md#job-schema) and Step hooks like [
`on_success`](../docs/steps/modifier-and-hooks/on-success.md) are available to perform actions based on
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

* [`job.on_success`](../docs/jobs.md#job-schema)
* [`job.on_failure`](../docs/jobs.md#job-schema)
* [`job.on_abort`](../docs/jobs.md#job-schema)
* [`on_success`](../docs/steps/modifier-and-hooks/on-success.md)
* [`on_failure`](../docs/steps/modifier-and-hooks/on-failure.md)
* [`on_abort`](../docs/steps/modifier-and-hooks/on-abort.md)
* [Jobs](../docs/jobs.md)
* [Steps](../docs/steps/index.md)
* [Tasks](../docs/tasks.md)
