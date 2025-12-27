---
layout: post
title: Concourse Update (Jul 16–20)
date: 2018-07-20
categories:
  - product-update
authors:
  - jamesma
---

{{< image src="/images/downloaded_images/Concourse-Update--Jul-16-20-/1-CIxNgJ_FKbnacEpUI588nw.jpeg" alt="" width="
100%" >}}

<!-- more -->

This week, the Concourse team went out to Portland to attend OSCON
2018. [Topher Bullock](https://medium.com/u/58876cdc2180) gave a great intro to Concourse in the Open Source track. We
even met some of the Concourse fans in person!

In other news, we’ve begun to sketch out what RBAC might look like in Concourse. Please check
out [#2389](https://github.com/concourse/concourse/issues/2389) when you have some time!

On to the update:

**UX**

- Team has been working on adding drag and drop re-arranging for the dashboard
  in [#2364](https://github.com/concourse/concourse/issues/2364)
- We also found a weird quirk with the new team creation flow, where you won’t see your team if it was just created and
  has no pipelines. We will be addressing this in [#2382](https://github.com/concourse/concourse/issues/2382)
- Play/pause pipeline on the dashboard is mostly completed but was missing functionality when a search filter was
  applied; so I had to reject that story for review in [#2365](https://github.com/concourse/concourse/issues/2365)
- [Lindsay Auchinachie](https://medium.com/u/84b937bda3b6) has also been entering some new UI polish issues to co-incide
  with our new dark
  theme: [#2370](https://github.com/concourse/concourse/issues/2370), [#2385](https://github.com/concourse/concourse/issues/2385), [#2387](https://github.com/concourse/concourse/issues/2387), [#2361](https://github.com/concourse/concourse/issues/2361)

**Core**

- Picked up some stories related our migrations, see [#2380](https://github.com/concourse/concourse/issues/2380)
  and [#2074](https://github.com/concourse/concourse/issues/2074)
- Keen watchers of our repo will notice that we’ve added a note in
  our [core backlog](https://cadet.cfapps.io/projects/Core#s-MDU6SXNzdWUzMzgzMjAxOTA%3D.s-MDU6SXNzdWUxOTA4MjM4NzU%3D.s-MDU6SXNzdWUzNDE1ODE1NTE%3D)
  to start sketching out what additional work we need to get space moving along.
- Reminder to check out and comment on
  the [Resources v2](https://github.com/vito/rfcs/blob/resources-v2/01-resources-v2/proposal.md) proposal!

**Integrations**

- We closed [#215](https://github.com/concourse/docker-image-resource/issues/215) in the docker-image-resource recently
  after we discovered a regression with a newer version of Docker. This seems to only affect large-scale Concourse
  installations that have reliability issues accessing and connecting to their local registries. A short-term fix is to
  target older versions of the docker-image-resource

**Runtime**

- Addressed [#1516](https://github.com/concourse/concourse/issues/1516), wherein Concourse doesn’t run any jobs if Vault
  misconfigured
- Did some work to begin imposing limits on containers in [#787](https://github.com/concourse/concourse/issues/787).
  Please review this issue carefully if this affects you; since our initial resolution is very specific and requires you
  to understand the nature of your worker vms
- Worked on [#2375](https://github.com/concourse/concourse/issues/2375) “Listing destroying volumes should not perform
  any database write operations” :D
