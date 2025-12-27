---
title: Concourse Update (Mar 12–16)
date: 2018-03-16
categories:
  - product-update
authors:
  - jamesma
---

Its been a first week in a long time where we were back to full strength and fully co-located. It was nice!

<!-- more -->

Oh, and Concourse v3.9.2 was released this week as well,[check it out!](https://concourse-ci.org/downloads.html#v392)

On to our update:

**UX**

- Started to make our dashboard a bit more mobile friendly [#1712](https://github.com/concourse/concourse/issues/1712)
- Started to tackle the problem where our dashboard holds too many open
  connections [#1806](https://github.com/concourse/concourse/issues/1806)

**Core**

- Removed a dependancy to provide an external URL for fly
  execute [#2069](https://github.com/concourse/concourse/issues/2069). To
  quote [Alex Suraci](https://medium.com/u/263a63b2f209):

> “It also makes the ‘getting started with Docker’ flow a bit complicated on platforms like Darwin where Docker is
> actually run via a Linux VM, in a separate namespace. fly execute can't be made to automatically work; the container IP
> would probably work for fly execute but isn't really what they should be setting as the external URL (as they can't
> reach it from their own machine).”

- Continued our refactoring of Concourse APIs to support multiple teams

**Runtime**

- Completed work on [#2070](https://github.com/concourse/concourse/issues/2070), making it so that workers can retry
  against multiple TSAs
- Picked up a reported issue around custom resources on tagged
  workers [#1371](https://github.com/concourse/concourse/issues/1371). We’re not quite sure how it got so bad

**Docs**

We’ve been working on a new website! The focus of it is to make it less flashy, less marketing, and more content driven.
The design of it is still in progress but we want to start sharing it out very soon 👍

