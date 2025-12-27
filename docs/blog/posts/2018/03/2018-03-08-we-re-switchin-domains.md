---
title: We’re switchin’ domains.
date:
  created: 2018-03-08
  updated: 2018-03-09
authors:
  - asuraci
---

**(UPDATE March 9 @ ~10 AM: The old domain appears to now be hosting a very old snapshot of our website. This is either
targeted or part of a phishing scam. Do not go to it.)**

<!-- more -->

Well, that sucked.

Wednesday morning I woke up to a ton messages because Concourse’s site was gone, and in its place was a blank domain
registrar placeholder.

Before you say anything, I totally remembered to renew the domain. It was due to expire in August. Not even close to
expiring.

As far as I can tell, our registrar just didn’t do the one thing it’s supposed to do: renew the damned domain. They took
the money, bumped the expiry date on the website, and…apparently stopped there. They had literally one job and they
didn’t do it.

<iframe width="1720" height="711" src="https://www.youtube.com/embed/A-brgkkjnHc" title="Seinfeld - Car Reservation" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

So some Joe Schmoe out of Macedonia went ahead and registered it somewhere else, presumably to act as part of some spam
network (the only thing set up were MX records). We contacted the new registrar’s abuse email and they basically told us
that the domain was registered normally, not transferred, and must have been available. And that there is nothing they
can do.

I contacted our registrar, and the latest word is this:

> We are contacting Domain Authorities in Ivory Coast to know more about this. I will contact you back as soon as
> possible.

Soooo at this point I’m calling the domain a loss. I’m giving up pretty easily here for a reason: the .ci TLD is under
the authority of the Ivory Coast and has next to zero legitimate registrars willing to reserve domains for it. I could
tell from day one that my registrar was hot garbage, but didn’t find any other choices.

It seems like the registrar messed up so badly that there’s not much leverage for getting it back. Even if I could get
it back, I don’t really want to deal with something like this again in the future. Luckily, before we got too big I went
ahead and registered concourse-ci.org, .net, and .com in case something like this happened.

So here‘s our new home: [https://concourse-ci.org](https://concourse-ci.org)

I’d already been considering this switch for a while (anticipating trouble with .ci), but a more graceful transition
would have been nice. Unfortunately there is a ton of material pointing to the old website, and it’ll probably take time
for the new location to bubble up in Google search results.

I want to highlight that this doesn’t seem to have been a targeted attack, but that you should be careful to not
accidentally go to the old domain or send any traffic or emails there. It may not be a targeted attack, but the new
owner still has full control over it, and they’re receiving a bunch of free traffic. I wouldn’t be surprised if they
wisened up and pulled something nefarious.

We really appreciate the support y’all have shown us, and all the folks who offered to help. Sorry for the trouble.

