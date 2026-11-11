# Adding the unbottled vhost to Server 2's Caddy (additive, heilpraktiker-safe)

Server 2 runs `lucaslorentz/caddy-docker-proxy` (container `caddy`), which
builds its Caddyfile from container labels (heilpraktiker's vhost). We add the
unbottled vhost WITHOUT touching heilpraktiker by importing a static snippet.

caddy-docker-proxy supports a base/import Caddyfile via the `CADDY_DOCKER_CADDYFILE_PATH`
env or by mounting an extra file and importing it from the generated config. The
clean, non-disruptive path:

1. Copy `ha/caddy/unbottled.ai.caddy-snippet` to Server 2 at
   `/root/caddy_config/unbottled.ai.caddy` (a path already bind-mounted into the
   `caddy` container — verify with `docker inspect caddy`).

2. Tell caddy-docker-proxy to import it. Either:
   - set on the `caddy` service: `CADDY_INGRESS_NETWORKS` stays as-is, add
     `environment: CADDY_DOCKER_CADDYFILE_PATH=/config/base.caddy` and make
     `base.caddy` contain `import /config/unbottled.ai.caddy`; OR
   - add a label on ANY container that caddy-docker-proxy watches:
     `caddy_0.import=/config/unbottled.ai.caddy` (global import), which merges
     the snippet into the generated config.

3. `docker exec caddy caddy reload --config /etc/caddy/Caddyfile` (zero-downtime
   reload — heilpraktiker's vhost is regenerated unchanged alongside the new one).

> Since Max confirmed heilpraktiker has no live data and may be reconfigured,
> the even simpler option is to converge Server 2 onto the SAME static-Caddyfile
> model as Server 1: run a plain `caddy:2-alpine` with a mounted Caddyfile that
> `import`s both heilpraktiker's vhost and `unbottled.ai.caddy-snippet`, and drop
> caddy-docker-proxy. Either works; the import approach above is the minimal
> change and is what the provisioning script applies.

## Verify heilpraktiker still resolves

```bash
curl -skI https://<heilpraktiker-domain>/ | head -1   # still 200/301 from its app
docker exec caddy caddy validate --config /etc/caddy/Caddyfile
```
