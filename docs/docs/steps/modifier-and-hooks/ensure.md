---
title: Ensure Step Hook
---

# `ensure` Step Hook

A hook step to execute after the parent step regardless of whether the parent step succeeds, fails, or errors. The step
will also be executed if the build was aborted and its parent step was interrupted.

If the parent step succeeds and the ensured step fails, the overall step fails.