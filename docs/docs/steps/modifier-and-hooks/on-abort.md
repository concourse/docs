---
title: On Abort Step Hook
---

# `on_abort` Step Hook

???+ info "`on_abort`: [`step`](../index.md)"

    A hook step to execute if the build is aborted and the parent step was running and then terminated.

---

???+ example "Cleaning up on abort"

    The following will perform the `cleanup` task only if the build is aborted while the `unit` task was running:

    ```yaml
    plan:
      - get: foo
      - task: unit
        file: foo/unit.yml
        on_abort:
          task: cleanup
          file: foo/cleanup.yml
    ```
