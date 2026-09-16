---
title: Examples & Guides
hide:
  - toc
---

Practical, copy-pasteable pipelines and task-oriented guides for building with Concourse.
Every page here gives you something runnable — deploy it with
[`fly set-pipeline`](../docs/pipelines/setting-pipelines.md#fly-set-pipeline), then adapt it to your use case.
For full configuration reference, see the [Docs](../docs/index.md).

<div class="grid cards" markdown>

-   :material-flask-outline:{ .lg .middle } __Fundamentals__

    ---

    Bare, copy-pasteable pipeline files for the basics — no walkthrough
    attached. New to Concourse? Try the guided
    [Getting Started tutorial](../docs/getting-started/index.md) instead.

    [:octicons-arrow-right-24: View guides](fundamentals/index.md)

-   :material-sitemap-outline:{ .lg .middle } __Pipeline Patterns__

    ---

    Common shapes: gating on approval, scheduling jobs, passing vars,
    and structuring configuration as pipelines grow.

    [:octicons-arrow-right-24: View guides](pipeline-patterns/index.md)

-   :material-source-branch:{ .lg .middle } __Git Workflows__

    ---

    Triggering off commits, working across branches, and handling
    monorepos with multiple independently-versioned projects.

    [:octicons-arrow-right-24: View guides](git-workflows/index.md)

-   :material-docker:{ .lg .middle } __Container Images__

    ---

    Build images as part of a pipeline and use them in later steps.

    [:octicons-arrow-right-24: View guides](container-images/index.md)

-   :material-tools:{ .lg .middle } __Task Composition & Hooks__

    ---

    React to success, failure, and errors, and share data between
    tasks in the same job.

    [:octicons-arrow-right-24: View guides](task-composition/index.md)

-   :material-language-python:{ .lg .middle } __Language Pipelines__

    ---

    Ready-to-adapt CI pipelines for Go, Ruby on Rails, Java, Node.js,
    and PHP projects.

    [:octicons-arrow-right-24: View guides](language-pipelines/index.md)

-   :material-key-outline:{ .lg .middle } __Credentials & Identity Federation__

    ---

    Authenticate pipelines to Vault, AWS, and Azure without storing
    long-lived secrets.

    [:octicons-arrow-right-24: View guides](credentials/index.md)

-   :material-file-code-outline:{ .lg .middle } __Templating with ytt__

    ---

    Cut down on repeated YAML by templating pipelines with ytt before
    setting them.

    [:octicons-arrow-right-24: View guides](templating/index.md)

</div>

For a practical, real-world example, see
[Concourse's own pipeline](https://ci.concourse-ci.org/teams/main/pipelines/concourse)
and its [configuration](https://github.com/concourse/ci/blob/master/pipelines/concourse.yml).

<div>
  <div style="position:relative;padding-top:75%;">
    <iframe src="https://ci.concourse-ci.org/teams/main/pipelines/concourse?hide_ui=true" allowfullscreen
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
  </div>
</div>