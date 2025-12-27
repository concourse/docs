---
title: Concourse Update (Nov 5–9)
date: 2018-11-09
categories:
- product-update
authors:
  - jamesma
---

{{< image src="/images/downloaded_images/Concourse-Update--Nov-5-9-/1-JcXgBDqfq8Lwc4WNwyJgQg.jpeg" alt="" width="
50%" >}}

<!-- more -->

Right off the bat I’d like to give a shoutout to [Jamie Klassen](https://medium.com/u/f0f4a8a2fbb8) and his new post
about the upcoming feature for pinning resources. You can check it out the new post
here: [Resource Page Explained](2018-11-09-resource-page-explained.md)

I also wanted to mention that the Github Pull Request that was maintained by JT
Archie ([https://github.com/jtarchie/github-pullrequest-resource](https://github.com/jtarchie/github-pullrequest-resource))
has been officially deprecated.

1. The official docs for the resource types no longer point to jtarchie/pr for the PR resource. They are pointing
   to [https://github.com/telia-oss/github-pr-resource](https://github.com/telia-oss/github-pr-resource) now.
2. There will no longer be any maintenance, issues or PRs accepted on the resource.

We also spent some time this week finalizing our plans for the Concourse 2019 roadmap. We’ll be writing it up in a wiki
to share with everyone next week, so keep an eye out for another followup announcement!

On to the update:

**Pipeline**

- We finally got a deploy going onto our [prod environment](https://ci.concourse-ci.org/). Everything broke but hey, its
  the attempt that matters

**API**

- We’re still investigating various options for refactoring and documenting our
  API. [Joshua Winters](https://medium.com/u/d6d52be6c4b0) is on it!

**UX**

- Pinning versions on resources. Make sure you read our write-up on
  it [here](2018-11-09-resource-page-explained.md)!

**Core**

- Resource v2 and Spatial resource design! Most of that work is currently being done in
  a [feature branch](https://github.com/concourse/concourse/tree/spaces).

**Runtime**

- Picked up [#2529](https://github.com/concourse/concourse/issues/2529)

**Operations / K8s**

- In addition to picking up some issues reported by users around helm-deployed concourse in
  4.2.1, [Topher Bullock](https://medium.com/u/58876cdc2180) is going to try spending his Fridays making / looking at
  Concourse Helm chart PRs.
