---
title: Examples
search:
  exclude: true
hide:
  - toc
---

Setting up self-contained Concourse [pipelines](https://concourse-ci.org/pipelines.html) is an excellent way to
experiment before exploring the more comprehensive documentation.

Each example presents a pipeline YAML snippet which can be copied to a local file and deployed to your instance via [
`fly set-pipeline`](https://concourse-ci.org/setting-pipelines.html#fly-set-pipeline). From there you can experiment and
modify parts of the configuration to better understand how everything works. All configuration options are detailed in
the [Docs](../docs/index.md).

For a practical real-world example,
examine [Concourse's own pipeline](https://ci.concourse-ci.org/teams/main/pipelines/concourse) (and
its [configuration](https://github.com/concourse/ci/blob/master/pipelines/concourse.yml)):

<div>
  <div style="position:relative;padding-top:75%;">
    <iframe src="https://ci.concourse-ci.org/teams/main/pipelines/concourse" allowfullscreen
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
  </div>
</div>
