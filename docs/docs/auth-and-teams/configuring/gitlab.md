---
title: GitLab Auth
---

A Concourse server can authenticate against GitLab to leverage their permission model.

## Authentication

First you need to [create an OAuth application on GitLab](https://gitlab.com/-/user_settings/applications) with the
following scopes:

* read_user
* openid

The "Authorization callback URL" must be the URL of your Concourse server with `/sky/issuer/callback` appended. This
address must be reachable by GitLab - it can't be `localhost`.

For example, Concourse's own CI server's callback URL would be:

```
https://ci.concourse-ci.org/sky/issuer/callback
```

You will be given a Client ID and a Client Secret for your new application. The client ID and secret must then be
configured on the [`web` node](../../install/running-web.md) by setting the following env:

```properties
CONCOURSE_GITLAB_CLIENT_ID=myclientid
CONCOURSE_GITLAB_CLIENT_SECRET=myclientsecret
```

If you're configuring a self-hosted GitLab instance, you'll also need to set the following flag:

```properties
CONCOURSE_GITLAB_HOST=https://gitlab.example.com
```

The GitLab host must contain a scheme and not a trailing slash.

## Authorization

Users and groups can be authorized for a team by passing the following flags
to [fly set-team](../managing-teams.md#fly-set-team):

* `--gitlab-user=USERNAME` - Authorize an individual user.
* `--gitlab-group=GROUP_NAME` - Authorize an entire group's members.

For example:

```shell
fly set-team -n my-team \
    --gitlab-user my-gitlab-user \
    --gitlab-group my-group
```

... or via `--config` for [setting user roles](../managing-teams.md#setting-user-roles):

```yaml
roles:
  - name: member
    gitlab:
      users: [ "my-gitlab-login" ]
      groups: [ "my-gitlab-group" ]
```

### Configuring `main` Team Authorization

GitLab users and groups can be added to the [`main` team](../main-team.md) authorization config by setting the following
env on the [`web` node](../../install/running-web.md):

```properties
CONCOURSE_MAIN_TEAM_GITLAB_GROUP=group-name
CONCOURSE_MAIN_TEAM_GITLAB_USER=some-user
```

Multiple groups and users may be specified by comma-separating them.