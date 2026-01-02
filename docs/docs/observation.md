---
title: Observation
---

This section outlines everything you need to know for observing the state of your pipelines.

## The Dashboard

The dashboard, available at the default route (`/`), provides a bird's-eye view of the Concourse cluster. All visible
pipelines across all teams are listed here. A high-density (HD) view is available at `/hd`.

## `cc.xml`

The Concourse API can return the status of a team's pipelines in a format compatible with tools
like [CCMenu](http://ccmenu.org/). This endpoint is available at the following route:

```
/api/v1/teams/{team}/cc.xml
```

## Badges

The Concourse API supports returning SVG badges indicating the status of a job:

```
/api/v1/teams/{team}/pipelines/{pipeline}/jobs/{job}/badge
```

... and for an entire pipeline:

```
/api/v1/teams/{team}/pipelines/{pipeline}/badge
```

This can be used to annotate your READMEs with a build status badge like so:

```markdown
![CI](https://ci.concourse-ci.org/api/v1/teams/main/pipelines/concourse/jobs/unit/badge)
```

... which should render the following:

![CI](https://ci.concourse-ci.org/api/v1/teams/main/pipelines/concourse/jobs/unit/badge)

You can also specify a custom title for the badge with a title query parameter:

```
/api/v1/teams/{team}/pipelines/{pipeline}/badge?title=hello
```

or

```
/api/v1/teams/{team}/pipelines/{pipeline}/jobs/{job}/badge?title=hello
```

... which should render the following:

![CI](https://ci.concourse-ci.org/api/v1/teams/main/pipelines/concourse/jobs/unit/badge?title=hello)

If you want to have the image link to your pipeline/job in a README, you can make it like so:

```html
<a href="https://ci.concourse-ci.org/teams/main/pipelines/concourse/jobs/unit/badge">
    <img src="https://ci.concourse-ci.org/api/v1/teams/main/pipelines/concourse/jobs/unit/badge"
         alt="Concourse Pipeline Status">
</a>
```

## Pipeline Visibility

Pipelines may be exposed so that they can be monitored without having to authenticate. For more information,
see [Pipeline & Build Visibility](auth-and-teams/exposing.md).