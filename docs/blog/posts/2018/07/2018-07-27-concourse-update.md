---
title: Concourse Update (Jul 23–27)
date: 2018-07-27
categories:
- product-update
authors:
  - jamesma
---

{{< image src="/images/downloaded_images/Concourse-Update--Jul-23-27-/1-tfhJwBRSLe9wrc2-a7MwpQ.png" alt="Concourse v4
Dashboard" width="100%" >}}

<!-- more -->

I’m happy to announce that we released Concourse 4.0.0 this week! This was a HUGE release with over 28 new features and
fixes. I’d encourage you to read through the full list of changes on
our [Downloads page.](https://concourse-ci.org/download.html#v400)

Why did this release warrant a bump in the major version? Well, if you’ve been following
along [closely](../05/2018-05-11-oh-auth.md) you’ll know that we had just finished our new auth
work in 4.0.0. Users are now central to the authentication flows, **not** teams. Practically speaking, the user-centric
auth flow means that you won’t need to re-login to see pipelines in other teams that you already have access to!
Underneath the hood though, _“We’re leveraging CoreOS’s Dex project for all the moving parts, which already supports a
ton of providers (Dex calls them “connectors”). The only delta required for Concourse to support a Dex connector is a
tiny bit of glue code in our new_ [_Skymarshal_](https://github.com/concourse/skymarshal) _component to provide
higher-level flags for our CLI.”_

We spent a lot of time near the end of this cycle trying to make these
changes [backwards compatible](https://github.com/concourse/concourse/issues/2218), but ultimately decided that the
changes were significant enough to warrant a bump in the major version. PLEASE _PLEASE **PLEASE**_ refer to our release
notes for all the breaking changes before executing your upgrade!

{{< image src="/images/downloaded_images/Concourse-Update--Jul-23-27-/1-A7zDAYYisJzHjZldrxqneg.gif" alt="" width="
50%" >}}

The second big change you’ll notice in 4.0.0 is that the home (/) route now takes you to the dashboard. We’ve also
propagated the new colour scheme to the rest of the app and tightened up the fonts throughout the app.

We hope you like it!

So, what’s next? We’re focusing on three key areas:

- [Resources v2](https://github.com/vito/rfcs/blob/resources-v2/01-resources-v2/proposal.md) and Spatial resources.
  Please review and comment on the RFC!
- [Runtime efficiency](https://github.com/orgs/concourse/projects/23) & [Operational observability](https://github.com/orgs/concourse/projects/24)
  into Concourse
- [Role based access control](https://github.com/concourse/rfcs/pull/6). That’s right, we’re finally doing it. Please
  read the RFC for this change. You can also find a copy of our initial permission
  matrix[here](https://docs.google.com/spreadsheets/d/1np3hyJy3mVRfB2gcgKykz3QTQg5qEj28QgK523SEmao/edit#gid=0)
