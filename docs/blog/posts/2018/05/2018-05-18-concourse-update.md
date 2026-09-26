---
title: Concourse Update (May 14–18)
date: 2018-05-18
tags:
  - blog
categories:
  - product-update
authors:
  - jamesma
---

In case you missed it, I’d encourage you to check out some of the recent posts
from [Shashwathi Reddy](https://medium.com/u/bca2c0ffce5e)
on “[My first month on Concourse](2018-05-14-my-first-month.md)” and [Joshua Winters](https://medium.com/u/d6d52be6c4b0)
regarding upcoming changes to our authentication; “[Oh, Auth](2018-05-11-oh-auth.md)”. We’d love to hear your feedback!

<!-- more -->

Heads up: the Concourse team will be taking Monday, May 21st off
for [Victoria Day](https://en.wikipedia.org/wiki/Victoria_Day) holiday.

And now, on to the update:

**Core**

- Continued banging our heads against new auth connectors with Dex. **Note:** We’ve started to centralize backwards-(in)
  compatibilities with user auth in issue [#2218](https://github.com/concourse/concourse/issues/2218)
- We’ve stood up a new Concourse with our experimental Spaces work. We’re looking for volunteers who are interested in
  trying out their pipelines before and after “space”. Tweet at me if you’re
  interested [https://twitter.com/pioverpi](https://twitter.com/pioverpi)!

**Runtime**

- Completed all the volume collection work for distributed GC
  in [#1959](https://github.com/concourse/concourse/issues/1959). We’re currently deploying this change to our internal
  environments to see how it works at scale 🤞
- Fixed issue [#2168](https://github.com/concourse/concourse/issues/2168), wherein “Duplicate resource type volumes
  created over time”
