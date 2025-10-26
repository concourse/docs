---
title: Metrics
---

Metrics are essential in understanding how any large system is behaving and performing. Concourse can emit metrics about
both the system health itself and about the builds that it is running. Operators can tap into these metrics in order to
observe the health of the system.

## Configuring Metrics

The [`web` node](../install/running-web.md) can be configured to emit metrics on start.

Currently supported metrics emitters are InfluxDB, NewRelic, Prometheus, and Datadog. There is also a dummy emitter that
will just spit the metrics out in to the logs at `DEBUG` level, which can be enabled with the `--emit-to-logs` flag.

Regardless of your metrics emitter, you can set `CONCOURSE_METRICS_BUFFER_SIZE` to determine how many metrics emissions
are sent at a time. Increasing this number can be helpful if sending metrics is regularly failing (due to rate limiting
or network failures) or if latency is particularly high.

There are various flags for different emitters; run `concourse web --help` and look for "Metric Emitter" to see what's
available.

## What's emitted?

This reference section lists of all the metrics that Concourse emits via the Prometheus emitter.

To make this document easy to maintain, Prometheus is used as the "source of truth" - primarily because it has help text
built-in, making this list easy to generate. Treat this list as a reference when looking for the equivalent metric names
for your emitter of choice.