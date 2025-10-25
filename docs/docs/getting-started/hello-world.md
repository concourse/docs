---
title: Hello World Pipeline
---

## Creating a Pipeline

Let's start where all tutorials start, with a `Hello World!` example!

In this section you're going to create a pipeline that simply prints `Hello world!` to the console. While building up
the pipeline we will pause to explain the core pieces of the pipeline.

Let's first answer: **what is a pipeline made up from?**

The simplest Concourse [pipeline](https://concourse-ci.org/pipelines.html) is made of two objects:

- An unordered list of Jobs which contains...
- An ordered list of Steps

If you've used other pipeline building tools in the past, then what you think of as a pipeline is probably most similar
to a [job](https://concourse-ci.org/jobs.html) in Concourse.

For our `Hello World!` pipeline we will need **one job** with **one step**. This is the smallest pipeline you can make
in Concourse. The single step is what will print `Hello World!` to the console.

Create and open a new file called `hello-world.yml`. Inside that file let's add the first top-level
key, [jobs](https://concourse-ci.org/jobs.html).

```yaml
jobs:
```

The jobs key is where we define the list of [jobs](https://concourse-ci.org/jobs.html) that should make up our pipeline.
The order of the jobs does not matter. **The order of jobs does not define the structure of the pipeline.** We'll get
into pipeline structure and job ordering later when we talk about [Resources](https://concourse-ci.org/resources.html)
and passed constraints.

## Add a job

We only need one job right now so let's add a single job named `hello-world-job`.

```yaml
jobs:
  - name: hello-world-job
```

Awesome, we have a [job](https://concourse-ci.org/jobs.html) named `hello-world-job`! Now we need to add
a [`step`](https://concourse-ci.org/steps.html) to our job. To define a list
of [steps](https://concourse-ci.org/steps.html) a job should execute, we need to add
the [plan](https://concourse-ci.org/jobs.html#schema.job.plan) key to our job.

```yaml
jobs:
  - name: hello-world-job
    plan:
```

## Add a Step

Unlike [jobs](https://concourse-ci.org/jobs.html), the order of [steps](https://concourse-ci.org/steps.html) **does
matter!** Concourse will run the [steps](https://concourse-ci.org/steps.html) in the order that they are listed. Let's
_carefully_ place a [task step](https://concourse-ci.org/task-step.html#schema.task.task) as the first (and only) step
in our job.

```yaml
jobs:
  - name: hello-world-job
    plan:
      - task: hello-world-task
```

Fantastic! Now we need to tell Concourse _how_ to run our task step. We do that by providing
a [task config](https://concourse-ci.org/tasks.html#schema.task-config).

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
Each [step](https://concourse-ci.org/steps.html) in a [job plan](https://concourse-ci.org/jobs.html#schema.job.plan)
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

You can view the [task documentation](https://concourse-ci.org/tasks.html) to see all configurable options for tasks.
For now, you can add the following [task config](https://concourse-ci.org/tasks.html#schema.task-config) to the step.

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
the [fly cli](https://concourse-ci.org/fly.html). You can then view it from
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

!!! note

    If you have any feedback for this tutorial please share it in 
    [this GitHub discussion](https://github.com/concourse/concourse/discussions/7353).