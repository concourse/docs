---
title: Running a PostgreSQL Node
---

Concourse uses [PostgreSQL](https://www.postgresql.org/) for storing all data and coordinating work in a multi-[
`web` node](running-web.md) installation.

## Prerequisites

[PostgreSQL](https://www.postgresql.org/) v11 or above is required, though the latest available version is recommended.

## Running PostgreSQL

How this node is managed is up to you; Concourse doesn't actually have much of an opinion on it, it just needs a
database. By default Concourse will try connecting to a database named `atc`.

How to install PostgreSQL is really dependent on your platform. Please refer to your Linux distribution or operating
system's documentation.

For the most part, the instruction on Linux should look something like this:

```shell
sudo apt install postgresql
sudo su postgres -c "createuser $(whoami)"
sudo su postgres -c "createdb --owner=$(whoami) atc"
```

This will install PostgreSQL (assuming your distro uses `apt`), create a user, and create a database that the current
UNIX user can access, assuming this same user is going to be running the[`web` node](running-web.md). This is a
reasonable default for distros like Ubuntu and Debian which default PostgreSQL to `peer` auth.

## Resource utilization

**CPU usage**: this is one of the most volatile metrics, and one we try pretty hard to keep down. There will be
near-constant database queries running, and while we try to keep them very simple, there is always more work to do.
Expect to feed your database with at least a couple cores, ideally four to eight. Monitor this closely as the size of
your deployment and the amount of traffic it's handling increases, and scale accordingly.

**Memory usage**: similar to CPU usage, but not quite as volatile.

**Disk usage**: pipeline configurations and various bookkeeping metadata for keeping track of jobs, builds, resources,
containers, and volumes. In addition, **all build logs are stored in the database**. This is the primary source of disk
usage. To mitigate this, log retention can be defined by pipeline authors by using [
`job.build_log_retention`](../jobs.md#job-schema). Concourse operators can
also configure a default [Build log retention](running-web.md#build-log-retention) policy that applies to all pipelines.

**Bandwidth usage**: well, it's a database, so it most definitely uses the network. Something important to consider here
is the number of simultaneous connections that the database server itself will allow. Postgres exposes a [
`max_connections`](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-MAX-CONNECTIONS)
configuration variable, and depending on how many web nodes you are running and the size of
their [connection pool](running-web.md#database-connection-pooling), you may need to tune these two numbers against each
other.

**Highly available**: Up to you. Clustered PostgreSQL is kind of new and probably tricky to deploy, but there are
various cloud solutions for this.

**Outbound traffic**: None

**Inbound traffic**: Only ever from the `web` node