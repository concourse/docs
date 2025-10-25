---
title: Concourse Updates (Jan 29 — Feb 2, 2018)
date: 2018-02-02
categories:
- product-update
---

As a Product Manager at Pivotal, one of my responsibilities is to write weekly updates to let Pivots know what the
Concourse team has been up to for the past week. When the Concourse team got together earlier this month for our 2018
planning, we decided that we should be sharing these updates with our community as a whole. So, without further ado,
here’s our first update of 2018!

<!-- more -->

## Features

**UX**

- Fixed [https://github.com/concourse/concourse/issues/1978](https://github.com/concourse/concourse/issues/1978)
- We gave a shot at doing lazy-loading and pagination of builds, but it didn’t work very well. Reverting in lieu of some
  more UX research on that
  page [https://github.com/concourse/concourse/issues/1855](https://github.com/concourse/concourse/issues/1855)

**Core**

- Currently looking for additional feedback on use-cases for Spatial Resources. If you have an opinion on this, **PLEASE
  ** jump on this issue and
  comment: [https://github.com/concourse/concourse/issues/1766](https://github.com/concourse/concourse/issues/1766)
- Continued work on refactoring auth providers model in preparation for Users in Concourse.
  See [https://github.com/concourse/concourse/issues/1991](https://github.com/concourse/concourse/issues/1991)
  and [https://github.com/concourse/concourse/issues/1888](https://github.com/concourse/concourse/issues/1888)

**Runtime**

- Wrapped up work on “Bind-mount certs to resource containers at
  `/etc/ssl/certs`"[https://github.com/concourse/concourse/issues/1938](https://github.com/concourse/concourse/issues/1938).
  This was a tough one. Look forward to a post from [Topher Bullock](https://medium.com/u/58876cdc2180) explaining some
  of the nuances behind this implementation

## Design Research

- [Lindsay Auchinachie](https://medium.com/u/d3a12206d051) and [Sam Peinado](https://medium.com/u/8a529ac5b818) mocked
  up a new “High Density” view of the Concourse
  dashboard ([https://github.com/concourse/concourse/issues/1899](https://github.com/concourse/concourse/issues/1899)).
  This new design would be an add-on to the current beta dashboard, and would be activated using a toggle in the status
  bar.
- The design team is also beginning to research new designs to support adding comments to the current build page
- We’re also beginning to work on new designs for the [http://concourse.ci/](http://concourse.ci/) homepage! New year,
  new look!

## Feedback

This is our first time posting updates publicly like this, so please let us know if they’re helpful by giving us a
“clap” or by responding to the story below! We also plan to announce a new portal where community members can follow
along with our progress in the coming weeks, so look forward to more information coming your way!

