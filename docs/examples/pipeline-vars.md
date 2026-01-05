---
title: Pipeline ((vars)) example
search:
  exclude: true
hide:
  - toc
---

# Pipeline `((vars))` example

You can use params in a pipelines configuration file.

<div>
  <div style="position:relative;padding-top:40%;">
    <iframe src="https://ci.concourse-ci.org/teams/examples/pipelines/pipeline-vars" allowfullscreen
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
  </div>
</div>

## Pipeline Configuration

```yaml linenums="1"
--8<-- "libs/examples/pipelines/pipeline-vars.yml"
```

## Variables

```yaml linenums="1"
--8<-- "libs/examples/pipelines/vars-file.yml"
```

## References

* [Jobs](../docs/jobs.md)
* [Steps](../docs/steps/index.md)
* [Tasks](../docs/tasks.md)
