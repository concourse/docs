---
title: Tags Step Modifier
---

# `tags` Step Modifier


???+ info "`tags`: [`[string]`](../../config-basics.md#string-schema)"

    The tags by which to match workers. The step will be placed within the pool
    of workers that match all the given set of tags.

    For example, if `[a, b]` is specified, only workers advertising the a and b
    tags (in addition to any others) will be used for running the step.

    #### ⚠️ Only in v8.3.0 or higher:
    When used with the `do` or `in_parallel` steps, all child steps will
    receive the `tags` of the parent step.

    Child steps can override these `tags` with their own set of `tags`. Tags
    cannot be cleared by child steps though. You'll need to create a more
    granular job plan if you want certain steps to remain untagged.

---

???+ example "Running in a private network"

    You may have a private cluster only reachable by special workers running
    on-premises. To run steps against those workers, just provide a matching
    tag:

    ```yaml
    plan:
      - get: my-repo
      - task: acceptance-tests
        tags:
          - private
        file: my-repo/ci/acceptance.yml
      - put: my-site
        tags:
          - private
        params:
          path: my-repo
    ```

???+ example "Tagging multiple steps"

    If you have multiple steps to tag you can easily tag them all using `do` or
    `in_parallel`.

    ```yaml
    plan:
      - tags: ["private"]
        do:
          - get: my-repo
          - task: acceptance-tests
            file: my-repo/ci/acceptance.yml
          - put: my-site
            params:
              path: my-repo
    ```
