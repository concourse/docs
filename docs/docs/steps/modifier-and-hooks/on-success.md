---
title: On Success Step Hook
---

# `on_success` Step Hook

???+ info "`on_success`: [`step`](../index.md)"

    A hook step to execute if the parent step succeeds.

---

???+ example "Running on success"

    The following will perform the second task only if the first one succeeds:

    ```yaml
    plan:
      - get: foo
      - task: unit
        file: foo/unit.yml
        on_success:
          task: alert
          file: foo/alert.yml
    ```

    Note that this is semantically equivalent to the following:

    ```yaml
    plan:
      - get: foo
      - task: unit
        file: foo/unit.yml
      - task: alert
        file: foo/alert.yml
    ```

    The `on_success` hook is provided mainly for cases where there is an equivalent [`on_failure`](on-failure.md), 
    and having them next to each other is more clear.
