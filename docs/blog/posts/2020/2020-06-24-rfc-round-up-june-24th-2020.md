---
title: 'RFC round-up: June 24th, 2020'
date: 2020-06-24
categories:
  - rfcs
---

With the four(!) RFCs from the last round-up now merged, it's time to move on to the next RFC milestone: Prototypes!

<!-- more -->

## Merged RFCs 🎉

- [RFC #31: `set_pipeline` step](https://github.com/concourse/rfcs/pull/31)
- [RFC #40: valid identifiers](https://github.com/concourse/rfcs/pull/40)
- [RFC #39: var sources](https://github.com/concourse/rfcs/pull/39)
- [RFC #27: var steps](https://github.com/concourse/rfcs/pull/27)

## RFCs ready to merge 🤞

- [RFC #37: Prototypes](https://github.com/concourse/rfcs/pull/37) is finally ready to go! For (much) further reading,
  check out the [Re-inventing resource types](../2019/2019-10-15-reinventing-resource-types.md) blog post. The importance
  of this RFC really cannot be overstated; it will be the most significant change to Concourse since its creation.
- [RFC #38: Resource Prototypes](https://github.com/concourse/rfcs/pull/38) demonstrates how the Prototype protocol may
  be used to implement the next generation of resource prototypes (formerly resource types) and gain long-requested
  functionality along the way.

## Shiny new RFCs ✨

- [RFC #62: worker pools](https://github.com/concourse/rfcs/pull/62) introduces a "worker pool" which will allow a
  many-to-many relationship between workers and teams.
- [RFC #63: API auth flow for applications](https://github.com/concourse/rfcs/pull/63) is a conversation-starter around
  adding a token-based auth flow for read-only APIs.
- [RFC #61: add "watch" parameter for API endpoints](https://github.com/concourse/rfcs/pull/61) introduces a
  long-polling approach to API requests to reduce the load from constant polling from the web UI.

## Open call for contributors 📢

The following is a list of issues for each merged RFC that still has work to be done.

- Pipeline instances: [#5808](https://github.com/concourse/concourse/issues/5808)
- Valid identifiers: [#5810](https://github.com/concourse/concourse/issues/5810)
- Finishing var sources: [#5813](https://github.com/concourse/concourse/issues/5813)
- Finishing the `set_pipeline` step: [#5814](https://github.com/concourse/concourse/issues/5814)
- Implementing the `get_var` step: [#5815](https://github.com/concourse/concourse/issues/5815)

If anyone's interested in throwing their hat into the ring and getting involved with Concourse development, let us know
by replying to one of the issues linked above! Future RFC round-ups will include the same list, presumably with more
entries.

The v10 roadmap is highly parallelizeable, so if more people get involved we can make it to v10 much more quickly and
with a healthier project that has more people able to contribute. We're super keen to give guidance and help out. 👌

Thanks!

