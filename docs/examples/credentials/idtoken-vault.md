---
title: IDToken - HashiCorp Vault
---

You can use JWTs to authenticate
with [HashiCorp Vault](https://developer.hashicorp.com/vault/docs/auth/jwt#jwt-authentication). This way your pipelines
can directly communicate with Vault and use all of its features, beyond what Concourse's native Vault-integration
offers.

First enable the JWT auth method in your Vault Server:

```shell
vault auth enable jwt
```

Now configure the JWT auth method to accept JWTs issued by your Concourse (use your `--oidc-issuer-url` if configured,
otherwise your external URL -
see [Configuring a Separate OIDC Issuer](../../docs/operation/creds/id-token.md#configuring-a-separate-oidc-issuer)):

```shell
vault write auth/jwt/config \
  oidc_discovery_url="https://<external_url_or_oidc_issuer_url>" \
  default_role="demo"
```

Lastly, configure a role for JWT auth. Make sure to use the same value in your pipeline that you used for
_bound_audiences_ (the best would be the URL of your Vault). _bound_subject_ must be the sub-claim value of your JWT, if
you use the _subject_scope_ setting to change the contents of your sub-claim, adapt this accordingly!

```shell
vault write auth/jwt/role/demo \
  role_type="jwt"\
  user_claim="sub" \
  bound_subject="main/your-pipeline" \
  bound_audiences="my-vault-server.com" \
  policies=webapps \
  ttl=1h
```

This role will allow the holder of a JWT with aud: "`my-vault-server.com`" and sub: "`main/your-pipeline`" to get a
Vault token with the Vault-policy `webapps`. If the policy you want to assign has a different name, simply change it in
the above example. Make sure to adapt the value for `bound_subject` according to your team and pipeline name.

Pipelines can now do the following:

```yaml
var_sources:
  - name: vaulttoken
    type: idtoken
    config:
      audience: [ "my-vault-server.com" ]

jobs:
  - name: vault-login
    plan:
      - task: login
        config:
          platform: linux
          image_resource:
            type: registry-image
            source: { repository: hashicorp/vault }
          run:
            path: sh
            args:
              - -e
              - -c
              - |
                export VAULT_ADDR=https://my-vault-server.com
                vault write auth/jwt/login \
                  role=demo \
                  jwt=((vaulttoken:token)) \
                  --format=json > vault-response.json
                echo "Now do something with the token in vault-response.json"
```

You don't have to create a role and a policy for every single of your pipelines! You can use claims from the JWT with
Vault's [policy templating](https://developer.hashicorp.com/vault/tutorials/policies/policy-templating) feature. This
way you can define a policy that allows a pipeline read to all the secrets it would usually have access to using
Concourse's native Vault-integration:

```hcl
path "concourse/metadata/{{ identity.entity.aliases.<JWT_ACCESSOR>.metadata.team }}" {
  capabilities = ["list"]
}

path "concourse/data/{{ identity.entity.aliases.<JWT_ACCESSOR>.metadata.team }}/+" {
  capabilities = ["read"]
}

path "concourse/metadata/{{ identity.entity.aliases.<JWT_ACCESSOR>.metadata.team }}/{{ identity.entity.aliases.<JWT_ACCESSOR>.metadata.pipeline }}" {
  capabilities = ["list"]
}

path "concourse/metadata/{{ identity.entity.aliases.<JWT_ACCESSOR>.metadata.team }}/{{ identity.entity.aliases.<JWT_ACCESSOR>.metadata.pipeline }}/*" {
  capabilities = ["read", "list"]
}

path "concourse/data/{{ identity.entity.aliases.<JWT_ACCESSOR>.metadata.team }}/{{ identity.entity.aliases.<JWT_ACCESSOR>.metadata.pipeline }}/*" {
  capabilities = ["read", "list"]
}
```

!!! note

    Make sure to set `<JWT_ACCESSOR>` to the actual mount-accessor value of your JWT Auth method! You can use `vault 
    auth list --format=json | jq -r '."jwt/".accessor'` to get the accessor for your jwt auth method.

With a policy like this you don't need to configure `bound_subject` in your JWT auth role. Every single pipeline can
simply use the same role and the policy will take care that they can only access secrets meant for them. However, you
need to explicitly configure claim to metadata mapping:

```shell
vault write auth/jwt/role/demo \
  role_type="jwt"\
  user_claim="sub" \
  bound_subject= \
  bound_audiences="my-vault-server.com" \
  policies=pipeline-new \
  claim_mappings='team=team' \
  claim_mappings='pipeline=pipeline' \
  ttl=1h
```