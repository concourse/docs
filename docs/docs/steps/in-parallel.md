---
title: In Parallel Step
---

# `in_parallel` Step

Performs the given steps in parallel. If any sub-steps in a `parallel` result in a failure or error, the parallel step
as a whole is considered to have failed or errored. Expand each section below for more details and examples.

## `in_parallel_config` schema

Instead of passing in a list of steps to `in_parallel` you can pass in the following fields. The list of steps will fall
under the `steps` field.