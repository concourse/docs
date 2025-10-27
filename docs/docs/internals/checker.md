---
title: Resource Checker
---

[Resources](../resources/index.md) represent external state such as a git repository, files in an S3 bucket, or anything
else that changes over time. By modelling these as resources, it allows you to use this external state as inputs (or
triggers) to your workloads.

## When are resources checked?

The component that schedules resource checks is called the **resource checker**. The rate at which these checks happen
is called the check interval (configurable via `CONCOURSE_LIDAR_SCANNER_INTERVAL`). There's an obvious tradeoff, whereby
the more frequently you poll, the bigger the strain on Concourse (as well as the external source). However, if you want
to pick up those new commits as quickly as possible, then you need to poll as often as possible.

The resource checker uses the [`resource.check_every`](../resources/index.md#resource-schema) interval in order to
figure out if a resource needs to be checked. A resource's `check_every` interval dictates how often it should be
checked for new versions, with a default of 1 minute. If that seems like a lot of checking, it is, but it's how
Concourse keeps everything snappy. You can configure this interval independently for each resource using `check_every`.

If your external service supports it, you can set [`resource.webhook_token`](../resources/index.md#resource-schema) to
eliminate the need for periodic checking altogether. If a `webhook_token` is configured, the external service can notify
Concourse when to check for new versions. Note that configuring a `webhook_token` will not stop Concourse from
periodically checking your resource. If you wish to rely solely on webhooks for detecting new versions, you can
set `check_every` to `never`.

On every interval tick, the resource checker will see if there are any resources that need to be checked. It does this
by first finding resources which are used as inputs to jobs, and then comparing the current time against the last time
each resource was checked. If it has been longer than a resource's configured `check_every` interval, a new check will
be scheduled. In practice this means that if a resource has a `check_every` of `1m`, it is not guaranteed to be checked
precisely every 60 seconds. `check_every` simply sets a lower bound on the time between checks.

When the resource checker finds a resource to check (either because its `check_every` interval elapsed, or because its
configured `webhook_token` was triggered), it schedules a new build that invokes
the [`check` script](../resource-types/implementing.md#check-check-for-new-versions) of the resource's
underlying [resource type](../resource-types/index.md).

## What do resource checks produce?

The whole point of running checks is to produce versions. Concourse's [Build Scheduler](scheduler.md) is centered around
the idea of resource versions. It's how Concourse determines that something is new and a new build needs to be
triggered.

The versions produced by each resource are unique to the underlying [resource type](../resource-types/index.md). For
instance, the `git` resource type uses commit SHAs as versions. The `registry-image` resource uses the image digest and
tag in the version.