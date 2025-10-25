---
title: Running a web Node
---

# Running a `web` node

The `web` node is responsible for running the web UI, API, and as well as performing all pipeline scheduling. It's
basically the brain of Concourse.

## Prerequisites

Nothing special - the `web` node is a pretty simple Go application that can be run like
a [12-factor app](https://en.wikipedia.org/wiki/Twelve-Factor_App_methodology).

## Running `concourse web`

The `concourse` CLI can run as a `web` node via the `web` subcommand.

Before running it, let's configure a local user so we can log in:

```properties
CONCOURSE_ADD_LOCAL_USER=myuser:mypass
CONCOURSE_MAIN_TEAM_LOCAL_USER=myuser
```

This will configure a single user, `myuser`, with the password `mypass`. You'll probably want to change those to
sensible values, and later you may want to configure a proper auth provider - check
out [Auth & Teams](https://concourse-ci.org/auth.html) whenever you're ready.

Next, you'll need to configure the session signing key, the SSH key for the worker gateway, and the authorized worker
key. Check [Generating Keys](generating-keys.md) to learn what these are and how they are created.

```properties
CONCOURSE_SESSION_SIGNING_KEY=path/to/session_signing_key
CONCOURSE_TSA_HOST_KEY=path/to/tsa_host_key
CONCOURSE_TSA_AUTHORIZED_KEYS=path/to/authorized_worker_keys.pub
```

Finally, `web` needs to know how to reach your Postgres database. This can be set like so:

```properties
CONCOURSE_POSTGRES_HOST=127.0.0.1 # default
CONCOURSE_POSTGRES_PORT=5432      # default
CONCOURSE_POSTGRES_DATABASE=atc   # default
CONCOURSE_POSTGRES_USER=my-user
CONCOURSE_POSTGRES_PASSWORD=my-password
```

If you're running PostgreSQL locally, you can probably just point it to the socket and rely on the `peer` auth:

```properties
CONCOURSE_POSTGRES_SOCKET=/var/run/postgresql
```

Now that everything's set, run:

```shell
concourse web
```

All logs will be emitted to `stdout`, with any panics or lower-level errors being emitted to `stderr`.

### Resource utilization

CPU usage: peaks during pipeline scheduling, primarily when scheduling [Jobs](https://concourse-ci.org/jobs.html).
Mitigated by adding more `web` nodes. In this regard, `web` nodes can be considered compute-heavy more than anything
else at large scale.

Memory usage: not very well classified at the moment as it's not generally a concern. Give it a few gigabytes and keep
an eye on it.

Disk usage: none

Bandwidth usage: aside from handling external traffic, the `web` node will at times have to stream bits out from one
worker and into another while executing [Steps](https://concourse-ci.org/steps.html).

Highly available: `yes`; web nodes can all be configured the same (aside from `--peer-address`) and placed behind a load
balancer. Periodic tasks like garbage-collection will not be duplicated for each node.

Horizontally scalable: yes; they will coordinate workloads using the database, resulting in less work for each node and
thus lower CPU usage.

Outbound traffic:

* `db` on its configured port for persistence
* `db` on its configured port for locking and coordinating in a multi-`web` node deployment
* other `web` nodes (possibly itself) on an [ephemeral port](https://en.wikipedia.org/wiki/Ephemeral_port) when a worker
  is forwarded through the web node's TSA

Inbound traffic:

* `worker` connects to the TSA on port `2222` for registration
* `worker` downloads inputs from the ATC during [`fly execute`](https://concourse-ci.org/tasks.html#running-tasks) via
  its external URL
* external traffic to the ATC API via the web UI and [`fly` CLI](https://concourse-ci.org/fly.html)

## Operating a `web` node

The `web` nodes themselves are stateless - they don't store anything on disk, and coordinate entirely using the
database.

### Scaling

The [`web` node](running-web.md) can be scaled up for high availability. They'll also
roughly share their scheduling workloads, using the database to synchronize. This is done by just running more `web`
commands on different machines, and optionally putting them behind a load balancer.

To run a cluster of [`web` nodes](running-web.md), you'll first need to ensure they're all pointing to the same
PostgreSQL server.

Next, you'll need to configure a peer address. This is a DNS or IP address that can be used to reach this `web` node
from other `web` nodes. Typically this uses a private IP, like so:

```properties
CONCOURSE_PEER_ADDRESS=10.10.0.1
```

This address will be used for forwarded worker connections, which listen on
the [ephemeral port](https://en.wikipedia.org/wiki/Ephemeral_port) range.

Finally, if all of these nodes are going to be accessed through a load balancer, you'll need to configure the external
URL that will be used to reach your Concourse cluster:

```properties
CONCOURSE_EXTERNAL_URL=https://ci.example.com
```

Aside from the peer URL, all configuration must be consistent across all `web` nodes in the cluster to ensure consistent
results.

#### Database connection pooling

You may wish to configure the max number of parallel database connections that each node makes. There are two pools to
configure: one for serving API requests, and one used for all the backend work such as pipeline scheduling.

```properties
CONCOURSE_API_MAX_CONNS=10     # default
CONCOURSE_BACKEND_MAX_CONNS=50 # default
```

There are some non-configurable connection pools. They take up the following number of connections per pool:

* Garbage Collection: 5
* Lock: 1
* Worker Registration: 1

The sum of these numbers across all `web` nodes should not be greater than the maximum number of simultaneous
connections your Postgres server will allow. See [
`db` node resource utilization](running-postgres.md#resource-utilization) for more
information.

For example, if 3 `web` nodes are configured with the values shown above then your PostgreSQL server should be
configured with a connection limit of at least 201: `(10 + 50 + 5 + 1 + 1) * 3 web nodes`.

### Reloading worker authorized key

While [Running `concourse web`](running-web.md#running-concourse-web), the authorized worker key
file, which contains all public keys for the workers, is loaded at startup. During the lifecycle of a [
`web` node](running-web.md) new `worker` keys might be added or old ones removed. To
perform a live reload of this file you can send a `SIGHUP` signal to the `concourse web` process. The process will
remain running and Concourse will reload the authorized worker key file.

### Restarting & Upgrading

The `web` nodes can be killed and restarted willy-nilly. No draining is necessary; if the `web` node was orchestrating a
build it will continue where it left off when it comes back, or the build will be picked up by one of the other `web`
nodes.

To upgrade a `web` node, stop its process and start a new one using the newly installed `concourse`. Any database
migrations will be run automatically on start. If `web` nodes are started in parallel, only one will run the migrations.

We don't currently guarantee a lack of funny-business if you're running mixed Concourse versions - database migrations
can perform modifications that confuse other `web` nodes. So there may be some turbulence during a rolling upgrade, but
everything should stabilize once all `web` nodes are running the latest version.

If you want more control over when the database migrations happen and know if they were successful you can use the
`concourse migrate` command. The `migrate` command accepts the same `CONCOURSE_POSTGRES_*` env vars as the
`concourse web` command.

### Downgrading

If you're stuck in a pinch and need to downgrade from one version of Concourse to another, you can use the
`concourse migrate` command.

First, grab the desired migration version by running the following:

```shell
# make sure this is the *old* Concourse binary
$ concourse migrate --supported-db-version
1551110547
```

That number (yours will be different) is the expected migration version for that version of Concourse.

Next, run the following with the new Concourse binary:

```shell
concourse migrate --migrate-db-to-version=1551110547
```

This will need the same `CONCOURSE_POSTGRES_*` configuration described in [Running
`concourse web`](running-web.md#running-concourse-web).

Once this completes, switch all `web` nodes back to the older `concourse` binary and you should be good to go.

## Configuring the `web` node

### Giving your cluster a name

If you've got many Concourse clusters that you switch between, you can make it slightly easier to notice which one
you're on by giving each cluster a name:

```properties
CONCOURSE_CLUSTER_NAME=production
```

When set, this name will be shown in the top bar when viewing the dashboard.

### Configuring ingress traffic

If your web nodes are going to be accessed multiple network layers, you will need to set `CONCOURSE_EXTERNAL_URL` to a
URL accessible by your Concourse users. If you don't set this property, logging in will incorrectly redirect to its
default value of `127.0.0.1`.

If your web node(s) will be behind a load balancer or reverse proxy then you will need to ensure connections made by [
`fly intercept`](https://concourse-ci.org/builds.html#fly-intercept) are properly handled by upgrading the connection.
Here is a sample nginx configuration that upgrades connections made by
[`fly intercept`](https://concourse-ci.org/builds.html#fly-intercept).

```nginx linenums="1"
server {
  server_name ci.example.com;

  add_header Strict-Transport-Security "max-age=31536000" always;
  ssl_stapling on;
  ssl_stapling_verify on;

  # Proxy main concourse traffic
  location / {
      proxy_pass http://concourse.local:8080/;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-Protocol $scheme;
      proxy_set_header X-Forwarded-Host $http_host;
  }

  # Proxy fly intercept traffic
  location ~ /hijack$ {
      proxy_pass http://concourse.local:8080;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-Protocol $scheme;
      proxy_set_header X-Forwarded-Host $http_host;
      # Upgrade connection
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
  }
}
```

### TLS via Let's Encrypt

Concourse can be configured to automatically acquire a TLS certificate via [Let's Encrypt](https://letsencrypt.org/):

```properties
# Enable TLS
CONCOURSE_TLS_BIND_PORT=443

# Enable Let's Encrypt
CONCOURSE_ENABLE_LETS_ENCRYPT=true
```

!!! warning

    Concourse's Let's Encrypt integration works by storing the TLS certificate and key in the database, so it is 
    imperative that you enable [database encryption](https://concourse-ci.org/encryption.html) as well.

By default, Concourse will reach out
to [Let's Encrypt's ACME CA directory](https://acme-v02.api.letsencrypt.org/directory). An alternative URL can be
configured like so:

```properties
CONCOURSE_LETS_ENCRYPT_ACME_URL=https://acme.example.com/directory
```

In order to negotiate the certificate, your `web` node must be reachable by the ACME server. There are
intentionally [no publicly listed IP addresses to whitelist](https://letsencrypt.org/docs/faq/), so this typically means
just making your `web` node publicly reachable.

### Build log retention

Build logs are stored in the DB - if they are not cleanup up every once in a while, the storage usage for build logs
will continue to grow as more builds run. While this is usually fine for small Concourse instances, as you scale up, you
may run into storage concerns.

To clean up old build logs, you can configure Concourse to periodically scan for builds whose logs should be reaped
based on a log retention policy, skipping over any paused pipelines and jobs. When a build's logs are reaped, they are
no longer visible in the UI.

Concourse can be configured with a default build log retention policy for all jobs:

```properties
CONCOURSE_DEFAULT_BUILD_LOGS_TO_RETAIN=50
CONCOURSE_DEFAULT_DAYS_TO_RETAIN_BUILD_LOGS=14
```

With these settings, Concourse will keep the latest 50 builds for each job. If a job runs more than 50 builds in 14
days, all of those builds will be retained until 14 days after they ran.

Some jobs have differing retention requirements - you can configure [
`build_log_retention_policy` schema](https://concourse-ci.org/jobs.html#schema.build_log_retention_policy) on a
job-by-job basis.

You can also configure Concourse with maximum values for build log retention policies to prevent jobs from retaining
their build logs for too long:

```properties
CONCOURSE_MAX_BUILD_LOGS_TO_RETAIN=100
CONCOURSE_MAX_DAYS_TO_RETAIN_BUILD_LOGS=30
```

With these settings, [
`build_log_retention_policy.builds`](https://concourse-ci.org/jobs.html#schema.build_log_retention_policy.builds) is
capped at 100, and [
`build_log_retention_policy.days`](https://concourse-ci.org/jobs.html#schema.build_log_retention_policy.days) is capped
at 30.

### Enabling audit logs

A very simplistic form of audit logging can be enabled with the following vars:

```properties
# Enable auditing for all api requests connected to builds.
CONCOURSE_ENABLE_BUILD_AUDITING=true

# Enable auditing for all api requests connected to containers.
CONCOURSE_ENABLE_CONTAINER_AUDITING=true

# Enable auditing for all api requests connected to jobs.
CONCOURSE_ENABLE_JOB_AUDITING=true

# Enable auditing for all api requests connected to pipelines.
CONCOURSE_ENABLE_PIPELINE_AUDITING=true

# Enable auditing for all api requests connected to resources.
CONCOURSE_ENABLE_RESOURCE_AUDITING=true

# Enable auditing for all api requests connected to system transactions.
CONCOURSE_ENABLE_SYSTEM_AUDITING=true

# Enable auditing for all api requests connected to teams.
CONCOURSE_ENABLE_TEAM_AUDITING=true

# Enable auditing for all api requests connected to workers.
CONCOURSE_ENABLE_WORKER_AUDITING=true

# Enable auditing for all api requests connected to volumes.
CONCOURSE_ENABLE_VOLUME_AUDITING=true
```

When enabled, API requests will result in an info-level log line like so:

[//]: # (@formatter:off)
```json
{"timestamp":"2019-05-09T14:41:54.880381537Z","level":"info","source":"atc","message":"atc.audit","data":{"action":"Info","parameters":{},"user":"test"}}
{"timestamp":"2019-05-09T14:42:36.704864093Z","level":"info","source":"atc","message":"atc.audit","data":{"action":"GetPipeline","parameters":{":pipeline_name":["booklit"],":team_name":["main"]},"user":"test"}}
```
[//]: # (@formatter:on)

### Configuring defaults for resource types

Defaults for the "core" resource
types ([those that show up under the Concourse org](https://github.com/concourse?q=-resource)) that comes with Concourse
can be set cluster-wide by passing in a configuration file. The format of the file is the name of the resource type
followed by an arbitrary configuration.

Documentation for each resource type's configuration is in each implementation's `README`.

```properties
CONCOURSE_BASE_RESOURCE_TYPE_DEFAULTS=./defaults.yml
```

For example, a `defaults.yml` that configures the entire cluster to use a registry mirror would have:

```yaml
registry-image:
  registry_mirror:
    host: https://registry.mirror.example.com
```