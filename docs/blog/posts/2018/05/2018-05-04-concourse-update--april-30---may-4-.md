---
title: Concourse Update (April 30 — May 4)
date: 2018-05-04
categories:
  - product-update
---

I’ve gotten some questions about Freedom Friday from some readers after last week’s update. Well it turns out
that[Topher Bullock](https://medium.com/u/58876cdc2180) wrote a great article about it this week; you read up on it
here: [https://medium.com/concourse-ci/freedom-fridays-319204dea834](https://medium.com/concourse-ci/freedom-fridays-319204dea834)

<!-- more -->

We also release [Concourse v3.13.0](https://concourse-ci.org/download.html) earlier this week. Make sure you check it
out if you were hit by the accumulating logs issue introduced in v3.12.0.

On to the update:

## **Space**

We’ve been building out some of the frontend code for representing Spaces as part
of [#2131](https://github.com/concourse/concourse/issues/2131). You can see some of the early visualizations below:

{{< image src="/images/downloaded_images/Concourse-Update--April-30---May-4-/1-K13pFduQtcsPeX3VH6crQQ.png" alt=""
width="100%" >}}
{{< image src="/images/downloaded_images/Concourse-Update--April-30---May-4-/1-_ndF5rSNwVlKJWTj2_vxUQ.png" alt=""
width="100%" >}}
{{< image src="/images/downloaded_images/Concourse-Update--April-30---May-4-/1-kBELwDyhYQwPchw7J-O0eQ.png" alt=""
width="100%" >}}

We now have the capability of testing Space end-to-end i.e. write the yml -\> fly sp -\> check out the web
visualization.

EXCITING

## Distributed GC on Workers

We’ve been hacking away on master issue [#1959](https://github.com/concourse/concourse/issues/1959) for distributed GC.
If you’ve been following along closely you’ll notice that the number of boxes that we’ve checked has increased…and
that’s a good thing! We’re in the final stretches of this work and will be prepping to test them in our internal
Concourse “Wings” very soon

## User Auth

As always, we continue to work on our User Auth master
issue [#1888](https://github.com/concourse/concourse/issues/1888). We’ve now transitioned into building out specific
auth connectors using the [dex](https://github.com/coreos/dex) library. We’ve completed the GitHub and CF connectors,
and are currently working on the generic OAuth provider
