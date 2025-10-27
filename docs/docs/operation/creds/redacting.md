---
title: Redacting credentials
---

Concourse can be configured to automatically redact credentials from build output like so:

```properties
CONCOURSE_ENABLE_REDACT_SECRETS=true
```

This behavior is off by default as there is likely a CPU performance overhead on
the [`web` nodes](../../install/running-web.md) involved with enabling it. It will be on by default once we've confirmed
that it performs well enough at large scale.

When enabled, Concourse will keep track of the credential values which were used in a build. When writing build logs to
the database, it will replace any occurrence of these values with the text `((redacted))`.

Say you're running a task which runs the following script:

```shell
set -e -u -x

echo $SECRET > some-file
sha1sum some-file
```

!!! note

    The `set -x` - the root cause of many accidental credential leaks.

Let's say you have a job which runs this task, providing the `$SECRET` parameter using a credential manager `((var))`:

```yaml
plan:
  - task: use-secret
    file: # ...
    params: { SECRET: ((some-var)) }
```

With `hello` in `some-var`, this will result in the following build output:

```shell
+ echo ((redacted))
+ sha1sum some-file
f572d396fae9206628714fb2ce00f72e94f2258f  some-file
```

Going a step further, what happens when that var has multiple lines of output, like `"hello\ngoodbye"`?

```shell
+ echo ((redacted)) ((redacted))
+ sha1sum some-file
638e5ebcd06a5208906960aa5fbe1d4ebd022771  some-file
```

What happened here? Well, because we didn't quote the `$SECRET` var arg to `echo`, it squashed the lines together into
arguments. This _could_ have confused our redacting logic and resulted in leaking the credential, but because Concourse
redacts secret values line-by-line, we're still OK. This will also help with JSON marshalled credential values, which
get interspersed with `\n` in a string literal.

Although Concourse tries to be thorough in its redacting of credentials, the best way to prevent credential leakage is
to not accidentally print them in the first place. Think of this as an airbag, not a seatbelt!