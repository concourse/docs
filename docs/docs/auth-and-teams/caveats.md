---
title: Security Caveats
---

At present, teams only provide trusted _multi-tenancy_. This means it should be used for cases where you know and trust
who you're allowing access into your Concourse cluster.

There are a few reasons it'd be a bad idea to do otherwise:

* Any team can run builds with [`task` step **`privileged`**](../steps/task.md#task-step) tasks. A bad actor in the mix
  could easily use this to harm your workers and your cluster. You
  can [lock down privileged mode](../operation/security-hardening.md#locking-down-privileged-mode) if you
  use the containerd runtime and avoid this issue all together.
* There are no networking restrictions in place, and traffic to and from the worker's Garden and Baggageclaim endpoints
  is currently unencrypted and unauthorized. Anyone could run a task that does horrible things to your worker's
  containers, possibly stealing sensitive information.
  <br/>
  <br/>
  This can be remedied with configuration specified on Garden to restrict access to the internal network, but this is
  not detailed in our docs, and we'll probably want to find a better answer than configuration in the future.
  <br/>
  <br/>
  You could put firewall rules in place between workers to mitigate this issue as well.