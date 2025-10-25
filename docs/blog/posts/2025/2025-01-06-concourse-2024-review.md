---
title: Concourse 2024 in Review
date: 2025-01-06
authors:
  - taylorsilva
---

Hey Concourse community, it’s been a while since a blog post was made. My name is Taylor Silva and I’m the current lead
maintainer of the project. I have fallen into this role for historical (was on the Concourse team at Pivotal starting in
2019) and personal reasons (still using Concourse at my day job). I really like using Concourse and I haven't found
another tool that works as well as Concourse does, that's why I've stuck around.

<!-- more -->

This post isn't about me though, it's about the project and what's happening with it. I'm going to talk about the last
year of the project to recap where the project is at. Then I'll discuss where I see the project going over the next
year.

## Concourse is 10 Years Old!

The [first commit](https://github.com/concourse/concourse/commit/e3cb2182bb1523718f65714d0c20e176572726a9#diff-c693279643b8cd5d248172d9c22cb7cf4ed163a3c98c8a3f69c2717edd3eacb7)
for Concourse was made April 13th, 2014. That's over 10 years ago! Not sure how all that time flew by, but I guess it
means Concourse is "legacy software", especially on the timescale of the internet. Concourse is well on its way to
getting its pilot license, only four more years to go (
in [Canada](https://tc.canada.ca/en/aviation/licensing-pilots-personnel/flight-crew-licences-permits-ratings/general-information-pilot-licences-permits)
at least).

Concourse has changed so much over the years. Overall I would say Concourse's development has been about slow and
thoughtful improvements. I think it's paid off well so far for the project and will continue to do so in the future.
There are a lot of exciting things we can still add onto Concourse, and I think there are a lot of existing things we
can continue to refine and improve.

## v7.12.0

2024 was a very slow on the release front. We had one Minor
release, [v7.12.0](https://github.com/concourse/concourse/releases/tag/v7.12.0) and two earlier patch releases for
v7.11.0.

There was quite a bit of turbulence this year in Concourse's development. Broadcom has unfortunately scaled down the
engineering time they dedicate towards Concourse. I picked up the slack mid-way through the year and got v7.12.0 pushed
out. I was able to get Broadcom to reaffirm their commitment to providing the infrastructure
behind [ci.concourse-ci.org](https://ci.concourse-ci.org/).

There weren't many features added in v7.12.0. I think the biggest one that's worth shouting out is IPv6 support being
added by Qjammer in [#8801](https://github.com/concourse/concourse/pull/8801). This feature only works for the
Containerd runtime. This feature is a big push in making sure Concourse is future-proofed as more people build out
networks with IPv6 or dual-stack setups.

## Project Leadership

Overall it kinda sucked how little development happened this year. Lots of folks where posting messages on GitHub and
Discord, asking what was going on with the project. There's definitely been a leadership gap since
Alex ([vito](https://github.com/vito/)) left Pivotal/VMware, and therefore the project. (Please don't message him about
Concourse stuff, he's moved on to other things).

Earlier this year I decided I would try to start filling that leadership gap. This was hard for me do while working a
full-time job, but I was able to push out v7.12.0 using my evenings and weekends. It was rewarding but also very
draining. I learned that I could not do my full-time job and properly steward Concourse at the same time. Concourse is
too large of a project to manage in one's spare time.

My reward for pushing out v7.12.0 is that I got people seeing me as the leader of the project. Yay! Goal accomplished!
This lead to people in the community reaching out to me and one group came to me with an interesting offer, which I'll
talk about more in a bit.

## Concourse in 2025

Where is Concourse going in 2025?

Right now I'm planning to focus my efforts on refining what we have right now. There are some annoying bugs that I'd
like to get fixed, and PR's I want to merge in. I've updated the milestones to reflect what I'm
prioritizing: [https://github.com/concourse/concourse/milestones](https://github.com/concourse/concourse/milestones)

There might also be a v8 release this year to bundle together some larger changes, like changing the default worker
runtime to containerd. There's also a milestone for this.

I am also going to declare **Issue Bankruptcy**. There are over 700 issues in the
main [concourse/concourse](https://github.com/concourse/concourse/) repo which is completely unmanageable. I want to get
the number of open issues down to less than 100. I will keep more recent ones open and anything that's an obvious
feature request or bug that could reasonably be done open as well. If I can't grok the issue within a few seconds of
looking at it, it's getting closed.

I also really want to get an ARM64 version of Concourse officially built. The work on this has already been started by
Rui, I just need to pick up the thread from where he left off. I am very confident that we will have official ARM64
builds this year!

Now you might be wondering:

> *
*_Taylor, you just said you can't do your full-time job AND steward Concourse at the same time. How will you find time
for all of this?!_**

My answer to that is: I'm not doing both. I quit my job. I'm doing Concourse full-time.

Hooray, problem solved, everything is good now, Concourse has a full-time maintainer again!

Okay, of course this problem is not fully solved. How am I going to afford to live?!

## A "Concourse" Company

Some folks in the community reached out to me offering to try starting a company centered around Concourse. I of course
said yes! Right now we are a small, dedicated team with a combined 10+ years of experience running Concourse clusters
both small and large. The goal of this commercial venture is to advance and sustain then open-source Concourse project.
We think Concourse is still the best CI/CD tool out there and that we can make a compelling commercial offering around
it.

~~If your company may be interested in what a "Concourse" company has to offer then please share your email with us
here: LINK REMOVED~~

> **May 2025 Update** - If you're looking for someone to run a managed Concourse (SaaS) for you please reach out to the
> folks at [CentralCI](https://centralci.com/). If you're looking for commercial support for your on-premise Concourse
> please reach out to [Pixel Air](https://pixelair.io/).

One last thing I want to mention about this company we're building, because it's important to us, is that we are not
taking any kind of VC funding. We are not creating a company that will be focused on "growth at all costs". Our focus
will be on developing the product (Concourse) and using the product to solve CI/CD problems for customers, and finally
catching up to the rest of the CI/CD world with a managed/SaaS version of Concourse. We want to build a sustainable
business. We are not building a business to eventually sell; we are building a business that will advance and sustain
Concourse and the entire community surrounding it.

## 2025

So that's everything about the project right now. If you have any thoughts or comments you can leave them in the
discussion thread for this blog
post: [https://github.com/concourse/concourse/discussions/9048](https://github.com/concourse/concourse/discussions/9048)

Here's to a better 2025 ✈️🥂
