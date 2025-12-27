---
title: Concourse Update (Oct 9–12)
date: 2018-10-12
categories:
- product-update
authors:
  - jamesma
---

{{< image src="/images/downloaded_images/Concourse-Update--Oct-9-12-/1-beC36nbzVbF57aHcM2jEyQ.jpeg" alt="From the
Smithsonian National Air and Space Museum in Washington D.C." width="100%" >}}

<!-- more -->

The results of the [Concourse 2018 Community survey](https://medium.com/concourse-ci/2018-community-survey-ddff90bdc35b)
is out! Thanks to everyone who took the time to fill it out; and to [Scott Foerster](https://medium.com/u/86d0fa097bb9)
and [Lindsay Auchinachie](https://medium.com/u/84b937bda3b6) for sifting through the data.

It was a relatively short week for us due to Thanksgiving celebrations, but here’s our update:

**UX**

- Continued our rampage in fixing fly
  issues: [#259](https://github.com/concourse/fly/issues/259), [#267](https://github.com/concourse/fly/issues/267), [#1038](https://github.com/concourse/concourse/issues/1083), [#1062](https://github.com/concourse/concourse/issues/1062), [#248](https://github.com/concourse/fly/issues/248)

I also wanted to add that we’re trying to keep all issues
under [concourse/concourse](https://github.com/concourse/concourse/issues). We’re planning on migrating the issues
under [concourse/fly](https://github.com/concourse/fly/issues) and closing off that repo in order to centralize
everything under [concourse/concourse](https://github.com/concourse/concourse/issues).

**Core**

- SPATIAL RESOURCES ARE BACK [#2651](https://github.com/concourse/concourse/issues/2651)

**Runtime**

- Picked up [#1954](https://github.com/concourse/concourse/issues/1954)(The ATC holds a lock on a resource type scan)
  and [#1796](https://github.com/concourse/concourse/issues/1796) (Task fails with “config file not found” after
  restarting Docker service)
- Finished [#1799](https://github.com/concourse/concourse/issues/1799) Permit overlapping inputs, outputs, and task
  caches

**Operations**

- Picked up [#2674](https://github.com/concourse/concourse/issues/2674) Emit metrics for locks held in the DB
