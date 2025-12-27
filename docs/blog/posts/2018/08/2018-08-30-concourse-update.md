---
title: Concourse Update (Aug 27–31)
date: 2018-08-30
categories:
- product-update
authors:
  - jamesma
---

{{< image src="/images/downloaded_images/Concourse-Update--Aug-27-31-/0-39sBwa4rlBwJYlH4.jpg" alt="Photo courtesy of the
CNE" width="100%" >}}

<!-- more -->

Apologies for the break from the usual update schedule; I wanted to get one last update out before I take some personal
time, starting Fri. Aug 31 and coming back Sept 10. In my absence [Scott Foerster](https://medium.com/u/86d0fa097bb9)
and [Alex Suraci](https://medium.com/u/263a63b2f209) will be writing the product update next week. The Concourse team
will also be taking Monday, Sept 3rd off in observance of Labour day as well.

On to the updates:

- Concourse 4.1.0 will be out…soon! We’ve begun the process of accepting all stories and deploying our pre-release
  version onto the internal test environments. If you’re curious as to what new features/bug fixes are coming out in
  this release, you can get an at-a-glace view in our [Milestones page](https://project.concourse-ci.org/milestones).You
  can expect the official release to come out very soon :D
- [Lindsay Auchinachie](https://medium.com/u/84b937bda3b6) wrote another entry in her Concourse UI Explained series;
  this time covering the [Concourse Build page](https://medium.com/@lauchinachie_78613/4f92824c98f1).
- The Concourse mono-repo is coming! You can read more about the change in
  issue [#2534](https://github.com/concourse/concourse/issues/2534). Work on this will continue the moment we release
  4.1.0

**UX**

- Worked on some UI improvements to help users distinguish between teams they belong to vs exposed
  pipelines [#2427](https://github.com/concourse/concourse/issues/2427)

**Core**

- Continued refactoring work on [#2386](https://github.com/concourse/concourse/issues/2386)
- Worked on discussion regarding a PR from GitHub user [edtan](https://github.com/edtan) to resolve
  issue [#2511](https://github.com/concourse/concourse/issues/2511)

**Runtime**

- Since there didn’t seem to be any strong opinions on how we managed log outputting
  in [#2104](https://github.com/concourse/concourse/issues/2104), we’ve decided to move forward with some reasonable
  assumptions.
