---
layout: post
title: Concourse Update (Jul 9–13)
date: 2018-07-13
categories:
  - product-update
---

{{< image src="/images/downloaded_images/Concourse-Update--Jul-9-13-/1-AuH8VYkniNetbpZtRBjTuA.png" alt="DARK" width="
100%" >}}

<!-- more -->

We’re going dark themed for Concourse 4.0.0! In addition to the users work, we’re promoting the Dashboard to the / level
to take over the home page. You’ll also notice that we added pipeline play/pause capabilities to the dashboard, NEAT!

To keep things consistent, we’re also propagating our new design to the existing pipeline views. You can play around
with this new nav structure on our own CI: [https://ci.concourse-ci.org/](https://ci.concourse-ci.org/)

The team here is also planning to attend OSCON in Portland next week (July 18 & 19). Drop by the Pivotal booth to say hi
and grab a Concourse sticker!

On to the update:

**UX**

- Fixed some resource alerting errors on the pipeline [#2333](https://github.com/concourse/concourse/issues/2333)
- Moved dashboard to home [#2282](https://github.com/concourse/concourse/issues/2282)
- Added Pause/Play pipeline buttons on homepage [#2365](https://github.com/concourse/concourse/issues/2365)
- Worked on dragging to re-order pipelines on the dashboard [#2364](https://github.com/concourse/concourse/issues/2333)
- Updated and propagated the new colours across the app [#2370](https://github.com/concourse/concourse/issues/2370)

**Core**

- Added health check APIs to verify credential managers are properly
  configured [#2216](https://github.com/concourse/concourse/issues/2216)
- Even more db optimizations! yay!

**Runtime**

- Picked up an oldie but a goodie: Concourse should support imposing limits on container
  resources [#787](https://github.com/concourse/concourse/issues/787)

**Operations**

- Started to move our stemcells onto the
  new [Xenial stemcells](https://github.com/concourse/concourse-bosh-deployment/issues/71)
- Switch upgrade/downgrade testing jobs to the binaries [#2371](https://github.com/concourse/concourse/issues/2371)
