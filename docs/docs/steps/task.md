---
title: Task Step
---

# `task` Step

Executes a [task](../tasks.md). Expand each section below for more details and examples.

When a task completes, the artifacts specified by [`task-config.outputs`](../tasks.md#task-config-schema) will be
registered in the build's artifact namespace. This allows subsequent `task` steps and [`put` steps](put.md) to access
the result of a task.