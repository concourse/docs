---
layout: post
title: Concourse Update (July 21 2019)
date: 2019-06-21
categories:
- product-update
authors:
  - jamesma
---

The Concourse team had the opportunity to visit some Concourse users out in Montreal last week. We had a blast meeting
everyone, including some folks from the Concourse OSS community. Thanks again for hosting us!

<!-- more -->

I’ll also be in Kansas City for two days next week to meet some other Concourse users as well, so give me a tap
on[Twitter](http://twitter.com/pioverpi) or Discord (username jama) if you wanna meet up.

## Parallel Input Streaming

{{< image src="/images/downloaded_images/Concourse-Update--July-21-2019-/0-ywZaAHKMEtZGTx5c.png" alt="initialization
dropped from 1 hour 22 min to just over 4 min" width="60%" >}}

In addition to the work on [Algorithm](https://github.com/concourse/concourse/issues/3602) improvements from the Core
track, the Runtime track tested out their new work
on [Parallel Input Streaming](https://github.com/concourse/concourse/issues/3992). By parallelizing the input streams we
saw a _massive_ improvement on the initialization of tasks in our test pipelines. In our test we
saw [Dwayne Forde](https://medium.com/u/225055297bdc)’s Strabo pipeline (which has over 100 input resources on a job) go
from a 1 hour, 22 min initialization to just over 4 min. We were able to observe these results on both the BOSH and k8s
deployment of Concourse. Exciting work!

## Runtime Interface Track

For those who are interested, you can follow along our swappable runtimes (including k8s) work in
the [Runtime Interface track](https://github.com/concourse/concourse/projects/16). We’ve been doing a lot of planning
and research, but its all come down to “lets just give it a shot”. We’ll probably have more to say on this next update.

## Release Engineering

One of the big changes that have come out of our Release Engineering track is extracting our ci automation into its own
repository. This was done to make our project more resilient and reusable. You can now track those changes
under [concourse/ci](http://github.com/concourse/ci)

