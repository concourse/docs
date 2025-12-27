---
title: Concourse Update (Nov 19–23)
date: 2018-11-23
categories:
- product-update
authors:
  - jamesma
---

{{< image src="/images/downloaded_images/Concourse-Update--Nov-19-23-/1-fBOnArsQyRfYMLYGB4Uk_w.jpeg" width="50%" >}}

<!-- more -->

It was a relatively light week this week due to some vacations. I did, however, get a chance to do some acceptance work
on our upcoming feature for role-based access control in Concourse. You can read more about how that’ll work in
our [feature preview post](2018-11-23-concourse-rbac-preview.md).

On to the update:

**API**

- Our investigation into the API continues and branches out into more areas of the codebase. If you haven’t already,
  make sure to check out the two related
  RFCS: [https://github.com/concourse/rfcs/pull/14](https://github.com/concourse/rfcs/pull/14)
  and [https://github.com/concourse/rfcs/pull/15](https://github.com/concourse/rfcs/pull/15)

**UX**

- We’ve decided to commit to completing our refactor the Web NavBar before picking up new stories. This’ll hopefully
  prevent regressions when we pick up new stories down the road. We now have over 300 unit tests for our web-ui!

**Runtime**

- Picked up [#2577](https://github.com/concourse/concourse/issues/2577). We’re having conversations internally around
  specific strategies that would help with this. On the one hand, we could try computing resource utilization on the
  first run to inform our future allocations; or we could go with naive container/volume balancing.

**Core**

- Continuing our planning for Spatial resources
