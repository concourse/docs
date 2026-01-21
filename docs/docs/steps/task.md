---
title: Task Step
---

# `task` Step

Executes a [task](../tasks.md). Expand each section below for more details and examples.

When a task completes, the artifacts specified by [`task-config.outputs`](../tasks.md#task-config-schema) will be
registered in the build's artifact namespace. This allows subsequent `task` steps and [`put` steps](put.md) to access
the result of a task.

??? warning "**`task`**: [`identifier`](../config-basics.md#identifier-schema) (required)"

    ### `task`
    The identifier value is just a name - short and sweet. The value is shown in the web UI but otherwise has no effect 
    on anything. This may change in the future; [RFC #32](https://github.com/concourse/rfcs/pull/32) proposes that the 
    name be used to reference a file within the project.

    ??? example "Functions from inputs to outputs"

        You can think of tasks like functions. They have predefined inputs and outputs and can be written in idempotent
        ways.

        The following pipeline contains a function that increments a number. You can think of the task add-one like this
        pseudo-function:

        ```golang
        func AddOne(num int) int {
          return num + 1
        }
        ```

        ```yaml
        jobs:
          - name: idempotent-task
            plan:
              - get: counter
              - task: add-one
                config:
                  platform: linux
                  image_resource:
                    type: mock
                    source:
                      mirror_self: true
                  inputs:
                    - name: counter
                  outputs:
                    - name: counter
                  run:
                    path: sh
                    args:
                      - -c
                      - |
                        COUNTER=$(cat counter/version)
                        NEXT=$(($COUNTER + 1))
                        echo "new version: $NEXT"
                        echo $NEXT > counter/next
              - put: counter
                params:
                  file: counter/next
        
        resources:
          - name: counter
            type: mock
            source:
              initial_version: "1"
        ```

??? info "**`config`**: [`task-config`](../tasks.md#task-config-schema)"

    ### `config`
    The [task config](../tasks.md#task-config-schema) to execute.

    ??? example "Task Config"

        ```yaml
        jobs:
          - name: job
            public: true
            plan:
              - task: simple-task
                config: # contains all field in a task config
                  platform: linux
                  image_resource:
                    type: registry-image
                    source:
                      repository: busybox
                  run:
                    path: echo
                    args:
                      - "Hello world!"
        ```

??? info "**`file`**: [`file-path`](../config-basics.md#file-path-schema)"

    ### `file`
    A dynamic alternative to `task` step `config`.

    `file` points at a `.yml` file containing the [task config](../tasks.md#task-config-schema), which allows this to be
    tracked with your resources.

    The first segment in the path should refer to another source from the plan, and the rest of the path is relative to 
    that source.

    The content of the config file may contain template `((vars))`, which will be filled in using `task` step `vars` or 
    a configured [credential manager](../operation/creds/index.md).

    ??? example "Using a task config file"
    
        Uses this config file:
        
        ```yaml linenums="1"
        --8<-- "libs/examples/tasks/hello-world.yml"
        ```
        
        ```yaml
        jobs:
          - name: task-config-in-file
            plan:
              - get: ci
              - task: config-from-file
                file: ci/tasks/hello-world.yml
        
        resources:
          - name: ci
            type: git
            source:
              uri: https://github.com/concourse/examples.git
        ```

??? info "**`image`**: [`identifier`](../config-basics.md#identifier-schema)"

    ### `image`
    Specifies an artifact source containing an image to use for the task. This overrides any 
    `task-config.image_resource` configuration present in the task configuration.

    This is very useful when part of your pipeline involves building an image, possibly with dependencies pre-baked. You
    can then propagate that image through the rest of your pipeline, guaranteeing that the correct version (and thus a 
    consistent set of dependencies) is used throughout your pipeline.

    ??? example "Fetching and using an image"

        This can be used to explicitly keep track of dependent images. You could also modify it to build and push the 
        image in one job and use it in later jobs. See [Building and Pushing an 
        Image](../how-to/container-image-guides/build-push.md).

        ```yaml
        resources:
          - name: golang
            type: registry-image
            source:
              repository: golang  # could also be the full URL "docker.io/golang"
              tag: "1.17"
        
        jobs:
          - name: fetch-and-run-image
            plan:
              - get: golang
              - task: use-fetched-image-in-task
                image: golang   # reference the image from the get step
                config:
                  platform: linux
                  run:
                    path: go
                    args:
                      - "version"
        ```

    ??? example "Building and using an image"

        [Building an Image and Using it in a Task](../how-to/container-image-guides/build-use.md)


??? info "`privileged`: [`boolean`](../config-basics.md#boolean-schema)"

    ### `privileged`
    _Default `false`_. If set to `true`, the task will run with escalated capabilities available on the task's platform.

    !!! warning
    
        Setting `privileged: true` is a gaping security hole; use wisely and only if necessary. This is not part of the
        task configuration in order to prevent privilege escalation via pull requests changing the task file.

    For the `linux` platform, this determines whether the container will run in a separate user namespace. When set to 
    `true`, the container's `root` user is _actual_ `root`, i.e. not in a user namespace. This is not recommended, and 
    should _never_ be used with code you do not trust - e.g. pull requests.

    For macOS and Windows this field has no effect since workloads on those machines are not containerized.

??? info "`vars`: [`vars`](../config-basics.md#vars-schema)"

    ### `vars`
    A map of template variables to pass to an external task. Not to be confused with `task` step `params`, which 
    provides _environment variables_ to the task.

    This is to be used with external tasks defined in `task` step `file`.

    ??? example "Parameterized a task config file with vars"

        A var may be statically passed like so:

        ```yaml
        jobs:
          - name: task-vars
            plan:
              - get: ci
              - task: override-task-vars
                file: ci/tasks/print-var.yml
                vars: # statically defined vars
                  my-var: "Cookies are the best"
                  second-var: "chips are a close second"
        
        resources:
          - name: ci
            type: git
            source:
              uri: https://github.com/concourse/examples.git
        ```

        When run with the following [task config](../tasks.md):

        ```yaml
        platform: linux
        
        image_resource:
          type: mock
          source:
            mirror_self: true
        
        params:
          MY_VAR: ((my-var))
        
        run:
          path: sh
          args:
            - -c
            - |
              echo ${MY_VAR} and ((second-var))
        ```

        The `"((my-var))"` will be resolved to `"Cookies are the best"` and `((second-var))` will be resolved to 
        `"chips are a close second"`.

        This can also be used in combination with [Vars](../vars.md) from a [credential 
        manager](../operation/creds/index.md) (i.e. Vault) as a way to re-map variable names to match what the task is 
        expecting:

        ```yaml
        jobs:
          - name: task-vars
            plan:
              - get: ci
              - task: override-task-vars
                file: ci/tasks/print-var.yml
                vars: # re-mapped vars
                  my-var: ((var-from-vault))
                  second-var: ((apple.type))
        
        resources:
          - name: ci
            type: git
            source:
              uri: https://github.com/concourse/examples.git
        ```

??? info "`params`: [`env-vars`](../config-basics.md#env-vars-schema)"

    ### `params`
    A map of task environment variable parameters to set, overriding those configured in the task's `config` or `file`.

    The difference between `params` and `vars` is that `vars` allows you to interpolate any template variable in an 
    external task file, while `params` can be used to overwrite task parameters specifically. Also, `params` can have 
    default values declared in the task.

    ??? example "Running a task with env var params"

        Let's say we have a [task config](../tasks.md#task-config-schema) like so:

        ```yaml
        platform: linux
        
        image_resource:
          type: mock
          source:
            mirror_self: true
        
        params:
          ECHO_ME: "default text to echo from task config file"
          ALSO_ME:
        
        run:
          path: sh
          args:
            - -c
            - |
              echo ${ECHO_ME} and ${ALSO_ME}
        ```

        This indicates that there are two params which can be set: `ECHO_ME`, which has a default, and `ALSO_ME` which 
        has no default set.

        A pipeline could run the task with values passed in like so:

        ```yaml
        jobs:
          - name: task-params
            plan:
              - get: ci
              - task: constrained-task
                file: ci/tasks/print-param.yml
                params:
                  ECHO_ME: "Eat your fruits"
                  ALSO_ME: "veggies"
        
        resources:
          - name: ci
            type: git
            source:
              uri: https://github.com/concourse/examples.git
        ```

    ??? example "Using with `((vars))`"

        ```yaml
        jobs:
          - name: task-params
            plan:
              - get: ci
              - task: constrained-task
                file: ci/tasks/print-param.yml
                params:
                  ECHO_ME: ((some-var))
                  ALSO_ME: ((another-var))
        
        resources:
          - name: ci
            type: git
            source:
              uri: https://github.com/concourse/examples.git
        ```

??? info "`container_limits`: [`container_limits`](#container_limits-schema)"

    CPU and memory limits to enforce on the task container.

    Note that these values, when specified, will override any limits set by passing the `--default-task-cpu-limit` or 
    `--default-task-memory-limit` flags to the `concourse web` command.

    These values will also override any configuration set on a [task's config 
    `container_limits`](../tasks.md#task-config-schema).

    ### `container_limits` schema

    ??? info "`cpu`: [`number`](../config-basics.md#number-schema)"

        The maximum amount of CPU available to the task container, measured in shares. 0 means unlimited.

        CPU shares are relative to the CPU shares of other containers on a worker. For example, if you have two 
        containers both with a CPU limit of 2 shares then each container will get 50% of the CPU's time.

        ```
        Container A: 2 shares - 50% CPU
        Container B: 2 shares - 50% CPU
        Total CPU shares declared: 4
        ```

        If you introduce another container then the number of CPU time per container changes. CPU shares are relative to
        each other.

        ```
        Container A: 2 shares - 25% CPU
        Container B: 2 shares - 25% CPU
        Container C: 4 shares - 50% CPU
        Total CPU shares declared: 8
        ```

    ??? info "`memory`: [`number`](../config-basics.md#number-schema)"

        The maximum amount of memory available to the task container, measured in bytes. 0 means unlimited.

    ??? example "Setting CPU and Memory limits"
    
        This task will only be given 10MB of memory and 2 CPU shares.

        ```yaml
        jobs:
          - name: limited-resources
            plan:
              - task: constrained-task
                container_limits:
                  cpu: 2 # CPU shares are relative
                  memory: 10000000 # 10MB
                config:
                  platform: linux
                  image_resource:
                    type: registry-image
                    source:
                      repository: busybox
                  run:
                    path: echo
                    args:
                      - "Hello world!"
        ```

??? info "`hermetic`: [`boolean`](../config-basics.md#boolean-schema)"

    ### `hermetic`

    !!! warning 
    
        This setting is only supported by the `containerd` runtime on Linux. For other runtimes this setting has no 
        effect on container networking. Please contact your Concourse operator to find out what runtime your Concourse 
        cluster is using.

    _Default `false`_. If set to `true`, the task will have no outbound network access. Your task will not be able to 
    reach the internet or any local network resources that aren't also inside the container.

    For macOS and Windows this field has no effect since workloads on those machines are not containerized

??? info "`input_mapping`: { `input.name` : [`identifier`](../config-basics.md#identifier-schema) }"

    ### `input_mapping`
    A map from task input names to concrete names in the build plan. This allows a task with generic input names to be 
    used multiple times in the same plan, mapping its inputs to specific resources within the plan.

    ??? example "Generic task input names"

        The following example demonstrates a task with generic `main` and `dev` inputs being mapped to more specific 
        artifact names, `repo` and `repo-dev`:

        ```yaml
        jobs:
          - name: task-input-mapping
            plan:
              - in_parallel:
                  - get: repo
                  - get: repo-dev
                  - get: ci
              - task: list-inputs
                input_mapping:
                  main: repo
                  dev: repo-dev
                file: ci/tasks/generic-inputs.yml
        
        resources:
          - name: repo
            type: mock
          - name: repo-dev
            type: mock
          - name: ci
            type: git
            source:
              uri: https://github.com/concourse/examples.git
        ```


??? info "`output_mapping`: { `output.name` : [`identifier`](../config-basics.md#identifier-schema) }"

    ### `output_mapping`
    A map from task output names to concrete names to register in the build plan. This allows a task with generic output
    names to be used multiple times in the same plan.

    ??? example "Using with `input_mapping`"

        This is often used together with `task` step `input_mapping`:

        Given this task config:

        ```yaml
        platform: linux
        image_resource:
          type: mock
          source:
            mirror_self: true
        
        inputs:
          - name: main
          - name: dev
        
        outputs:
          - name: main
          - name: dev
        
        run:
          path: sh
          args:
            - -c
            - |
              ls -lah
              echo "creating versions"
              echo "hello-world" > main/version
              echo "hey there dev" > dev/version
        ```

        This pipeline will map the inputs and outputs of the task to match the name of the resources in the pipeline.

        ```yaml
        jobs:
          - name: task-output-mapping
            plan:
              - in_parallel:
                  - get: repo
                  - get: repo-dev
                  - get: ci
              - task: create-outputs
                input_mapping:
                  main: repo
                  dev: repo-dev
                output_mapping:
                  main: repo
                  dev: repo-dev
                file: ci/tasks/generic-outputs.yml
              - in_parallel:
                  - put: repo
                    params:
                      file: repo/version
                  - put: repo-dev
                    params:
                      file: repo-dev/version
        
        resources:
          - name: repo
            type: mock
          - name: repo-dev
            type: mock
          - name: ci
            type: git
            source:
              uri: https://github.com/concourse/examples.git
        ```
