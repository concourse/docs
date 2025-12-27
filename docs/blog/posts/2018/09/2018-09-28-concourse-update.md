---
title: Concourse Update (Sept 24–28)
date: 2018-09-28
categories:
- product-update
authors:
  - jamesma
---

{{< image src="/images/downloaded_images/Concourse-Update--Sept-24-28-/1-hrYofU4YBkZ9SWkt4fUPZA.jpeg" alt="Reppin’
Concourse at Spring One Platform" width="60%" >}}

<!-- more -->

The Concourse team went out to Washington D.C. this week to attend Spring One Platform 2018. Thanks to all the Concourse
fans who stopped by to say hi, we really enjoyed meeting ya’ll. All of the talks were recorded and should be uploaded to
the [SpringDeveloper](https://www.youtube.com/user/SpringSourceDev/videos) YouTube channel in the coming weeks. Some of
the interesting talks to check out are:

- [Extreme Pipelines](https://springoneplatform.io/2018/sessions/extreme-pipelines)
- [Zero to Multicloud](https://springoneplatform.io/2018/sessions/zero-to-multi-cloud)
  and [Spinnaker and the Distributed Monorepo](https://springoneplatform.io/2018/sessions/spinnaker-and-the-distributed-monorepo)
- ...and of
  course [Draupnir: A story about Managing Concourse in the Enterprise](https://springoneplatform.io/2018/sessions/draupnir-a-story-about-managing-concourse-in-the-enterprise)
  {{< image src="/images/downloaded_images/Concourse-Update--Sept-24-28-/1-syqGOwSEdWFE5CvrkZT-Kg.jpeg" alt="Concourse ❤
  Spring &amp; PCF" width="60%" >}}

And now, on to the update:

{{< image src="/images/downloaded_images/Concourse-Update--Sept-24-28-/1-kTNsddsROpolUBj1oiJ6Mg.png" alt="" width="
50%" >}}

You’ll notice that our main pipelines are paused. This is because [Alex Suraci](https://medium.com/u/263a63b2f209) is
working away on [#2534](https://github.com/concourse/concourse/issues/2534), refactoring our main pipeline to support
our new mono-repo structure. This new pipeline is simply called
the [concourse](https://ci.concourse-ci.org/teams/main/pipelines/concourse)[pipeline](https://ci.concourse-ci.org/teams/main/pipelines/concourse).

In addition to refactoring the pipeline, [Alex Suraci](https://medium.com/u/263a63b2f209) has been fleshing out the new
developer/contributor workflows under our new mono-repo. You can find the new updated information
in [CONTRIBUTING.md](https://github.com/concourse/concourse/blob/master/.github/CONTRIBUTING.md).

{{< image src="/images/downloaded_images/Concourse-Update--Sept-24-28-/1-f2DIMOJRMC4Cm8YG-iWGXw.png" alt="Bugs…or
features?!" width="100%" >}}

You’ll also notice that we ask whether you are reporting a bug or a new feature when creating issues. This will (
hopefully) help get our backlog more organized and reduce the up-front triaging!

**Fly**

- Completed [#2221](https://github.com/concourse/concourse/issues/2221) “Add fly command to land worker”
- Added new fly flag to “Support manual token entry during login when running `fly` from a remote shell”
  in [#2464](https://github.com/concourse/concourse/issues/2464)
- Fixed [#2539](https://github.com/concourse/concourse/issues/2539), where a login through fly may be “successful” if
  you do not belong to a specific team
- Fixed [#2598](https://github.com/concourse/concourse/issues/2598)

**Core**

- [#2386](https://github.com/concourse/concourse/issues/2386) is done!

**Runtime**

- Continuing on [#2588](https://github.com/concourse/concourse/issues/2588)

**Operations**

- Tackling [#2312](https://github.com/concourse/concourse/issues/2312), which is still giving us a run for our money
