---
title: Pipeline Patterns
hide:
  - toc
---

Guides for structuring pipelines as they grow past a single job: gating
deploys on approval, running jobs on a schedule, passing configuration
between pipelines, and keeping configs maintainable over time.

<div class="grid cards" markdown>

-   __Common Pipeline Practices__

    ---

    Conventions worth adopting early, before a pipeline grows past a
    handful of jobs.

    [:octicons-arrow-right-24: View guide](common-pipeline.md)

-   __Managing Pipeline Configurations__

    ---

    Strategies for keeping pipeline YAML maintainable as it grows —
    templating, includes, and file organization.

    [:octicons-arrow-right-24: View guide](managing-pipeline-configs.md)

-   __Task Input and Output Scenarios__

    ---

    Worked scenarios beyond the basics: optional inputs, multiple
    outputs, and passing artifacts across jobs.

    [:octicons-arrow-right-24: View guide](task-inputs-outputs.md)

-   __Gated Pipeline Patterns__

    ---

    Hold a job until a condition is met — a passed version, a manual
    check, or an external signal.

    [:octicons-arrow-right-24: View guide](gated-pipelines.md)

-   __Manual Approval Step__

    ---

    Require a human to approve a job before it proceeds.

    [:octicons-arrow-right-24: View guide](manual-approval.md)

-   __Time-Triggered Pipelines__

    ---

    Run a job on a schedule using the `time` resource.

    [:octicons-arrow-right-24: View guide](time-triggered.md)

-   __Serial Job Example__

    ---

    Prevent overlapping runs of the same job with `serial: true`.

    [:octicons-arrow-right-24: View guide](serial-job.md)

-   __Pipeline `((vars))` Example__

    ---

    Parameterize a pipeline so the same config can deploy to multiple
    environments.

    [:octicons-arrow-right-24: View guide](pipeline-vars.md)

-   __Manually Triggered Job Example__

    ---

    Disable automatic triggering so a job only runs when someone
    explicitly asks for it.

    [:octicons-arrow-right-24: View guide](manually-triggered.md)

</div>