---
title: 'RFC round-up: June 10th, 2020'
date: 2020-06-10
categories:
  - rfcs
---

First off: sorry, I immediately failed to keep my target pace for these. 😓 I got wrapped up in a deadline, and since I
alternate weeks between engineering and community duties like this post, when I miss a week for RFC updates the 2-week
interval can quickly turn into 4 or 5.

<!-- more -->

Owing to the missed round-up, and in hopes of burning through the backlog more quickly so that interested contributors
may volunteer for merged RFCs, I'm going to expand the scope of this post to include more RFCs than the last one -
primarily by proposing that we merge ones that are nearly certain for
the [v10 roadmap](../2019/2019-07-17-core-roadmap-towards-v10.md).

## Merged RFCs

- [RFC #33](https://github.com/concourse/rfcs/pull/33) (pipeline archiving)
  and [RFC #34](https://github.com/concourse/rfcs/pull/34) (pipeline instances) have both been merged! 🎉

## RFCs ready to merge

The following RFCs have been given the `resolution/merge` label:

- [RFC #31: `set_pipeline` step](https://github.com/concourse/rfcs/pull/31) is the RFC corresponding to the
  `set_pipeline` step that was introduced experimentally in v5.8. Once this is merged, the step itself will no longer be
  experimental, but there _are_ a couple of experimental features for the step that are now outlined in the RFC - `self`
  and `team:`. These features will result in warnings when used.
- [RFC #40: valid identifiers](https://github.com/concourse/rfcs/pull/40) proposes that we restrict the set of allowed
  characters in Concourse identifiers such as pipeline names, job names, and resource names. Existing pipelines and
  objects will be grandfathered in to ease the transition. _Note: if you're worried about this change you may be
  interested in [RFC #34](https://github.com/concourse/rfcs/pull/34)._
- [RFC #39: var sources](https://github.com/concourse/rfcs/pull/39) is the RFC corresponding to the `var_sources`
  feature, which was also introduced experimentally in v5.8. This feature is a key component to v10 - it unblocks
  spatial pipelines, per-job timed triggers, and per-pipeline credential management configuration.
- [RFC #27: var steps](https://github.com/concourse/rfcs/pull/27) is behind the [
  `load_var` step](https://concourse-ci.org/jobs.html#load-var-step) (shipped experimentally in v6.0), and also
  introduces a `get_var` step which can theoretically be used to implement per-job trigger intervals. This RFC builds on
  the var sources concept described in RFC #39.

Per the [resolution process](https://github.com/concourse/rfcs/blob/master/README.md#resolution), if there are no
objections or significant changes in the 2 weeks after this post is published, they will be merged! 🚀

## RFCs in need of attention

Quite a few RFCs have had some pretty interesting discussions or developments since the last round-up:

- [RFC #36: manual step](https://github.com/concourse/rfcs/pull/36) has had some juicy conversation around how things
  like approval and manual gating in a pipeline should be expressed in a Concoursey way - if you have thoughts on this,
  please chime in!
- [RFC #37: prototypes](https://github.com/concourse/rfcs/pull/37) is the RFC for the "Prototypes" concept introduced in
  the [Re-inventing resource types](../2019/2019-10-15-reinventing-resource-types.md) blog post. The latest revision
  introduces encryption, which will enable Prototypes to implement credential managers. If you are a resource type
  author or if you have a security background, please give it a look!
- [RFC #32: projects](https://github.com/concourse/rfcs/pull/32) now has a pretty radical new question: can Projects
  replace Teams in order to provide more complete cluster config automation? If you've ever had a need for automating
  team configuration, or if you have a thirst for GitOps, this should be a pretty interesting conversation!

## New RFCs

- [RFC #53: configurable build event stores](https://github.com/concourse/rfcs/pull/53) proposes a pluggable
  architecture for build event storage as an alternative to storing them in the database.
- [RFC #59: static configuration](https://github.com/concourse/rfcs/pull/59) proposes a method for configuring Concourse
  with a config file that prescribes the teams and projects, in addition to the regular config that would previously
  have been set in flags or env vars. It also proposes disallowing the use of `fly set-team` at runtime so that the
  config is the source of truth.

## Thanks!

Giving feedback on RFCs is critical to our ability to move forward more quickly and with higher confidence. Any and all
comments and questions we receive are deeply appreciated. Thanks to everyone who's been involved, and thanks in advance
to everyone else! 🙂

(Stay safe!)

