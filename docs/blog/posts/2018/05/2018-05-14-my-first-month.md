---
title: My first month on Concourse
date: 2018-05-14
authors:
  - sreddy
---

I have been working as Software Engineer with [Pivotal](https://pivotal.io/) for about 3 years now, during which much of
my contributions were primarily within Cloud Foundry teams, such
as [MySQL](https://github.com/cloudfoundry/cf-mysql-release)
service, [Routing](https://github.com/cloudfoundry/routing-release), and [UAA](https://github.com/cloudfoundry/uaa).
Early this year I rotated onto [Concourse](https://github.com/concourse/) team in Toronto and I would like to share my
thoughts on why Concourse team does things differently and why they work.

<!-- more -->

On CF teams, part of our of daily routine was entrenched in using various productivity tools that help teams stay
coordinated and connected. A couple of key examples are [Pivotal Tracker](https://www.pivotaltracker.com/) that allowed
for ideating and managing stories/features across team members and [Slack](https://slack.com/) for communication and
pair programming on workdays. On Concourse, I was surprised to see Cadet and GitHub instead of
Tracker, [Discord](https://discordapp.com/) instead of Slack, and a [Concourse forum](https://discuss.concourse-ci.org/)
for detailed discussions. It became apparent that the team landed on using these tools to achieve one of its core goals:
engaging more closely with the Open Source community through discussions, issues, and PRs.

Let me expand more on how these tools serve their purpose. We use Cadet, a tool built
by [Alex Suraci](https://github.com/vito) to manage GitHub issues/PRs. As a developer, it helps me stay aware of high
impact issues and backlog items based on importance, active tracks or epics, and stories in-flight or done. It also
serves to provide additional transparency within the company as well as to the community and allows everyone to
contribute towards the solution.

We use GitHub in combination with Cadet to track the progress of a story. Stories could be created by PM, team members,
and even community members. We also use this combination to prioritize, track features, bugs, and PRs issued by the
community across multiple tracks of work. We use comments to transfer context or knowledge dump or even breaking down
huge issue into smaller tasks. We achieve the same goal by using GitHub. Furthermore, GitHub makes it very easy to take
or transfer ownership of issues that interest us through its built-in assignment functionality.

These tools provide the foundation to my daily work and play an important role in rapid ramp up with the Concourse team.
I tried to take advantage of unique team structure with multiple track anchors, spending a couple of weeks experimenting
with different tracks, I eventually chose the authentication track, after pairing
with [Josh Winters](https://github.com/pivotal-jwinters) for three weeks until I could drive the track comfortably on my
own. This was a huge boost to my confidence and cemented my abilities within my new team. Another thing that helped my
ramp up was [Freedom Fridays](2018-05-01-freedom-fridays.md). It gave me enough time to read through Concourse
documents, explore the vast codebase, and start working on self-directed small features. Suffice to say, this is easily
one my fastest ramp ups so far, and it continues to be an enjoyable experience.

Structurally, Concourse shares the same operational philosophy as other Pivotal R&D teams. We still pair from Monday to
Thursday in additional to having team discussions, retros, and IPMs. While we do not use all the traditional Pivotal
tools, the focus on our values remains the same: doing the right thing, doing what works and being kind to ourselves,
users, community, and Pivotal.