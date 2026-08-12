---
title: Health Endpoint
---

## `GET /api/v1/health`

The health endpoint is an HTTP endpoint exposed by the [`web` node](../install/running-web.md) that reports whether
the Concourse deployment is in a healthy state. Operators and monitoring tools can poll it to get a fast, structured
answer about the state of the system — without needing to log in or use `fly`.

The endpoint requires no authentication and returns a JSON body along with an HTTP status code that reflects the
current health state.

## Health states

The endpoint reports one of three states:

**Ok** — everything is working as expected. The number of connected workers meets the configured minimum, and
all internal components are keeping up with their scheduled work.

**Degraded** — the system is running but something needs attention. Either the number of connected workers has
dropped below [`--health-min-worker-count`](#--health-min-worker-count), or one or more internal components (such as
the build scheduler, resource checker, or build tracker) have fallen behind and are considered stale. Builds can
still run. This is a warning state — the system is operational, but the operator should investigate.

**Failing** — the system is in a critical state. Either the database is unreachable or read-only, or there are no
connected workers. Builds cannot run.

## Response format

The response body is a JSON object with the following top-level fields:

| Field | Description |
|---|---|
| `status` | One of `"ok"`, `"degraded"`, or `"failing"`. |
| `timestamp` | RFC 3339 timestamp of when the response was generated. |
| `database` | Database connectivity status. See below for details. |
| `workers` | Connected worker counts. See below for details. |
| `components` | Array of internal background components and their health. See below for details. |

**`database` fields:**

| Field | Description |
|---|---|
| `status` | `"healthy"` or `"unhealthy"`. |
| `error` | Human-readable error message. Only present when `status` is `"unhealthy"`. |

**`workers` fields:**

| Field | Description |
|---|---|
| `status` | One of `"healthy"`, `"degraded"`, or `"unhealthy"`. |
| `total` | Total number of registered workers. |
| `running` | Number of workers currently in the `running` state. |
| `unhealthy_workers` | Array of the names of workers not in the `running` state. Not present if all workers are healthy. |

**`components` fields (one object per component):**

| Field | Description |
|---|---|
| `name` | Component identifier (e.g. `"scheduler"`, `"tracker"`, `"collector_volumes"`) |
| `status` | `"healthy"` if the component is keeping up with its scheduled work, `"unhealthy"` if stale. |
| `paused` | `true` if the component has been administratively paused. |
| `last_ran` | RFC 3339 timestamp of the last completed run. |

### Ok

```
HTTP 200 OK
```

```json
{
  "status": "ok",
  "timestamp": "2026-06-08T10:05:00Z",
  "database": { "status": "healthy" },
  "workers": { "status": "healthy", "total": 3, "running": 3 },
  "components": [
    { "name": "scheduler",         "status": "healthy", "paused": false, "last_ran": "2026-06-08T10:05:00Z" },
    { "name": "tracker",           "status": "healthy", "paused": false, "last_ran": "2026-06-08T10:05:00Z" },
    { "name": "collector_volumes", "status": "healthy", "paused": false, "last_ran": "2026-06-08T10:05:00Z" }
  ]
}
```

### Degraded

```
HTTP 200 OK
```

```json
{
  "status": "degraded",
  "timestamp": "2026-06-08T10:05:00Z",
  "database": { "status": "healthy" },
  "workers": { "status": "healthy", "total": 3, "running": 3 },
  "components": [
    { "name": "scheduler",         "status": "unhealthy", "paused": false, "last_ran": "2026-06-08T10:00:00Z" },
    { "name": "tracker",           "status": "healthy",   "paused": false, "last_ran": "2026-06-08T10:05:00Z" },
    { "name": "collector_volumes", "status": "unhealthy", "paused": false, "last_ran": "2026-06-07T08:00:00Z" }
  ]
}
```

In this example the `scheduler` component is stale, which drives the top-level
`degraded` status. `collector_volumes` is also stale, but because it is not a
runtime-critical component, it does not contribute to the top-level status on
its own.

### Failing

```
HTTP 503 Service Unavailable
```

```json
{
  "status": "failing",
  "timestamp": "2026-06-08T10:05:00Z",
  "database": { "status": "unhealthy", "error": "database unreachable" },
  "workers": { "status": "unhealthy", "total": 0, "running": 0 },
  "components": [
    { "name": "scheduler",         "status": "unhealthy", "paused": false, "last_ran": "2026-06-08T10:00:00Z" },
    { "name": "tracker",           "status": "unhealthy", "paused": false, "last_ran": "2026-06-08T10:00:00Z" },
    { "name": "collector_volumes", "status": "unhealthy", "paused": false, "last_ran": "2026-06-07T08:00:00Z" }
  ]
}
```

## What makes a component stale?

Every component runs on a fixed interval. If a component hasn't completed a run for longer than its interval
multiplied by `--health-component-stale-multiplier`, it is marked stale (`"status": "unhealthy"`) in the
`components` array.

For example: if the build scheduler runs every 10 seconds and the stale multiplier is `2.0`, the scheduler is
considered stale after 20 seconds without a completed run.

A stale component usually means the `web` node is under heavy load or is stuck. Check the `web` node logs for errors
if a component stays stale.

### Which components affect the top-level status?

Not all stale components drive the top-level `status` field. Only three are
considered critical for scheduling and running builds:

| Component | Description |
|---|---|
| `scheduler` | Determines when new job builds should run. See [Build Scheduler](../internals/scheduler.md). |
| `tracker` | Picks up and executes started builds. See [Build Tracker](../internals/build-tracker.md). |
| `scanner` | Schedules resource checks. See [Resource Checker](../internals/checker.md). |

If any of these three fall behind, the top-level `status` becomes `degraded` (or `failing` if workers are also gone).

All other components — the garbage collection collectors, `pipeline_pauser`, `being_watched_build_marker`,
`signing_key_lifecycler`, and others — appear in the `components` array with their own `status` field,
but a stale value for any of them does not change the top-level `status`. They are worth monitoring, but a stale GC
collector does not by itself indicate that builds are at risk of not running.

## Web Configuration flags

The following flags can be set on the `concourse web` command to change the behaviour of the health endpoint.

### `--health-min-worker-count`

Controls how many connected workers are required for the endpoint to report `ok`. When the number of connected
workers in the `running` state drops below this value, the endpoint reports `degraded`.

Setting this to `0` disables the worker count check entirely — the endpoint will never report `degraded` due to
worker count, and will only transition to `failing` when there are no running workers at all.

| | |
|---|---|
| **Flag** | `--health-min-worker-count` |
| **Env var** | `CONCOURSE_HEALTH_MIN_WORKER_COUNT` |
| **Type** | integer |
| **Default** | `1` |

```properties
CONCOURSE_HEALTH_MIN_WORKER_COUNT=2
```

### `--health-component-stale-multiplier`

Controls how tolerant the endpoint is of slow or delayed background components. A component is considered stale when
it hasn't run for longer than its interval multiplied by this value.

Increasing the multiplier gives components more time before they are marked stale, which reduces false positives in
environments where the `web` node is occasionally slow. Decreasing it makes the endpoint more sensitive — useful if
you want earlier warnings when a component falls behind.

| | |
|---|---|
| **Flag** | `--health-component-stale-multiplier` |
| **Env var** | `CONCOURSE_HEALTH_COMPONENT_STALE_MULTIPLIER` |
| **Type** | float |
| **Default** | `2.0` |

```properties
CONCOURSE_HEALTH_COMPONENT_STALE_MULTIPLIER=3.0
```

## Related `fly` commands

### `fly workers`

To see the number of connected workers and their current state, run:

```shell
fly -t example workers
```

This can help explain why the health endpoint is reporting `degraded` or `failing`. A worker in the `stalled` or
`landing` state does not count toward the `workers.running` total. Only workers in the `running` state are counted.

```
name       platform  tags  team  state    version
worker-1   linux     none  none  running  2.3
worker-2   linux     none  none  stalled  2.3
```

In this example, `workers.running` would be `1`. If `--health-min-worker-count` is `2`, the health endpoint would
report `degraded`.

See [Administration](administration.md#fly-workers) for more on managing workers.

### `fly health`

To check the health of a Concourse deployment, run:

```shell
fly -t example health
```

This prints a summary table with one row per subsystem and component:

```
subsystem          status     detail
overall            ok         2026-06-08T10:05:00Z
database           healthy
workers            healthy    3/3 running
scheduler          healthy    last ran: 2026-06-08T10:04:50Z
tracker            healthy    last ran: 2026-06-08T10:04:55Z
scanner            healthy    last ran: 2026-06-08T10:04:45Z
collector_volumes  unhealthy  last ran: 2026-06-07T08:00:00Z
pipeline_pauser    healthy  paused, last ran: 2026-06-07T06:00:00Z
```

The `overall` row shows the top-level status and the timestamp from the response. The `workers` row shows how many
workers are running out of how many are registered; if any are not running, their names appear in the detail column.
Each component row shows when it last ran and `paused` if the component has been administratively paused.

Status values are color-coded: green for `ok` / `healthy`, yellow for `degraded`, red for `failing` / `unhealthy`.

!!! note

    The exit code is always `0`, even when the cluster is failing. `fly health` is informational, consistent with
    `fly status`.

To get the raw JSON response instead — useful for scripting or piping to `jq`:

```shell
fly -t example health --json
```

`fly h` is a supported alias of `fly health`.

## Usage as a monitoring probe

The health endpoint is well suited for use as an external monitoring probe or a Kubernetes health check.

**Kubernetes liveness and readiness probes:**

```yaml
livenessProbe:
  httpGet:
    path: /api/v1/health
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 15

readinessProbe:
  httpGet:
    path: /api/v1/health
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 15
```

Note that both `ok` and `degraded` return HTTP `200`, so both probes will pass in either state. Only `failing`
returns HTTP `503`, which will cause the probe to fail. If you want readiness to fail while the system is degraded,
you will need a wrapper script or a custom probe that inspects the `status` field in the response body.

**Alerting pipelines:**

If you have an external monitor (such as Prometheus Blackbox Exporter, Nagios, or a Concourse pipeline itself),
pointing it at `/api/v1/health` and alerting on anything other than `HTTP 200` gives you a fast signal for failing
states. The `components` field in the response body provides the detail needed to start investigating alerts easily.
For example, if the `scheduler` is stale, you can check the `web` node logs for errors.