---
layout: post
title: 'RFC round-up: July 10th, 2020'
date: 2020-07-10
categories:
  - rfcs
---

Happy Friday! This one's brief.

<!-- more -->

## Merged RFCs

- [RFC #37: prototypes](https://github.com/concourse/rfcs/pull/37) has landed! ...but it probably could have use more
  detail regarding the `run` step, which is the only immediately actionable part of it. 🤔 I'll draft another RFC for
  that; #37 mainly covered the protocol.
- [RFC #38: resource prototypes](https://github.com/concourse/rfcs/pull/38) is in! Its associated issue for
  implementation is [#5870](https://github.com/concourse/concourse/issues/5870).

## RFCs to merge

- n/a - taking a breather for this round-up to focus on the below RFCs and "reset" the 2 week merge window so I can
  start publishing these posts earlier in the week. 😅

## RFCs in need of feedback

- [RFC #43: tasks queue](https://github.com/concourse/rfcs/pull/43) still needs some love! The goal is to introduce a
  queuing mechanism to resolve the long-running issue of Concourse over-working workers.
- [RFC #29: `across` step](https://github.com/concourse/rfcs/pull/29) introduces the special sauce for build matrices
  and branch/PR pipeline automation, and the proposal has been heavily revised. Check it out!

## Open call for contributors

Valid identifiers ([#5810](https://github.com/concourse/concourse/issues/5810)) is now spoken for -
thanks [@mouellet](https://github.com/mouellet)! 🍻

The following issues are up for grabs:

- Pipeline instances: [#5808](https://github.com/concourse/concourse/issues/5808)
- Finishing var sources: [#5813](https://github.com/concourse/concourse/issues/5813)
- Finishing the `set_pipeline` step: [#5814](https://github.com/concourse/concourse/issues/5814)
- Implementing the `get_var` step: [#5815](https://github.com/concourse/concourse/issues/5815)

If anyone's interested in helping out, or just learning how, let us know by replying to any of the issues linked above
or asking in [Discord](https://discord.gg/MeRxXKW)!

This section will be repeated in each RFC round-up - the goal is to get to the finish line on the v10 roadmap by
tackling items in parallel while improving project health by enabling more people to make significant contributions.

Thanks everyone!

