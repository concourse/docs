---
title: Set Pipelines Example
search:
  exclude: true
hide:
  - toc
---

You can set a static set of pipelines from another pipeline on the same team.

<div>
  <div style="position:relative;padding-top:40%;">
    <iframe src="https://ci.concourse-ci.org/teams/examples/pipelines/set-pipelines" allowfullscreen
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
  </div>
</div>

## Pipeline Configuration

```yaml linenums="1"
--8<-- "libs/examples/pipelines/set-pipelines.yml"
```

## References

* [Jobs](../docs/jobs.md)
* [Steps](../docs/steps/index.md)
* [`set-pipeline` step](../docs/steps/set-pipeline.md)
