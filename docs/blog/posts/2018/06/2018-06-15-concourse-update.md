---
title: Concourse Update (Jun 11–15)
date: 2018-06-15
categories:
  - product-update
authors:
  - jamesma
---

This was a post-release week, so we spent a lot of time merging in new code from the Users track, fixing our pipelines,
and working on some neglected issues. All in all a solid week’s worth of work! On to the update

<!-- more -->

**UX**

- Changed the behaviour of the breadcrumb so that clicking on the pipeline name resets the pipeline view and group
  settings ([#2258](https://github.com/concourse/concourse/issues/2258))
- Fixed a bug with the breadcrumb where it wouldn’t render whitespace
  correctly ([#2267](https://github.com/concourse/concourse/issues/2267))
- Fixed a bug with team name overflowing on breadcrumbs ([#2241](https://github.com/concourse/concourse/issues/2276))
- Fixed a UI bug on the navigation arrows ([#2276](https://github.com/concourse/concourse/issues/2276))
- Added JSON stdout to Fly CLI ([#952](https://github.com/concourse/concourse/issues/952))

We haven’t done work on this yet, but based on our observations and feedback from the community, we’re planning to push
the dashboard up to / level. This will require a few items of polish first; but you can refer to
issue [#2282](https://github.com/concourse/concourse/issues/2282) for details

**Core**

- Spent most of the week trying to rebase and merge in changes from the Users track. Our pipelines are finally green so
  we’re ready to push some of that work into our local environments for broad testing. Be sure to check up
  on [#2218](https://github.com/concourse/concourse/issues/2218) for any gotchas that might affect you!

**Space**

- Conducted two user interviews this week. We have only have one or two more interviews left next week. After that we’ll
  be figuring out what our MVP might look light so we can start exposing that feature to adventurous Concourse users.

**RFCs**

As with last week, we’re looking for feedback on how to improve our existing implementation of credential management.
You can read more about it in [issue #5](https://github.com/concourse/rfcs/issues/5).

The RFC around [Resources v2](https://github.com/concourse/rfcs/pull/1)is moving along with some new changes. Thanks to
all the reviewers ([itsdalmo](https://github.com/itsdalmo), [cwlbraa](https://github.com/cwlbraa)
and [dprotaso](https://github.com/dprotaso)). I’d **REALLY** encourage ya’ll to read
the [full proposal](https://github.com/vito/rfcs/blob/resources-v2/01-resources-v2/proposal.md)and provide your inputs;
since we’ll be relying on these changes for new features like Spatial Resources.

