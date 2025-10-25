---
title: Across Step Modifier
---

# `across` Step Modifier

Run a step multiple times with different combinations of variable values.

!!! warning "Experimental Feature"

    The `across` step is not enabled by default. To enable `across` for your deployment, you must set the feature flag 
    `CONCOURSE_ENABLE_ACROSS_STEP`. The `across` step may be enabled by default in a future version of Concourse.

The `across` step can be combined with the [`load_var` step](../load-var.md),
the [`set_pipeline` step](../set-pipeline.md), and [instanced pipelines](../../pipelines/grouping-pipelines.md) to
maintain a dynamically sized group of related pipelines.

More fields are also available for variable interpolation with the across step.
See [Across Step & Dynamic Vars](../../vars.md#across-step--dynamic-vars) for details.

!!! note

    Outputs from steps ran within the across step are not available to steps outside of the across step.

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