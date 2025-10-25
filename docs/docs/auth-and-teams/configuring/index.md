---
title: Configuring Auth
---

The very first thing to configure with Concourse is how users will log in, and what those users should be able to do.

This is configured in two separate tiers:

* **Authentication**, how users identify themselves, is configured on the [`web` node](../../install/running-web.md).
* **Authorization**, how user access is determined, is configured on each team.

Concourse currently supports the following auth methods:

<div class="grid cards" markdown>

- :material-lock: Local Auth

    ---
  [:octicons-arrow-right-24: Configure](local-user.md)

- :material-github: GitHub Auth

    ---
  [:octicons-arrow-right-24: Configure](github.md)

- :material-gitlab: GitLab Auth

    ---
  [:octicons-arrow-right-24: Configure](gitlab.md)

- :material-bitbucket: BitBucket Cloud Auth

    ---
  [:octicons-arrow-right-24: Configure](bitbucket-cloud.md)

- :simple-cloudfoundry: CF / UAA Auth

    ---
  [:octicons-arrow-right-24: Configure](cf-uaa.md)

- :material-database: LDAP Auth

    ---
  [:octicons-arrow-right-24: Configure](ldap.md)

- :material-microsoft-azure: Microsoft Auth

    ---
  [:octicons-arrow-right-24: Configure](microsoft.md)

- :material-openid: Generic OIDC Auth

    ---
  [:octicons-arrow-right-24: Configure](generic-oidc.md)

- :material-lock: Generic OAuth

    ---
  [:octicons-arrow-right-24: Configure](generic-oauth.md)

- :material-lock: Generic SAML Auth

    ---
  [:octicons-arrow-right-24: Configure](generic-saml.md)


</div>

Any number of providers can be enabled at any one time. Users will be given a choice when logging in as to which one
they would like to use.

Concourse uses a fork of [Dex](https://github.com/dexidp/dex) for its authentication. You can find additional
documentation on the supported auth providers in
the [Dex connectors documentation](https://github.com/dexidp/dex/tree/master/Documentation/connectors).

Adding a new auth provider to Concourse is as simple as submitting a pull request to
our [fork of Dex](https://github.com/concourse/dex) and then adding a bit of configuration to the [
`skymarshal` component](https://github.com/concourse/concourse/tree/master/skymarshal).