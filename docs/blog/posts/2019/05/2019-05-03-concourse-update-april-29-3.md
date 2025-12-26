---
title: Concourse Update April 29–3
date: 2019-05-03
categories:
- product-update
---

In case you missed it, we’ve made some tweaks to the structure of the website. I’m happy to report
that [Alex Suraci](https://medium.com/u/263a63b2f209) drastically improved our site-wide search. This
resolves [#181](https://github.com/concourse/docs/issues/181) and we’re all the better for it!

<!-- more -->

Second, you’ll notice that a lot of the community related comment that was on our homepage has now been moved to
our [Concourse GitHub Wiki](https://github.com/concourse/concourse/wiki). We hope this change will make contributor and
community specific content more discoverable and more maintainable over time.

{{< image src="/images/downloaded_images/Concourse-Update-April-29-3/1-08IsVksi-Nc9O0BnmW5MiA.png" alt="Concourse Wiki
with more Contributor things!" width="100%" >}}

Notably,
the [Resource Types](https://github.com/concourse/concourse/wiki/Resource-Types), [Tutorials](https://github.com/concourse/concourse/wiki/Tutorials),
and [Tools](https://github.com/concourse/concourse/wiki/Tools) page has moved over to the wiki. Content that may be new
to some of you include the Project Management
section: [How Issues are Managed](https://github.com/concourse/concourse/wiki/How-Issues-are-Managed), [How to Process PRs](https://github.com/concourse/concourse/wiki/How-to-Process-PRs),
and [Release Process](https://github.com/concourse/concourse/wiki/Release-Process).

On to the update.

### K8s Runtime

Bohen and Sameer have been doing some great write-ups on their research. You can get caught up with their latest
research in two GitHub issues: [What does k8s offer as a runtime](https://github.com/concourse/concourse/issues/3798)
and [What does Tekton offer as a runtime](https://github.com/concourse/concourse/issues/3797). If you’d like to track
along with this project’s movements you can bookmark the K8s Runtime project board
here: [https://github.com/concourse/concourse/projects/14](https://github.com/concourse/concourse/projects/14)

### UX

The Sidebar is coming back! Check out our latest designs
in [#2440](https://github.com/concourse/concourse/issues/2440#issuecomment-482133483).

We’ve been looking into a few UI regressions in the web frontend as well.
Specifically, [#3745](https://github.com/concourse/concourse/issues/3745)
and [#3748](https://github.com/concourse/concourse/issues/3748) have been moved to the top of the backlog

### Runtime

We’ve been working on [#3607](https://github.com/concourse/concourse/issues/3607)
and [#3810](https://github.com/concourse/concourse/issues/3607) as sub-stories to help with Ephemeral Check
Containers [#3424](https://github.com/concourse/concourse/issues/3424)

[Divya Dadlani](https://medium.com/u/521c9107181d) has also been thinking a lot more about “Performance benchmarking for
Concourse releases” [#3816](https://github.com/concourse/concourse/issues/3816). The idea is that we should be a bit
more rigorous in tracking how Concourse improves with some of the runtime performance changes. Jump on over to the issue
and drop a line if you have any ideas/opinions on this subject.

