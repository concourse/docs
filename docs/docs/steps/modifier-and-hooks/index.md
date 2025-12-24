---
title: Modifiers and Hooks
---

If any step in the build plan fails, the build will fail and subsequent steps will not be executed. Additional steps may
be configured to run after failure by configuring [`on_failure`](on-failure.md) or [`ensure`](ensure.md) (or the job 
equivalents, `job.on_failure` and `job.ensure`) using Hooks and Modifiers.

<div class="grid cards" markdown>

-  Across

    ---
    Run a step multiple times with different combinations of variable values

    [:octicons-arrow-right-24: Configure](across.md)

-  Timeout

    ---
    End a step after a set amount a time

    [:octicons-arrow-right-24: Configure](timeout.md)

-  Attempts

    ---
    Run a step up to an amount of times before fully failing

    [:octicons-arrow-right-24: Configure](attempts.md)

-  Tags

    ---
    Only run this step on a specific worker

    [:octicons-arrow-right-24: Configure](tags.md)

-  On Success

    ---
    If the job passes, run this step

    [:octicons-arrow-right-24: Configure](on-success.md)

-  On Failure

    ---
    If the job fails, run this step

    [:octicons-arrow-right-24: Configure](on-failure.md)

-  On Abort

    ---
    If the job is canceled, run this step

    [:octicons-arrow-right-24: Configure](on-abort.md)

-  On Error

    ---
    If the job results in an error, run this step

    [:octicons-arrow-right-24: Configure](on-error.md)


-  Ensure

    ---
    Always run this step

    [:octicons-arrow-right-24: Configure](ensure.md)

</div>