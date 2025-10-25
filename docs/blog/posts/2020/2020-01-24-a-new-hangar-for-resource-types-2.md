---
layout: post
title: A New Hangar For Resource Types
date: 2020-01-24
---

{{< image src="/images/downloaded_images/Strategic-Plan_Page_13_Image_0001-750.jpg" alt="The inside of an airplane
hangar" width="100%" >}}

_Photo:_ [_National Parks
Service_](https://www.nps.gov/subjects/aviation/images/Strategic-Plan_Page_13_Image_0001-750.jpg)

The [idea to build a dedicated resource types catalog](https://github.com/concourse/concourse/issues/191) has been
long-discussed. We’d like to announce that the idea has come to fruition: the new
Concourse [resource types catalog](https://resource-types.concourse-ci.org/) is wheels up!

<!-- more -->

The catalog lists Concourse [resource types](https://concourse-ci.org/resource-types.html) that have recently been
submitted to the [resource types GitHub repo](https://github.com/concourse/resource-types). Originally, resource types
were listed on a [GitHub wiki](https://github.com/concourse/concourse/wiki/Resource-Types) page. While the wiki page
listed resource types, it didn’t provide much information about each resource. The resource types catalog will provide
more information about each resource and enhanced search, both of which will make it easier to compare and find resource
types.

The addition of the resource types catalog means that the original resource types wiki page will be deprecated. If you
have a resource listed on the wiki page, please migrate it over to
the [GitHub repo](https://github.com/concourse/resource-types).

## Contribution

As part of the effort to move resource types to a new home, we’ve also spent some time thinking through the resource
type submission process. This new process should make it easier for members of the community to contribute new resource
types.

The updated process consists of forking the existing resource types repository, adding your YAML file and submitting a
pull request. After a quick review by community members, the resource type will be added to the repository and will be
available on [resource-types.concourse-ci.org.](https://resource-types.concourse-ci.org) The process is described in
more detail [here](https://github.com/concourse/resource-types/blob/master/README.md). We’re also working on automating
some of this process using Concourse!

If you’ve gotten this far, have taken a quick look at the catalog, and are wondering why there is no “_resource type for
x_”, it’s a great opportunity to add your own! There are already some helpful walkthroughs from other community members
on writing resource
types ([Implementing a Resource Type](https://concourse-ci.org/implementing-resource-types.html), [Developing a Custom Concourse Resource](https://content.pivotal.io/blog/developing-a-custom-concourse-resource), [How to Make a Concourse Resource Type](http://www.mikeball.info/blog/how-to-make-a-concourse-resource-type/))
which are a great place to start.

## What’s Next?

We’ve come a long way with Concourse resource types and are excited about the new catalog. We now have our sights set on
adding more functionality on the page (check out
the [backlog](https://github.com/concourse/resource-types-website/projects/1)). This includes displaying more
information about each resource type on the cards (including GitHub stars and resource type actions), as well as
improved search and sorting.

We also have an eye on the V10 roadmap and can see [prototypes](../2019/2019-10-15-reinventing-resource-types.md) on the
horizon.

In the spirit of the open-source project that it is, we’d also love feedback to inform our roadmap. So if you have
feedback, we’d love to hear it. The best way to reach us is to either drop us a line in #resource-types
on [Discord](https://discord.gg/cShhjvr) or submit an issue against
the [GitHub repository](https://github.com/concourse/resource-types-website/issues/new).
