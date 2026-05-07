---
title: Resource Checker
---

[Resources](../resources/index.md) represent external state such as a git
repository, files in an S3 bucket, or anything else that changes over time. By
modelling these as resources, it allows you to use this external state as
inputs (or triggers) to your workloads.

## When are resources checked?

The component that schedules resource checks is called the **Resource
Checker**, internally called `lidar`. The Resource Checker runs on an interval
and will check for any resources that need to be checked since it last ran. The
interval the Resource Checker runs at by default is 10 seconds and can be
configured by setting `CONCOURSE_LIDAR_SCANNER_INTERVAL` on the web node.

The Resource Checker checks for any resources that have surpassed their
individual [`resource.check_every`](../resources/index.md#resource-schema)
interval. The default check interval is one minute and can be globally
configured by setting `CONCOURSE_RESOURCE_CHECKING_INTERVAL` on the web node.

If one minute seems like a lot of checking, it is, but it's how Concourse keeps
everything snappy. You can configure this interval independently for each
resource using `check_every`.

There's an obvious trade-off with regards to checking frequency. The more
frequently you check a resource, the bigger the strain on Concourse (as well as
the external source). However, if you want to pick up those new commits as
quickly as possible, then you need to poll as often as possible.

If your external service supports it, you can set
[`resource.webhook_token`](../resources/index.md#resource-schema) to eliminate
the need for periodic checking altogether. If a `webhook_token` is configured,
the external service can notify Concourse when to check for new versions. Note
that configuring a `webhook_token` will not stop Concourse from periodically
checking your resource. If you wish to rely solely on webhooks for detecting
new versions, you can set `check_every` to `never` for a resource.

On every interval tick, the Resource Checker will see if there are any
resources that need to be checked. It does this by looking for resources that
match the following criteria:

- Resource is an input AND a trigger for a job
    - Has to have been longer than the `check_every` interval of the resource
- Resource has not returned a version yet
- Resource has never been checked before
- Resource errored the last time it was checked

!!! note

    Prior to v8.2.0, the Resource Checker looked for resources that were JUST
    inputs to jobs and didn't check if they triggered the job or not. This
    resulted in more checks being run than was necessary for Concourse to
    schedule builds.

With one of the four top-level criteria met, a check for the resource will be
scheduled. In practice this means that if a resource has a `check_every` of
`1m`, it is not guaranteed to be checked precisely every 60 seconds.
`check_every` simply sets a lower bound on the time between checks.

When a resource check is scheduled, it creates a new build that invokes the
[`check`
script](../resource-types/implementing.md#check-check-for-new-versions) of the
resource's underlying [resource type](../resource-types/index.md).

### Checks When a Build Starts

When a job is triggered, Concourse will likely create a few resource checks
before it starts the job. Concourse will create resource checks in the
following scenarios:

- Manually triggered job:
    - All input resources are checked, regardless of their `check_every` interval
- Automatically triggered job
    - All input resources that have passed their `check_every` interval are checked
- Re-run of previous build - no resource checks are made

In all cases, if a resource has a `passed` constraint on it, it won't be
checked because checking won't find new versions that could be used by the
current job.

## What do resource checks produce?

The whole point of running checks is to produce versions. Concourse's [Build
Scheduler](scheduler.md) is centered around the idea of resource versions. It's
how Concourse determines that something is new and a new build needs to be
triggered.

The versions produced by each resource are unique to the underlying [resource
type](../resource-types/index.md). For instance, the `git` resource type uses
commit SHAs as versions. The `registry-image` resource uses the image digest
and tag in the version. A version is simply a set of key-value strings. The
resource gets to decide what keys it uses.