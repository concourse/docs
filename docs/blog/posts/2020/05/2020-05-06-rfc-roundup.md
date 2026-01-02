---
layout: post
title: 'RFC round-up: May 6th, 2020'
date: 2020-05-06
categories:
  - rfcs
---

Howdy, and welcome to our first RFC round-up! 🤠

<!-- more -->

![](assets/2020-05-06-rfc-roundup-01.png)
/// caption
///

For those unaware, [Concourse RFCs](https://github.com/concourse/rfcs#concourse-rfcs) are a process for proposing and
collaborating on improvements to core Concourse functionality, including pipeline behavior, new step types, new operator
capabilities, etc.

In short, RFCs are where all the _cool new stuff_ is planned. 😎

My goal is to provide an update at least every few weeks on the status of RFCs and shepherd them through the process via
blog posts like this one. Each post will be limited to a handful of RFCs in order to focus our energy and not overwhelm
readers.

## RFCs ready to merge

The following RFCs have been given the `resolution/merge` label:

- [RFC #33: archiving pipelines](https://github.com/concourse/rfcs/pull/33) proposes that pipelines can be "archived" -
  effectively a soft-delete, or perhaps a long-pause. This RFC is ready to go, and in fact we've already started to
  implement it. It will be an experimental opt-in feature until this RFC is merged.
- [RFC #34: pipeline instances](https://github.com/concourse/rfcs/pull/34) proposes a mechanism for grouping related
  pipelines together under a single identifier, further breaking down each instance by a set of associated vars.

Both of these RFCs are key components to our plan for Git branch/PR pipeline automation, as described in
the [v10 blog post](../../2019/07/2019-07-17-core-roadmap-towards-v10.md).

Per the [resolution process](https://github.com/concourse/rfcs/blob/master/README.md#resolution), if there are no
objections or significant changes in the 2 weeks after this post is published, they will be merged! 🚀

## RFCs in need of specific feedback

These two RFCs are nearing completion, but have some outstanding questions:

- [RFC #39: var sources](https://github.com/concourse/rfcs/pull/39) is the RFC behind the [experimental
  `var_sources:` feature](../../../../docs/vars.md#var-sources-experimental) introduced in v5.8.0. The main question is
  around whether and how it may be used to replace the cluster-wide credential manager configuration.
- [RFC #31: `set_pipeline` step](https://github.com/concourse/rfcs/pull/31) is mostly implemented already,
  also [shipped experimentally](../../../../docs/steps/set-pipeline.md) in
  v5.8.0. The remaining question is around whether to support `set_pipeline: self` - this is a point of contention as
  there may be a better pattern for that sort of thing in the
  future ([hint](https://github.com/concourse/rfcs/pull/32)).

Lend us your opinions!

## RFCs in need of attention

These ones just need more eyes on'em:

- [RFC #43: task queue](https://github.com/concourse/rfcs/pull/43) proposes a "Resource Pool" mechanism with the end
  goal of fixing the age-old problem of Concourse overloading workers. If you've run into this before and you'd like to
  see it fixed, this is your chance to get involved!
- [RFC #41: OPA integration](https://github.com/concourse/rfcs/pull/41) proposes support for policy enforcement
  through [Open Policy Agent](https://www.openpolicyagent.org/), which would allow access control to be delegated to an
  external OPA endpoint. Neat!

## Wrapping up...

Thanks to everyone who has gotten involved already, and special thanks to the RFC authors for your patience!

Sorry if you had an RFC that didn't make the cut. 😕 We have
a [backlog of 23 RFCs](https://github.com/concourse/rfcs/pulls) at the moment, and I'll be going through all of them
through the next few posts.

Happy trails! 🐎

