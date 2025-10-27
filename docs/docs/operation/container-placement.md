---
title: Container Placement
---

Each [step](../steps/index.md) in a build is executed inside a container. The [`web` node](../install/running-web.md)
distributes containers across the worker cluster depending on the configured strategy. If no workers satisfy the
configured strategy, the [step](../steps/index.md) will block until a worker becomes available.

## The `volume-locality` strategy

When using `volume-locality`, the [`web` node](../install/running-web.md) places [`task` step](../steps/task.md)
and [`put` step](../steps/put.md) containers on workers where a majority of their inputs are already present. **This is
the default strategy**.

The advantage of this approach is that it reduces the likelihood that large artifacts will have to be streamed from
one [`worker` node](../install/running-worker.md), through the [`web` node](../install/running-web.md), and to the
target `worker` node. For large artifacts, this can result in quite a bit of overhead.

The disadvantage of this approach is that it can sometimes result in builds "gravitating" to a particular worker and
overloading it, at least until the resource caches warm across the worker pool. This disadvantage can be partially
mitigated using the (currently experimental) [`limit-active-volumes` strategy](#the-limit-active-volumes-strategy) in
conjunction with [Chaining Placement Strategies](#chaining-placement-strategies).

If your builds tend to be light on artifacts and heavy on task execution, you may want to try
the [`fewest-build-containers` strategy](#the-fewest-build-containers-strategy) or the (currently
experimental) [`limit-active-tasks` strategy](#the-limit-active-tasks-strategy).

## The `fewest-build-containers` strategy

When using the `fewest-build-containers` strategy, step containers (`get`, `put`, `task`) are placed on the worker that
has the fewest build containers (i.e. containers for other steps of other builds).

!!! info

    Containers used for resource checks are not counted because they are long-living containers that get re-used for 
    multiple checks, and therefore consume very little resources on the worker.

To use this strategy, set the following env var on the [`web` node](../install/running-web.md):

```properties
CONCOURSE_CONTAINER_PLACEMENT_STRATEGY=fewest-build-containers
```

## The `random` strategy

With the `random` strategy, the [`web` node](../install/running-web.md) places `get`, `put`, and `task` containers on
any worker, ignoring any affinity.

As this is truly random, this will be fine until one day it's not fine.

To use this strategy, set the following env var on the [`web` node](../install/running-web.md):

```properties
CONCOURSE_CONTAINER_PLACEMENT_STRATEGY=random
```

## The `limit-active-tasks` strategy

!!! warning "Experimental Feature"

    `limit-active-tasks` is an experimental feature.

When selecting the `limit-active-tasks` placement strategy, each `task` executed on a worker will increase the number
of "active tasks" on that worker by one. When the task completes the number is decreased by one.
The [`web` node](../install/running-web.md) then places `get`, `put`, and `task` containers on the worker that currently
has the _least amount of active tasks_.

Additionally, `max-active-tasks-per-worker` can be set to an integer of 1 or more, in which case a worker will not
execute more than that amount of **tasks**. A value of 0 means that there is no limit on the maximum number of active
tasks on the workers. If no worker can be selected because all of them already have `max-active-tasks-per-worker` active
tasks, then the task will wait for a free worker, periodically polling the pool. The
metric `concourse_steps_waiting{type="task"}` is emitted to monitor these events. Note that the parameter does not apply
to `get` and `put` steps which will always be scheduled on the worker with the fewest active tasks.

```properties
CONCOURSE_CONTAINER_PLACEMENT_STRATEGY=limit-active-tasks
```

and, optionally

```properties
CONCOURSE_MAX_ACTIVE_TASKS_PER_WORKER=1
```

## The `limit-active-containers` strategy

!!! warning "Experimental Feature"

    `limit-active-containers` is an experimental feature.

The `limit-active-containers` placement strategy rejects workers that already have too many containers. It makes no
effort to find the worker with the fewest number of containers present, and is therefore most useful when combined with
other placement strategies by [Chaining Placement Strategies](#chaining-placement-strategies).

`max-active-containers-per-worker` can be set to an integer of 1 or more, in which case a worker will not execute more
than that amount of **containers**. If unset (or set to a value of 0), the `limit-active-containers` strategy has no
effect - if this is your only placement strategy, workers will be chosen at random.

```properties
CONCOURSE_CONTAINER_PLACEMENT_STRATEGY=limit-active-containers
CONCOURSE_MAX_ACTIVE_CONTAINERS_PER_WORKER=200
```

## The `limit-active-volumes` strategy

!!! warning "Experimental Feature"

    `limit-active-volumes` is an experimental feature.

The `limit-active-volumes` placement strategy rejects workers that already have too many volumes. It makes no effort to
find the worker with the fewest number of volumes present, and is therefore most useful when combined with other
placement strategies by [Chaining Placement Strategies](#chaining-placement-strategies).

`max-active-volumes-per-worker` can be set to be an integer of 1 or more, in which case a worker will not execute more
than that amount of **volumes**. If unset (or set to a value of 0), the `limit-active-volumes` strategy has no effect -
if this is your only placement strategy, workers will be chosen at random.

```properties
CONCOURSE_CONTAINER_PLACEMENT_STRATEGY=limit-active-volumes
CONCOURSE_MAX_ACTIVE_VOLUMES_PER_WORKER=200
```

## Chaining Placement Strategies

Container placement strategies can be chained together to apply multiple strategies in sequence. The first strategy in
the chain receives the entire set of workers, filtering the set down in some way, and passing that new set of workers to
the next strategy in the chain. If the last strategy in the chain returns multiple workers, one will be chosen at
random.

For instance, consider the following configuration:

```properties
CONCOURSE_CONTAINER_PLACEMENT_STRATEGY=limit-active-containers,limit-active-volumes,volume-locality,fewest-build-containers
CONCOURSE_MAX_ACTIVE_CONTAINERS_PER_WORKER=200
CONCOURSE_MAX_ACTIVE_VOLUMES_PER_WORKER=100
```

This defines a chain of 4 placement strategies, plus the implicit `random` strategy. Let's look at what each strategy
accomplishes:

1. [`limit-active-containers` strategy](#the-limit-active-containers-strategy) removes all workers that already have
   more than 200 containers
2. [`limit-active-volumes` strategy](#the-limit-active-volumes-strategy) removes all remaining workers that already have
   more than 100 volumes
3. [`volume-locality` strategy](#the-volume-locality-strategy) keeps only the remaining worker(s) that have the most
   inputs locally. This can keep more than one worker in the case of a tie
4. [`fewest-build-containers` strategy](#the-fewest-build-containers-strategy) will attempt to break ties by selecting
   the worker with fewer build containers. If all the remaining workers have the exact same number of containers, one
   will be selected at random