---
title: git-triggered job example
search:
  exclude: true
hide:
  - toc
---

# `git`-triggered job example

The [`git` resource](https://github.com/concourse/git-resource) can be used to trigger a job.

<div>
  <div style="position:relative;padding-top:40%;">
    <iframe src="https://ci.concourse-ci.org/teams/examples/pipelines/git-triggered" allowfullscreen
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
  </div>
</div>

## Pipeline Configuration



```yaml linenums="1"
--8<-- "libs/examples/pipelines/git-triggered.yml"
```

## References

* [Resources](../docs/resources/index.md)
* [Jobs](../docs/jobs.md)
* [Steps](../docs/steps/index.md)
* [Tasks](../docs/tasks.md)
