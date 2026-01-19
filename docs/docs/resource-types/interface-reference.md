---
title: Resource Interface Reference
---

This is a quick technical overview of the interface that Resource Types
are expected to implement. For a more general walk-through read
[Implementing a Resource Type](./implementing.md).

---

A resource type is a container image with three executables:

* `/opt/resource/check`
* `/opt/resource/in`
* `/opt/resource/out`

## `/opt/resource/check`

The `check` executable will be run with no command-line arguments. On `stdin`
a JSON object with the following schema will be sent:

```json
{
  "source": {},
  "version": {}
}
```

* `source` will be a JSON object containing a [`config` schema](../config-basics.md#config-schema) from the `source` field the resource is configured with in a user's pipeline.
* `version` will only be present if a prior version exists. Its value will be the latest [`version`](../config-basics.md#version-schema) returned by the resource.

The resource is expected to then do the following:

* On `stderr` print any logs or messages.
* On `stdout` a JSON array containing [`version`'s](../config-basics.md#version-schema) in chronological order (oldest first, newest last) must be emitted. The JSON array can be empty.

The executable should `exit 0` if no error occurred and `exit 1` if an
error did occur.

## `/opt/resource/in`

## `/opt/resource/out`
