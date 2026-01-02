---
title: Open Policy Agent Integration
---

!!! note

    The [Open Policy Agent](https://www.openpolicyagent.org/docs/latest/) (OPA, pronounced “oh-pa”) is an open source, 
    general-purpose policy engine that unifies policy enforcement across the stack.

OPA allows you to create arbitrary rules within Concourse without having to add a new feature to Concourse. You could
even recreate Concourse's [RBAC system](../auth-and-teams/user-roles.md) using OPA.

More likely use-cases are to enforce rules your organization may have, such as not using certain container images or
disallowing the use of privileged workloads. With OPA you can be as general or fine-grained as you want, enforcing these
rules at the team or pipeline level.

The next few sections explain how to configure Concourse to talk to an OPA server and how to write OPA rules for
Concourse.

## Configuring Concourse

There are four configuration options you need to set on the `concourse web` nodes to have them interact with OPA.

`CONCOURSE_OPA_URL`: The OPA policy check endpoint.

:   Should point to a specific `package/rule` that contains all Concourse rules for your cluster.

:   _Example_: `http://opa-endpoint.com/v1/data/concourse/decision`

`CONCOURSE_POLICY_CHECK_FILTER_HTTP_METHOD`: API http methods to go through policy check.

:   You will need to make sure these match up with an API action in the next two configuration options.

:   _Example_: `PUT,POST`

`CONCOURSE_POLICY_CHECK_FILTER_ACTION`: Actions in this list will go through policy check.

:   _Example_: `ListWorkers,ListContainers`

`CONCOURSE_POLICY_CHECK_FILTER_ACTION_SKIP`: Actions in this list will not go through policy check

:   _Example_: `PausePipeline,UnpausePipeline`

For the last three configuration options you can refer
to [this list of routes](https://github.com/concourse/concourse/blob/master/atc/routes.go) for a list of API actions and
their respective HTTP method. There are also some [Special Actions](#special-actions) not directly in the API.

## Writing OPA Rules

On the OPA server you'll need to create a package and policy for Concourse. This should match up with the endpoint
provided to Concourse. The [OPA documentation](https://www.openpolicyagent.org/docs/latest/) has a good guide explaining
how to generally write OPA rules and set up an OPA server.

For any actions that Concourse has been configured to filter it will send a JSON request to the OPA server with the
following details. Top-level data directly under the `input` key will be present for most actions. The information under
the `data` key will differ based on the action being checked.

This sample JSON payload is what OPA is sent when a user sets a pipeline. The `data` key contains the pipeline in JSON
format.

```json
{
  "input": {
    "service": "concourse",
    "cluster_name": "dev",
    "cluster_version": "7.4.0",
    "http_method": "PUT",
    "action": "SaveConfig",
    "user": "test",
    "team": "main",
    "pipeline": "check-pipeline",
    "data": {
      "jobs": [
        {
          "name": "test",
          "plan": [
            {
              "get": "tiny"
            },
            {
              "config": {
                "image_resource": {
                  "source": {
                    "repository": "busybox"
                  },
                  "type": "registry-image"
                },
                "platform": "linux",
                "run": {
                  "args": [
                    "-exc",
                    "echo hello"
                  ],
                  "path": "sh"
                }
              },
              "task": "a-task"
            }
          ]
        }
      ]
    }
  }
}
```

An OPA rule can respond to Concourse with three fields:

<div class="annotate" markdown>

* `allowed` (_required_): Boolean type. Setting to `False` will deny the action unless the `block` field is `False`.
* `block` (_optional_): Boolean type. If set to `False` and `allowed` is `True` this creates a soft-policy enforcement.
  The action will be allowed and the `reasons` will still be printed to the web UI like a warning message. (1)
* `reasons` (_optional_): List of string type. If an action is denied based on the `allowed` field then the reason(s)
  will be displayed in the UI.

</div>

1. Not setting `block` is the same as setting `"block": true`.

Here is an example OPA policy. By default, it will allow whatever action it has been sent. It will deny the action if
one or more of the three deny rules are true.

```rego title="concourse.rego" linenums="1"
package concourse

default decision = {"allowed": true}

decision = {"allowed": false, "reasons": reasons} {
  count(deny) > 0
  reasons := deny
}

deny["cannot use docker-image types"] {
  input.action == "UseImage"
  input.data.image_type == "docker-image"
}

deny["cannot run privileged tasks"] {
  input.action == "SaveConfig"
  input.data.jobs[_].plan[_].privileged
}

deny["cannot use privileged resource types"] {
  input.action == "SaveConfig"
  input.data.resource_types[_].privileged
}
```

## Special Actions

Most of the actions you can filter for come directly from the list
of [API actions](../auth-and-teams/user-roles.md#action-matrix). There are currently two special actions you can also
filter on.

### `UseImage`

Before Concourse starts a container you can check what image it is going to use to create the container. Depending on
the `image_type` the `image_source` field may contain other fields. The JSON payload for this action will look similar
to the following example:

```json
{
  "input": {
    "service": "concourse",
    "cluster_name": "dev",
    "cluster_version": "7.4.0",
    "action": "UseImage",
    "team": "main",
    "pipeline": "simple",
    "data": {
      "image_type": "registry-image",
      "privileged": true,
      "image_source": {
        "repository": "alpine",
        "tag": "latest"
      }
    }
  }
}
```

### `SetPipeline`

This action occurs whenever a [`set_pipeline` step](../steps/set-pipeline.md) is run. The JSON payload for this action
will contain the pipeline config in JSON format under the `data` key:

```json
{
  "input": {
    "service": "concourse",
    "cluster_name": "dev",
    "cluster_version": "7.4.0",
    "action": "SetPipeline",
    "team": "main",
    "pipeline": "simple",
    "data": {
      "jobs": [
        {
          "name": "test",
          "plan": [
            {
              "get": "tiny"
            },
            {
              "config": {
                "image_resource": {
                  "source": {
                    "repository": "busybox"
                  },
                  "type": "registry-image"
                },
                "platform": "linux",
                "run": {
                  "args": [
                    "-exc",
                    "echo hello"
                  ],
                  "path": "sh"
                }
              },
              "task": "a-task"
            }
          ]
        }
      ]
    }
  }
}
```