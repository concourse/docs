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

## `task-config` schema

??? warning "**`platform`**: `linux` | `darwin` | `windows` (required)"

    The platform the task should run on. This determines the pool of workers that the task can run against.

    Technically any string value is allowed so long as a worker advertises the same platform, but in practice only 
    `linux`, `darwin`, and `windows` are in use.

??? info "**`image_resource`**: [`anonymous_resource`](#anonymous_resource-schema)"

    The container image to run with, as provided by an anonymous [resource](resources/index.md) definition.

    Whenever the task runs, the anonymous resource will be `check`ed to discover the latest version available. The image
    will then be fetched onto the worker, if necessary, just prior to running the task.

    To use an image provided by a previous step within your build plan, set `task` step `image` on the 
    [`task` step](steps/task.md) instead.

    !!! note

        This field is only required for tasks targeting the Linux platform. This field will be ignored for Windows and 
        Darwin workers. Windows containers are currently not supported and Darwin does not have native containers. The 
        task will run inside a clean temporary directory on the Windows/Darwin worker with any inputs and outputs copied
        into the same directory. Any dependencies should be pre-installed on the worker.

    ??? example "Using the `golang` Docker image"

        The following task config will use the [`golang` Docker image](https://hub.docker.com/_/golang) to run 
        `go version`:

        ```yaml
        platform: linux
        
        image_resource:
          type: registry-image
          source:
            repository: golang
        
        run:
          path: go
          args:
            - version
        ```

    ### `anonymous_resource` schema

    ??? warning "**`type`**: [`resource_type.name`](resource-types/index.md#resource_type-schema)"

        The type of the resource. Usually `registry-image`.

        You can use any resource type that returns a filesystem in the correct format: a `/rootfs` directory containing 
        a full filesystem, and a `metadata.json` file containing.

    ??? warning "**`source`**: [`config`](config-basics.md#config-schema)"

        The configuration for the resource; see [`resource.source`](resources/index.md#resource-schema).

    ??? info "**`params`**: [`config`](config-basics.md#config-schema)"

        A map of arbitrary configuration to forward to the resource. Refer to the resource type's documentation to see 
        what it supports.

    ??? info "**`version`**: [`version`](config-basics.md#version-schema)"

        A specific version of the resource to fetch. This should be a map with string keys and values. If not specified,
        the latest version will be fetched.

??? info "**`inputs`**: [`[input]`](#input-schema)"

    The set of artifacts used by task, determining which artifacts will be available in the current directory when the 
    task runs.

    These are satisfied by [`get` steps](steps/get.md) or `task-config.outputs` of a previous task. These can also be 
    provided by `-i` with [`fly execute`](#running-tasks-with-fly-execute).

    If any required inputs are missing at run-time, then the task will error immediately.

    ### `input` schema

    ??? warning "**`name`**: [`identifier`](config-basics.md#identifier-schema)"

        The name of the input.

    ??? info "**`path`**: [`dir-path`](config-basics.md#dir-path-schema)"

        The path where the input will be placed. If not specified, the input's `name` is used.

        Paths are relative to the working directory of the task unless an absolute path is given. An absolute path is 
        any path that starts with a forward slash `/`. We recommend only using relative paths unless you have a strong 
        technical reason to use absolute paths.

        Any parent directory references (`../`) in the path will be removed.

    ??? info "**`optional`**: [`boolean`](config-basics.md#boolean-schema)"

        _Default `false`_. If `true`, then the input is not required by the task. The task may run even if this input is
        missing.

        An `optional` input that is missing will not appear in the current directory of the running task.

??? info "**`outputs`**: [`[output]`](#output-schema)"

    The artifacts produced by the task.

    Each output configures a directory to make available to later steps in the [build plan](steps/index.md). The 
    directory will be automatically created before the task runs, and the task should place any artifacts it wants to 
    export in the directory.

    ### `output` schema

    ??? warning "**`name`**: [`identifier`](config-basics.md#identifier-schema)"

        The name of the output. The contents under `path` will be made available to the rest of the plan under this
        name.

    ??? info "**`path`**: [`dir-path`](config-basics.md#dir-path-schema)"

        The path to a directory where the output will be taken from. If not specified, the output's `name` is used.

        Paths are relative to the working directory of the task unless an absolute path is given. An absolute path is 
        any path that starts with a forward slash `/`. We recommend only using relative paths unless you have a strong 
        technical reason to use absolute paths.

        Any parent directory references (`../`) in the path will be removed.

??? info "**`caches`**: [`[cache]`](#cache-schema)"

    The cached directories shared between task runs.

    On the task's first run, all cache directories will be empty. It is the responsibility of the task to populate these
    directories with any artifacts to be cached. On subsequent runs, the cached directories will contain those 
    artifacts.

    Caches are scoped to the worker the task is run on, so you will not get a cache hit when subsequent builds run on 
    different workers. This also means that caching is not intended to share state between workers, and your task should
    be able to run whether or not the cache is warmed.

    Caches are also scoped to a particular task name inside of a pipeline's job. As a consequence, if the job name, step
    name or cache path are changed, the cache will not be used. This also means that caches do not exist for one-off 
    builds.

    ### `cache` schema

    ??? warning "**`path`**: [`dir-path`](config-basics.md#dir-path-schema)"

        The path to a directory to be cached.

        Paths are relative to the working directory of the task. Absolute paths are not respected.

??? info "**`params`**: [`env-vars`](config-basics.md#env-vars-schema)"

    A key-value mapping of string keys and values that are exposed to the task via environment variables.

    Pipelines can override these params by setting [`task` step `params`](steps/task.md) on the `task` step. This is a 
    common method of providing credentials to a task.

??? info "**`run`**: [`command`](#command-schema)"

    The command to execute in the container. If not specified, Concourse will
    try running any `ENTRYPOINT`/`CMD` commands found in the container,
    following the same logic as Docker. Any `args` specified in the task config
    will be appended to `ENTRYPOINT`/`CMD`.

    ??? warning "`ENTRYPOINT`/`CMD` execution is only supported on >= v8 of Concourse."

        If you're on an older version of Concourse you must specify `run.path` in your task config.

    !!! note

        This is not provided as a script blob, but explicit `path` and `args` values; this allows `fly` to forward 
        arguments to the script, and forces your config `.yml` to stay fairly small.

    ### `command` schema

    ??? info "**`path`**: [`file-path`](config-basics.md#file-path-schema)"

        The name of or path to the executable to run found inside the container.

        `path` is relative to the working directory. If `dir` is specified to set the working directory, then `path` is 
        relative to it.

        This is commonly a path to a script provided by one of the task's inputs, e.g. `my-resource/scripts/test`. It 
        could also be a command like `bash` (respecting standard `$PATH` lookup rules), or an absolute path to a file to
        execute, e.g. `/bin/bash`.

    ??? info "**`args`**: [`[string]`](config-basics.md#string-schema)"

        Arguments to pass to the command. Note that when executed with `fly`, any arguments passed to 
        [`fly execute`](#running-tasks-with-fly-execute) are appended to this array.

    ??? info "**`dir`**: [`dir-path`](config-basics.md#dir-path-schema)"
        
        A directory, relative to the initial working directory, to set as the working directory when running the script.

    ??? info "**`user`**: [`string`](config-basics.md#string-schema)"

        Explicitly set the user to run as. If not specified, this defaults to the user configured by the task's image. 
        If not specified there, it's up to the Garden backend, and may be e.g. `root` on Linux.

??? info "**`rootfs_uri`**: [`string`](config-basics.md#string-schema)"

    A string specifying the rootfs uri of the container, as interpreted by your worker's Garden backend.

    `task-config.image_resource` is the preferred way to specify base image. You should only use this if you have no 
    other option and you really know what you're doing.

??? info "**`container_limits`**: [`container_limits`](#container_limits-schema)"

    CPU and memory limits to enforce on the task container.

    !!! note

        These values, when specified, will override any limits set by passing the `--default-task-cpu-limit` or 
        `--default-task-memory-limit` flags to the `concourse web` command.

    ### `container_limits` schema

    ??? info "**`cpu`**: [`number`](config-basics.md#number-schema)"

        The maximum amount of CPU available to the task container, measured in shares. 0 means unlimited.

        CPU shares are relative to the CPU shares of other containers on a worker. For example, if you have two 
        containers both with a CPU limit of 2 shares then each container will get 50% of the CPU's time.

        ```text
        Container A: 2 shares - 50% CPU
        Container B: 2 shares - 50% CPU
        Total CPU shares declared: 4
        ```

        If you introduce another container then the number of CPU time per container changes. CPU shares are 
        relative to each other.

        ```text
        Container A: 2 shares - 25% CPU
        Container B: 2 shares - 25% CPU
        Container C: 4 shares - 50% CPU
        Total CPU shares declared: 8
        ```

    ??? info "**`memory`**: [`number`](config-basics.md#number-schema)"

        The maximum amount of memory available to the task container, measured in bytes. 0 means unlimited. Can use 
        units such as `KB/MB/GB`.

## Examples

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
