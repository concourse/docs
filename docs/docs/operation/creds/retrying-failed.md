---
title: Retrying failed fetches
---

When a request to the credential manager fails due to an intermittent error (e.g. a timeout or `connection refused`),
Concourse will automatically try the request again up to 5 times before giving up. After all attempts fail, the error
will be surfaced in the UI for the resource check or build step that initiated the request.

The retry logic can be configured by specifying the following env on the [`web` node](../../install/running-web.md):

```properties
CONCOURSE_SECRET_RETRY_ATTEMPTS=5   # how many times to try
CONCOURSE_SECRET_RETRY_INTERVAL=10s # how long to wait between attempts
```

!!! note "Vault Credential Manager"

    As Vault API client already does retry which has covered the retry conditions of this general secret fetching retry,
    if a deployment uses Vault credential manager, `CONCOURSE_SECRET_RETRY_ATTEMPTS` can be set to 0 (or a small value, 
    like 1 or 2) in order to avoid duplicate retries.