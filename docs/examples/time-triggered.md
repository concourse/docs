---
title: time-triggered job example
search:
  exclude: true
hide:
  - toc
---

# `time`-triggered job example

The [`time` resource](https://github.com/concourse/time-resource) can be used to trigger a job.

<div>
  <div style="position:relative;padding-top:40%;">
    <iframe src="https://ci.concourse-ci.org/teams/examples/pipelines/time-triggered" allowfullscreen
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
  </div>
</div>

## Pipeline Configuration

```yaml linenums="1"
--8<-- "libs/examples/pipelines/time-triggered.yml"
```

## References

* [Resources](../docs/resources/index.md)
* [Jobs](../docs/jobs.md)
* [Steps](../docs/steps/index.md)
* [Tasks](../docs/tasks.md)
