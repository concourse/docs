---
title: Tags Step Modifier
---

# `tags` Step Modifier


???+ info "`tags`: [`[string]`](../../config-basics.md#string-schema)"

    The tags by which to match workers. The step will be placed within the pool
    of workers that match all the given set of tags.

    For example, if `[a, b]` is specified, only workers advertising the a and b
    tags (in addition to any others) will be used for running the step.

---

???+ example "Running in a private network"

    You may have a private cluster only reachable by special workers running
    on-premises. To run steps against those workers, just provide a matching
    tag:

    ```yaml
    plan:
      - get: my-repo
      - put: my-site
        tags:
          - private
        params:
          path: my-repo
      - task: acceptance-tests
        tags:
          - private
        file: my-repo/ci/acceptance.yml
    ```
