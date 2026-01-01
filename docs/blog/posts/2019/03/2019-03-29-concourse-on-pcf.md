---
title: Installing Concourse 5.0 on Kubernetes using Helm
date: 2019-03-29
authors:
  - jghiloni
---

![](assets/2019-03-29-concourse-on-pcf-01.jpg)
/// caption
A close up of the helm of a boat
///

This article was written in conjunction with Éamon Ryan, Advisory Solutions Architect at Pivotal.

<!-- more -->

In early 2018, Pivotal and VMware came together to
release [Pivotal Container Service](https://pivotal.io/platform/pivotal-container-service), known as PKS, to provide the
power of [Kubernetes](https://kubernetes.io/) with the reliability of [BOSH](https://bosh.io/) and an alternative
to [Pivotal Application Service](https://pivotal.io/platform/pivotal-application-service) for software that needs it.

The rise of Kubernetes (k8s) as a popular developer platform led me to wonder how easy it would be to
install [Concourse 5.0](https://concourse-ci.org/download.html#v500) on PKS. It turns out, it’s very easy indeed. This
tutorial will assume you’ve already installed PKS 1.3 on vSphere that has NSX-T, VMware’s software defined networking
(SDN) solution, installed.

While these instructions are based on PKS, the Helm chart you will use work on any k8s provider. If you already have
your cluster provisioned, you can skip ahead
to “[Using the Helm Chart to install Concourse](#using-the-helm-chart-to-install-concourse)”

## Prerequisites

PKS uses the Pivotal [On-Demand Services SDK](https://docs.pivotal.io/svc-sdk/odb/0-26/) to provide k8s clusters on
demand (it’s not just a clever name!). The service broker that’s created when you install PKS needs to have plans, so
that you can create clusters of different sizes and production worthiness. You can install Concourse on the default
`small` plan that is provided, with one small change: because Concourse will be running containers inside containers,
you must enable privileged containers. In the Ops Manager page for your specific plan, look toward the bottom of the
page, and you’ll see this checkbox.

![](assets/2019-03-29-concourse-on-pcf-02.png)
/// caption
Checkbox labelled “Enable Privileged Containers — Use with caution”
///

If that box is not checked, check it, and Apply Changes from the Ops Manager Installation Dashboard.

It should be noted that privileged containers can introduce security risks, and very few cases actually need it. In this
case, Concourse does require privileged containers because it will be running containers (tasks and resources) inside
containers (the worker pods).

## Creating a Cluster for Concourse

The `pks` CLI, which works in conjunction with `kubectl`, is used to create clusters. From a command prompt, run the
following commands to create a k8s cluster:

```console
$ pks login -a api.pks.haas-433.pez.pivotal.io -u pksadmin
Password: *******************
API Endpoint: api.pks.haas-433.pez.pivotal.io
User: pksadmin
$ pks create-cluster concourse --plan small --external-hostname concourse-km.haas-433.pez.pivotal.io
```

!!! note

    The DNS name does not need to exist when you create the cluster, but you must specify something. It is used to 
    generate TLS certificates for your k8s cluster, so it must be something you can create a DNS entry for when the 
    command succeeds.

Because `pks` is creating a new BOSH deployment under the covers, and running a number of errands under the covers, this
can take up to 30 minutes to complete. You can track process by running the `pks cluster` command:

```console
$ pks cluster concourse

Name:                     concourse
Plan Name:                small
UUID:                     eaf1234f-d29c-4ad7-8103-ce0ae7777e11
Last Action:              CREATE
Last Action State:        succeeded
Last Action Description:  Instance provisioning completed
Kubernetes Master Host:   concourse-km.haas-433.pez.pivotal.io
Kubernetes Master Port:   8443
Worker Nodes:             3
Kubernetes Master IP(s):  10.197.59.136
Network Profile Name:
```

When you see `Last Action State` as `succeeded`, you can take the `Kubernetes Master IP(s)` listed and create a DNS A
record to the `Kubernetes Master Host` domain listed.

Under the covers, the command has created a BOSH deployment that has created a Kubernetes Master VM, as well as the
number of workers specified by your plan (the `small` plan creates 3 workers by default). It also created an NSX-T load
balancer with multiple VIPs including the “Kubernetes Master IP” you were provided, so regardless of whether you had
deployed a k8s cluster with 1 or 3 masters, you would only see one IP listed here, since it is actually the load
balancer IP with the backend already populated with your real master IP addresses.

When you ask for PKS to create a k8s cluster, the following things occur:

* A network (NSX-T T1 router and logical switch) is created for the master and workers to sit on
* Networks are created for each default namespace (`default`, `kube-system`, `kube-public`, `pks-system`) for the pods
  in those namespaces with accompanying SNAT rules
* Master and worker VMs are provisioned by BOSH
* An NSX-T load balancer is created, consuming 2 routable VIPs and 3 Virtual Servers initially. The first VIP is used to
  load balancer the master VMs as stated above, and the second is explained below.
* Various post-deploy errands are executed

Once your cluster is ready, back in `kubectl` land, it’s important to note the following two behaviors:

1. If you create a service of `type: LoadBalancer`, NSX-T will automatically create a new L4 Virtual Server entry on the
   cluster load balancer with a new VIP.
2. If you create a k8s `Ingress`, NSX-T will add an L7 HTTP forwarding rule to the second VIP that was pre-created on
   the cluster load balancer at deploy time.

Both methods allow you to access your workloads, it just depends on the method you want to use. The advantage here is
you don’t have to setup/configure nginx or similar to perform these services as the NSX-T integration handles that for
you.

## Using the Cluster to install Concourse

Now that the cluster is created, we can (almost) go back to the `kubectl` and `helm` commands that you probably already
know. You may be wondering how you authenticate against the cluster now, and that’s where the final `pks` command comes
in:

```console
$ pks get-credentials concourse
```

That command creates a `$HOME/.kube/config` that `kubectl` uses for authentication.

Now that you’re authenticated against the cluster, you need to create a couple of resources ahead of time.

### Tiller

Helm is a client/server system with the `helm` CLI as the client, and a service called Tiller that runs in the cluster.
To use Tiller in your cluster, you need to create a service account. Create a file on your machine called
`tiller-config.yml` with the following contents:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tiller
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: tiller
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: tiller
    namespace: kube-system
```

And apply it to the cluster by running the command `kubectl create -f tiller-config.yml`. Once your service account is
created, initialize it by running the command `helm init --service-account tiller`. Once this command completes
successfully, your cluster will now be able to install helm charts.

It should be noted that because this is a very simple example, you used the default configuration for Tiller, which is
less secure for a number of reasons, including the fact that it does not use TLS. For information around creating a more
secure Tiller deployment, read
the [Helm Documentation](https://github.com/helm/helm/blob/master/docs/securing_installation.md).

### Persistent Volumes

Concourse requires persistent volumes for both the workers (which run Concourse resources and tasks, not to be confused
with k8s workers) and its database. Therefore, your cluster needs to have at least one `StorageClass` resource defined.

Because PKS is IaaS-agnostic, it does not automatically provision a `StorageClass` for you like most public clouds’
managed k8s offerings do. In vSphere, you can create both static and dynamic provisioned `StorageClass` resources, with
dynamic being preferred in this case. As before, you’ll create a config `yaml`, but call this one `storage-config.yml`
and make it look like this:

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: concourse-storage-class
provisioner: kubernetes.io/vsphere-volume
parameters:
  datastore: LUN01
  diskformat: thin
  fstype: ext3
```

The name `concourse-storage-class` above can be whatever you want. The datastore is the name of an actual Datastore
object in your vSphere datacenter, where virtual disks can be created to be used as homes for your persistent volumes.
Apply as before by running `kubectl create -f storage-config.yml`.

You’ve now created all of the prerequisite resources necessary to install Concourse!

## Using the Helm Chart to install Concourse

!!! note "A note for Pivotal customers"

    The Concourse Helm chart is not yet supported by Pivotal so please proceed with caution. However, there is a very 
    active and vibrant community of operators who have deployed Concourse with the Helm chart and are very happy using 
    it day-to-day

Now that you are ready to install Concourse, you can create the necessary values so that your installation is customized
just for you. Helm charts live in a GitHub repository, so you can visit Concourse’s in the official
repository [here](https://github.com/helm/charts/tree/master/stable/concourse). In particular, you will want to grab the
`values.yaml` file from that directory, as you will need to make customizations to it. That file is large and
well-documented, so it will be easier to create a new `yaml` file with the necessary customizations — it will be merged
with the default `values.yaml` at install time. Call this `concourse-config.yml` and make it look like this:

```yaml
concourse:
  web:
    auth:
      mainTeam:
        localUser: admin
    externalUrl: https://concourse.haas-433.pez.pivotal.io
    bindPort: 80
    tls:
      enabled: true
      bindPort: 443
  worker:
    baggageclaim:
      driver: btrfs
  persistence:
    worker:
      storageClass: concourse-storage-class
  postgresql:
    persistence:
      storageClass: concourse-storage-class
  web:
    service:
      type: LoadBalancer
  secrets:
    localUsers: SEE BELOW
    webTlsCert: |
      -----BEGIN CERTIFICATE-----
      data data data data
      -----END CERTIFICATE-----
    webTlsKey: |
      -----BEGIN RSA PRIVATE KEY-----
      data data data data
      -----END RSA PRIVATE KEY-----
    workerKey: |
      -----BEGIN RSA PRIVATE KEY-----
      data data data data
      -----END RSA PRIVATE KEY-----
    workerKeyPub: ssh-rsa datadatadata comment
```

Let’s break down some of the big things here:

First, `concourse.web.auth.mainTeam.localUser`. Because this is a relatively simple example, we’ll create our main team
with a local user. Make sure your user is also listed in `secrets.localUsers`, where the user is specified in the format
`username:password`. Passwords can be plain text or `bcrypt`-hashed. Make sure your `bcrypt` hashing goes through at
least 10 rounds. To do this on MacOS, use the following command:

```shell
htpasswd -bnBC 10 <USERNAME> <PASSWORD>
```

Next, `concourse.web.externalUrl`. It’s critical that you set this to a valid DNS name, because it’s used for callbacks.
If you’re enabling TLS like in the example above, it must be an `https://` URL. The DNS name need not be mapped to
anything yet, because you won’t get the IP of the Load Balancer until after you install.

Setting `concourse.worker.baggageclaim.driver` to `btrfs` is a performance enhancement over the default `naive` driver,
and Helm will warn you if you don’t change it.

I created a self-signed certificate for `secrets.webTlsCert` and `secrets.webTlsKey`, but you should probably use a
signed certificate. The `LoadBalancer` resource created is Layer 4, and will pass traffic directly to the web pod, where
it will terminate TLS.

You should also create your own worker SSH key, as it used to communicate between the worker pod and the web pod. There
is a default value in the Helm chart, but that would, of course, be very insecure. Concourse 5.0 introduces a command
called [`generate-key`][generating] to generate this SSH key that you can use in place of `ssh-keygen`, if you desire.

```shell
mkdir $HOME/ssh-keys
docker run -v $HOME/ssh-keys:/keys -it concourse/concourse generate-key -t ssh -f /keys/worker
```

This command will create two files in `$HOME/ssh-keys`: `worker` and `worker.pub`. You can copy and paste the contents
of the file into the `secrets.workerKey` and `secrets.workerKeyPub` fields.

Finally, you need to set the storage class name for PostgreSQL and the concourse workers to the name you created earlier
so it can provision the necessary persistent volumes.

To install, run `helm install --name concourse -f concourse-values.yml stable/concourse`. The output will look something
like this:

```console
NAME:   concourse
LAST DEPLOYED: Wed Mar 20 11:39:17 2019
NAMESPACE: default
STATUS: DEPLOYED
RESOURCES:
==> v1/ConfigMap
NAME                  DATA  AGE
concourse-postgresql  0     1s
==> v1/Namespace
NAME            STATUS  AGE
concourse-main  Active  1s
==> v1/PersistentVolumeClaim
NAME                  STATUS   VOLUME                   CAPACITY  ACCESS MODES  STORAGECLASS  AGE
concourse-postgresql  Pending  concourse-storage-class  1s
==> v1/Pod(related)
NAME                                   READY  STATUS             RESTARTS  AGE
concourse-postgresql-6d6688747b-426th  0/1    Pending            0         1s
concourse-web-56798b6694-mz2rl         0/1    ContainerCreating  0         1s
concourse-worker-0                     0/1    Init:0/1           0         1s
concourse-worker-1                     0/1    Init:0/1           0         1s
==> v1/Secret
NAME                  TYPE    DATA  AGE
concourse-concourse   Opaque  8     1s
concourse-postgresql  Opaque  1     1s
==> v1/Service
NAME                  TYPE          CLUSTER-IP     EXTERNAL-IP  PORT(S)                                    AGE
concourse-postgresql  ClusterIP     10.100.200.32  <none>       5432/TCP                                   1s
concourse-web         LoadBalancer  10.100.200.87  <pending>    80:32264/TCP,443:31098/TCP,2222:31294/TCP  1s
concourse-worker      ClusterIP     None           <none>       <none>                                     1s
==> v1/ServiceAccount
NAME              SECRETS  AGE
concourse-web     1        1s
concourse-worker  1        1s
==> v1beta1/ClusterRole
NAME           AGE
concourse-web  1s
==> v1beta1/Deployment
NAME                  READY  UP-TO-DATE  AVAILABLE  AGE
concourse-postgresql  0/1    1           0          1s
concourse-web         0/1    1           0          1s
==> v1beta1/PodDisruptionBudget
NAME              MIN AVAILABLE  MAX UNAVAILABLE  ALLOWED DISRUPTIONS  AGE
concourse-worker  1              N/A              0                    1s
==> v1beta1/Role
NAME              AGE
concourse-worker  1s
==> v1beta1/RoleBinding
NAME                AGE
concourse-web-main  1s
concourse-worker    1s
==> v1beta1/StatefulSet
NAME              READY  AGE
concourse-worker  0/2    1s
NOTES:
* Concourse can be accessed:
* Within your cluster, at the following DNS name at port 80:
concourse-web.default.svc.cluster.local
* From outside the cluster, run these commands in the same shell:
NOTE: It may take a few minutes for the LoadBalancer IP to be available.
           You can watch the status of by running 'kubectl get svc -w concourse-web'
export SERVICE_IP=$(kubectl get svc --namespace default concourse-web -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    echo http://$SERVICE_IP:80
* If this is your first time using Concourse, follow the tutorials at https://concourse-ci.org/tutorials.html
```

You can run `helm status concourse` to keep an eye on it. Eventually, the `v1/Service` block will look like this:

```console
==> v1/Service
NAME                  TYPE          CLUSTER-IP     EXTERNAL-IP       PORT(S)                                    AGE
concourse-postgresql  ClusterIP     10.100.200.32  <none>            5432/TCP                                   27s
concourse-web         LoadBalancer  10.100.200.87  10.197.59.143...  80:32264/TCP,443:31098/TCP,2222:31294/TCP  27s
concourse-worker      ClusterIP     None           <none>            <none>                                     27s
```

You can then take that `EXTERNAL-IP` and create a DNS A record from your hostname defined in
`concourse.web.externalUrl`.

If you ever want to change any of the deployment values, including what auth mechanism you use for the main team, update
your `concourse-config.yml` and run `helm upgrade -f concourse-config.yml concourse stable/concourse` and it will make
your changes, _except for secrets_. See below on how to do that.

## Changing Secrets

If you need to change your secrets — your certificate is expiring! you need to change your admin password — you can use
standard `kubectl` commands to do this.

First, you need to edit the secret itself. To do this, run `kubectl edit secret concourse-concourse`. Note that in that
name, the first `concourse` is the name of the release you specified in `helm install`. The second `concourse` is
static. This will open in your editor of choice. Under the `data:` block, edit your values. You need to base-64 encode
the value before putting it into the file, and do so only on one line. Once you save the file and close the editor, the
secrets will be updated.

This is not enough, unfortunately, to trigger Concourse to pick up the new secrets. To do so, you need to edit the
deployment. To do so, run `kubectl edit deployment concourse-web --record`, where `concourse` is your release name. It
will also open in your editor. You need to change something under the `spec` block to trigger an update. I personally
suggest adding a label under `spec.template.metadata.labels`. Mine looks like this:

```yaml
spec:
  progressDeadlineSeconds: 2147483647
  replicas: 1
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      app: concourse-web
      release: concourse
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: concourse-web
        last-updated: 2019-03-20T12.46.00 # My addition
        release: concourse
```

When you save the file, because `spec.strategy.type` is set to `RollingUpdate`, it will trigger an update to the
`concourse-web` deployment. You can watch the status of the update by running
`kubectl rollout status deployment concourse-web`. Once it’s complete, you can verify that the change was made by
running `kubectl get pods`. You will see a pod named `concourse-web-xxxx-yyyy`. It should have a lower age than your
other `concourse-*` pods.

## Conclusion

It may look like a lot of work went into this, but I began this process as an absolute Kubernetes neophyte, but with the
help of Éamon, I went from an empty PKS cluster to a working Concourse in the span of about 2 hours, and at least half
of that was spent with trial and error, fixing values and redeploying.

Happy Concourse-ing!

[generating]: ../../../../docs/install/generating-keys.md