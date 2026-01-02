---
title: "Design & Dev Pairing: What we learned during a one week technical discovery"
date: 2018-10-05
authors:
  - saman
---

![](assets/2018-10-05-design-dev-pairing-01.jpg)

<!-- more -->

During a one week technical discovery, we (Saman and Josephene - engineer and product designer respectively) spent some
time analyzing the difficulties with PCF ([Pivotal Cloud Foundry](https://pivotal.io/platform)) installs and how
Pivnet ([Pivotal Network](https://network.pivotal.io/)) could help with the problem. As a result of this pairing, we
were able to understand the benefits of doing Design & Dev pairing. The Concourse team also used this methodology to
develop some of their features. In this article, we describe the results of this pairing on
the [Pivnet Resource][piv_resource], a [Concourse resource][resources] to interact with Pivotal Network.

## What is design-dev pairing? How does it differ from normal pairing?

[Pivotal focuses on pairing](https://content.pivotal.io/blog/pair-programming-considered-extremely-beneficial) as an
important part of the process of transforming the way the world builds software. A
traditional [pairing session](https://content.pivotal.io/blog/pair-programming-considered-extremely-beneficial) at
Pivotal involves two engineers. The engineers both solve the same problem, discuss it with each other, and take turns
driving and navigating. A Design and Dev pairing session is similar. The two are still working on the same problem and
discuss with one another, but do not take on the traditional driver and navigator roles. They bring different skill
sets, allowing developers to get a better understanding of customer needs, and for designers to better understand the
technical complexities involved in implementation.

The Concourse team utilized this methodology when doing their initial user research
around [Spaces](../../2017/11/2017-11-01-sneak-peek-spatial-resources.md) and the
new [Dashboard](../../2017/11/2017-11-27-designing-a-dashboard.md),
with [Lindsay](https://medium.com/@lauchinachie_78613) and [Mark](https://medium.com/@mhuang_34434). The feedback loops
were tighter and iteration cycles to test these new features were also shorter.

Similarly, this methodology was applied to the technical discovery.

## What did we set out to accomplish?

The problem we were trying to solve was broadly defined — how can we automate PCF installs to ease the lives of our
customers using Pivnet related
tools ([Pivnet CLI](https://github.com/pivotal-cf/pivnet-cli), [Pivnet Resource][piv_resource], and the Pivnet website).

The three experiments ran to answer the question of automation from the perspective of a different combination of tools
took about two days to run. Each experiment took a look at existing solutions to automate PCF installs, as well as a
combination of Pivnet tools to augment the existing solution or generate a new one.

It was valuable to have the perspective from the designer to understand customer problems with the tool as well as other
domain specific problems. It was also valuable to get the perspective from the developer to be able to investigate and
provide quicker answers about potential experiments. Both individuals brought important perspective and knowledge that
allowed us to reach a solution faster, and answer questions in a more efficient manner than either would have been able
to do alone.

## Pros / Cons of the pairing session

There are pros and cons to every situation, and it is necessary to understand them to ensure success in your own
versions of the experiments.

### Pros:

* The developer was able to understand the problem space a lot more deeply than in a traditional setting. The
  opportunity to talk to other component development teams, the field, and to go through customer interviews allowed for
  a much more holistic view of the world.
* It became clear early on that another team was in the same problem space, and instead of duplicating effort, we
  pivoted to work on something that would supplement their solution. Traditionally, the Project Manager has a deeper
  understanding of the problem space, so this issue would have been hidden from the development team. The pairing
  session allowed the developer to have a lot more autonomy.
* Design/Dev pairing allowed for delivery in a week as each experiment was quickly invalidated through user research and
  there was a tight feedback loop.
* Both the developer and designer were able to see the full breadth of the problem — the issue could be tackled from all
  sides.
* The developer gained much more in-depth view into customer problems.
* The designer was able to lean on the technical skills of the developer, and therefore free of the pressure to fully
  understand the technical problem space.
* The designer was able to ramp up a lot more quickly through pairing — the chance to see a real world example of
  working through a problem provided a lot of context which is difficult to gain otherwise.
* The solution felt concrete.
* We did not reinvent the wheel, we analyzed existing solutions to the problem and determined where our solution would
  fit best.
* It became possible to invalidate three experiments in two days.

### Cons:

* The designer was not allocated to the project full time, and therefore was not able to fully dedicate their time. This
  is more of a function of the fact that designers at Pivotal are generally split between many projects in general, and
  thus are not able to fully dedicate themselves.
* Success metrics were clearly defined in the beginning, but as we pivoted and explored different options, the success
  metrics became more ambiguous. Although we have an outcome and a deliverable, it is not clear if we were able to solve
  the problem in a very valuable or meaningful way.
* [The solution](https://pivotal-cf.github.io/pivnet-resource-documentation/) we arrived at involved documentation, and
  documentation quickly goes stale.

## Takeaways

The purpose of the Design/Dev pairing was to be able to have more of a balanced team approach — one where members from
all parts of the organization feel empowered to have an impact and solve customer problems. As we had a Design/Dev pair,
the turnaround time in the exploration stage was minimal — both members were able to learn from each other and arrive at
conclusions more quickly. The experiment we ran was on a smaller scale — one pair doing the experiment, which is perhaps
why it was more effective. It is not clear how useful it would be on a larger scale.

Additionally, this pairing allowed for a lot of autonomy. In most cases, Design identifies systematic problems in the
organization, but interfaces with the Project Manager who breaks the problem down into smaller tasks for the development
team. Project Managers explain the customer needs and problems, but the development team is not able to interface or
speak to customers / field directly. Design is not able to empathize as deeply with the pains or difficulties the
development team goes through, and thus a wall generally exists between the two in terms of difficulty in what can be
accomplished and what cannot. A pairing between Design/Dev allowed for a better understanding of the problem space,
resulting in faster validation of experiments, quicker turnaround, and better results.

## The Solution

The current proposed solution to PCF installs involves giving customers more autonomy and flexibility with their
installation pipelines. They want to be able to install Product Releases from Pivnet quickly, without having to reach
out to Support. The team tasked with automating PCF installs decided to use the Pivnet Resource in the new installation
pipelines, and we decided to focus on ease of use of understanding the Pivnet Resource.

Operators working on the installation pipelines have an understanding of Concourse and Resources, but run into
difficulties with using the Pivnet Resource in particular. We addressed the common problems
encountered [here](https://pivotal-cf.github.io/pivnet-resource-documentation/).

[resources]: ../../../../docs/resources/index.md

[piv_resource]: https://github.com/pivotal-cf/pivnet-resource