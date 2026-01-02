---
title: Security Hardening
---

Concourse tasks run in containers, which provide a degree of isolation from the host. However, if inadequate attention
is paid to security, anyone with the ability to update pipelines or modify a script called in a task might be able to
escape from the container and take control of the host. From there, they could access other host resources, interfere
with pipelines they might not otherwise have access to, and collect credentials.

Following the guidance in this section can help you to greatly reduce the risk of a container escape.

## Keeping your kernel up-to-date

Containers run in different Linux namespaces on the same Linux kernel as the host system. Vulnerabilities in the kernel
version you run can allow for local privilege escalation - which in the Concourse context means allowing an escape from
a Concourse task to full root privileges on the host.

You can greatly reduce the risk of container escapes by staying up to date with your kernel version, tracking either the
latest release, or the latest kernel from a Linux distribution with a reputable security programme.

## Locking down privileged mode

By default, privileged mode (i.e. tasks with `privileged: true` on the task step) grants containers a very wide set of
Linux capabilities, without any restrictions on syscalls allowed. These privileges are enough to load a kernel module (
allowing arbitrary privilege escalation and container escape), as well as direct access to all host devices. As such, by
default, privileged tasks are equivalent to full root access on the host.

If you are running a worker using the containerd container runtime, Concourse provides some options to reduce the risk
of container escapes through privileged tasks.

The `--containerd-privileged-mode=ignore` (or by environment variable, `CONCOURSE_CONTAINERD_PRIVILEGED_MODE=ignore`)
option to the worker is the most restrictive, but most secure option. It makes Concourse treat privileged tasks the same
as normal tasks (i.e. grants no extra privileges, effectively disabling privileged tasks). While this is secure, it is
also restrictive if you want to do things like build or run containers inside tasks.

The `--containerd-privileged-mode=fuse-only` (or by environment variable,
`CONCOURSE_CONTAINERD_PRIVILEGED_MODE=fuse-only`) option to the worker makes it possible to secure privileged tasks
against container escape, while still allowing privileged tasks to build container images with buildah, and run them
with podman from inside the task.

!!! warning "Caution"

    For the fuse-only privileged mode option to be secure against escapes from privileged tasks, you must run your 
    worker in a container with user namespaces enabled. Privileged containers in fuse-only mode have `CAP_SYS_ADMIN` 
    capability, which is harmless when in a non-default user namespace, but equivalent to full root on the host 
    otherwise. When running the worker in a Docker or podman container, refer to the 
    [Docker](https://docs.docker.com/engine/security/userns-remap/#enable-userns-remap-on-the-daemon) or 
    [Podman](https://docs.podman.io/en/latest/markdown/podman-run.1.html#subuidname-name) docs to learn how to set up 
    user namespaces.