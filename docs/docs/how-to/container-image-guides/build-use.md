---
title: Building an Image and Using it in a Task
---

This guide will show you how to build and use an image within one [job](../../jobs.md) without pushing the image to an
external image registry like Docker Hub.

## Build The Image

To avoid repeating ourselves we're going to use the pipeline made in the other
guide [Building and Pushing an Image](build-push.md). We will start with the pipeline from
the [Defining the Build Context](build-push.md#defining-the-build-context) section.

We will add the `UNPACK_ROOTFS` parameter to the task. This parameter tells
the [oci-build-task](https://github.com/concourse/oci-build-task) to include the image in a special format that
Concourse's container runtime uses.

!!! note

    In the future this may not be necessary if Concourse starts using the OCI image format.

```yaml linenums="1" title="build-and-use-image.yml"
--8<-- "libs/examples/pipelines/build-and-use-image.yml::33"
```

The above pipeline will build a container image and also output it in Concourse's rootfs image format.

## Use the Image

Next we want to add a second task to this job which will use the image generated from the first task as its container
image. To use the image from the previous step add the top-level `image` key to the [`task` step](../../steps/task.md).

[//]: # (@formatter:off)
```yaml linenums="1" title="build-push.yml"
resources: ... # omitting resource section from above

--8<-- "libs/examples/pipelines/build-and-use-image.yml:11:"
```
[//]: # (@formatter:on)

You can set the pipeline with the following fly command.

```shell
fly -t <target> set-pipeline -p build-and-use-image \
  -c ./build-and-use-image.yml
```