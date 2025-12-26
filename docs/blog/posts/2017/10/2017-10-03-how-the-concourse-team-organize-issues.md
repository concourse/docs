---
title: How the Concourse Team Organize Issues
date: 2017-10-03
categories:
  - product-update
authors:
  - jamesma
---

As the Concourse team continues to grow in size and in the # of incoming issues, the team has been experimenting with
new ways of managing our backlog. So far we have tried three different setups:

<!-- more -->

1. GitHub
   issues + [Customs](https://github.com/vito/customs)/[Tracksuit](https://github.com/vito/tracksuit) + [Pivotal Tracker](https://www.pivotaltracker.com/)
2. GitHub issues + aggressive labelling + [CodeTree](https://codetree.com/)
3. **GitHub issues +** [**GitHub Projects**](https://github.com/blog/2272-introducing-projects-for-organizations)

We’ve been using the third setup, GitHub issues + GitHub Projects, for the past few months and we’ve been mildly happy
with the experience.

### GitHub Issues

All issues are reported in through the [concourse/concourse](https://github.com/concourse/concourse) repo. Issues can
include community-reported bugs, feature requests, technical chores, features, etc. If you want something done against
the Concourse codebase, it gets reported there.

Relying on a single location for all issues has the benefit of consolidating our backlogs; making it easier for the
community to submit issues and track its progress. However with over 400 open issues against Concourse, the question
becomes: _how does the team decide what to work on first?_

Our first approach was to simply prioritize issues that were slated for the next release and burn through the list
top-down. This naive approach became problematic for our growing team because of the incredible breadth of problems that
Concourse covers. One day an engineer could be working on [Elm](http://elm-lang.org/) and the next they would be working
on our garbage collector. Even with [pairing](https://en.wikipedia.org/wiki/Extreme_programming), new engineers found it
very frustrating to master the codebase as they were constantly context-switching through thematically different issues.

To address this, [Alex Suraci](https://medium.com/u/263a63b2f209) bucketed our issues into five “projects”:

- Operations
- Runtime
- Integrations
- Core
- UX

By bucketing our issues into projects, engineers can now spend more time in thematically similar problem spaces in the
Concourse codebase.

### GitHub Projects

![A snapshot of the Concourse UX project](../assets/2017-10-03-github-issues.png)

Our Concourse Projects manifest themselves as GitHub Projects in the Concourse GitHub organization. Annoyingly, GitHub
doesn’t (yet?) allow us to share these projects publicly.

Each project has an engineering “anchor” assigned to it. The anchor responsible for deeply understanding the issues
under that project and usually sticks on the project for a long period of time. Each project also has its own roadmap
and short-term goals.

Every week we have an Iteration Planning Meeting (IPM) where we discuss the backlog for each project team. This is where
our team discusses what’s been done, what’s in-flight, and what the upcoming issues are for the week ahead.

* * *

I hope this post gives everyone in the community a bit of insight into how the Concourse team manages incoming issues
and incoming work. We’re hoping that Github announces improvements to the GitHub Projects system in their upcoming
conference, GitHub Universe. If we aren’t able to make our projects public in the near future, the Concourse team is
committed to looking into alternative tools to publicly share our roadmap.

For those who are interested, I’ve also listed the specifics of our Five Concourse Project below:

## The Five Concourse Projects

### Operations

Ensuring Concourse is deployable and manageable in various environments, and able to meet organizations' authorization
requirements.

Subject matter:

- Various deployment scenarios (BOSH, binaries, Docker, Kubernetes, Windows, Darwin)
- Understanding resource demands of Concourse, both minimum requirements and "at scale"
- Systems knowledge to support and improve all of the above
- Multi-tenant operator demands (auth, inspectability)

### Runtime

Bring the theory to life. How do we go from a declarative configuration to efficiently running things across a pool of
VMs?

Subject matter:

- Containers: what & why, what is their “cost”
- Copy-on-write volume management
- Scheduling to most efficiently utilize a pool of VMs
- Safely managing containers/volumes/etc. across VMs without leaking resources

### Integration

Defining interfaces and patterns for how Concourse interacts with the real world.

Subject matter:

- Supporting the core set of resources
- Establishing and documenting patterns for resources, watching out for anti-patterns
- Defining the best interfaces for extending Concourse; recognizing resources alone may not be enough

### Concourse Core

Pushing Concourse concepts forward by distilling customer needs into abstract primitives.

Subject matter:

- Recognize that most feature requests are valid, but should not be implemented “as-is”
- Networking and pattern-matching; peel back the layers of the GitHub onion to identify common ground between various
  issues
- Leave space for innovation and re-framing our existing concepts
- Define the REST API, and how pipelines/tasks are configured

### UX

The face of Concourse — web UI, fly, and user research to find the best representations of what Concourse does and how
users want to interact with it.

Subject matter:

- Tie Concourse’s pretentious high-level super-abstract concepts to users’ needs around automation.
- Consume Concourse’s API and ensure it doesn’t get too bogged down in specific user flows.
- Drive feedback into the rest of the project through user research.
