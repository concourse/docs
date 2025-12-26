---
title: Local User Auth
---

Local User auth is a primitive username/password-based auth mechanism. All users and passwords are configured
statically.

In general, we recommend configuring one of the other providers instead, but for small deployments with only a few
users, local user auth may be all you need.

## Authentication

Local users are configured on the [`web` node](../../install/running-web.md) by setting the following env:

```properties
CONCOURSE_ADD_LOCAL_USER=myuser:mypass,anotheruser:anotherpass
```

This configures two users, `myuser` and `anotheruser`, with their corresponding passwords. The literal password can be
provided, or a [bcrypt](https://en.wikipedia.org/wiki/Bcrypt) hash of the password.

When local users are configured, the log-in page in the web UI will show a username/password prompt.

Local users can also log in via [`fly login`](../../fly.md#fly-login) with the `--username` and
`--password` flags.

### Bcrypt Hashing Passwords

Instead of passing in user passwords in plaintext, you can provide Concourse with a bcrypt hash of the passwords.

There aren't any great CLI tools for quickly hashing passwords with bcrypt. Here's a simple Go program that can do the
hashing for you.

```go
package main

import (
    "fmt"

    "golang.org/x/crypto/bcrypt"
)

func main() {
    password := []byte("mypass")
    hash, _ := bcrypt.GenerateFromPassword(password, 12)
    fmt.Println(string(hash))
}
```

Put that in a `main.go` then run go run `main.go` and it will output a hash for your password. You can run this program
in the [Go Playground](https://go.dev/play/p/Ucv-ADJ9M0J) if you want to avoid installing Go.

Hashing the passwords for the previous example, you would then set `CONCOURSE_ADD_LOCAL_USER` to the following:

```properties
CONCOURSE_ADD_LOCAL_USER='myuser:$2a$12$L8Co5QYhD..S1l9mIIVHlucvRjfte4tuymMCk9quln0H/eol16d5W,anotheruser:$2a$12$VWSSfrsTIisf96q7UVsvyOBbrcP88kh5CLtuXYSXGwnSnM3ClKxXu'
```

## Authorization

Local users are granted access to teams via [`fly set-team`](../managing-teams.md#fly-set-team),
using the `--local-user` flag:

```shell
fly set-team -n my-team --local-user some_username
```

...or via --config for [setting user roles](../managing-teams.md#setting-user-roles):

```yaml
roles:
  - name: member
    local:
      users: [ "some_username" ]
```

### Configuring `main` Team Authorization

Local users can be added to the [`main` team](../main-team.md) authorization config by setting the following env on
the [`web` node](../../install/running-web.md):

```properties
CONCOURSE_MAIN_TEAM_LOCAL_USER=myuser
```

Multiple users may be specified by comma-separating them.