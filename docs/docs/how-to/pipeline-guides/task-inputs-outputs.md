---
title: Exploring Task Input and Output Scenarios
---

Understanding how task inputs and outputs work in Concourse can be a little confusing initially. This guide will walk
you through a few example pipelines to show you how inputs and outputs work within a single Concourse job. By the end
you should understand how inputs and outputs work within the context of a single job.

To run the pipelines in the following examples yourself you can get your own Concourse running locally by following
the [Quick Start](../../getting-started/quick-start.md) guide. Then use [
`fly set-pipeline`](../../pipelines/setting-pipelines.md#fly-set-pipeline) to see the pipelines in action.

## 1) - Passing Inputs Between Tasks

This pipeline will show us how to create outputs and pass outputs as inputs to the next [step](../../steps/index.md) in
a [job plan](../../jobs.md).

This pipeline has two tasks. The first task outputs a file with the date. The second task reads and prints the contents
of the file from the first task.

Here's a visualization of the job.

![](assets/task-inputs-outputs-01.gif)

```yaml title="passing-artifacts.yml" linenums="1"
busybox: &busybox #YAML anchor
  type: registry-image
  source:
    repository: busybox

jobs:
  - name: the-job
    plan:
      - task: create-one-output
        config:
          platform: linux
          image_resource: *busybox
          outputs:
            # Concourse will make an empty dir with this name
            # and save the contents for later steps
            - name: the-output
          run:
            path: /bin/sh
            args:
              - -cx
              - |
                ls -lah
                date > ./the-output/file
      - task: read-output-from-previous-step
        config:
          platform: linux
          image_resource: *busybox
          # You must explicitly name the inputs you expect
          # this task to have.
          # If you don't then outputs from previous steps
          # will not appear in the step's container.
          # The name must match the output from the previous step.
          # Try removing or renaming the input to see what happens!
          inputs:
            - name: the-output
          run:
            path: /bin/sh
            args:
              - -cx
              - |
                ls -lah
                cat ./the-output/file
```

Set and run this pipeline to see the results yourself. Save the pipeline in a file called `passing-artifacts.yml`.

```shell
fly -t tutorial set-pipeline -p passing-artifacts -c passing-artifacts.yml
fly -t tutorial unpause-pipeline -p passing-artifacts
fly -t tutorial trigger-job --job passing-artifacts/the-job --watch
```

## 2) - Two tasks with the same output, who wins?

This scenario is to satisfy the curiosity cat inside all of us. Never do this in real life because you're definitely
going to hurt yourself!

There are two [Jobs](../../jobs.md) in this pipeline. The first job, `writing-in-parallel`, has
two [Steps](../../steps/index.md); both steps will produce an artifact named `the-output` in parallel. If you run the
`writing-to-the-same-output-in-parallel` job multiple times you'll see the file in `the-output` folder changes depending
on which of the parallel tasks finished last. Here's a visualization of the first job.

![](assets/task-inputs-outputs-02a.gif)

The second job, `writing-to-the-same-output-serially`, is a serial version of the first job. In this job the second task
always wins because it's the last task that outputs `the-output`, so only `file2` will be in `the-output` directory in
the last step in the job plan.

![](assets/task-inputs-outputs-02b.gif)

The lesson to take away from this example is that **last to write wins** when it comes to the state of any particular
artifact in your job.

```yaml title="parallel-artifacts.yml" linenums="1"
busybox: &busybox #YAML anchor
  type: registry-image
  source:
    repository: busybox

jobs:
  - name: writing-to-the-same-output-in-parallel
    plan:
      # running two tasks that output in parallel?!?
      # who will win??
      - in_parallel:
          - task: create-the-output
            config:
              platform: linux
              image_resource: *busybox
              outputs:
                - name: the-output
              run:
                path: /bin/sh
                args:
                  - -cx
                  - |
                    ls -lah
                    date > ./the-output/file1
          - task: also-create-the-output
            config:
              platform: linux
              image_resource: *busybox
              outputs:
                - name: the-output
              run:
                path: /bin/sh
                args:
                  - -cx
                  - |
                    ls -lah
                    date > ./the-output/file2
      # run this job multiple times to see which
      # previous task wins each time
      - task: read-output-from-previous-step
        config:
          platform: linux
          image_resource: *busybox
          inputs:
            - name: the-output
          run:
            path: /bin/sh
            args:
              - -cx
              - |
                ls -lah ./the-output
                echo "Get ready to error!"
                cat ./the-output/file1 ./the-output/file2

  - name: writing-to-the-same-output-serially
    plan:
      - task: create-the-output
        config:
          platform: linux
          image_resource: *busybox
          outputs:
            - name: the-output
          run:
            path: /bin/sh
            args:
              - -cx
              - |
                ls -lah
                date > ./the-output/file1
      - task: also-create-the-output
        config:
          platform: linux
          image_resource: *busybox
          outputs:
            - name: the-output
          run:
            path: /bin/sh
            args:
              - -cx
              - |
                ls -lah
                date > ./the-output/file2
      - task: read-output-from-previous-step
        config:
          platform: linux
          image_resource: *busybox
          inputs:
            - name: the-output
          run:
            path: /bin/sh
            args:
              - -cx
              - |
                ls -lah ./the-output
                echo "Get ready to error! file1 will never exist"
                cat ./the-output/file1 ./the-output/file2
```

Set and run this pipeline to see the results yourself. Save the pipeline in a file called `parallel-artifacts.yml`.

```shell
fly -t tutorial set-pipeline -p parallel-artifacts -c parallel-artifacts.yml
fly -t tutorial unpause-pipeline -p parallel-artifacts
fly -t tutorial trigger-job --job parallel-artifacts/writing-to-the-same-output-in-parallel --watch
fly -t tutorial trigger-job --job parallel-artifacts/writing-to-the-same-output-serially --watch
```

## 3) - Mapping the Names of Inputs and Outputs

Sometimes the names of inputs and outputs don't match between multiple [task configs](../../steps/task.md), or they do
match, and you don't want them overwriting each other, like in the previous example. That's when `input_mapping` and
`output_mapping` become helpful. Both of these features rename the inputs/outputs in the task's config to some other
name in the job plan.

This pipeline has one job with four tasks.

The first task outputs a file with the date to the `the-output` directory. `the-output` is mapped to the new name
`demo-disk`. The artifact `demo-disk` is now available in the rest of the job plan for future steps to take as inputs.

The second task reads and prints the contents of the file under the new name `demo-disk`.

The third task reads and prints the contents of the file under another name, `generic-input`. The `demo-disk` artifact
in the job plan is mapped to `generic-input`.

The fourth task tries to use the artifact named `the-output` as its input. This task fails to even start because there
was no artifact with the name `the-output` available in the [job plan](../../jobs.md#job-schema); it was remapped to
`demo-disk`.

Here's a visualization of the job.

![](assets/task-inputs-outputs-03.gif)

```yaml title="mapping-artifacts.yml" linenums="1"
busybox: &busybox #YAML anchor
  type: registry-image
  source:
    repository: busybox

jobs:
  - name: the-job
    plan:
      - task: create-one-output
        # The task config has the artifact `the-output`
        # output_mapping will rename `the-output` to `demo-disk`
        # in the rest of the job's plan
        output_mapping:
          the-output: demo-disk
        config:
          platform: linux
          image_resource: *busybox
          outputs:
            - name: the-output
          run:
            path: /bin/sh
            args:
              - -cx
              - |
                ls -lah
                date > ./the-output/file
      # this task expects the artifact `demo-disk` so no mapping is needed
      - task: read-output-from-previous-step
        config:
          platform: linux
          image_resource: *busybox
          inputs:
            - name: demo-disk
          run:
            path: /bin/sh
            args:
              - -cx
              - |
                ls -lah
                cat ./demo-disk/file
      - task: rename-and-read-output
        # This task expects the artifact `generic-input`.
        # input_mapping will map the task's `generic-input` to
        # the job plans `demo-disk` artifact.
        # `demo-disk` is renamed to `generic-input`.
        input_mapping:
          generic-input: demo-disk
        config:
          platform: linux
          image_resource: *busybox
          inputs:
            - name: generic-input
          run:
            path: /bin/sh
            args:
              - -cx
              - |
                ls -lah
                cat ./generic-input/file
      - task: try-to-read-the-output
        input_mapping:
          generic-input: demo-disk
        config:
          platform: linux
          image_resource: *busybox
          # `the-output` is not available in the job plan
          # so this task will error while initializing
          # since there's no artiact named `the-output` in
          # the job's plan
          inputs:
            - name: the-output
          run:
            path: /bin/sh
            args:
              - -cx
              - |
                ls -lah
                cat ./generic-input/file
```

Set and run this pipeline to see the results yourself. Save the pipeline in a file called `mapping-artifacts.yml`.

```shell
fly -t tutorial set-pipeline -p mapping-artifacts -c mapping-artifacts.yml
fly -t tutorial unpause-pipeline -p mapping-artifacts
fly -t tutorial trigger-job --job mapping-artifacts/the-job --watch
```

## 4) - Adding Files to an Existing Artifact

This pipeline will also have two jobs in order to illustrate this point. What happens if we add a file to an output? If
you think back to example two you may already know the answer.

The first task will create `the-output` with `file1`. The second task will add `file2` to the `the-output`. The last
task will read the contents of `file1` and `file2`.

As long as you re-declare the input as an output in the second task you can modify any of your outputs.

This means you can pass something between a bunch of tasks and have each task add or modify something in the artifact.

Here's a visualization of the job.

![](assets/task-inputs-outputs-04.gif)

```yaml title="existing-artifact.yml" linenums="1"
jobs:
  - name: add-file-to-output
    plan:
      - task: create-one-output
        config:
          platform: linux
          image_resource:
            type: registry-image
            source:
              repository: busybox
          outputs:
            - name: the-output
          run:
            path: /bin/sh
            args:
              - -cx
              - |
                ls -lah
                date > ./the-output/file1
      - task: add-file-to-previous-output
        config:
          platform: linux
          image_resource:
            type: registry-image
            source:
              repository: busybox
          # this task lists the same artifact as
          # its input and output
          inputs:
            - name: the-output
          outputs:
            - name: the-output
          run:
            path: /bin/sh
            args:
              - -cx
              - |
                ls -lah
                date > ./the-output/file2
      - task: read-output-from-previous-step
        config:
          platform: linux
          image_resource:
            type: registry-image
            source:
              repository: busybox
          inputs:
            - name: the-output
          run:
            path: /bin/sh
            args:
              - -cx
              - |
                ls -lah ./the-output
                cat ./the-output/file1 ./the-output/file2
```

Set and run this pipeline to see the results yourself. Save the pipeline in a file called `existing-artifact.yml`.

```shell
fly -t tutorial set-pipeline -p existing-artifact -c existing-artifact.yml
fly -t tutorial unpause-pipeline -p existing-artifact
fly -t tutorial trigger-job --job existing-artifact/add-file-to-output --watch
```

## 5) - Task With Multiple Inputs and Outputs

What happens if you have a task that has multiple outputs and a second task that only lists one of the outputs? Does the
second task get the extra outputs from the first task?

The answer is no. A task will only get the artifacts that match the name of the inputs listed in the task's config.

Here's a visualization of the job.

![](assets/task-inputs-outputs-05.gif)

```yaml title="multiple-artifacts.yml" linenums="1"
jobs:
  - name: multiple-outputs
    plan:
      - task: create-three-outputs
        config:
          platform: linux
          image_resource:
            type: registry-image
            source:
              repository: busybox
          outputs:
            - name: the-output-1
            - name: the-output-2
            - name: the-output-3
          run:
            path: /bin/sh
            args:
              - -cx
              - |
                ls -lah
                date > ./the-output-1/file
                date > ./the-output-2/file
                date > ./the-output-3/file
      - task: take-one-output
        config:
          platform: linux
          image_resource:
            type: registry-image
            source:
              repository: busybox
          # only one of the three outputs are
          # listed as inputs
          inputs:
            - name: the-output-1
          run:
            path: /bin/sh
            args:
              - -cx
              - |
                ls -lah ./
                cat ./the-output-1/file
      - task: take-two-outputs
        config:
          platform: linux
          image_resource:
            type: registry-image
            source:
              repository: busybox
          # this task pulls in the other
          # two outputs, just for fun!
          inputs:
            - name: the-output-2
            - name: the-output-3
          run:
            path: /bin/sh
            args:
              - -cx
              - |
                ls -lah ./
                cat ./the-output-2/file
                cat ./the-output-3/file
```

Set and run this pipeline to see the results yourself. Save the pipeline in a file called `multiple-artifacts.yml`.

```shell
fly -t tutorial set-pipeline -p multiple-artifacts -c multiple-artifacts.yml
fly -t tutorial unpause-pipeline -p multiple-artifacts
fly -t tutorial trigger-job --job multiple-artifacts/multiple-outputs --watch
```

## 6) - Get Steps Generate Artifacts

The majority of Concourse pipelines have at least one [resource](../../resources/index.md), which means they have at
least one [`get` step](../../steps/get.md). Using a [`get` step](../../steps/get.md) in a job makes an artifact with the
name of the get step available for later steps in the job plan to consume as inputs.

Here's a visualization of the job.

![](assets/task-inputs-outputs-06.gif)

```yaml title="get-artifact.yml" linenums="1"
resources:
  - name: concourse-examples
    type: git
    source:
      uri: "https://github.com/concourse/examples"

jobs:
  - name: get-job
    plan:
      # there will be an artifact named
      # "concourse-examples" available in the job plan
      - get: concourse-examples
      - task: take-one-output
        config:
          platform: linux
          image_resource:
            type: registry-image
            source:
              repository: busybox
          inputs:
            - name: concourse-examples
          run:
            path: /bin/sh
            args:
              - -cx
              - |
                ls -lah ./
                cat ./concourse-examples/README.md
```

Set and run this pipeline to see the results yourself. Save the pipeline in a file called `get-artifact.yml`.

```shell
fly -t tutorial set-pipeline -p get-artifact -c get-artifact.yml
fly -t tutorial unpause-pipeline -p get-artifact
fly -t tutorial trigger-job --job get-artifact/get-job --watch
```