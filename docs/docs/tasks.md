---
title: Tasks
---

The smallest configurable unit in a Concourse pipeline is a single task. A task can be thought of as a function
from `task-config.inputs` to `task-config.outputs` that can either succeed or fail.

Going a bit further, ideally tasks are pure functions: given the same set of inputs, it should either always succeed
with the same outputs or always fail. This is entirely up to your script's level of discipline, however. Flaky tests or
dependencies on the internet are the most common source of impurity.

Once you have a running Concourse deployment, you can start configuring your tasks and executing them interactively from
your terminal with the [Fly](fly.md) command line tool.

Once you've figured out your task's configuration, you can reuse it for a [Job](jobs.md) in
your [Pipeline](pipelines/index.md).

Conventionally a task's configuration is placed in the same repository as the code it's testing, possibly under
some `ci` directory.

A task's configuration specifies the following:

??? example "Testing a Ruby app"

    This configuration specifies that the task must run with the `ruby:2.1` Docker image with a `my-app` input, and when 
    the task is executed it will run the `scripts/test` script in the same repo.

    ```yaml
    ---
    platform: linux
    
    image_resource:
      type: registry-image
      source:
        repository: ruby
        tag: '2.1'
    
    inputs:
      - name: my-app
    
    run:
      path: my-app/scripts/test
    ```

??? example "Producing outputs from a task"

    A task can configure `task-config.outputs` to produce artifacts that can then be propagated to a [`put` 
    step](steps/put.md) or another [`task` step](steps/task.md) in the same plan. They can also be downloaded with [fly 
    execute](#running-tasks-with-fly-execute) by passing `-o`.

    ```yaml
    ---
    platform: linux
    
    image_resource: # ...
    
    inputs:
      - name: project-src
    
    outputs:
      - name: built-project
    
    run:
      path: project-src/ci/build
    ```

    ... assuming `project-src/ci/build` looks something like:
    
    ```shell
    #!/bin/bash
    
    set -e -u -x
    
    export GOPATH=$PWD/project-src
    
    go build -o built-project/my-project \
      github.com/concourse/my-project
    ```
    
    ... this task could then be used in a [build plan](steps/index.md) like so:
    
    ```yaml
    plan:
      - get: project-src
      - task: build-bin
        file: project-src/ci/build.yml
      - put: project-bin
        params:
          file: built-project/my-project
    ```

??? example "Caching ephemeral state"

    The following task and script could be used by a Node project to cache the `node_modules` directory:

    ```yaml
    ---
    platform: linux
    
    image_resource: # ...
    
    inputs:
    - name: project-src
    
    caches:
    - path: project-src/node_modules
    
    run:
      path: project-src/ci/build
    ```
    
    ... assuming `project-src/ci/build` looks something like:
    
    ```shell
    #!/bin/bash
    
    set -e -u -x
    
    cd project-src
    npm install
    
    # ...
    ```
    
    ... this task would cache the contents of `project-src/node_modules` between runs of this task on the same worker.

??? example "Using an image from a private Docker registry"

    The following external task uses an image from a private registry. Assuming the CA is configured properly on the 
    workers, SSL should Just Work™.
    
    External tasks are now fully interpolated using [credential manager variables](operation/creds/index.md) and 
    [`task` step `vars`](steps/task.md), so you can use template variables in an external task:
    
    ```yaml
    ---
    platform: linux
    
    image_resource:
      type: registry-image
      source:
        repository: my.local.registry:8080/my/image
        username: ((myuser))
        password: ((mypass))
    
    inputs:
      - name: my-app
    
    run:
      path: my-app/scripts/test
      args: [ "Hello, world!", "((myparam))" ]
    ```

## `task-config` schema

## Running tasks with `fly execute`

One of the most common use cases of `fly` is taking a local project on your computer and setting it up with a task
configuration to be run inside a container in Concourse. This is useful to build Linux projects on OS X or to avoid all
of those debugging commits when something is configured differently between your local and remote setup.

You can execute a task like this:

```shell
fly -t example execute --config tests.yml
```

Your files will be uploaded and the task will be executed with them. The working directory name will be used as the
input name. If they do not match, you must specify `-i name=`. Instead, where `name` is the input name from the task
configuration.

[Fly](fly.md) will automatically capture `SIGINT` and `SIGTERM` and abort the build when received. This allows it to be
transparently composed with other toolchains.

By default, [`fly execute`](tasks.md#running-tasks-with-fly-execute) will not send extra files or large files in your
current directory that would normally be ignored by your version control system. You can use the `--include-ignored`
flag in order to send ignored files to Concourse along with those that are not ignored.

If your task needs to run as `root`, then you can specify the `-p` or `--privileged` flag.

??? example "Providing multiple inputs"

    Tasks in Concourse can take multiple inputs. Up until now we've just been submitting a single input (our current 
    working directory) that has the same name as the directory.
    
    Tasks must specify the inputs that they require as `task-config.inputs`. For `fly` to upload these inputs you can 
    use the `-i` or `--input` arguments with name and path pairs. For example:

    ```shell
    fly -t example execute \
        --config build-stemcell.yml \
        --input code=. \
        --input stemcells=../stemcells
    ```

    This would work together with a `build-stemcell.yml` if its inputs: section was as follows:

    ```yaml
    inputs:
      - name: code
      - name: stemcells
    ```

    If you specify an input, then the default input will no longer be added automatically, and you will need to 
    explicitly list it (as with the `code` input above).

    This feature can be used to mimic other resources and try out input combinations that would normally not be possible 
    in a pipeline.

??? example "Basing inputs on a job in your pipeline with `inputs-from`"

    If the `--inputs-from` flag is given, the specified job will be looked up in the pipeline, and the one-off build 
    will base its inputs on those currently configured for the job.
    
    If any `--input` flags are given (see above), they will override the base set of inputs.
    
    For example:

    ```shell
    fly -t example execute \
        --config task.yml \
        --inputs-from main/integration \
        --input foo=./foo
    ```

    This will trigger a one-off-build using the `task.yml` task config, basing its inputs on the latest candidates for 
    the `integration` job in the `main` pipeline, with the `foo` input overridden to specify local code to run.

    This can be used to more closely replicate the state in CI when weeding out flakiness, or as a shortcut for local 
    development so that you don't have to upload every single resource from your local machine.

??? example "Using an image from a job in your pipeline with `--image`"

    When using `--inputs-from` as above, you can additionally specify which input to use as the task's image by passing 
    `--image input-name`.

    For example, the following pipeline fetches an image via a [`get` step](steps/get.md) and uses it for [`task` step 
    `image`](steps/task.md):

    ```yaml
    resources:
      - name: my-repo
        type: git
        source: { uri: https://example.com }
    
      - name: some-image
        type: registry-image
        source: { repository: ubuntu }
    
    jobs:
      - name: integration
        plan:
          - get: my-repo
          - get: some-image
          - task: my-task
            file: my-repo/task.yml
            image: some-image
    ```
    
    ... so to run the same task with the same image in a one-off build, you would run:
    
    ```shell
    fly -t example execute \
        --config task.yml \
        --inputs-from main/integration \
        --image some-image
    ```

??? example "Taking artifacts from the build with `--output`"

    If a task specifies outputs, then you're able to extract these back out of the build and back to your local system. 
    For example:

    ```shell
    fly -t example execute \
        --config build-stemcell.yml \
        --input code=. \
        --output stemcell=/tmp/stemcell
    ```

    This would work together with a `build-stemcell.yml`, if its `outputs:` section was as follows:
    
    ```yaml
    outputs:
      - name: stemcell
    ```

    This feature is useful to farm work out to your Concourse server to build things in a repeatable manner.

??? example "Providing values for `params`"

    Any params listed in the task configuration can be specified by using environment variables.

    So, if you have a task with the following params:

    ```yaml
    params:
      FOO: fizzbuzz
      BAR:
    ```

    ... and you run:
    
    ```shell
    BAR=hello; fly execute
    ```
    
    The task would then run with `BAR` as `"hello"`, and `FOO` as `"fizzbuzz"` (its default value).

??? example "Providing values for vars"

    Task config files can contain [Vars](vars.md) which can can be set during `fly execute` by using the `-v`, `-y` and 
    `-l` flags:

    ```shell
    fly -t example execute --config tests.yml \
      -l vars.yml \
      -v some_string="Hello World!" \
      -y some_bool=true
    ```

    Any variables not satisfied via the above flags will be deferred to the configured [credential 
    manager](operation/creds/index.md).

    To satisfy these vars when running the task in a pipeline, see [`task` step `vars`](steps/task.md).

??? example "Targeting a specific worker with `--tag`"

    If you want to execute a task on a worker that has a specific tag, you can do so by passing `--tag`:
    
    ```shell
    fly -t example execute --config task.yml --tag bar
    ```
    
    This will execute the task specified by `task.yml` on a worker that has been tagged `bar.`

## Task runtime environment

A task runs in a new container every time, using the image provided by `task-config.image_resource` as its base
filesystem (i.e. `/`).

The command specified by `task-config.run` will be executed in a working directory containing each of
the `task-config.inputs`. If any input is missing, the task will not run (and the container will not even be created).

The working directory will also contain empty directories for each of the `task-config.outputs`. The task must place
artifacts in the output directories for them to be exported. This meshes well with build tools with configurable
destination paths.

!!! tip

    If your build tools don't support output paths, you can configure an input and output with the same path. The 
    directory will be populated by the input, and any changes made to the directory will propagate downstream as an 
    output.

Any [`task` step `params`](steps/task.md) configured will be set in the environment for the task's command, along with
any environment variables provided by the task's image (i.e. `ENV` rules from your `Dockerfile`).

The user the command runs as is determined by the image. If you're using a Docker image, this will be the user set by
a `USER` rule in your `Dockerfile`, or `root`, if not specified.

Another relevant bit of configuration is [`task` step `privileged`](steps/task.md), which determines whether the user
the task runs as will have full privileges (primarily when running as `root`). This is intentionally _not_ configurable
by the task itself, to prevent privilege escalation by submitting pull requests to repositories that contain task
configs.

Putting all this together, the following task config:

```yaml
---
platform: linux

image_resource:
  type: registry-image
  source:
    repository: golang
    tag: '1.6'

params:
  SOME_PARAM: some-default-value

inputs:
  - name: some-input
  - name: some-input-with-custom-path
    path: some/custom/path

outputs:
  - name: some-output

run:
  path: sh
  args:
    - -exc
    - |
      whoami
      env
      go version
      find .
      touch some-output/my-built-artifact
```

... will produce the following output:

```shell
$ whoami
root
$ env
USER=root
HOME=/root
GOLANG_DOWNLOAD_SHA256=5470eac05d273c74ff8bac7bef5bad0b5abbd1c4052efbdbc8db45332e836b0b
PATH=/go/bin:/usr/local/go/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
GOPATH=/go
PWD=/tmp/build/e55deab7
GOLANG_DOWNLOAD_URL=https://golang.org/dl/go1.6.linux-amd64.tar.gz
GOLANG_VERSION=1.6
SOME_PARAM=some-default-value
$ go version
go version go1.6 linux/amd64
$ find .
.
./some-input
./some-input/foo
./some
./some/custom
./some/custom/path
./some/custom/path/bar
./some-output
$ touch some-output/my-built-artifact
```

... and propagate `my-built-artifact` to any later [`task` steps](steps/task.md) or [`put` steps](steps/put.md) that
reference the `some-output` artifact, in the same way that this task had `some-input` as an input.