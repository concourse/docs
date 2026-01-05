---
title: Redacting credentials
---

Concourse will automatically try to redact credentials from build output.

!!! warning

    Prior to v8, secret redaction was not enabled by default. To enable it on
    older versions of Concourse set the following on the [web
    node](../../install/running-web.md):
    ```properties
    CONCOURSE_ENABLE_REDACT_SECRETS=true
    ```

Concourse will keep track of the credential values which were used in a build.
These can be secrets referenced in your pipeline or those coming from the
[`load_var` step](../../steps/load-var.md).

When writing build logs to the database, it will replace any occurrence of these
values with the text `((redacted))`.

Say you're running a task which runs the following script:

```shell
set -e -u -x

echo $SECRET > some-file
sha1sum some-file
```

!!! note

    The `set -x` is the root cause of many accidental credential leaks.

Let's say you have a job which runs this task, providing the `$SECRET` parameter using a credential manager `((var))`:

```yaml
plan:
  - task: use-secret
    file: # ...
    params:
      SECRET: ((some-var))
```

With `hello` in `some-var`, this will result in the following build output:

```shell
+ echo ((redacted))
+ sha1sum some-file
f572d396fae9206628714fb2ce00f72e94f2258f  some-file
```

Going a step further, what happens when that value of your secret has multiple lines of output, like `"hello\ngoodbye"`?

```yaml
plan:
  - task: use-secret
    file: # ...
    params:
      SECRET: ((some-var)) # -> now equals "hello\ngoodbye"
```

```shell
+ echo ((redacted)) ((redacted))
+ sha1sum some-file
638e5ebcd06a5208906960aa5fbe1d4ebd022771  some-file
```

What happened here? Well, because we didn't quote the `$SECRET` var arg to
`echo`, it squashed the lines together into arguments. This _could_ have
confused our redacting logic and resulted in leaking the credential, but because
Concourse redacts secret values line-by-line, we're still OK. This will also
help with JSON marshalled credential values, which get interspersed with `\n` in
a string literal.

Although Concourse tries to be thorough in its redacting of credentials, the
best way to prevent credential leakage is to not accidentally print them in the
first place. Think of this as an airbag, not a seatbelt.
