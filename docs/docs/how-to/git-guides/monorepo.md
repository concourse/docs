---
title: Monorepo Workflows
---

All of these examples use the
[concourse/git-resource](https://github.com/concourse/git-resource) resource
type. That resource is the most popular git resource for Concourse since it is
shipped in the
[concourse/concourse](https://hub.docker.com/r/concourse/concourse) image and
in the tarball on the [GitHub release
page](https://github.com/concourse/concourse/releases). It is not the only
resource available for working with git-related resources. If you don't see
your use-case on this page then there is probably another resource that you can
use. Check out the [Resource Types](../../../resource-types-list.md) page for
other Git-related resources.

Check out the
[README](https://github.com/concourse/git-resource/blob/master/README.md) for
the git resource for all configuration options.

## Prerequisite

We will use the main
[concourse/concourse](https://github.com/concourse/concourse/) repository as
our example monorepo.

## Automatically Trigger Jobs Based on Paths or Files

We want our job(s) to trigger when commits changing certain paths in our
monorepo are made. We can tell the git resource which paths those are and it'll
filter the commit to only those affecting the given list of `paths`.

Here's an example that triggers the `tests` job when any changes are made to
the `atc/api/` path in the `concourse/concourse` repository.

```yaml
resources:
- name: repo
  type: git
  source:
    uri: https://github.com/concourse/concourse.git
    paths:
      - atc/api/*

jobs:
- name: tests
  plan:
    - get: repo
      trigger: true
```

You can add more items to the `paths` list as well. The git resource will find
any commits that match at least one of the paths.

```yaml
resources:
- name: repo
  type: git
  source:
    uri: https://github.com/concourse/concourse.git
    paths:
      - atc/engine/*
      - atc/exec/*
      - atc/runtime/*
      - atc/worker/*

jobs:
- name: tests
  plan:
    - get: repo
      trigger: true
```

Lastly, you can specify specific files to trigger job(s).

```yaml
resources:
- name: repo
  type: git
  source:
    uri: https://github.com/concourse/concourse.git
    paths:
      - package.json
      - web/wats/package.json
      - testflight/package.json

jobs:
- name: tests
  plan:
    - get: repo
      trigger: true
```

There is also `ignore_paths` which is the inverse of `paths`, for cases when
it's easier to specify which paths/files you want to ignore.

## Trigger on Paths But Use Latest Commit

You might want your pipeline to only trigger when changes are made to specific
paths or files, but then want to actually run your tests or deploy your code
based on the latest commit available for the monorepo.

To do that, we need to define two instances of the git resource. One to trigger
the job, and a second to pull in the latest commit.

```yaml
resources:
- name: api
  type: git
  source:
    uri: https://github.com/concourse/concourse.git
    paths:
      - atc/api/*

- name: repo
  type: git
  source:
    uri: https://github.com/concourse/concourse.git

jobs:
- name: tests
  plan:
    - in_parallel:
      # trigger job with the "api" resource
      - get: api
        trigger: true
      # pull in latest commit with the "repo" resource
      - get: repo
```

Both `api` and `repo` `get` steps will download the repository.

## Only Check-out Specific Paths

Monorepos can get quite large, so there are some settings we can use to reduce
how much of the repository is checked out in our `get` steps:

- `source.sparse_paths` allows you to not download all files/paths in your monorepo. Only checkout the files/paths you need.
- `get.params.depth` so we don't pull down too much branch history. If you don't need any branch history, setting this to `1` is reasonable.

Here's an example using both of the above settings.

```yaml
resources:
- name: repo
  type: git
  source:
    uri: https://github.com/concourse/concourse.git
    # only trigger on changes to fly and only checkout the fly directory
    paths:
      - fly/*
    sparse_paths:
      - fly/*

jobs:
- name: tests
  plan:
    - get: repo
      trigger: true
      params:
        depth: 1
    # Step to verify that we've only checked out the fly directory
    - task: view-fly
      config:
        platform: linux
        image_resource:
          type: mock
          source: {mirror_self: true}
        inputs:
          - name: repo
        run:
          path: sh
          args:
            - -c
            - |
              set -x
              ls -lh ./repo
              ls -lh ./repo/fly

```
