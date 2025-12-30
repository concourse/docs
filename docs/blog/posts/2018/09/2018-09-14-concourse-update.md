---
title: Concourse Update (Sept 10 — Sept 14)
date: 2018-09-14
categories:
- product-update
authors:
  - jamesma
---

![](assets/2018-09-14-concourse-update-01.png)
/// caption
Let us know if you’d be interested in Concourse swag
///

<!-- more -->

Following up from a discussion on our forums [Scott Foerster](https://medium.com/u/86d0fa097bb9) has been looking at
different options for selling Concourse swag online. Do you want Concourse leggings? or maybe a limited edition @vito
pls pillow! Let us know in the
thread [Concourse merchandising](https://discuss.concourse-ci.org/t/concourse-merchandising-t-shirts-and-similar/599/4).

**Please also take some time to fill out our** [**2018 Concourse Community survey
**](https://docs.google.com/forms/u/1/d/e/1FAIpQLScWHuP130rJAcqBJhQtyIUCqbMcY4Qj0beHtfOnWEQugWSuUw/viewform). Your
feedback is really valuable to us and the information you provide will help us plan the future of Concourse. We only
have a handful of responses so far, and we’d like to get more before we publish the results!

On to the update:

**API**

- As a welcome back to [Joshua Winters](https://medium.com/u/d6d52be6c4b0), we took a look
  at [#2463](https://github.com/concourse/concourse/issues/2463) and the possibility of doing an internal redirect for
  all auth components. Unfortunately, that didn’t work quite well. Check out the full issue thread for details
- Remember that[RBAC RFC](https://github.com/concourse/rfcs/pull/6)? Well, we’re going to buckle down and start working
  on that now

**UX**

- Following up on issue [#2427](https://github.com/concourse/concourse/issues/2427), we’re applying the same labelling
  principals to the HD dashboard view in [#2572](https://github.com/concourse/concourse/issues/2572)

**Core**

- Kept hacking away on good ol’[#2386](https://github.com/concourse/concourse/issues/2386)

**Runtime**

- Spiking on [#2581](https://github.com/concourse/concourse/issues/2581), where we ask ourselves “Can we determine when
  a build step fails because the worker is unusable?”

**Operations**

- Continuing on [#2312](https://github.com/concourse/concourse/issues/2312). This issue has exploded a bit to lots of
  edge cases and race conditions; but our determination to finish this issue is strong
- Looked into why
  our [k8s-testflight](https://ci.concourse-ci.org/teams/main/pipelines/main/jobs/k8s-testflight/builds/114) job keeps
  breaking.
