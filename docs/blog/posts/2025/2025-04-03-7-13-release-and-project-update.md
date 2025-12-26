---
title: v7.13.0 Release and Project Update
date: 2025-04-03
authors:
  - tsilva
---

First minor release of 2025! This release is FULL of bug fixes, performance improvements, and even a few new features.
I'll start with a quick project update and then dive into the exciting things you can find in this release.

<!-- more -->

## Concourse Joins the Cloud Foundry Foundation

Concourse officially joined the [Cloud Foundry Foundation](https://www.cloudfoundry.org/)
back [in February](https://github.com/cloudfoundry/community/pull/1047). [Derek Richard](https://github.com/drich10)
from Broadcom deserves the credit for making this happen. This was one of those tasks that so many folks have wanted to
happen over the last few years, but through all the acquisitions (Pivotal -> VMware -> Broadcom) it kept getting started
and stopped over and over and over. A HUGE thanks to Derek for finally making this happen.

There are still some small stuff transitioning behind the scenes that Derek is taking care of. You can watch
our [monthly working group meetings](https://www.youtube.com/watch?v=x2v9xFGH2Rg&list=PLhuMOCWn4P9ji8ZCY2a-FvMeT7S74-Hhm)
for more details or chat with us on [Discord](https://discord.gg/MeRxXKW) if you have any questions about this.

Now let's get into the details about 7.13.0!

## 🎉 v7.13.0

Like any release, I recommend reading the [release notes](https://github.com/concourse/concourse/releases/tag/v7.13.0)
for all the details. I'm going to call out some of the big ticket items here though.

Overall this release is light on new features, but is packed full of bug fixes, optimizations, and upgrades.

## Breaking Change for PgBouncer users

We've migrated our database driver from [lib/pq](https://github.com/lib/pq)
to [jackc/pgx](https://github.com/jackc/pgx). `lib\pq` has been in maintenance mode for years now and the majority of
the Go community now uses `pgx` as the preferred Postgresql driver.

This means we had to remove the `CONCOURSE_POSTGRES_BINARY_PARAMETERS` flag because it was exposing a feature specific
to `lib/pq`. As far as I know, this flag was introduced and used by PgBouncer users. There is a similar flag that pgx
exposes, but based on [recent pgx discussions](https://github.com/jackc/pgx/discussions/1784) and
the [PgBouncer release notes](https://www.pgbouncer.org/2025/01/pgbouncer-1.24.0), it seems there shouldn't be any
issues for PgBouncer users of Concourse as long as you're using PgBouncer >1.21.0. Concourse has never made any promises
about compatibility with PgBouncer, but if PgBouncer users have any issues I'll gladly review a PR to improve the
situation for you folks.

Thankfully this is the only breaking change and I don't plan to make any new breaking changes outside of a Major version
bump. The scope of this one seemed quite small which is why I decided to push this out in a Minor version bump.

## New Features

* [@A1kmm](https://github.com/A1kmm) added `CONCOURSE_CONTAINERD_PRIVILEGED_MODE` to the `concourse worker` command.
  This is useful for the security-conscious operator and limits the permissions that privileged containers can get while
  still allowing tools like Podman and Buildah to work. You can also use this flag to disable the use of privileged
  containers completely. [PR 9017](https://github.com/concourse/concourse/pull/9017)
* [@analytically](https://github.com/analytically) added a `background_filter` option to the `display` field, which
  allows you to specify [CSS filters](https://developer.mozilla.org/en-US/docs/Web/CSS/filter) on your pipeline
  background images. Useful if you're tired of grey backgrounds and want more colour in your pipelines
  🌈 [PR 9117](https://github.com/concourse/concourse/pull/9117)
* [@IvanChalukov](https://github.com/IvanChalukov) added the `--team` flag to the `containers` and
  `clear-resource-cache` fly commands.
  PRs [9106](https://github.com/concourse/concourse/pull/9106), [9107](https://github.com/concourse/concourse/pull/9107)

Like I said, this release is light on new features. Most of the work went into fixing long-standing bugs and updating
the code base.

## 💫 UUID Collisions?!

If you search _"what are the chances of a UUID collision?"_ in your preferred search engine, you'll find many comments
stating _"You're more likely to be killed by a gamma ray than get a UUID collision"_, usually with a caveat that you're
generating v4 UUID's. Well, I have _another_ caveat to add to that statement: the library you're using to generate UUID'
s implements [RFC 9562](https://datatracker.ietf.org/doc/html/rfc9562) correctly!

If you want one reason to upgrade to 7.13.0, I'd say this is why. All versions prior to this release will occasionally
have UUID collisions when creating containers and volumes. I'm not sure how often this happens, it could be every 1,000
or 100,000,000, calls to `uuid.New()`, but it **definitely does happen**. On a low-usage cluster we only saw it once.
The error we saw was this one:

```
container "bba06975-46f6-4bbe-73f5-9e39a869719a": already exists
```

The UUID library we were using was the most popular library at the time. Concourse has been using this library from the
very beginning. I'm sure it's been the source of a handful of weird "ghost in the machine" type of errors over the
years. We can now lay this ghost to rest! We are now using the [github.com/google/uuid](https://github.com/google/uuid)
library instead.

[PR 9083](https://github.com/concourse/concourse/pull/9083) for full details.

## Fly Login With Chrome

If you use a Chromium web browser and have tried to `fly login` you've definitely run into this bug where Chrome says "
your token could not be sent to fly", but saw that it _was_ sent to fly. What
gives? [Preflight requests](https://developer.chrome.com/blog/private-network-access-preflight/) is what gives! You
write your web app to send _one_ HTTP request and SURPRISE, Chrome sends a bonus second request first!

The `fly` CLI will now handle this ⭐special bonus⭐ preflight request from Chrome, give Chrome the thumbs up, and then
wait until the real request from Concourse actually comes through. You'll now see a "login successful!" message when you
`fly login` now.

[PR 9051](https://github.com/concourse/concourse/pull/9051) for full details.

There is of course another browser bug that's been annoying users for the last few years...

## Preserve Existing Browser Session

After you did that janky `fly login` with Chrome, you'd then run into another issue. You had a tab open and logged into
Concourse before logging in with `fly`. Now when you go back to that tab and click around in the UI you get told to
login AGAIN. What gives?!

[@IvanChalukov](https://github.com/IvanChalukov) dove into this issue and fixed it. I can only imagine the amount of
hours he spent debugging this issue. The TL;DR is that a CSRF token got wrapped in quotes and the quotes were then
considered part of the token, resulting in an invalid CSRF check server-side. Thank you Ivan for fixing this mild but
annoying bug. Many browser sessions will now be saved! 🙏

[PR 9109](https://github.com/concourse/concourse/pull/9109) for full details.

## Everything Else

Those are the big bugs that I think most people will be excited to see fixed. There's also been a lot of chore-level
changes as well. Concourse is quite a big application and has a lot of dependencies. I think we've done a good job of
dusting things off and upgrading things. Here's a quick rundown of the other exciting things in this release:

* This release is built with [Go 1.24](https://go.dev/blog/go1.24), gaining the performance improvements from that
  release, which boasts a 2-3% decrease in CPU
* [@analytically](https://github.com/analytically) upgraded a bunch of stuff in the web frontend:
    * Upgraded Graphviz from v2.47.1 to v12.2.1
    * Upgraded D3js from v3.5.5 to v7
    * Updated Material Design Icons from v5.0.45 to 7.4.47, adding 2,350 new icons to use in your pipelines!
    * Reduced the size of all SVG's using [svgo](https://svgo.dev/)
    * Replaced the unmaintained [NYTimes/gziphandler](https://github.com/NYTimes/gziphandler)
      with [klauspost/compress](https://github.com/klauspost/compress/), giving a performance boost to all HTTP
      endpoints.
* [@IvanChalukov](https://github.com/IvanChalukov) and [@Kump3r](https://github.com/Kump3r) upgraded our fork of Dex to
  use the CF v3 API, ensuring users of CF Auth aren't locked out of their Concourse when the CF v2 API goes away.
* The experimental warning seen during the `set_pipeline` step is now gone. It's interface and current behaviour are
  considered stable.
* Modernization of the Go codebase, mostly removing usage of deprecated Go functions and other similar improvements.
*
The [registry-image](https://github.com/concourse/registry-image-resource), [s3](https://github.com/concourse/s3-resource),
and [semver](https://github.com/concourse/semver-resource) resources have been updated to use v2 of the AWS Go SDK.
While making this change I've also changed the authentication behaviour when these resources are interacting with AWS.
They will now use the default authentication chain that the AWS SDK uses. This means these resource types can now use
the Concourse Worker's IAM role and static credentials are no longer required to use these resources.
* [@mariash](https://github.com/mariash) enabled cgroupv2 support for the Guardian runtime, enabling the use of the
  Guardian runtime on newer kernel versions.
* I updated Concourse's seccomp profile to include newer syscalls, bringing it inline with the default seccomp profile
  from Docker and Containerd.
* Shout-out to [@aliculPix4D](https://github.com/aliculPix4D) and the folks at Pix4D for testing and finding some last
  minute critical bugs before the release went out.
* Shout-out to [@IvanChalukov](https://github.com/IvanChalukov) and [@Kump3r](https://github.com/Kump3r) from SAP for
  their help testing Concourse on Bosh.

Again, read the [release notes](https://github.com/concourse/concourse/releases/tag/v7.13.0) for everything that's been
fixed or improved.

Thank you everyone that contributed to this release. If you find any bugs, open an issue
on [GitHub](https://github.com/concourse/concourse/).

* [GitHub Release](https://github.com/concourse/concourse/releases/tag/v7.13.0)
* [Docker Hub Image](https://hub.docker.com/r/concourse/concourse)
* [Helm Chart](https://artifacthub.io/packages/helm/concourse/concourse)
* [Bosh Release](https://bosh.io/releases/github.com/concourse/concourse-bosh-release?all=1)

## 🍎 One More Thing...

Myself and my co-founders are happy to officially launch [CentralCI](https://centralci.com/), a company providing
managed Concourse clusters. We run Concourse for you, owning the operational overhead of running Concourse. We've put a
lot of effort into solving some common pains that operators of Concourse have, allowing you to focus on writing your
pipelines.

You can learn more about CentralCI in
our [introduction blog post](https://centralci.com/blog/posts/introducing_centralci).
