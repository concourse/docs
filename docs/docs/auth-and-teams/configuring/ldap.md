---
title: LDAP Auth
---

The LDAP provider can be used for operators who wish to authenticate their users against an LDAP server.

## Authentication

The LDAP provider is configured by pointing it to an LDAP host with a read-only bind DN and password. This bind DN and
password is used for authenticating with the LDAP host and querying the users.

Additionally, the base DN under which users are searched as well as the attribute of the users to associate to '
usernames' must also be configured.

These can be specified via env to the [`web` node](../../install/running-web.md) like so:

```properties
CONCOURSE_LDAP_DISPLAY_NAME=Acme # optional; default "LDAP"
CONCOURSE_LDAP_HOST=ldap.example.com # port defaults to 389 or 636
CONCOURSE_LDAP_BIND_DN='cn=read-only-admin,dc=example,dc=com'
CONCOURSE_LDAP_BIND_PW=read-only-admin-password
CONCOURSE_LDAP_USER_SEARCH_BASE_DN='cn=users,dc=example,dc=com'
CONCOURSE_LDAP_USER_SEARCH_USERNAME=uid
```

To configure TLS, you may need to set a CA cert:

```properties
CONCOURSE_LDAP_CA_CERT=/path/to/ca_cert
```

If your LDAP host does not use TLS, you must set:

```properties
CONCOURSE_LDAP_INSECURE_NO_SSL=true
```

To fine-tune which users are queried, you can specify a user search filter like so:

```properties
CONCOURSE_LDAP_USER_SEARCH_FILTER='(objectClass=person)'
```

To set which user attributes map to the token claims, you can set the following:

```properties
CONCOURSE_LDAP_USER_SEARCH_ID_ATTR=uid         # default
CONCOURSE_LDAP_USER_SEARCH_EMAIL_ATTR=mail     # default
CONCOURSE_LDAP_USER_SEARCH_NAME_ATTR=some-attr # no default
```

### Configuring LDAP group search

The LDAP provider can also be configured with group search configuration, so that users can be configured for team
authorization by their 'group' in LDAP.

For example, to find groups and identify them by their `ou` attribute, you would configure:

```properties
CONCOURSE_LDAP_GROUP_SEARCH_BASE_DN='cn=groups,dc=example,dc=com'
CONCOURSE_LDAP_GROUP_SEARCH_NAME_ATTR=ou
```

The attributes correlating a user to a group must be specified like so:

```properties
CONCOURSE_LDAP_GROUP_SEARCH_USER_ATTR=uid
CONCOURSE_LDAP_GROUP_SEARCH_GROUP_ATTR=members
```

This specifies that the `uid` attribute of the user must be present in the `members` attribute of the group.

An additional filter may be specified, just like with users:

```properties
CONCOURSE_LDAP_GROUP_SEARCH_FILTER='(objectClass=posixGroup)'
```

## Authorization

LDAP users and groups can be authorized for a team by passing the following flags to [
`fly set-team`](../managing-teams.md#fly-set-team):

* `--ldap-user=USERNAME` - Authorize an individual user.
* `--ldap-group=GROUP_NAME` - Authorize anyone from the group.

For example:

```shell
fly set-team -n my-team \
    --ldap-user my-username \
    --ldap-group my-group
```

... or via `--config` for [setting user roles](../managing-teams.md#setting-user-roles):

```yaml
roles:
  - name: member
    ldap:
      users: [ "my-username" ]
      groups: [ "my-groups" ]
```

### Configuring `main` Team Authorization

LDAP users and groups can be added to the [`main` team](../main-team.md) authorization config by setting the following
env on the [`web` node](../../install/running-web.md):

```properties
CONCOURSE_MAIN_TEAM_LDAP_USER=my-user
CONCOURSE_MAIN_TEAM_LDAP_GROUP=my-group
```

Multiple users and groups may be specified by comma-separating them.