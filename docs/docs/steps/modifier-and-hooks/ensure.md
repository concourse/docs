---
title: Ensure Step Hook
---

# `ensure` Step Hook

???+ info "`ensure`: [`step`](../index.md)"

    A hook step to execute after the parent step regardless of whether the
    parent step succeeds, fails, or errors. The step will also be executed if
    the build was aborted and its parent step was interrupted.

    If the parent step succeeds and the ensured step fails, the overall step
    fails.

---

???+ example "Releasing a lock"

    The following build plan acquires a lock and then `ensure`s that the lock is released.

    ```yaml
    plan:
      - put: some-lock
        params:
          acquire: true
      - task: integration
        file: foo/integration.yml
        ensure:
          put: some-lock
          params:
            release: some-lock
    ```
