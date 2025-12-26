---
title: "Developing Concourse (from home \U0001F3E1)"
date: 2020-03-25
---

In March 2020, countless companies made a shift to have their employees work from home. For remote staff getting work
done can be challenging enough, but staying connected to your team and company culture can be even more challenging. On
the Concourse team, we’re working hard to keep our product development running smoothly with some additions to our tech
stack and day to day workflow.

<!-- more -->

## Concourse team composition

At VMware (formerly Pivotal Software), there are fourteen engineers and five product folks working on
the[Concourse CI project](https://github.com/concourse/concourse/) full time. We all care deeply about the software
we're building, and put a great deal of effort and consideration into _how we build software_ in order to be as
effective as possible.

Most of our team lives in Toronto, but in order to maintain velocity as the team expands to include engineering and
product talent from other countries, and as we travel to meet with customers and talk about Concourse at conferences and
meetups, we've refined our process to make ourselves resilient to occasions when a few employees might need to work from
home or abroad.

Then 2019's novel coronavirus arrived, and the ensuing pandemic in late February and early March 2020 forced us
_provided the right opportunity_ to test a fully-remote team experience.

We thought we'd put together a quick post here to share how we're making it work. 😄

## Pre-COVID19

The majority of the Concourse team is located in the greater Toronto area, with satellite members in a few cities in the
United States. The Pivotal Software office in downtown Toronto is our home throughout the week. The team is set up with
rows of computer workstations on the East side of the office, and gathers in various meeting rooms around the office for
standups, prioritization meetings, discussions, and presentations.

If you're a Pivotal/VMware customer, a Concourse contributor, or a user interview collaborator who's chatted with the
team in the past, then you're probably familiar with a few of the meeting rooms from which we conduct Zoom meetings.

The Toronto office is a great work environment. We're lucky to have the opportunity to get up to play a game of ping
pong between engineering stories or meetings, and it's great to be in the same room to collaborate around a whiteboard
or break down a problem with post-it notes.

But what happens when your government enforces non-essential businesses to close their offices and asks employees to
work from home instead?

## Post-COVID19

When the news and scale of the outbreak arrived in early March, we made the shift to collectively working from home as
quickly as possible. Since the week of March 8th, all of us have been dutifully self-isolating, working out of our
respective homes each day.

**Most of the solutions we've come up with are focused on maintaining our existing process** (especially our use of
IPMs, pairing, retrospectives, and a high degree of collaboration on every possible front) **while making life remote
friendly at the same time.**

With those goals in mind, our team has pulled from different experiences and techniques learned from past projects as
well as new ideas that we're still iterating on daily. This effort has made for a novel mix of video, audio, and text
applications that help us work in a comfortable, fun, efficient manner.

### Zoom

First and foremost, we have a perpetual group [Zoom](https://zoom.us/) meeting set up that everybody on the team hangs
out in throughout the workday.

{{< image src="/images/2020/03/Screen-Shot-2020-03-20-at-12.08.28-PM.png" alt="A typical workday in the Concourse
hangar." width="100%" >}}

Having one single room might be unconventional, but negates the need to constantly jump in and out of different Zoom
meetings, and all of the confusion that can create. It's tied to a easy-to-remember URL that makes it painless to join
each day - no more memorizing meeting IDs!

Additionally, having everyone in the same place makes it feel more like we're all in the office together. Seeing each
other's faces throughout the day makes working at home feel a lot more friendly and less isolated.

### Discord

The other major difference to Zoom meetings we held in the past is that now we remain fully muted. Zoom takes care of
video communication, and we rely on [Discord](https://discordapp.com/) for audio and individual screen sharing.

We were already using Discord for our open source community's text-based chat, but it also excels at fast, simple, and
effective voice communications. The Concourse team uses a series of private voice channels (named after famous aircraft,
of course ✈️) that we can join and depart with a single click.

{{< image src="/images/2020/03/Screen-Shot-2020-03-23-at-1.56.04-PM.png" alt="Pairs of engineers working in audio
channels on Discord" width="20%" >}}

This makes it easy to navigate for pair programming, impromptu meetings, or general chat and attention-getting. There’s
even a #water-cooler channel that acts as the defacto hangout spot! With this system you can see who is paired up in the
respective rooms at a glance, adding a level of transparency and organization that isn't possible when everyone is
pairing through separate Zoom meetings or other telecommunication products.

### Slack

The Concourse team has always used Slack to communicate internally, and Slack still plays a big role in organizing our
work. Since moving to work from home and using Zoom and Discord as described above, however, we're using it less - the
number of Slack messages simply doesn't need to be as high. If nothing else, it's great to have Slack as a backup option
for screen sharing, especially since we can use it to pull in non-team members from the company as well.

It still plays a large role in communicating with other product, engineering, and customer-facing teams in the company,
and can't be beat for asynchronous messaging. However, when we need to chat within our team throughout the workday, we
can just grab someone's attention and start talking immediately instead.

## Remote Pairing

Remote pairing is one area of our work process that is still up in the air. The Concourse team
practices [pair programming](https://en.wikipedia.org/wiki/Pair_programming) everyday, and trying to do that remotely
can be challenging at times. We’ve tried the following methods of pair programming, with each having different strengths
and weaknesses for different situations.

### Toronto workstations

The pairing workstations in the Toronto office are set up so we can use OSX's screen sharing tool to securely connect to
them over our company’s VPN. This allows us to share everything (browser, IDE, terminal, and more) as we normally would
if we were sitting side by side in the office to pair program.

### Discord Go Live

In a pinch we’ve been able to share screens
using [Discord’s Go Live](https://support.discordapp.com/hc/en-us/articles/360040816151-Share-your-screen-with-Go-Live-Screen-Share)
feature. In mid-March Discord raised the viewing limit on Go Live and Go Live - Screen Share streams from 10 people at a
time to 50 people, making this work well for mobbing as a group around one person's screen as well.

One of the drawbacks is that it only streams in 720p resolution, making it hard to read text on the screen unless the
text is enlarged. But there are a lot of times when a modest screen resolution is all you need, and we can switch to
Slack's screen sharing in the rare case that we need higher fidelity.

### SSH + tmux

Sometimes you just need a command line. In these situations, the team can also ssh onto any of the Toronto workstations,
or any of the team's various VMs running linux on the cloud to share a [tmux](https://github.com/tmux/tmux/wiki)
session.

## Attitude

This article has been heavy on technological solutions and workflow, but another thing worth mentioning is how positive
and encouraging the team's attitude has been during the pandemic.

{{< image src="/images/2020/03/Screen-Shot-2020-03-19-at-10.41.42-AM-1.png" alt="Concourse engineers, best engineers."
width="100%" >}}

Even isolated to our respective homes, we've seen everyone step up to keep each other happy and healthy, and to keep
work moving at a sustainable pace. I won't go into detail about all the memes, inside jokes, guitar solos, Zoom virtual
backgrounds, and pet cameos that have been shared among the team in the past couple weeks - you can use your
imagination. 😂

Don't underestimate the importance of taking breaks and having fun with your work!

## What next?

Nobody knows for certain how long we'll be working in full isolation, but since our goal is
to [flatten the curve of the outbreak](https://www.livescience.com/coronavirus-flatten-the-curve.html), it's in our best
interests to be prepared for a long wait.

Our team is built around iterating on process and practices, and we plan to continue working on how we can collaborate
to make sure we continue to deliver as much product value as possible.

[Join us on Discord](https://discord.gg/MeRxXKW) to learn about new work in progress, report on bugs, collaborate on the
codebase, or just keep us company! 😁

