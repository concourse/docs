---
title: Pipeline & Build Visibility
---

Every newly configured pipeline is hidden to anyone but the pipeline's team. To make a pipeline publicly viewable, both
by other teams and unauthenticated users, see [
`fly expose-pipeline`](https://concourse-ci.org/managing-pipelines.html#fly-expose-pipeline).

Even with a pipeline exposed, all build logs are hidden by default. This is because CI jobs are prone to leaking
credentials and other ... unsavory information. After you've determined that a job's builds should be safe for public
consumption, you can set [`public: true`](https://concourse-ci.org/jobs.html#schema.job.public) on the job in your
pipeline.