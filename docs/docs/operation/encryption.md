---
title: Encryption
---

Automating everything means authorizing something to automate many things. This makes CI systems a high-risk target for
security leaks.

Concourse pipelines are loaded with credentials: resources are configured with private keys, tasks are given credentials
to servers they integrate via [credential manager variables](creds/index.md), [`task` step `vars`](../steps/task.md),
or [`task` step `params`](../steps/task.md), etc. If someone gets their hands on your config, they have access to
everything.

To mitigate this, Concourse supports encrypting sensitive information before it reaches the database. This way the
plaintext credentials only exist in memory for as long as they need to, and if someone gains access to your database,
they can't so easily gain the keys to the kingdom.

We strongly encourage anyone running Concourse to configure encryption. Going further, it's best to have Concourse not
store the credentials in the first place, in which case you may want to
configure [credential management](creds/index.md) as well.

## What's encrypted?

The following values are expected to contain credentials, and so will be encrypted:

* Resource [`resource.sources`](../resources/index.md#resource-schema), as they often contain private keys and other
  credentials for writing to (or simply granting access to) the resource.
* Resource type [`resource_type.sources`](../resource-types/index.md#resource_type-schema), for the same reason as
  above, though this is probably a less common use case.
* Pipeline [`task` step `vars`](../steps/task.md) and [`task` step `params`](../steps/task.md), in case they contain
  sensitive information such as usernames and/or passwords.
* Put step [`put` step `params`](../steps/put.md) and get step [`get` step `params`](../steps/get.md) are also
  encrypted, even though they rarely should contain credentials (they're usually in [
  `resource.source`](../resources/index.md#resource-schema)).
* Team auth configurations, as they often contain things like GitHub or other oAuth client secrets.

!!! note

    The actual implementation encrypts things in a more heavy-handed way than the above list implies. For example, 
    pipeline configs are actually encrypted as one large blob.

Notably, the following things are NOT encrypted:

* Build logs. If your jobs are outputting credentials, encryption won't help you. We have chosen not to tackle this
  initially as it would introduce a performance burden for what is not as much of an obvious win.
* Resource versions. These should never contain credentials, and are often meaningless on their own.
* Resource metadata. These are visible to anyone if your pipeline
  is [exposed](https://concourse-ci.org/managing-pipelines.html#fly-expose-pipeline), and should never contain
  credentials.
* Pipeline names, job names, etc. - anything else that is not a high-risk target for credential leakage, as opposed to
  regular information leaks.
  <br/><br/>
  Resources and jobs in particular exist in their own tables, with their names in plaintext, and only their config
  encrypted. In this way, names are not protected, even though the pipeline config itself is also stored as one big
  encrypted blob.

## Enabling Encryption

To enable encryption, you'll just need to come up with a 16 or 32-byte random character sequence and configure it as
`--encryption-key` flag to the `web` command. For BOSH, this is the [
`encryption_key`](https://bosh.io/jobs/web?source=github.com/concourse/concourse-bosh-release#p=encryption_key)
property.

On startup, the [`web` node](../install/running-web.md) will encrypt all existing plaintext data, and any new data being
written will be encrypted before it's sent over the network to the database.

The initial bulk encryption shouldn't take too long, but it will scale linearly with the amount of data that you have,
and if another ATC is running it'll suddenly not be able to read the data until it's also given the key. So, expect some
downtime.

## Rotating the Encryption Key

To swap out the encryption key, you'll need to pass the previous key as `--old-encryption-key` (or [
`old_encryption_key`](https://bosh.io/jobs/web?source=github.com/concourse/concourse-bosh-release#p=old_encryption_key)),
and the new key as `--encryption-key` (or [
`encryption_key`](https://bosh.io/jobs/web?source=github.com/concourse/concourse-bosh-release#p=encryption_key)).

On startup, the [`web` node](../install/running-web.md) will decrypt all existing data and re-encrypt it with the new
key, in one go. If it encounters a row which is already encrypted with the new key, it will continue on (as may be the
case when restarting with the flags again, or if the ATC died in the middle of rotating).

If the ATC encounters a row which cannot be decrypted with neither the old key nor the new one, it will log loudly and
fail to start, telling you which row it choked on. This data must be dealt with in some way, either by re-configuring
the key the row was encrypted with as the old key, or manually performing database surgery to remove the offending row.
Hopefully this doesn't happen to you!

## Disabling Encryption

To opt out of encryption entirely (I'm sure you have your reasons), simply pass `--old-encryption-key` (or [
`old_encryption_key`](https://bosh.io/jobs/web?source=github.com/concourse/concourse-bosh-release#p=old_encryption_key))
alone. With no new encryption key, the [web node](../install/running-web.md) will decrypt all existing data on start.