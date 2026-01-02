---
title: Project
---

Concourse began as a side-project by [`@vito`](https://github.com/vito) and [`@xoebus`](https://github.com/xoebus)
in 2014. Since then, Concourse has evolved into a dedicated community with contributors from all around the world.

Concourse is a project of the [Cloud Foundry foundation (CFF)](https://www.cloudfoundry.org/), currently lead
by [Taylor Silva](https://github.com/taylorsilva/) and [Derek Richard](https://github.com/drich10). The CFF pays for the
infrastructure costs of the project. [Pixel Air IO](https://pixelair.io/), lead by Taylor, is currently the main
developer behind Concourse; reviewing and merging Pull Requests, squashing bugs, and stewarding the project and
community.

## Where is everything?

* The [Concourse repo](https://github.com/concourse/concourse) houses the main codebase, where planning happens, and
  where issues are tracked.
* The [Docs repo](https://github.com/concourse/docs) contains the source for the website you're reading now!
* [GitHub Discussions](https://github.com/concourse/concourse/discussions) are used for support, announcements, idea
  sharing, and general conversations.
* The [Concourse blog](https://blog.concourse-ci.org/) features tutorials and updates from the development perspective.
* The [Concourse Discord server](https://discord.gg/MeRxXKW) offers a great space to chat with other contributors.
* The Concourse working group charter is available in the Cloud
  Foundry [community repo](https://github.com/cloudfoundry/community/blob/main/toc/working-groups/concourse.md).
* The working group holds public monthly meetings. Past meetings can be viewed in
  this [YouTube playlist](https://www.youtube.com/watch?v=Vamezx1SePw&list=PLhuMOCWn4P9ji8ZCY2a-FvMeT7S74-Hhm) and
  meeting notes
  are [here](https://github.com/cloudfoundry/community/blob/main/toc/working-groups/WORKING-GROUPS.md#concourse).

## Why make Concourse?

When working on a substantial project, having a pipeline to reliably test, deploy, and publish the product is essential
for rapid iteration.

But with every CI system we tried, we found ourselves repeatedly facing the same problems: complex configs buried in
many pages of the web UI, uncertainty about who changed what & when, managing dependencies and state on the workers,
build contamination, frustrating UX...

Our project was expanding, and with every box we checked and for every worker we manually configured, the anxiety of
having to rebuild everything if something failed grew increasingly. We began writing software to manage our CI instead
of creating the software for the product we intended to build.

We created Concourse to be a CI system that provides peace of mind. A CI that's straightforward enough to fully
understand and easy to maintain as your project grows; both in the complexity of the product and the size of your team.
We aimed to build a CI with robust abstractions and fewer concepts to learn, making it easier to comprehend and allowing
Concourse to evolve gracefully.

## How can I help?

Concourse is a free and Open Source software project that depends on the contributions of sponsors and volunteers
worldwide.

If you're interested in contributing, head over to GitHub and check out
the [contributing docs](https://github.com/concourse/concourse/blob/master/CONTRIBUTING.md)!

If you're able to financially contribute to the continued development of Concourse, please reach out
to [Taylor](https://github.com/taylorsilva/).

## Report a security issue

To report a security issue, please email [security@concourse-ci.org](mailto:security@concourse-ci.org).

Security advisories will be published
as [`concourse/concourse` GitHub Security Advisories](https://github.com/concourse/concourse/security/advisories).

## Thanks

It's been a long journey and we're grateful to many people for our continued success. We are deeply indebted to all who
help sustain this project, but the extraordinary efforts of the following organizations deserve special recognition.

### Pivotal

Concourse wouldn't be what it is today without [Pivotal](https://pivotal.io/). This extends beyond the sponsorship,
which began in early 2015 - without the experiences we gained and the practices we learned while working
on [Cloud Foundry](https://cloudfoundry.org/) and [BOSH](https://bosh.io/), we would have neither the technical
expertise nor the strong opinions that led to Concourse's creation.