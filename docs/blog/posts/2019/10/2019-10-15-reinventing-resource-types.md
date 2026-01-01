---
title: Re-inventing resource types
date: 2019-10-15
categories:
- roadmap
authors:
  - asuraci
---

Before the paint completely dries on the [v10 roadmap](../07/2019-07-17-core-roadmap-towards-v10.md), there is one last
big unknown I want to explore in case it brings more clarity to our direction: generic tasks.

<!-- more -->

Resource types are a great way to share tools and integrations for others to use in their pipelines. Unfortunately,
they're basically the _only_ way, and because resources are a very opinionated concept, the resource type interface is
not always a good fit.

Concurrent to this problem, there's been a lot of talk about generic re-usable tasks. The idea is to make tasks just as
easy to share and use as resource types. This would be a great alternative to resource types for workflows that don't
really fit the resource model!

I finally found the time to dig in to these problems, and I have two new RFCs that I'm excited to propose:

- [RFC #37: Prototypes](https://github.com/concourse/rfcs/pull/37)
- [RFC #38: Resource Prototypes](https://github.com/concourse/rfcs/pull/38)

These proposals will have a lasting impact so I wanted to share some of my thought process here.

## What makes a resource?

If you'll humor me for a moment, I want to pin down what makes a resource a resource.

Resources are the _continuous_ part of Concourse. They represent inputs changing over time, passing different versions
through jobs to form a pipeline. Resources are how the continuous thing-doer knows that there are things to do:
pipelines converge on the latest available versions for each job's inputs, running builds until everything stabilizes.

A resource is a **single object** with a linear version sequence. This assumption allows Concourse pipelines to skip
ahead to the latest version by default instead of having to process every single version.

Resources have an **external source of truth** ; the same resource definition will always yield the same versions, in
the same order, in any pipeline, in any Concourse installation. This makes Concourse pipelines portable and
self-contained, which is critical for disaster recovery.

Resources are **immutable** ; fetching the same version will always give you the same bits. This allows `get` steps to
be cached so that they don't have to be downloaded all the time.

Resources are **idempotent** ; outputs will always result in the same external effect when given the same configuration
and bits. This allows for builds to be safely re-run even if some of its `put` steps already ran.

A resource definition looks something like this:

```yaml
resources:
- name: booklit
  type: git
  source:
    uri: https://github.com/vito/booklit
    branch: master
```

Every resource definition has a `type` and a `source`. The _type_ denotes the resource type - i.e. the implementation of
the [Concourse resource interface](../../../../docs/resource-types/implementing.md) to use. The _source_
represents the location of the resource, i.e. the source of versions. This configuration is interpreted by the resource
type, and is a black box to Concourse.

## How do resource types work?

A resource type is packaged as a container image with 3 executables living under `/opt/resource`: `check`, used for
finding versions, `in`, used for fetching versions, and `out`, used for writing versions. Each command reads a JSON
request on `stdin` and emits a JSON response on `stdout`. These actions are run by Concourse during pipeline scheduling
and build execution.

Concourse comes with a few "core" resource types. Some are necessary for bootstrapping, like the `registry-image` or
`docker-image` resource types. Some are included just to support common use cases, like `git` and `time`. We plan to
remove most of them though; it's making the download size pretty
big. ([#4586](https://github.com/concourse/concourse/issues/4586))

All other resource types must be configured in your pipeline under `resource_types:`. This makes the pipeline more
self-contained, decoupling it from the resource types the Concourse installation happens to have installed.

Pipelines define their own resource types by configuring a resource for the type's container image:

```yaml
resource_types:
- name: git
  type: registry-image
  source:
    repository: concourse/git-resource
    tag: 1
```

Technically, resource types work by using _another_ resource type to fetch their container image. It's turtles all the
way down!

A resource type that fits the original design of resources implements the following semantics:

- `check` queries the external source of truth to find new versions of the object.
- `in` reads from the external source of truth and always produces the same bits for the same version and `params`.
- `out` writes to the external source of truth if necessary based on the given bits and `params`. Any version emitted by
  `out` can also be found by `check`.

The easiest example of a 'proper' resource type is `git`. The `check` action consults `git log --first-parent` to return
ordered commits for a single branch. The `in` action does a `git clone` to fetch the repo and check out the given
commit; this is easily cached. The `out` action does a `git push`, optionally rebasing and returning a new version in
the event of a conflict.

## When is a resource type not a _resource_ type?

![](assets/2019-10-15-reinventing-resource-types-01.png)
/// caption
the treachery of container images
///

Resource types should always implement `check` and `in`. Being able to find and fetch versions is what makes a resource
a [resource](https://www.merriam-webster.com/dictionary/resource). Some resource types, however, only implement `out`.
These resource types exist solely to be run as a `put` step - a form of "generic tasks" limited by the fact that it
can't produce any outputs local to the build.

Resource types should always represent a single object. This is pretty foundational to Concourse pipeline semantics.
Some resource types, however, try to represent sets of objects. The easiest example is pull request resource types,
which represent each pull request as a version so that you can use Concourse to run tests for all your PRs.

This is fraught with peril:

- If you don't set `version: every` your builds will skip pull requests because all Concourse cares about is converging
  on the latest version of each object. If each version is actually a different object, this assumption breaks.
- Because `version: every` [allows versions to be skipped](https://github.com/concourse/concourse/issues/736) when used
  with `passed:` constraints, now you have to cram everything into one monolithic job. You can try to work around this
  by splitting it up and setting `serial: true` everywhere, but now you can't run PRs in parallel.
- Pull requests can skipped if the version history shifts around in a certain way. It's fundamentally impossible to try
  to represent changes to all pull requests as one version stream with a stable order, so the order jumps around all the
  time. If someone leaves a comment on a PR or pushes a new commit, it can get bumped to "latest" - and if a build has
  already run for it, the other ("older") PRs won't run. Even with `version: every`, Concourse won't go _back in time_
  to run old versions.
- Navigation is awkward. The pipeline UI is pretty meaningless since all the jobs just reflect the status of the most
  recent PR that ran, and going through the build history of a job is pretty confusing because each build may be a
  different pull request.
- Re-running builds for a pull request is annoying. You have to go to the PR resource, find the version for your PR, pin
  it, trigger all the builds, wait for them all to start, and _then_ you can unpin the resource, lest you forget and
  your pipeline never runs another PR again. This will get slightly better in v6.0 as we've finally implemented build
  re-triggering ([#413](http://github.com/concourse/concourse/issues/413)), but that won't help with triggering builds
  for an "older" PR that hasn't run yet.

This pain is the main source of motivation for the [v10 roadmap](../07/2019-07-17-core-roadmap-towards-v10.md), which
introduces all the required components to dynamically set a pipeline for each pull request instead - each with a
resource representing only one pull request, as Concourse intended.

In short, we have an interface being used for things beyond its original design. This results in surprising and unwanted
behavior because Concourse functionality that is sensible for _resources_ doesn't make sense for these other workflows.
This hurts everyone: users have to deal with surprises and terrible UX, resource type authors have to deal with these
limitations and workarounds, and the concept of 'resources' kind of erodes as these patterns spread.

At this point it's pretty clear that there's a need to be able to share workflows and bespoke tools within the
community, but it's also clear that resources aren't the best pipeline-level representation for all of them. So if
resources aren't a good fit, what about tasks?

## Usability of generic tasks

Tasks can _almost_ be packaged up and re-used as easily as resource types. I've been experimenting with this idea by
writing [a generic task for building OCI images](https://github.com/vito/oci-build-task). It works by configuring
`vito/oci-build-task` as the task's image and configuring the rest of the task according to the README in the repo.

So far, this UX doesn't sound that far off from using a resource type; you configure a resource type's image in
`resource_types:` and figure out how to configure the rest using its README, too. On paper, the only difference is that
a task's image is configured in `resources:` or with `image_resource:` instead.

Let's compare what it looks like to take a `git` repo, build an OCI image from its `Dockerfile`, and push the image to a
registry, using a generic task vs. using a resource type.

We'll begin with two resources: one for my image source code, and one for the image repository on the registry:

```yaml
resources:
- name: my-image-src
  type: git
  source:
    uri: # ...

- name: my-image
  type: registry-image
  source:
    repository: # ...
    tag: latest
```

Next we'll add a job that does the build-and-push.

Let's see how it looks to use a generic task:

```yaml
jobs:
- name: build-and-push
  plan:
  # fetch repository source (containing Dockerfile)
  - get: my-image-src

  # build using `oci-build` task
  - task: build
    image: oci-build-task
    config:
      platform: linux
      
      image_resource:
        type: registry-image
        source:
          repository: vito/oci-build-task

      params:
        CONTEXT: my-image-src

      inputs:
      - name: my-image-src

      outputs:
      - name: image
    
      run:
        path: build

  # push using `registry-image` resource
  - put: my-image
    params: {image: image/image.tar}
```

Now let's see how it feels to use a resource type instead. If we switch the `my-repo` resource from `registry-image` to
`docker-image`, we can leverage its ([quite contentious](https://github.com/concourse/docker-image-resource/issues/190))
build-and-push behavior:

```yaml
jobs:
- name: build-and-push
  plan:
  # fetch repository source (containing Dockerfile)
  - get: my-image-src

  # build + push using `docker-image` resource
  - put: my-image
    params:
      build: my-image-src
```

Resources clearly take a _lot_ less effort to use in a pipeline. No wonder they're being used for everything!

Providing a full task config is a lot of work. It allows for a lot of flexibility, but it feels verbose. Verbosity means
wasting time on typos and forgotten boilerplate.

Verbosity aside, tasks are also strictly worse at parameterization. Task `params` are really environment variables, so
every value has to be a string. This is OK for simple values, but anything more complicated will need to be marshalled
and unmarshalled. This is really crummy compared to resource types, which support complex YAML/JSON config structures
like lists and objects.

It seems like we need something in between tasks and resource types. We need something as versatile as tasks and as easy
to use as resource types.

## Bridging the gap

![](assets/2019-10-15-reinventing-resource-types-02.png)
/// caption
///

Let's hone in on the reason why resource types don't work for every use case: they have a particular set of actions
which have particular semantics because they're built for a particular Concourse use case: resources.

The [v10 roadmap](../07/2019-07-17-core-roadmap-towards-v10.md#rfc-24-resources-v2)
introduced [RFC #24](https://github.com/concourse/rfcs/pull/24), a "generalized resource" interface which supports
`check`, `get`, `put`, and `delete` actions while avoiding resource terminology like "version" and "source" so that it
can be used for other workflows. It's kind of a strange middle ground: it's limited to resource-y actions while avoiding
resource-y semantics.

Aside from the resource-y actions, RFC #24 was pretty darn close to what I wanted out of generic tasks, so I decided to
just fork it as [RFC #37](https://github.com/concourse/rfcs/pull/37) and make one key change: instead of supporting
`check`, `get`, `put`, and `delete`, support arbitrary actions instead.

With `check` and `get` removed, the interface was definitely not a _resource_ type interface anymore. And with its
support of multiple actions, it definitely wasn't a task interface either, so I needed a new name for it.

After much deliberation, I decided to call these things **prototypes**. This name is inspired by prototype-based
object-oriented languages like JavaScript, [Self](http://www.selflanguage.org/), and [Io](https://iolanguage.org/).
Conveniently enough, it still has "type" in the name, so all those `type:` fields on resources still make sense!

![](assets/2019-10-15-reinventing-resource-types-03.png)
/// caption
///

The next change in my fork of RFC #24 was to adjust the terminology. Now that the interface was so open-ended, I wanted
to build a solid mental model so that prototype authors would have an idea of how prototypes are meant to be designed. I
did this by stealing more terminology from prototype-based OOP.

Here's where I landed: prototypes handle messages (previously 'actions') being sent to objects (previously 'config'). In
response to a message, a prototype may emit more objects (previously 'config fragments').

Thinking about Concourse as "object-oriented CI/CD" feels pretty compelling. This mental model can be easily used to
describe how resource types work:

- The `check` message is sent to the `source` object to list `version` objects.
- The `get` message is sent to a `version` object (a [clone](https://en.wikipedia.org/wiki/Prototype-based_programming)
  of the `source` object) to fetch its bits.
- The `put` message is sent to the `source` object to create `version` objects.

Prototype implementations have full control over their domain of objects and the messages supported by those objects.
For example, a `git` prototype could support multiple types of objects:

- a **repo** object, `{"uri":"..."}`, could support `branches` to find branch objects and `check` to find commit objects
  in the "default" branch
- a **branch** object, `{"uri":"...","branch":"..."}`, could support `check` to find commit objects on the branch or
  `delete` to delete the branch
- a **commit** object, `{"uri":"...","branch":"...","sha":"..."}`, could support `get` to clone the repo and checkout
  the commit

Over time, we can start to identify patterns and implement pipeline semantics for certain interfaces, just like we have
with `check`, `get`, and `put`. For example, when a build status changes, Concourse could run the `notify` message
handler for any objects in the build which support it. A `git` prototype could implement this to automatically update
commit status on GitHub. This would eliminate a whole class of `put`-only resource types and de-clutter everyone's
pipelines.

## Prototypes as 'generic tasks'

Whereas a task is built around a single action, a prototype is built around objects which can handle messages. As such,
the `oci-build` task would instead be an `oci-image` prototype supporting a `build` message.

Here's how it could look to use a prototype for building an OCI image (note the use of `prototypes:` instead of
`resource_types:`):

```yaml
prototypes:
- name: oci-image
  type: registry-image
  source:
    repository: vito/oci-image-prototype

jobs:
- name: build-and-push
  plan:
  # fetch repository source (containing Dockerfile)
  - get: my-image-src

  # build using `oci-image` prototype
  - run: build
    type: oci-image
    inputs: [my-image-src]
    params: {context: my-image-src}
    outputs: [image]

  # push using `registry-image` resource
  - put: my-image
    params: {image: image/image.tar}
```

Here we use a new `run` step to run the `oci-image` prototype and send the `build` message to an object, given as
`params`. With the `run` step, `inputs` and `outputs` must be explicitly provided, though `inputs` can be automated in
the future with [#2692](https://github.com/concourse/concourse/issues/2692).

All in all, this feels a whole lot better than the generic tasks of old. It's way less verbose, and feels a lot like
using a `put` step, with no abstractions being abused and no surprising behavior. Mission accomplished?

## How does this impact the roadmap?

Through all of this, the only thing I've really added to the roadmap is the `run` step. Everything else is a lateral
move; instead of using 'generalized resources' for spatial resources, notifications, and triggers, we would use 
'prototypes' instead.

I think the larger impact will be on future roadmaps. With a more flexible model at our disposal we can shorten the path
from identifying a common workflow and implementing richer pipeline semantics for it. Concourse becomes a "language of
CI/CD," where the objects are provided at runtime and can be shared with the community.

## How to get involved

I'm still getting a grip on this idea myself but I'm excited to see the places we can go with it. If you'd like to get
involved, I could use some feedback on the RFCs!

- [RFC #37: Prototypes](https://github.com/concourse/rfcs/pull/37) is based
  on [RFC #24](https://github.com/concourse/rfcs/pull/24), allowing implementations to support arbitrary messages and
  switching everything over to prototype-based terminology. It also introduces the above `run` step for executing
  arbitrary message handlers.
- [RFC #38: Resource Prototypes](https://github.com/concourse/rfcs/pull/38) shows that prototypes which implement
  `check` and `get` messages can be used a resources in a pipeline, while maintaining backwards-compatibility for a
  smooth migration to prototype-based resources over time.

If everything goes well I plan to close RFC #24 and the other 'generalized resources' based RFCs in favor of these new
prototype-based RFCs. (I still need to write up new prototype-based RFCs for the rest though: spatial resources,
notification resources, trigger-only resources.)

Special thanks to everyone that has helped me talk through ideas in Discord, on GitHub, and in person!
