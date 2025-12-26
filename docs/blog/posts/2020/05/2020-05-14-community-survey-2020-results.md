---
title: Concourse 2020 Community Report
date: 2020-05-14
categories:
- design
---

A little over a month ago, the Concourse team sent a survey out to the community. The purpose of this survey was to gain
insight into our users as well as measure our year-over-year growth. In the process of learning about how you all deploy
and manage Concourse, we also received tons of great feedback about what's working well and what needs work in order to
make Concourse even better. We’re excited to share our findings!

<!-- more -->

A huge thank you to everyone who responded. At the time of this writing, we’ve received over 100 responses and that
number is still climbing. Your contributions are valuable, and learning about how different segments of our user base
works with our product is going to help us make Concourse even better in 2020!

## Feature requests, areas to improve

### Configuration ⚙️

This is a big one. The community wants more control for administrators and operators, more options for integrations, and
more power over resource types configuration. We also learned a lot about the specific ways Concourse is making life
more difficult than it needs to be in terms of configuring tasks, pipelines, teams, and the product itself.

Code and configuration duplication is a serious issue, and our users want more powerful templating tools to help them
split pipeline configuration into more manageable chunks that will be easier to reason about and maintain.

In addition, there's a lot of support for concepts covered by
our [Instanced Pipelines](https://github.com/concourse/rfcs/pull/34), [Spatial Resources](https://github.com/concourse/rfcs/pull/29),
and other major architectural ideas that we have prioritized for 2020.

We're also paying particular attention to the number of responses that were focused on git integration and GitOps
workflows. If you have a way of using Concourse that you feel isn’t well represented by the current featureset or
CLI/UI, please [@mention us on Twitter](https://twitter.com/concourseci)
or [drop by Discord](https://discord.gg/MeRxXKW) and tell us about it.

### Web UI 🖥

Concourse’s web UI is a hot topic! While most of the web UI feedback is positive, there are lots of suggestions on how
to improve it or what to add next. Feedback from the survey about the web UI could make for its own blog post, so in the
interest of being brief, I’m just going to touch lightly on the strongest signals/insights that were generated.

A number of respondents called to attention the ease of use and clarity of information in the current UI. While we’ve
been continuously iterating to add text labels instead of just icons where possible, and to add clarifying tooltips
elsewhere, there’s clearly a need for more. In addition to several smaller tweaks, we have work underway around adding
the minimum viable [Favorite Pipelines](https://github.com/concourse/concourse/issues/5434) functionality that will be
built upon to extend the [Archiving Pipelines](https://github.com/concourse/concourse/issues/5434) functionality
introduced in v6.1.0 to the front end. Hopefully these fixes will make a big impact, decluttering Concourse dashboards
and making it a lot faster to find what you want at the same time.

Another area where we can clearly improve is by adding more detail to the dashboard. Users are requesting more options
for adding notes, tracking an audit trail of actions in the UI, clearer and more detailed error messages, and more
statistical information like build duration and lead times. We’ll be looking at the possibilities in this space over the
coming months. If you have ideas, start a [Discussion on Github](https://github.com/concourse/concourse/discussions).

### Runtime Improvements 📈

In addition to more stability and performance, the community puts a high level of importance and value on improving the
efficient use of check containers, global locks on resource checking, and the ability to clear cached resource versions
of a worker on demand with _fly_.

### Docker Enhancements and Performance 💨

We hear you. 😀

Comments from the community emphasized optimizing docker-image resources, facilitating docker in worker containers, and
better reporting on docker image status. There are a number of different voices in this conversation all with very
different strategies for how they use Concourse, and we're sorting through feedback to help us prioritize low hanging
fruit and high value enhancements that the team can prioritize.

Additionally, we're actively monitoring issues and continuously collecting data on Docker performance so that we can
make more improvements - we understand that every last bit of performance we can squeeze out of Docker interactions
results in a huge benefit to many of our users.

### Stability, Kubernetes, Documentation ⚖️ 🚢 📚

These issues have remained top of mind in the community for the past few years, and this year's survey is no exception.
From a stability perspective, the team has made great strides with the release of the new algorithm
in [version 6.0.0](https://github.com/concourse/concourse/releases/tag/v6.0.0). The team has also taken further steps
into being more k8s native by beginning an ongoing track of work dedicated to running K8s workloads. And lastly, our
documentation work is ongoing - we hope to prioritize more ‘getting started’ materials for &nbsp;beginners in order to
enable new users to climb the learning curve faster than before. For more advanced users, we also plan more
documentation around topics like autoscaling, tracing, and build statistics, among others.

## Demographic Data

### How long have you used Concourse?

{{< image src="/images/2020/05/Screen-Shot-2020-05-14-at-11.24.35-AM-1.png" width="100%" >}}

Most of the people who responded indicated they had been using Concourse for one year or less. It's great to see that
more people are picking up and experimenting with Concourse with each new release, and it's just as exciting to see that
people stick around: more than 45% of respondents said they have been using Concourse for **2+ years**. Whenever we
interpret feedback from the community, we want to make sure we're taking into account the experiences of both newcomers,
established users, and very experienced power users. Each segment experiences different challenges, and prioritizes
different parts of the product.

### Other CI/CD tools used

{{< image src="/images/2020/05/Screen-Shot-2020-05-14-at-11.24.03-AM-1.png" width="100%" >}}

Another dimension that's helpful to understand is the related experiences that each survey respondent is equipped with.
When looking at other CI/CD tools that our community employs, **Jenkins** is still the top dog, accounting for nearly
30% of the tools mentioned. **Github Actions** has seen a rise in adoption since its initial release, and Travis,
Gitlab, Bitbucket, and CircleCI are all fairly common options as well.

### How did you find out about Concourse?

{{< image src="/images/2020/05/Screen-Shot-2020-05-14-at-11.22.53-AM.png" width="100%" >}}

Pivotal Software (now VMware) has been Concourse's largest supporter since the project's inception. In previous years,
it was common to see more than half of respondents say they were introduced to Concourse CI through a Pivotal Labs
engagement, or through Concourse’s role in automation of the Pivotal Platform,
Pivotal [Cloud Foundry](https://www.cloudfoundry.org/). Now the community has started to branch out, with only 22% of
people reporting that they learned about the product through Pivotal.

The majority of users seem to have found Concourse organically, through search engines or social media. We're hoping to
expand the use of our blog this year to help support the number of people hunting for Concourse content. Be on the
lookout for more tutorials, advanced operations articles, and general updates about the Concourse product development
and roadmap.

We'd love to grow that _Conference or Meetup_ section in 2020 - who's up for a remote meetup over Zoom? 🙌

### Why use Concourse?

{{< image src="/images/2020/05/Screen-Shot-2020-05-14-at-11.24.16-AM.png" width="100%" >}}

When asked about the very important _ **why** _ behind their Concourse usage, concerns about **Open Source** tooling and
**flexibility** were top of mind. The special emphasis that Concourse put on **reproducibility** and **user interface**
also ranked highly, along with Concourse's **scalability** and overall feature set. Scalability is always a huge concern
for the team, as we see enterprise customers frequently testing the limits of their tooling (sometimes with hundreds of
Concourse clusters, many thousands of teams, and many _hundreds of thousands_ of pipelines). Likewise, reproducibility
is a commitment we're not planning on straying from any time soon.

### Concourse Versions

{{< image src="/images/2020/05/Screen-Shot-2020-05-14-at-11.53.24-AM.png" width="100%" >}}

We released the survey _just_ as v6.0.0 of Concourse was being finalized, so it was only close to the end that we
started to see people upgrading to v6. We're thrilled, nonetheless, to see so many people had already upgraded to
v5.8.x. Together, versions v5.8.x and v5.7.x represented the majority of survey respondents, with a low (\>10) rate of
responses for any other version.

To those 12 users who are still on v4.x.x and 7 users still on v3.x.x, feel free
to[get in touch on the Concourse Discord](https://discord.gg/MeRxXKW) if you need any help upgrading! You can find all
of the wonderful reasons to upgrade in the[release notes](https://github.com/concourse/concourse/releases), and we'll
write blog articles in the coming months highlighting some of the latest and greatest new features and optimizations, as
well as some upcoming enhancements on our roadmap.

### Scale

{{< image src="/images/2020/05/Screen-Shot-2020-05-14-at-11.23.29-AM.png" width="100%" >}}

The data gathered shows that the majority of respondents are working with Concourses organized with fewer teams. And
when it comes to users...

{{< image src="/images/2020/05/Screen-Shot-2020-05-14-at-11.23.48-AM.png" width="100%" >}}

... we see a lot of smaller Concourse instances of under 10 users. There are also a few examples of large, enterprise
scale deployments of 100+ users over 50+ teams. On the Concourse team, we frequently reach out to enterprise customers
for special feedback on more massive implementation concerns. We also survey and interview members of the open source
community to make sure we're building solutions that scale _down_ to single users and small teams.

If you'd like to add your voice, feel free to join in on
the[Concourse Discussions](https://github.com/concourse/concourse/discussions) board.

### Deployment Method

{{< image src="/images/2020/05/Screen-Shot-2020-05-14-at-11.22.23-AM.png" width="100%" >}}

**Docker** remains the most frequently used deployment method, but the margins are slowly shrinking, and there's more
even distribution across other popular options than we've seen in past years.

Nearly identical numbers of responses came in citing **Kubernetes** (via the Helm chart), **BOSH** , and **VM**
deployment strategies, reinforcing both our interest in facilitating K8s workflows and supporting our substantial BOSH
user base.

### Concourse Usage Style

{{< image src="/images/2020/05/Screen-Shot-2020-05-14-at-11.24.53-AM.png" width="100%" >}}

This year we asked about our users' usage style - specifically, what sort of development scenarios they were using
Concourse to facilitate. Concourse remains an **Infrastructure Automation** powerhouse, and a similar number of users
are using it to perform **CI for web development** and **deploying software** as part of their **path to production**.

### Workloads

{{< image src="/images/2020/05/Screen-Shot-2020-05-14-at-11.57.17-AM.png" width="100%" >}}

**Linux workloads** represent the vast majority for the Concourse community. We're also paying attention to special
concerns for those running **Windows** and **Darwin** workloads, however this knowledge will help us prioritize fixes to
help the largest group of users possible.

### Preferred IAAS

{{< image src="/images/2020/05/Screen-Shot-2020-05-14-at-1.10.07-PM.png" alt="" width="100%" >}}
_Note: RMDH is remotely-managed dedicated hardware_

Finally, when asked about their preferred IAAS, **AWS** takes the top position again for the third year in a row. We
consistently see a strong vSphere presence from enterprise customers, but it's really interesting to see the variety of
setups that the open source community as a whole employs when deploying Concourse.

## Summary

A recurring topic that comes up in conversations with customers and internal teams at VMware is the sheer variety of
ways that Concourse can be set up and put to work. Running this survey further reinforces that idea, giving us insight
into an even larger number of configurations and implementations than what we see during our day to day enterprise
development and support.

It’s also interesting to reflect on how far the project has come since Concourse CI was first introduced. We’re nearing
22k commits from over 318 contributors adding up to 333 releases as of the typing of this sentence, and we’re looking
forward to speeding up even further in 2020.

Of course, we want to make sure that we’re developing the right features, prioritizing the right fixes and enhancements,
and validating that each step we take has been made in the right direction. In the upcoming months we’ll be
consolidating all of these ideas into a new high level roadmap that sets out quarterly milestones for the team.

Keep watch on the [Github discussions page](https://github.com/concourse/concourse/discussions), this blog,
and [the Concourse Twitter feed](https://twitter.com/concourseci) for more updates, and don’t forget
to[join the conversation on Discord](https://discord.gg/MeRxXKW).

