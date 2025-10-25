---
title: On Error Step Hook
---

# `on-error` Step Hook

A hook step to execute after the parent step if the parent step terminates abnormally in any way other than those
handled by the [`on_abort`](on-abort.md) or [`on_failure`](on-failure.md). This covers scenarios as broad as
configuration mistakes, temporary network issues with the workers, or running longer than a [`timeout`](timeout.md).