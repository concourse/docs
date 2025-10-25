---
title: Generic OIDC Auth
---

A Concourse server can authenticate against any valid OIDC auth provider. This provider is similar
to [Generic oAuth](generic-oauth.md) except it only requires an issuer URL rather than auth/token/userinfo URLs.

## Authentication

First you'll need to create a client with your oAuth provider.

The callback URL must be the URL of your Concourse server with `/sky/issuer/callback` appended. This address must be
reachable by your OIDC provider - it can't be `localhost`.

For example, Concourse's own CI server's callback URL would be:

```
https://ci.concourse-ci.org/sky/issuer/callback
```

A typical [`web` node](../../install/running-web.md) env config may look something like this:

```properties
CONCOURSE_OIDC_DISPLAY_NAME=Acme
CONCOURSE_OIDC_CLIENT_ID=myclientid
CONCOURSE_OIDC_CLIENT_SECRET=myclientsecret
CONCOURSE_OIDC_ISSUER=https://oidc.example.com
```

Consult `concourse web --help` for a full list of flags with descriptions.

### A note about user lookup

When determining the user identity, Concourse will first look at the `preferred_username` claim. If this claim is empty
or missing, it will then look at the claim specified by `CONCOURSE_OIDC_USER_NAME_KEY` (which defaults to `username`).

Let's say that you want to tie each user to their email by using `CONCOURSE_OIDC_USER_NAME_KEY=email`.

If your OIDC provider returns the following claims, Concourse will still resolve the user to `Jane Doe`:

```json
{
  "sub": "248289761001",
  "username": "j.doe",
  "preferred_username": "Jane Doe",
  "email": "janedoe@example.com"
}
```

However, if the `preferred_username` claim is empty or missing, Concourse will respect the key and resolve the user to
`janedoe@example.com`:

```json
{
  "sub": "248289761001",
  "username": "j.doe",
  "preferred_username": "",
  "email": "janedoe@example.com"
}
```

## Authorization

!!! warning

    When authorizing individual users, it's up to you to ensure that the `preferred_username` claim and/or the claim 
    specified by `CONCOURSE_OIDC_USER_NAME_KEY` is unique. If they're not, then it's possible for users to impersonate 
    each other

OIDC users and groups can be authorized for a team by passing one or more of the following flags
to [fly set-team](../managing-teams.md#fly-set-team):

* `--oidc-user=USERNAME` - Authorize an individual user.
* `--oidc-group=GROUP_NAME` - Authorize anyone from the group.
    * You may only configure groups if the auth provider exposes this information in either the token itself, or in the
      contents of the userinfo endpoint.
    * You can configure which claim points to the groups information by specifying `CONCOURSE_OIDC_GROUPS_KEY` on the [
      `web` node](../../install/running-web.md).

For example:

```shell
fly set-team -n my-team \
    --oidc-user my-username \
    --oidc-user another-username \
    --oidc-group my-group \
    --oidc-group my-other-group
```

...or via `--config` for [setting user roles](../managing-teams.md#setting-user-roles):

```yaml
roles:
  - name: member
    oidc:
      users: [ "my-username", "another-username" ]
      groups: [ "my-group", "my-other-group" ]
```

Both users and groups are optional. You may opt to only provide privileges based on membership to a group and not to any
user explicitly and vice versa.

### Configuring `main` Team Authorization

OIDC users and groups can be added to the [`main` team](../main-team.md) authorization config by setting the following
env on the [`web` node](../../install/running-web.md):

```properties
CONCOURSE_MAIN_TEAM_OIDC_USER=my-user
CONCOURSE_MAIN_TEAM_OIDC_GROUP=my-group
```

Multiple users and groups may be specified by comma-separating them.