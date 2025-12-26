---
title: Pipelines
---

A pipeline is the result of configuring [Jobs](../jobs.md) and [Resources](../resources/index.md) together. When
you configure a pipeline, it takes on a life of its own, to continuously detect resource versions and automatically
queue new builds for jobs as they have new available inputs.

The name of a pipeline has a few restrictions that are outlined here: [
`identifier` schema](../config-basics.md#identifier-schema).

Pipelines are configured via [`fly set-pipeline`](setting-pipelines.md#fly-set-pipeline) or the [
`set_pipeline` step](../steps/set-pipeline.md) as declarative [YAML files](../config-basics.md#intro-to-yaml) which 
conform to the following schema:

## `pipeline` schema

??? warning "**`jobs`**: [`[job]`](../jobs.md#job-schema)"

    A set of [jobs](../jobs.md) for the pipeline to continuously schedule. At least one job is required for 
    a pipeline to be valid.

??? info "`resources`: [`[resource]`](../resources/index.md#resource-schema)"

    A set of resources for the pipeline to continuously check.

??? info "`resource_types`: [`[resource_type]`](../resource-types/index.md#resource_type-schema)"

    A set of resource types for resources within the pipeline to use.

??? info "`var_sources`: [`[var_source]`](../vars.md#var_source-schema)"

    A set of Var sources for the pipeline to use.

??? info "`groups`: `[group]`"

    A list of job groups to use for organizing jobs in the web UI.

    Groups have no functional effect on your pipeline. They are purely for making it easier to grok large pipelines 
    in the web UI.

    !!! note 

        Once you have added groups to your pipeline, all jobs must be in a group.

    ??? example "Grouping Jobs"

        The following example will make the "tests" group the default view (since it's listed first), separating the later jobs into a "publish" group:

        ```yaml
        groups:
          - name: test
            jobs:
              - unit
              - integration
          - name: publish
            jobs:
              - deploy
              - shipit
        ```

        This would display two tabs at the top of the home page: "test" and "publish".

        For a real world example of how groups can be used to simplify navigation and provide logical grouping, 
        see the groups used at the top of the page in the [Concourse pipeline](https://ci.concourse-ci.org/).

    ### `group_config` schema
    
    ??? warning "**name**: **[`identifier`](../config-basics.md#identifier-schema)**"

        A unique name for the group. This should be short and simple as it will be used as the tab name for navigation.

    ??? info "**jobs**: [`job.name`]"
    
        A list of jobs that should appear in this group. A job may appear in multiple groups. Neighbours of jobs in the 
        current group will also appear on the same page in order to give context of the location of the group in 
        the pipeline.

        You may also use any valid [glob](https://www.man7.org/linux/man-pages/man7/glob.7.html) to represent several 
        jobs, e.g.:

        ```yaml
        groups:
          - name: develop
            jobs:
              - terraform-*
              - test
              - deploy-{dev,staging}
          - name: ship
            jobs:
              - deploy-prod
          - name: all
            jobs:
              - "*"
        ```

        In this example, the `develop` group will match `terraform-apply`, `terraform-destroy`, `test`, `deploy-dev`, 
        `deploy-staging`. The `ship` group will only match `deploy-prod`. The `all` group will match all jobs in the 
        pipeline.

        !!! warning "Note"
            
            Depending on how it's used, *, {, and } have special meaning in YAML, and may need to be quoted 
            (as was done in the all job above)

??? info "`display`: `display_config`"

    !!! warning "Experimental Feature"
        
        Display was introduced in Concourse v6.6.0. It is considered an **experimental** feature.
    
    Visual configurations for personalizing your pipeline.

    ??? example "Background image"

        The following example will display an image in the background of the pipeline it is configured on.

        ```yaml
        display:
          background_image: https://avatars1.githubusercontent.com/u/7809479?s=400&v=4
        ```

    ### `display_config` schema
    
    ??? info "**background_image**: [`string`](../config-basics.md#string-schema)"

        Allows users to specify a custom background image for the pipeline. Must be an http, https, or relative URL.

    ??? info "**background_filter**: [`string`](../config-basics.md#string-schema)"
    
        Default _`opacity(30%) grayscale(100%)`_. Allows users to specify custom 
        [CSS filters](https://developer.mozilla.org/en-US/docs/Web/CSS/filter) that are applied to the 
        `background_image`.