---
title: "PSA: The Great Code Restructuring of 2018"
date: 2018-08-15
authors:
  - asuraci
---

Hi y’all!

As anyone trying to contribute will have probably noticed by now, we have a bunch of repos, and most of them are
inter-dependent. This makes it difficult to contribute PRs, because you’ll often have to PR to `fly`, `go-concourse`,
and `atc` and cross-reference them. But then each of their builds will fail because they won’t have their dependent
changes (e.g. `fly` will fail until `go-concourse` is merged and bumped, but `go-concourse`'s build will fail until
`atc` is merged and bumped, which we don’t want to do because the other builds are failing!).

<!-- more -->

Another, more human problem: our repo names are just plain ol’ confusing. The toplevel `concourse/concourse` repo is
actually our BOSH release, because it happened to be a good fit to also act as our `$GOPATH`. But then we have all the
_actually important_ code living in a repo called `atc` (wat?). The `fly` repo name makes sense 'cause that’s the name
of the CLI, but then there are components like `tsa` and `skymarshal` and nothing makes sense anymore. (Also our
metaphors are all over the place.)

Finally, Go 1.11 is coming out soon (RC1 is out now) and its new support for ["Go modules"](https://go.dev/wiki/Modules)
is looking like the best thing since sliced bread. We’ve been looking for a way out from our submodule hell for a long
time, and it looks like our savior is here. But in relying so heavily on Git submodules we’ve papered over lots of
coupling that has existed between these repos, because it’s been so easy to pin to the specific refs that work together.
Go’s module system will only make this more painful, because our API contracts between the repos just aren’t strong
enough. And it won’t help at all for people contributing PRs.

So, here’s the plan:

* Rename `concourse` to `concourse-bosh-release`. This will make it clearer that the BOSH release is just one
  distribution method, not the centerpiece of all of Concourse.
* Introduce a new `concourse` repo which will contain the sum of `atc`, `fly`, `go-concourse`, `tsa`, and any other
  components that are strongly inter-dependent.
    * In doing this, we’ll try to carefully name things and demarcate portions that should be separate. We don’t want
      this to _encourage_ tight coupling, only to express the current state of things.
    * This would be a good time to come up with clearer names for things. These names are cute but not exactly clear for
      someone wanting to come in and find where they need to change code for the feature they want to implement.
* Somehow keep all the GitHub issues on `concourse/concourse`. This might mean we actually gut the repos instead of
  renaming them. But I don’t want to lose the commit history, so this may be difficult.
  Once all this is done it should be much easier to submit larger changes as PRs, and contributing to Concourse should
  feel a lot more intuitive.

We’re still early in the planning stages for this, but I thought I’d give the community a heads-up so y’all know what
we’re doing. I don’t expect this to take _that_ long, but it is inherently a “stop the world” process. This may mean
some PRs have to be re-submitted if they’re made just prior to us moving everything around. I’ll try to whittle down the
number of PRs before we make any big moves.
