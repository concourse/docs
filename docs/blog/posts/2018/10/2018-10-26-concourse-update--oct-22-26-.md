---
title: Concourse Update (Oct 22–26)
date: 2018-10-26
categories:
- product-update
---

{{< image src="/images/downloaded_images/Concourse-Update--Oct-22-26-/1-MnGUtwM_fDCZBeKhYrlwqA.jpeg" alt="MGI
Construction Corp" width="50%" >}}

<!-- more -->

This week the team got together to discuss the initial groundwork and investigations required to publish and maintain a
supported API. If you’ve built any tools against our API and have feedback for us, please let us know by commenting on
the original [issue #1122](https://github.com/concourse/concourse/issues/1122).

In another interesting update, the [PivNet](https://network.pivotal.io/) team has published an update to
the [pivnet-resource](https://github.com/pivotal-cf/pivnet-resource) so “you **no longer need to specify the access key,
secret access key, bucket and region** for creating releases.” If you use that resource, you should definitely check it
out!

On to the update:

**UX**

- Picked up the story for pinning versions of resources in the web
  UI [#2508](https://github.com/concourse/concourse/issues/2508)

**Core**

- Continued our work on resources v2 and spatial resources
  with [#2651](https://github.com/concourse/concourse/issues/2651)

**Runtime**

- Picked up failing tests in Testflight/Watsjs [#2719](https://github.com/concourse/concourse/issues/2719)
- Started work on retry / read deadline for Volume Streaming [#2676](https://github.com/concourse/concourse/issues/2676)

**Operations**

{{< image src="/images/downloaded_images/Concourse-Update--Oct-22-26-/1-yxHddOEl3sz5TqCy7M0q_A.png" width="50%" >}}

We’ve added descriptions to our metrics graphs! You can check out the descriptions on our prod metrics
here: [https://metrics.concourse-ci.org/dashboard/db/concourse?refresh=1m&orgId=1](https://metrics.concourse-ci.org/dashboard/db/concourse?refresh=1m&orgId=1)

In other news we’re also working on [#2674](https://github.com/concourse/concourse/issues/2674), emit metrics for locks
held in the database
