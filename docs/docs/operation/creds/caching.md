---
title: Caching credentials
---

By default, credentials are fetched each time they're used. When many pipelines are configured this can result in a ton
of requests to the credential server.

To reduce load on your credential server you may want to enable caching by setting the following env on
the [`web` node](../../install/running-web.md):

```properties
CONCOURSE_SECRET_CACHE_ENABLED=true
```

Enabling secret caching will cache secrets from both [credential managers](index.md) and
from [var sources](../../vars.md#var-sources-experimental).

By default, credentials will be cached for one minute at a time. This value can be increased to further reduce load on
the server like so:

```properties
CONCOURSE_SECRET_CACHE_DURATION=5m # increase from 1m default
```

Credential cache duration can also be determined by the credential manager itself - for example, if Vault returns a
lease duration for a credential, the shorter value between the configured cache duration and the credential's lease
duration will be used.

By default, the _absence_ of a credential is also cached for 10 seconds so that Concourse doesn't keep looking for a
misconfigured credential. This duration can be configured like so:

```properties
CONCOURSE_SECRET_CACHE_DURATION_NOTFOUND=1s # decrease from 10s default
```