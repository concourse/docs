---
title: The Great Process Update of 2018
date: 2018-12-20
tags:
  - blog
authors:
  - asuraci
---

![](assets/2018-12-20-the-great-process-update-of-2018-01.jpg)
/// caption
Source: [pixabay.com](https://pixabay.com/en/hangar-jet-aircraft-fighter-81779/)
///

<!-- more -->

You may have noticed that our release cadence has slowed down significantly in the past few months. The _bad news_ is we
probably won’t get a release out this year (mainly due to end-of-year vacations and slowing down in general), but the
_good news_ is the next release is huge — big enough to bump us to v5.0 — and it’s just about ready. I’ll have more
information on the next release in an upcoming post.

This post will go over all the changes we’ve made to our project structure and processes surrounding contribution. These
changes aren’t very visible to end-users, but they set the stage for the community growth and collaboration that will
make our future releases even better and bring more depth to our culture and ecosystem.

## A newly minted process for RFCs

We’ve finally established a process for submitting and accepting RFCs! Head over to
the [`concourse/rfcs` repo](https://github.com/concourse/rfcs) if you want to check it out.

This new process enables anyone in the community to have a big impact on Concourse’s direction. I’m really looking
forward to seeing where this goes. We’ll be posting status updates for RFCs on this blog to notify the community of RFCs
that are newly opened or near acceptance.

We've already started submitting RFCs for substantial features
like [Resources V2](https://github.com/concourse/rfcs/pull/1) and [RBAC](https://github.com/concourse/rfcs/pull/6),
though we jumped the gun a bit on implementation as we hadn’t yet figured out what we wanted from the RFC process (we
just needed a better way to plan things in the open). There are a few loose ends to tidy up with existing RFCs now that
we have a full process in place.

Credit where it’s due: this process based pretty heavily on [Rust’s](https://github.com/rust-lang/rfcs). Just about
every detail seemed to apply just as appropriately to Concourse, and we’re just as cautious about far-reaching changes,
so it was a great match.

## Switching from CLA to DCO

Up until now, all pull request authors have had to sign off on the Pivotal CLA in order for their pull request to be
accepted (unless it was an “obvious fix”).

On occasion contributors would get caught in a corporate quagmire when trying to get their company to sign off on the
CLA, and it was also kind of jarring for individuals. The need for something like the CLA hasn’t gone away, but we felt
it may have been hindering more than helping.

So, we’re abandoning the CLA process and instead adopting
the [Developer Certificate of Origin (“DCO”)](https://developercertificate.org) process. This process is much more
lightweight, only requiring pull request authors to include a “Signed-off-by:” line in each commit, which can be done
via `git commit -s`. More information on this is available
in [`CONTRIBUTING.md`](https://github.com/concourse/concourse/blob/master/CONTRIBUTING.md#signing-your-work).

## Completing the Great Project Restructuring of 2018

The single biggest cause of the release slowdown has
been [The Great Project Restructuring of 2018](https://github.com/concourse/concourse/issues/2534), which was a massive
revamp of how we develop, build, test, and ship Concourse. We knew this would be a “stop-the-world” transition that
would prevent us from shipping for a while, but we really had to bite the bullet at some point.

The focal point of this restructuring: almost all of Concourse’s code now lives in one
big [`concourse`](https://github.com/concourse/concourse)[monorepo](https://github.com/concourse/concourse), using the
new [Go 1.11 module system](https://github.com/golang/go/wiki/Modules) to track dependencies. We’ve replaced our
BOSH-centric development and pipeline workflow with a Docker-based workflow which is more intuitive and has a much
faster feedback cycle.

This means you can now `git clone` the [Concourse repo](https://github.com/concourse/concourse) and get a cluster built
from source and running in single command: `docker-compose up`. It’s never been easier to make changes and test them out
locally. Check out the new [`CONTRIBUTING.md`](https://github.com/concourse/concourse/blob/master/CONTRIBUTING.md) for
more information!

This change kicked off a ripple effect that improved a ton of things about the developer, contributor, and operator
experience:

- Now that all the code is together in one repo, cross-cutting changes can now be submitted as a single pull request! 🎊
  Pull requests now trigger acceptance tests too, which is something we couldn’t really do easily before.
- Resources are now versioned and shipped independently of Concourse versions. Each resource is published as
  `concourse/<name>-resource` with appropriate tags (e.g. `1.2.3`, `1.2`, `1`, `latest`, `dev`). This means you can
  refer to specific versions when necessary by using `resource_types:` in your pipeline. A core set of resource types
  will still be shipped with Concourse, at whichever version they were when the release was frozen.
- The `concourse` repo is no longer a BOSH release; we’ve split it out
  into [its own repository](https://github.com/concourse/concourse-bosh-release) instead. The new BOSH release simply
  wraps the binary distribution, rather than building from source. This reduces the surface area for support and removes
  any discrepancies between the platforms — everything just uses the binary now! This also makes deploying the BOSH
  release faster because there’s not much to compile.
- We’ve changed how the `concourse` executable is packaged. We’re switching to a `.tgz` format containing the binary and
  its dependencies, rather than a self-extracting “all-in-one” binary. This results in way fewer moving parts and
  dramatically reduces `concourse worker` start-up time.

## Where are we now?

Overall, I think these recent changes may be the most important thing we’ve done for the project since its inception,
even if it meant not shipping for a while.

The RFC process will make it easier to collaborate, switching to the DCO removes a hurdle for new contributors, and the
the new project structure should dramatically improve the developer experience.

I’d like to give special thanks to everyone that has tried out and given feedback on this new development process, and
all the users that have waited patiently for the next release. 😅

## What’s next?

Well, now that the dust is settling it’s time to actually start shipping software again. The next post will go over
what’s in store for 5.0 and peek ahead into what we’re planning for 2019. See you then!

