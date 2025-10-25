---
title: Managing Teams
---

## `fly set-team`

Once you've [logged in as the `main` team with `fly`](https://concourse-ci.org/fly.html#fly-login), you can run [
`fly set-team`](#fly-set-team) to create or update other teams. Users with a [
`owner` role](https://concourse-ci.org/user-roles.html#team-owner-role) can also update their own configuration with the
same command.

For example, to create a new team that authorizes the local `foo` user, you would run:

```shell
fly -t example set-team --team-name my-team --local-user foo
```

Note that each time `set-team` is run, the team's authorization config is set _as a whole_ - it is not a stateful
operation.

There are many different ways to configure team auth; see [Configuring Auth](configuring/index.md) for more information.

Once the team has been created, you can use [`fly login`](https://concourse-ci.org/fly.html#fly-login) to log in:

```shell
fly -t example login -n my-team
```

Any newly configured pipelines (via [
`fly set-pipeline`](https://concourse-ci.org/setting-pipelines.html#fly-set-pipeline)) and one-off builds (via [
`fly execute`](https://concourse-ci.org/tasks.html#running-tasks)) will be owned by the authorized team. Commands that
list content will be scoped to the current team by default, such as [
`fly pipelines`](https://concourse-ci.org/managing-pipelines.html#fly-pipelines) and [
`fly builds`](https://concourse-ci.org/builds.html#fly-builds). The web UI will reflect the same state.

Newly configured pipelines are hidden by default, meaning other teams and unauthorized visitors cannot view them. To
make them publicly viewable, see [Pipeline & Build Visibility](exposing.md).

### Setting User Roles

By default, authorization config passed to `set-team` configures the [
`owner` role](https://concourse-ci.org/user-roles.html#team-owner-role).

More advanced [roles](https://concourse-ci.org/user-roles.html) configuration can be specified through the `--config` or
`-c` flag.

The `-c` flag expects a `.yml` file with a single field, `roles:`, pointing to a list of role authorization configs.

All the attributes in each config will vary by provider. Consult the appropriate section for your provider
under [Configuring Auth](configuring/index.md) for specifics.

For example, the following config sets three roles with different auth config for each role's provider:

```yaml
roles:
  - name: owner
    github:
      users: [ "admin" ]
  - name: member
    github:
      teams: [ "org:team" ]
  - name: viewer
    github:
      orgs: [ "org" ]
    local:
      users: [ "visitor" ]
```

## `fly active-users`

To list all users that have logged into your instance in the last two months, run:

```shell
fly -t example active-users
```

The output will include the username, connector (which method they used to authenticate) and the date of their last
login.

You can list users whose last login was within a different range by using:

```shell
fly -t example active-users --since yyyy-MM-dd
```

This can be helpful to get a sense of how active your cluster is.

## `fly teams`

To list all the teams, run:

```shell
fly -t example teams
```

This can be useful if you've forgotten your team name.

### `fly teams -d`: With Details

To list all the teams with authentication details and members, run:

```shell
fly -t example teams -d
```

This can be helpful when debugging OAuth, OIDC groups or listing all individual members.

## `fly get-team`

To show a team's configuration, run:

```shell
fly -t example get-team -n some-team
```

## `fly rename-team`

To rename a team, run:

```shell
fly -t example rename-team --old-name my-team --new-name cool-team
```

This can only be run by the [`main` team](main-team.md).

## `fly destroy-team`

To remove a team, including all of its pipelines and one-off builds, first log in as the [`main` team](main-team.md),
and then run:

```shell
fly -t example destroy-team --team-name my-team
```

Currently, if there were any workers assigned specifically to this team, they'll be orphaned, without having their
containers or volumes cleaned up.