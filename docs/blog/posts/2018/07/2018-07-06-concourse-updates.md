---
title: Concourse Updates (July 3–6)
date: 2018-07-06
categories:
  - product-update
authors:
  - jamesma
---

{{< image src="/images/downloaded_images/Concourse-Updates--July-3-6-/0-BrjbFvtgpagi0Ag3.png" alt="Concourse, beavers,
poutine and maple syrup" width="100%" >}}

<!-- more -->

Since July 1st was the official day of [Canada’s birth](https://en.wikipedia.org/wiki/Canada_Day), the Concourse team
enjoyed a long weekend with no work on Monday. We were, however, able to get quite a bit done during this short week.

A big win is that we added a k8s-testflight job to our official ci pipeline (check it
out [here](https://ci.concourse-ci.org/teams/main/pipelines/main/jobs/k8s-testflight)); this will let us know in advance
when we have broken
the [Concourse Kubernetes Helm Chart](https://github.com/kubernetes/charts/tree/master/stable/concourse). Shout out
to [Divya Dadlani](https://medium.com/u/7b8aac84a2b9), Jamie Klassen and Rui Yang for working on that in the Concourse
team!

Here’s also a few interesting reminders:

- For Pivotal-supported releases of Concourse (aka Concourse for PCF) you can find a compatibility matrix of common
  dependencies
  here: [http://docs.pivotal.io/p-concourse/#Compatibility](http://docs.pivotal.io/p-concourse/#Compatibility)
- I realized this week that not a lot of people know about this; but [Alex Suraci](https://medium.com/u/263a63b2f209)
  wrote up a series of [Concourse Anti-Patterns](https://github.com/concourse/concourse/wiki/Anti-Patterns) a while
  back. Its definitely worth the read
- PLEASE take a second to review the upcoming Resource v2 [RFC](https://github.com/concourse/rfcs/pull/1) or its
  rendered version [here](https://github.com/vito/rfcs/blob/resources-v2/01-resources-v2/proposal.md)
- **Concourse team is going to OSCON!** Come by the Pivotal booth 406 and say “hi”!

Anyways, on to the update:

**UX**

- Fixed some minor UI issues across the
  board: [#2333](https://github.com/concourse/concourse/issues/2333), [#2313](https://github.com/concourse/concourse/issues/2313), [#2291](https://github.com/concourse/concourse/issues/2291),
  and [#2310](https://github.com/concourse/concourse/issues/2310)
- Continued our work in routing Dashboard page to the Home page
  in [#2282](https://github.com/concourse/concourse/issues/2282). This, however, has turned into a bit of a scope creep
  and we are now upgrading the entire UI to use the new dark theme:
  {{< image src="/images/downloaded_images/Concourse-Updates--July-3-6-/1-Xp51wHexBz5wx1GcqaCvwA.png" alt="" width="
  50%" >}}

**Core**

- Discovered some additional backward incompatibilities with the new user-based auth that would be _super annoying_ to
  deal with; so we have addressed some of them
  in[#2326,](https://github.com/concourse/concourse/issues/2326) [#2299](https://github.com/concourse/concourse/issues/2299)
  and [#1810](https://github.com/concourse/concourse/issues/1810). **As always, you can read about future
  incompatibilities with our new auth in issue** [**#2218**](https://github.com/concourse/concourse/issues/2218)
- [Alex Suraci](https://medium.com/u/263a63b2f209) had some time to pick up some low-hanging performance-improving fruit
  in [#285](https://github.com/concourse/atc/pull/285)
