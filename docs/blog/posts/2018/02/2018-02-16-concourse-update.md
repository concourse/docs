---
layout: post
title: Concourse Update (Feb 12–16)
date: 2018-02-16
categories:
  - product-update
authors:
  - jamesma
---

If you haven’t heard the news by now, we released Concourse v3.9.0 this week 🎉🎉🎉! Two of the top-line features in this
release are:

<!-- more -->

- Concourse will now automatically propagate certificates from the worker machine into resource containers (GH
  issue [#1027](http://github.com/concourse/concourse/issues/1027))
- Improved btrfs volume driver stability. So if you’re getting hit hard by overlay weirdness, I’d suggest you give the
  btrfs driver another shot!

To find out what else we’ve packed into this release, I’d encourage you to read the full release notes on
the [concourse.ci/downloads](https://concourse-ci.org/downloads.html#v390) page!

On to the update...

## **Features**

**UX**

- Started to look at slow page-load times on the web-ui. The team identified that a large source of the pain came when
  we introduced timestamps last year. We’ve since been able to drastically improve the load times on that
  page [GH issue 1912](https://github.com/concourse/concourse/issues/1912)

**Runtime**

- As I mentioned last week, the Concourse team runs a relatively large installation of Concourse that is used by Pivotal
  employees for internal projects. As a result of running this giant Concourse, we’ve discovered that our Garbage
  Collector needs significant improvement in order to keep up with the workloads that we’ve been observing. GH
  issue [#2016](https://github.com/concourse/concourse/issues/2016) has been consuming a lot of our thoughts and
  feelings this week.

**Core**

- Same as last week: continued breaking out our backend auth systems to use
  Dex [#1888](https://github.com/concourse/concourse/issues/1888), (
  see [#1886](https://github.com/concourse/concourse/issues/1886)for additional background)
- ^^ Refactoring our complex backend to support individual auth is going to take some time, and we recognize that :)

## Design Research

We’ve picked up design research work on Spatial Resources
again. [Lindsay Auchinachie](https://medium.com/u/d3a12206d051) and [Sam Peinado](https://medium.com/u/8a529ac5b818) are
currently exploring different ways to visualize the (potentially) dense permutations and combinations of work.

