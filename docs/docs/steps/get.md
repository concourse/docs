---
title: Get Step
---

# `get` Step

Fetches a version of a [resource](../resources/index.md). Expand each section below for more details and examples.

??? warning "**`get`**: [`resource.name`](../resources/index.md#resource-schema) | [`identifier`](../config-basics.md#identifier-schema)"

    The fetched bits will be registered in the build's artifact namespace under the given identifier. Subsequent 
    [`task` step](task.md) and [`put` step](put.md) which list the identifier as an input will have a copy of the bits 
    in their working directory.

    ??? example "Fetching a repo and passing it to a task"
    
        Almost every simple job will look something like this: fetch my code with a [`get` step](get.md) and do 
        something (run tests) with it in a [`task` step](task.md).

        ```yaml
        jobs:
          - name: fetch-repo
            plan:
              - get: repo # fetches repo under artifact name "repo"
              - task: ls-repo
                config:
                  platform: linux
                  image_resource:
                    type: mock
                    source:
                      mirror_self: true
                  # pass the "repo" artifact into the task
                  inputs:
                    - name: repo
                  run:
                    path: ls
                    args:
                      - "-lah"
                      - "repo"
        
        resources:
          - name: repo
            type: git
            source:
              uri: https://github.com/concourse/examples.git
        ```

??? info "**`resource`**: [`resource.name`](../resources/index.md#resource-schema)"

    _Defaults to the value of `get`_. The resource to fetch, as configured in 
    [`pipeline.resources`](../pipelines/index.md#pipeline-schema).
    
    Use this attribute to rename a resource from the overall pipeline context into the job-specific context.

    ??? example "Re-labeling artifact"
        
        ```yaml
        jobs:
          - name: fetch-repo
            plan:
              - get: thecode # fetches "repo" under artifact name "thecode"
                resource: repo
              - task: ls-repo
                config:
                  platform: linux
                  image_resource:
                    type: mock
                    source:
                      mirror_self: true
                  # pass the "thecode" artifact into the task
                  inputs:
                    - name: thecode
                  run:
                    path: ls
                    args:
                      - "-lah"
                      - "thecode"
        
        resources:
          - name: repo
            type: git
            source:
              uri: https://github.com/concourse/examples.git
        ```

??? info "**`passed`**: [`[job.name]`](../jobs.md#job-schema)"

    When specified, only the versions of the resource that made it through the given list of jobs (AND-ed together) will
    be considered when triggering and fetching.

    ??? example "Fanning out and in"

        If multiple `get`s are configured with `passed` constraints, all the mentioned jobs are correlated.

        ```yaml
        jobs:
          - name: lvl-1-firewall
            plan:
              - in_parallel:
                  - get: black-ice
                  - get: control-node
                  - get: cyberdeck
        
          - name: lvl-2-unit
            plan:
              - in_parallel:
                  - get: black-ice
                    passed:
                      - lvl-1-firewall
                  - get: control-node
                    passed:
                      - lvl-1-firewall
                  - get: cyberdeck
                    passed:
                      - lvl-1-firewall
        
          - name: lvl-2-integration
            plan:
              - in_parallel:
                  - get: black-ice
                    passed:
                      - lvl-1-firewall
                  - get: control-node
                    passed:
                      - lvl-1-firewall
                  - get: cyberdeck
                    passed:
                      - lvl-1-firewall
        
          - name: lvl-3-production
            plan:
              - in_parallel:
                  - get: black-ice
                    passed:
                      - lvl-2-unit
                      - lvl-2-integration
                  - get: control-node
                    passed:
                      - lvl-2-unit
                      - lvl-2-integration
                  - get: cyberdeck
                    passed:
                      - lvl-2-unit
                      - lvl-2-integration
        
        resources:
          - name: black-ice
            type: mock
            source:
              initial_version: lvl4
          - name: control-node
            type: mock
            source:
              initial_version: tower
          - name: cyberdeck
            type: mock
            source:
              initial_version: mk3
        ```

        For the final job, `lvl-3-production`, only versions that have passed the previous two jobs (`lvl-2-unit` and 
        `lvl-2-integration`) will be passed to `lvl-3-production`.

        This is crucial to being able to implement safe "fan-in" semantics as things progress through a pipeline.

??? info "**`params`**: [`config`](../config-basics.md#config-schema)"

    Arbitrary configuration to pass to the resource. Refer to the resource type's documentation to see what it supports.

    ??? example "Fetching with params"

        ```yaml
        jobs:
          - name: resource-params
            plan:
              - get: cyberdeck
                params:
                  create_files_via_params:
                    version_to_put.txt: "made-via-params"
              - put: cyberdeck
                params:
                  file: cyberdeck/version_to_put.txt
        
        
        resources:
          - name: cyberdeck
            type: mock
        ```

??? info "**`trigger`**: [`boolean`](../config-basics.md#boolean-schema)"

    _Default `false`_. If set to `true`, new builds of the job will be automatically created when a new version for this input becomes available.
    
    !!! note
    
        If none of a job's `get` steps are set to `true`, the job can only be manually triggered.

    ??? example "Automatically trigger job on new version"

        ```yaml
        jobs:
          - name: fetch-repo
            plan:
              - get: repo
                trigger: true # automatically runs the job
              - task: ls-repo
                config:
                  platform: linux
                  image_resource:
                    type: mock
                    source:
                      mirror_self: true
                  inputs:
                    - name: repo
                  run:
                    path: ls
                    args: [ "-lah","repo" ]
        
        resources:
          - name: repo
            type: git
            source:
              uri: https://github.com/concourse/examples.git
        ```

??? info "**`version`**: `latest` | `every` | [`version`](../config-basics.md#version-schema)"

    _Default `latest`_. The version of the resource to fetch.

    If set to `latest`, scheduling will just find the latest available version of a resource and use it, allowing 
    versions to be skipped. This is usually what you want, e.g. if someone pushes 100 git commits.

    If set to `every`, builds will walk through all available versions of the resource. 

    !!! note
        
        If `passed` is also configured, it will only step through the versions satisfying the constraints.

    If set to a specific version (e.g. `{ref: abcdef123}`), only that version will be used. 

    !!! note
        The version must be available and detected by the resource, otherwise the input will never be satisfied. You may
        want to use [`fly check-resource`](../resources/managing-resources.md#fly-check-resource) to force detection of 
        resource versions, if you need to use an older one that was never detected (as all newly configured resources 
        start from the latest version).