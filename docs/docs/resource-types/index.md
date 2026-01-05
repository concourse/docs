---
title: Resource Types
---

Each resource in a pipeline has a `type`. The resource's type determines what versions are detected, the bits that are
fetched when the resource's [`get` step](../steps/get.md) runs, and the side effect that occurs when the
resource's [put step](../steps/put.md) runs.

Concourse comes with a few "core" resource types to cover common use cases like `git` and `s3` - the rest are developed
and supported by the Concourse community. An exhaustive list of all resource types is available in
the [Resource Types catalog](https://resource-types.concourse-ci.org/).

A pipeline's resource types are listed under [`pipeline.resource_types`](../pipelines/index.md#pipeline-schema) with the
following schema:

## `resource_type` schema

??? warning "**`name`**: [`identifier`](../config-basics.md#identifier-schema) (required)"

    The name of the resource type. This should be short and simple. This name will be referenced by 
    [`pipeline.resources`](../pipelines/index.md#pipeline-schema) defined within the same pipeline, and 
    [`task-config.image_resource`](../tasks.md#task-config-schema)s used by tasks running in the pipeline.

    Pipeline-provided resource types can override the core resource types by specifying the same name.

??? warning "**`type`**: [`resource_type.name`](../resource-types/index.md#resource_type-schema) | [`identifier`](../config-basics.md#identifier-schema) (required)"

    The type of the resource used to provide the resource type's container image.

    This is a bit meta. Usually this value will be `registry-image` as the resource type must result in a container 
    image.

    A resource type's type can refer to other resource types, and can also use the core type that it's overriding. This 
    is useful for bringing in a newer or forked `registry-image` resource.

??? warning "**`source`**: [`config`](../config-basics.md#config-schema) (required)"

    The configuration for the resource type's resource. This varies by resource type, and is a black box to Concourse; 
    it is blindly passed to the resource at runtime.

    To use `registry-image` as an example, the source would contain something like `repository: username/reponame`. See 
    the [Registry Image resource](https://github.com/concourse/registry-image-resource) (or whatever resource type your 
    resource type uses) for more information.

??? info "`privileged`: [`boolean`](../config-basics.md#boolean-schema)"

    _Default `false`_. If set to `true`, the resource's containers will be run with full capabilities, as determined by 
    the worker backend the task runs on.

    For Linux-based backends it typically determines whether or not the container will run in a separate user namespace,
    and whether the `root` user is "actual" `root` (if set to `true`) or a user namespaced `root` (if set to `false`, 
    the default).

    This is a gaping security hole; only configure it if the resource type needs it (which should be called out in its 
    documentation). This is not up to the resource type to decide dynamically, so as to prevent privilege escalation via
    third-party resource type exploits.

??? info "`params`: [`config`](../config-basics.md#config-schema)"

    Arbitrary config to pass when running the [`get` step](../steps/get.md) to fetch the resource type's image. This is 
    equivalent to [`get` step `params`](../steps/get.md#get-step).

??? info "`check_every`: [`duration`](../config-basics.md#duration-schema)"

    _Default `1m`_. The interval on which to check for new versions of the resource. Acceptable interval options are 
    defined by the [time.ParseDuration function](https://golang.org/pkg/time/#ParseDuration).

??? info "`tags`: [`[string]`](../config-basics.md#string-schema)"

    _Default `[]`_. A list of tags to determine which workers the checks will be performed on. You'll want to specify 
    this if the source is internal to a worker's network, for example. See also 
    [`tags`](../steps/modifier-and-hooks/tags.md)

??? info "`defaults`: [`config`](../config-basics.md#config-schema)"

    The default configuration for the resource type. This varies by resource type, and is a black box to Concourse; it 
    is merged with (duplicate fields are overwritten by) [`resource.source`](../resources/index.md#resource-schema) and 
    passed to the resource at runtime.

    ??? example "Setting default configuration for resources"

        ```yaml
        resource_types:
          - name: gcs
            type: registry-image
            source:
              repository: frodenas/gcs-resource
            defaults:
              json_key: ((default_key))
        
        resources:
          - name: bucket-a
            type: gcs
            source:
              bucket: a
        
          - name: bucket-b
            type: gcs
            source:
              bucket: b
        
          - name: bucket-c
            type: gcs
            source:
              bucket: c
              json_key: ((different_key))
        ```

    ??? example "Overrides default resource types"

        Since it's possible to overwrite the base resource types, it can be used to give defaults to resources at the 
        pipeline level.

        ```yaml
        resource_types:
          - name: registry-image
            type: registry-image
            source:
              repository: concourse/registry-image-resource
            defaults:
              registry_mirror:
                host: https://registry.mirror.example.com
        
        resources:
          - name: mirrored-image
            type: registry-image
            source:
              repository: busybox
        ```

    Alternatively, the web node can be configured to use 
    [defaults for base resource types](../install/running-web.md#configuring-defaults-for-resource-types)

---

??? example "Using a `rss` resource type to subscript to RSS feeds"

    Resource Types can be used to extend the functionality of your pipeline and provide deeper integrations. This 
    example uses one to trigger a job whenever a new [Dinosaur Comic](http://www.qwantz.com/) is out.
    
    ```yaml
    ---
    resource_types:
      - name: rss
        type: registry-image
        source:
          repository: suhlig/concourse-rss-resource
          tag: latest
    
    resources:
      - name: booklit-releases
        type: rss
        source:
          url: http://www.qwantz.com/rssfeed.php
    
    jobs:
      - name: announce
        plan:
          - get: booklit-releases
            trigger: true
    ```
