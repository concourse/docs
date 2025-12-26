---
title: Concourse Update (Dec 3–7)
date: 2018-12-07
categories:
- product-update
---

{{< image src="/images/downloaded_images/Concourse-Update--Dec-3-7-/1-9QGCZafW4o8rGIVxN4QvYA.jpeg" alt="Stephen A.
Wolfe" width="75%" >}}

<!-- more -->

We’re nearing the end on some UX refactoring work and finished off the issue regarding container scheduling. Between
those improvements and the global resource caching, we’re hoping to see a lot of efficiency improvements in 5.0

That said, we’ve decided that we need to perform some additional performance and load testing on Concourse 5.0 before we
cut the release. And with the holidays coming up, its increasingly unlikely that we’ll be able to push Concourse 5.0
before the end of this year. In the meantime, we’re planning to make a big update post describing the new deployment
pipeline, contribution structure, major features in Concourse 5.0, and much more; so keep an eye out for that in the
coming days!

If you’re attending [KubeCon](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-north-america-2018/) next
week I’d encourage you to check out the talk
on [Using Concourse as a CI/CD Tool for Your Knative Ap](https://cfdayna18.sched.com/event/I7YM/using-concourse-as-a-cicd-tool-for-your-knative-app-dale-wick-divya-dadlani-pivotal#)
p. Concourse engineer Divya Dadlani will be co-speaker on this talk and if you ask nicely; she might give you one of our
fancy Concourse stickers. You should also check out Fairfax Media’s talk
on [Cloud Native Transformation](https://kccna18.sched.com/event/Grb7/cloud-native-transformation-pavel-nikolov-matt-hope-fairfax-media)
too, I hear they use a lot of Concourse!

And finally, I’ll be taking some time off for the holidays starting Dec 13, and won’t be returning to work until the new
year. I’ve got a few posts scheduled to come out until then, but for now happy holidays, happy new year, and thanks for
another awesome year of Concourse.

On to the update:

**API**

- Resolved [#2887](https://github.com/concourse/concourse/issues/2887)

**UX**

- Fixed a bug that happens when you try to log out from
  Concourse [#2884](https://github.com/concourse/concourse/issues/2884)
- Fixed an issue with Fly where using -c on set-team with RBAC will fail silently if you use a badly-formed
  file[#2904](https://github.com/concourse/concourse/issues/2904)
- Fixed an issue regarding the output of fly teams -d [#2880](https://github.com/concourse/concourse/issues/2880)

**Runtime**

- Slightly better scheduling [#2577](https://github.com/concourse/concourse/issues/2577)
