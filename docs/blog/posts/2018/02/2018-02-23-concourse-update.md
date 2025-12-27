---
layout: post
title: Concourse Update (Feb 20–23)
date: 2018-02-23
categories:
  - product-update
authors:
  - jamesma
---

Monday, Feb 19 was [Family Day](https://en.wikipedia.org/wiki/Family_Day_%28Canada%29) for us here in Canada, so its
been a relatively short work week for the Concourse team. With the release of v3.9.0 last week, we’ve gotten some
reports of new bugs and issues, so thanks to everyone who reported them in via our
GitHub [issues](https://github.com/concourse/concourse/issues) and Slack. Please make sure to check the updated release
notes ([here](https://concourse-ci.org/downloads.html#v390)) for the full details! We’re planning to cut a new patch
release early next week with some of the fixes to the reported issues.

<!-- more -->

On to the update:

## Features

**UX**

- We fixed issue #[1912](https://github.com/concourse/concourse/issues/1912)(slow build page due to timestamps)! The fix
  for this should be rolled into the next patch release as well
- Started working on search hint and autocomplete on the Concourse
  Dashboard [#1713](https://github.com/concourse/concourse/issues/1713)
- Tried adding buffering to fly outputs, it didn’t help [#1912](https://github.com/concourse/concourse/pull/1912)

**Core**

- Fixed an issue with noisy logging from skymarshall by lowering the the log
  level [#2044](https://github.com/concourse/concourse/pull/2044)
- SURPRISE: we’re still refactoring our backend to support users

**Operations**

- Pulled in PR [#2030](https://github.com/concourse/concourse/pull/2030)so we could fix the BOSH deployment issue where
  the ATC will fail due to function esc not being defined [#2029](https://github.com/concourse/concourse/pull/2030)
- Fixed a CredHub integration bug [#2034](https://github.com/concourse/concourse/pull/2034)
