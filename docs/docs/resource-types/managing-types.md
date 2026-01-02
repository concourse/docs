---
title: Managing Resource Types
---

## `fly check-resource-type`

To force immediate checking for new versions of a resource type, rather than waiting for the periodic checking, run:

```shell
fly -t example check-resource-type --resource-type my-pipeline/my-resource-type
```

This can be useful for forcing an update if you're iterating on your own resource type implementation.