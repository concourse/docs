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

1. 
    ```
    Name:         PIPELINE_NAME.foo
    Namespace:    concourse-TEAM_NAME
    Type:         Opaque

    Data
    ====
    value:        32 bytes
    ```
1.  
    ```
    Name:         foo
    Namespace:    concourse-TEAM_NAME
    Type:         Opaque

    Data
    ====
    value:        32 bytes
    ```

You can also have nested fields if the contents of the secret is JSON, which can
be accessed using `.` syntax (e.g. `((foo.bar))`).

The prefix prepended to the namespace used by Concourse to search for secrets
(in the examples above, `concourse-`) can be changed by configuring the following
in the web node:

```properties
CONCOURSE_KUBERNETES_NAMESPACE_PREFIX=some-other-prefix-
```

If an action is being run in a one-off build, Concourse will not include the
pipeline name in the secret that it looks for.

## Configuring Kubernetes RBAC

As the Web nodes need to retrieve secrets from namespaces that are not their
own, they needs extra permissions to do so.

If you have [k8's
RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) enabled,
that means creating the necessary Kubernetes objects to identify the Web nodes
and give them access to a predefined list of namespaces where the secrets live.

Regardless of how the Kubernetes RBAC-related objects are created, the basic
requirement is that **`web` must be able to read secrets in the namespaces where
each teams' secrets live**.

For instance, if you have the following teams which you want to read secrets from:

* team-a
* team-b

Assuming the following [web node](../../install/running-web.md) configuration:

```properties
CONCOURSE_KUBERNETES_NAMESPACE_PREFIX=myprefix-
```

The web node must be able to get secrets from the following namespaces:

* `myprefix-team-a`
* `myprefix-team-b`

To allow the web node to interpolate credentials for "team-a" and "team-b", we'd
then need to create a few Kubernetes RBAC objects.

Starting with identifying the `web` service as an actor, we can use a
[ServiceAccount](https://kubernetes.io/docs/reference/access-authn-authz/service-accounts-admin/)
for that:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: web
  labels:
    app: web
```

To allow actors to do something, in this case, retrieve secrets from a given
namespace, a
[ClusterRole](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#api-overview)
is then needed.

```yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: read-secrets
  labels:
    app: web
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get"]
```

As that role is useless if not bound to an actor, the next step is creating the
the object that represents binding the role to the `web`'s `ServiceAccount` that
we created before.

This is accomplished through the
[RoleBinding](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding)
object, which is per-namespace (thus, per-team).

!!! note

    Even though in this example we're binding to a `ClusterRole` (which is not
    tied to any namespace), the use of such cluster role is (see
    `metadata.namespace`), making the effective permissions restricted to the
    namespace applied in the `RoleBinding`.

```yaml
---
# Role binding for the first team (`team-b`), allowing `web`
# to consume secrets from it.
#
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: web-team-a
  namespace: myprefix-team-a
  labels:
    app: web
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: read-secrets
subjects:
- kind: ServiceAccount
  name: web
  namespace: concourse

---
# Role binding for the second team (`team-b`), allowing `web`
# to consume secrets from it.
#
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: web-team-b
  namespace: myprefix-team-b
  labels:
    app: web
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: read-secrets
subjects:
- kind: ServiceAccount
  name: web
  namespace: concourse
```

To finish the example, we need to associate the `web`
[Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod/) with the service,
granting the pod access to those namespaces through the roles that have been
bound to it.

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: web
  labels:
    app: web
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: web
    spec:
      serviceAccountName: web
      containers:
        - name: web
          image: "concourse/concourse:latest"
          args: [ web ]
          env:
            - name: CONCOURSE_KUBERNETES_NAMESPACE_PREFIX
              value: "myprefix-"
          # ...
```
