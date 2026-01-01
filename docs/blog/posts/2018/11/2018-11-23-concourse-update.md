---
title: Concourse Update (Nov 19–23)
date: 2018-11-23
categories:
  - product-update
authors:
  - jamesma
---

![](assets/2018-11-23-concourse-update-01.jpg)
/// caption
Happy Thanksgiving to our friends south of the border (Photo
Credit [Alby Headrick](https://www.flickr.com/photos/southernpixel/23289074546/in/photolist-BtYAu3-q8x1pX-hTWTRr-gTSTGs-auoVAv-7jhEyn-5EEWi2-5EJojY-5tDUii-47raPD-3o8xGN-GHHSZB-gEEcBt-dB4VwE-8WkGDU-7jcqUM-aLP9jP-RHagrR-Pb1c9N-Ppgyjr-BoB6Pe-zSatjg-qdvrnN-qaJrx5-pdbCyu-pMAfNx-pno8j4-hV1sy8-e5R6G8-7idV56-PhFa9y-dudEHv-aK4Qwe-7iy9yk-7ihnGQ-DM2Z25-i1qMvD-gzEiHA-AyPATe-pESiNp-ZCDE8x-pgk9pC-8FiHJ-X1wVHb-Y71pfN-JHfzmq-pm9D31-pXexW3-o11Tqn-hU7FjT))
///

<!-- more -->

It was a relatively light week this week due to some vacations. I did, however, get a chance to do some acceptance work
on our upcoming feature for role-based access control in Concourse. You can read more about how that’ll work in
our [feature preview post](2018-11-23-concourse-rbac-preview.md).

On to the update:

## API

- Our investigation into the API continues and branches out into more areas of the codebase. If you haven’t already,
  make sure to check out the two related
  RFCS: [https://github.com/concourse/rfcs/pull/14](https://github.com/concourse/rfcs/pull/14)
  and [https://github.com/concourse/rfcs/pull/15](https://github.com/concourse/rfcs/pull/15)

## UX

- We’ve decided to commit to completing our refactor the Web NavBar before picking up new stories. This’ll hopefully
  prevent regressions when we pick up new stories down the road. We now have over 300 unit tests for our web-ui!

## Runtime

- Picked up [#2577](https://github.com/concourse/concourse/issues/2577). We’re having conversations internally around
  specific strategies that would help with this. On the one hand, we could try computing resource utilization on the
  first run to inform our future allocations; or we could go with naive container/volume balancing.

## Core

- Continuing our planning for Spatial resources
