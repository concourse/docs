---
title: Common Pipeline Practices
---

The following are practices that we see a lot of people use in their pipelines. These are by no means "Best" practices,
they are simply common and may or may not work for you and your team.

## Parallelizing Get Steps in Jobs

All jobs usually have [`get` steps](../../steps/get.md) as their first set of steps.

```yaml
jobs:
  - name: awesome-job
    plan:
      - get: cool-code
      - get: funny-binary
      - get: the-weather
      - task: business-stuff
```

To reduce the waiting time to the length of the longest running get step, put all `get` steps under an [
`in_parallel` step](../../steps/in-parallel.md).

```yaml
jobs:
  - name: awesome-job
    plan:
      - in_parallel:
          - get: cool-code
          - get: funny-binary
          - get: the-weather
      - task: business-stuff
```

## Specify Inputs for Put Steps

By default, [`put` step's](../../steps/put.md) have all artifacts from a job mounted in their resource container. This
can result in long initialization times for put steps. It's likely that a [`put` step](../../steps/put.md) only needs a
subset of all available artifacts generated throughout the job.

There are two ways to specify which artifacts to send to a [`put` step](../../steps/put.md). You can specify `detect` as
the [`put` step `inputs`](../../steps/put.md), or you can pass in an exact list of all artifacts the [
`put` step](../../steps/put.md) needs.

Using `detect`:

```yaml
jobs:
  - name: the-job
    plan: # Get some artifacts
      - in_parallel:
          - get: apples
          - get: apple-basket
          - get: monkeys
      # using detect will result in "apples-location" and "basket" being passed in
      # "monkeys" will not be passed in
      - put: apples-in-basket
        inputs: detect
        params:
          apples-location: apples/location # matches the first get step
          basket: apple-basket # matches the second get step
```

Specifying the exact inputs needed for the [`put` step](../../steps/put.md):

```yaml
jobs:
  - name: the-job
    plan: # Get some artifacts
      - in_parallel:
          - get: apples
          - get: apple-basket
          - get: monkeys
      - put: apples-in-basket
        inputs: [ apples, apple-basket ] # specify the exact inputs needed
        params:
          apples-location: apples/location
          basket: apple-basket
```

## Putting Task Configs in Files

A lot of the pipeline examples that you will find on this site and in resource repos will embed a [`task` step
`config`](../../steps/task.md) directly in the pipeline. This is a nice way of clearly seeing what inputs/outputs the
task uses. Tasks are usually designed to be used in multiple places, maybe with slightly different configuration. To
support this scenario, most users store task configs in files instead of embedding the config directly in the pipeline.

Here's what this looks like in practice:

```yaml title="print-date.yml, stored in some git repo under a folder named tasks"
platform: linux

image_resource: # define a default image for the task to use
  type: registry-image
  source:
    repository: busybox

run:
  path: date
  args: [ "+%Y-%m-%d" ]
```

Using the task in a pipeline:

```yaml title="pipeline.yml"
resources:
  - name: ci
    type: git
    source:
      uri: https://github.com/concourse/examples.git

jobs:
  - name: the-best-job
    plan:
      - get: ci
      - task: today
        file: ci/tasks/print-date.yml
```

## `Get` Images for Tasks Instead of using Anonymous Image Resources

It is easy to let Concourse fetch images for tasks right when they are needed by using the `task-config.image_resource`
field in a [task config](../../steps/task.md). It's the easy out-of-the-box solution. Another way is to pass the image
for a task as an input to the job by setting the [`task` step `image`](../../steps/task.md) field. This also allows you
to track the version of the image being used by the task and also avoid getting rate-limited by configuring the resource
with credentials.

=== "Before"

    ```yaml title="Anonymous Image Fetching for Tasks"
    jobs:
      - name: job
        plan:
          - task: simple-task
            config:
              platform: linux
              image_resource: # anonymous image resource
                type: registry-image
                source:
                  repository: busybox
              run:
                path: echo
                args: [ "Hello world!" ]
    ```
=== "After"

    ```yaml title="Passing Task Image as Job Inputs"
    resources:
      - name: busybox
        type: registry-image
        source:
          repository: busybox
          username: ((docker.user))
          password: ((docker.password))
    
    jobs:
      - name: job
        plan:
          - get: busybox # pass image into job
          - task: simple-task
            image: busybox # use image for task. Overrides anonymous image
            config:
              platform: linux
              run:
                path: echo
                args: [ "Hello world!" ]
    ```