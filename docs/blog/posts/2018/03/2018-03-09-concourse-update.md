---
title: Concourse Update (Mar 5–9)
date: 2018-03-09
categories:
- product-update
authors:
  - jamesma
---

Whelp, that felt like a long week. If you haven’t heard the news by now you should definitely
read [Alex Suraci](https://medium.com/u/263a63b2f209)’s
post [regarding our domain](https://medium.com/concourse-ci/were-switchin-domains-5597dcd0b48b).

<!-- more -->

I want to take this time to thank the Concourse fans out there who offered their help, support, and positive vibes
throughout the whole ordeal. The team here really appreciates it 🙏

Luckily for us this event didn’t consume our entire engineering team. We WERE able to get some issues resolved this week
and are planning for an imminent release of Concourse 3.9.2

On to the update:

**UX:**

- Resolved [#1841](https://github.com/concourse/concourse/issues/1841) “ANSI cursor escapees wreak havoc with Concourse
  build output”
- Resolved [#1999](https://github.com/concourse/concourse/issues/1999) where buttons weren’t working on the build page
  when using Firefox
- Experimented with adding scroll effects to pipeline names in the
  Dashboard [#2026](https://github.com/concourse/concourse/issues/2026). It was hilarious and many \<marquee\> jokes
  were made.
- Brought back the/dashboard route to app [#2051](https://github.com/concourse/concourse/issues/2051), which should make
  you be able to login again [#1801](https://github.com/concourse/concourse/issues/1801)

**Docker Image Resource**

- Fixed [#170](https://github.com/concourse/docker-image-resource/issues/170). According to GitHub, I’m the original
  author of that, but I honestly can’t remember writing it. I _do_ remember that it was supposed to help a Concourse
  user, so hurrah!

**Runtime**

- Resolved [#2031](https://github.com/concourse/concourse/issues/2031) “cannot\_invalidate\_during\_initialization
  constraint bubbles up to the user”
- Resolved [#2059](https://github.com/concourse/concourse/issues/2059)
  and[#2058](https://github.com/concourse/concourse/issues/2058), two similar issues that influenced our decision to
  make a 3.9.2 patch release
- Resolved [#1499](https://github.com/concourse/concourse/issues/1499), tasks occasionally failing when interacting with
  Vault
