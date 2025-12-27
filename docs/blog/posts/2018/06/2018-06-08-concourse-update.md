---
title: Concourse Update (June 4–8)
date: 2018-06-08
categories:
  - product-update
authors:
  - jamesma
---

![](assets/2018-06-08-concourse-update-01.png)
/// caption
///

<!-- more -->

Big release this week! After lots internal load testing on Wings we finally felt comfortable releasing Concourse 3.14.0.
In addition to the
new [Distributed Garbage Collection](2018-06-04-distributed-garbage-collection.md),
breadcrumbs, responsive groups,
and [Windows worker](https://github.com/concourse/concourse-bosh-deployment/blob/master/cluster/operations/windows-worker.yml),
we have 14 new features a whole bunch of bug fixes. But wait! Don’t download that one;
get [Concourse v3.14.1](https://concourse-ci.org/download.html#v3141) instead.

A few other updates. First, be sure to check out my write up
on [How We Build Concourse](2018-06-06-how-we-build-concourse.md). I plan on writing more
posts like this in hopes of giving you more insight into the internals of the Concourse team. Hope you like it!

And now, on to the update; starting with a note on [RFCs](https://github.com/concourse/rfcs):

## RFCs

- We’re looking for feedback on how to improve our existing implementation of credential management. You can read more
  about it in [issue #5](https://github.com/concourse/rfcs/issues/5).
- The RFC around [Resources v2](https://github.com/concourse/rfcs/pull/1)is moving along with some new changes. Thanks
  to all the reviewers ([itsdalmo](https://github.com/itsdalmo), [cwlbraa](https://github.com/cwlbraa)
  and [dprotaso](https://github.com/dprotaso)). I’d **REALLY** encourage ya’ll to read
  the [full proposal](https://github.com/vito/rfcs/blob/resources-v2/001-resources-v2/proposal.md) and provide your
  inputs; since we’ll be relying on these changes for new features like Spatial Resources.

## UX

- We’re seriously, absolutely, most definitely tacking the slow performance on the build
  page [#1543](https://github.com/concourse/concourse/issues/1543#issuecomment-394449918)
- Spatial Resource testing continues! Here’s a peek at our most recent iteration:
  ![](assets/2018-06-08-concourse-update-02.png)

## Core

- Now that 3.14.1 is out, we’re now ready to rebase and merge in our Users change and prime that for release in 3.15.0.
  Testing begins next week after we finish getting everything merged in
