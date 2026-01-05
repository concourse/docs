---
title: The main team
---

# The `main` team

Out of the box, Concourse comes with a single team called `main`.

The `main` team is an _admin_ team, meaning members (specifically users with
the [owner](user-roles.md#owner-role) role) can create and update other teams. Currently,
there is no way to promote a team to become an admin team, so `main` is a special-case.

The `main` team is different in that all flags normally passed to [
`fly set-team`](managing-teams.md#fly-set-team) are instead passed to the `concourse web`
command, prefixed with `--main-team-`. The values set in these flags take effect whenever the `web` node starts up. This
is done so that you can't get locked out.

To learn how to configure your `main` team, continue on to the appropriate section for your auth provider of choice
under [Configuring Auth](configuring/index.md).
