---
title: 'Sneak Peek: Spatial Resources'
date: 2017-11-01
authors:
  - jamesma
---

![](../assets/2017-11-01-spacial-resources.png)

<!-- more -->

If you’ve been paying close attention to our [issues on GitHub](https://github.com/concourse/concourse/issues/) you may
have noticed a small flurry of activity around one specific
issue: [#1707 Spike: spatial resource flows](https://github.com/concourse/concourse/issues/1707).

### What are Spatial Resources Flows (aka Space)?

The first reference to “spatial” resources came up in a proposal
between [Alex Suraci](https://medium.com/u/263a63b2f209) and [Christopher Hendrix](https://medium.com/u/9c1e9edb1d5e)
for Multi-branch workflows ( [#1172](https://github.com/concourse/concourse/issues/1172)). In that issue we focused
specifically on one recurring problem: it’s a real pain to deal with the Git resource when you have multiple branches
representing different streams of work.

Over time we researched similar build paradigms and thought deeply about generalized solutions that would fit nicely
with the Concourse philosophy™:

> Concourse makes it very easy to model changes over time. Resources do this for you; you point them at a given source
> of truth, and it’ll let you know everything that happened.Some workflows, however, can’t just be modeled as change over
> time. Multiple branches of a repo, or pull requests to a repository, are over _space_, not _time_. They are parallel
> pipelines, which today are hard to manage, and impossible to correlate (you cannot fan-in).
> Build matrixes are another example of wanting to run over many spaces (i.e. versions of a product). This can be done
> today, within a pipeline, but results in a massive pipeline with every combination explicitly configured...
> …(a spatial resource) introduces the ability to have arbitrary build matrixes within one pipeline, which should
> dramatically improve the experience for people testing many variations/combinations.

### Would you like to know more?

![](../assets/2017-11-01-spacial-resources-know-more.jpeg)

There’s a few ways you can get involved as the Concourse team continues to build out spaces:

1. Read the proposal for spatial resources on GitHub [here](https://github.com/concourse/concourse/issues/1707). Join in
   on the discussion and ❤️ the proposal if you’re excited to see this happen!
2. We’re building out some common pipeline use cases to test out spaces. You can see our current list of proposals in
   issue [#1766](https://github.com/concourse/concourse/issues/1766). If you’d like to add your own personal experiences
   and pipeline use case, I’d encourage you to add your notes on the issue.
3. Spaces will introduce a lot of new abstractions into the pipeline visualization. We’re still experimenting with the
   visualization of spaces in the pipeline view; and are looking for fresh new ideas on how to visualize this. If you
   have a sketch, a doodle, or even a simple recommendation; drop us a line on
   the [proposal](https://github.com/concourse/concourse/issues/1707)or on our [Slack](https://concourseci.slack.com).
