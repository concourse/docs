---
title: Concourse Update (Sept 03 — Sept 07)
date: 2018-09-07
categories:
  - product-update
authors:
  - sfoerster
  - asuraci 
---

![](assets/2018-09-07-concourse-update-01.jpg)
/// caption
“Disco” Dirk Nowitzki approves of release 4.1
///

<!-- more -->

Howdy, Concourse community. [James Ma](https://medium.com/@jama.22) is still enjoying his much deserved time off, so I
will be taking over the weekly update today with an assist from [Alex Suraci](https://medium.com/@alexsuraci). Short
week for the Concourse team with the office closed for Labour Day on Monday, but there was still a lot happening.

Here’s what we’ve been up to:

## Concourse 4.1.0

As promised in last week’s update, [Concourse v4.1.0](https://concourse-ci.org/download.html#v4.1.0) was officially
released last Thursday afternoon. The release had a bunch of valuable pull requests from the community, which was great
to see. While the core team were mostly focused on fixing bugs, the community contributed a lot of the key features
within the release. Expect 4.1.1 out early next week with more fixes.

## UX

* Started on an update that allows users to insert a token manually during login when running ‘fly’ from a remote
  shell [#2464](https://github.com/concourse/concourse/issues/2464)
* Continued on a design enhancement to prioritize pipelines from teams a user belongs to over publicly exposed pipelines
  within the Concourse dashboard [#2427](https://github.com/concourse/concourse/issues/2427)

## Core

* Continued ahead on [#2386](https://github.com/concourse/concourse/issues/2386)
* We’re working on extracting the migration library which was introduced in 4.1.0 into a separate package that we can
  support for open source.

## Runtime

* Mostly completed effort on a feature to emit build logs to an operator configured syslog
  destination. [#2104](https://github.com/concourse/concourse/issues/2104)