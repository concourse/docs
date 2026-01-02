---
title: Concourse Updates (Nov 26–30)
date: 2018-11-30
categories:
  - product-update
authors:
  - jamesma
---

![](assets/2018-11-30-concourse-update-01.jpg)
/// caption
Coventry Airport control tower (Photo
Credit [Casa-Steve](https://www.flickr.com/photos/casa-steve/5026647455/in/photolist-8EbTar-945QT9-fpbm1U-USmyiK-hKvZzF-UQMUYM-rRjc9L-afeVWq-7TMv14-kHTAbv-X5eBNp-9KL7Xp-5BJJrE-6FmR4M-UfNyEs-eTtxZW-21tU4i7-dQPFLx-Cjbv7d-nZfcyQ-47qjVC-r7H2Nr-29F4TP-r6tZZK-25fGTqf-q2Zn31-odpWFX-bwBv1A-Cdg3J2-b6jZ5R-2aRMzVN-aZpFtg-fsP51B-gpwYNh-T4jGz1-6vbmHh-7Q7tZe-29Gus6s-YcAY2Y-7Qbhfh-jHFEXp-nLfQWg-askCgx-8DrQeq-vDX425-8tU2ST-paVwyg-2cvA4-4bFzK5-brt87D))
///

<!-- more -->

As I mentioned last week I’ve been doing story acceptance in our dev environments for the
upcoming [RBAC](2018-11-23-concourse-rbac-preview.md) feature. The team’s been working
through some of the new issues that come out of that to give some final polish on to the release.

Something that I haven’t talked too much about in the past weeks is our work on
the [Concourse k8s Helm chart](https://github.com/helm/charts/tree/master/stable/concourse). If you pull up some of the
PRs
under [`[stable/concourse]`](https://github.com/helm/charts/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+%5Bstable%2Fconcourse%5D+),
you’ll see that we’ve been proposing some changes to the chart. This all falls under our goals for helping the community
stabilize the Concourse Helm Chart and to increase the scope of automated tests using the Helm chart. You can follow
along some of our work in GH issues [#2753](https://github.com/concourse/concourse/issues/2753)
and [#2876](https://github.com/concourse/concourse/issues/2876).

On to the update

## API

- Removed “allow all users” in [#2721](https://github.com/concourse/concourse/issues/2721)
- Added the restriction that only `owners` of `main` can be
  `admins` [#2846](https://github.com/concourse/concourse/issues/2846)

## Fly

- Fixed [#2780](https://github.com/concourse/concourse/issues/2780)
- Fixed [#2414](https://github.com/concourse/concourse/issues/2414)
- Fixed [#2819](https://github.com/concourse/concourse/issues/2819)

## UX

- Implemented [#2843](https://github.com/concourse/concourse/issues/2843) to help users understand what roles they have
  on each team
- Finished [#2795](https://github.com/concourse/concourse/issues/2795), which added the “pin” colors to the legend
- Completed an issue that lets users unpin from the top bar [#2870](https://github.com/concourse/concourse/issues/2870)
- Moved the Exposed state on a pipeline off the team and onto the
  pipeline [#2844](https://github.com/concourse/concourse/issues/2844)
- Fixed an old issue where users of new teams can’t un-pause their first
  pipelines [#2882](https://github.com/concourse/concourse/issues/2882)

## Core

- Began building up large scale test environments for Global Resource
  caching [#2874](https://github.com/concourse/concourse/issues/2874)

## Runtime

Continued with [#2577](https://github.com/concourse/concourse/issues/2577):

> “..as a first effort solution, we have decided to go with using the existing number of active containers on the
> workers to determine container placement. This means that we are adding a placement strategy that adds the new task on
> to a worker with the least existing active containers.”
