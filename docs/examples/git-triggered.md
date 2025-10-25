---
title: git-triggered job example
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

* [Resources](https://concourse-ci.org/resources.html)
* [Jobs](https://concourse-ci.org/jobs.html)
* [Steps](https://concourse-ci.org/steps.html)
* [Tasks](https://concourse-ci.org/tasks.html)