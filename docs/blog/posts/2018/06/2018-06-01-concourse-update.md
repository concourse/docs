---
title: Concourse Update (May 28 — June 1)
date: 2018-06-01
categories:
  - product-update
---

{{< image src="/images/downloaded_images/Concourse-Update--May-28---June-1-/1-kJxF-3MOSqElyItFT2ec-A.png" alt="" width="
100%" >}}

<!-- more -->

If you’ve been experiencing “Aw Snap” errors on Chrome with Concourse 3.13.0 or 3.12.0 we traced the root case to two
lines of CSS. This seems to happen only on Chrome 67; so a temporary workaround is to switch over to
Chrome [canary](https://www.google.com/chrome/browser/canary.html) or use Firefox/Safari/Edge. You can follow along in
our discussion at GitHub issue [#2236](https://github.com/concourse/concourse/issues/2236)

Now, on to the update

**Runtime**

We were able to successfully test our distributed volume GC collection code on our Wings environment this week. Overall
we’ve seen a significant drop in Database Queries and a ~10% decrease in Web CPU usage.

{{< image src="/images/downloaded_images/Concourse-Update--May-28---June-1-/1-GfBC0PNc6p2DOiGAbcxKnA.png" alt="" width="
100%" >}}
{{< image src="/images/downloaded_images/Concourse-Update--May-28---June-1-/1-n8Ea93MfUmDIGaPLtdU37Q.png" alt="" width="
100%" >}}

Notice how the Database Queries now look like a sawtooth; this is a result of our new “mark and sweep” GC strategy on
workers.

**Core**

In an effort to make our new Users work backwards compatible and downgrade-able, we spent a good chunk of this week
figuring out down-migrations. The conversation around this, and the compromises we’ve had to make can be found in Josh’s
follow up comment [here](https://github.com/concourse/concourse/issues/1888#issuecomment-392958566)

**UX**

{{< image src="/images/downloaded_images/Concourse-Update--May-28---June-1-/1-VzHW0teV3e1DfrqcYWc_-w.png" alt="" width="
100%" >}}

Check out the new breadcrumbs and responsive groups on our [prod environment](https://ci.concourse-ci.org/)!

We’re still looking for users who would be interested in testing out our new spatial resources view! **Please reach out
to me over Twitter or @jma on Discord if you’re interested!**

