---
title: Hello World Pipeline
search:
  exclude: true
---

## Creating a Pipeline

Let's start where all tutorials start, with a `Hello World!` example!

In this section you're going to create a pipeline that simply prints `Hello world!` to the console. While building up
the pipeline we will pause to explain the core pieces of the pipeline.

Let's first answer: **what is a pipeline made up from?**

The simplest Concourse [pipeline](../pipelines/index.md) is made of two objects:

- An unordered list of Jobs which contains...
- An ordered list of Steps

If you've used other pipeline building tools in the past, then what you think of as a pipeline is probably most similar
to a [job](../jobs.md) in Concourse.

For our `Hello World!` pipeline we will need **one job** with **one step**. This is the smallest pipeline you can make
in Concourse. The single step is what will print `Hello World!` to the console.

Create and open a new file called `hello-world.yml`. Inside that file let's add the first top-level
key, [jobs](../jobs.md).

```yaml
jobs:
```

The jobs key is where we define the list of [jobs](../jobs.md) that should make up our pipeline.
The order of the jobs does not matter. **The order of jobs does not define the structure of the pipeline.** We'll get
into pipeline structure and job ordering later when we talk about [Resources](../resources/index.md)
and passed constraints.

## Add a job

We only need one job right now so let's add a single job named `hello-world-job`.

```yaml
jobs:
  - name: hello-world-job
```

Awesome, we have a [job](../jobs.md) named `hello-world-job`! Now we need to add
a [`step`](../steps/index.md) to our job. To define a list
of [steps](../steps/index.md) a job should execute, we need to add
the [plan](../jobs.md#job-schema) key to our job.

```yaml
jobs:
  - name: hello-world-job
    plan:
```

## Add a Step

Unlike [jobs](../jobs.md), the order of [steps](../steps/index.md) **does
matter!** Concourse will run the [steps](../steps/index.md) in the order that they are listed. Let's
_carefully_ place a [task step](../steps/task.md) as the first (and only) step
in our job.

```yaml
jobs:
  - name: hello-world-job
    plan:
      - task: hello-world-task
```

Fantastic! Now we need to tell Concourse _how_ to run our task step. We do that by providing
a [task config](../tasks.md#task-config-schema).

```yaml
jobs:
  - name: hello-world-job
    plan:
      - task: hello-world-task
        config:
```

At this point we are going to pause to explain steps a bit more.

## What is a step?

A step is a single container running on a [Concourse worker](../install/running-worker.md).
Each [step](../steps/index.md) in a [job plan](../jobs.md#job-schema)
runs in its own container. You can run anything you want inside the container (_i.e. run my tests, run this bash script,
build this image, etc._).

So if you have a job with five steps Concourse will create five containers, one for each step. Therefore, we need to
tell Concourse the following about each step:

- What type of [worker](../install/running-worker.md) to run the task on (linux/windows/darwin)
- What container image to use (`Linux only`)
- What command to run inside the container

!!! info

    Concourse currently only supports Linux containers. Concourse does not yet run Windows containers. 
    Darwin does not have native containers.

## Fill in the Task Config

Let's answer the previous three questions for our `hello-world-task`:

- **What type of [worker](../install/running-worker.md) to run the task on (linux/windows/darwin)**
    - Linux, because our docker-composed Concourse only has one linux worker. You can verify this by
      running `fly -t tutorial workers`
- **What container image to use** (_Linux only_)
    - We'll use the super small [busybox image](https://hub.docker.com/_/busybox)
- **What command to run inside the container**
    - `echo "Hello world!"`

You can view the [task documentation](../tasks.md) to see all configurable options for tasks.
For now, you can add the following [task config](../tasks.md#task-config-schema) to the step.

```yaml
jobs:
  - name: hello-world-job
    plan:
      - task: hello-world-task
        config:
          # Tells Concourse which type of worker this task should run on
          platform: linux
          # This is one way of telling Concourse which container image to use for a
          # task. We'll explain this more when talking about resources
          image_resource:
            type: registry-image
            source:
              repository: busybox # images are pulled from docker hub by default
              tag: latest
          # The command Concourse will run inside the container
          # echo "Hello world!"
          run:
            path: echo
            args: [ "Hello world!" ]
```

## Run the pipeline

That's the whole pipeline! You can now set it, unpause, and trigger it using
the [fly cli](../fly.md). You can then view it from
the [web ui](http://localhost:8080/teams/main/pipelines/hello-world/jobs/hello-world-job).

```shell
fly -t tutorial set-pipeline -p hello-world -c hello-world.yml
# pipelines are paused when first created
fly -t tutorial unpause-pipeline -p hello-world
# trigger the job and watch it run to completion
fly -t tutorial trigger-job --job hello-world/hello-world-job --watch
```

You'll see extra output than what we're showing below (the busybox image being downloaded) but the last four lines will
be the task executing.

```
selected worker: 701785fa43a1
running echo Hello world!
Hello world!
succeeded
```

You can also view the build from the web UI by clicking on the job and expanding the `hello-world-task` step.

![](assets/hello-world-first-build.gif)

Congratulations on building your first Concourse pipeline!

In the next section we will build upon what we have learned about tasks and introduce inputs and outputs, which allow
you to pass files between tasks.

!!! question "Have Feedback?"

    If you have any feedback for this tutorial please share it in 
    [this GitHub discussion](https://github.com/concourse/concourse/discussions/7353).
