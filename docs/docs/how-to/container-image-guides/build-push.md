---
title: Building and Pushing an Image
---

In this guide we are going to show how to build and publish container images using
the [oci-build task](https://github.com/concourse/oci-build-task)
and [registry-image resource](https://github.com/concourse/registry-image-resource). This guide assumes you understand
how to build container images with [Dockerfile's](https://docs.docker.com/engine/reference/builder/) and publish
to [Docker Hub](https://hub.docker.com/) or another image registry using the docker cli.

!!! note

    This is one way of building and pushing images. There are many other ways to accomplish this same task in Concourse.

First we need a Dockerfile. You can store this in your own repo or reference
the [github.com/concourse/examples](https://github.com/concourse/examples) repo. The rest of this post assumes you use
the examples repo. All files in this blog post can be found in the examples repo.

## The Dockerfile

The `Dockerfile`:

```dockerfile linenums="1" title="Dockerfile"
--8<-- "libs/examples/Dockerfiles/simple/Dockerfile"
```

The `stanger` text file:

```text linenums="1" title="stranger"
--8<-- "libs/examples/Dockerfiles/simple/stranger"
```

## Defining Pipeline Resources

Now we can start building out our pipeline. Let's declare our [Resources](../../resources/index.md) first. We will need
one resource to pull in the repo where our Dockerfile is located, and a second resource pointing to where we want to
push the built container image to.

There are some [Variables](../../../examples/pipeline-vars.md#variables) in this file that we will fill out when setting
the pipeline.

```yaml linenums="1" title="build-push.yml"
--8<-- "libs/examples/pipelines/build-and-push-simple-image.yml::20"
```

## Create the Job

Next we will create a [job](../../jobs.md) that will build and push our container image.

To build the job we will need to pull in the repo where the `Dockerfile` is.

[//]: # (@formatter:off)
```yaml linenums="1" title="build-push.yml"
resources: ... # omitting resource section from above

--8<-- "libs/examples/pipelines/build-and-push-simple-image.yml:22:25"
```
[//]: # (@formatter:on)

## Build the Image

The second step in our job will build the container image.

To build the container image we are going to use the [oci-build-task](https://github.com/concourse/oci-build-task). The
oci-build-task is a container image that is meant to be used in a Concourse [task](../../tasks.md) to build other
container images. Check out the [`README.md`](https://github.com/concourse/oci-build-task/blob/master/README.md) in the
repo for more details on how to configure and use the oci-build-task in more complex build scenarios.

[//]: # (@formatter:off)
```yaml linenums="1" title="build-push.yml"
resources: ... # omitting resource section from above

--8<-- "libs/examples/pipelines/build-and-push-simple-image.yml:22:35"
```
[//]: # (@formatter:on)

Next we will add [concourse-examples](https://github.com/concourse/examples) as an [
`input`](../../tasks.md#task-config-schema) to the build task to ensure the artifact from the [
`get` step](../../steps/get.md) (where our `Dockerfile` is fetched) is mounted in our `build-image` step.

[//]: # (@formatter:off)
```yaml linenums="1" title="build-push.yml"
resources: ... # omitting resource section from above

--8<-- "libs/examples/pipelines/build-and-push-simple-image.yml:22:37"
```
[//]: # (@formatter:on)

The oci-build-task [outputs the built container image](https://github.com/concourse/oci-build-task#outputs) in a
directory called `image`. Let's add image as an output of our task so we can publish it in a later step.

[//]: # (@formatter:off)
```yaml linenums="1" title="build-push.yml"
resources: ... # omitting resource section from above

--8<-- "libs/examples/pipelines/build-and-push-simple-image.yml:22:39"
```
[//]: # (@formatter:on)

## Defining the Build Context

Next we need to tell the `oci-build-task` what
the [build context](https://docs.docker.com/engine/reference/commandline/build/) of our `Dockerfile` is.
The [README](https://github.com/concourse/oci-build-task) goes over a few other methods of creating your build context.
We are going to use the simplest use-case. By specifying `CONTEXT` the `oci-build-task` assumes a `Dockerfile` and its
build context are in the same directory.

[//]: # (@formatter:off)
```yaml linenums="1" title="build-push.yml"
resources: ... # omitting resource section from above

--8<-- "libs/examples/pipelines/build-and-push-simple-image.yml:22:44"
```
[//]: # (@formatter:on)

## Publish the Container Image

To push the container image add a [`put` step](../../steps/put.md) to our job plan and tell the registry-image resource
where the tarball of the container image is.

The `put` step will push the container image using the information defined previously in the
resource's [source](../../resources/index.md#resource-schema).

[//]: # (@formatter:off)
```yaml linenums="1" title="build-push.yml"
resources: ... # omitting resource section from above

--8<-- "libs/examples/pipelines/build-and-push-simple-image.yml:22:47"
```
[//]: # (@formatter:on)

## The Entire Pipeline

Putting all the pieces together, here is our pipeline that builds and pushes a container image.

```yaml linenums="1" title="build-push.yml"
--8<-- "libs/examples/pipelines/build-and-push-simple-image.yml"
```

You can set the pipeline with the following fly command, updating the variable values with real values the pipeline can
use to run.

```shell
fly -t <target> set-pipeline -p build-and-push-image \
  -c ./examples/pipelines/build-and-push-simple-image.yml \
  --var image-repo-name=<repo-name> \
  --var registry-username=<user> \
  --var registry-password=<password>
```

## Further Readings

Understanding what the build context is important when building container images. You can
read [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#understand-build-context)
for more details about build contexts.

The [inputs section](https://github.com/concourse/oci-build-task#inputs) of the oci-build-task's `README` has examples
on how to create a build context with multiple inputs and other complex build scenarios.

Read the `README`'s in the [oci-build-task](https://github.com/concourse/oci-build-task)
and [registry-image resource](https://github.com/concourse/registry-image-resource/) to learn more about their other
configuration options.