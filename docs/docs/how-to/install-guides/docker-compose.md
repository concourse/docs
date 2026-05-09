---
title: Install Concourse with Docker Compose
---

This guide will show you how to install Concourse on any Linux system
using [Docker Compose](https://docs.docker.com/compose/).

This guide makes the following assumptions:

1. The host system has Docker installed already.
2. You have a PostgreSQL database running somewhere already. You created a database called `concourse` and created a
   user for Concourse to authenticate as.
3. You have generated the necessary [encryption Keys](../../install/generating-keys.md).
4. The host system the Web node will be running on is exposed to the internet and can therefore accept inbound traffic
   on port `443`.
5. The Web and Worker node are being installed on separate servers, and you will figure out networking between the two
   servers. The Web node needs to accept ingress traffic on the TSA port (default is port `2222`) from the Worker
   node(s).

## Setup Web Node

You can do the following from any directory on your system. This guide will assume all work is done in `~/concourse`.

Create a directory called `keys` (`~/concourse/keys`). Place the following encryption keys inside the new directory:

* `session_signing_key`
* `tsa_host_key`
* `worker_key.pub`

Next, create a `docker-compose.yml` file with the following content:

```yaml title="~/concourse/docker-compose.yml"
services:
  web:
    image: docker.io/concourse/concourse:latest
    command: web
    restart: "unless-stopped"
    ports:
      - "443:8080"
      - "2222:2222"
    volumes:
      - ~/concourse/keys:/concourse-keys:ro
    environment:
      CONCOURSE_EXTERNAL_URL: https://ci.example.com
      CONCOURSE_ENABLE_LETS_ENCRYPT: "true"
      CONCOURSE_SESSION_SIGNING_KEY: /concourse-keys/session_signing_key
      CONCOURSE_TSA_AUTHORIZED_KEYS: /concourse-keys/worker_key.pub
      CONCOURSE_TSA_HOST_KEY: /concourse-keys/tsa_host_key
      CONCOURSE_POSTGRES_HOST: <psql hostname>
      CONCOURSE_POSTGRES_USER: <psql user>
      CONCOURSE_POSTGRES_PASSWORD: <psql password>
      CONCOURSE_POSTGRES_DATABASE: concourse
      CONCOURSE_ADD_LOCAL_USER: test:test
      CONCOURSE_MAIN_TEAM_LOCAL_USER: test
      CONCOURSE_CLUSTER_NAME: Concourse
      CONCOURSE_ENABLE_ACROSS_STEP: "true"
      CONCOURSE_ENABLE_REDACT_SECRETS: "true"
      CONCOURSE_ENABLE_PIPELINE_INSTANCES: "true"
      CONCOURSE_ENABLE_CACHE_STREAMED_VOLUMES: "true"
    logging:
      driver: local
      options:
        max-size: "100m"
```

!!! note

    The above file configures the web node with 
    [local user authentication](../../auth-and-teams/configuring/local-user.md) with the username and password set to 
    `test`. You will probably want to configure your web node with one of the other 
    [authentication providers](../../auth-and-teams/configuring/index.md) and remove the `*_LOCAL_USER` environment 
    variables.

You can start the Web node by running:

```bash
docker compose up -d
```

You should then be able to access Concourse from the `CONCOURSE_EXTERNAL_URL` you specified.

If you're using local authentication you can log in using the [`fly` CLI](../../fly.md).

```bash
fly -t ci -c https://ci.example.com -u test -p test
```

## Setup Worker Node

You can do the following from any directory on your system. This guide will assume all work is done in `~/concourse`.

Create a directory called `keys` (`~/concourse/keys`). Place the following encryption keys inside the new directory:

* `tsa_host_key.pub`
* `worker_key`

Next, create a `docker-compose.yml` file with the following content:

```yaml title="~/concourse/docker-compose.yml"
services:
  worker:
    image: docker.io/concourse/concourse:latest
    command: worker
    privileged: true
    restart: "unless-stopped"
    stop_signal: SIGUSR2
    volumes:
      - ~/concourse/keys:/concourse-keys:ro
    environment:
      CONCOURSE_NAME: worker-01
      CONCOURSE_RUNTIME: containerd
      CONCOURSE_BAGGAGECLAIM_DRIVER: overlay
      CONCOURSE_TSA_PUBLIC_KEY: /concourse-keys/tsa_host_key.pub
      CONCOURSE_TSA_WORKER_PRIVATE_KEY: /concourse-keys/worker_key
      CONCOURSE_TSA_HOST: <web-hostname-or-ip>:2222
    logging:
      driver: local
      options:
        max-size: "100m"
```

!!! tip

    If your pipelines are having issues with DNS resolution please read 
    [this section](../../install/running-worker.md#troubleshooting-and-fixing-dns-resolution).

You can start the Worker node by running:

```bash
docker compose up -d
```

Using the [`fly` CLI](../../fly.md) you should be able to see the worker successfully connected to the Web node by
running `fly workers`.

Congratulations, you've successfully deployed a Concourse cluster!
