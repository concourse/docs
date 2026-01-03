---
title: Quick Start
search:
  exclude: true
---

## Docker Compose Concourse

Concourse is distributed as a single concourse binary, making it easy to run just about anywhere, especially with
Docker.

If you'd like to get Concourse running somewhere quickly, so you can start to kick the tires, the easiest way is to use
our [docker-compose.yml](../../docker-compose.yml):

```
$ curl -O https://concourse-ci.org/docker-compose.yml
$ docker-compose up -d
Creating docs_concourse-db_1 ...
Creating docs_concourse-db_1 ... done
Creating docs_concourse_1 ...
Creating docs_concourse_1 ... done
```

Concourse will be running at [localhost:8080](http://localhost:8080/) on your machine. You can log in with the
username/password as `test`/`test`.

![Concourse Landing Page](assets/welcome-screen.png)

## Install Fly

Next, install the [`fly` CLI](../fly.md) by downloading it from the web UI. If you're on
version >=v7.14.0 of Concourse, you can visit [http://localhost:8080/download-fly](http://localhost:8080/download-fly).

Otherwise, you can follow these steps to install fly for your OS:

=== "Linux"

    ``` sh linenums="1"
    curl 'http://localhost:8080/api/v1/cli?arch=amd64&platform=linux' -o fly
    chmod +x ./fly
    mv ./fly /usr/local/bin/
    ```

=== "MacOS"

    ``` sh linenums="1"
    curl 'http://localhost:8080/api/v1/cli?arch=amd64&platform=darwin' -o fly
    chmod +x ./fly
    mv ./fly /usr/local/bin/
    ```

=== "Windows (Powershell)"

    ``` ps1 linenums="1"
    $concoursePath = 'C:\concourse\'
    mkdir $concoursePath
    [Environment]::SetEnvironmentVariable('PATH', "$ENV:PATH;${concoursePath}", 'USER')
    $concourseURL = 'http://localhost:8080/api/v1/cli?arch=amd64&platform=windows'
    Invoke-WebRequest $concourseURL -OutFile "${concoursePath}\fly.exe"
    ```

Use [`fly login`](../fly.md#fly-login) to log into your local Concourse as the `test` user:

```
fly -t tutorial login -c http://localhost:8080 -u test -p test
```

You've successfully logged in if you see the following output:

```
logging in to team 'main'

target saved
```

You'll notice that every fly command in this tutorial has to have
the [target (`-t tutorial`)](../fly.md#fly-targets) specified. This is annoying when you only have
one Concourse to target, but it helps ensure you don't trigger a job on the wrong Concourse instance. It will save you
from hurting yourself!

Once you've confirmed everything is up and running by logging in through fly and the [web UI](http://localhost:8080/),
you can move onto the next section.

!!! note

    If you have any feedback for this tutorial please share it in this 
    [GitHub discussion](https://github.com/concourse/concourse/discussions/7353)
