---
title: Administration
---

## Managing Workers

### `fly workers`

To list the currently registered workers, including additional metadata, run:

```shell
fly -t example workers
```

This can be useful for monitoring the status of your workers, if you suspect that one keeps dropping out of the pool or
getting tasked with too many containers, etc.

### `fly prune-worker`

To remove a stalled, landing, landed, or retiring worker, run:

```shell
fly -t example prune-worker --worker worker-name
```

To prune _all_ stalled workers, run:

```shell
fly -t example prune-worker --all-stalled
```

This is for those cases where you know a worker is not coming back.

!!! note

    Running workers cannot be pruned, since they'll just re-register themselves anyway.

### `fly land-worker`

To initiate landing of a worker and eventually (after draining) cause it to exit, run:

```shell
fly -t example land-worker --worker worker-name
```

## Broadcast Message System

Concourse Admins who operate a big Concourse with many teams often want a way
to communicate to everyone that the system is unstable/recovering. Setting
a message on the Wall will result in a banner displaying the wall message in
the Concourse web UI. The following commands are used to manage the Wall.

!!! tip "Fun Fact!"

    "Wall" is a reference to the [Unix `wall`](https://en.wikipedia.org/wiki/Wall_(Unix)) CLI.

### `fly set-wall`

_Requires being a member of the main team_. To set a new wall with a message and expiration, run:

```shell
fly -t main set-wall --message="⚠️ Hello World, there is an error ⚠️" --ttl=5m
```

This will set a wall of "⚠️ Hello World, there is an error ⚠️" with an expiration of five minutes.

### `fly get-wall`

To get the current wall, run:

```shell
fly -t main get-wall
```

### `fly clear-wall`

_Requires being a member of the main team_. To clear a current wall, run:

```shell
fly -t main clear-wall
```

## Diagnostic / Troubleshooting

### `fly containers`

To list the active containers across all your workers, run:

```shell
fly -t example containers
```

This can be useful when discovering the containers available for [`fly intercept`](../builds.md#fly-intercept)ing.

### `fly volumes`

To list the active volumes across all your workers, run:

```shell
fly -t example volumes
```

This can be useful to observe the caches warming across your cluster, and could be a good indicator of disk use.

### `fly curl`

To execute an arbitrary API request, you can run something like the following:

```shell
fly -t example curl /api/v1/info
```

This command is just a shim that runs `curl` under the hood. To pass flags to `curl`, pass a `--` argument after the
path so that `fly` can distinguish them from its own flags:

```shell
fly -t example curl /api/v1/builds -- \
    -X PUT \
    -H "Content-type: application/json" \
    -d @plan.json
```

!!! note

    If you use this command the assumption is that you know what you're doing. If you find yourself using this command 
    often, let us know - perhaps there's a missing command!
