---
title: Concourse Update (Aug 7–10)
date: 2018-08-10
categories:
- roadmap
---

{{< image src="/images/downloaded_images/Concourse-Update--Aug-7-10-/1-QBeLayNVacbJGgBW-BhGSw.jpeg" alt="" width="
35%" >}}

<!-- more -->

As I mentioned last week, this was a short week for us in Canada due to
the [Civic Holiday](https://en.wikipedia.org/wiki/Civic_Holiday#Ontario). We did, however, manage to work on some pretty
cool stuff!

With the release of 4.0.0, we’ve been shifting our new feature focus towards Operations and Runtime. We’re intentionally
slowing down on UX to focus on regressions and UI polish for existing screens.

On to the update:

**Core**

- Continued our work on “pinning” a version of a resource across the pipeline.
  Completed [#2439](https://github.com/concourse/concourse/issues/2439) but still
  have [#2386](https://github.com/concourse/concourse/issues/2386) in flight

**Runtime**

- Wrapping up work around streaming build logs to an external
  target [#2104](https://github.com/concourse/concourse/issues/2104)
- Investigated the issue around External Worker affinity on ATCs when using external
  workers [#2312](https://github.com/concourse/concourse/issues/2312)
- Picked up the issue for adding a configurable timeout for resource and resource type
  checks [#2352](https://github.com/concourse/concourse/issues/2352)

**Operations**

- In our continued exploration of k8s Helm Chart for Concourse, we’re looking into how we might auto-magically generate
  helm chart parameters [#2472](https://github.com/concourse/concourse/issues/2472)
