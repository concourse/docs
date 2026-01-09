---
layout: post
title: A renewed focus & community changes
date: 2018-03-29
authors:
  - asuraci
---

Phew, we’ve been busy for the past couple of months! There’s a lot to give y’all an update on.

<!-- more -->

## New website

First off, [check out our new website](../../../../index.md)! We’ve completely redesigned it and redone how we
organize the documentation, in hopes that it’ll be much easier to find what you’re looking for.

We also hope that the new style, language, and tone will feel a bit more inclusive and humble. For example, we got rid
of the “Concourse vs.” section — the effort it took to keep that up-to-date is better spent elsewhere. Use whatever dang
tool you want! Our old site, as pretty as it was, felt a bit too much like we were trying to sell a finished product.

We’ve added an [“About” page](../../../../project/index.md) which provides all the background and motivation you
should need to get a good idea of who we are and what we’re about. There’s also
a [“Contribute” section](../../../../project/index.md) which contains reference material for developers as
well as general guidance. We’re also fleshing out an [“Operation” section](../../../../docs/operation/index.md)
which should help out those who are deploying Concourse for the first time or managing it at scale.

In addition to these new sections, we’ve also consolidated many pages and simplified the organization. There are now
top-level sections for all the “things” you’ll be working with (Pipelines, Tasks, etc.), and each section contains the
schema right up-front with examples to the side. This should make the docs much more effective when used as a reference.

Search is back, and we’ve made a lot better than it was before its unceremonious removal. Try searching “imgrespar” and
you’ll find `image_resource.params`. It’s not full-text, but there’s always Google for that. I tried but it’s pretty 
slow and janky.

## Community platform changes

Along with the new site, we’re changing a few things in an effort to foster a healthier, more collaborative community:

- [There’s a new community forum!](https://discuss.concourse-ci.org/t/welcome-to-the-concourse-community/35) This will
  be a much better format for support, long-form discussion, announcing cool new resource types, and whatever else y’all
  want to talk about.
- [We’re switching from Slack to Discord!](https://discuss.concourse-ci.org/t/join-us-in-discord/34) We hope to have
  this new chat platform be an organized place for contributors to have meaningful discussions, rather than a firehose
  of help requests. There’s still a #need-help channel, but we’d prefer if most support went through the forums instead,
  as persistent threads are much easier to keep tabs on and are much easier to find in Google search results.
- [We’ve got a publicly visible roadmap!](https://project.concourse-ci.org) This is thanks to a tool
  called [Cadet](https://github.com/vito/cadet), which provides visibility into each of our GitHub projects (which are
  normally hidden on GitHub). It also provides a networked view of issues and PRs that helps us identify the “boulders”
  vs. the “pebbles” when it comes to understanding problem spaces to tackle.

## Simpler deployment

We’ve coordinated all this with the launch of 3.10.0, which simplifies how Concourse is deployed. We’ve made it easier
to spin up a single-instance Concourse via the quickstart command, which we’re in turn using for the quick intro on the
front page, via Docker Compose. We also no longer require you to configure an external URL (which was the main obstacle
in the way of a single-command intro).

Instead of documenting four different deployment methods (and scaring away people in the process), we’re focusing on the
concourse binary distribution as the _lingua franca_ on the main site. It’s the most general and assumes the least about
how you want to deploy it. For platform-specific documentation, each GitHub repo will be the source of truth:

- [Concourse BOSH Deployment](https://github.com/concourse/concourse-bosh-deployment)
- [Concourse Docker](https://github.com/concourse/concourse-docker)
- [Concourse Helm Chart](https://github.com/kubernetes/charts/tree/master/stable/concourse) (official soon)

These repos are linked to by the [“Download” page](https://concourse-ci.org/download.html) as their own platform
alongside the binaries, so they should feel just as official, while not feeling like a necessary mental hurdle for
beginners.

## HALP

Lastly, I want to apologize for the recent slowdown in processing pull requests. I’ve been pretty focused on getting all
this out there, and it’s definitely taken away from my other duties.

I hope that with our continued focus on community building in 2018, more of these responsibilities can be shared among a
broader, stronger network of contributors. If you’re interested in stepping up and helping out in a meaningful way, let
us know early and we can help! That’s part of the reason for introducing Discord and the forums.

We’re still figuring things out, and hope to provide more structure to the contribution process for those who need it,
but a conversation is a great start.

As always, thanks everyone for your patience and support.

Alex
