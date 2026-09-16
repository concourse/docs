---
title: Templating Across Multiple Files
---

Once a template grows past a handful of jobs, keeping everything in one file gets unwieldy. ytt lets you split a
template across multiple files, then render them all together as if they were one.

## The Files

**`template.yml`** — the entry point. It loads two library files and calls their functions to assemble the
pipeline:

```yaml linenums="1"
--8<-- "libs/examples/pipelines/templates/multiple-files/template.yml"
```

**`jobs.lib.yml`** — a library file exporting one function per job. `deploy()` takes an environment name as an
argument and branches its `passed` constraints depending on whether it's called for `dev` or `prod`:

```yaml linenums="1"
--8<-- "libs/examples/pipelines/templates/multiple-files/jobs.lib.yml"
```

**`resources.lib.yml`** — a second library file, exporting a single function that builds the `resources:` block
from two parameters:

```yaml linenums="1"
--8<-- "libs/examples/pipelines/templates/multiple-files/resources.lib.yml"
```

**`vars.yml`** — the data values passed into the functions above:

```yaml linenums="1"
--8<-- "libs/examples/pipelines/templates/multiple-files/vars.yml"
```

## Rendering

Unlike the single-file example, this one is rendered by pointing ytt at the whole directory rather than naming
files individually, since `template.yml` loads its library files by relative path:

```bash
ytt -f ./ > rendered.yml
```

## What Gets Rendered

The four function calls in `template.yml` expand into four concrete jobs, chained together by `passed`
constraints, alongside the four resources built by `resources()`:

```yaml linenums="1"
resources:
  - name: repo
    icon: git
    type: mock
    source:
      initial_version: repo-at-feature-1024
      create_files:
        branch.txt: feature-1024
  - name: image-rc
    icon: oci
    type: mock
    source:
      initial_version: ft1024-rc
      create_files:
        oci_image: ft1024-rc
  - name: dev-env
    icon: wrench
    type: mock
  - name: prod-env
    icon: cloud-check
    type: mock

jobs:
  - name: unit-tests
    build_log_retention:
      builds: 50
    plan:
      - get: repo
        trigger: true
      - task: run-unit-tests
        config:
          platform: linux
          image_resource:
            type: mock
            source:
              mirror_self: true
          inputs:
            - name: repo
          run:
            path: sh
            args:
              - -c
              - |
                echo running the unit tests...
                cat repo/branch.txt
                sleep 4
                echo tests passed!

  - name: build-image
    build_log_retention:
      builds: 50
    plan:
      - get: repo
        trigger: true
        passed: [ unit-tests ]
      - task: build-image
        config:
          platform: linux
          image_resource:
            type: mock
            source:
              mirror_self: true
          inputs:
            - name: repo
          outputs:
            - name: image
          run:
            path: sh
            args:
              - -c
              - |
                echo building the image...
                date +%Y-%m-%d > image/version
                sleep 2
                echo image built!
      - put: image-rc
        params:
          file: image/version

  - name: deploy-dev
    plan:
      - in_parallel:
          - get: repo
            passed: [ build-image ]
          - get: image-rc
            passed: [ build-image ]
      - put: dev-env
        params:
          file: image-rc/oci_image

  - name: deploy-prod
    plan:
      - in_parallel:
          - get: repo
            passed: [ deploy-dev ]
          - get: image-rc
            passed: [ deploy-dev ]
      - put: prod-env
        params:
          file: image-rc/oci_image

resource_types:
  - name: mock
    type: registry-image
    source:
      repository: concourse/mock-resource
```

<div>
  <div style="position:relative;padding-top:40%;">
    <iframe src="https://ci.concourse-ci.org/teams/examples/pipelines/multi-files-rendered?hide_ui=true" allowfullscreen
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
  </div>
</div>