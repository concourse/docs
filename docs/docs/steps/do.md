---
title: Do Step
---

# `do` Step


???+ warning "**`do`**: [`[step]`](index.md) (required)"

    Performs the given steps serially, with the same semantics as if they were at the top level step listing. Most commonly
    used with [`try` step](try.md), [across-step](modifier-and-hooks/across.md),
    and [step-hooks](modifier-and-hooks/index.md).

---

???+ example "Running multiple steps in a try"

    This can be used to perform multiple steps serially in a [`try` step](try.md):

    ```yaml
    jobs:
      - name: with-do
        plan:
          - try:
              do:
                - get: black-ice
                - get: control-node
                - get: cyberdeck

    resources:
      - name: black-ice
        type: mock
      - name: control-node
        type: mock
      - name: cyberdeck
        type: mock
    ```
