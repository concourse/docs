---
title: CF / UAA Auth
---

Cloud Foundry (CF) auth can be used for operators who wish to authenticate their users configured against their Cloud
Foundry instance via the UAA auth component.

## Authentication

You'll need to configure your UAA with a `concourse` client by setting the following under [
`uaa.clients`](http://bosh.io/jobs/uaa?source=github.com/cloudfoundry/uaa-release#p=uaa.clients):

```yaml
concourse:
  id: myclientid
  secret: myclientsecret
  scope: openid,cloud_controller.read
  authorized-grant-types: "authorization_code,refresh_token"
  access-token-validity: 3600
  refresh-token-validity: 3600
  redirect-uri: https://concourse.example.com/sky/issuer/callback
```

The value for `redirect-uri` must be the external URL of your Concourse server with `/sky/issuer/callback` appended.

For example, Concourse's own CI server's callback URL would be:

```
https://ci.concourse-ci.org/sky/issuer/callback
```

Next, you'll need to take the same client ID and secret and configure it on the [
`web` node](../../install/running-web.md) by setting the following env:

```properties
CONCOURSE_CF_API_URL=http://mycf.example.com
CONCOURSE_CF_CLIENT_ID=myclientid
CONCOURSE_CF_CLIENT_SECRET=myclientsecret
```

Note: if you're integrating with Cloud Foundry, you're probably also deploying Concourse via BOSH - in which case you'll
want to set the [
`cf_auth.*`](https://bosh.io/jobs/atc?source=github.com/concourse/concourse-bosh-release#p=cf_auth.client_id) properties
in your manifest instead of setting the above env.

## Authorization

CloudFoundry users and org/space members can be authorized for a team by passing the following flags to fly set-team:

* `--cf-user=USERNAME` - Authorize an individual user.
* `--cf-org=ORG_NAME` - Authorize an entire organization's members. Members will need to be part of a Space inside the
  organization.
* `--cf-space=ORG_NAME:SPACE_NAME` - Deprecated in favor of `--cf-space-with-developer-role`. Authorize the members with
  `developer` role of a space within an organization.
* `--cf-space-with-any-role=ORG_NAME:SPACE_NAME` - Authorize the members with any role of a space within an
  organization.
* `--cf-space-with-developer-role=ORG_NAME:SPACE_NAME` - Authorize the members with `developer` role of a space within
  an organization.
* `--cf-space-with-auditor-role=ORG_NAME:SPACE_NAME` - Authorize the members with `auditor` role of a space within an
  organization.
* `--cf-space-with-manager-role=ORG_NAME:SPACE_NAME` - Authorize the members with `manager` role of a space within an
  organization.
* `--cf-space-guid=SPACE_GUID` - Authorize the members with any role of a space within an organization by space GUID.

For example:

```shell
fly set-team -n my-team \
    --cf-user my-username \
    --cf-org my-org \
    --cf-space my-other-org:my-space
```

... or via `--config` for [setting user roles](../managing-teams.md#setting-user-roles):

```yaml
roles:
  - name: member
    cf:
      users: [ "my-username" ]
      orgs: [ "my-org" ]
      spaces: [ "my-other-org:my-space" ]
```

### Adding CF Users to the `main` Team

CloudFoundry users and org/space members can be added to the [`main` team](../main-team.md) authorization config by
setting the following env on the [`web` node](../../install/running-web.md):

```properties
CONCOURSE_MAIN_TEAM_CF_USER=username
CONCOURSE_MAIN_TEAM_CF_ORG=org-name
CONCOURSE_MAIN_TEAM_CF_SPACE=org-name:space-name
CONCOURSE_MAIN_TEAM_CF_SPACE_WITH_ANY_ROLE=org-name:space-name
CONCOURSE_MAIN_TEAM_CF_SPACE_WITH_DEVELOPER_ROLE=org-name:space-name
CONCOURSE_MAIN_TEAM_CF_SPACE_WITH_AUDITOR_ROLE=org-name:space-name
CONCOURSE_MAIN_TEAM_CF_SPACE_WITH_MANAGER_ROLE=org-name:space-name
CONCOURSE_MAIN_TEAM_CF_SPACE_GUID=SPACE_GUID
```

Multiple users, spaces, etc. may be specified by comma-separating them.