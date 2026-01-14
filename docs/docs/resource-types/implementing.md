---
title: Implementing a Resource Type
---

A resource type is implemented by a container image with three scripts:

* `/opt/resource/check` for checking for new versions of the resource
* `/opt/resource/in` for pulling a version of the resource down
* `/opt/resource/out` for idempotently pushing a version up

Distributing resource types as containers allows them to package their own dependencies. For example, the `git` resource
comes with the `git` binary pre-installed.

All resources must implement all three actions, though the actions can just be no-ops (which still must be correctly
implemented as detailed below).

Resources can emit logs to the user by writing to `stderr`. ANSI escape codes (coloring, cursor movement, etc.) will be
interpreted properly by the web UI, so you should make your output pretty.

## `check`: Check for new versions.

A resource type's `check` script is invoked to detect new versions of the resource. It is given the configured source
and current version on `stdin`, and must print the array of new versions, in chronological order (oldest first),
to `stdout`, including the requested version if it's still valid.

The request body will have the following fields:

<div class="annotate" markdown>

* `source` is an arbitrary JSON object which specifies the location of the resource (1), including any credentials. This
  is passed verbatim from the [resource configuration](../resources/index.md).

* `version` is a JSON object with `string` fields, used to uniquely identify an instance of the resource. For `git` this
  would be the commit's SHA.

</div>

1. For the `git` resource this would be the repo URI, the branch, and the private key, if necessary.

For example, here's what the input for the `git` resource may look like:

```json
{
  "source": {
    "uri": "git://some-uri",
    "branch": "develop",
    "private_key": "..."
  },
  "version": {
    "ref": "61cbef"
  }
}
```

Upon receiving this payload the `git` resource would probably do something like:

```shell
[ -d /tmp/repo ] || git clone git://some-uri /tmp/repo
cd /tmp/repo
git pull && git log 61cbef..HEAD
```

Note that it conditionally clones; the container for checking versions is reused between checks, so that it can
efficiently pull rather than cloning every time.

And the output, assuming `d74e01` is the commit immediately after `61cbef`:

```json
[
  {
    "ref": "61cbef"
  },
  {
    "ref": "d74e01"
  },
  {
    "ref": "7154fe"
  }
]
```

The list may be empty, if there are no versions available at the source. If the given version is already the latest, an
array with that version as the sole entry should be listed.

If your resource is unable to determine which versions are newer than the given version (e.g. if it's a git commit that
was `push -f`ed over), then the current version of your resource should be returned (i.e. the new `HEAD`).

## `in`: Fetch a given resource.

The `in` script is passed a destination directory as command line argument `$1`, and is given on `stdin` the configured
source and a precise version of the resource to fetch.

The script must fetch the resource and place it in the given directory.

If the desired resource version is unavailable (for example, if it was deleted), the script must exit with error.

The script must emit the fetched version, and may emit metadata as a list of key-value pairs. This data is intended for
public consumption and will make it upstream, intended to be shown on the build's page.

The request will contain the following fields:

* `source` is the same value as passed to [check](#check-check-for-new-versions).
* `version` is the same type of value passed to [check](#check-check-for-new-versions), and specifies the version to
  fetch.
* `params` is an arbitrary JSON object passed along verbatim from get step params on a [get step](../steps/get.md).

Example request, in this case for the `git` resource:

```json
{
  "source": {
    "uri": "git://some-uri",
    "branch": "develop",
    "private_key": "..."
  },
  "version": {
    "ref": "61cebf"
  }
}
```

Upon receiving this payload the `git` resource would probably do something like:

```shell
git clone --branch develop git://some-uri $1
cd $1
git checkout 61cebf
```

And output:

```json
{
  "version": {
    "ref": "61cebf"
  },
  "metadata": [
    {
      "name": "commit",
      "value": "61cebf"
    },
    {
      "name": "author",
      "value": "Hulk Hogan"
    }
  ]
}
```

## `out`: Update a resource.

The `out` script is passed a path to the directory containing the build's full set of sources as command line
argument `$1`, and is given on `stdin` the configured params and the resource's source configuration.

The script must emit the resulting version of the resource. For example, the `git` resource emits the SHA of the commit
that it has just pushed.

Additionally, the script may emit metadata as a list of key-value pairs. This data is intended for public consumption
and will make it upstream, intended to be shown on the build's page.

The request will contain the following fields:

* `source` is the same value as passed to [check](#check-check-for-new-versions).
* `params` is an arbitrary JSON object passed along verbatim from get step params on a [`put` step](../steps/put.md).

Example request, in this case for the `git` resource:

```json
{
  "params": {
    "branch": "develop",
    "repo": "some-repo"
  },
  "source": {
    "uri": "git@...",
    "private_key": "..."
  }
}
```

Upon receiving this payload the `git` resource would probably do something like:

```shell
cd $1/some-repo
git push origin develop
```

And output:

```json
{
  "version": {
    "ref": "61cebf"
  },
  "metadata": [
    {
      "name": "commit",
      "value": "61cebf"
    },
    {
      "name": "author",
      "value": "Mick Foley"
    }
  ]
}
```

## Metadata

When used in a [`get` step](../steps/get.md) or a [`put` step](../steps/put.md), metadata about the running build is
made available via the following environment variables:

`$BUILD_ID`

:   The internal identifier for the build. Right now this is numeric, but it may become a UUID in the future. Treat
it as an absolute reference to the build.

`$BUILD_NAME`

:   The build number within the build's job.

`$BUILD_JOB_NAME`

:   The name of the build's job.

`$BUILD_PIPELINE_NAME`

:   The name of the pipeline that the build's job lives in.

`$BUILD_PIPELINE_INSTANCE_VARS`

:   The instance vars of the instanced pipeline that the build's job lives in, serialized as JSON.
See [Grouping Pipelines](../pipelines/grouping-pipelines.md) for a definition of instanced pipelines.

`$BUILD_TEAM_NAME`

:   The team that the build belongs to.

`$BUILD_CREATED_BY`

:   The username that created the build. By default, it is not available.
See [`expose_build_created_by`](../resources/index.md#resource-schema) for how to opt in. This metadata field is not
made available to the [`get` step](../steps/get.md).

`$ATC_EXTERNAL_URL`

:   The public URL for your ATC; useful for debugging.

`$BUILD_URL`

:   The URL of the build using team, pipeline, instance vars, and job name in
the URL. Same as what you would see in the web UI. Will be the same value as
`$BUILD_URL_SHORT` if it's a one-off build.

`$BUILD_URL_SHORT`

:   The short URL of the build in the form `$ATC_EXTERNAL_URL/builds/$BUILD_ID`

If the build is a one-off, `$BUILD_NAME`, `$BUILD_JOB_NAME`, `$BUILD_PIPELINE_NAME`, and `$BUILD_PIPELINE_INSTANCE_VARS`
will not be set.

Additionally, `$BUILD_PIPELINE_INSTANCE_VARS` will not be set if the build's pipeline has no instance vars (i.e. is not
an instanced pipeline).

None of these variables are available to [check](#check-check-for-new-versions).

These variables should be used solely for annotating things with metadata for traceability, i.e. for linking to the
build in an alert or annotating an automated commit to facilitate its origin discovery.

They should _not_ be used to emulate versioning (e.g. by using the increasing build number). They are not provided
to [`task` steps](../steps/task.md) to avoid this anti-pattern.

## Certificate Propagation

Certificates can be automatically propagated into each resource container, if the worker is configured to do so. The
BOSH release configures this automatically, while the `concourse` binary must be given a `--certs-dir` flag pointing to
the path containing the CA certificate bundle.

The worker's certificate directory will then be always mounted at `/etc/ssl/certs`, read-only, in each resource
container created on the worker. There's no single standard path for this, so we picked one that would work out of the
box in most cases.

This approach to certificate configuration is similar in mindset to the propagation of `http_proxy`/`https_proxy` -
certs are kind of a baseline assumption when deploying software, so Concourse should do its best to respect it
out-of-the-box, especially as they're often used in tandem with a man-in-the-middle corporate SSL proxy. (In this way it
doesn't feel too much like the anti-pattern of hand-tuning workers.)

## Testing resources locally using docker

To test an already packaged resource (a docker image) outside concourse, you need to:

1. If, for instance, you are testing the `out` behaviour of the `git` resource, create a json file with `source`
   configuration of the resource and the `params` the `put` step expects. Such a file for the `git` resource would
   contain the following (or similar):
   <br/>
    ```json
    {
      "source": {
        "uri": "git://some-uri",
        "branch": "develop",
        "private_key": "..."
      },
      "params": {
        "repository": ".",
        "rebase": true
      }
    }
    ```
   Save this file to out-config.json in your working directory.
2. Then run the `/opt/resource/out` script with its inputs provided via `stdin` like so (using the `docker` cli as an
   example):
   <br/>
    ```shell
    docker run --rm -i -v "${PWD}:${PWD}" -w "${PWD}" \
      concourse/git-resource /opt/resource/out . < out-config.json
    ```

!!! warning

    This example needs modification depending on the resource you are testing and your local environment. See the notes 
    below for details.

1. If you use the exact configuration in this example, the git resource will print an error about the format of the
   private key being invalid. Adjust the content `out-config.json` as necessary to get it working with your resource.
2. If the resource you are testing uses [Metadata](#metadata), you will need to provide the required metadata as
   environment variables to your `docker run` command like so:
   <br/>
    ```shell
    docker run --rm -i -e ATC_EXTERNAL_URL="https://concourse.example.com" \
      -e BUILD_NAME=620 \
      -v "${PWD}:${PWD}" \
      -w "${PWD}" concourse/git-resource /opt/resource/out . < out-config.json
    ```