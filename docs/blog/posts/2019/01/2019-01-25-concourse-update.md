---
layout: post
title: Concourse Update (Jan 21–25)
date: 2019-01-25
categories:
  - product-update
authors:
  - jamesma
---

![](assets/2019-01-25-concourse-update-01.jpg)
/// caption
Photo
credit [Dennis Jarvis](https://www.flickr.com/photos/archer10/3650794314/in/photolist-6yBgXy-nsnTHL-rSpaUc-q2Zpj8-29TjRQT-ps3F4d-KJ2Ag5-oRv1uv-FEKSb1-MuEUKH-9NvWQy-DfzFxW-PsJydr-KEEegf-JKRDnT-ozhqym-HkgbPg-TBnH7a-LmMdqC-qyBX5C-peQyWS-qAowiP-ieZU4W-e2jvSh-281pTun-295Hje3-XEa4cS-ofiQar-M53TUG-22eLHit-22GBs1k-dTVMZz-954Uu4-dob3cL-nKXkDi-dU2pHy-27hVMmD-QgMKsL-ftAM2H-8sgMyU-26P3oXt-oSGGZp-Loaw1h-GsUL8G-MBSDxH-24QRcMV-hz6rp5-bAU95c-6VLnco-TBnHcv)
///

<!-- more -->

It's been a week since we switched over to the PR workflow and so far its been great! We’re still working through some
of the kinks with this process so please bear with us while we continue to burn down through the list of open PRs!

And now...on to the update! I might have missed a few issues while I’m still getting used to our new workflow. Completed
issues now appear
as [closed PRs in concourse/concourse](https://github.com/concourse/concourse/pulls?q=is%3Apr+is%3Aclosed)

## Docs

- Started to burn down our list of todos for Concourse docs pre-release. You can follow along
  in [#143](https://github.com/concourse/docs/issues/143)
- Proposed a new structure for our docs in [#136](https://github.com/concourse/docs/issues/136). Brace yourselves for
  broken links.

## UX

- Added a “new version” tooltip to versions in Resource page [#3136](https://github.com/concourse/concourse/pull/3136)
- Fixed a whole bunch of UX quirks in preparation for v5.0.0 release
- Beginning our Elm 0.19 refactor and upgrade

## Core

- Upgrade and performance testing for Concourse 5.0 [#2874](https://github.com/concourse/concourse/issues/2874)

## Runtime

- Decoupling container and volume creation in
  FindOrCreateContainer [#3052](https://github.com/concourse/concourse/issues/3052)
