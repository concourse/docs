---
title: Concourse Update (April 8–18)
date: 2019-04-18
categories:
- product-update
---

{{< image src="/images/downloaded_images/Concourse-Update--April-8-18-/1-gTTAFBV8KHzEL0CV-I-_kA.jpeg" alt="Roman
Alekseenkov from Aptomi giving a talk on Concourse at the Bay Area User Group" width="50%" >}}

<!-- more -->

Sorry for missing the update last week. I was travelling out to the Bay area to attend the ConcourseCI Bay Area User
Group. For those who missed it, you can find a recording of the
event [here](https://www.youtube.com/watch?v=1RRZHPlTkXs). On to the update.

{{< image src="/images/downloaded_images/Concourse-Update--April-8-18-/1-QqwW-_RArz5a_sprZC7PZw.png" width="100%" >}}

In case you missed it, Concourse 5.1.0 is out! It’s got icons on resources, better garbage collection, `on_error` on
pipelines, and much more! As usual, you can read the full list of new
features [here](https://concourse-ci.org/download.html#v510).

Other interesting developments:

- The runtime team has been looking into the administrative overhead of running tasks on workers. The results are pretty
  sobering. More to come next week!
- We’re still looking into the k8s Tekton integration. We expect things to pick up in pace starting next week, where
  we’ll have a few more Pivots lending a helping hand. Again, you can find our
  RFC [here](https://github.com/concourse/rfcs/pull/22)
- The sidebar is coming [back](https://github.com/concourse/concourse/issues/2440), and we’re exploring how we can
  extend the [search and filtration capabilities](https://github.com/concourse/concourse/issues/3630) across Concourse
- I added a section called “Concourse Users” on
  our [Community page](https://concourse-ci.org/community.html#concourse-users). This is just some of the companies and
  folks that have spoken about their Concourse usage in the past. If you’d like to add to that list feel free to make
  a [PR here](https://github.com/concourse/docs/blob/master/lit/concourse-users.lit)
