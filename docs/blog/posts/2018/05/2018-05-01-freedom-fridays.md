---
title: Freedom Fridays
date: 2018-05-01
authors:
  - tbullock
---

![](assets/2018-05-01-freedom-fridays-01.gif)
/// caption
///

When I started as anchor of the Concourse team, one of the things I wanted to improve was the human problem of
on-boarding new engineers. Concourse is a large project spanning many areas of expertise (distributed systems,
container runtimes, functional programming, user experience, etc.) and several Git
repos ([atc][atc], [fly][fly], [tsa][tsa], [baggageclaim][baggage], [etc.][org]), so ramping up on ALL THE CONCOURSE
can be a difficult task for even the most skilled engineers.

<!-- more -->

When all of Concourse is considered as a monolithic backlog, a single Pivot could possibly be working on the Elm
front-end on Monday, fixing issues with the Garden container scheduling on Wednesday, and rotate onto a story
implementing a new Fly CLI feature on Friday.

## Break It Down!

To ease the cognitive load, we broke down the Concourse GitHub issues
into [Projects](https://github.blog/news-insights/product-news/introducing-projects-for-organizations/) based on their
subject matter and (thanks to[Alex Suraci][alex]’s work on Cadet) these tracks of work are
visible at [https://project.concourse-ci.org/](https://project.concourse-ci.org/).

Breaking down the Concourse project into domains which can be understood as a smaller unit allowed us to be more
strategic about rotating pairs, and we could nominate “track anchors” to lead longer running features within a track.

## The Innovative Mindset

Concourse is a project born out of innovation and giving engineers freedom to create. It all started in 2014,
when [Alex Suraci][alex] ([`@vito`](https://github.com/vito)) and [Christopher Brown](https://medium.com/@xoebus) ([
`@xoebus`](https://github.com/xoebus)) worked out of a garage into the wee hours of the night[^1] to build their vision
of a new CI/CD tool. As the project has grown and the need for more process around the tracks of work arose, a big
concern was losing this innovative edge and becoming stagnant. The project still has many ways to improve and grow
beyond what we’ve planned out in the tracks of work, and the issues raised by the community on GitHub.

One morning, [Alex Suraci][alex], [James Ma](https://medium.com/@jamesma), and I talked about wanting to officially
facilitate engineers exploring more of the code beyond the track they were already feeling comfortable on, or take on
refactoring part of the code they saw during their focused work on a story. We wanted to encourage our peers to
experiment, refactor, and explore new features or changes which might benefit Concourse.

So, every week, the team has “FREE-dom Friday” where F.R.E.E is an acronym[^2]:

### Flexibility

One of the goals of this new experiment was to allow flexibility to move beyond the lanes of engineering work. We wanted
our engineers to be able to explore other tracks, dive into parts of the code they hadn’t explored, or even perform
“atypical” tasks like engaging with the community on PRs, forum discussions, writing blog posts, or triaging GitHub
issues.

### Refactoring

Technical debt is a beast. While I’m a big proponent of constant refactoring being part of every backlog
item ([Ron Jeffries’ article on the subject][ron_article] is a great read), sometimes a necessary refactoring feels
_just beyond_ the borders of where the work for a bug fix or feature implementation lies. An allotted safe space for
digging around in areas of the code just beyond the scope of a story lets the team focus on implementing a feature, or
fixing a bug, but also earmarks some time for refactoring later.

[One Friday](https://media.giphy.com/media/CkKg32KdKyMve/giphy.gif) I set out to fix issues raised by [
`go vet`](https://golang.org/cmd/vet/) in a package which I had little exposure to in my day-to-day work on the project
backlog. The results? I found a handful of unhandled errors in the code, untested error cases, and was able to share
some best-practices with the team.

### Exploration

Often when working on an issue or new feature in one of the tracks of works, an engineer will see several parts of the
puzzle that is Concourse and think: “_I wonder if we could do something different here_”. Often these thoughts feel like
too much of a rabbit hole to pull a pair down with you, but our Fridays have become a place for these ideas to thrive.

A good example of a win from allowing exploration is breaking up the ATC repo into smaller components. The separate auth
component ‘[skymarshal](https://github.com/concourse/skymarshal)’ exists largely due to some exploratory work
by [Josh Winters](https://github.com/pivotal-jwinters), who went on to be the “track anchor” for adding users to
Concourse.

### Experimentation

One of the rules we had for Fridays was that there were no specific deliverables beyond the immeasurable effect of
growing the team’s innovative spirit. Fridays are a safe place for experimentation and failure.

Having a day where engineers can experiment beyond the tracks of work we have scheduled in the project allows them to
look at things from a fresh perspective, gain insight into other aspects of the codebase, and come up with new ideas for
Concourse.

## Free as in... ?

As we frame this new practice within the day-to-day of the team, and talk about it with other teams. There’s been a lot
of questions about the name and intent behind “Freedom Fridays”, and the gist is: we wanted to nurture the F.R.E.E
acronym outlined above and we happened to land on carving out time for this on Fridays.

As we see the results of “Freedom Fridays”, we’re actively looking for a better name to capture the value that is
delivered by more Flexibility, Refactoring, Exploration, and Experimentation on an agile team. Also (just like
the [Ron Jeffries article][ron_article] about refactoring) we hope that by supporting a day of F.R.E.E-dom, these
tenants become baked into the DNA of the team, and happen naturally.

[^1]: Okay... you got me... [I made the garage part up](https://i.gifer.com/FGMP.gif). They were both working at
Pivotal, so I imagine they worked on Concourse after hours at the office in SF.

[^2]: This part
is [100% made up for this post after the fact](https://media1.giphy.com/media/11CCn8sSFSm2kg/giphy.gif)... I‘m applying
a little something called _artistic license_ here, people!

[atc]: https://github.com/concourse/atc

[fly]: https://github.com/concourse/fly

[tsa]: https://github.com/concourse/tsa

[baggage]: https://github.com/concourse/baggageclaim

[org]: https://github.com/concourse

[alex]: https://medium.com/@alexsuraci

[ron_article]: https://ronjeffries.com/xprog/articles/refactoring-not-on-the-backlog/
