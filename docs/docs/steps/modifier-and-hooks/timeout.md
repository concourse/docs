---
title: Timeout Step Modifier
---

# `timeout` Step Modifier


???+ info "`timeout`: [`duration`](../../config-basics.md#duration-schema)"

    The amount of time to limit the step's execution to, e.g. `30m` for 30 minutes.

    When exceeded, the step will be interrupted, with the same semantics as
    aborting the build (except the build will be `errored`, not `aborted`, to
    distinguish between human intervention and timeouts being enforced).

---

???+ example "Giving up"

    The following will run the `unit` task and cancel it if it takes longer than
    1 hour and 30 minutes:

    ```yaml
    plan:
      - get: foo
      - task: unit
        file: foo/unit.yml
        timeout: 1h30m
    ```
