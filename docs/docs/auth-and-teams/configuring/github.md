---
title: GitHub Auth
---

A Concourse server can authenticate against GitHub to leverage their permission model and other security improvements in
their infrastructure.

## Authentication

First, you'll need to [create an OAuth application on GitHub](https://github.com/settings/applications/new).

The "Authorization callback URL" must be the URL of your Concourse server. This address must be reachable by GitHub - it
can't be `localhost`.

For example, Concourse's own CI server's callback URL would be:

```
https://ci.concourse-ci.org/sky/issuer/callback
```

You will be given a Client ID and a Client Secret for your new application. The client ID and secret must then be
configured on the [`web` node](../../install/running-web.md) by setting the following env:

```properties
CONCOURSE_GITHUB_CLIENT_ID=myclientid
CONCOURSE_GITHUB_CLIENT_SECRET=myclientsecret
```

Note that the client must be created under an _organization_ if you want to authorize users based on organization/team
membership. In addition, the GitHub application must have at least read access on the organization's members. If the
client is created under a personal account, only individual users can be authorized.

If you're configuring GitHub Enterprise, you'll also need to set the following env:

```properties
CONCOURSE_GITHUB_HOST=github.example.com
CONCOURSE_GITHUB_CA_CERT=/path/to/ca_cert
```

The GitHub Enterprise host must not contain a scheme, or a trailing slash.

## Authorization

Users, teams, and entire organizations can be authorized for a team by passing the following flags to [
`fly set-team`](../managing-teams.md#fly-set-team):

* `--github-user=LOGIN` - Authorize an individual user.
* `--github-org=ORG_NAME` - Authorize an entire organization's members.
* `--github-team=ORG_NAME:TEAM_NAME` - Authorize a team's members within an organization.

```shell
fly set-team -n my-team \
    --github-user my-github-login \
    --github-org my-org \
    --github-team my-other-org:my-team
```

... or via `--config` for [setting user roles](../managing-teams.md#setting-user-roles):

```yaml
roles:
  - name: member
    github:
      users: [ "my-github-login" ]
      orgs: [ "my-org" ]
      teams: [ "my-other-org:my-team" ]
```

### Configuring `main` Team Authorization

GitHub users, teams, and organizations can be added to the [`main` team](../main-team.md) authorization config by
setting the following env on the [`web` node](../../install/running-web.md):

```properties
CONCOURSE_MAIN_TEAM_GITHUB_ORG=org-name
CONCOURSE_MAIN_TEAM_GITHUB_TEAM=org-name:team-name
CONCOURSE_MAIN_TEAM_GITHUB_USER=some-user
```

Multiple orgs, teams, and users may be specified by comma-separating them.