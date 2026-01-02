---
title: Kubernetes Credential Manager
---

Concourse can be configured to pull credentials
from [Kubernetes `secret` objects](https://kubernetes.io/docs/concepts/configuration/secret).

To configure it, either enable the in-cluster client by setting the following environment variable on
the [`web` node](../../install/running-web.md):

```properties
CONCOURSE_KUBERNETES_IN_CLUSTER=true
```

or set the path to a `kubeconfig` file:

```properties
CONCOURSE_KUBERNETES_CONFIG_PATH=~/.kube/config
```

## Credential lookup rules

When resolving a parameter such as `((foo))`, Concourse will look for it in the following order in the namespace
configured for that team:

## Configuring Kubernetes RBAC