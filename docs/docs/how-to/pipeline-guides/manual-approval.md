---
title: Manual Approval Step
---

This is an example of a [`task` step](../../tasks.md) you can add to your [Jobs](../../jobs.md) that requires a human to
approve or reject the job from running. This is probably the most minimal version of a manual approval step you can have
in Concourse that doesn't require pulling in a bunch of other tech into your stack. It's definitely not the best UX
since you need to use the [`fly` CLI](../../fly.md) to approve the step.

Task configuration, `config.yml`:

```yaml
platform: linux

inputs:
  - name: repo

params:
  APPROVAL_TIMEOUT: 600 #default of 10mins

run:
  path: repo/tasks/manual-approval/run.sh
```

Task script, `run.sh`:

```shell
#!/usr/bin/env bash

set -euo pipefail

timeout=$((EPOCHSECONDS+APPROVAL_TIMEOUT))
echo -n "Waiting for manual approval..."
until [[ -f /tmp/approved || $EPOCHSECONDS -gt $timeout ]]; do
    sleep 5
    echo -n "."
done

if [[ -f /tmp/approved ]]; then
    echo "Step approved!"
else
    echo "Approval timeout reached. Aborting job."
    exit 1
fi
```

To approve the job when it gets to this step you have to create `/tmp/approved` on the step's container. You can do that
user `fly`'s `intercept` command, like so (replace `PIPELINE/JOB` with the name of your pipeline and job that the step
resides in):

```shell
fly -t ci intercept --job PIPELINE/JOB --step manual-approval touch /tmp/approved
```

Here's the step added in-line to a pipeline so you can see how it works on its own.

```yaml
jobs:
  - name: approval
    plan:
      - task: manual-approval
        params:
          APPROVAL_TIMEOUT: 600 #10mins
        config:
          platform: linux
          image_resource:
            type: mock
            source:
              mirror_self: true
          run:
            path: bash
            args:
              - -c
              - |
                #!/usr/bin/env bash

                set -euo pipefail

                timeout=$((EPOCHSECONDS+APPROVAL_TIMEOUT))
                echo -n "Waiting for manual approval..."
                until [[ -f /tmp/approved || $EPOCHSECONDS -gt $timeout ]]; do
                    sleep 5
                    echo -n "."
                done

                if [[ -f /tmp/approved ]]; then
                    echo "Step approved!"
                else
                    echo "Approval timeout reached. Aborting job."
                    exit 1
                fi
```