---
title: Across Step Modifier
---

# `across` Step Modifier

Run a step multiple times with different combinations of variable values.

The `across` step can be combined with the [`load_var` step](../load-var.md),
the [`set_pipeline` step](../set-pipeline.md), and [instanced pipelines](../../pipelines/grouping-pipelines.md) to
maintain a dynamically sized group of related pipelines.

More fields are also available for variable interpolation with the across step.
See [Across Step & Dynamic Vars](../../vars.md#across-step-dynamic-vars) for details.

!!! note

    Outputs from steps ran within the across step are not available to steps outside of the across step.

??? info "`across`: [`[across_var]`](#across_var-schema)"

    Contains a list of `across_var` schema.

    ### `across_var` schema
    
    ??? warning "**var**: **[`identifier`](../../config-basics.md#identifier-schema)** (required)"

        The name of the variable that will be added to the ["`.`" var source](../../vars.md#local-var). This variable 
        will only be accessible in the scope of the step - each iteration of the step gets its own scope.

        If a variable of the same name already exists in the parent scope, a warning will be printed.

    ??? warning "**values**: **[`[value]`](../../config-basics.md#value-schema)** (required)"

        The list of values that the var will iterate over when running the substep. If multiple vars are configured, all
        combinations of values across all vars will run.

        The list of values may also be interpolated. For instance, you may use the [`load_var` step](../load-var.md) to 
        first load a list of [`value` schema](../../config-basics.md#value-schema) into a 
        [local var](../../vars.md#local-var), and then iterate across that dynamic list of values.

        ??? example "Value combinations"

            The following `across` will run the task `foo/build.yml` for each package defined in 
            `foo/packages-to-build.json` with Go 1.15 and 1.16.

            ```yaml
            plan:
              - get: foo
              - load_var: packages
                file: foo/packages-to-build.json
              - across:
                  - var: package
                    values: ((.:packages))
                  - var: go_version
                    values: [ '1.15', '1.16' ]
                task: build
                file: foo/build.yml
                vars:
                  go_version: ((.:go_version))
                  package: ((.:package))
            ```

            Supposing `foo/packages-to-build.json` had the following content:

            ```json
            ["./cmd/first", "./cmd/second", "./cmd/third"]
            ```

            ...then the task `foo/build.yml` would be run with the following var combinations:

            ```json
            [
              {
                package: "./cmd/first",
                go_version: "1.15"
              },
              {
                package: "./cmd/first",
                go_version: "1.16"
              },
              {
                package: "./cmd/second",
                go_version: "1.15"
              },
              {
                package: "./cmd/second",
                go_version: "1.16"
              },
              {
                package: "./cmd/third",
                go_version: "1.15"
              },
              {
                package: "./cmd/third",
                go_version: "1.16"
              }
            ]
            ```

    ??? info "`max_in_flight`: `all` | [`number`](../../config-basics.md#number-schema)"
    
        _Default `1`_. If set to `all`, the substep will run with all combinations of the current var in parallel. If 
        set to a [`number` schema](../../config-basics.md#number-schema), only that number of substeps may run in 
        parallel.
    
        ??? example "Multiple vars"
    
            If multiple vars are configured, the effective `max_in_flight` is multiplicative. For instance:
    
            ```yaml
            plan:
              - across:
                  - var: var1
                    values:
                      - a
                      - b
                      - c
                    max_in_flight: all
                  - var: var2
                    values:
                      - 1
                      - 2
                  - var: var3
                    values:
                      - foo
                      - bar
                    max_in_flight: 2
            ```
    
            Here, **6 substeps** will run in parallel, since all 3 of `var1`'s values can run in parallel, and 2 of `var3`'s
            values can run in parallel.

??? info "`fail_fast`: [`boolean`](../../config-basics.md#boolean-schema)"

    _Default `false`_. When enabled, the `across` step will fail fast by returning as soon as any sub-step fails. This 
    means that running steps will be interrupted and pending steps will no longer be scheduled.

    ??? example "Fail fast"

        The `fail_fast` key sits at the same level as the `across` key.

        ```yaml
        plan:
          - across:
              - var: var1
                values:
                  - a
                  - b
                  - c
              - var: var2
                values:
                  - 1
                  - 2
            fail_fast: true
        ```

## Examples

??? example "Across with task step"

    ```yaml
    jobs:
      - name: job
        plan:
          - across:
              - var: some-text
                values: [ "hello-world", "hello-concourse" ]
            task: running-((.:some-text))
            config:
              platform: linux
              image_resource:
                type: mock
                source:
                  mirror_self: true
              run:
                path: echo
                args: [ "((.:some-text))" ]
    ```

??? example "Across with input and output mapping"

    ```yaml
    resources:
      - name: ci
        type: git
        source:
          uri: https://github.com/concourse/examples.git
    
    jobs:
      - name: job
        plan:
          - get: ci
          - across:
              - var: pipeline
                values: [ "hello-world", "time-triggered" ]
            do:
              - task: running-((.:pipeline))
                input_mapping:
                  ((.:pipeline)): ci
                output_mapping:
                  ((.:pipeline)): newci
                config:
                  platform: linux
                  image_resource:
                    type: mock
                    source:
                      mirror_self: true
                  inputs:
                    - name: ((.:pipeline))
                  outputs:
                    - name: ((.:pipeline))
                  run:
                    path: cat
                    args: [ "((.:pipeline))/pipelines/((.:pipeline)).yml" ]
              - task: newci-((.:pipeline))
                config:
                  platform: linux
                  image_resource:
                    type: mock
                    source:
                      mirror_self: true
                  inputs:
                    - name: newci
                  run:
                    path: cat
                    args: [ "newci/pipelines/((.:pipeline)).yml" ]
    ```

??? example "Across with `set_pipeline` step"

    ```yaml
    resources:
      - name: ci
        type: git
        source:
          uri: https://github.com/concourse/examples.git
    
    jobs:
      - name: job
        plan:
          - get: ci
          - across:
              - var: pipeline
                values: [ "hello-world", "time-triggered" ]
            set_pipeline: ((.:pipeline))
            file: ci/pipelines/((.:pipeline)).yml
    ```

??? example "Across with multiple steps"

    Use the [`do` step](../do.md) to across over multiple steps.
    
    ```yaml
    jobs:
      - name: job
        plan:
          - across:
              - var: name
                values: [ "Kaladin", "Jasnah" ]
            do: # takes a list of steps
              - task: saying-hello
                config:
                  platform: linux
                  image_resource:
                    type: mock
                    source:
                      mirror_self: true
                  run:
                    path: echo
                    args: [ "Hello ((.:name))!" ]
              - task: saying-bye
                config:
                  platform: linux
                  image_resource:
                    type: mock
                    source:
                      mirror_self: true
                  run:
                    path: echo
                    args: [ "Bye ((.:name))!" ]
    ```

??? example "Multi-branch workflows (instance pipelines)"

    You can use the across step to set a pipeline for each branch in a git repository.
    
    ```yaml
    plan:
      - get: release-branches
        trigger: true
      - get: ci
      - load_var: branches
        file: release-branches/branches.json
      - across:
          - var: branch
            values: ((.:branches))
        set_pipeline: release
        file: ci/pipelines/release.yml
        instance_vars: { branch: ((.:branch.name)) }
    ```
    
    When a new branch is added, a new pipeline will be created. When a branch is deleted, the pipeline will be 
    automatically archived as described in the [`set_pipeline` step](../set-pipeline.md).
    
    For a more complete example, refer to [Multi-Branch Workflows](../../how-to/git-guides/multi-branch.md).

## Limitations

The `across` step does not work with the [`get` step](../get.md) or [`put` step](../put.md). The names of resources are
not interpolated within across steps. Trying to do the following will not work.

```yaml
- across:
    - var: version
      values: [ "1.16", "1.17" ]
  do:
    - get: go-((.:version))
    # or this
    - get: golang
      resource: go-((.version))
```

The main reason this does not work is that Concourse determines the inputs for a job before the job starts. Concourse
has no way of determining inputs for a job while it's in the middle of running.

Current pipeline validation logic will also block you from setting the pipeline at all since Concourse validates the
relationship between all resources and jobs by looking at get and put steps.

The above example will return an error like this when trying to set the pipeline:

```yaml
invalid jobs:
  jobs.job.plan.do[0].across.get(go): unknown resource 'go-((.:version))'
```
