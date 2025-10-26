---
title: Gated Pipeline Patterns
---

Gated pipelines provide control for administrators and release managers on when a given software release is deployed to
a tightly protected environment (e.g. production).

The execution of jobs that perform certain tasks (e.g. deployment) targeting the downstream environment beyond the "
gate" step is done only upon either an approval coming from an external Change Control system or an explicit manual
trigger of such step.

## 1) - A Simple Gated Pipeline

By default, all [Jobs](../../jobs.md) only run when manually triggered. That means a user has to run [
`fly trigger-job`](../../jobs.md#fly-trigger-job) or click the plus button in the web interface for a job to run. A job
only runs automatically if one of its resources has the `trigger: true` parameter set.

Therefore, in order to create a gated job in a pipeline you simply need to create a job that can only be manually
triggered. That means not setting `trigger: true` for any of the jobs' [`get` steps](../../steps/get.md).

```yaml
jobs:
  - name: run-automatically
    plan:
      - get: my-repo
        trigger: true  # has trigger:true so automatically triggers
    # can include more steps to run other things before hitting the gate

  - name: the-gate  # manually trigger this job
    plan:
      - get: my-repo
        trigger: false  # redundant but guarantees the job won't run automatically
        passed:
          - run-automatically

  # runs immediately after the gate is triggered
  - name: do-more-stuff-after-the-gate
    plan:
      - get: my-repo
        passed:
          - the-gate
        trigger: true
    # can include more steps to run other things

resources:
  - name: my-repo
    type: git
    source:
      uri: https://github.com/concourse/examples.git
```

![](assets/gated-pipelines-01.png)

## 2) - Gated Pipeline Fanning In and Out

You can also use a gate as way to fan-in from multiple jobs and/or fan-out to multiple jobs as well.

```yaml linenums="1"
jobs:
  # three pre-gate jobs
  - name: job-a
    plan:
      - get: my-repo
        trigger: true
  - name: job-b
    plan:
      - get: my-repo
        trigger: true
  - name: job-c
    plan:
      - get: my-repo
        trigger: true

  - name: the-gate  # manually trigger this job
    plan:
      - get: my-repo
        trigger: false
        passed: # fan-in from the three pre-gate jobs
          - job-a
          - job-b
          - job-c

  # fan-out to three post-gate jobs
  - name: post-gate-job-a
    plan:
      - get: my-repo
        trigger: true
        passed: [ the-gate ]
  - name: post-gate-job-b
    plan:
      - get: my-repo
        trigger: true
        passed: [ the-gate ]
  - name: post-gate-job-c
    plan:
      - get: my-repo
        trigger: true
        passed: [ the-gate ]

resources:
  - name: my-repo
    type: git
    source:
      uri: https://github.com/concourse/examples.git
```

![](assets/gated-pipelines-02.png)

## 3) - A Gated Pipeline With Notifications

This pipeline shows you how you can send a notification, like an email, to notify someone that a new build of your
application is ready to be shipped.

```yaml linenums="1"
jobs:
  - name: build-it
    plan:
      - get: my-repo
        trigger: true
    # can add steps to build your app

  - name: test-it
    plan:
      - get: my-repo
        trigger: true
        passed: [ build-it ]
      # can add steps to run tests
      - put: email-release-manager
        params:
          subject: "Ready to ship"
          body_text: |
            A build is ready to be shipped!
            Build to be shipped: ${ATC_EXTERNAL_URL}/teams/${BUILD_TEAM_NAME}/pipelines/${BUILD_PIPELINE_NAME}/jobs/${BUILD_JOB_NAME}/builds/${BUILD_NAME}
            Link to pipeline: ${ATC_EXTERNAL_URL}/teams/${BUILD_TEAM_NAME}/pipelines/${BUILD_PIPELINE_NAME}

  - name: ship-it
    plan:
      - get: my-repo
        trigger: false
        passed: [ test-it ]

resources:
  - name: my-repo
    type: git
    source:
      uri: https://github.com/concourse/examples.git
  - name: email-release-manager
    type: email
    source:
      # other required fields for this resource have been omitted
      from: pipeline@example.com
      to: release-manager@example.com

resource_types:
  - name: email
    type: registry-image
    source:
      repository: pcfseceng/email-resource
```

![](assets/gated-pipelines-03.png)