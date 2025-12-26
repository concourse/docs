---
title: Build Page Improvements
date: 2017-10-26
authors:
  - jamesma
---

![](assets/2017-10-26-build-page-improvements.gif)

<!-- more -->

[Concourse v3.6.0](https://concourse-ci.org/downloads.html#v360) comes with two new features on the build output page:
timestamps and keyboard shortcuts.

## Timestamps and Output&nbsp;Sharing

When looking at the build page, you will now see timestamps reported against each line of output using your browser’s
reported timezone. As you hover over the timestamp, you can select single line of output or you can SHIFT select
multiple lines of output. You’ll also notice that the build page URL is updated to reflect the lines you have selected.
You can use this URL to share specific build outputs with your team members.

This feature addresses
issue [#361](https://github.com/concourse/concourse/issues/361), [#838](https://github.com/concourse/concourse/issues/838)
and [#1423](https://github.com/concourse/concourse/issues/1423). Thank you for your patience!

## Keyboard Shortcuts

{{< image src="/images/downloaded_images/Build-Page-Improvements/1-8-_eZ3qsDLB8Sqq5I-9vTw.png" alt="" width="50%" >}}

The build page also supports basic vim-style keyboard shortcuts as well. You can bring up a handy reference menu using
`?` or `SHIFT + /` if you’re really having trouble finding it.

The supported keyboard shortcuts are:

- `h` and `l` for previous / next build
- `j` and `k` for scrolling up and down
- `T` to trigger a new build
- `A` to abort the build
- `gg` to scroll back to the top of the page
- `G` to scroll to the bottom of the page
- `?` to toggle the keyboard hint on and off

This feature closes out issue [#439](https://github.com/concourse/concourse/issues/439)

