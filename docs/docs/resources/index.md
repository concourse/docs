---
title: Resources
---

Resources are the heart and soul of Concourse. They represent all external inputs to and outputs of [jobs](../jobs.md)
in the pipeline.

Each resource represents a versioned artifact with an external source of truth. Configuring the same resource in any
pipeline on any Concourse cluster will behave the exact same way. Concourse will continuously `check` each configured
resource to discover new versions. These versions then flow through the pipeline via [`get` steps](../steps/get.md)
configured on [Jobs](../jobs.md).

More concretely, resources are containers that run on your workers.
See [Implementing a Resource Type](../resource-types/implementing.md) for more details.

A pipeline's resources are listed under [`pipeline.resources`](../pipelines/index.md#pipeline-schema) with the following
schema.

## `resource` schema

??? warning "**`name`**: [`identifier`](../config-basics.md#identifier-schema)"

    The name of the resource. This should be short and simple. This name will be referenced by 
    [build plans](../steps/index.md) of jobs in the pipeline.

??? warning "**`type`**: [`resource_type.name`](../resource-types/index.md#resource_type-schema)"

    The [resource type](../resource-types/index.md) implementing the resource.

??? warning "**`source`**: [`config`](../config-basics.md#config-schema)"

    The configuration for the resource. This varies by resource type, and is a black box to Concourse; it is blindly 
    passed to the resource at runtime.
    
    To use `git` as an example, the source may contain the repo URI, the branch of the repo to track, and a private key 
    to use when pushing/pulling.
    
    By convention, documentation for each resource type's configuration is in each implementation's `README`.
    
    You can find the source for the resource types provided with Concourse at the 
    [Concourse GitHub organization](https://github.com/concourse?q=-resource).

??? info "**`old_name`**: [`identifier`](../config-basics.md#identifier-schema)"

    The old name of the resource. If configured, the history of the old resource will be inherited to the new one. Once 
    the pipeline is set, this field can be removed as the history has been transferred.

    ??? example "Renaming a resource"
    
        This can be used to rename a resource without losing its history, like so:

        ```yaml
        resources:
          - name: new-name
            old_name: current-name
            type: git
            source:
              uri: "https://github.com/vito/booklit"
        ```

        After the pipeline is set, the resource was successfully renamed, so the `old_name` field can be removed from 
        the resource:

        ```yaml
        resources:
          - name: new-name
            type: git
            source:
              uri: "https://github.com/vito/booklit"
        ```

??? info "`icon`: [`string`](../config-basics.md#string-schema)"

    The name of a [Material Design icon](https://materialdesignicons.com/) to show next to the resource name in the web 
    UI. For example, `github`.

??? info "`version`: [`version`](../config-basics.md#version-schema)"

    A version to pin the resource to across the pipeline. This has the same effect as setting 
    [`get` step `version`](../steps/get.md#get-step) on every `get` step referencing the resource.

    Resources can also be temporarily pinned to a version via the API and web UI. However, this functionality is 
    disabled if the resource is pinned via configuration, and if a pipeline is configured to have a version pinned while
    also pinned in the web UI, the configuration takes precedence and will clear out the temporary pin.

??? info "`check_every`: [`duration`](../config-basics.md#duration-schema) | `never`"

    _Default `1m`_. The interval on which to check for new versions of the resource. Acceptable interval options are 
    defined by the [time.ParseDuration function](https://golang.org/pkg/time/#ParseDuration).

    If set to `never` the resource will not be automatically checked. The resource can still be checked manually via the
    web UI, fly, or webhooks.

??? info "`check_timeout`: [`duration`](../config-basics.md#duration-schema)"

    _Default `1h`_. The time limit on checking new versions of resources. Acceptable interval options are defined by the
    [time.ParseDuration function](https://golang.org/pkg/time/#ParseDuration).

??? info "`expose_build_created_by`: [`boolean`](../config-basics.md#boolean-schema)"

    _Default `false`_. If set to `true`, environment variable 
    [`BUILD_CREATED_BY`](../resource-types/implementing.md#metadata) will be available in the metadata of a 
    [`put` step](../steps/put.md). This field is not made available to the [`get` step](../steps/get.md).

??? info "`tags`: [`[string]`](../config-basics.md#string-schema)"

    _Default `[]`_. A list of tags to determine which workers the checks will be performed on. You'll want to specify 
    this if the source is internal to a worker's network, for example.

    !!! warning

        This does not apply tags to all [`get` steps](../steps/get.md) or [`put` steps](../steps/put.md) that use the 
        resource. If you want these steps to use tags, you must set [`tags`](../steps/modifier-and-hooks/tags.md) for 
        each step.

??? info "`public`: [`boolean`](../config-basics.md#boolean-schema)"

    _Default `false`_. If set to `true`, the metadata for each version of the resource will be viewable by 
    unauthenticated users (assuming the pipeline has been [exposed](../auth-and-teams/exposing.md)).

    Resource metadata should never contain credentials or secret information, but this is off by default just to be 
    safe in case users don't want to show things like commit messages and authors to the public.

    !!! note
    
        Even when set to `false`, the versions identifiers will be visible. In addition, if a resource is fetched in a 
        build whose job is marked [`job.public`](../jobs.md#job-schema), metadata will be visible in the build output.

??? info "`webhook_token`: [`string`](../config-basics.md#string-schema)"

    If specified, web hooks can be sent to trigger an immediate _check_ of the resource, specifying this value as a 
    primitive form of authentication via query params.

    After configuring this value, you would then configure your hook sender with the following painfully long path 
    appended to your external URL:

    ```
    /api/v1/teams/TEAM_NAME/pipelines/PIPELINE_NAME/resources/RESOURCE_NAME/check/webhook?webhook_token=WEBHOOK_TOKEN
    ```

    For [instance pipelines](../pipelines/grouping-pipelines.md#managing-instanced-pipelines) you will need to include 
    the pipeline vars for a single pipeline instance. Currently, you can not have webhooks for all instances of a 
    pipeline.

    The pipeline vars should be added to the webhook URL as [URL 
    parameters](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL#parameters) with the 
    format `vars.MY-VAR="SOME-VALUE"`. A webhook URL for a pipeline instance may look like this:

    ```
    /api/v1/teams/TEAM_NAME/pipelines/PIPELINE_NAME/resources/RESOURCE_NAME/check/webhook?webhook_token=WEBHOOK_TOKEN&vars.my-var="some-value"&vars.second-var="two"
    ```

    !!! note
    
        The request payload sent to this API endpoint is entirely ignored. You should configure the resource as if 
        you're not using web hooks, as the resource config is still the "source of truth."
