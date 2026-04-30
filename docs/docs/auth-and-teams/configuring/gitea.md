---
title: Gitea Auth
---

A Concourse server can authenticate against Gitea (or Forgejo) to leverage their permission model.

## Authentication

First, you'll need to [create an OAuth2 application on
Gitea](https://gitea.com/user/settings/applications). You can create a user or
organization OAuth2 application.

The "Authorization callback URL" must be the URL of your Concourse server. This
address must be reachable by Gitea - it can't be `localhost`.

For example, Concourse's own CI server's callback URL would be:

```
https://ci.concourse-ci.org/sky/issuer/callback
```

You will be given a Client ID and a Client Secret for your new application. The client ID and secret must then be
configured on the [`web` node](../../install/running-web.md) by setting the following env:

```properties
CONCOURSE_GITEA_CLIENT_ID=myclientid
CONCOURSE_GITEA_CLIENT_SECRET=myclientsecret
```

If you're configuring a self-hosted Gitea instance, you'll need to
specify the host:

```properties
CONCOURSE_GITEA_HOST=https://gitea.example.com
```

The Gitea host must contain a scheme and no trailing slash.

## Authorization

Users, teams, and entire organizations can be authorized for a team in Concourse by passing the following flags to [
`fly set-team`](../managing-teams.md#fly-set-team):

* `--gitea-user=LOGIN` - Authorize an individual user.
* `--gitea-org=ORG_NAME` - Authorize an entire organization's members.
* `--gitea-team=ORG_NAME:TEAM_NAME` - Authorize a team's members within an organization.

```shell
fly set-team -n my-team \
    --gitea-user my-gitea-login \
    --gitea-org my-org \
    --gitea-team my-other-org:my-team
```

... or via `--config` for [setting user roles](../managing-teams.md#setting-user-roles):

```yaml
roles:
  - name: member
    gitea:
      users: [ "my-gitea-login" ]
      orgs: [ "my-org" ]
      teams: [ "my-other-org:my-team" ]
```

### Configuring `main` Team Authorization

Gitea users, teams, and organizations can be added to the [`main` team](../main-team.md) authorization config by
setting the following env on the [`web` node](../../install/running-web.md):

```properties
CONCOURSE_MAIN_TEAM_GITEA_ORG=org-name
CONCOURSE_MAIN_TEAM_GITEA_TEAM=org-name:team-name
CONCOURSE_MAIN_TEAM_GITEA_USER=some-user
```

Multiple orgs, teams, and users may be specified by comma-separating them.
