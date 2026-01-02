---
title: Tracing
---

!!! warning "Experimental Feature"

    Tracing is an experimental feature.

Tracing in Concourse enables the delivery of traces related to the internal processes that go into running builds, and
other internal operations, breaking them down by time, and component.

It leverages the ([OpenTelemetry](https://opentelemetry.io/)) SDK to allow support for many platforms. Currently tracing
can be configured to integrates with:

* [Jaeger](https://www.jaegertracing.io/)
* [Google Cloud Trace](https://cloud.google.com/trace) (Stackdriver)
* [Honeycomb.io](https://honeycomb.io/)
* [OpenTelemetry Protocol Exporter](https://github.com/open-telemetry/opentelemetry-go/tree/master/exporters/otlp)

## Configuring Tracing

To export spans to Jaeger, specify the Thrift HTTP endpoint of the Jaeger collector:

```properties
CONCOURSE_TRACING_JAEGER_ENDPOINT=http://jaeger:14268/api/traces
```

To export spans to Google Cloud Trace, specify the GCP Project ID:

```properties
CONCOURSE_TRACING_STACKDRIVER_PROJECTID=your-gcp-project-id
```

Note that suitable GCP credentials must be available, via the usual [
`GOOGLE_APPLICATION_CREDENTIALS` environment variable](https://cloud.google.com/docs/authentication/getting-started#setting_the_environment_variable),
the default location that the `gcloud` CLI expects, or from GCP's metadata server (if Concourse is deployed on GCP).

To export spans the [OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector) via the OTLP
Exporter, specify your collector access endpoint:

```properties
CONCOURSE_TRACING_OTLP_ADDRESS=otel-collector.example.com:4317
CONCOURSE_TRACING_OTLP_USE_TLS=false
```

To export spans to [Lightstep](https://opentelemetry.lightstep.com/) via the OTLP Exporter, specify your collector
access token and endpoint:

```properties
CONCOURSE_TRACING_OTLP_ADDRESS=ingest.lightstep.com:443
CONCOURSE_TRACING_OTLP_HEADERS=lightstep-access-token:mysupersecrettoken
```

To export spans
to [Elastic Observability](https://www.elastic.co/guide/en/apm/get-started/current/open-telemetry-elastic.html) via the
OTLP Exporter, specify your Elastic APM secret token and endpoint:

```properties
CONCOURSE_TRACING_OTLP_ADDRESS=elastic-apm-server.example.com:443
CONCOURSE_TRACING_OTLP_HEADERS=Authorization=Bearer your-secret-token
```

To export spans to Honeycomb.io, specify the API key, dataset and optionally the service name:

```properties
CONCOURSE_TRACING_HONEYCOMB_API_KEY=your-honeycomb-api-key
CONCOURSE_TRACING_HONEYCOMB_DATASET=your-honeycomb-dataset
CONCOURSE_TRACING_HONEYCOMB_SERVICE_NAME=service-name-for-concourse  # NOTE: Optional. Defaults to "concourse"
```

## Trace context propagation

When tracing is enabled, trace context propagation is activated in pipeline tasks thanks to the injection of the
environment variable `TRACEPARENT` in `run` commands. The environment variable `TRACEPARENT` complies with
the [W3C Trace Context](https://www.w3.org/TR/trace-context/) specification.

## What's emitted?

Below is a summary of the various operations that Concourse currently traces. They are arranged like a call tree, so
that for each operation described, its sub-operations are described indented immediately below.

* `scanner.Run` -- An execution of the [Resource Checker](../internals/checker.md), responsible for determining which
  resources need to be checked.
    * `scanner.check` -- This operation simply represents inserting the check in the database.
* `scheduler.Run` -- This represents one tick of the [Build Scheduler](../internals/scheduler.md).
    * `schedule-job` -- this is the same operation scoped to a single job.
        * `Algorithm.Compute` -- this is where the [Algorithm](../internals/scheduler.md#algorithm) determines inputs
          for a job. Each of the resolvers below describes a different strategy for determining inputs, depending on the
          job's config.
            * `individualResolver.Resolve` -- This is used to determine versions input to a [
              `get` step](../steps/get.md) without `passed` constraints.
            * `groupResolver.Resolve` -- This is the juicy part of the algorithm, which deals with `passed` constraints.
            * `pinnedResolver.Resolve` -- This operation is used to determine inputs
              when [Version Pinning](../resources/resource-versions.md) is at play.
        * `job.EnsurePendingBuildExists` -- This is where a new build, if deemed necessary by scheduling constraints,
          will be inserted into the database. This operation follows from checker.Run above and will appear under the
          same trace as the check which produced the resource version responsible for triggering the new build.
* `build` -- this is the primary operation performed by the [Build Tracker](../internals/build-tracker.md). When a build
  is automatically triggered, this span follows from the `job.EnsurePendingBuildExists` operation which created the
  build, appearing in the same trace.
    * `get` -- this tracks the execution of a [`get` step](../steps/get.md).
    * `put` -- this tracks the execution of a [`put` step](../steps/put.md).
    * `task` -- this tracks the execution of a [`task` step](../steps/task.md).
    * `set_pipeline` -- this tracks the execution of a [`set_pipeline` step](../steps/set-pipeline.md).
    * `load_var` -- this tracks the execution of a [`load_var` step](../steps/load-var.md).