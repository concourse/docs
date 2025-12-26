---
title: Concourse Update (April 19–23)
date: 2018-03-23
categories:
  - product-update
---

Hi folks,

Had an interesting week talking to customers about how we might improve their Concourse operations and deployments. More
info on that soon!

<!-- more -->

On to the update:

**UX**

- Fixed an issue with timestamps [#2088](https://github.com/concourse/concourse/issues/2088)

**Core**

- Continued our refactoring of the API to support dex and
  users [#1888](https://github.com/concourse/concourse/issues/1888)

**Runtime**

- Finished the issue around custom resources on tagged workers, it should work
  now [#1371](https://github.com/concourse/concourse/issues/1371)
- Restricted the list of allowed TLS ciphers for more security
  checkboxing [#1997](https://github.com/concourse/concourse/issues/1997)

**Design**

And now, some words from our Product Design team:

> Lindsay Auchinachie and Sam Peinado are continuing work on the Space and Causality features in Concourse.The Space
> features give users the ability to have arbitrary build matrixes within one pipeline and of a resource to solve for the
> pain around people testing many variations/combinations. Causality allows users a view into what is going through the
> pipeline, and how far it has made it through the pipeline. Read the proposals for Spatial Resource Flows and Resource
> Causality Flow on GitHub.  
> This week we shared out our Space framing and talked through feasibility and technical constraints of this with the
> engineering team. Started work on a small Invision with the current Ruby and Git use case. Pairing with engineering next
> week to define additional more complex uses cases for coding a prototype with real pipeline.

