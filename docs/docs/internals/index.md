---
title: Internals
---

This section provides a deeper understanding of some of the concepts surrounding Concourse.

An understanding of the basics of Concourse concepts, such as pipelines, jobs, etc, is recommended as parts of this
section might assume a level of knowledge from them. This section is not necessary for using Concourse but are more for
experienced users that want to dig deeper into how Concourse works.

## Basic architecture

Concourse is a fairly simple distributed system built up from the following components. You'll see them referenced here
and there throughout the documentation, so you may want to skim this page just to get an idea of what they are.

![](assets/index-01.png)

## ATC: web UI & build scheduler

The ATC is the heart of Concourse. It runs the web UI and API and is responsible for all pipeline scheduling. It
connects to PostgreSQL, which it uses to store pipeline data (including build logs).

Multiple ATCs can be running as one cluster; as long as they're all pointing to the same database, they'll synchronize
using basic locking mechanisms and roughly spread work across the cluster.

The ATC by default listens on port `8080`, and is usually co-located with the [TSA](#tsa-worker-registration-forwarding)
and sitting behind a load balancer.

!!! note

    For [`fly intercept`](../builds.md#fly-intercept) to function, make sure your load balancer is configured to do TCP 
    or SSL forwarding, not HTTP or HTTPS.

There are multiple components within the ATC that each have their own set of responsibilities. The main components
consist of the [checker](checker.md), [scheduler](scheduler.md), [build tracker](build-tracker.md), and
the [garbage collector](garbage-collector.md).

The [checker](checker.md)'s responsibility is to continuously checks for new versions of resources.
The [scheduler](scheduler.md) is responsible for scheduling builds for a job and the [build tracker](build-tracker.md)
is responsible for running any scheduled builds. The [garbage collector](garbage-collector.md) is the cleanup mechanism
for removing any unused or outdated objects, such as containers and volumes.

All the components in a Concourse deployment can be viewed in the _components_ table in the database as of v5.7.0. The
intervals that the components run at can also be adjusted through editing that table, as well as pausing the component
from running entirely.

## TSA: worker registration & forwarding

The TSA is a custom-built SSH server that is used solely for securely
registering [workers](../install/running-worker.md) with the [ATC](#atc-web-ui-build-scheduler).

The TSA by default listens on port `2222`, and is usually co-located with the [ATC](#atc-web-ui-build-scheduler) and
sitting behind a load balancer.

The TSA implements CLI over the SSH connection, supporting the following commands:

* The `forward-worker` command is used to reverse-tunnel a worker's addresses through the TSA and register the forwarded
  connections with the ATC. This allows workers running in arbitrary networks to register securely, so long as they can
  reach the TSA. This is much safer than opening the worker up to the outside world.
* The `land-worker` command is sent from the worker when landing, and initiates the state change to `LANDING` through
  the ATC.
* The `retire-worker` command is sent from the worker when retiring, and initiates the state change to `RETIRING`
  through the ATC.
* The `delete-worker` command is sent from the worker when draining is interrupted while a worker is retiring. It
  removes the worker from the ATC.
* The `sweep-containers` command is sent periodically to facilitate garbage collection of containers which can be
  removed from the worker. It returns a list of handles for containers in the `DESTROYING` state, and it is the worker's
  job to subsequently destroy them.
* The `report-containers` command is sent along with the list of all container handles on the worker. The ATC uses this
  to update the database, removing any `DESTROYING` containers which are no longer in the set of handles, and marking
  any `CREATED` containers that are not present as missing.
* The `sweep-volumes` command is sent periodically to facilitate garbage collection of volumes which can be removed from
  the worker. It returns a list of handles for volumes in the `DESTROYING` state, and it is the worker's job to
  subsequently destroy them.
* The `report-volumes` command is sent along with the list of all volume handles on the worker. The ATC uses this to
  update the database, removing any `DESTROYING` volumes which are no longer in the set of handles, and marking
  any `CREATED` volumes that are not present as missing.

## Workers Architecture

Workers are machines running [Garden](https://github.com/cloudfoundry-incubator/garden)
and [Baggageclaim](https://github.com/concourse/concourse/tree/master/worker/baggageclaim) servers and registering
themselves via the [TSA](#tsa-worker-registration-forwarding).

!!! note

    Windows and Darwin workers also run Garden and Baggageclaim servers but do not run containers. They both use 
    [houdini](https://github.com/vito/houdini) to fake making containers. Windows containers are not supported and 
    Darwin does not have native container technology.

Workers have no important state configured on their machines, as everything runs in a container and thus shouldn't care
about what packages are installed on the host (well, except for those that allow it to be a worker in the first place).
This is very different from workers in other non-containerized CI solutions, where the state of packages on the worker
is crucial to whether your pipeline works or not.

Each worker registers itself with the Concourse cluster via the [TSA](#tsa-worker-registration-forwarding).

Workers by default listen on port `7777` for Garden and port `7788` for Baggageclaim. Connections to both servers are
forwarded over the SSH connection made to the [TSA](#tsa-worker-registration-forwarding).

### The worker lifecycle

#### **RUNNING**

: A worker in this state is registered with the cluster and ready to start running containers and storing volumes.

#### **STALLED**

: A worker in this state was previously registered with the cluster, but stopped advertising itself for some reason.
Usually this is due to network connectivity issues, or the worker stopping unexpectedly.

: If the worker remains in this state and cannot be recovered, it can be removed using
the [`fly prune-worker`](../operation/administration.md#fly-prune-worker) command.

#### **LANDING**

: The `concourse land-worker` command will put a worker in the `LANDING` state to safely drain its assignments for
temporary downtime.

: The ATC will wait for builds on the worker for jobs which are uninterruptible to finish, and transition the worker
into `LANDED` state.

#### **LANDED**

: A worker in this state has successfully waited for all uninterruptible jobs on it after having `concourse land-worker`
called. It will no longer be used to schedule any new containers or create volumes until it registers as `RUNNING`
again.

#### **RETIRING**

: The `concourse retire-worker` command will put a worker in the `RETIRING` state to remove it from the cluster
permanently.

: The ATC will wait for builds on the worker for jobs which are uninterruptible to finish, and remove the worker.