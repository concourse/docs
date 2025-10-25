---
title: Attempts Step Modifier
---

# `attempts` Step Modifier

The total number of times a step should be tried before it should fail, e.g. `5` will run the `step` up to 5 times
before giving up.

Attempts will retry on a Concourse error as well as build failure. When the number of attempts is reached and the step
has still not succeeded then the step will fail.