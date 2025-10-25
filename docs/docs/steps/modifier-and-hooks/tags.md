---
title: Tags Step Modifier
---

# `tags` Step Modifier

The tags by which to match workers. The step will be placed within the pool of workers that match all the given set of
tags.

For example, if `[a, b]` is specified, only workers advertising the a and b tags (in addition to any others) will be
used for running the step.