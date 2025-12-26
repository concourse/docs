---
title: Upgrading Concourse
---

Be careful to check the "Breaking Changes" in the release notes - in particular, you'll want to look for any flags that
have changed.

## Upgrading the Web Node

The web node is upgraded by stopping the Concourse process, swapping out the `concourse` binary with the new one, and
re-starting it.

Each [`web` node](running-web.md) will automatically run database migrations on start-up and lock via the database to
ensure only one of the web nodes runs the migrations. We currently do not guarantee zero-downtime upgrades, as
migrations may make changes that confuse the older web nodes. This should resolve as each web node is upgraded, and
shouldn't result in any inconsistent state.

Typically, Concourse can be upgraded from any version to any other version, though around 3.x and 4.x we made some
changes to how migrations are run, and as a result the following upgrade paths must be followed:

| Current Version                                                        | Upgrade Path                                                                                                                                           |
|------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| < [v3.6.0](https://github.com/concourse/concourse/releases/tag/v3.6.0) | [v3.6.0](https://github.com/concourse/concourse/releases/tag/v3.6.0) -> [v4.0.0](https://github.com/concourse/concourse/releases/tag/v4.0.0) -> latest |
| = [v3.6.0](https://github.com/concourse/concourse/releases/tag/v3.6.0) | [v4.0.0](https://github.com/concourse/concourse/releases/tag/v4.0.0) -> latest                                                                         |

We'll try to minimize this kind of thing in the future.

Lastly, you will want to overwrite the contents of `concourse/fly-assets` with the contents from
the [GitHub release tarball](https://github.com/concourse/concourse/releases) so users can [
`fly sync`](../fly.md#fly-sync) to the correct version.

## Upgrading the Worker Node

The worker node is upgraded by stopping the Concourse process, swapping out the `concourse` binary with the new one, and
re-starting it.

### Linux Workers

The Linux tarball from the [GitHub release page](https://github.com/concourse/concourse/releases) contains extra assets
that you will want to ensure are also upgraded at the same time. Make sure you overwrite the contents of the following
directories:

* `concourse/bin/...` - Other binaries like `gdn`, `runc`, and `containerd` are in this directory
* `concourse/resource-types/...` - The location of the
  default [resource-types](../resource-types/index.md) included with each Concourse release

### Darwin and Windows Workers

There are no additional steps for upgrading Darwin and Windows workers.