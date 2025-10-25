---
title: Generic OAuth Auth
---

A Concourse server can authenticate against any valid OAuth auth provider, though it's a bit "closer to the metal" as
you'll need to explicitly configure the auth, token, and user-info URLs. You may want to see if you can
use [Generic OIDC auth](generic-oidc.md) if your auth provider is compatible with OIDC.

## Authentication

First you'll need to create a client with your oAuth provider.

The callback URL must be the URL of your Concourse server with `/sky/issuer/callback` appended. This address must be
reachable by your oAuth provider - it can't be `localhost`.

For example, Concourse's own CI server's callback URL would be:

```
https://ci.concourse-ci.org/sky/issuer/callback
```

The Generic oAuth provider has many values to set - for a full list consult `concourse web --help`.

A typical [web node](../../install/running-web.md) env config may look something like this:

```properties
CONCOURSE_OAUTH_DISPLAY_NAME=Acme
CONCOURSE_OAUTH_CLIENT_ID=myclientid
CONCOURSE_OAUTH_CLIENT_SECRET=myclientsecret
CONCOURSE_OAUTH_AUTH_URL=https://oauth.example.com/oauth2/auth
CONCOURSE_OAUTH_TOKEN_URL=https://oauth.example.com/oauth2/token
CONCOURSE_OAUTH_USERINFO_URL=https://oauth.example.com/oauth2/userinfo
```

Consult `concourse web --help` for a full list of flags with descriptions.

## Authorization

OAuth users and groups can be authorized for a team by passing the following flags to [
`fly set-team`](../managing-teams.md#fly-set-team):

* `--oauth-user=USERNAME` - Authorize an individual user.
* `--oauth-group=GROUP_NAME` - Authorize anyone from the group.
    * You may only configure groups if the auth provider exposes this information in either the token itself, or in the
      contents of the userinfo endpoint.
    * You can configure which claim points to the groups information by specifying `CONCOURSE_OAUTH_GROUPS_KEY` on the [
      `web` node](../../install/running-web.md).

For example:

```shell
fly set-team -n my-team \
    --oauth-user my-username \
    --oauth-group my-group
```

... or via `--config` for [setting user roles](../managing-teams.md#setting-user-roles):

```yaml
roles:
  - name: member
    oauth:
      users: [ "my-username" ]
      groups: [ "my-group" ]
```

### Configuring `main` Team Authorization

OAuth users and groups can be added to the [`main` team](../main-team.md) authorization config by setting the following
env on the [`web` node](../../install/running-web.md):

```properties
CONCOURSE_MAIN_TEAM_OAUTH_USER=my-user
CONCOURSE_MAIN_TEAM_OAUTH_GROUP=my-group
```

Multiple users and groups may be specified by comma-separating them.