---
title: In Parallel Step
---

# `in_parallel` Step

Performs the given steps in parallel. If any sub-steps in a `parallel` result in a failure or error, the parallel step
as a whole is considered to have failed or errored. Expand each section below for more details and examples.

??? warning "**`in_parallel`**: [`[step]`](index.md) | [`in_parallel_config`](#in_parallel_config-schema) (required)"

    Steps are either configured as a array or within an [`in_parallel_config` schema](#in_parallel_config-schema).

    ??? example "Fetching artifacts in parallel"

        Using the `in_parallel` step where possible is the easiest way to speeding up a builds.

        It is often used to fetch all dependent resources together at the start of a build plan:

        ```yaml
        jobs:
          - name: get-in-parallel
            plan:
              - in_parallel:
                  - get: ci
                  - get: repo
                  - get: code
        
        resources:
          - name: repo
            type: mock
          - name: code
            type: mock
          - name: ci
            type: mock
        ```

    ??? example "Running a build matrix"

        If any step in the `in_parallel` fails, the build will fail, making it useful for build matrices:

        ```yaml
        plan:
          - get: some-repo
          - in_parallel:
              - task: unit-windows
                file: some-repo/ci/windows.yml
              - task: unit-linux
                file: some-repo/ci/linux.yml
              - task: unit-darwin
                file: some-repo/ci/darwin.yml
        ```

## `in_parallel_config` schema

Instead of passing in a list of steps to `in_parallel` you can pass in the following fields. The list of steps will fall
under the `steps` field.

??? warning "**`steps`**: [`[step]`](index.md) (required)"

    The steps to perform in parallel.

    ??? example "Fetching artifacts in parallel"

        Using the `in_parallel` step where possible is the easiest way to speeding up a builds.

        It is often used to fetch all dependent resources together at the start of a build plan:

        ```yaml
        jobs:
          - name: get-in-parallel
            plan:
              - in_parallel:
                  limit: 2
                  fail_fast: false
                  steps:
                    - get: ci
                    - get: repo
                    - get: code
        
        
        resources:
          - name: repo
            type: mock
          - name: code
            type: mock
          - name: ci
            type: mock
        ```

??? info "**`limit`**: [`number`](../config-basics.md#number-schema)"

    _Default unlimited_. A semaphore which limits the parallelism when executing the steps in an `in_parallel` step. 
    When set, the number of running steps will not exceed the limit.

    When not specified, `in_parallel` will execute all steps immediately.

    ??? example "Limiting parallelism"

        Using `limit` is useful for performing parallel execution of a growing number of tasks without overloading your 
        workers. In the example below, two tasks will be run in parallel and in order until all steps have been 
        executed:

        ```yaml
        jobs:
          - name: limit-in-parallel
            plan:
              - get: examples
              - in_parallel:
                  limit: 2
                  steps:
                    - task: print-date
                      file: examples/tasks/print-date.yml
                    - task: hello-world
                      file: examples/tasks/hello-world.yml
                    - task: print-var
                      file: examples/tasks/print-var.yml
                      vars:
                        my-var: hello
                        second-var: good-bye
        
        
        resources:
          - name: examples
            type: git
            source:
              uri: https://github.com/concourse/examples.git
        ```

??? info "**`fail_fast`**: [`boolean`](../config-basics.md#boolean-schema)"

    _Default `false`_. When enabled, the parallel step will fail fast by returning as soon as any sub-step fails. This 
    means that running steps will be interrupted and pending steps will no longer be scheduled.
