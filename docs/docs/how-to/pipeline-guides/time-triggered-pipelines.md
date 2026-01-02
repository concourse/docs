---
title: Time Triggered Pipeline Patterns
---

The [time resource](https://github.com/concourse/time-resource/) produces a
new [version](../../getting-started/resources.md#versions) for the time interval that was declared in its definition in
the pipeline configuration file.

The two most common usages are having the time resource trigger on an interval:

```yaml
resources:
  - name: trigger-every-3-minutes
    type: time
    source:
      interval: 3m
```

Or trigger once within a certain time range:

```yaml
resources:
  - name: trigger-daily-between-1am-and-2am
    type: time
    source:
      start: 1:00 AM
      stop: 2:00 AM
      location: America/Toronto
```

Check the README of the [time resource](https://github.com/concourse/time-resource/) for more details.

## 1) - Single Time Trigger

The following is an example of a pipeline that is triggered by a time resource on a pre-determined interval.

```yaml
resources:
  - name: trigger-every-3-minutes
    type: time
    source:
      interval: 3m

jobs:
  - name: run-forrest-run
    plan:
      - get: trigger-every-3-minutes
        trigger: true
    # can add other steps to run in this job

  - name: run-bubba-run
    plan:
      - get: trigger-every-3-minutes
        trigger: true
        passed:
          - run-forrest-run
    # can add other steps to run in this job
```

![](assets/time-triggered-pipelines-01.png)

## 2) - Multiple Time Triggers

As an enhancement to the previous sample with a single time trigger, this pipeline example implements two time resource
triggers and the ability to manually kick it off outside the time resources schedules.

The first time you set up a pipeline like this you will need to manually trigger it in order to satisfy the passed
constraint of the `manual-trigger` resource. Once one version is available that satisfies the passed constraint all
future triggers by the other resources will work as expected.

```yaml
resources:
  - name: trigger-every-4-minutes
    type: time
    source:
      interval: 4m
  - name: trigger-every-10-minutes
    type: time
    source:
      interval: 10m
  - name: manual-trigger
    type: time
    source:
      interval: 1m

jobs:
  - name: manual-trigger
    plan:
      - put: manual-trigger

  - name: run-forrest-run
    plan:
      - get: trigger-every-4-minutes
        trigger: true
      - get: trigger-every-10-minutes
        trigger: true
      - get: manual-trigger
        trigger: true
        passed:
          - manual-trigger
    # can add other steps to run in this job

  - name: run-bubba-run
    plan:
      - get: trigger-every-4-minutes
        trigger: true
        passed:
          - run-forrest-run
      - get: trigger-every-10-minutes
        trigger: true
        passed:
          - run-forrest-run
      - get: manual-trigger
        trigger: true
        passed:
          - run-forrest-run
    # can add other steps to run in this job
```

![](assets/time-triggered-pipelines-02.png)