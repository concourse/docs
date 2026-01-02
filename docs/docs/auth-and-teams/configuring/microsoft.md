---
title: Microsoft Auth
---

A Concourse server can authenticate against Microsoft Azure AD to leverage its permission model.

## Authentication

You'll need
to [register a new application on Azure](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade).

The "Callback URL" must be the URL of your Concourse server with `/sky/issuer/callback` appended. This address must be
reachable by Microsoft - it can't be `localhost`.

For example, Concourse's own CI server's callback URL would be:

```
https://ci.concourse-ci.org/sky/issuer/callback
```

You will be given a Client ID and a Client Secret for your new application. The client ID and secret must then be
configured on the [`web` node](../../install/running-web.md) by setting the following env:

```properties
CONCOURSE_MICROSOFT_CLIENT_ID=myclientid
CONCOURSE_MICROSOFT_CLIENT_SECRET=myclientsecret
```

Consult `concourse web --help` for a full list of flags with descriptions.

## Authorization

!!! warning

    Individual user auth is disabled due to a quirk with with Microsoft returning unique IDs but non-unique usernames

Groups can be authorized for a team by passing the following flags to fly set-team:

* `--microsoft-group=GROUP_NAME` - Authorize an entire group's members.

For example:

```shell
fly set-team -n my-team \
    --microsoft-group my-group
```

...or via `--config` for [setting user roles](../managing-teams.md#setting-user-roles):

```yaml
roles:
  - name: member
    microsoft:
      groups: [ "my-groups" ]
```

### Configuring `main` Team Authorization

Microsoft groups can be added to the [`main` team](../main-team.md) authorization config by setting the following env on
the [`web` node](../../install/running-web.md):

```properties
CONCOURSE_MAIN_TEAM_MICROSOFT_GROUP=my-group
```

Multiple teams may be specified by comma-separating them.