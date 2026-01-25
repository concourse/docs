---
title: Broadcast Message System
---

Concourse Admins who operate a big Concourse with many teams often want a way to communicate to everyone that the system
is unstable / is recovering.

!!! tip "Fun Fact!"

    "Wall" is a reference to the [Unix `wall`](https://en.wikipedia.org/wiki/Wall_(Unix)) CLI.

## `fly set-wall`

_Requires being a member of the main team_. To set a new wall with a message and expiration, run:

```shell
fly -t main set-wall --message="⚠️ Hello World, there is an error ⚠️" --ttl=5m
```

This will set a wall of "⚠️ Hello World, there is an error ⚠️" with an expiration of five minutes.

## `fly get-wall`

To get the current wall, run:

```shell
fly -t main get-wall
```

## `fly clear-wall`

_Requires being a member of the main team_. To clear a current wall, run:

```shell
fly -t main clear-wall
```
