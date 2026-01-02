---
title: Install
---

A Concourse installation is composed of a [`web` node](running-web.md), a [`worker` node](running-worker.md), and
a [PostgreSQL node](running-postgres.md).

There are many ways to deploy Concourse, depending on your personal preference.
The [Quick Start](../getting-started/quick-start.md) guide shows how to get Concourse up and running quickly via Docker
Compose, and there is also an official [Concourse Helm chart](https://github.com/concourse/concourse-chart).

The documentation found here will primarily focus on the `concourse` CLI, which is the lowest common denominator, and
can also be directly used if you want to just run Concourse yourself on real hardware or your own managed VMs.

The high-level steps to follow for installing Concourse are:

1. Setup a Postgres database
2. Generate Secrets for the web and worker nodes
3. Install the web node
4. Install the worker node

!!! note

    We don't document every configuration option for the `web` and `worker` commands. To view all flags you can 
    run the following `docker` commands.
    
    ```shell
    docker run -t concourse/concourse web --help
    docker run -t concourse/concourse worker --help
    ```