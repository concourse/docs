# Install Concourse with `systemd`

This guide will show you how to install Concourse on any Linux system
running [systemd](https://github.com/systemd/systemd).

This guide makes the following assumptions:

1. You have a PostgreSQL database running somewhere already. You created a database called `concourse` and created a
   user for Concourse to authenticate as.
2. You have generated the necessary [encryption Keys](../../install/generating-keys.md)
3. The Web node will be directly exposed to the internet and can therefore accept inbound traffic on port `443`.
4. The Web and Worker node are being installed on separate servers, and you will figure out networking between the two
   servers. The Web node needs to accept ingress traffic on the TSA port (default is port `2222`) from the Worker 
   node(s).

## Install the Concourse CLI

The first step is to install the `concourse` CLI. We will install the CLI in `/use/local/concourse`, but you can choose
a different install location.

Run the following commands to install the Concourse CLI.

!!! note

    You will need to do this on both your Web and Worker servers

```bash
CONCOURSE_VERSION="<select-a-concourse-version>"
CONCOURSE_TAR="concourse.tgz"
CONCOURSE_URL="https://github.com/concourse/concourse/releases/download/v${CONCOURSE_VERSION}/concourse-${CONCOURSE_VERSION}-linux-amd64.tgz"
curl -L --output ./${CONCOURSE_TAR} ${CONCOURSE_URL}
tar xzf ./${CONCOURSE_TAR} -C /usr/local/
rm ./${CONCOURSE_TAR}
```

If you want to make running the Concourse CLI easier, add `/usr/local/concourse/bin` to your `PATH`.

```bash
PATH="$PATH:/usr/local/concourse/bin"
```

You can move on to setting up the Web and Worker servers.

## Setup Web Node

First lets create a new user and group for the Web node to run as:

```bash
addgroup --system "concourse"
adduser \
  --system \
  --ingroup "concourse" \
  --no-create-home \
  --disabled-password \
  --disabled-login \
  --comment "concourse web user" \
  "concourse"
```

Next, place the following keys (previously generated) in
`/usr/local/concourse/keys/`:

* `session_signing_key`
* `tsa_host_key`
* `worker_key.pub`

Next create a file named `web.env` in `/usr/local/concourse/` that will be used to configure the Web node. This is where
you can [configure authentication](../../auth-and-teams/configuring/index.md) to Concourse and all other settings found
when you run `concourse web --help`.

Change the following values:

* `CONCOURSE_POSTGRES_*` - Used to tell Concourse how to connect to PostgreSQL
* `CONCOURSE_EXTERNAL_URL` - The URL users will use to access the web UI. A Let's Encrypt certificate will also be
  generated for the hostname in this URL.

```properties title="web.env"
PATH=/usr/local/concourse/bin
CONCOURSE_EXTERNAL_URL=https://ci.example.com
CONCOURSE_ENABLE_LETS_ENCRYPT=true
CONCOURSE_TLS_BIND_PORT=443
CONCOURSE_POSTGRES_HOST=db.example.com
CONCOURSE_POSTGRES_USER=<user>
CONCOURSE_POSTGRES_PASSWORD=<password>
CONCOURSE_POSTGRES_DATABASE=concourse
CONCOURSE_SESSION_SIGNING_KEY=/usr/local/concourse/keys/session_signing_key
CONCOURSE_TSA_HOST_KEY=/usr/local/concourse/keys/tsa_host_key
CONCOURSE_TSA_AUTHORIZED_KEYS=/usr/local/concourse/keys/worker_key.pub
CONCOURSE_CLUSTER_NAME=Concourse
CONCOURSE_MAIN_TEAM_LOCAL_USER=local
CONCOURSE_ADD_LOCAL_USER=test:test
CONCOURSE_ENABLE_ACROSS_STEP=true
CONCOURSE_ENABLE_REDACT_SECRETS=true
CONCOURSE_ENABLE_PIPELINE_INSTANCES=true
CONCOURSE_ENABLE_CACHE_STREAMED_VOLUMES=true
```

!!! note

    The above file configures the web node with 
    [local user authentication](../../auth-and-teams/configuring/local-user.md) with the username and password set to 
    `test`. You will probably want to configure your web node with one of the other 
    [authentication providers](../../auth-and-teams/configuring/index.md) and remove the `*_LOCAL_USER` environment 
    variables.

Set the file permissions to read-only:

```bash
chmod 0444 web.env
```

Ensure the entire `/usr/local/concourse` folder is owned by the `concourse` user and group:

```bash
chown -R concourse:concourse /usr/local/concourse
```

We can now create a new `systemd` Unit file at `/etc/systemd/system/` named `concourse-web.service`. Place the following
configuration in the unit file:

```systemd title="concourse-web.service"
[Unit]
Description=Concourse Web node
[Service]
User=concourse
Group=concourse
EnvironmentFile=/usr/local/concourse/web.env
ExecStart=/usr/local/concourse/bin/concourse web
Restart=on-failure
RestartSec=3
KillSignal=SIGTERM
TimeoutStopSec=60
[Install]
WantedBy=default.target
```

Finally enable and start the Web service:

```bash
systemctl daemon-reload
systemctl enable concourse-web
systemctl start concourse-web
```

Check the status of the service:

```bash
systemctl status concourse-web
```

If the service isn't staying up, check the logs:

```bash
journalctl -u concourse-web
```

You should then be able to access Concourse from the `CONCOURSE_EXTERNAL_URL` you specified.

If you're using local authentication you can log in using the [`fly` CLI](../../fly.md).

```bash
fly -t ci -c https://ci.example.com -u test -p test
```

## Setup Worker Node

The Worker has to run as root so there is no user to create. We can go straight to configuring the Worker.

Ensure the following keys (previously generated) are located in `/usr/local/concourse/keys/`:

* `tsa_host_key.pub`
* `worker_key`

Create the directory `/opt/concourse` where the worker will place runtime artifacts. Files in this directory are
temporary and are managed by the worker.

Next create a file named `worker.env` in `/usr/local/concourse/` that will be used to configure the Worker. To see all
possible configuration options run `concourse worker --help` and read more about running a worker node.

```properties title="worker.env"
PATH=/usr/local/concourse/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
CONCOURSE_NAME=worker-01
CONCOURSE_WORK_DIR=/opt/concourse/worker
CONCOURSE_TSA_HOST="<web-hostname-or-ip>:2222"
CONCOURSE_TSA_PUBLIC_KEY=/usr/local/concourse/keys/tsa_host_key.pub
CONCOURSE_TSA_WORKER_PRIVATE_KEY=/usr/local/concourse/keys/worker_key
CONCOURSE_RUNTIME=containerd
CONCOURSE_BAGGAGECLAIM_DRIVER=overlay
```

!!! tip

    If your pipelines are having issues with DNS resolution please read 
    [this section](../../install/running-worker.md#troubleshooting-and-fixing-dns-resolution).

The `CONCOURSE_NAME` must be unique per worker. Having two workers with the same name will result in a lot of weirdness.

Set the file permissions to read-only:

```bash
chmod 0444 worker.env
```

We can now create a new `systemd` Unit file at `/etc/systemd/system/` named `concourse-worker.service`. Place the
following configuration in the unit file:

```systemd title="concourse-worker.service"
[Unit]
Description=Concourse Worker
[Service]
User=root
Group=root
EnvironmentFile=/usr/local/concourse/worker.env
ExecStart=/usr/local/concourse/bin/concourse worker
Restart=on-failure
RestartSec=3
KillSignal=SIGUSR2
SendSIGKILL=yes
TimeoutStopSec=300
[Install]
WantedBy=default.target
```

Finally enable and start the Worker service:

```bash
systemctl daemon-reload
systemctl enable concourse-worker
systemctl start concourse-worker
```

Check the status of the service:

```bash
systemctl status concourse-worker
```

If the service isn't staying up, check the logs:

```bash
journalctl -u concourse-worker
```

Using the [`fly` CLI](../../fly.md) you should be able to see the worker successfully connected to the Web node by
running `fly workers`.

Congratulations, you've successfully deployed a Concourse cluster!
