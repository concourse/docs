---
title: Concourse Updates (April 2–6)
date: 2018-04-06
categories:
  - product-update
authors:
  - jamesma
---

If you haven’t done so already please check out [Alex Suraci](https://medium.com/u/263a63b2f209)’s recent update post
on “[A renewed focus & community changes](../03/2018-03-29-a-renewed-focus-community-changes.md)”.
It covers all the recent changes that we’ve been making; starting with the new styling of
the [website](https://concourse-ci.org/), our new [discussion forum](https://discuss.concourse-ci.org/), and our
migration to [Discord chat](https://discordapp.com/invite/MeRxXKW).

<!-- more -->

Specifically, we’ve been getting some mixed feedback on the new format of the site. Some folks love it, other folks miss
the highly visual styling of the old site. As always, the Concourse team is always open to hearing your feedback in the
usual channels. If you’d like, you can even open issues against the docs repo
itself [here](https://github.com/concourse/docs/issues).

And now, on to the update:

**UX:**

- Finished up [#1806](https://github.com/concourse/concourse/issues/1806) where our dashboard keeps spamming the ATC and
  the db with connection requests.

**Core**

- Started to spike on the spatial resource visualization, you can follow along
  at [#2131](https://github.com/concourse/concourse/issues/2131)

**Runtime**

- Tackling the large story on adding batch volume & container deletion to a worker [#2109](http://2109)

**PRs**

Apologies to everyone who’s been waiting for feedback on their PRs. [Alex Suraci](https://medium.com/u/263a63b2f209) has
been working down the list this week; so we’re slowly making our way down the list and merging them in.

