---
title: Concourse Update (Jan 7–11)
date: 2019-01-11
categories:
- product-update
---

{{< image src="/images/downloaded_images/Concourse-Update--Jan-7-11-/1-xc1d4AtxzZanyNVDiEPrvg.jpeg" width="50%" >}}

<!-- more -->

…and we’re back! The team’s been pretty quiet over the past few weeks due to vacations and holidays. This was our first
week back at full strength so we’ve got some interesting updates for ya’ll

## How are issues managed?

This is an issue that comes up a lot in our open source community, and [Alex Suraci](https://medium.com/u/8a9db60441c)
has taken some time to clean up our issues backlog and add in some bots. You can read the full details
here: [How Issues are Managed](https://github.com/concourse/concourse/wiki/How-Issues-are-Managed)

In addition to the changes to how issues are labeled, we’ve also changed how we used projects and milestones under
concourse/concourse. Epics are now organized
under [projects in concourse/concourse](https://github.com/concourse/concourse/projects), and release markers are
managed under [milestones in concourse/concourse](https://github.com/concourse/concourse/milestones). And as always, our
“tracks of work” can be found at the [org-level project page](https://github.com/orgs/concourse/projects).

## Updates

**UX**

Thanks to the hard work of the UX team, they were able to crank through a lot of nice UI issues over the past few weeks.
This includes [#2405](https://github.com/concourse/concourse/issues/2405)
and [#2881](https://github.com/concourse/concourse/issues/2881). We will also be scheduling a big track of work for
transitioning to Elm 0.19.

**Core**

We’re picking up from the global resource cache work from last year and picking off the remaining blockers to release.
Specifically [#2908](https://github.com/concourse/concourse/issues/2908) needs to be addressed otherwise everyone’s
time-resource will kick off at the same time; which may be very bad news for shared environments. In order to keep the
release process on track we will be parallelizing [#2874](https://github.com/concourse/concourse/issues/2874)
performance testing to another pair.

**Runtime**

Having completed the placement strategy and testing it in prod, we’re proceeding to do some refactoring
in [#2926](https://github.com/concourse/concourse/issues/2926)

