---
title: Locking Down Concourse - Content Security Policy in Practice
date: 2026-##-##
authors:
  - kumper
---

If you run Concourse for your team, or even just for yourself, you probably
spent more time thinking about pipeline logic than what the browser is doing in
the background. We did too. Until we started looking at what Concourse was
quietly loading from the internet every time someone opened the UI.

<!-- more -->

## What was happening

Out of the box, Concourse's web UI loads a font from Google's servers -
fonts.googleapis.com - as part of rendering the Fraktur text style used in
build logs. That's a third-party request your users' browsers are making
without them knowing, handing their IP address to Google on every page load.
Small thing, but it adds up, especially in regulated environments or air-gapped
setups where external calls simply shouldn't happen.

Beyond the font, there was nothing stopping a compromised dependency or an
injected script from loading arbitrary content from anywhere on the internet.
The browser had no rules.

## What Content Security Policy does

CSP is a header the server sends with every response. It tells the browser:
here is a list of places you are allowed to load things from. Anything not on
the list gets blocked before it even makes a network request.

The strictest useful setting is:

```
CONCOURSE_CONTENT_SECURITY_POLICY="frame-ancestors 'none'; default-src 'self'"
```

`default-src 'self'` means the browser will only load scripts, styles, fonts,
images, and API calls from the same server that served the page. No Google. No
CDNs. No surprises. frame-ancestors 'none' means Concourse cannot be embedded
inside an iframe on another site — a common vector for clickjacking attacks.

## Why it matters more now

We are increasingly running automated agents against our tooling — CI pipelines
triggered by AI, build results being parsed and acted on programmatically,
browser-based agents navigating UIs to extract information. Those agents are
subject to the same browser rules as human users. A compromised script that
exfiltrates a CSRF token or auth token is just as dangerous whether a human or
an agent is the victim. CSP closes that door before anything can walk through
it.

## What we had to change

Getting to a clean `default-src 'self'` wasn't just a config change. Three
separate inline blocks across the codebase needed to move out of HTML and into
files the browser can load as `self`. This was done in (PR #9569)[https://github.com/concourse/concourse/pull/9596].

The main UI had a `<style>` block in `index.html` containing keyframe
animations for the pipeline running indicator. That moved into the existing
`animation.less` source file, compiled into `main.css` at build time. A `<script>`
block was injecting runtime values (CSRF token, auth token, feature flags)
directly into the page. That was replaced with `<meta>` tags rendered
server-side, which the external `elm-setup.js` now reads via
`document.querySelector`. Same data, no inline execution.

The login page also had its own inline script, forcing a page reload on
back/forward navigation. That moved into a new `static/main.js` file alongside
the existing `main.css`, served from the same embedded static directory.

After those changes, `default-src 'self'` works cleanly across both the main UI
and the login flow. No fallbacks, no hashes to maintain, and no
'unsafe-inline' anywhere.

Concourse was also bringing in one external font from Google Fonts,
[UnifrakturCook](https://fonts.google.com/specimen/UnifrakturCook), which is
only used when rendering terminal output that sets [SGR
20](https://en.wikipedia.org/wiki/ANSI_escape_code#SGR) (AKA Fraktur/Gothic
mode). That font is now embedded in Concourse >=v8.3.0.

## The config

If you are running Concourse >=v8.3.0 and want to really lock down your CSP,
set the following configuration on your web nodes:

```
CONCOURSE_CONTENT_SECURITY_POLICY: "frame-ancestors 'none'; default-src 'self'"
```
