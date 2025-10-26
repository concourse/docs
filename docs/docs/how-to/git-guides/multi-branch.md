---
title: Multi-Branch Workflows
---

Teams may make use of multiple branches for their development. For instance, some teams create feature branches while
working on new functionality - once this functionality is ready, the branch will be merged into the main branch and the
feature branch will be deleted.

While a feature is under development, you'll often want to run tests against the feature branch and possibly deploy to a
staging environment. To model this in Concourse, you'll need to have a pipeline for each active feature branch. Manually
setting (and eventually archiving) a pipeline for each feature branch would be quite a burden. For this type of
workflow, Concourse has a few important tools to help you out: the [`set_pipeline` step](../../steps/set-pipeline.md), [
`across`](../../steps/modifier-and-hooks/across.md), and [instanced pipelines](../../pipelines/grouping-pipelines.md).

!!! warning "Experimental Feature"

    [`across`](../../steps/modifier-and-hooks/across.md) and [instanced 
    pipelines](../../pipelines/grouping-pipelines.md) are both experimental features, and must be enabled with the 
    feature flags `CONCOURSE_ENABLE_ACROSS_STEP` and `CONCOURSE_ENABLE_PIPELINE_INSTANCES`, respectively.

In this guide, we'll cover:

1. Writing a pipeline to [Test, Build & Deploy](#test-build-deploy) a branch to a staging environment. We'll
   use [Terraform](https://www.terraform.io/) for our deployment
2. [Tracking Branches](#tracking-branches) in a repository; for each branch, we'll set a pipeline (using the [
   `set_pipeline` step](../../steps/set-pipeline.md) and [across](../../steps/modifier-and-hooks/across.md))
3. Automatically [Cleaning Up Old Workspaces](#cleaning-up-old-workspaces) after branches get merged or deleted

## Test, Build & Deploy

We'll start out by defining the pipeline that should run for each active branch. For this example, we'll be working with
the following [sample Go application](https://github.com/concourse/examples/tree/master/apps/golang).

Our pipeline will have three stages:

1. Run unit tests
2. Build and upload a binary to a blobstore (in our case, we'll
   use [Google Cloud Storage](https://cloud.google.com/storage))
3. Trigger a `terraform apply` to deploy our app to a staging environment.
   The [Terraform module](https://github.com/concourse/examples/blob/master/terraform/staging/main.tf) we'll use here
   doesn't actually provision any infrastructure, and is just used as an example

Since the pipeline config is intended to be used as a template for multiple different branches, we can
use [Vars](../../vars.md) to parameterize the config. In particular, we'll use the vars `((feature))` and `((branch))`,
which represent the name of the feature and the name of the branch, respectively.

Below is the full pipeline config from
the [Examples Repo](https://github.com/concourse/examples/blob/master/pipelines/multi-branch/template.yml):

```yaml linenums="1" title="template.yml"
--8<-- "libs/examples/pipelines/multi-branch/template.yml"
```

## Tracking Branches

In addition to the branch pipeline template, we'll also need a pipeline to track the list of branches and set a pipeline
for each one.

To track the list of branches in a repository, we can use [
`aoldershaw/git-branches-resource`](https://github.com/aoldershaw/git-branches-resource). This [
`resource_type`](../../resource-types/index.md) emits a new [resource version](../../resources/resource-versions.md)
whenever a branch is created or deleted. It also lets us filter the list of branches by a regular expression. In this
case, let's assume our feature branches match the regular expression `feature/.*`.

Below is the current pipeline config for this tracker pipeline:

```yaml linenums="1" title="tracker.yml"
resource_types:
  - name: git-branches
    type: registry-image
    source:
      repository: aoldershaw/git-branches-resource

resources:
  - name: feature-branches
    type: git-branches
    source:
      uri: https://github.com/concourse/examples
      # The "(?P<name>pattern)" syntax defines a named capture group.
      # aoldershaw/git-branches-resource emits the value of each named capture
      # group under the `groups` key.
      #
      # e.g. feature/some-feature ==> {"groups": {"feature": "some-feature"}}
      branch_regex: 'feature/(?P<feature>.*)'

  - name: examples
    type: git
    source:
      uri: https://github.com/concourse/examples

jobs:
  - name: set-feature-pipelines
    plan:
      - in_parallel:
          - get: feature-branches
            trigger: true
          - get: examples
      - load_var: branches
        file: feature-branches/branches.json
      - across:
          - var: branch
            values: ((.:branches))
        set_pipeline: dev
        file: examples/pipelines/multi-branch/template.yml
        instance_vars: { feature: ((.:branch.groups.feature)) }
        vars: { branch: ((.:branch.name)) }
```

We set each pipeline as an [instanced pipeline](../../pipelines/grouping-pipelines.md) - this will result in Concourse
grouping all the related `dev` pipelines in the UI.

## Cleaning Up Old Workspaces

With the setup described in [Tracking Branches](#tracking-branches), Concourse will automatically archive any pipelines
for branches that get removed. However, Concourse doesn't know that it should destroy Terraform workspaces when a branch
is removed. To accomplish this, we can yet again make use of
the [Terraform resource](https://github.com/ljfranklin/terraform-resource) to destroy these workspaces. We'll add
another job to
the [tracker pipeline](https://github.com/concourse/examples/blob/master/pipelines/multi-branch/tracker.yml) that
figures out which workspaces don't belong to an active branch and destroy them.

```yaml linenums="1" title="template.yml"
--8<-- "libs/examples/pipelines/multi-branch/tracker.yml"
```