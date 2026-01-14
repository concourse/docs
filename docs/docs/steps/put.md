---
title: Put Step
---

# `put` Step

Pushes to the given [resource](../resources/index.md). Expand each section below for more details and examples.

??? warning "**`put`**: [`resource.name`](../resources/index.md#resource-schema) | [`identifier`](../config-basics.md#identifier-schema) (required)"

    When the step succeeds, the version by the step will be immediately fetched via an additional implicit 
    [`get` step](get.md). This is so that later steps in your plan can use the artifact that was produced. The artifact 
    will be available under the identifier `put` specifies.

    ??? example "Getting and Putting"

        The following plan fetches a version using [`get`](get.md) and pushes it to another resource using `put`:

        ```yaml
        jobs:
          - name: get-and-pull
            plan:
              - get: the-ice
              - put: cyberdeck
                params:
                  file: the-ice/version.txt
        
        resources:
          - name: the-ice
            type: mock
            source:
              create_files:
                version.txt: "made-via-source"
          - name: cyberdeck
            type: mock
        ```

??? info "**`resource`**: [`resource.name`](../resources/index.md#resource-schema)"

    _Defaults to the value of `put`_. The resource to fetch, as configured in 
    [`pipeline.resources`](../pipelines/index.md#pipeline-schema).
    
    Use this attribute to rename a resource from the overall pipeline context into the job-specific context.

    ??? example "Re-labeling Put Resource"

        ```yaml
        jobs:
          - name: fetch-repo
            plan:
              # puts to "repo" and fetches new version under artifact name "thecode"
              - put: thecode
                resource: repo
                params:
                  version: put-only
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
            type: mock
        ```

??? info "**`version`**: `detect` | `all` | [`[identifier]`](../config-basics.md#identifier-schema)"

    _Default `detect`_.

    When not set, or set to `detect`, the artifacts are detected based on the
    configured `put` step `params` by looking for all string values and using
    the first path segment as an identifier.

    If set to `all`, all artifacts will be provided. This can result in slow
    performance if the prior steps in the build plan register a bunch of large
    artifacts before this step, so you may want to consider being explicit.

    If configured as a list of identifiers, only the listed artifacts will be
    provided to the container.


    ??? example "Put Input Methods"

        ```yaml
        jobs:
          - name: put-input-methods
            plan:
              - in_parallel:
                  - get: repo-dev
                  - get: repo-master
                  - get: app-image
                  - get: ci
              - put: detect-inputs
                resource: repo
                inputs: detect # default, will only stream the "ci" artifact
                params:
                  file: ci/version.txt
              - put: all-inputs
                resource: repo
                inputs: all # will stream all artifacts
                params:
                  file: ci/version.txt
              - put: explicit-inputs
                resource: repo
                inputs: # explicitly list artifacts to stream to put step
                  - ci
                params:
                  file: ci/version.txt
        
        resources:
          - name: repo
            type: mock
          - name: repo-dev
            type: mock
          - name: repo-master
            type: mock
          - name: app-image
            type: mock
          - name: ci
            type: mock
            source:
              create_files:
                version.txt: "42"
        ```

??? info "**`params`**: [`config`](../config-basics.md#config-schema)"

    Arbitrary configuration to pass to the resource. Refer to the resource type's documentation to see what it supports.

    ??? example "Putting with params"

        ```yaml
        jobs:
          - name: resource-params
            plan:
              - put: cyberdeck
                params:
                  version: "made-via-params"
        
        resources:
          - name: cyberdeck
            type: mock
        ```

??? info "**`get_params`**: [`config`](../config-basics.md#config-schema)"

    Arbitrary configuration to pass to the resource during the implicit `get` step. Refer to the resource type's 
    documentation to see what it supports.

    ??? example "Parameterizing the implicit `get`"

        You can control the settings of the implicit `get` step by setting `get_params`. For example, if you did not 
        want a `put` step utilizing the [`registry-image` resource 
        type](https://github.com/concourse/registry-image-resource) to download the image, you would implement your 
        `put` step as such:

        ```yaml
        plan:
          - put: app-image
            params:
              build: git-resource
            get_params:
              skip_download: true
        ```

??? info "**`no_get`**: [`boolean`](../config-basics.md#boolean-schema)"

    Skips the get step that usually follows the completion of the put step.
    This is useful to set if your `put` steps are at the very end of your job
    and no further steps would use the artifact generated by the implicit
    `get` step.
