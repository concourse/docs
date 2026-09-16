---
title: Templating a Single Pipeline
---

The smallest ytt setup: one template file describing the shape of a pipeline, and one data values file supplying
the parts that change. Render them together, and you get a plain pipeline YAML file, ready for `fly set-pipeline`.

## The Files

**`template.yml`** — the pipeline's shape, with `#@` markers where values get substituted in:

```yaml linenums="1"
--8<-- "libs/examples/pipelines/templates/simple/template.yml"
```

**`vars.yml`** — the data values referenced above, marked with `#@data/values` so ytt knows to load them as inputs
rather than treat them as a second template:

```yaml linenums="1"
--8<-- "libs/examples/pipelines/templates/simple/vars.yml"
```

## Rendering

With both files in the same directory, either of these produce the same output:

```bash
# explicit files
ytt -f template.yml -f vars.yml > rendered.yml

# everything in the current directory
ytt -f . > rendered.yml
```

This is what gets rendered:

```yaml linenums="1"
jobs:
  - name: hello-world-job
    plan:
      - task: hello-task
        config:
          platform: linux
          image_resource:
            type: mock
            source:
              mirror_self: true
          run:
            path: echo
            args:
              - "hello world of vars!"
```

## Setting the Pipeline

Treat `rendered.yml` like any other pipeline file:

```bash
fly -t main set-pipeline -p hello-world -c rendered.yml
```

Or, to render and set it in one motion from inside a pipeline, do the rendering in a task and feed the output straight
into a [`set_pipeline` step](../../docs/steps/set-pipeline.md):

```yaml linenums="1"
jobs:
  - name: set-single-rendered
    plan:
      - task: render-pipeline
        config:
          platform: linux
          image_resource:
            type: mock
            source:
              mirror_self: true
          inputs:
            - name: repo
          outputs:
            - name: pipeline
          run:
            path: sh
            args:
              - -c
              - |
                apk add --no-progress --quiet ytt
                ytt -f repo/template.yml -f repo/vars.yml > pipeline/rendered.yml

      - set_pipeline: hello-world
        file: pipeline/rendered.yml
```

<div>
  <div style="position:relative;padding-top:40%;">
    <iframe src="https://ci.concourse-ci.org/teams/examples/pipelines/hello-world-rendered?hide_ui=true" allowfullscreen
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
  </div>
</div>