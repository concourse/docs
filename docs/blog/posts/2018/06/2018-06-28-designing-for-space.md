---
title: Designing for Space in Concourse
date: 2018-06-28
authors:
  - lauchinachie
  - speinado
---

> This feature is still in the early stages of development. We are picking up from our
> previous [sneak peak](../../2017/11/2017-11-01-sneak-peek-spatial-resources.md) post by James Ma. If you have a
> comment and want to participate in the conversation please visit the issue
> on [GitHub](https://github.com/concourse/concourse/issues/1707).

Concourse Pipeline Engineers have been asking for a better way to test variations and combinations of a resources in
their pipelines. When pipelines are composed of resources that duplicate themselves to account for product
versions ([semver](https://semver.org/)), branches of a repo, and different environments, the resulting pipeline can be
quite difficult to navigate and edit.

<!-- more -->

![](assets/2018-06-28-designing-for-space-01.png)
/// caption
Pivotal OSL Pipeline
///

If we can simplify this new space configuration to just the one job and specify spaces on the corresponding resources we
could greatly reduce the duplication that is happening within their pipelines.

Adding [this feature](https://github.com/concourse/concourse/issues/1707) into the current anatomy of Concourse is a
breaking change to the existing pipeline visualization. Resources themselves are not very legible in the current
visualization; and we layer on additional information such as the spaces that are being used and the resulting job
combinations that are automatically generated. So, how do we go about increasing the complexity of the visualization
while making the smallest incremental change to test the new design?

## UI Inventory

We took the approach of starting by taking an inventory of the current UI actions and content, pain points and user
goals.

My design pair, [Sam Peinado](https://medium.com/@sampeinado), and I did a dump of post-its in Realtimeboard to list out
all of the actions and content that exists today on the pipeline page and what content those actions mapped to.

![](assets/2018-06-28-designing-for-space-02.jpg)
/// caption
///

![](assets/2018-06-28-designing-for-space-03.png)
/// caption
Current pipeline: [ci.concourse-ci.org](https://ci.concourse-ci.org)
///

Then we looked at the Goals of our users when they are on the pipeline view.

> Goals of the App Developer in the Pipeline view:

![](assets/2018-06-28-designing-for-space-04.jpg)
/// caption
///

> Goals of the Concourse Operator:

![](assets/2018-06-28-designing-for-space-05.jpg)
/// caption
///

Followed by prioritizing the top pain points.

> Top Pains:

![](assets/2018-06-28-designing-for-space-06.jpg)
/// caption
///

The research and prioritization exercise of the user pain points gave us a shared understanding, with my design pair,
that prepared us for the next step of a brainstorming workshop on a possible UI direction.

## Sketching: Design Studio

Design Studio is a collaborative solution brainstorming activity to gather ideas and discover unknowns in the form of
sketches. My design pair, Sam, and I decided this would be the best way to get the most amount of ideas out there in the
shortest amount of time.

### How does a Design Studio work?

1. We’ll take 5 - 10 minutes to sketch potential solution concepts
2. Discuss and Critique — Review each person’s concepts together
3. Vote on sketches — Dot vote with a limited number of votes
4. Repeat — As you repeat you can increase the fidelity and expand on the best solutions from the previous round of
   sketching

From the studio we brainstormed some wild possible pipelines from: Card Stacking, Circular pipelines, a Resource Centric
View, a Molecule Map, Text only output.

![](assets/2018-06-28-designing-for-space-07.jpg)
/// caption
///

From here we critiqued the solutions and decided on the best options to move forward into a higher fidelity prototype.

## Experiments: Starting with a simple Scenario for a testing matrix

We started with a simple use case to build out our concept in Sketch.

> As a Developer, I have a small Ruby project with build, test, and ship stages. I initially only test against the
> master branch with Ruby v2.1.x and ship only if master passes.

![](assets/2018-06-28-designing-for-space-08.jpg)
/// caption
prototype v1.0
///

* **Jobs** are the primary focus for the user in this view and are abstracted to job boxes.
* **Jobs** are divided into a further grid are representing the visual matrix of space permutations.
* **Resources**, by clicking on them in the side drawer, highlight the jobs.

## Our Findings:

From our initial round of User testing one of the more interesting findings twas that we identified two workflows for
the pipeline view:

1. As an <u>**Operator**</u>, I am engineering a pipeline in yml and seeing the resulting connections and flow of
   resources rendered in the pipeline UI. I want to see the jobs and resources where I expect them to be in the pipeline
   map.
2. As an <u>**App Developer**</u>, I am watching my commit go through the pipeline. I am waiting for the pipeline to be
   green so that I know my commit was successful. If it goes red at any point, I want to know if it was my code that
   broke the pipeline.

Because of the complexity of Concourse pipelines it is hard for users who have not configured a pipeline to understand
and read another user’s or team’s pipeline. The limits for testing these complex UI models with real scenarios in
InVision is a big barrier to a user understanding the UI and giving meaningful feedback. At this point we realized
InVision wasn’t going to give us the fidelity of feedback we needed for the next iteration. So, we put the experiment
into code by pairing with engineering and we created our own Concourse instance where we could render our users
pipelines for the next phase of testing.

## Coded Prototype

For this second phase of User testing we asked our users to bring a [`yml`](https://en.wikipedia.org/wiki/YAML) from a
familiar pipeline that they use day to day. This would let our users easily experience the potential benefits from a
feature like Space. We were interested in observing the following interactions:

* users as they were updating their pipeline `yml` with the new syntax,
* the user reactions to the new configuration rendered in the UI
* the new pipeline UI optimized for Space

This approach has been very successful in getting our users to wrap their heads around this new paradigm and to give us
feedback on the how Space will impact their workflow.

<div style="display: grid; grid-template-columns: 33.96% 30.33% 35.71%; column-gap: 10px" markdown>
<div markdown>
![](assets/2018-06-28-designing-for-space-09.png)
</div>
<div markdown>
![](assets/2018-06-28-designing-for-space-10.png)
</div>
<div markdown>
![](assets/2018-06-28-designing-for-space-11.png)
</div>
</div>

/// caption
Screen capture of our User Test with Resource contributor Benjamin
Jung [https://github.com/headcr4sh](https://github.com/headcr4sh)
///

As we continue to test with users we ask for your participation in the conversation about Space!

* Do you think the payoff is worth the change?
* What problems will this cause for you?
* What impact would this have given your current workflow?

Head over to the GitHub issue for
feedback: [https://github.com/concourse/concourse/issues/1707](https://github.com/concourse/concourse/issues/1707)

**If you wish to participate in User Testing for this new feature please reach out
to [me](https://github.com/Lindsayauchin) directly.**
