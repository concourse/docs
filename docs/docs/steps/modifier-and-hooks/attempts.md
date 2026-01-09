---
title: Attempts Step Modifier
---

# `attempts` Step Modifier

???+ info "`attempts`: [`number`](../../config-basics.md#number-schema)"

    The total number of times a step should be tried before it should fail, e.g.
    `5` will run the `step` up to 5 times before giving up.
    
    Attempts will retry on a Concourse error as well as build failure. When the
    number of attempts is reached and the step has still not succeeded then the
    step will fail.

---

??? example "Retrying a task"

    The following will run the task and retry it up to 9 times (for a total of 10 attempts) if it fails:

    ```yaml
    plan:
      - get: foo
      - task: unit
        file: foo/unit.yml
        attempts: 10
    ```

??? example "Retrying with a timeout"

    When used in combination with `timeout`, the timeout applies to each step.

    This semi-arbitrary decision was made because often things either succeed in
    a reasonable amount of time or fail due to hanging/flakiness. In this case
    it seems more useful to allow each attempt the allotted timeout rather than
    have one very long attempt prevent more attempts.

    ```yaml
    plan:
      - get: flake
      - task: flaky-tests
        file: flake/integration.yml
        timeout: 10m
        attempts: 3
    ```
