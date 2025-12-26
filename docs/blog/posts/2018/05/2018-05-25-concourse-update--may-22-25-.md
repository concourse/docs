---
title: Concourse Update (May 22–25)
date: 2018-05-25
categories:
  - product-update
---

It was a short week for us here in Canada, but we had a few interesting updates:

<!-- more -->

- We attempted to deploy our [distributed GC changes](https://github.com/concourse/concourse/issues/1959) to our
  internal environment “Wings” last Friday. Turns out that was an incredibly bad idea. The deployment failed
  horrifically and we had to roll back all our changes. We’re still investigating why our code worked in
  our [“prod” environment](https://ci.concourse-ci.org/) but failed when deployed onto Wings. We’re tracking this work
  in issue [#2202](https://github.com/concourse/concourse/issues/2202).
- Our team conducted our first round of interviews on Spatial resources with Pivots in the Toronto office. We’re getting
  a lot of interesting feedback and are making tweaks for next week’s batch of interviews
- In the mean time, we managed to work through some design snacks, addressing the lack
  of [breadcrumbs](https://github.com/concourse/concourse/issues/2139)
  and [responsive design on groups](https://github.com/concourse/concourse/issues/2130).
- Investigated migration paths forward with the new dex auth. Keep an eye on
  issue [#2218](https://github.com/concourse/concourse/issues/2218) for more information on future incompatibilities
  with this upgrade!
