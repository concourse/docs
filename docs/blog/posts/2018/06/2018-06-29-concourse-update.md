---
layout: post
title: Concourse Update (Jun 25–29)
date: 2018-06-29
categories:
  - product-update
---

{{< image src="/images/downloaded_images/Concourse-Update--Jun-25-29-/1-eGvw-f2AjgJvsWN9pdikBg.gif" alt="" width="
25%" >}}

<!-- more -->

If you’ve been following along with our [Auth changes](https://medium.com/concourse-ci/oh-auth-f4fe68438171), you’ll
know that we’ve been doing a lot of work behind the scenes to make the upgrade into this new world as seamless as
possible. This week, we were able to do our first large-scale upgrade test against our Wings instance. The upgrade went
well and we were able to find a few more areas of polish before we push this feature. You can find our updated list of
future incompatibilities in GitHub issue [#2218](https://github.com/concourse/concourse/issues/2218). Having considered
the nature of the breaking changes, the next update of Concourse with Users will push us
into[4.0.0](https://github.com/concourse/concourse/issues/2218#issuecomment-401078612)!!!

I also wanted to take this time to give a big **thank you** to all of the participants in our spatial resource
interview. If you’re curious to see the results of our research please read up
on [Lindsay Auchinachie](https://medium.com/u/84b937bda3b6)’s post
here:[Designing for Space in Concourse](https://medium.com/concourse-ci/designing-for-space-in-concourse-3037344644c6)

If you’d like to get your hands on Space as soon as possible, then I’d encourage you to also read and comment on our
Resources v2 [RFC](https://github.com/concourse/rfcs/pull/1). [Alex Suraci](https://medium.com/u/263a63b2f209) made some
recent updates to the proposal so
definitely [check it out](https://github.com/concourse/rfcs/pull/1/files/3bc00098143d7f1d59c7c25b8614ddc545a05d81), or
read the [fully rendered proposal](https://github.com/vito/rfcs/blob/resources-v2/01-resources-v2/proposal.md).

We’d like to get the Resources v2 RFC closed out soon so we can implement the resource changes necessary to tap into the
full potential of spatial resources!

Some other updates:

- We fixed a known issue [#2300](http://ourse/issues/2300) with the 3.14.x series whereby users noticed a significant
  increase in CPU usage when connecting with CredHub. This has now been fixed
- Increased pipeline stability and fixed some flakes with our UI tests in topgun
- Fixed an [issue](https://github.com/concourse/concourse/issues/2313) where the auth token is shown in the address bar
- Picked up additional pipeline work by adding integration
  for [web PRs](https://github.com/concourse/concourse/issues/2305)

_Edit_

I ALMOST FORGOT! We also improved build page performance [#1543](https://github.com/concourse/concourse/issues/1543)! In
some instances we reduced the page load time from 25s to only 5s:

{{< image src="/images/downloaded_images/Concourse-Update--Jun-25-29-/1-KEWandpQWRWRFcBvLRwbog.jpeg" alt="" width="
100%" >}}