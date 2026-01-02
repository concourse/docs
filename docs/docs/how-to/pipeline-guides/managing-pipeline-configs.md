---
title: Managing Pipeline Configurations
---

When first starting with Concourse, it is common to write the pipeline and set it with `fly set-pipeline`. This works
fine when initially building a pipeline or testing out some new changes. Once you're past the initial building phase
though, you probably want to store your pipeline YAML files somewhere that you and others on your team can access and
update the pipeline without worrying about remembering to do `fly set-pipeline` every time. A Git repository is a good
place to store your pipeline YAML files, so our pipeline management conventions start with a Git repository.

Most other CI/CD tools will tell you to store your "pipeline" or "workflow" configuration files in a `.something`
directory in your app's git repository. You could do that with Concourse too and create a `.concourse` directory, but
Concourse does not force any convention onto you. There are _so many ways_ that you could store and manage your pipeline
configuration files. The most common way is to use a Git repository, but there's nothing stopping you from using a
versioned S3 bucket either.

Let's cover the two most common conventions for storing pipeline configurations.

## 1) In Your App's Git Repository

This is what most users will be familiar with coming from other CI/CD tools. Simply make a folder in the same repository
as your code. Name the folder whatever you want. Some possible names if you need inspiration:

* `ci`
* `concourse`
* `pipelines`

Then store your pipeline YAML files in that directory. Again, there's no "special way" that Concourse expects you to
store your pipeline YAML files. Do whatever makes sense to you!

To automatically update your pipeline in Concourse with what's stored in your Git repository, use the [
`set_pipeline` step](../../steps/set-pipeline.md) in a job. You can view an example of a pipeline updating
itself [in the examples section](../../../examples/set-pipeline.md). There are also examples on the [
`set_pipeline` step](../../steps/set-pipeline.md) page.

## 2) In a Different Git Repository

This is the most common convention that Concourse users follow, especially if your pipelines interact with multiple Git
repositories. The Concourse project does this; we store all of our pipeline and task YAML files in [
`github.com/concourse/ci`](https://github.com/concourse/ci), completely separate from the main repository at [
`github.com/concourse/concourse`](https://github.com/concourse/concourse) and all
the [resource type repositories](https://github.com/concourse/?q=resource).

### 2.a) Parent-Child Pipeline Relationships

!!! tip

    The following is also described on the [`set_pipeline` step](../../steps/set-pipeline.md) page.

If you are setting multiple pipelines, or multiple instances of the same pipeline, it can be helpful to manage them from
one place. Concourse allows you to use the `set_pipeline` step to create other pipelines.
The [set_pipeline step](../../steps/set-pipeline.md) is not limited to updating the current pipeline.

When you use one pipeline to create other pipelines, this creates a parent-child relationship that Concourse tracks. You
can see an example of this [here in `set-pipelines.yml`](../../../examples/set-pipeline.md).

As long as the parent pipeline continues to set/update the child pipeline(s), the child pipeline(s) will remain active.
If the parent pipeline stops updating the child pipeline(s) (e.g. you updated the parent pipeline to not set/update the
child pipeline(s) anymore), Concourse
will [archive the pipeline](../../pipelines/managing-pipelines.md#fly-archive-pipeline). This pauses the child pipeline(
s) and hides them from the web UI. The child pipeline configuration is deleted, but its build logs are retained.

If you want to fully delete a pipeline, use [
`fly destroy-pipeline`](../../pipelines/managing-pipelines.md#fly-destroy-pipeline).