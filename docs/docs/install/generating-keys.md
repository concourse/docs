---
title: Generating Keys
---

## Generating the Keys

Concourse's various components use RSA keys to verify tokens and worker registration requests.

A minimal deployment will require the following keys:

* **Session Signing Key**
    * Used by the [`web` node](running-web.md) for signing and verifying user session tokens.
* **TSA Host Key**
    * Used by the [`web` node](running-web.md) for the SSH worker registration gateway server ("TSA").
    * The public key is given to each [`worker` node](running-worker.md) to verify the remote host when connecting via
      SSH.
* **Worker Key**
    * Each [`worker` node](running-worker.md) verifies its registration with the [`web` node](running-web.md) via a SSH
      key.
    * The public key must be listed in the [`web` node](running-web.md)'s authorized worker keys file in order for the
      worker to register.

To generate these keys, run:

```shell
concourse generate-key -t rsa -f ./session_signing_key
concourse generate-key -t ssh -f ./tsa_host_key
concourse generate-key -t ssh -f ./worker_key
```

or use `ssh-keygen`:

```shell
ssh-keygen -t rsa -b 4096 -m PEM -f ./session_signing_key
ssh-keygen -t rsa -b 4096 -m PEM -f ./tsa_host_key
ssh-keygen -t rsa -b 4096 -m PEM -f ./worker_key
```

At this point you should have the following files:

* `session_signing_key`
* `tsa_host_key`
* `tsa_host_key.pub`
* `worker_key`
* `worker_key.pub`

You can remove the `session_signing_key.pub` file if you have one, it is not needed by any process in Concourse.

## Multiple Worker Keys

Currently you have one `worker_key`. You can use this one key-pair with multiple [`worker` node](running-worker.md)s.
Another good strategy is to have each worker or group of workers use a key that's unique to that one worker or group of
workers.

In the second case you will end up with multiple private and public worker keys. The [`web` node](running-web.md) needs
to know about all of the public worker keys. To pass all public worker keys to the [`web` node](running-web.md) create a
file that contains all of the worker public keys. A common name for this file is `authorized_worker_keys.pub`. The file
should look like this, with one public key per line.

```shell
$ cat authorized_worker_keys.pub
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCgKtVnbGRJ7Y63QKoO+loS...
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDU6lA4gSRYIc4MXzphJ2l5...
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDgNU7KBz/QQusPO52pNcea...
```

You should now have all the necessary keys needed to deploy Web and Worker nodes.