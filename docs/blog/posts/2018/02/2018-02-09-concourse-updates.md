---
layout: post
title: Concourse Updates (Feb 5 — Feb9)
date: 2018-02-09
categories:
  - product-update
authors:
  - jamesma
---

We spent some time this week wrapping up additional testing on
our [certs management across workers](https://github.com/concourse/concourse/issues/1938). We also put down some of work
on Spaces this week to play around with something fun: a high density dashboard view. A lot of you have been asking us
when Concourse v3.9.0 will be available, and the answer is: very soon!

<!-- more -->

On to the update:

## **Features**

**UX**

- High Density View! Original Git issue [#1899](https://github.com/concourse/concourse/issues/1899) and a demo version
  of it up and running can be found in our [production environment](https://ci.concourse-ci.org/dashboard/hd)
- Merged PR [#227](https://github.com/concourse/atc/pull/227), thanks for the
  contribution [SwamWithTurtles](https://github.com/SwamWithTurtles)!

**Runtime**

- Picked up [#2016 Move TSA beacon operations to ‘worker’](https://github.com/concourse/concourse/issues/2016). We need
  to do this to fix some nasty behaviour we’ve observed in our large scale Concourse
  installation [Pivotal](https://medium.com/u/44756b810893)

**Core**

- Continued breaking out our backend auth systems to use
  Dex [#1888](https://github.com/concourse/concourse/issues/1888), (
  see [#1886](https://github.com/concourse/concourse/issues/1886)for additional background)

## Design Research

- Did some research and prototypes to see what build page commenting would look like and how it would behave in
  Concourse
- Continuing some design prototyping for Concourse brand assets
