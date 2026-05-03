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

```metrics
# HELP concourse_builds_aborted_total Total number of Concourse builds aborted.
# TYPE concourse_builds_aborted_total counter
concourse_builds_aborted_total 0
# HELP concourse_builds_check_aborted_total Total number of Concourse check builds aborted.
# TYPE concourse_builds_check_aborted_total counter
concourse_builds_check_aborted_total 0
# HELP concourse_builds_check_errored_total Total number of Concourse check builds errored.
# TYPE concourse_builds_check_errored_total counter
concourse_builds_check_errored_total 0
# HELP concourse_builds_check_failed_total Total number of Concourse check builds failed.
# TYPE concourse_builds_check_failed_total counter
concourse_builds_check_failed_total 0
# HELP concourse_builds_check_finished_total Total number of Concourse check builds finished.
# TYPE concourse_builds_check_finished_total counter
concourse_builds_check_finished_total 0
# HELP concourse_builds_check_running Number of Concourse check builds currently running.
# TYPE concourse_builds_check_running gauge
concourse_builds_check_running 0
# HELP concourse_builds_check_started_total Total number of Concourse check builds started.
# TYPE concourse_builds_check_started_total counter
concourse_builds_check_started_total 0
# HELP concourse_builds_check_succeeded_total Total number of Concourse check builds succeeded.
# TYPE concourse_builds_check_succeeded_total counter
concourse_builds_check_succeeded_total 0
# HELP concourse_builds_errored_total Total number of Concourse builds errored.
# TYPE concourse_builds_errored_total counter
concourse_builds_errored_total 0
# HELP concourse_builds_failed_total Total number of Concourse builds failed.
# TYPE concourse_builds_failed_total counter
concourse_builds_failed_total 0
# HELP concourse_builds_finished_total Total number of Concourse builds finished.
# TYPE concourse_builds_finished_total counter
concourse_builds_finished_total 0
# HELP concourse_builds_running Number of Concourse builds currently running.
# TYPE concourse_builds_running gauge
concourse_builds_running 0
# HELP concourse_builds_started_total Total number of Concourse builds started.
# TYPE concourse_builds_started_total counter
concourse_builds_started_total 0
# HELP concourse_builds_succeeded_total Total number of Concourse builds succeeded.
# TYPE concourse_builds_succeeded_total counter
concourse_builds_succeeded_total 0
# HELP concourse_caches_get_step_cache_hits Total number of get steps that hit caches
# TYPE concourse_caches_get_step_cache_hits counter
concourse_caches_get_step_cache_hits 0
# HELP concourse_caches_streamed_resource_caches Total number of streamed resource caches
# TYPE concourse_caches_streamed_resource_caches counter
concourse_caches_streamed_resource_caches 0
# HELP concourse_db_connections Current number of concourse database connections
# TYPE concourse_db_connections gauge
concourse_db_connections{dbname="api"} 2
concourse_db_connections{dbname="backend"} 9
concourse_db_connections{dbname="gc"} 2
concourse_db_connections{dbname="worker"} 1
# HELP concourse_db_queries_total Total number of database Concourse database queries
# TYPE concourse_db_queries_total counter
concourse_db_queries_total 9167
# HELP concourse_gc_created_containers_to_be_garbage_collected Created Containers being garbage collected
# TYPE concourse_gc_created_containers_to_be_garbage_collected counter
concourse_gc_created_containers_to_be_garbage_collected 0
# HELP concourse_gc_created_volumes_to_be_garbage_collected Created Volumes being garbage collected
# TYPE concourse_gc_created_volumes_to_be_garbage_collected counter
concourse_gc_created_volumes_to_be_garbage_collected 0
# HELP concourse_gc_creating_containers_to_be_garbage_collected Creating Containers being garbage collected
# TYPE concourse_gc_creating_containers_to_be_garbage_collected counter
concourse_gc_creating_containers_to_be_garbage_collected 0
# HELP concourse_gc_destroying_containers_to_be_garbage_collected Destorying Containers being garbage collected
# TYPE concourse_gc_destroying_containers_to_be_garbage_collected counter
concourse_gc_destroying_containers_to_be_garbage_collected 0
# HELP concourse_gc_destroying_volumes_to_be_garbage_collected Destroying Volumes being garbage collected
# TYPE concourse_gc_destroying_volumes_to_be_garbage_collected counter
concourse_gc_destroying_volumes_to_be_garbage_collected 0
# HELP concourse_gc_failed_containers_to_be_garbage_collected Failed Containers being garbage collected
# TYPE concourse_gc_failed_containers_to_be_garbage_collected counter
concourse_gc_failed_containers_to_be_garbage_collected 0
# HELP concourse_gc_failed_volumes_to_be_garbage_collected Failed Volumes being garbage collected
# TYPE concourse_gc_failed_volumes_to_be_garbage_collected counter
concourse_gc_failed_volumes_to_be_garbage_collected 0
# HELP concourse_gc_gc_artifact_collector_duration Duration of gc artifact collector (ms)
# TYPE concourse_gc_gc_artifact_collector_duration histogram
concourse_gc_gc_artifact_collector_duration_bucket{le="1"} 45
concourse_gc_gc_artifact_collector_duration_bucket{le="60"} 61
concourse_gc_gc_artifact_collector_duration_bucket{le="180"} 61
concourse_gc_gc_artifact_collector_duration_bucket{le="300"} 61
concourse_gc_gc_artifact_collector_duration_bucket{le="600"} 61
concourse_gc_gc_artifact_collector_duration_bucket{le="900"} 61
concourse_gc_gc_artifact_collector_duration_bucket{le="1200"} 61
concourse_gc_gc_artifact_collector_duration_bucket{le="1800"} 61
concourse_gc_gc_artifact_collector_duration_bucket{le="2700"} 61
concourse_gc_gc_artifact_collector_duration_bucket{le="3600"} 61
concourse_gc_gc_artifact_collector_duration_bucket{le="7200"} 61
concourse_gc_gc_artifact_collector_duration_bucket{le="18000"} 61
concourse_gc_gc_artifact_collector_duration_bucket{le="36000"} 61
concourse_gc_gc_artifact_collector_duration_bucket{le="+Inf"} 61
concourse_gc_gc_artifact_collector_duration_sum 77.025416
concourse_gc_gc_artifact_collector_duration_count 61
# HELP concourse_gc_gc_build_collector_duration Duration of gc build collector (ms)
# TYPE concourse_gc_gc_build_collector_duration histogram
concourse_gc_gc_build_collector_duration_bucket{le="1"} 32
concourse_gc_gc_build_collector_duration_bucket{le="60"} 60
concourse_gc_gc_build_collector_duration_bucket{le="180"} 60
concourse_gc_gc_build_collector_duration_bucket{le="300"} 60
concourse_gc_gc_build_collector_duration_bucket{le="600"} 60
concourse_gc_gc_build_collector_duration_bucket{le="900"} 60
concourse_gc_gc_build_collector_duration_bucket{le="1200"} 60
concourse_gc_gc_build_collector_duration_bucket{le="1800"} 60
concourse_gc_gc_build_collector_duration_bucket{le="2700"} 60
concourse_gc_gc_build_collector_duration_bucket{le="3600"} 60
concourse_gc_gc_build_collector_duration_bucket{le="7200"} 60
concourse_gc_gc_build_collector_duration_bucket{le="18000"} 60
concourse_gc_gc_build_collector_duration_bucket{le="36000"} 60
concourse_gc_gc_build_collector_duration_bucket{le="+Inf"} 60
concourse_gc_gc_build_collector_duration_sum 86.32150100000001
concourse_gc_gc_build_collector_duration_count 60
# HELP concourse_gc_gc_container_collector_duration Duration of gc container collector (ms)
# TYPE concourse_gc_gc_container_collector_duration histogram
concourse_gc_gc_container_collector_duration_bucket{le="1"} 3
concourse_gc_gc_container_collector_duration_bucket{le="60"} 62
concourse_gc_gc_container_collector_duration_bucket{le="180"} 62
concourse_gc_gc_container_collector_duration_bucket{le="300"} 62
concourse_gc_gc_container_collector_duration_bucket{le="600"} 62
concourse_gc_gc_container_collector_duration_bucket{le="900"} 62
concourse_gc_gc_container_collector_duration_bucket{le="1200"} 62
concourse_gc_gc_container_collector_duration_bucket{le="1800"} 62
concourse_gc_gc_container_collector_duration_bucket{le="2700"} 62
concourse_gc_gc_container_collector_duration_bucket{le="3600"} 62
concourse_gc_gc_container_collector_duration_bucket{le="7200"} 62
concourse_gc_gc_container_collector_duration_bucket{le="18000"} 62
concourse_gc_gc_container_collector_duration_bucket{le="36000"} 62
concourse_gc_gc_container_collector_duration_bucket{le="+Inf"} 62
concourse_gc_gc_container_collector_duration_sum 207.125459
concourse_gc_gc_container_collector_duration_count 62
# HELP concourse_gc_gc_resource_cache_collector_duration Duration of gc resource cache collector (ms)
# TYPE concourse_gc_gc_resource_cache_collector_duration histogram
concourse_gc_gc_resource_cache_collector_duration_bucket{le="1"} 11
concourse_gc_gc_resource_cache_collector_duration_bucket{le="60"} 60
concourse_gc_gc_resource_cache_collector_duration_bucket{le="180"} 60
concourse_gc_gc_resource_cache_collector_duration_bucket{le="300"} 60
concourse_gc_gc_resource_cache_collector_duration_bucket{le="600"} 60
concourse_gc_gc_resource_cache_collector_duration_bucket{le="900"} 60
concourse_gc_gc_resource_cache_collector_duration_bucket{le="1200"} 60
concourse_gc_gc_resource_cache_collector_duration_bucket{le="1800"} 60
concourse_gc_gc_resource_cache_collector_duration_bucket{le="2700"} 60
concourse_gc_gc_resource_cache_collector_duration_bucket{le="3600"} 60
concourse_gc_gc_resource_cache_collector_duration_bucket{le="7200"} 60
concourse_gc_gc_resource_cache_collector_duration_bucket{le="18000"} 60
concourse_gc_gc_resource_cache_collector_duration_bucket{le="36000"} 60
concourse_gc_gc_resource_cache_collector_duration_bucket{le="+Inf"} 60
concourse_gc_gc_resource_cache_collector_duration_sum 331.3438329999999
concourse_gc_gc_resource_cache_collector_duration_count 60
# HELP concourse_gc_gc_resource_cache_use_collector_duration Duration of gc resource cache use collector (ms)
# TYPE concourse_gc_gc_resource_cache_use_collector_duration histogram
concourse_gc_gc_resource_cache_use_collector_duration_bucket{le="1"} 3
concourse_gc_gc_resource_cache_use_collector_duration_bucket{le="60"} 61
concourse_gc_gc_resource_cache_use_collector_duration_bucket{le="180"} 61
concourse_gc_gc_resource_cache_use_collector_duration_bucket{le="300"} 61
concourse_gc_gc_resource_cache_use_collector_duration_bucket{le="600"} 61
concourse_gc_gc_resource_cache_use_collector_duration_bucket{le="900"} 61
concourse_gc_gc_resource_cache_use_collector_duration_bucket{le="1200"} 61
concourse_gc_gc_resource_cache_use_collector_duration_bucket{le="1800"} 61
concourse_gc_gc_resource_cache_use_collector_duration_bucket{le="2700"} 61
concourse_gc_gc_resource_cache_use_collector_duration_bucket{le="3600"} 61
concourse_gc_gc_resource_cache_use_collector_duration_bucket{le="7200"} 61
concourse_gc_gc_resource_cache_use_collector_duration_bucket{le="18000"} 61
concourse_gc_gc_resource_cache_use_collector_duration_bucket{le="36000"} 61
concourse_gc_gc_resource_cache_use_collector_duration_bucket{le="+Inf"} 61
concourse_gc_gc_resource_cache_use_collector_duration_sum 128.06267400000002
concourse_gc_gc_resource_cache_use_collector_duration_count 61
# HELP concourse_gc_gc_resource_config_check_session_collector_duration Duration of gc resource config check session collector (ms)
# TYPE concourse_gc_gc_resource_config_check_session_collector_duration histogram
concourse_gc_gc_resource_config_check_session_collector_duration_bucket{le="1"} 0
concourse_gc_gc_resource_config_check_session_collector_duration_bucket{le="60"} 60
concourse_gc_gc_resource_config_check_session_collector_duration_bucket{le="180"} 60
concourse_gc_gc_resource_config_check_session_collector_duration_bucket{le="300"} 60
concourse_gc_gc_resource_config_check_session_collector_duration_bucket{le="600"} 60
concourse_gc_gc_resource_config_check_session_collector_duration_bucket{le="900"} 60
concourse_gc_gc_resource_config_check_session_collector_duration_bucket{le="1200"} 60
concourse_gc_gc_resource_config_check_session_collector_duration_bucket{le="1800"} 60
concourse_gc_gc_resource_config_check_session_collector_duration_bucket{le="2700"} 60
concourse_gc_gc_resource_config_check_session_collector_duration_bucket{le="3600"} 60
concourse_gc_gc_resource_config_check_session_collector_duration_bucket{le="7200"} 60
concourse_gc_gc_resource_config_check_session_collector_duration_bucket{le="18000"} 60
concourse_gc_gc_resource_config_check_session_collector_duration_bucket{le="36000"} 60
concourse_gc_gc_resource_config_check_session_collector_duration_bucket{le="+Inf"} 60
concourse_gc_gc_resource_config_check_session_collector_duration_sum 193.84025599999998
concourse_gc_gc_resource_config_check_session_collector_duration_count 60
# HELP concourse_gc_gc_resource_config_collector_duration Duration of gc resource config collector (ms)
# TYPE concourse_gc_gc_resource_config_collector_duration histogram
concourse_gc_gc_resource_config_collector_duration_bucket{le="1"} 32
concourse_gc_gc_resource_config_collector_duration_bucket{le="60"} 61
concourse_gc_gc_resource_config_collector_duration_bucket{le="180"} 61
concourse_gc_gc_resource_config_collector_duration_bucket{le="300"} 61
concourse_gc_gc_resource_config_collector_duration_bucket{le="600"} 61
concourse_gc_gc_resource_config_collector_duration_bucket{le="900"} 61
concourse_gc_gc_resource_config_collector_duration_bucket{le="1200"} 61
concourse_gc_gc_resource_config_collector_duration_bucket{le="1800"} 61
concourse_gc_gc_resource_config_collector_duration_bucket{le="2700"} 61
concourse_gc_gc_resource_config_collector_duration_bucket{le="3600"} 61
concourse_gc_gc_resource_config_collector_duration_bucket{le="7200"} 61
concourse_gc_gc_resource_config_collector_duration_bucket{le="18000"} 61
concourse_gc_gc_resource_config_collector_duration_bucket{le="36000"} 61
concourse_gc_gc_resource_config_collector_duration_bucket{le="+Inf"} 61
concourse_gc_gc_resource_config_collector_duration_sum 110.932122
concourse_gc_gc_resource_config_collector_duration_count 61
# HELP concourse_gc_gc_task_cache_collector_duration Duration of gc task cache collector (ms)
# TYPE concourse_gc_gc_task_cache_collector_duration histogram
concourse_gc_gc_task_cache_collector_duration_bucket{le="1"} 31
concourse_gc_gc_task_cache_collector_duration_bucket{le="60"} 59
concourse_gc_gc_task_cache_collector_duration_bucket{le="180"} 59
concourse_gc_gc_task_cache_collector_duration_bucket{le="300"} 59
concourse_gc_gc_task_cache_collector_duration_bucket{le="600"} 59
concourse_gc_gc_task_cache_collector_duration_bucket{le="900"} 59
concourse_gc_gc_task_cache_collector_duration_bucket{le="1200"} 59
concourse_gc_gc_task_cache_collector_duration_bucket{le="1800"} 59
concourse_gc_gc_task_cache_collector_duration_bucket{le="2700"} 59
concourse_gc_gc_task_cache_collector_duration_bucket{le="3600"} 59
concourse_gc_gc_task_cache_collector_duration_bucket{le="7200"} 59
concourse_gc_gc_task_cache_collector_duration_bucket{le="18000"} 59
concourse_gc_gc_task_cache_collector_duration_bucket{le="36000"} 59
concourse_gc_gc_task_cache_collector_duration_bucket{le="+Inf"} 59
concourse_gc_gc_task_cache_collector_duration_sum 104.08358500000001
concourse_gc_gc_task_cache_collector_duration_count 59
# HELP concourse_gc_gc_volume_collector_duration Duration of gc volume collector (ms)
# TYPE concourse_gc_gc_volume_collector_duration histogram
concourse_gc_gc_volume_collector_duration_bucket{le="1"} 0
concourse_gc_gc_volume_collector_duration_bucket{le="60"} 60
concourse_gc_gc_volume_collector_duration_bucket{le="180"} 60
concourse_gc_gc_volume_collector_duration_bucket{le="300"} 60
concourse_gc_gc_volume_collector_duration_bucket{le="600"} 60
concourse_gc_gc_volume_collector_duration_bucket{le="900"} 60
concourse_gc_gc_volume_collector_duration_bucket{le="1200"} 60
concourse_gc_gc_volume_collector_duration_bucket{le="1800"} 60
concourse_gc_gc_volume_collector_duration_bucket{le="2700"} 60
concourse_gc_gc_volume_collector_duration_bucket{le="3600"} 60
concourse_gc_gc_volume_collector_duration_bucket{le="7200"} 60
concourse_gc_gc_volume_collector_duration_bucket{le="18000"} 60
concourse_gc_gc_volume_collector_duration_bucket{le="36000"} 60
concourse_gc_gc_volume_collector_duration_bucket{le="+Inf"} 60
concourse_gc_gc_volume_collector_duration_sum 290.0360840000001
concourse_gc_gc_volume_collector_duration_count 60
# HELP concourse_gc_gc_worker_collector_duration Duration of gc worker collector (ms)
# TYPE concourse_gc_gc_worker_collector_duration histogram
concourse_gc_gc_worker_collector_duration_bucket{le="1"} 2
concourse_gc_gc_worker_collector_duration_bucket{le="60"} 60
concourse_gc_gc_worker_collector_duration_bucket{le="180"} 60
concourse_gc_gc_worker_collector_duration_bucket{le="300"} 60
concourse_gc_gc_worker_collector_duration_bucket{le="600"} 60
concourse_gc_gc_worker_collector_duration_bucket{le="900"} 60
concourse_gc_gc_worker_collector_duration_bucket{le="1200"} 60
concourse_gc_gc_worker_collector_duration_bucket{le="1800"} 60
concourse_gc_gc_worker_collector_duration_bucket{le="2700"} 60
concourse_gc_gc_worker_collector_duration_bucket{le="3600"} 60
concourse_gc_gc_worker_collector_duration_bucket{le="7200"} 60
concourse_gc_gc_worker_collector_duration_bucket{le="18000"} 60
concourse_gc_gc_worker_collector_duration_bucket{le="36000"} 60
concourse_gc_gc_worker_collector_duration_bucket{le="+Inf"} 60
concourse_gc_gc_worker_collector_duration_sum 247.88092000000006
concourse_gc_gc_worker_collector_duration_count 60
# HELP concourse_http_responses_duration_seconds Response time in seconds
# TYPE concourse_http_responses_duration_seconds histogram
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingContainers",status="200",le="0.005"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingContainers",status="200",le="0.01"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingContainers",status="200",le="0.025"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingContainers",status="200",le="0.05"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingContainers",status="200",le="0.1"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingContainers",status="200",le="0.25"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingContainers",status="200",le="0.5"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingContainers",status="200",le="1"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingContainers",status="200",le="2.5"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingContainers",status="200",le="5"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingContainers",status="200",le="10"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingContainers",status="200",le="+Inf"} 70
concourse_http_responses_duration_seconds_sum{method="GET",route="ListDestroyingContainers",status="200"} 0.03719846200000001
concourse_http_responses_duration_seconds_count{method="GET",route="ListDestroyingContainers",status="200"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingVolumes",status="200",le="0.005"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingVolumes",status="200",le="0.01"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingVolumes",status="200",le="0.025"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingVolumes",status="200",le="0.05"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingVolumes",status="200",le="0.1"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingVolumes",status="200",le="0.25"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingVolumes",status="200",le="0.5"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingVolumes",status="200",le="1"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingVolumes",status="200",le="2.5"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingVolumes",status="200",le="5"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingVolumes",status="200",le="10"} 70
concourse_http_responses_duration_seconds_bucket{method="GET",route="ListDestroyingVolumes",status="200",le="+Inf"} 70
concourse_http_responses_duration_seconds_sum{method="GET",route="ListDestroyingVolumes",status="200"} 0.03645629399999999
concourse_http_responses_duration_seconds_count{method="GET",route="ListDestroyingVolumes",status="200"} 70
concourse_http_responses_duration_seconds_bucket{method="POST",route="RegisterWorker",status="200",le="0.005"} 0
concourse_http_responses_duration_seconds_bucket{method="POST",route="RegisterWorker",status="200",le="0.01"} 0
concourse_http_responses_duration_seconds_bucket{method="POST",route="RegisterWorker",status="200",le="0.025"} 1
concourse_http_responses_duration_seconds_bucket{method="POST",route="RegisterWorker",status="200",le="0.05"} 1
concourse_http_responses_duration_seconds_bucket{method="POST",route="RegisterWorker",status="200",le="0.1"} 1
concourse_http_responses_duration_seconds_bucket{method="POST",route="RegisterWorker",status="200",le="0.25"} 1
concourse_http_responses_duration_seconds_bucket{method="POST",route="RegisterWorker",status="200",le="0.5"} 1
concourse_http_responses_duration_seconds_bucket{method="POST",route="RegisterWorker",status="200",le="1"} 1
concourse_http_responses_duration_seconds_bucket{method="POST",route="RegisterWorker",status="200",le="2.5"} 1
concourse_http_responses_duration_seconds_bucket{method="POST",route="RegisterWorker",status="200",le="5"} 1
concourse_http_responses_duration_seconds_bucket{method="POST",route="RegisterWorker",status="200",le="10"} 1
concourse_http_responses_duration_seconds_bucket{method="POST",route="RegisterWorker",status="200",le="+Inf"} 1
concourse_http_responses_duration_seconds_sum{method="POST",route="RegisterWorker",status="200"} 0.012538125
concourse_http_responses_duration_seconds_count{method="POST",route="RegisterWorker",status="200"} 1
concourse_http_responses_duration_seconds_bucket{method="PUT",route="HeartbeatWorker",status="200",le="0.005"} 55
concourse_http_responses_duration_seconds_bucket{method="PUT",route="HeartbeatWorker",status="200",le="0.01"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="HeartbeatWorker",status="200",le="0.025"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="HeartbeatWorker",status="200",le="0.05"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="HeartbeatWorker",status="200",le="0.1"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="HeartbeatWorker",status="200",le="0.25"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="HeartbeatWorker",status="200",le="0.5"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="HeartbeatWorker",status="200",le="1"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="HeartbeatWorker",status="200",le="2.5"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="HeartbeatWorker",status="200",le="5"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="HeartbeatWorker",status="200",le="10"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="HeartbeatWorker",status="200",le="+Inf"} 70
concourse_http_responses_duration_seconds_sum{method="PUT",route="HeartbeatWorker",status="200"} 0.30421187699999996
concourse_http_responses_duration_seconds_count{method="PUT",route="HeartbeatWorker",status="200"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerContainers",status="204",le="0.005"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerContainers",status="204",le="0.01"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerContainers",status="204",le="0.025"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerContainers",status="204",le="0.05"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerContainers",status="204",le="0.1"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerContainers",status="204",le="0.25"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerContainers",status="204",le="0.5"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerContainers",status="204",le="1"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerContainers",status="204",le="2.5"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerContainers",status="204",le="5"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerContainers",status="204",le="10"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerContainers",status="204",le="+Inf"} 70
concourse_http_responses_duration_seconds_sum{method="PUT",route="ReportWorkerContainers",status="204"} 0.15466729399999998
concourse_http_responses_duration_seconds_count{method="PUT",route="ReportWorkerContainers",status="204"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerVolumes",status="204",le="0.005"} 69
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerVolumes",status="204",le="0.01"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerVolumes",status="204",le="0.025"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerVolumes",status="204",le="0.05"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerVolumes",status="204",le="0.1"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerVolumes",status="204",le="0.25"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerVolumes",status="204",le="0.5"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerVolumes",status="204",le="1"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerVolumes",status="204",le="2.5"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerVolumes",status="204",le="5"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerVolumes",status="204",le="10"} 70
concourse_http_responses_duration_seconds_bucket{method="PUT",route="ReportWorkerVolumes",status="204",le="+Inf"} 70
concourse_http_responses_duration_seconds_sum{method="PUT",route="ReportWorkerVolumes",status="204"} 0.17036525000000008
concourse_http_responses_duration_seconds_count{method="PUT",route="ReportWorkerVolumes",status="204"} 70
# HELP concourse_jobs_scheduled_total Total number of Concourse jobs scheduled.
# TYPE concourse_jobs_scheduled_total counter
concourse_jobs_scheduled_total 0
# HELP concourse_jobs_scheduling Number of Concourse jobs currently being scheduled.
# TYPE concourse_jobs_scheduling gauge
concourse_jobs_scheduling 0
# HELP concourse_lidar_checks_enqueued_total Total number of checks enqueued
# TYPE concourse_lidar_checks_enqueued_total counter
concourse_lidar_checks_enqueued_total 0
# HELP concourse_lidar_checks_finished_total Total number of checks finished.
# TYPE concourse_lidar_checks_finished_total counter
concourse_lidar_checks_finished_total{status="error"} 0
concourse_lidar_checks_finished_total{status="success"} 0
# HELP concourse_lidar_checks_started_total Total number of checks started. With global resource enabled, a check build may not really run a check, thus total checks started should be less than total check builds started.
# TYPE concourse_lidar_checks_started_total counter
concourse_lidar_checks_started_total 0
# HELP concourse_locks_held Database locks held
# TYPE concourse_locks_held gauge
concourse_locks_held{type="Batch"} 0
concourse_locks_held{type="DatabaseMigration"} 0
# HELP concourse_volumes_orphaned_volumes_to_be_deleted Number of orphaned volumes to be garbage collected.
# TYPE concourse_volumes_orphaned_volumes_to_be_deleted counter
concourse_volumes_orphaned_volumes_to_be_deleted 0
# HELP concourse_volumes_volumes_streamed Total number of volumes streamed from one worker to the other
# TYPE concourse_volumes_volumes_streamed counter
concourse_volumes_volumes_streamed 0
# HELP concourse_workers_containers Number of containers per worker
# TYPE concourse_workers_containers gauge
concourse_workers_containers{platform="linux",tags="",team="",worker="9a0601fa83c3"} 0
# HELP concourse_workers_registered Number of workers per state as seen by the database
# TYPE concourse_workers_registered gauge
concourse_workers_registered{state="landed"} 0
concourse_workers_registered{state="landing"} 0
concourse_workers_registered{state="retiring"} 0
concourse_workers_registered{state="running"} 1
concourse_workers_registered{state="stalled"} 0
# HELP concourse_workers_tasks Number of active tasks per worker
# TYPE concourse_workers_tasks gauge
concourse_workers_tasks{platform="linux",worker="9a0601fa83c3"} 0
# HELP concourse_workers_unknown_containers Number of unknown containers found on worker
# TYPE concourse_workers_unknown_containers gauge
concourse_workers_unknown_containers{worker="9a0601fa83c3"} 0
# HELP concourse_workers_unknown_volumes Number of unknown volumes found on worker
# TYPE concourse_workers_unknown_volumes gauge
concourse_workers_unknown_volumes{worker="9a0601fa83c3"} 0
# HELP concourse_workers_volumes Number of volumes per worker
# TYPE concourse_workers_volumes gauge
concourse_workers_volumes{platform="linux",tags="",team="",worker="9a0601fa83c3"} 0
# HELP go_gc_duration_seconds A summary of the wall-time pause (stop-the-world) duration in garbage collection cycles.
# TYPE go_gc_duration_seconds summary
go_gc_duration_seconds{quantile="0"} 3.2042e-05
go_gc_duration_seconds{quantile="0.25"} 0.000164707
go_gc_duration_seconds{quantile="0.5"} 0.000459626
go_gc_duration_seconds{quantile="0.75"} 0.000771667
go_gc_duration_seconds{quantile="1"} 0.00251525
go_gc_duration_seconds_sum 0.022669713
go_gc_duration_seconds_count 39
# HELP go_gc_gogc_percent Heap size target percentage configured by the user, otherwise 100. This value is set by the GOGC environment variable, and the runtime/debug.SetGCPercent function. Sourced from /gc/gogc:percent.
# TYPE go_gc_gogc_percent gauge
go_gc_gogc_percent 100
# HELP go_gc_gomemlimit_bytes Go runtime memory limit configured by the user, otherwise math.MaxInt64. This value is set by the GOMEMLIMIT environment variable, and the runtime/debug.SetMemoryLimit function. Sourced from /gc/gomemlimit:bytes.
# TYPE go_gc_gomemlimit_bytes gauge
go_gc_gomemlimit_bytes 9.223372036854776e+18
# HELP go_goroutines Number of goroutines that currently exist.
# TYPE go_goroutines gauge
go_goroutines 276
# HELP go_info Information about the Go environment.
# TYPE go_info gauge
go_info{version="go1.26.0"} 1
# HELP go_memstats_alloc_bytes Number of bytes allocated in heap and currently in use. Equals to /memory/classes/heap/objects:bytes.
# TYPE go_memstats_alloc_bytes gauge
go_memstats_alloc_bytes 2.1126904e+07
# HELP go_memstats_alloc_bytes_total Total number of bytes allocated in heap until now, even if released already. Equals to /gc/heap/allocs:bytes.
# TYPE go_memstats_alloc_bytes_total counter
go_memstats_alloc_bytes_total 3.11170672e+08
# HELP go_memstats_buck_hash_sys_bytes Number of bytes used by the profiling bucket hash table. Equals to /memory/classes/profiling/buckets:bytes.
# TYPE go_memstats_buck_hash_sys_bytes gauge
go_memstats_buck_hash_sys_bytes 1.553367e+06
# HELP go_memstats_frees_total Total number of heap objects frees. Equals to /gc/heap/frees:objects + /gc/heap/tiny/allocs:objects.
# TYPE go_memstats_frees_total counter
go_memstats_frees_total 2.543497e+06
# HELP go_memstats_gc_sys_bytes Number of bytes used for garbage collection system metadata. Equals to /memory/classes/metadata/other:bytes.
# TYPE go_memstats_gc_sys_bytes gauge
go_memstats_gc_sys_bytes 4.379392e+06
# HELP go_memstats_heap_alloc_bytes Number of heap bytes allocated and currently in use, same as go_memstats_alloc_bytes. Equals to /memory/classes/heap/objects:bytes.
# TYPE go_memstats_heap_alloc_bytes gauge
go_memstats_heap_alloc_bytes 2.1126904e+07
# HELP go_memstats_heap_idle_bytes Number of heap bytes waiting to be used. Equals to /memory/classes/heap/released:bytes + /memory/classes/heap/free:bytes.
# TYPE go_memstats_heap_idle_bytes gauge
go_memstats_heap_idle_bytes 6.742016e+06
# HELP go_memstats_heap_inuse_bytes Number of heap bytes that are in use. Equals to /memory/classes/heap/objects:bytes + /memory/classes/heap/unused:bytes
# TYPE go_memstats_heap_inuse_bytes gauge
go_memstats_heap_inuse_bytes 2.4158208e+07
# HELP go_memstats_heap_objects Number of currently allocated objects. Equals to /gc/heap/objects:objects.
# TYPE go_memstats_heap_objects gauge
go_memstats_heap_objects 126170
# HELP go_memstats_heap_released_bytes Number of heap bytes released to OS. Equals to /memory/classes/heap/released:bytes.
# TYPE go_memstats_heap_released_bytes gauge
go_memstats_heap_released_bytes 4.120576e+06
# HELP go_memstats_heap_sys_bytes Number of heap bytes obtained from system. Equals to /memory/classes/heap/objects:bytes + /memory/classes/heap/unused:bytes + /memory/classes/heap/released:bytes + /memory/classes/heap/free:bytes.
# TYPE go_memstats_heap_sys_bytes gauge
go_memstats_heap_sys_bytes 3.0900224e+07
# HELP go_memstats_last_gc_time_seconds Number of seconds since 1970 of last garbage collection.
# TYPE go_memstats_last_gc_time_seconds gauge
go_memstats_last_gc_time_seconds 1.7778235193367627e+09
# HELP go_memstats_mallocs_total Total number of heap objects allocated, both live and gc-ed. Semantically a counter version for go_memstats_heap_objects gauge. Equals to /gc/heap/allocs:objects + /gc/heap/tiny/allocs:objects.
# TYPE go_memstats_mallocs_total counter
go_memstats_mallocs_total 2.669667e+06
# HELP go_memstats_mcache_inuse_bytes Number of bytes in use by mcache structures. Equals to /memory/classes/metadata/mcache/inuse:bytes.
# TYPE go_memstats_mcache_inuse_bytes gauge
go_memstats_mcache_inuse_bytes 22960
# HELP go_memstats_mcache_sys_bytes Number of bytes used for mcache structures obtained from system. Equals to /memory/classes/metadata/mcache/inuse:bytes + /memory/classes/metadata/mcache/free:bytes.
# TYPE go_memstats_mcache_sys_bytes gauge
go_memstats_mcache_sys_bytes 32144
# HELP go_memstats_mspan_inuse_bytes Number of bytes in use by mspan structures. Equals to /memory/classes/metadata/mspan/inuse:bytes.
# TYPE go_memstats_mspan_inuse_bytes gauge
go_memstats_mspan_inuse_bytes 383680
# HELP go_memstats_mspan_sys_bytes Number of bytes used for mspan structures obtained from system. Equals to /memory/classes/metadata/mspan/inuse:bytes + /memory/classes/metadata/mspan/free:bytes.
# TYPE go_memstats_mspan_sys_bytes gauge
go_memstats_mspan_sys_bytes 391680
# HELP go_memstats_next_gc_bytes Number of heap bytes when next garbage collection will take place. Equals to /gc/heap/goal:bytes.
# TYPE go_memstats_next_gc_bytes gauge
go_memstats_next_gc_bytes 2.421777e+07
# HELP go_memstats_other_sys_bytes Number of bytes used for other system allocations. Equals to /memory/classes/other:bytes.
# TYPE go_memstats_other_sys_bytes gauge
go_memstats_other_sys_bytes 2.271921e+06
# HELP go_memstats_stack_inuse_bytes Number of bytes obtained from system for stack allocator in non-CGO environments. Equals to /memory/classes/heap/stacks:bytes.
# TYPE go_memstats_stack_inuse_bytes gauge
go_memstats_stack_inuse_bytes 2.654208e+06
# HELP go_memstats_stack_sys_bytes Number of bytes obtained from system for stack allocator. Equals to /memory/classes/heap/stacks:bytes + /memory/classes/os-stacks:bytes.
# TYPE go_memstats_stack_sys_bytes gauge
go_memstats_stack_sys_bytes 2.654208e+06
# HELP go_memstats_sys_bytes Number of bytes obtained from system. Equals to /memory/classes/total:byte.
# TYPE go_memstats_sys_bytes gauge
go_memstats_sys_bytes 4.2182936e+07
# HELP go_sched_gomaxprocs_threads The current runtime.GOMAXPROCS setting, or the number of operating system threads that can execute user-level Go code simultaneously. Sourced from /sched/gomaxprocs:threads.
# TYPE go_sched_gomaxprocs_threads gauge
go_sched_gomaxprocs_threads 10
# HELP go_threads Number of OS threads created.
# TYPE go_threads gauge
go_threads 16
# HELP process_cpu_seconds_total Total user and system CPU time spent in seconds.
# TYPE process_cpu_seconds_total counter
process_cpu_seconds_total 11.04
# HELP process_max_fds Maximum number of open file descriptors.
# TYPE process_max_fds gauge
process_max_fds 1.048576e+06
# HELP process_network_receive_bytes_total Number of bytes received by the process over the network.
# TYPE process_network_receive_bytes_total counter
process_network_receive_bytes_total 7.62626e+06
# HELP process_network_transmit_bytes_total Number of bytes sent by the process over the network.
# TYPE process_network_transmit_bytes_total counter
process_network_transmit_bytes_total 7.337874e+06
# HELP process_open_fds Number of open file descriptors.
# TYPE process_open_fds gauge
process_open_fds 54
# HELP process_resident_memory_bytes Resident memory size in bytes.
# TYPE process_resident_memory_bytes gauge
process_resident_memory_bytes 9.070592e+07
# HELP process_start_time_seconds Start time of the process since unix epoch in seconds.
# TYPE process_start_time_seconds gauge
process_start_time_seconds 1.77782147847e+09
# HELP process_virtual_memory_bytes Virtual memory size in bytes.
# TYPE process_virtual_memory_bytes gauge
process_virtual_memory_bytes 1.452793856e+09
# HELP process_virtual_memory_max_bytes Maximum amount of virtual memory available in bytes.
# TYPE process_virtual_memory_max_bytes gauge
process_virtual_memory_max_bytes 1.8446744073709552e+19
# HELP promhttp_metric_handler_requests_in_flight Current number of scrapes being served.
# TYPE promhttp_metric_handler_requests_in_flight gauge
promhttp_metric_handler_requests_in_flight 1
# HELP promhttp_metric_handler_requests_total Total number of scrapes by HTTP status code.
# TYPE promhttp_metric_handler_requests_total counter
promhttp_metric_handler_requests_total{code="200"} 2
promhttp_metric_handler_requests_total{code="500"} 0
promhttp_metric_handler_requests_total{code="503"} 0
```