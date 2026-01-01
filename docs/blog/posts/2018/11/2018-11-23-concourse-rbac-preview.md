---
title: Concourse RBAC Preview
date: 2018-11-23
authors:
  - jamesma
---

![](assets/2018-11-23-concourse-rbac-preview-01.jpg)
/// caption
By Danpaluska — Own work,
CC0, [https://commons.wikimedia.org/w/index.php?curid=17686969](https://commons.wikimedia.org/w/index.php?curid=17686969)
///

<!-- more -->

One of the big themes for Concourse in 2018 has
been [Users](https://concourse-ci.org/download.html#v400), [multiple auth connectors](https://concourse-ci.org/install.html#auth-config),
and role-based access control (
aka [RBAC](https://github.com/pivotal-jwinters/rfcs/blob/proposal/rbac/03-rbac/proposal.md)). With RBAC in the final
phases of development, I wanted to give you a preview of some of the functionality that you can expect in our upcoming
release; Concourse 5.0

## Admins, Owners, Members and Viewers

Concourse 5.0 will come with 4 roles: Concourse Admin, Team Owner, Team Member, and Team Viewer.

### Concourse Admin

A Concourse Admin is the same as today’s [admin user](https://concourse-ci.org/main-team.html). Members of `main` team
will automatically be Concourse Admins* and have the ability to administrate teams with `fly`: `set-team`,
`destroy-team`, `rename-team`, and `teams`. Given that all Concourse Admins must be a member of the main team, all
Concourse Admins must have at least one other role; and that should typically be the Team Owner role.

_* There’s an open issue to restrict this grant to Team Owners on `main`
in [#2846](https://github.com/concourse/concourse/issues/2846)_

### Team Owner

Team Owners have read, write and auth management capabilities within the scope of their team. For those familiar with
Concourse today, the scope of allowed actions for a Team Owner is very closely aligned to today’s Concourse team member.
The new change is that you can no longer rename your own team or destroy your own team as an owner.

### Team Member

Team Member is a new role that lets users operate within their teams in a read & write fashion; but prevents them from
changing the auth configurations of their team.

### Team Viewer

Team Viewer is also a new role that gives users “read-only” access to a team. This locks everything down, preventing
users from doing a `set-pipeline` or `hijack`.

### Other Roles

We considered other role types while developing this feature; including roles that would specifically prevent
`intercept` and `abort`. We ultimately decided that our current configuration made more sense for the first release of
RBAC. Ultimately every organization will have different needs for their access control, so we are also planning for a
future where users can supply their own customized roles & permissions matrix.

### Full Roles Breakdown

For a full list of each role’s allowed actions you can reference our handy permission matrix on Google
Sheets [here](https://docs.google.com/spreadsheets/d/1np3hyJy3mVRfB2gcgKykz3QTQg5qEj28QgK523SEmao/edit#gid=1437859537).

## Configuring Roles with `fly`

Now that we’ve gone over the new roles, we can do a quick overview of how we can go about setting users & roles on
teams.

### Default Behaviour

By default, if no configuration is provided the user is given theTeam Owner role:

```shell
fly -t dev set-team -n PowerRangers --local-user=Zordon
```

This behaviour also applies to groups as well, so be careful!

```shell
fly -t dev set-team -n A-Team \
  --github-team=MightyMorphin:PowerRangers
```

### Specifying Roles with `-c`

Roles must be specified in a separate configuration file using the `-c`

```shell
fly -t dev set-team -n PowerTeam -c ./team.yml
```

`team.yml`:

```yaml
roles:
  - name: owner
    local:
      users: [ "Zordon" ]
  - name: member
    local:
      users: [ "RedRanger", "BlueRanger", "GreenRanger" ]
  - name: viewer
    local:
      users: [ "Alpha" ]
```

### Inspecting Roles Configuration

Once you’ve set the team configuration you can verify it using the details flag on `fly teams`:

```shell
fly -t dev teams -d

name users groups
A-Team/member local:RedRanger, BlueRanger, GreenRanger none  
A-Team/owner local:Zordon none  
A-Team/viewer local:Alpha none
```

...where you’ll find the output is now updated to list each `team/role` combination and its associated users/groups.

## What’s left?

And that’s RBAC in a nutshell! We’re really excited to get this in your hands in our upcoming release of Concourse.
There’s only a few more issues that we want to finish off before releasing this feature, specifically:

- [#2846](https://github.com/concourse/concourse/issues/2846) Admin users should be restricted to members of the `main`
  team with the `owner` role. This is so you don’t get weird cases of a Team Viewer on `main` getting Admin access
- [#2843](https://github.com/concourse/concourse/issues/2843) Dashboard team labels updated to display User Role. We
  need this otherwise users on the Web UI have no idea what they can / can’t do
