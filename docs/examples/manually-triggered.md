---
title: Manually triggered job example
search:
  exclude: true
hide:
  - toc
---

A job can be triggered by a resource. After it's complete, the next job can run automatically or manually.

<div>
  <div style="position:relative;padding-top:40%;">
    <iframe src="https://ci.concourse-ci.org/teams/examples/pipelines/manual-trigger" allowfullscreen
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
  </div>
</div>

## Pipeline Configuration

```yaml linenums="1"
--8<-- "libs/examples/pipelines/manually-triggered.yml"
```

## References

* [Resources](../docs/resources/index.md)
* [Jobs](../docs/jobs.md)
* [Steps](../docs/steps/index.md)
* [Tasks](../docs/tasks.md)
