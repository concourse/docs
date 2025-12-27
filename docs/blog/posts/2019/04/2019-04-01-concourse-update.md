---
title: "Concourse Update (\U0001F937-April 1, 2019)"
date: 2019-04-01
categories:
- product-update
authors:
  - jamesma
---

{{< image src="/images/downloaded_images/Concourse-Update-----April-1--2019-/1-Z49uzJr_wqYlpCGLBpnoXQ.jpeg" alt="Some
airport somewhere... waiting" width="50%" >}}

<!-- more -->

Phew, it’s been a while since I last wrote an update. For some background behind why I slowed down, hop on over to this
thread on our
forms: [“What would you like to see on our blog”](https://discuss.concourse-ci.org/t/what-kind-of-topics-would-you-like-to-see-on-our-blog/1222/8).

That said, I _do_ have a lot of interesting updates to share, so let’s get started

## Concourse 5.0.0

In case you missed it, [Concourse 5.0.0](https://concourse-ci.org/download.html#v500)
and [5.0.1](https://concourse-ci.org/download.html#v501) came out a few weeks ago in March. This is a major version
release with tons of new features, including:

- Role Based Access Control
- Global Resource Cache
- fewest-build-containers placement strategy
- Resource pinning
- Inputs on the put step of a pipeline
- UI tweaks
- and [much much more](https://concourse-ci.org/download.html#v500)!

Be warned, there are some breaking changes in this release as well; so make sure you
read [all](https://concourse-ci.org/download.html#v500-note-1) [of](https://concourse-ci.org/download.html#v500-note-2)[the](https://concourse-ci.org/download.html#v500-note-3) [release](https://concourse-ci.org/download.html#v500-note-4) [notes](https://concourse-ci.org/download.html#v500-note-5) [before](https://concourse-ci.org/download.html#v500-note-6)
you upgrade!

You’ll also notice that we recently gave the [Concourse homepage](https://concourse-ci.org/)a small makeover as well.
We’ve tightened up the navigation and expanded some sections of of our docs, check it out:

- Expanded docs on[Credential Management](https://concourse-ci.org/creds.html) with Vault and AWS SSM
- More info on the new [Container Placement](https://concourse-ci.org/container-placement.html) strategies
- A primer on the new [Global Resources](https://concourse-ci.org/global-resources.html) feature
- Our spiffy new [Examples](https://concourse-ci.org/learning.html#examples) section, which gives you a side-by-side
  comparison of a pipeline and the yml that made it

## Interesting Blog Posts

There’s also been some interesting blog posts about Concourse from around the interwebs…and not all of them were written
by me!

- [An Overview of Authorization in Concourse 3, 4 and 5](https://medium.com/concourse-ci/an-overview-of-authorization-in-concourse-3-4-and-5-7128cca36194)
  is a useful overview of auth across 3 major versions of Concourse
- [Installing Concourse 5.0 on Kubernets using Helm](https://medium.com/concourse-ci/installing-concourse-5-0-on-pivotal-container-service-using-helm-9f20e4e1b8bf)
  is a great two-part overview of getting PKS installed and using the Concourse helm chart
- [Building Go code, with and without Go modules, with Concourse](https://www.orsolabs.com/post/building-go-code-with-concourse/)
- Aptomi described how to
  do [CI/CD for Knative serverless apps on Kubernetes with Concourse](https://medium.com/aptomi/ci-cd-for-knative-serverless-apps-on-kubernetes-with-concourse-54bafef51767)
- Concourse-Up is now renamed
  to [“Control Tower”](http://www.engineerbetter.com/blog/concourse-up-renamed-to-control-tower/)
- Someone compared us to Drone.io
  in [CI/CD tool showdown pits adoptability vs. adaptability](https://searchsoftwarequality.techtarget.com/tip/CI-CD-tool-showdown-pits-adoptability-vs-adaptability)
- We got a mention
  on [PorscheDev’s Technology Radar vol 2](https://medium.com/porschedev/technology-radar-vol-2-4833fb31e2fd) (I think
  they like us :D)

## Concourse Swag

<figure class="kg-card kg-image-card"><img src="/assets/images/downloaded_images/Concourse-Update-----April-1--2019-/1-7Ox9ZUESMtTgP-wCg5gaww.png" class="kg-image" alt loading="lazy"></figure>

We have swag! With the help of the team at Pivotal we’ve listed our first Concourse-branded sweater under
the [official Pivotal apparel store](https://store.pivotal.io/collections/all-products/products/pivotal-unisex-crewneck-sweatshirt).
A few notes:

- The sweaters themselves are listed at-cost, so we’re not making any profit off of them
- Apologies to anyone who’s not in the United States because international shipping through this store is _atrocious_.
  We’re going to be working with our partners to see if we can find a better shipping solution.
- At the time of this writing we’re relatively low on M and L sweaters, there’s a new shipment of those sizes coming in
  soon so the store should be updated in a week or so
- Once this batch of sweaters sell out we’ll be planning on doing new designs to keep things fresh!

## Concourse IRL

The Concourse team will be attending CF Summit NA 2019 this week in Philadelphia, so come by the Pivotal booth and say
hi to the team!

I’ll also be attending a the ConcourseCI Bay Area User Group meetup on April 11th in Palo Alto. The title of the meetup
is [“Kubernetes Deployments with Concourse CI and Spinnaker”](https://www.meetup.com/concourse/events/259904171/). Come
check it out if you’re in the bay area!

## Milestones and Interesting RFCs

[Alex Suraci](https://medium.com/u/263a63b2f209) has been experimenting with re-organizing our backlog of epics by using
the GitHub Projects feature. You can see our current list of epics in the
concourse/concourse[project list](https://github.com/concourse/concourse/projects). The big things we’re working on are:

- Spatial Resource
- API refactoring
- Ephemeral check containers (Runtime)
- and Concourse + K8s runtime

On the topic of k8s runtime situation, please take a second to
review [Topher Bullock](https://medium.com/u/58876cdc2180)’s
new [RFC #22 How Do We Best Leverage K8s as Runtime?](https://github.com/topherbullock/rfcs/blob/e4a80f902bc835b2d528a7550b427bfa83a5660d/008-k8s-runtime/proposal.md).
The team is evaluating Concourse + [Tekton CD](https://github.com/tektoncd/pipeline) vs Concourse + K8s our own way.

## Thanks to our Community 🙏

Finally, I wanted to give shout outs to our growing community of Concourse fans and followers. In early 2019 the
Concourse team made two changes to our contributor workflow: we switched over to a looser Contributors License
Agreement (CLA) and the core team moved towards a PR-based workflow. Since then we’ve seen a lot more engagement on the
work that we’ve doing, and we’ve also started to see a lot of new PRs coming in!

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/assets/images/downloaded_images/Concourse-Update-----April-1--2019-/1-mPK8DgHmIv36A0Z6pNebjg.png" class="kg-image" alt loading="lazy"><figcaption># of PRs opened over time against concourse/concourse and other key resources</figcaption></figure>

In 2018, we saw 263 PRs opened against concourse/concourse and its core resources. As of today we already have more than
160 PRs opened by non-Pivots! Some notable PRs that I wanted to

- [#3580 Add parallel Step](https://github.com/concourse/concourse/pull/3580)
- [#3163 [POC] Super nasty rendering of jobs that needs manual triggering](https://github.com/concourse/concourse/pull/3163)
- [#3560 Time based retention for build log collector](https://github.com/concourse/concourse/pull/3560)
- [#3430 Default the target if there is exactly one](https://github.com/concourse/concourse/pull/3430)
- [#3577 Auditor](https://github.com/concourse/concourse/pull/3577)
- [#3398 Make values starts with https or http clickable in build](https://github.com/concourse/concourse/pull/3398)
- [#3579 Display Task Duration on Finished Tasks](https://github.com/concourse/concourse/pull/3579)
- [#3475 web: add pause button to top bar of pipeline view](https://github.com/concourse/concourse/pull/3475)
- [#3248 Add option to prune all stalled workers instead of just one at a time](https://github.com/concourse/concourse/pull/3248)

## The Future of Weekly Updates

I’ll do my best to resume the weekly cadence of the project updates. In the meantime, if you have any specific opinions
on what kind of blog posts we should right, I’d suggest you check out this thread on our
forums: [“What would you like to see on our blog”](https://discuss.concourse-ci.org/t/what-kind-of-topics-would-you-like-to-see-on-our-blog/1222/8)

