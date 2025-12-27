---
title: Concourse Update (August 20–24)
date: 2018-08-24
categories:
  - product-update
authors:
  - jamesma
---

{{< image src="/images/downloaded_images/Concourse-Update--August-20-24-/0-9tKyl-ikt-ttbS_z.jpg" alt="Logs and
resources" width="25%" >}}

<!-- more -->

### Kubernetes

As we continue our sporadic work on Kubernetes and its Helm chart, we’re also starting to expand our thinking to cover
the runtime aspects of Concourse + Kubernetes. We’ve already prioritized the need to have Kubernetes as a supporting
backend in addition to Garden, but what about the spiffy new developments in the Kubernetes world? We’re hearing a lot
about [knative](https://github.com/knative/) and knative services like [build](https://github.com/knative/build)
and [eventing](https://github.com/knative/eventing). Are there any kubernetes users who’d like to weigh in on the topic?
Let us know on our[forums!](https://discuss.concourse-ci.org/t/kubernetes-knative/573)

### Request for Comment

We’ve written a new RFC
titled: [Merge](https://github.com/clarafu/rfcs/blob/master/05-recursive-resources/proposal.md)[resource](https://github.com/clarafu/rfcs/blob/master/05-recursive-resources/proposal.md)[and](https://github.com/clarafu/rfcs/blob/master/05-recursive-resources/proposal.md)[resource\_type](https://github.com/clarafu/rfcs/blob/master/05-recursive-resources/proposal.md)
s. This RFC came about as a result of the work in pinning resources
and [#2386](https://github.com/concourse/concourse/issues/2386). You can comment on the RFC
PR [here](https://github.com/concourse/rfcs/pull/8)

We are also stuck on [#2104](https://github.com/concourse/concourse/issues/2104) **Streaming of Build Logs to Additional
Target.** We’re specifically looking on feedback on the following questions before moving forward:

- Our test for syslog is flakey: failing/hanging sometimes
- Need to backfill a test for updating the drained column
- What metadata do we want to send with the build log? team/pipeline/job/build names?
- Is there a possibility for the build logs to be reaped before they are drained?
- What kind of database locks do we need for the operation?

If you have an insight to shed on these questions, please hop on over to the
issue [#2104](https://github.com/concourse/concourse/issues/2104)

Here are the rest of the updates for this week:

**UX**

- Long pipeline names in the dashboards will now have a tooltip to let you read the full pipeline
  name [#2411](https://github.com/concourse/concourse/issues/2411)
- Login button alignment on mobile views is pushed up [#2433](https://github.com/concourse/concourse/issues/2433)

**API**

- Finished up the work on the multiple ATC login issue [#2425](https://github.com/concourse/concourse/issues/2425). The
  fix for this will require a db migration in the next version of Concourse!
- Added the ability to do a fly check-resource-type [#2507](https://github.com/concourse/concourse/issues/2507) in order
  to support [#2494](https://github.com/concourse/concourse/issues/2494)resource type check\_timeout

**Core**

- Continued work on issue [#2386](https://github.com/concourse/concourse/issues/2386) Equivalent resources defined
  across pipelines and teams should only correspond to a single version history. The work here has led to the creation
  of the new RFC mentioned
  above: [Merge](https://github.com/clarafu/rfcs/blob/master/05-recursive-resources/proposal.md)[resource](https://github.com/clarafu/rfcs/blob/master/05-recursive-resources/proposal.md)[and](https://github.com/clarafu/rfcs/blob/master/05-recursive-resources/proposal.md)[resource\_types](https://github.com/clarafu/rfcs/blob/master/05-recursive-resources/proposal.md)

**Operations**

- We’ve picked up an issue that aims to be better at inferring defaults for peer/external
  URLS [#2519](https://github.com/concourse/concourse/issues/2519). This should help with some of the 4.0.0 upgrade and
  installation issues.
