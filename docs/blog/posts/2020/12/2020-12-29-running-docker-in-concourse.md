---
layout: post
title: Running Docker in Concourse
date: 2020-12-29
categories:
  - tutorials
---

So you want to run Docker in Concourse? Well this is the guide for you!

<!-- more -->

Let's clarify what it is we want to do. **We want to be able to run `docker-compose` inside a task in Concourse to bring
up our application alongside some other services (i.e. Redis, Postgres, MySQL, etc.).**

Thankfully this challenge has been solved by the community! There are a few "Docker-in-Docker" images designed to run in
Concourse that are maintained by the community. Here's a short list made from a cursory search, in no particular order:

- [github.com/meAmidos/dcind](https://github.com/meAmidos/dcind)
- [github.com/karlkfi/concourse-dcind](https://github.com/karlkfi/concourse-dcind)
- [github.com/fhivemind/concourse-dind](https://github.com/fhivemind/concourse-dind)
- [github.com/taylorsilva/dcind](https://github.com/taylorsilva/dcind)

You can also opt to build your own fork of the above images.

All of the above repositories have their own example pipelines that you can use to get started. What follows are some
bits of information that are useful to know when using these task images.

## Privileged Tasks

Running Docker inside Concourse requires the [task step](../../../../docs/steps/task.md)
to be [privileged](../../../../docs/steps/task.md) because Docker needs access to
the hosts cgroup filesystem in order to create containers.

You can verify this by looking at the bash scripts for each of the above images which all take inspiration from
the [docker-image resource](https://github.com/concourse/docker-image-resource). Read the [
`sanitize_cgroups` function](https://github.com/concourse/docker-image-resource/blob/babf5a7dc293102e34bd2bf93815ee3d35aac54e/assets/common.sh#L5-L48)
to see what exactly is being mounted from the host. (tldr: mount all cgroups as read-write)

## Externalize All Images

You should avoid having Docker fetch any images from inside your task step where you are running `docker-compose`. You
should externalize these as [image resources](https://github.com/concourse/registry-image-resource) if they're a
dependency of your application (e.g. Postgres, MySQL).

For the container image that contains your application you should have that built in a
previous [step](../../../../docs/steps/index.md)
or [job](../../../../docs/jobs.md). You
can [build and publish an image](../06/2020-06-19-how-to-build-and-publish-a-container-image.md) using
the [oci-build task](https://github.com/concourse/oci-build-task).

To ensure Docker doesn't try to fetch the images itself you can use [
`docker load`](https://docs.docker.com/engine/reference/commandline/load/) and [
`docker tag`](https://docs.docker.com/engine/reference/commandline/tag/) to load your externalized images into
Docker. [meAmidos's](https://github.com/meAmidos) has a
great [example pipeline](https://github.com/meAmidos/dcind/blob/master/example/pipe.yml) that does exactly that.

meAmidos also makes two great points about why you should externalize your image:

- If the image comes from a private repository, it is much easier to let Concourse pull it, and then pass it through to
  the task.
- When the image is passed to the task, Concourse can often get the image from its cache.

That's all you need to know to run Docker inside Concourse!

