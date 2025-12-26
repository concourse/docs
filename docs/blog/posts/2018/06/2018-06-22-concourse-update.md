---
title: Concourse Update (Jun 18–22)
date: 2018-06-22
categories:
  - product-update
---

{{< image src="/images/downloaded_images/Concourse-Update--Jun-18-22-/0-iPsCYY5ob7h-bSKD.jpg" alt="" width="100%" >}}

<!-- more -->

It’s been a busy week for myself and [Topher Bullock](https://medium.com/u/58876cdc2180). We spent some time in Boston
meeting with some users operating large-scale Concourses. We learned a lot about the issues they were running into
operating Concourse a scale…and we ate a lot of Lobster!

On to the update:

**UX:**

- Made some improvements to the build page in issue [#1543](https://github.com/concourse/concourse/issues/1543) that
  we’re hoping to test soon on our internal Concourse. You can read into some more of the details in
  our [comments](https://github.com/concourse/concourse/issues/1543#issuecomment-398188077).
- Expanded our PR pipelines in [#2305](https://github.com/concourse/concourse/issues/2305) to run web tests as a part of
  pulling in the PR for Shareable Search on dashboard [#2265](https://github.com/concourse/concourse/issues/2265).
- Started the move of the dashboard/ view to be the root level page (
  issue [#2282](https://github.com/concourse/concourse/issues/2282)) by adding Logout to the dashboard page
  in [#1663](https://github.com/concourse/concourse/issues/1663)

**Core**

- Continued our struggle to finish off Users work with some fixes to migrations and breakages to our own testing
  pipeline
- Continued with our user testing on Spatial Resources. We’re getting more confident with the designs, so we added a
  story to bring those designs into beta/ in issue [#2292](https://github.com/concourse/concourse/issues/2292)
