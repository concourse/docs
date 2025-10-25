---
title: Concourse Update (July 30 — Aug 3)
date: 2018-08-03
categories:
  - product-update
---

{{< image src="/images/downloaded_images/Concourse-Update--July-30---Aug-3-/1--syJtPB3nj0x2z8AVEh7zA.png" alt="" width="
45%" >}}

<!-- more -->

With the launch of Concourse 4.0.0, we’ve been monitoring
our [typical communication channels](https://concourse-ci.org/community.html)carefully to watch out for any glaring new
bugs. So far we seem to be safe from any crazy issues, but we have noticed that there has been some confusion in how to
set the basic auth users in the new deployment method (see [#2421](https://github.com/concourse/concourse/issues/2421)
for details). Thanks everyone for your patience and working through these issues with us!

The Concourse team will also be taking Monday, Aug 6 off for Canada’s Civic Holiday. We’ll be back at it on Tuesday, Aug
7.

On to the update:

**UX**

- You’ll notice that our UX backlog is filled to the brim with clean-up and polish stories. Now that we’ve release
  4.0.0, we’re taking some additional time to slow down to perform some additional polish and refactors
- Of note we have one regression which is prioritized highly “New resources are no longer highlighted in
  UI” [#2423](https://github.com/concourse/concourse/issues/2423)
- A lot of folks have noticed that the sidebar has been removed, and a bid to bring it back has started with
  issue [#2440](https://github.com/concourse/concourse/issues/2440)

**Core**

- We’ve been working on a track of stories around “pinning” a version of a resource across the
  pipeline [#2439](https://github.com/concourse/concourse/issues/2439)
  and [#2386](https://github.com/concourse/concourse/issues/2386)
- Database migrations have always been a headache for us and we’ve been looking at
  issues [#2074](https://github.com/concourse/concourse/issues/2074)
  and [#2452](https://github.com/concourse/concourse/issues/2439)

**Runtime**

- We finally got rid of Yeller support [#1819](https://github.com/concourse/concourse/issues/1819). I have no idea what
  that did, or why it was there; but good riddance
- The much requested feature to stream build logs out is being worked
  on [#2104](https://github.com/concourse/concourse/issues/2104)
