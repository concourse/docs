---
title: Concourse Update (August 13–17)
date: 2018-08-17
categories:
- product-update
authors:
  - jamesma
---

{{< image src="/images/downloaded_images/Concourse-Update--August-13-17-/1-tElpiP87T2Ee3rXKJP88QQ.gif" alt="Combining
repos for great justice" width="45%" >}}

<!-- more -->

Going to switch things up this week and start with some interesting community news:

- We’ve decided to restructure our repositories to make things more understandable and less scary for
  contributors. [Alex Suraci](https://medium.com/u/263a63b2f209) has laid out a good explainer on why and how we’re
  going to start in
  our [PSA: the Great Code Restructing of 2018](https://discuss.concourse-ci.org/t/psa-the-great-code-restructing-of-2018/543)
- [Lindsay Auchinachie](https://medium.com/u/84b937bda3b6) wrote up a blog post describing some of the visual elements
  of the Concourse pipeline view in a blog post
  titled [Concourse Pipeline UI Explained](2018-08-17-pipeline-ui-explained.md)
- marco-m has been updating a “concourse-in-a-box” formula that comes with a s3-compatible-store and a Vault. Check it
  out here: [https://github.com/marco-m/concourse-ci-formula](https://github.com/marco-m/concourse-ci-formula)
- [concourse-up](https://github.com/EngineerBetter/concourse-up) is a Concourse quick-start tool created created by our
  friends at EngineerBetter. The team there is looking for feedback on how to support the 4.0.0 authentication scheme
  moving forwards. If you use their tool, please take some time to give them some love on their GitHub
  issue [https://github.com/EngineerBetter/concourse-up/issues/62](https://github.com/EngineerBetter/concourse-up/issues/62)
- Is our efforts to have Concourse un-flaky a myth? Find out on this forum post
  by [eedwards-sk](https://discuss.concourse-ci.org/u/eedwards-sk), you won’t believe
  post [#4](https://discuss.concourse-ci.org/t/is-concourses-aim-to-eliminate-snowflaking-just-a-myth/444/4?u=jama)!!

On to some development news:

- We’re still hacking away at
  issue [#2425 “Login session expired” error with multiple ATCs](https://github.com/concourse/concourse/issues/2425).
  Please check in on the story to follow along with our plans for a fix (it involves some migrations)
- Praise be, we fixed the UX regression on the resources page where new resources weren’t being
  highlighted [#2423](https://github.com/concourse/concourse/issues/2423)
- Still refactoring away to make way for [#2386](https://github.com/concourse/concourse/issues/2386) in preparation for
  spaces
- Finished [#2352](https://github.com/concourse/concourse/issues/2352)on Configurable timeout for resource checks. Turns
  out that by fixing that issue we also fixed [#2431](https://github.com/concourse/concourse/issues/2431). We did end up
  making [#2494](https://github.com/concourse/concourse/issues/2494) though in order to break out the specific ability
  to configure a timeout for resource type checks.
- Paused work on [#2104](https://github.com/concourse/concourse/issues/2104) on emitting build logs to an external
  system this week, hoping to pick it back up next week!
