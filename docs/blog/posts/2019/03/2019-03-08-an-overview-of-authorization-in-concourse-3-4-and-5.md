---
title: An Overview of Authorization in Concourse 3, 4 and 5
date: 2019-03-08
categories:
- product-update
authors:
  - jamesma
---

{{< image src="
/images/downloaded_images/An-Overview-of-Authorization-in-Concourse-3--4-and-5/1-sh1rcJO5eSRDQrmxIF8qTA.jpeg" alt="NASA
HQ Photo" width="60%" >}}

<!-- more -->

With the release of [Concourse 5.0.0](https://concourse-ci.org/download.html#v500) this week I thought it would be a
good time to review the evolving implementation of authorization in Concourse. I’ll also be covering some helpful
debugging information for you to consider when configuring authorization in your own Concourse instance.

## Read the Docs

The revised [Concourse Auth & Teams docs](https://concourse-ci.org/auth.html)is a great place to start when diving into
Concourse 5.0.0. The docs will cover important steps around provider configuration and team configuration for your
cluster. If you’re more interested in how things used to work compared to how they now work; then read on!

## How Authorization Works in 3.x

_This section will only be useful to operators who are migrating into 4.x and beyond. Feel free to skip ahead if this
does not apply to you._

{{< image src="
/images/downloaded_images/An-Overview-of-Authorization-in-Concourse-3--4-and-5/1-cNIh0ygLLcNnPbGEDOhcig.png" alt=""
width="100%" >}}

Every Concourse instance starts with a main team that must be configured against an Authentication Provider on start-up.
The main team is an admin team, meaning it can create teams, update other teams and view system-scoped details on
workers, containers, etc.

One of the tasks that only a main user can do is to create new teams via set-team. When creating the team, the operator
must specify:

- An Authentication Provider e.g. Basic Auth, GitHub, OAuth
- The relevant configuration of the Authentication Provider e.g. secrets, tokens
- The user/group to authorize (if applicable)

Some important notes to keep in mind:

- Authentication Provider configurations are attached to an individual team, and not shared across teams. As an
  operator, you will have to repeat/resupply the Authentication Provider configuration for each team. If Team 1 wanted
  to change their own auth to add a member or group they would have to ask the Operator for the github API token or
  bring their own.
- Since Authentication Provider details are provided per-team, operators can set unique provders for each. A common
  use-case is to provision Team 1 to authenticate against the USA-East-1 OAuth server and Team2 to authentiate against
  the EMEA OAuth server.
- You can _stack_ Authentication Providers by supplying multiple parameters when applying set-team; e.g. a team can have
  both GitHub _and_ Basic Auth configured to authenticate users.
- Users who are authorized to access more than one team can only see one team at a time.

## Concourse 4.0 — Users

Concourse 4 introduced Users and totally revamped the authorization flow:

- Identity providers must be specified when Concourse first starts up (this includes local users as well!)
- Identity providers are shared across teams and can no longer be customized per-team
- Adding/removing Identity Providers require a restart to the web node
- When specifying groups in provider configuration, administrators must use : as the separator instead of /
- Users logging into Concourse are whitelisted into all teams that match thier provider membership. More on this later

### Overview of Authorization Flow

1. Operator determines the Identity Providers they will allow in Concourse and configures their Concourse startup
   scripts (Docker, BOSH, Helm, etc.) with the necessary parameters as described
   in [Configuring Auth](https://concourse-ci.org/install.html#quickstart).
2. If there are any local users that have Basic Auth (username/password) identities, the operator will add them to the
   startup scripts as outlined in [Local Auth](https://concourse-ci.org/install.html#local-auth-config)
3. The Operator will start Concourse and begin creating teams using the fly set-team command. Keeping in mind the auth
   providers that were added in step (1) the Operator can specify the allowed users/groups/teams from that provider.
   See [Configuring Team Auth](https://concourse-ci.org/authentication.html) for more details.
4. When a User logs into Concourse, they are asked to login using one of the configured providers from (1).
5. Once the User selects a provider, Concourse will redirect the User to the identity provider’s authentication
   mechanism and wait for a successful login response
6. When a login success response is recieved, Concourse will examine all of the teams/orgs the User belongs to under
   that provider. Concourse will then match the user’s information against the internal list of Concourse teams and
   their list of whitelisted users/teams/orgs. The resulting list will be the teams that the User can access
7. The User is logged into Concourse and can access the teams they were whitelisted into

### Identity Providers

An Identity Provider is any external entity that creates, manages and maintains identity information to auth. Concourse
4 uses the OSS [dex library](https://github.com/dexidp/dex) to do most of the heavy lifting.

**Specifying Identity Providers**

You will need to provide the connection details for all the auth connectors you plan to use for teams up front. The full
list of supported providers and their require parameters can be found on the Concourse docs site
under [Configuring Auth](https://concourse-ci.org/install.html#quickstart).

**Local Users, The Special Case**

Local Auth users are a bit of a special case because there’s no external auth provider for them, and you can no longer
“create” them on set-team.

To add a local user you will need to add that user to the Concourse startup parameter list as described in
the [Local Auth](https://concourse-ci.org/install.html#local-auth-config)docs.

**Whitelisting Users with**  **set-team**

Once you have configured the providers you can freely add users/teams/orgs/groups/whatever to a team. This is as simple
as using the parameters described in the fly set-team docs
for [Configuring Team Auth](https://concourse-ci.org/authentication.html).

As with most fly commands, you can actually attach multiple users/teams across providers to a team. For example: if you
have GitHub and OAuth providers set up, a team owner could attach two teams (one from GitHub, one from OAuth) to the
team.

### Examples

{{< image src="
/images/downloaded_images/An-Overview-of-Authorization-in-Concourse-3--4-and-5/1-c4yd3A2DIIrRYF8uqh9_fw.png" width="
100%" >}}

In this example we have a simple Concourse installation with two identity providers: GitHub and a single Local User.

On the left we have two simple GitHub orgs: Pivotal and Concourse. Pivotal has three teams: cloud, billing and admin.
Concourse has one team. Each team has a single user attached to them.

On the right we have a map of the Concourse teams and their allowed users/groups.

Let’s go through a few scenarios to get a good understanding of how auth works in Concourse 4.

**Local User Logs In**

A Concourse user uses the local user provider to login with username:password and only sees Team Local.

**Alice Logs In**

Alice logs into Concourse using the GitHub auth scheme. She finishes the flow and sees..two teams! Because she is a
member of the Pivotal GitHub org she sees Team All, which is configured to allow all users under the pivotal org on
GitHub. She also sees Team 1 because it allows all users who are also memebers of pivotal:cloud on GitHub.

**Operator Logs In**

The Operator logs in using GitHub auth and…can see everything! Because the Operator is part of the main team, they can
see all teams. However, that does _not_ mean the Operator can see all the team pipelines. In this scenario, the Operator
can only see the Main and Team All team pipelines.

**A non-member logs in**

Jama finds out about this cool Concourse thing and logs into Concourse using the GitHub auth provider. Since he has a
GitHub account he is able to login successfully. However, once the login flow is completed he is returned to Concourse
and a blank screen…nothing is available to him! Jama is not a member of a GitHub team/organization that was specified in
the Concourse team configurations.

## Debugging Login Problems

### What are the auth settings for [insert team name]?

If you are an operator and you need to figure out what the exact auth settings are, you can use the new fly teams
-dcommand. This will list the teams with details, including the users and groups whitelisted into that team

### Help, I logged in but I can’t see my team

1. Try using the search function on the dashboard. This is silly but for large Concourse clusters there are a LOT of
   teams with exposed pipelines and it can be hard to find the team you need
2. Logout and Log back in. Due to the implementation of the auth scheme, Users who are already logged into Concourse and
   are added into a new team must refresh their token by logging out and logging in.
   Yes, [we know it sucks](https://github.com/concourse/concourse/issues/2441).
3. Is the user a member of the org that was specified in set-team? For example, if GitHub team pivotal:foo was used,
   make sure to ask if the user is a member of that team on GitHub!
4. Was there a typo? Use fly set-team -d to look for the team in question and triple-check the spelling of usernames and
   teams
5. Did you use the correct separator? Concourse requires all group separators to use : and not /:

- pivotal:foo is OK
- pivotal/foo will fail silently on set-team

### I have two Identity servers, how do I add them both?

Unfortunately, that is not possible in Concourse 4. You’ll notice that you can only supply one set of credentials when
providing auth providers. The side-effect limitation is that a single Concourse installation can’t be connected to more
than one of the same provider. The operator will have to set up another Concourse if they absolutely must be able to
connect to two differet identity providers of the same type.

## Concourse 5.0 — RBAC

Concourse 5.0 comes with 4 roles: Concourse Admin, Team Owner, Team Member, and Team Viewer.

**Concourse Admin**

A Concourse Admin is the same as today’s [admin user](https://concourse-ci.org/main-team.html). Members of main team
will automatically be Concourse Admins\* and have the ability to administrate teams with fly: set-team, destroy-team,
rename-team, and teams. Given that all Concourse Admins must be a member of the main team, all Concourse Admins must
have at least one other role; and that should typically be the Team Owner role.

**Team Owner**

Team Owners have read, write and auth management capabilities within the scope of their team. For those familiar with
Concourse today, the scope of allowed actions for a Team Owner is very closely aligned to today’s Concourse team member.
The new change is that you can no longer rename your own team or destroy your own team as an owner.

**Team Member**

Team Member is a new role that lets users operate within their teams in a read & write fashion; but prevents them from
changing the auth configurations of their team.

**Team Viewer**

Team Viewer is also a new role that gives users “read-only” access to a team. This locks everything down, preventing
users from doing a set-pipeline or intercept.

**Full Roles Breakdown**

For a full list of each role’s allowed actions you can reference our handy permission matrix on Google
Sheets [here](https://docs.google.com/spreadsheets/d/1np3hyJy3mVRfB2gcgKykz3QTQg5qEj28QgK523SEmao/edit#gid=1437859537).

### Configuring Roles with fly

Now that we’ve gone over the new roles, we can do a quick overview of how we can go about setting users & roles on
teams.

### Default Behaviour

By default, if no configuration is provided the user is given the Team Owner role:

```bash
fly -t dev set-team -n PowerRangers --local-user=Zordon

#This behaviour also applies to groups as well, so be careful!
fly -t dev set-team -n A-Team \
  --github-team=MightyMorphin:PowerRangers
```

### Specifying Roles with `-c`

Roles must be specified in a separate configuration file using the -c

```bash
fly -t dev set-team -n A-Team -c ./team.yml
```

`team.yml`

```yaml
roles:
- name: owner
  local:
    users: ["Zordon"]
- name: member
  local:
    users: ["RedRanger", "BlueRanger", "GreenRanger"]
- name: viewer
  local:
    users: ["Alpha"]
```

## Inspecting Roles Configuration

Once you’ve set the team configuration you can verify it using the details flag on fly teams:

```shell-session
fly -t dev teams -d
name users groups
A-Team/member local:RedRanger, BlueRanger, GreenRanger none
A-Team/owner local:Zordon none
A-Team/viewer local:Alpha none
```

..where you’ll find the output is now updated to list each team/role combination and its associated users/groups.

## Further Reading

- [Oh, Auth by Josh Winters](https://medium.com/concourse-ci/oh-auth-f4fe68438171)
- [Concourse RBAC Preview](https://medium.com/concourse-ci/concourse-rbac-preview-8e07616ddc47).
- [Concourse Auth & Teams docs](https://concourse-ci.org/auth.html)
