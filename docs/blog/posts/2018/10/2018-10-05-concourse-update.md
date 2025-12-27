---
title: Concourse Update (Oct 1–5)
date: 2018-10-05
categories:
- product-update
authors:
  - jamesma
---

[Alex Suraci](https://medium.com/u/263a63b2f209) is still tackling the chores on our One Big Repo
issue [#2534](https://github.com/concourse/concourse/issues/2534). Specifically, Alex is re-writing a new pipeline (
aka [concourse](https://ci.concourse-ci.org/teams/main/pipelines/concourse)) for our mono-repo structure so we can
unblock ourselves from releasing updates.

<!-- more -->

In other news, Concourse engineer [Saman Alvi](https://medium.com/u/d40e22ec1cfa) wrote up a short article on her
experience pairing with a product designer during a discovery into
the [PivNet resource](https://github.com/pivotal-cf/pivnet-resource); check it
out: [Design & Dev Pairing: What we learned during a one week technical discovery](2018-10-05-design-dev-pairing.md).

Finally, the Concourse team will be taking Monday, Oct 5 off to
celebrate [Thanksgiving](https://en.wikipedia.org/wiki/Thanksgiving_%28Canada%29). We’ll see you all next week!

On to the update:

**RBAC**

We continue to work on the proposal for [Role Based Access Control (RBAC)](https://github.com/concourse/rfcs/pull/6). In
the past few weeks we’ve been focusing more on the _experience_ of assigning roles to new users. Our early attempts at
this was to require operators to supply those changes through the fly CLI:

```shell-session
fly -t mytarget set-team -n myteam --role viewer --allow-all-users

fly -t mytarget set-team -n myteam --role member --github-user pivotal-jwinters --github-team myorg:myteam
```

This raises some questions though: how do you go about removing a role from a user on a team? should the role parameters
be additive, or overriding like the other flags? Also, that’s a lot of flags to supply through the set-team command,
maybe this belongs in a configuration file.

So with that we decided to move all of the user role configurations into a config file. We think that’ll be much
cleaner. Hop on over to
the [updated RFC](https://github.com/pivotal-jwinters/rfcs/blob/proposal/rbac/03-rbac/proposal.md)for the update
details.

**UX**

- We’ve been doing some much needed refactoring on the Elm frontend code. That’s also let us pick up some design polish
  stories like [#2434](https://github.com/concourse/concourse/issues/2434)
  and [#2430](https://github.com/concourse/concourse/issues/2430)
- The team has also had the opportunity to pick up a lot of issues around the fly
  CLI: [#2532](https://github.com/concourse/concourse/issues/2532), [#963](https://github.com/concourse/concourse/issues/2430), [#1062](https://github.com/concourse/concourse/issues/2430)

**Core**

- Space is back…but really it never left! With the hard work of resource pinning and global caching, we’re now ready to
  resume the work around Spatial resources [#2651](https://github.com/concourse/concourse/issues/2651)

**Runtime**

- Finished [#1799](https://github.com/concourse/concourse/issues/1799) “Permit overlapping inputs, outputs and task
  caches

**Operations**

- We finished [#2312](https://github.com/concourse/concourse/issues/2312)!!!&nbsp;….except we DO need to do some
  acceptance testing to make sure we’ve covered all our bases.
