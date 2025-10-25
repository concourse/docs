---
layout: post
title: "Community update: enter Discussions! \U0001F389"
date: 2020-04-16
---

Hasta la vista, stale bot.

<!-- more -->

{{< youtube src="https://www.youtube.com/embed/0Kug8mJ8WiM?start=110&amp;feature=oembed" >}}

## tl;dr:

- We've been granted access to GitHub's beta Discussions feature! 🎉
- [Discussions on the `concourse` repo](https://github.com/concourse/concourse/discussions) will be used for **questions
  and technical support**.
- [Discussions on the `rfcs` repo](https://github.com/concourse/rfcs/discussions) will be for **incubating ideas for new
  workflows** , which eventually turn into Pull Requests (also on the `rfcs` repo).
- From here on, Issues on the `concourse` repo are exclusively for **project backlog** and **bug reports** - i.e.
  planned or emergent work.
- [Creating an Issue](https://github.com/concourse/concourse/issues/new/choose) directs you to these options, so there's
  no need to change your muscle memory.
- [
  `CONTRIBUTING.md` now covers this workflow](https://github.com/concourse/concourse/blob/fab3de1722a2ce998d3710bd066453594f24ec57/CONTRIBUTING.md#from-ideas-to-implementation)
  in addition to the more technical content.
- With these changes in place, the stale bot we all know and hate has been terminated.
- All Pull Requests will be assigned to someone as part of our daily process, and we will begin dedicating half of each
  day to PR review.
- I am going to shift my focus from planning/prioritizing to shepherding RFCs and writing code. Expect more blog posts
  in the future!

## An update on triage

With Concourse, there is _always_ a lot of work to do. I personally would love to see some of
the [larger issues](https://github.com/concourse/concourse/issues/324) worked on today, but we (the Concourse team) have
to choose our battles. A good chunk of our time is spent on upkeep, architectural improvements, and trying to identify
the underlying needs across many feature requests so that we can make a lower volume of high-impact changes.

The long and short of it is that the amount of work to do – both in code and in the community – greatly exceeds the
number of people available to do it. Concourse is a product that has the _entire software industry_ as its customer –
including video game devs, mobile app devs, DevOps, and people who just want CI for personal side-projects. It's a lot
to stay on top of, but it's something to embrace: it forces us to think in the abstract. It just takes time.

The main goal of these changes is to promote healthier discourse by setting expectations about the status of an
engagement more clearly. Issues are concrete; they will be prioritized and finished at some point, by the core team or –
in a perfect world – by a volunteer from the community. Discussions on the other hand are at an earlier stage in the
process.

Discussions on the `concourse` repo will be used for for questions and support. These can be more open-ended than bug
reports – there may indeed be a bug, but there might also just be an answer or a better approach. The outcome of these
discussions may be a bug report, an improvement to the docs, an answer to the question, or perhaps a new Discussion on
the `rfcs` repo.

Discussions on the `rfcs` repo will be used for incubating new ideas. By eliminating the "solution-first" framing of
feature request issues, we can begin to focus on the _problems_ instead. The hope is that we can all more easily
identify underlying patterns and try to form broader solutions – whether they're ones we need to plan, whether they're
already on the roadmap, or whether there's simply an existing solution that needs to be easier to discover.

With these changes, we no longer have any need for the 'stale bot' as Discussions can just keep trucking along at their
own pace. The bot has been terminated. Unfortunately, I removed its configuration before uninstalling it, causing it to
assume the default settings and unleash its annoying comments across a slew of issues and pull requests, going out in
one last blaze of glory. Sorry about that.

## Improving RFC engagement

Some of you have submitted RFCs and haven't received much feedback yet. I'm really sorry about that.

With v6.0 out and with the dust settling on the ["v10" roadmap](../2019/2019-07-17-core-roadmap-towards-v10.md), I am going
to shift my role towards shepherding RFCs and getting back to writing code rather than endlessly planning and
prioritizing. It's been a long time! This will also eliminate the conflict-of-interest where I author RFCs and then
prioritize them while neglecting others. Definitely not a trend that I want to continue.

Expect more RFC update blog posts soon!

## Improving Pull Request engagement

Another area we're always trying to improve on is Pull Request engagement. We've been tried a lot of things, but in the
end it's been hard to integrate into our day-to-day pairing process and escape the single-point-of-failure (_cough_ me).

We're going to start assigning each and every PR to someone on the team and dedicate half of each day to PR review. Our
goal is to dramatically shorten the feedback cycle time and not leave anyone hanging.

## What about discuss.concourse-ci.org?

These changes make [our forums](https://discuss.concourse-ci.org) a little (ok a lot) redundant. Once the Discussions
feature feels solid I plan to shut the forums down down and centralize our community in GitHub (in addition to Discord
for real-time chat).

## What's happening with VMware?

Some of you may be wondering what the future holds for Concourse through VMware's acquisition of Pivotal, the company
that has supported Concourse's development since 2015.

VMware is heavily invested in Concourse – in fact some of our recent significant contributions originated from VMware
pre-acquisition. Concourse is already being used internally, and there is work underway planning Concourse's integration
into VMware's product ecosystem. We ain't going anywhere!

Thanks and stay safe everyone!
