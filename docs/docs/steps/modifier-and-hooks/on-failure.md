---
title: On Failure Step Hook
---

# `on-failure` Step Hook

A hook step to execute if the parent step fails.

This does not "recover" the failure - it will still fail even if the hook step succeeds.

??? info "`on_failure`: [`step`](../index.md)"

    ??? example "Alerting on failure"

        The following will perform the `alert` task only if the `unit` task fails:

        ```yaml
        plan:
          - get: foo
          - task: unit
            file: foo/unit.yml
            on_failure:
              task: alert
              file: foo/alert.yml
        ```