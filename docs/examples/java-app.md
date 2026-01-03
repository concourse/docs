---
title: Java application testing example
search:
  exclude: true
hide:
  - toc
---

You can run the tests for a Java application.

<div>
  <div style="position:relative;padding-top:40%;">
    <iframe src="https://ci.concourse-ci.org/teams/examples/pipelines/java" allowfullscreen
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
  </div>
</div>

## Pipeline Configuration

```yaml linenums="1"
--8<-- "libs/examples/pipelines/java.yml"
```

## References

* [Jobs](https://concourse-ci.org/jobs.html)
* [Steps](https://concourse-ci.org/steps.html)
* [Tasks](https://concourse-ci.org/tasks.html)
