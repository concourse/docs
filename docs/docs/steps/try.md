---
title: Try Step
---

??? warning "**`try`**: [`step`](index.md)"

    Performs the given step, ignoring any failure and masking it with success.

    This can be used when you want to perform some side effect, but you don't really want the whole build to fail if it 
    doesn't work.

    ??? example "Allowing non-critical behavior to fail"

        When emitting logs somewhere for analyzing later, if the destination flakes out it may not really be critical, 
        so we may want to just swallow the error:

        ```yaml
        plan:
          - task: run-tests
            config: # ...
            on_success:
              try:
                put: test-logs
                params:
                  from: run-tests/*.log
          - task: do-something-else
            config: # ...
        ```