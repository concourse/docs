---
title: Git Workflows
hide:
  - toc
---

Guides for triggering pipelines off Git activity and structuring pipelines
around common repository layouts.

<div class="grid cards" markdown>

-   __Basic Git Operations__

    ---

    Configure the `git` resource, check out a repo, and trigger on new
    commits.

    [:octicons-arrow-right-24: View guide](basic.md)

-   __Multi-Branch Workflows__

    ---

    Run different pipeline behavior depending on which branch changed.

    [:octicons-arrow-right-24: View guide](multi-branch.md)

-   __Monorepo Workflows__

    ---

    Trigger only the jobs affected by changes to a specific subdirectory
    in a repo with multiple projects.

    [:octicons-arrow-right-24: View guide](monorepo.md)

-   __Git-Triggered Job Example__

    ---

    A minimal end-to-end pipeline that runs a job whenever a repo updates.

    [:octicons-arrow-right-24: View guide](git-triggered.md)

</div>