---
title: Generic SAML Auth
---

A Concourse server can authenticate against any valid SAML auth provider.

## Authentication

First you'll need to create an application with your SAML provider. Note that the terminology used for configuring an
application may vary between SAML providers - this document uses Okta's terminology.

SAML Assertion Consumer Service (ACS) URL must be the URL of your Concourse server with `/sky/issuer/callback` appended.

For example, Concourse's own CI server's callback URL would be:

```
https://ci.concourse-ci.org/sky/issuer/callback
```

Audience URI (SP Entity ID) must match `CONCOURSE_SAML_ENTITY_ISSUER`, which defaults to the URL of your Concourse
server with `/sky/issuer/callback` appended.

Attribute statements that you define in the SAML provider can be remapped in Concourse:

```properties
CONCOURSE_SAML_USERNAME_ATTR=name   # default
CONCOURSE_SAML_EMAIL_ATTR=email     # default
CONCOURSE_SAML_GROUPS_ATTR=groups   # default
```

Finally, the SAML provider will generate a SSO URL, a CA certificate, and an Identity Provider Issuer. These values
correspond with `CONCOURSE_SAML_SSO_URL`, `CONCOURSE_SAML_CA_CERT`, and `CONCOURSE_SAML_SSO_ISSUER` respectively.

A typical [web node](../../install/running-web.md) env config may look something like this:

```properties
CONCOURSE_SAML_DISPLAY_NAME=Okta
CONCOURSE_SAML_SSO_URL=https://acme.okta.com/app/Y/Z/sso/saml
CONCOURSE_SAML_CA_CERT=/path/to/ca_cert
CONCOURSE_SAML_SSO_ISSUER=http://www.okta.com/X
```

Consult `concourse web --help` for a full list of flags with descriptions.

## Authorization

OAuth users and groups can be authorized for a team by passing the following flags to [
`fly set-team`](../managing-teams.md#fly-set-team):

* `--saml-user=USERNAME` - Authorize an individual user.
* `--saml-group=GROUP_NAME` - Authorize anyone from the group.
    * You may only configure groups if the auth provider exposes this information in either the token itself, or in the
      contents of the userinfo endpoint.
    * You can configure which claim points to the groups information by specifying `CONCOURSE_SAML_GROUPS_ATTR` on the [
      `web` node](../../install/running-web.md).

For example:

```shell
fly set-team -n my-team \
    --saml-user my-username \
    --saml-group my-group
```

... or via `--config` for [setting user roles](../managing-teams.md#setting-user-roles):

```yaml
roles:
  - name: member
    saml:
      users: [ "my-username" ]
      groups: [ "my-groups" ]
```

### Configuring `main` Team Authorization

SAML users and groups can be added to the [`main` team](../main-team.md) authorization config by setting the following
env on the [`web` node](../../install/running-web.md):

```properties
CONCOURSE_MAIN_TEAM_SAML_USER=my-user
CONCOURSE_MAIN_TEAM_SAML_GROUP=my-group
```

Multiple users and groups may be specified by comma-separating them.