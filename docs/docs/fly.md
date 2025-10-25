---
title: The fly CLI
---

# The `fly` CLI

The first step to getting started with Concourse is to install the `fly` CLI tool. You can download `fly` from any
Concourse installation by clicking the download link in the bottom-right corner of the web UI.

Throughout the Concourse documentation we'll stick to the long-form name of every command and flag. Once you've learned
what the commands do, you may want to consult `fly -h` to learn the short forms.

## `fly login`

The first thing you'll want to do is authenticate with your target. This is done with the `fly login` command. This is
also useful to save targets under a more convenient alias, so you don't have to type out the URL all the time:

The `login` command serves double duty: it authenticates with a given endpoint, and saves it under a more convenient
name. The name and token are stored in `~/.flyrc` (though you shouldn't really edit the file manually).

Concourse deployments can be occupied by multiple [teams](auth-and-teams/index.md). To specify the team to which to
log in, specify the `--team-name` or `-n` flag. If not specified, this defaults to the [
`main` team](auth-and-teams/main-team.md).

So, to log in to a team `my-team` an endpoint served at `https://ci.example.com` and save it as the more convenient name
`example`, you would run:

```shell
fly --target example login --team-name my-team \
    --concourse-url https://ci.example.com
```

The `login` command will see which authentication methods are available for the specified team and prompt you to choose
one. For basic auth, it will ask your username and password and use them to acquire a token. For OAuth, it will give you
a link to click, and after you've gone through the OAuth flow it will print an OAuth token on the page that you can then
copy and paste into the prompt.

Note that if no authentication methods are configured, `fly` will acquire a token without any prompting. You can then
use the alias like normal.

In any case, a token is saved in your `~/.flyrc`, which will expire after one day.

If your Concourse uses SSL but does not have a certificate signed by a trusted CA, you can use the `--ca-cert` flag so
that `fly` can trust the connection, like so:

```shell
fly -t example login -c https://ci.example.com --ca-cert ./ca.crt
```

This will read the value out of the file `./ca.crt` and save it into `~/.flyrc` so you don't have to pass it on every
`login` invocation.

If your Concourse instance is protected by a proxy server requiring client certificates, you can use `--client-cert` and
`--client-key` to point to where your certificate is stored. These paths will be stored in `.flyrc` and the certificate
will by attached to every request made to that target.

```shell
fly -t example login -c https://ci-example.com \
    --client-cert ./client.pem \
    --client-key ./client.key
```

After you've logged in you can use `--target example` (or `-t example` for short) to run a command against the saved
target `example`. For example, `fly -t example builds` will list the last few builds on the `example` Concourse
instance.

The `-t` flag is intentionally stateless and must be explicitly added to each command. This reduces the risk of
accidentally running a command against the wrong environment when you have multiple targets defined.

## `fly targets`

To see what targets are currently known to `fly`, run:

```shell
fly targets
```

This will show each target's name, URL, and when its token expires.

## `fly status`

To check your current authentication status with a given target, run:

```shell
fly -t example status
```

This will let you know if the token has expired.

## `fly userinfo`

To check what user you're logged in as, as well as which teams you are currently authenticated to and which roles within
each team you have, run:

```shell
fly -t example userinfo
```

## `fly logout`

To clear out your token for a given target, run:

```shell
fly -t example logout
```

To clear out your token for all targets, run:

```shell
fly logout -a
```

!!! note

    These two variations are mutually exclusive. If the target parameter `-t` and all parameter `-a` are both 
    specified, an error will occur.

## `fly edit-target`

To modify a target's name, team, or URL, run:

```shell
fly -t example edit-target \
    --target-name new-name \
    --concourse-url https://ci.example.com \
    --team-name my-team
```

Each flag is optional - only the specified flags will be changed.

## `fly delete-target`

When logging out just isn't enough, a target can be completely removed from `~/.flyrc` by running:

```shell
fly -t example delete-target
```

To delete _all_ targets, run:

```shell
fly delete-target -a
```

!!! note

    These two variations are mutually exclusive. If the target parameter `-t` and all parameter `-a` are both 
    specified, an error will occur.

## `fly sync`

Occasionally we add additional features to `fly` or make changes to the communication between it and Concourse's API
server. To make sure you're running the latest and greatest version that works with the Concourse you are targeting we
provide a command called `sync` that will update your local `fly`. It can be used like so:

```shell
fly -t example sync
```

The `fly` command will also warn you if it notices that your CLI version is out of sync with the server.

## `fly completion`

Fly can output autocomplete configuration for some shells. For example, you can add an entry to your `.bashrc` like
this:

```shell
source <(fly completion --shell bash)
```

or, using the `/etc/bash_completion.d` directory:

```shell
fly completion --shell bash > /etc/bash_completion.d/fly
```

Note that, unlike other fly commands, this command does not interact with a remote server so you do not need to provide
the `-t` or `--target` flag.
