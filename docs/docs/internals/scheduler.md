---
title: Build Scheduler
---

!!! warning

    As of the v6.0.0 release, there have been many changes to the scheduler, so it would be advisable to assume that 
    this documentation should only be used for Concourse deployments v6.0.0 and above.

Builds represent each execution of a [job](../jobs.md). Figuring out when to schedule a new job build is the
responsibility of the **build scheduler**. The scheduling of new job builds can be dependent on many different factors
such as when a new version of a resource is discovered, when a dependent upstream build finishes, or when a user
manually triggers a build.

The build scheduler is a global component, where it deals with all the jobs within a deployment. It runs on an interval
with a default of 10 seconds. If there are multiple ATCs, only one of the ATC's scheduler component will run per
interval tick in order to ensure that there will be no duplicated work between ATC nodes.

The subcomponent used to figure out whether a build can be scheduled is called the [algorithm](#algorithm).

## Algorithm

The algorithm is a subcomponent of the scheduler which is used to determine the input versions to the next build of a
job. There are many factors that contribute to figuring out the next input versions. It can be anything that affects
which resource versions will be used to schedule a build, such as `version` constraints or `passed` constraints in
a [`get` step](../steps/get.md), disabling versions through the web UI, etc. The algorithm can also fail to determine a
successful set of input versions, which the error will be propagated to the preparation view in the build page.

If the algorithm computes a successful set of input versions, it will figure out whether the versions it computed can be
used to produce a new build. This is done by comparing the [trigger-able](../steps/get.md) input versions to the
versions used by the previous build and if any of them have a different version, then the scheduler will know to
schedule a new build. Conversely, if the input versions produced by the algorithm are the same as the previous build,
then the scheduler will not create a new build.

## Scheduling behavior

The scheduler will schedule a new build if any of the versions produced by the algorithm for `trigger: true` resources
has not been used in any previous build of the job.

What this means is if the algorithm runs and computes an input version, the scheduler will create a new build as long as
that version has not been used by any previous build's version for that same input. Even if that version has been used
by a build 2 months ago, the scheduler will **not** schedule a new build because that version has been previously used
in a build of the job.

If there are any input versions that are different from any previous build, it will trigger a new build.

## Scheduling on demand

The scheduler runs on an interval, but rather than scheduling all the jobs within a deployment on every tick, it only
schedules the jobs that need to be _scheduled_.

First, the scheduler determines which jobs need to be scheduled. Below are all the reasons why Concourse will think a
job needs to be scheduled:

* Detecting new versions of a resource through a check
* Saving a new version through a put
* A build finishes for an upstream job (through passed constraints)
* Enabling/Disabling a resource version that has not been used in a previous build
* Pinning/Unpinning a resource version that has not been used in a previous build
* Setting a pipeline
* Updating a resource's `resource_config`
* Manually triggering a build
* Rerunning a build
* Multiple versions available for a version every constraint

Each job that is scheduled will use the algorithm to determine what inputs its next build should have. Then the build is
scheduled and picked up by the [Build Tracker](build-tracker.md).