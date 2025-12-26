---
title: Concourse Update (Jan 14–18)
date: 2019-01-18
categories:
- product-update
---

{{< image src="/images/downloaded_images/Concourse-Update--Jan-14-18-/1-6MKC6FrHvi5u_9yZCklyeA.png" alt="for context...
or don’t 🤷" width="100%" >}}

<!-- more -->

Some updates worth bringing up this week. As I had mentioned last week we began to do a re-organization of projects and
issues in our concourse/concourse repo; you can read more about it on
our [wiki page here](https://github.com/concourse/concourse/wiki/How-Issues-are-Managed). With that said, you can find
the issues and PRs that are slated for Concourse 5.0.0’s release in
our [5.0.0 Milestones](https://github.com/concourse/concourse/milestone/33). If you’d like to help us with
documentation, we’ve started a new branch in the docs repo under [v5.0](https://github.com/concourse/docs/tree/v5.0).

One of the items we want to resolve before release is issue [#3003](https://github.com/concourse/concourse/issues/3003)
“Determine full set of core resources that we should bundle with Concourse”. In this discussion we’re going over the
idea of removing the pre-baked resources in favour of slimming down the Concourse footprint and only shipping what is
absolutely needed. We want to hear how this may impact you and your Concourse experience. We’d like to wrap this up
soon, so please drop in a comment at your earliest convenience!

In other big news, the Concourse core engineering team has officially switched to a PR based workflow. That means we are
no longer allowing direct commits to master and all issue “acceptance” will be conducted via the merging of pull
requests. We hope this will make our development process even _more_ transparent and further involve the community in
day-to-day work!

On to the update:

**UX**

- Added a comments bar to indicate paused resources are now pinned (
  PR[#3064](https://github.com/concourse/concourse/pull/3064))
- You can now force check a resource from the web UI (PR [#3051](https://github.com/concourse/concourse/pull/3051))

**Core**

- Completed [#2908](https://github.com/concourse/concourse/issues/2908). This is one of the key blocking issues
  preventing us from releasing Concourse 5.0.0
- Picked up [#3013](https://github.com/concourse/concourse/issues/3013) as a way to address the two very clear use cases
  where you might not want it: lots of time resources and resources that use IAM roles
- Picked up the performance test work [#2874](https://github.com/concourse/concourse/issues/2874)

**Runtime**

- In the first issue of many around runtime refactoring, we picked
  up [#3502](https://github.com/concourse/concourse/issues/3052) to break up the responsibilities of containerProvider
