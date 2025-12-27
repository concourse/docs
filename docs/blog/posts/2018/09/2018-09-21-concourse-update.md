---
title: Concourse Update (Sept 17–21)
date: 2018-09-21
categories:
- product-update
authors:
  - jamesma
---

{{< image src="/images/downloaded_images/Concourse-Update--Sept-17-21-/1-7EmboSXNrRcSwtYmV9WSLQ.jpeg" alt="
wiltshirespotter" width="50%" >}}

<!-- more -->

[Concourse 4.2.0](https://concourse-ci.org/download.html#v420)
and [Concourse 4.2.1](https://concourse-ci.org/download.html#v421) were released earlier this week. There’s a lot of
great fixes and features in this new release, so please upgrade now!

Reminder that [The Great Project Restructuring of 2018](https://github.com/concourse/concourse/issues/2534) is now
underway. You’ll notice that all our submodules (e.g. ATC, TSA fly)are now all under the root level of
the [concourse/concourse](https://github.com/concourse/concourse) repo. Its cleaner.

You’ll also notice that the BOSH spec has moved from its usual place. We’ve separated out the BOSH release code into its
own repo under [concourse-bosh-release](https://github.com/concourse/concourse-bosh-release). As always, you can find
examples of how to use the BOSH release
under [concourse-bosh-deployment](https://github.com/concourse/concourse-bosh-deployment).

_Edit:_ I forgot to mention that Concourse user [danhigham](https://github.com/danhigham) wrote an awesome Atom plugin
for Concourse. Give the [concourse-vis](https://github.com/danhigham) plugin a spin and show him some love!

Finally, please take some time to fill out
the [2018 Concourse community survey](https://docs.google.com/forms/d/e/1FAIpQLScWHuP130rJAcqBJhQtyIUCqbMcY4Qj0beHtfOnWEQugWSuUw/viewform).
We’re at 80 responses right now and hoping to hit 100 before we publish the results!

On to the update:

**API**

- RBAC IS COMING! Team is working away at implementing our first iteration of fine grained role based access control.
  You can read the details about this work in the
  RFC [here](https://github.com/pivotal-jwinters/rfcs/blob/proposal/rbac/03-rbac/proposal.md).

**UX**

- More UX polish and refactoring, specifically we’re trying to merge the HD dashboard logic with the normal dashboard
  logic. A lot of that work is hidden in [#2572](https://github.com/concourse/concourse/issues/2572)

**Core**

- [#2386](https://github.com/concourse/concourse/issues/2386)is close to completion! Hurray. Applying some final
  polishes before shipping it. You’re gonna love it.

**Runtime**

- Finished [#2586](https://github.com/concourse/concourse/issues/2586), which should make things more efficient
- Made progress on [#2588](https://github.com/concourse/concourse/issues/2588). Completed the GC container portion and
  will re-apply the same logic on the volumes portion

**Operations**

- Issued PR [#7804](https://github.com/helm/charts/pull/7804) against the Concourse Helm Chart, which refactors the
  values.yml to better map Concourse binary commands in the Helm Chart
