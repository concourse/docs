---
title: Concourse Update June 7
date: 2019-06-07
categories:
- product-update
authors:
  - jamesma
---

...and we’re back! Apologies for the lack of updates lately. I’ve just come back from some time off and work travel has
taken up a lot of my time. I’m back in Toronto now so let’s get back into it.

<!-- more -->

## Release Engineering & Concourse 5.3.0

In the past, we relied _a lot_ on [Alex Suraci](https://medium.com/u/263a63b2f209) to handle a lot of our release
engineering work. Release Engineering is incredibly important and valuable work for the Concourse team, but it can also
very time consuming. Thankfully, the UX track has volunteered some of their time to spin up our
new [Release Engineering track](https://github.com/orgs/concourse/projects/36) of work to help alleviate Alex from some
of his responsibilities. This means a short-term slowdown in the throughput of the UX team, but we think its well worth
the tradeoff.

On that note, you can now follow along with our release plans for Concourse 5.3.0 by tracking
our [project note](https://github.com/orgs/concourse/projects/36#card-22467664). Unfortunately, we were mostly blocked
on some metrics instabilities in our [production instance](https://ci.concourse-ci.org/) this week. Those issues have
been mostly cleared up and we hope to be able to continue with our production and wings tests next

## Core/API

The team’s been making a lot of progress on two key issues:

- [The Algorithm™](https://github.com/concourse/concourse/issues/3602)
- [Resource check queue](https://github.com/concourse/concourse/issues/3788)

The team has been doing some preliminary performance tests with the new Algorithm and the results so far have been very
promising. We’ll be reporting more details on the performance improvements in the coming weeks; so keep an eye out for
that!

## Runtime

[Ephemeral check containers](https://github.com/concourse/concourse/issues/3424) is back! We’ve deployed our changes
as-is on our test environment and are monitoring it for lower container counts in our environments

[Parallel Input Streaming](https://github.com/concourse/concourse/issues/3992) was picked up by Krishna today, its
amazing and there’s totally lots of detail to be found on the linked issue.

## K8s + Concourse == Koncourse?

We have two RFCs in flight, please take some time to read through the changes:

- Exploring [Initial Run/Store interface](https://github.com/concourse/architecture-rfcs/pull/1): In order to port
  Concourse on to non Garden/Baggageclaim runtimes (including Kubernetes!) we need to separate the two concepts of
  containers as the unit of execution and volumes as the unit of storage. We’re fleshing out the interface that these
  components can implement in this RFC.
- [Extract Core Resource Types](https://github.com/concourse/rfcs/pull/30): a proposal to not ship bundled base resource
  types with concourse. The change would require Concourse to pull the base resource types on-demand at runtime. This is
  required for moving establishing a more generic storage interface.

You’ll also note that we’ve created a architecture-rfcs repo. This repository is reserved for internal RFCs that should
not directly impact a Concourse user.

## Duty Free

The proposal for a Concourse “Duty Free” was first reported
in [issue #191](https://github.com/concourse/concourse/issues/191); its the idea of creating a separate site to
highlight community resources and other re-usable Concourse artifacts for our community. Today, advertise Concourse
resources through the [Resources page in our wiki](https://github.com/concourse/concourse/wiki/Resource-Types), but a
dedicated Concourse Duty Free site would have a lot more pizzaz.

We’ve always wanted to build Duty Free but we were never been able to figure out how to slot it into our work schedule.
Thankfully, the Pivotal team out in Dublin had some time and offered to help kick-start the project for us. We’re still
in the very early stages of development and design, but you can follow along the project on their GitHub repo
here: [concourse/dutyfree](https://github.com/concourse/dutyfree)
