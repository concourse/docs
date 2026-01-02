---
title: The concourse CLI
---

# The `concourse` CLI

The `concourse` CLI can be downloaded from
the [latest GitHub release](https://github.com/concourse/concourse/releases/latest) - make sure to grab the appropriate
archive for your platform. Each `concourse-*` archive contains the following files:

```
concourse/bin/concourse
concourse/bin/gdn            # Linux only
concourse/fly-assets/...
concourse/resource-types/... # Linux only
```

The Linux release is the largest among all the platforms because it is prepackaged with
a [bundle of resource types](running-worker.md#bundled-resource-types) like
the [git](https://github.com/concourse/git-resource), [time](https://github.com/concourse/time-resource/),
and [registry-image](https://github.com/concourse/registry-image-resource/) resources. Resources only run on Linux
workers, that's why the other platforms are not bundled with resources; resources don't currently exist for non-linux
platforms.

When extracted, the `concourse` binary will auto-discover its sibling assets based on its file location, so you may
extract it anywhere. On Linux a typical install location is `/usr/local/concourse`:

```shell
tar -zxf concourse-*.tgz -C /usr/local
```

From there, you can either add `/usr/local/concourse/bin` to your `$PATH`, or just execute
`/usr/local/concourse/bin/concourse` directly.

## Configuring `concourse`

All Concourse `web` and `worker` node configuration is defined statically via flags. For a full list of flags, you can
pass `--help` to any command.

```shell title="CLI Commands"
concourse web --help
concourse worker --help
concourse quickstart --help
concourse migrate --help
concourse generate-key --help
concourse land-worker --help
concourse retire-worker --help
```

Each flag can also be set via an environment variable. The env var for each flag is based on the flag name uppercased,
preceded with `CONCOURSE_` and dashes (`-`) replaced with underscores (`_`). These are also shown in `--help`.

Various sections in documentation may refer to configuration via env vars rather than flags, but they are both
equivalent and interchangeable. Env vars are simply easier to reference in isolation and are more useful to copy-paste.