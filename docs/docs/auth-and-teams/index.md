---
title: Auth & Teams
---

A single Concourse installation can accommodate many projects and users.

Pipelines, builds, and all other user data are owned by _teams_. A team is just a conceptual owner and a separate
namespace, tied to an authorization config. For example, a team may authorize all members of the `concourse` GitHub
organization to be a [member](user-roles.md#member-role).

When a user authenticates, each team's authorization config is checked against the user to determine
which [role](user-roles.md), if any, to grant for the team. This information is then stored
in the user's token to determine access control for future requests.