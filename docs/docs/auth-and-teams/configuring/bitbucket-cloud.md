---
title: BitBucket Cloud Auth
---

A Concourse server can authenticate against BitBucket Cloud to leverage its permission model.

## Authentication

First, you'll need
to [create an OAuth consumer on Bitbucket Cloud](https://confluence.atlassian.com/display/BITBUCKET/OAuth+on+Bitbucket+Cloud).

The consumer will need the following permissions:

* Account:
    * Email
    * Read
* Team membership:
    * Read

The "Callback URL" must be the URL of your Concourse server with `/sky/issuer/callback` appended. This address must be
reachable by BitBucket Cloud - it can't be `localhost`.

For example, Concourse's own CI server's callback URL would be:

```
https://ci.concourse-ci.org/sky/issuer/callback
```

You will be given a Client ID and a Client Secret for your new application. The client ID and secret must then be
configured on the [`web` node](../../install/running-web.md) by setting the following env:

```properties
CONCOURSE_BITBUCKET_CLOUD_CLIENT_ID=myclientid
CONCOURSE_BITBUCKET_CLOUD_CLIENT_SECRET=myclientsecret
```

## Authorization

BitBucket users and teams can be authorized for a team by passing the following flags to [
`fly set-team`](../managing-teams.md#fly-set-team):

* `--bitbucket-cloud-user=LOGIN` - Authorize an individual user.
* `--bitbucket-cloud-team=TEAM_NAME` - Authorize an entire organization's members.

For example:

```shell
fly set-team -n my-team \
    --bitbucket-cloud-user my-bitbucket-login \
    --bitbucket-cloud-team my-bitbucket-team
```

... or via `--config` for [setting user roles](../managing-teams.md#setting-user-roles):

```yaml
roles:
  - name: member
    bitbucket-cloud:
      users: [ "my-bitbucket-login" ]
      teams: [ "my-bitbucket-team" ]
```

### Configuring main Team Authorization

BitBucket users and teams can be added to the [`main` team](../main-team.md) authorization config by setting the
following env on the [`web` node](../../install/running-web.md):

```properties
CONCOURSE_MAIN_TEAM_BITBUCKET_CLOUD_USER=my-bitbucket-login
CONCOURSE_MAIN_TEAM_BITBUCKET_CLOUD_TEAM=my-bitbucket-team
```

Multiple teams and users may be specified by comma-separating them.