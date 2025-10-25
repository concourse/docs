---
title: Running a worker node
---

# Running a `worker` node

The `worker` node registers with the [`web` node](running-web.md) and is then used for executing builds and performing
resource `check`s. It doesn't really decide much on its own.

## Prerequisites

* Linux:
    * We test and support the following distributions. Minimum kernel version tested is 5.15.
        * Ubuntu 22.04
        * Ubuntu 24.04
    * Other Requirements:
        * User namespaces must be enabled.
        * To enforce memory limits on tasks, memory + swap accounting must be enabled.
* Windows/Darwin:
    * no special requirements (that we know of).

!!! note

    Windows containers are currently not supported and Darwin does not have native containers. Steps will run inside 
    a temporary directory on the Windows/Darwin worker. Any dependencies needed for your tasks (e.g. git, .NET, golang, 
    ssh) should be pre-installed on the worker. Windows/Darwin workers do not come with any resource types.

## Running `concourse worker`

The `concourse` CLI can run as a `worker` node via the `worker` subcommand.

First, you'll need to configure a directory for the worker to store data:

```properties
CONCOURSE_WORK_DIR=/opt/concourse/worker
```

This is where all the builds run, and where all resources are fetched in to, so make sure it's backed by enough storage.

Next, point the worker at your [`web` node](running-web.md) like so:

```properties
CONCOURSE_TSA_HOST=10.0.2.15:2222
CONCOURSE_TSA_PUBLIC_KEY=path/to/tsa_host_key.pub
CONCOURSE_TSA_WORKER_PRIVATE_KEY=path/to/worker_key
```

Finally start the worker:

```shell
# run with -E to forward env config, or just set it all as root
sudo -E concourse worker
```

Note that the worker must be run as `root` because it orchestrates containers.

All logs will be emitted to `stdout`, with any panics or lower-level errors being emitted to `stderr`.

### Resource utilization

**CPU usage**: almost entirely subject to pipeline workloads. More resources configured will result in more checking,
and in-flight builds will use as much CPU as they want.

**Memory usage**: also subject to pipeline workloads. Expect usage to increase with the number of containers on the
worker and spike as builds run.

**Bandwidth usage**: again, almost entirely subject to pipeline workloads. Expect spikes from periodic checking, though
the intervals should spread out over enough time. Resource fetching and pushing will also use arbitrary bandwidth.

**Disk usage**: arbitrary data will be written as builds run, and resource caches will be kept and garbage collected on
their own life cycle. We suggest going for a larger disk size if it's not too much trouble. All state on disk must not
outlive the worker itself; it is all ephemeral. If the worker is re-created (i.e. fresh VM/container and all processes
were killed), it should be brought back with an empty disk.

**Highly available**: not applicable. Workers are inherently singletons, as they're being used as drivers running
entirely different workloads.

**Horizontally scalable**: yes; workers directly correlate to your capacity required by however many pipelines,
resources, and in-flight builds you want to run. It makes sense to scale them up and down with demand.

**Outbound traffic**:

* External traffic to arbitrary locations as a result of periodic resource checking and running builds
* External traffic to the `web` node's configured external URL when downloading the inputs for a [
  `fly execute`](https://concourse-ci.org/tasks.html#running-tasks)
* External traffic to the `web` node's TSA port (`2222`) for registering the worker
* If P2P streaming is enabled there will be traffic to other workers.

**Inbound traffic**:

* From the [`web` node](running-web.md) on port `7777` (Garden) and `7788` (BaggageClaim). These ports do not need to be
  exposed, they are forwarded to the web node via the ssh connection on port `2222`.
* If P2P streaming is enabled there will be traffic to other workers.

## Operating a `worker` node

The `worker` nodes are designed to be stateless and as interchangeable as
possible. [Tasks](https://concourse-ci.org/tasks.html) and [Resources](https://concourse-ci.org/resources.html) bring
their own Docker images, so you should never have to install dependencies on the worker. Windows and Darwin workers are
the exception to this. Any dependencies should be pre-installed on Windows and Darwin workers.

In Concourse, all important data is represented by [Resources](https://concourse-ci.org/resources.html), so the workers
themselves are dispensable. Any data in the work-dir is ephemeral and should go away when the worker machine is
removed - it should not be persisted between worker VM or container re-creates.

### Scaling Workers

More workers should be added to accommodate more pipelines. To know when this is necessary you should probably set
up [Metrics](https://concourse-ci.org/metrics.html) and keep an eye on container counts. If average container count
starts to approach 200 or so per worker, you should probably add another worker. Load average is another metric to keep
an eye on.

To add a worker, just create another machine for the worker and follow the [Running
`concourse worker`](running-worker.md#running-a-worker-node) instructions again.

!!! note

    It doesn't make sense to run multiple workers on one machine since they'll both be contending for the same 
    physical resources. Workers should be given their own VMs or physical machines to maximize resource usage.

#### Horizontal vs Vertical Scaling

The answer to whether you should scale your workers horizontally or vertically depends heavily on what workloads your
pipelines are running. Anecdotally though, we have seen that a lot of smaller workers (horizontal scaling) is usually
better than a few large workers (vertical scaling).

Again, this is not an absolute answer! You will have to test this out against the workloads your pipelines demand and
adjust based on the [Metrics](https://concourse-ci.org/metrics.html) that you are tracking.

### Worker Heartbeating & Stalling

Workers will continuously heartbeat to the Concourse cluster in order to remain registered and healthy. If a worker
hasn't checked in after a while, possibly due to a network error, being overloaded, or having crashed, the web node will
transition its state to `stalled` and new workloads will not be scheduled on that worker until it recovers.

If the worker remains in this state and cannot be recovered, it can be removed using the [
`fly prune-worker`](https://concourse-ci.org/administration.html#fly-prune-worker) command.

### Restarting a Worker

Workers can be restarted in-place by sending `SIGTERM` to the worker process and starting it back up. Containers will
remain running and Concourse will reattach to builds that were in flight.

This is a pretty aggressive way to restart a worker, and may result in errored builds - there are a few moving parts
involved and we're still working on making this airtight.

A safer way to restart a worker is to land it by sending `SIGUSR1` to the `worker` process. This will switch the worker
to the `landing` state and Concourse will stop scheduling new work on it. When all builds running on the worker have
finished, the process will exit.

You may want to enforce a timeout for draining - that way a stuck build won't prevent your workers from being upgraded.
This can be enforced by common tools like `start-stop-daemon`:

```shell
start-stop-daemon \
  --pidfile worker.pid \
  --stop \
  --retry USR1/300/TERM/15/KILL
```

This will send `SIGUSR1`, wait up to 5 minutes, and then send `SIGTERM`. If it's _still_ running, it will be killed
after an additional 15 seconds.

Once the timeout is enforced, there's still a chance that builds that were running will continue when the worker comes
back.

### Gracefully Removing a Worker

When a worker machine is going away, it should be _retired_. This is similar to _landing_, except at the end the worker
is completely unregistered, along with its volumes and containers. This should be done when a worker's VM or container
is being destroyed.

To retire a worker, send `SIGUSR2` to the `worker` process. This will switch the worker to `retiring` state, and
Concourse will stop scheduling new work on it. When all builds running on the worker have finished, the worker will be
removed and the `worker` process will exit.

Just like with landing, you may want to enforce a timeout for draining - that way a stuck build won't prevent your
workers from being upgraded. This can be enforced by common tools like `start-stop-daemon`:

```shell
start-stop-daemon \
  --pidfile worker.pid \
  --stop \
  --retry USR2/300/TERM/15/KILL
```

This will send `SIGUSR2`, wait up to 5 minutes, and then send `SIGTERM`. If it's _still_ running, it will be killed
after an additional 15 seconds.

## Configuring the `worker` node

### Tagging Workers

If there's something special about your worker and you'd like to target builds at it specifically, you can configure
tags like so:

```shell
CONCOURSE_TAG="tag-1,tag-2"
```

A tagged worker is taken out of the default placement logic. Tagged workers will not be used for any
untagged [Steps](https://concourse-ci.org/steps.html).

To run build steps on a tagged worker, specify the [`tags`](https://concourse-ci.org/tags-step.html#schema.tags) on any
particular step in your [job](https://concourse-ci.org/jobs.html).

To perform resource `check`s on a tagged worker, specify [
`tags`](https://concourse-ci.org/resources.html#schema.resource.tags) on the resource declaration.

### Team Workers

If you want to isolate [**all workloads
**](https://concourse-ci.org/global-resources.html#complications-with-reusing-containers) for
a [team](https://concourse-ci.org/managing-teams.html) then you can configure a worker to belong to a single team like
so:

```properties
CONCOURSE_TEAM="lightweavers"
```

Once an untagged team worker is registered Concourse will schedule all untagged builds for that team on its team worker(
s). Builds for this team will no longer be scheduled on any untagged, non-team workers.

It is possible to have a Concourse cluster made up of only team workers and have zero non-team workers, though this is
not a common setup because resource utilization across all workers ends up underutilized. It is useful though if you
have a particular team with heavy workloads that usually bothers other teams pipelines.

#### Tags and Team Workers

When you have a worker configured with tag(s) and a team like so:

```properties
CONCOURSE_TAG="tag-1,tag-2"
CONCOURSE_TEAM="lightweavers"
```

Only steps that are tagged and from the specified team will be scheduled on such a worker. Any untagged work the team
has will land on either:

1. Untagged team workers belonging to the team, or
2. Untagged workers not configured to a specific team

### Healthcheck Endpoint

The worker will automatically listen on port `8888` as its healthcheck endpoint. It will return a `HTTP 200` status code
with an empty body on a successful check. A successful check means the worker can reach
the [Garden and BaggageClaim servers](https://concourse-ci.org/internals.html#architecture-worker).

The healthcheck endpoint is configurable through three variables:

```shell
concourse worker --healthcheck-bind-ip=
# IP address on which to listen for health checking requests. (default: 0.0.0.0)

concourse worker --healthcheck-bind-port
# Port on which to listen for health checking requests. (default: 8888)

concourse worker --healthcheck-timeout
# HTTP timeout for the full duration of health checking. (default: 5s)
```

### Resource Types

!!! note

    The following section only applies to Linux workers. Resource types are simply Linux container images and therefore 
    can't be run on Windows or Darwin workers.

#### Bundled Resource Types

Workers come prepackaged with a bundle of resource types. They are included in the tarball from
the [GitHub release page](https://github.com/concourse/concourse/releases) and are part of
the [concourse/concourse image](https://hub.docker.com/r/concourse/concourse).

To view the resource types available on a worker run:

```shell
fly workers --details
```

If you want more details, like the version number of each resource, you can run:

```shell
fly curl api/v1/workers
```

#### Installing or Upgrading Bundled Resource Types

You may want to upgrade the bundled resource types outside of Concourse upgrades or even install additional resource
types on your workers to reduce the polling on some external image repository
like [Docker Hub](https://hub.docker.com/).

We will use the [git resource](https://github.com/concourse/git-resource) as our example. We will assume your Concourse
installation is at `/usr/local/concourse`.

First, pull and create a container of the resource you're installing/upgrading. Grab the ID of the container that Docker
creates.

```shell
$ docker run -d concourse/git-resource
b253417142565cd5eb43902e94a2cf355d5354b583fbc686488c9a153584c6ba
```

Export the containers file system into a gzip compressed tar archive named `rootfs.tgz`

```shell
docker export b253417142 | gzip > rootfs.tgz
```

Create a file called `resource_metadata.json` and populate it with the following contents. Make sure the `type` does not
conflict with an existing resource type when you're installing a new resource type. In our example here we're calling
the type `gitv2` to avoid conflicting with the pre-existing `git` resource.

```json
{
  "type": "gitv2",
  "version": "1.13.0",
  "privileged": false,
  "unique_version_history": false
}
```

At this point you should have two files: `rootfs.tgz` and `resource_metadata.json`.

Create a new directory under the `resource-types` folder in your Concourse installation directory. By convention, it
should be the same name as the `type`.

```shell
mkdir /usr/local/concourse/resource-types/gitv2
```

Place the `rootfs.tgz` and `resource_metadata.json` inside the
folder. [Restart your worker](running-worker.md#restarting-a-worker) and verify the new resource type is on there by
running one of the following commands:

```shell
fly workers --details
# or
fly curl api/v1/workers
```

You can also verify that Concourse can create a container with the `rootfs.tgz` you made by running a simple pipeline:

```yaml
resources:
  - name: some-resource
    type: gitv2 #change to your resource type
    source:
      uri: https://github.com/concourse/git-resource.git

jobs:
  - name: simple-job
    plan:
      - get: some-resource
```

### Configuring Runtimes

The worker can be run with multiple container
runtimes - [containerd](https://github.com/containerd/containerd/), [Guardian](https://github.com/cloudfoundry/guardian),
and [Houdini](https://github.com/vito/houdini) (an experimental and the only runtime for Darwin and Windows). Only
`containerd` and `Guardian` are meant for production use. `Guardian` is the default runtime for Concourse.

!!! note "Note about Architecture"

    The web node (ATC) talks to all 3 runtimes via a single interface called the 
    [Garden](https://github.com/cloudfoundry/garden) server. While Guardian comes packaged with a Garden server and 
    its flags in Concourse are unfortunately prefixed with `--garden-*`, Guardian (a runtime) and Garden 
    (an interface and server) are two separate tools. An analogy for Garden would be the [Container Runtime 
    Interface (CRI)](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes/) used in 
    Kubernetes. Kubernetes uses containerd via CRI. Concourse uses containerd via Garden.

#### `containerd` runtime

To use the `containerd` runtime manually set the `--runtime` (`CONCOURSE_RUNTIME`) to `containerd` on the
`concourse worker` command.

The following is a list of the `containerd` runtime specific flags for Concourse that can be set. They are all optional
and have default values.

```
Containerd Configuration:
  --containerd-config=                               Path to a config file to use for the Containerd daemon. [$CONCOURSE_CONTAINERD_CONFIG]
  --containerd-bin=                                  Path to a containerd executable (non-absolute names get resolved from $PATH). [$CONCOURSE_CONTAINERD_BIN]
  --containerd-init-bin=                             Path to an init executable (non-absolute names get resolved from $PATH). (default: /usr/local/concourse/bin/init) [$CONCOURSE_CONTAINERD_INIT_BIN]
  --containerd-cni-plugins-dir=                      Path to CNI network plugins. (default: /usr/local/concourse/bin) [$CONCOURSE_CONTAINERD_CNI_PLUGINS_DIR]
  --containerd-request-timeout=                      How long to wait for requests to Containerd to complete. 0 means no timeout. (default: 5m) [$CONCOURSE_CONTAINERD_REQUEST_TIMEOUT]
  --containerd-max-containers=                       Max container capacity. 0 means no limit. (default: 250) [$CONCOURSE_CONTAINERD_MAX_CONTAINERS]
  --containerd-privileged-mode=                      How many privileges privileged containers get. full is equivalent to root on host. ignore means no extra privileges. fuse-only means enough to use fuse-overlayfs. (default: full) [$CONCOURSE_CONTAINERD_PRIVILEGED_MODE]

Containerd Container Networking:
  --containerd-external-ip=                          IP address to use to reach container's mapped ports. Autodetected if not specified. [$CONCOURSE_CONTAINERD_EXTERNAL_IP]
  --containerd-dns-server=                           DNS server IP address to use instead of automatically determined servers. Can be specified multiple times. [$CONCOURSE_CONTAINERD_DNS_SERVER]
  --containerd-restricted-network=                   Network ranges to which traffic from containers will be restricted. Can be specified multiple times. [$CONCOURSE_CONTAINERD_RESTRICTED_NETWORK]
  --containerd-additional-hosts=                     Additional entries to add to /etc/hosts in containers. [$CONCOURSE_CONTAINERD_ADDITIONAL_HOSTS]
  --containerd-network-pool=                         Network range to use for dynamically allocated container subnets. (default: 10.80.0.0/16) [$CONCOURSE_CONTAINERD_NETWORK_POOL]
  --containerd-mtu=                                  MTU size for container network interfaces. Defaults to the MTU of the interface used for outbound access by the host. [$CONCOURSE_CONTAINERD_MTU]
  --containerd-allow-host-access                     Allow containers to reach the host's network. This is turned off by default. [$CONCOURSE_CONTAINERD_ALLOW_HOST_ACCESS]

DNS Proxy Configuration:
  --containerd-dns-proxy-enable                      Enable proxy DNS server. Note: this will enable containers to access the host network. [$CONCOURSE_CONTAINERD_DNS_PROXY_ENABLE]
```

!!! warning

    Make sure to read [A note on allowing host access](running-worker.md#a-note-on-allowing-host-access-and-dns-proxy) 
    and DNS proxy to understand the implications of using `--containerd-allow-host-access` and 
    `--containerd-dns-proxy-enable`

#### Transitioning from Guardian to containerd

If you are transitioning from `Guardian` to `containerd` you will need to convert any `--garden-*` (
`CONCOURSE_GARDEN_*`) flags to their `containerd` (`CONCOURSE_CONTAINERD_*`) counterparts:

| Guardian Flags                                                                     | Containerd Flags                                                                |
|------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| `--garden-request-timeout`<br/>`CONCOURSE_GARDEN_REQUEST_TIMEOUT`                  | `--containerd-request-timeout`<br/>`CONCOURSE_CONTAINERD_REQUEST_TIMEOUT`       |
| `--garden-dns-proxy-enable`<br/>`CONCOURSE_GARDEN_DNS_PROXY_ENABLE `               | -`-containerd-dns-proxy-enable`<br/>`CONCOURSE_CONTAINERD_DNS_PROXY_ENABLE`     |
| _No equivalent CLI flag_<br/>`CONCOURSE_GARDEN_ALLOW_HOST_ACCESS`                  | `--containerd-allow-host-access`<br/>`CONCOURSE_CONTAINERD_ALLOW_HOST_ACCESS`   |
| `--garden-network-pool`<br/>`CONCOURSE_GARDEN_NETWORK_POOL`                        | `--containerd-network-pool`<br/>`CONCOURSE_CONTAINERD_NETWORK_POOL`             |
| `--garden-max-containers`<br/>`CONCOURSE_GARDEN_MAX_CONTAINERS `                   | `--containerd-max-containers`<br/>`CONCOURSE_CONTAINERD_MAX_CONTAINERS`         |
| _No equivalent CLI flag_<br/>`CONCOURSE_GARDEN_DENY_NETWORKS`                      | `--containerd-restricted-network`<br/>`CONCOURSE_CONTAINERD_RESTRICTED_NETWORK` |
| _No equivalent CLI flag or ENV option.<br/>Configured through_ `garden_config.ini` | `--containerd-additional-hosts`<br/>`CONCOURSE_CONTAINERD_ADDITIONAL_HOSTS`     |
| _No equivalent CLI flag_<br/>`CONCOURSE_GARDEN_DNS_SERVER`                         | `--containerd-dns-server`<br/>`CONCOURSE_CONTAINERD_DNS_SERVER`                 |
| _No equivalent CLI flag_<br/>`CONCOURSE_GARDEN_EXTERNAL_IP`                        | `--containerd-external-ip`<br/>`CONCOURSE_CONTAINERD_EXTERNAL_IP`               |
| _No equivalent CLI flag_<br/>`CONCOURSE_GARDEN_MTU`                                | `--containerd-mtu`<br/>`CONCOURSE_CONTAINERD_MTU`                               |

#### `Guardian` runtime

Guardian is currently the default runtime for Concourse. It can also be set by setting the `--runtime` flag to
`guardian` on the `concourse worker` command.

The `concourse worker` command automatically configures and runs `Guardian` using the `gdn` binary, but depending on the
environment you're running Concourse in, you may need to pop open the hood and configure a few things.

The `gdn` server can be configured in two ways:

1. By creating a `config.ini` file and passing it as `--garden-config` (or `CONCOURSE_GARDEN_CONFIG`). The .ini file
   should look something like this:
    ```ini
    [server]
    flag-name=flag-value 
    ```
   To learn which flags can be set, consult `gdn server --help`. Each flag listed can be set under the `[server]`
   heading.

2. By setting `CONCOURSE_GARDEN_*` environment variables. This is primarily supported for backwards compatibility, and
   these variables are not present in `concourse worker --help`. They are translated to flags passed to `gdn server` by
   lower-casing the `*` portion and replacing underscores with hyphens.

#### Troubleshooting and fixing DNS resolution

!!! note

    The Guardian runtime took care of a lot of container creation operations for Concourse in the past. It was very 
    user-friendly for the project to use as a container runtime. While implementing the containerd runtime most 
    reported bugs were actually a difference in containerd's default behaviour compared to Guardian's. Currently 
    Concourse's containerd runtime mostly behaves like the Guardian runtime did. Most of the following DNS section 
    should apply to both runtimes.

By default, containers created by the Guardian or containerd (will refer to both as _runtime_) runtime will carry over
the `/etc/resolv.conf` from the host into the container. This is often fine, but some Linux distributions configure a
special `127.x.x.x` DNS resolver (e.g. `systemd-resolved`).

When the runtime copies the `resolv.conf` over, it removes these entries as they won't be reachable from the container's
network namespace. As a result, your containers may not have any valid nameservers configured.

To diagnose this problem you can [`fly intercept`](https://concourse-ci.org/builds.html#fly-intercept) into a failing
container and check which nameservers are in `/etc/resolv.conf`:

```shell
$ fly -t ci intercept -j concourse/concourse
bash-5.0$ grep nameserver /etc/resolv.conf
bash-5.0$
```

In this case it is empty, as the host only listed a single `127.0.0.53` address which was then stripped out. To fix this
you'll need to explicitly configure DNS instead of relying on the default runtime behavior.

##### Pointing to external DNS servers

If you have no need for special DNS resolution within your Concourse containers, you can configure your containers to
use specific DNS server addresses external to the VM.

The Guardian and containerd runtimes can have their DNS servers configured with flags or envs vars.

=== "DNS via flags (containerd)"

    ```shell
    concourse worker --containerd-dns-server="1.1.1.1" --containerd-dns-server="8.8.8.8"
    ```

=== "DNS via env vars"

    ```properties
    # containerd runtime
    CONCOURSE_CONTAINERD_DNS_SERVER="1.1.1.1,8.8.8.8"
    # Guardian runtime
    CONCOURSE_GARDEN_DNS_SERVER="1.1.1.1,8.8.8.8"
    ```

=== "`config.ini` (Guardian)"

    ```ini
    [server]
    ; configure Google DNS
    dns-server = 8.8.8.8
    dns-server = 8.8.4.4
    ```

To verify this solves your problem you can [`fly intercept`](https://concourse-ci.org/builds.html#fly-intercept) into a
container and check which nameservers are in `/etc/resolv.conf`:

```shell
$ fly -t ci intercept -j my-pipeline/the-job
bash-5.0$ cat /etc/resolv.conf
nameserver 1.1.1.1
nameserver 8.8.8.8
bash-5.0$ ping google.com
PING google.com (108.177.111.139): 56 data bytes
64 bytes from 108.177.111.139: seq=0 ttl=47 time=2.672 ms
64 bytes from 108.177.111.139: seq=1 ttl=47 time=0.911 ms
```

##### Using a local DNS server

If you would like to use Consul, `dnsmasq`, or some other DNS server running on the worker VM, you'll have to configure
the LAN address of the VM as the DNS server and allow the containers to reach the address, like so:

=== "Local DNS via flags (containerd)"

    ```shell
    concourse worker --containerd-dns-server="10.0.1.3" --containerd-allow-host-access="true"
    ```

=== "Local DNS via env vars"

    ```properties
    # containerd runtime
    CONCOURSE_CONTAINERD_DNS_SERVER="10.0.1.3"
    CONCOURSE_CONTAINERD_ALLOW_HOST_ACCESS="true"
    # Guardian runtime
    CONCOURSE_GARDEN_DNS_SERVER="10.0.1.3"
    CONCOURSE_GARDEN_ALLOW_HOST_ACCESS="true"
    ```

=== "`config.ini` (Guardian)"

    ```ini
    [server]
    ; internal IP of the worker machine
    dns-server=10.0.1.3
    
    ; allow containers to reach the above IP
    allow-host-access=true
    ```

!!! warning

    Make sure to read [A note on allowing host access](running-worker.md#a-note-on-allowing-host-access-and-dns-proxy) 
    and DNS proxy to understand the implications of using `allow-host-access`

To validate whether the changes have taken effect, you can [
`fly intercept`](https://concourse-ci.org/builds.html#fly-intercept) into any container and check `/etc/resolv.conf`
once again:

```shell
$ fly -t ci intercept -j my-pipeline/the-job
bash-5.0$ cat /etc/resolv.conf
nameserver 10.1.2.3
bash-5.0$ nslookup concourse-ci.org
Server:         10.1.2.3
Address:        10.1.2.3#53

Non-authoritative answer:
Name:   concourse-ci.org
Address: 185.199.108.153
Name:   concourse-ci.org
Address: 185.199.109.153
Name:   concourse-ci.org
Address: 185.199.110.153
Name:   concourse-ci.org
Address: 185.199.111.153
```

If `nslookup` times out or fails, you may need to open up firewalls or security group configuration so that the worker
VM can send UDP/TCP packets to itself.

##### A note on allowing host access and DNS proxy

Setting `allow-host-access` will, well, allow containers to access your host VM's network. If you don't trust your
container workloads, you may not want to allow this. With host network access, containers will be able to reach out to
any other locally running network processes running on the worker including the garden and baggageclaim servers **which
would allow them to issue commands and manipulate other containers and volumes on the same worker**.

Setting `dns-proxy-enable` will also enable `allow-host-access` (since the dns proxy will be run on the host, therefore
requiring host access be enabled).

### Configuring Peer-to-Peer Volume Streaming

Peer-to-Peer (P2P) volume streaming enables the workers to stream volumes directly to each other instead of always
streaming volumes through the web node(s). This can reduce the time it takes for individual steps in a job to start and
reduce the amount of network traffic used by the Concourse cluster.

!!! warning "Experimental Feature"

    This feature is experimental. It is not as robust as the default volume streaming setup which always goes 
    through web nodes.

**Pre-Requisites**

* All worker nodes need to be able to reach each other via IP address. This usually means they are on the same LAN. You
  can test this by trying to ping one worker from another worker. If even one worker does not meet this requirement then
  you cannot use P2P volume streaming.
* The baggageclaim port (`7788` is the default) is open to traffic on all worker nodes. You can verify the port is open
  and reaching the baggageclaim API server by hitting the `/volumes` endpoint.
  <br/>
  ```shell
  curl http://<worker-IP-address>:7788/volumes
  ```

To enable P2P volume streaming you need to configure some settings on the web and worker nodes. Configure the worker
nodes first. Configure the web node(s) last.

#### P2P Worker Configuration

* `CONCOURSE_BAGGAGECLAIM_BIND_IP=0.0.0.0` - _Required_. The worker needs to listen for traffic over `127.0.0.1` (to
  receive info from the web node) as well as its LAN IP in a P2P setup. Therefore, we need to set the IP baggageclaim
  binds to `0.0.0.0`.
* `CONCOURSE_BAGGAGECLAIM_P2P_INTERFACE_NAME_PATTERN=eth0` - _Optional_. Regular expression to match a network interface
  for P2P streaming. This is how a worker determines its own LAN IP address, by looking it up via the LAN interface
  specified by this flag.
  <br/>
  <br/>
  You can determine the name of the LAN interface for any worker by listing all network interfaces and noting which
  interface has the LAN IP that you want the worker to use.
  <br/>
  <br/>
  To view all available network interfaces on your worker:
    * On Linux run `ip addr list`
    * On MacOS run `ifconfig`
    * On Windows run `ipconfig`. Windows network interface names are very different from Unix device names. Example
      network interface names for Windows include:
      <br/>
      ```
      Ethernet 4
      Local Area Connection* 2
      Local Area Connection* 12
      Wi-Fi 5
      Bluetooth Network Connection 2
      Loopback Pseudo-Interface 1
      ```
* `CONCOURSE_BAGGAGECLAIM_P2P_INTERFACE_FAMILY=4` - _Optional_. Tells the worker to use IPv4 or IPv6. Defaults to `4`
  for IPv4. Set to `6` for IPv6.

#### P2P Web Configuration

You need to tell the web node(s) to use P2P volume streaming.

```shell
CONCOURSE_ENABLE_P2P_VOLUME_STREAMING=true
```

Once that flag is set and the web node is restarted, P2P volume streaming will start occurring in your Concourse
cluster.