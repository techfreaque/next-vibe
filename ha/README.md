# unbottled.ai HA: current state (2026-11-12)

Two boxes in two datacenters, both serving unbottled.ai from the same data.

|          | Server 1 (72.61.156.49, prod)                                              | Server 2 (179.198.214.41, co-hosts heilpraktiker)                                                                                        |
| -------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| App      | `next-vibe-app` (split port 3000 + WS 4000), runs migrations + task runner | `unbottled-app` (single port, `10.88.0.2:3100` WG only), no migrations/seeds/tasks                                                       |
| Caddy    | `/caddy/Caddyfile`: local app first, S2 over WG as fallback                | caddy-docker-proxy; sites live on the `unbottled-edge` container (`docker-compose.s2-edge.yml`): local app first, S1 over WG as fallback |
| Postgres | `prod-postgres` primary, slot `s2_replica`, `max_slot_wal_keep_size=20GB`  | `unbottled-pg-replica` hot standby streaming over WG (`ha/postgres/s2-streaming-replica.sh status`)                                      |
| Redis    | `prod-redis` (shared pub/sub for both apps)                                | (local `unbottled-redis` idle, used only after failover)                                                                                 |
| MinIO    | `prod-minio` bucket `chat-media` (shared by both apps)                     | `unbottled-minio` = replication target of S1 (rule dbp1gq4es4tc78049v6g)                                                                 |
| DNS      | PowerDNS `ns1` + health daemon                                             | PowerDNS `ns2` + health daemon                                                                                                           |
| Certs    | Caddy HTTP-01                                                              | Caddy HTTP-01                                                                                                                            |

- **Link:** plain WireGuard over UDP 51820 between the boxes' public addresses, IPv6 or IPv4 (10.88.0.1 / 10.88.0.2, PersistentKeepalive 25, `MTU = 1420` pinned in both wg0.conf, Endpoint in wg0.conf = the peer's IPv6). On 2026-11-13 the provider dropped ALL IPv4 UDP from S1 to S2 from ~13:14 to ~13:33 UTC (any port; ICMP, TCP and IPv6 UDP kept working), most likely DDoS mitigation after a multi-GB WG burst. The watchdog (`ha-failover watch`) flips the peer endpoint between the IPv6 and IPv4 address (`HA_WG_ENDPOINTS`) when the handshake is older than 300 s (a live link was seen at ~200 s under bulk traffic, so 180 s was too tight); WG roams, so one side flipping is enough. IPv4 is ~7x faster for bulk (relay 28 MB/s vs 4 MB/s over IPv6). S2's wg0 had MTU 65456 (wstunnel leftover), which fragmented big S2->S1 packets and wedged the S2 app's DB pool; fixed. Each box's `ha-host-fw.service` accepts UDP 51820 only from the peer (v4 and v6). Big transfers over WG (image relay) are what likely tripped the filter: keep them to one at a time.
- **NO tunnelling / relay binaries on these boxes, ever** (wstunnel, chisel, frp, ngrok, gost, cloudflared, socat, `nc -l` listeners, ...). Hostinger runs an hourly in-VM scanner through qemu-guest-agent (`/.hstgr-telemetry-* --threshold 20`) and hard-stops the VPS when it sees one: S1 was shut down for "malware, Process: wstunnel" on 2026-11-12 22:09 UTC. The old "WG over wstunnel TCP 8443" link was removed 2026-11-13; direct UDP was never actually blocked.
- **WG-IP forwarders:** `pg-wg-forward` (S1, `10.88.0.1:5432` -> `prod-postgres`) and `minio-wg-forward` (S2, `10.88.0.2:9000` -> `unbottled-minio`) are `haproxy:3.2-alpine` TCP proxies using `wireguard/wg-forward.haproxy.cfg` (copy at `/root/ha-wg-forward/`), started with the `docker run` line in that file. They replaced ad-hoc socat containers (kept stopped as `*-socat-old` for rollback).
- **Host firewall:** `scripts/ha-host-fw.sh` + `scripts/ha-host-fw.service` on both boxes (peer IPs in `/etc/default/ha-host-fw`). Public surface: 22, 80, 443, plus 53 tcp/udp rate-limited per source IP (hashlimit: 30 q/s burst 60 UDP, 1500 q/s global UDP ceiling, 5 new TCP conns/s; `DNS_OPEN=0` in `/etc/default/ha-host-fw` drops 53 again). Drops public 3000/4000 (app ports that bypass Caddy), 5355 (LLMNR), and UDP 51820 from non-peers. The WG and docker-network paths are untouched. Rollback: `systemctl disable --now ha-host-fw`.
- **Image relay (deploys):** `vibe image-push` pipes `docker save | gzip | ssh` from S1 to `root@179.198.214.41` (S2's PUBLIC IP, plain SSH/TCP, `SSH_SERVER2_RELAY_ADDR`) with S1's `/root/.ssh/ha-image-relay` key. On S2 that key is pinned in `/root/.ssh/authorized_keys` as `restrict,from="10.88.0.1,72.61.156.49,2a02:4780:41:1ae3::1",command="gunzip | docker load"`, so it can do nothing else and only from S1. NOT over WireGuard since 2026-11-13: every multi-GB WG/UDP burst tripped Hostinger's "DDoS-Filterung" (S2 2026-11-09 18:39-19:42 UTC during the first WG data copies, S1 2026-11-13 09:09-09:20 UTC during a 1 GB WG speed test, S2 2026-11-13 13:14-13:25 + 13:34-ongoing UTC v4 and 13:30-13:40 v6 around the 6 GB image relays), which then drops ALL UDP between the boxes, i.e. WireGuard. Rule: no bulk copies over WG. Bulk goes over SSH/TCP between the public IPs with a restricted key; WG carries only replication + app traffic. Rejoin base backups over WG must be rate-limited (`pg_basebackup --max-rate=5M`). New box pair: `ssh-keygen -t ed25519 -N "" -f /root/.ssh/ha-image-relay` on the sender, add the pinned line on the receiver.
- **Edge:** each box's PowerDNS publishes the apex AND www A set = every box whose app answers a DB-backed probe (`GET /api/en-US/credits` with a fixed probe-lead cookie from `/root/ha-edge/edge-dns/probe-cookie`, must return 200 + `"success":true`; 30 s TTL). A box whose app lost its DB drops out in ~20 s and returns after 2 passes (proven 2026-11-13 13:22/13:24 during the UDP block). Manual drain: `touch /srv/ha-edge/zones/drain.s2` on BOTH boxes (rm to undrain); use it whenever the two boxes run different builds (mixed builds = chunk 404s). Hardened 2026-11-13 (`edge-dns/pdns/pdns.conf`: no recursion, ANY over UDP -> empty TC reply, UDP answers <=1232 B, version hidden, no API, TCP limits) and :53 reopened rate-limited; verified from outside. DELEGATED: the .ai registry lists ns1/ns2.unbottled.ai since ~13:25 UTC 2026-11-13. DNS records then live in `ha/edge-dns/zone.unbottled.ai.tmpl` on BOTH boxes (`/root/ha-edge/edge-dns/`); editing the template re-renders the zone within 10 s. Static records mirror hosttech zone 391416 exactly (checked record by record 2026-11-13; the old wildcard `*` was removed because hosttech has none).
- **ACME:** Let's Encrypt may reach either box. Each Caddy answers its own HTTP-01 tokens and relays unknown ones once to the peer over WG (`X-HA-Acme-Fwd` loop guard). TLS-ALPN-01 is disabled for these names. Verified by issuing S2's certs while DNS still pointed at S1. acme.sh/hosttech DNS-01 on S2 is retired (timer disabled).
- **Deploys:** `vibe image-push` relays the image to Server 2, then runs a **drain-based rolling deploy** (see "Drain-based rolling deploys" below): Server 1 leaves rotation, finishes its in-flight AI work, is recreated (`scripts/install-docker.sh`, migrations, auto-rollback to `:rollback`), then takes all traffic back while Server 2 drains and is recreated (`scripts/deploy-ha-node.sh`, tag `:unbottled`, never `:latest`; S1 .env merged with S2 overrides via `ha/scripts/merge-env.py`; auto-rollback to `:unbottled-rollback`), then Server 2 rejoins. `--drain=false` = the old immediate recreate.
- **S2 env:** `/root/unbottled/.env` = S1's `.env` + S2 overrides; `HA_DATABASE_URL` comes from `/root/unbottled/.ha-database-url` (mode 600).

## Drain-based rolling deploys (2026-11-13)

Goal: a deploy nobody notices, including AI answers being written while it runs. An interactive AI turn is NOT tied to its HTTP request: the POST returns at once and the loop runs on in the Next.js process of the node that took the POST, sending tokens over WebSocket (Redis pub/sub reaches the user's socket on either box). Killing that process kills the answer mid-sentence and leaves the thread stuck in `streaming` (no sweep clears it; prod had 11 such threads on 2026-11-13). So a node may only be recreated once it has no AI work left.

**Per node X (S1 first, then S2):**

1. **Preflight** (`ha-node-drain.sh preflight X` on both boxes): refuse if the other node is drained anywhere (never both at once) or if the other node's app fails the DB-backed probe on its own box.
2. **Edge drain** (`edge-on X` on both boxes):
   - DNS: `drain.X` in `/srv/ha-edge/zones` on both boxes, the health daemons drop X from both nameservers within 10 s (30 s TTL).
   - Caddy on X's box: the file `/caddy/data/ha-drain/s1` (S1) or `/root/caddy_data/ha-drain/s2` (S2) makes every NEW request and WebSocket upgrade prefer the peer (`@ha_drained` file matcher, see `edge-lb/s1-unbottled.caddy` and `edge-lb/docker-compose.s2-edge.yml`). Per-request, no reload: open connections (AI token sockets, in-flight requests) stay on X. Local stays the fallback if the peer fails.
3. **App drain** (`app-wait`, run by the deploy script when `HA_DRAIN_WAIT=1`): writes `/app/.tmp/drain/request` in the app container. The app (`src/vibe/platforms/web/drain.ts`) then stops claiming cron tasks and every second writes `status-next.json` (Next.js process: AI loops, AI runs incl. finalization, async tool tasks) and `status-server.json` (vibe start process: cron/pulse work, AI runs, WS clients). The script waits until the busy sum is 0 for `HA_DRAIN_STABLE` (10 s) or `HA_DRAIN_TIMEOUT` (image-push `--drainTimeout`, default 900 s), then writes `ws-close`: the WS hub closes every client socket with 1012 and browsers reconnect (100-500 ms jitter on 1012) through Caddy to the peer. An image without this code writes no status: the script falls back to the DB (threads streaming at drain start, updated in the last 20 min, must stop streaming; minimum wait `HA_DRAIN_FALLBACK_MIN`, 60 s).
4. **Recreate** with the new image + health check; on failure roll back to the previous image (S1 `:rollback`, S2 `:unbottled-rollback`).
5. **Rejoin:** for S1, `swap s1 s2` (S1's box first, refuses unless S1's new app passes the DB-backed probe locally): S1 takes the traffic back and S2 drains in one step, so the two builds never serve side by side (chunk 404s). After S2's recreate, `edge-off s2 --wait` on both boxes.
6. **Failure:** a node whose deploy failed and whose app is unhealthy stays drained (the peer serves everything) and image-push fails with the exact `edge-off` command. S2 failing after S1 went live keeps S2 drained even if it rolled back (mixed builds).

**SIGTERM path** (container stop for any reason, also the drain timeout): the Next.js child runs with `NEXT_MANUAL_SIG_HANDLE=true`; `src/instrumentation.ts` closes the listener (Caddy retries new requests on the peer), waits up to `STREAM_DRAIN_TIMEOUT_MS` (90 s) for loops, runs and async tasks, then aborts the stragglers and waits up to 10 s for their abort handlers (partial content saved, credits settled, streaming state cleared) and cancels async tasks (CANCELLED, not stuck RUNNING). Before this, Next's own handler exited as soon as no HTTP request was open, killing every detached AI run.

**Measured 2026-11-13** (re-roll of the running ca36ac1a1f images, old app code so the DB fallback was used, working-tree scripts; harness in the session scratchpad):

- Before (plain `image-push` S2 recreate, 16:30:35 UTC): a browser's WebSocket on S2 dropped with 1006 and one in-flight request failed (`ERR_HTTP2_PROTOCOL_ERROR`).
- Full roll S1 then S2 took 4 min 6 s (16:35:03-16:39:09; each node waited ~71 s, mostly the 60 s fallback minimum). A 22-paragraph AI answer running on S1 when S1 was drained finished completely (40 s). Chats started through S1's IP while S1 was drained, and through S2's IP while S2 was drained, both answered in about 6 s (served by the peer). A long answer started at the swap finished (28 paragraphs). The poller sent 1023 requests to both IPs and to DNS-picked IPs (`/robots.txt`, `/en-US`, `/api/en-US/credits`) with 0 errors. One request to S2's `/en-US` right after S2 rejoined took 15 s (cold first render), which is why `edge-off`/`swap` now warm the app up before Caddy routes to it. After that change, the S2-only cycle had 594 requests, 0 errors, none slower than 0.8 s.
- WebSocket: a browser with its socket on S2 stayed open through S2's drain + recreate. The socket closed at the recreate (1006 from the old image; the new code closes with 1012 while the app is still up, before the recreate; not yet observed in prod), reconnected after 1.0 s, resubscribed all 6 channels, and the next message was answered over the new socket in 5 s.
- Found on the way: `install-docker.sh` rebuilt and `up -d`'d the SHARED prod Postgres on every deploy. After the previous deploy's build-cache prune, the rebuild pulled newer apt packages, which recreated `prod-postgres` at 16:35:31 UTC (about 10 s DB restart for both nodes, no failed probe seen). Fixed: Postgres is left alone unless it is not running or `DEPLOY_POSTGRES=1`, and the app is recreated with `--no-deps`.

**Manual use** (on the boxes, `cd /unbottled` or `/root/unbottled`): `bash scripts/ha-node-drain.sh status`, `preflight s1`, `edge-on s1`, `app-wait`, `app-undrain`, `swap s1 s2`, `edge-off s2 --wait`, `local-probe`, `probe s2`. Node identity comes from `/etc/ha-failover/ha.env`.

**Rollback of the mechanism:** `vibe image-push --drain=false`. Caddy: S1 `cp /caddy/Caddyfile.bak.pre-drain-* /caddy/Caddyfile && docker exec caddy-caddy-1 caddy reload --config /etc/caddy/Caddyfile`; S2 `cd /root/unbottled && cp docker-compose.s2-edge.yml.bak.pre-drain-* docker-compose.s2-edge.yml && docker compose -p unbottled-edge -f docker-compose.s2-edge.yml up -d`. A stuck drain: `rm -f /srv/ha-edge/zones/drain.s* /caddy/data/ha-drain/s1` (S1) and `rm -f /srv/ha-edge/zones/drain.s* /root/caddy_data/ha-drain/s2` (S2).

## Server 1 total outage: failover, fencing, rejoin (2026-11-13)

Tooling (repo `ha/failover/`, installed on BOTH boxes):

| Box path                                    | Repo                                 | What                                                                         |
| ------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------- |
| `/usr/local/sbin/ha-failover`               | `failover/ha-failover.sh`            | status / promote / hold / watch / drills                                     |
| `/usr/local/sbin/ha-peer-cmd`               | `failover/ha-peer-cmd.sh`            | forced command of the peer's SSH key: `state`, `fence` (fence only on S1)    |
| `/usr/local/sbin/ha-mail`                   | `failover/ha-mail.py`                | alert mail (SMTPS) to hi@ + thea@unbottled.ai only                           |
| `/etc/ha-failover/ha.env`                   | `failover/ha.env.s1`, `ha.env.s2`    | per-box config (not secret)                                                  |
| `/etc/ha-failover/secrets.env` (600)        | `failover/secrets.env.example`       | SMTP creds; S2 also the hosttech DNS token. Never in the repo.               |
| `ha-failover-watch.service`                 | `failover/ha-failover-watch.service` | the watchdog (`ha-failover watch`)                                           |
| `/var/lib/ha-failover/`                     |                                      | state: `role` (s1: primary/fenced, s2: standby/primary), `hold`, alert marks |
| `/root/.ssh/ha-peer` + peer authorized_keys |                                      | `restrict,from="<peer WG IP>",command="/usr/local/sbin/ha-peer-cmd"`         |

### What happens when S1 dies (automatic)

1. **t+0-60 s, traffic:** each box's DNS health daemon drops a box after 2 failed probes (~20 s); with the self-hosted NS, ns2 answers S2 only and resolvers stop asking the dead ns1. Until the registrar delegation is done, `promote` instead repoints the hosttech apex/www A records to S2 via the hosttech API (TTL there is 3600, so that path is slow).
2. **t+60 s:** S2 watchdog mails "Server 1 UNREACHABLE".
3. **t+180 s (`HA_FAILOVER_AFTER`):** S2 promotes ONLY if S1 is unreachable on every path (WG icmp/ssh/5432, public 443/22), S2 itself has internet (2 of 1.1.1.1/8.8.8.8/9.9.9.9), the external witness check-host.net (4 probe nodes) fails to reach S1:443 with nobody succeeding, and no hold is set. Otherwise it mails "Auto failover BLOCKED" with the manual command.
4. **promote** (`ha-failover promote --auto`, ~5 s + app recreate ~25 s): best-effort `fence` push to S1, waits for replay = receive LSN, `pg_ctl promote` on `unbottled-pg-replica`, writes role=primary, rewrites `/root/unbottled/.ha-database-url` (s2app @ `pg-replica:5432`) + `/root/unbottled/.ha-overrides` (local Redis `unbottled-redis`, local MinIO `unbottled-minio` with S2's MinIO root creds, `HA_TASK_RUNNER=true`, `HA_DB_SETUP=true`), re-merges `.env`, recreates `unbottled-app` via `scripts/deploy-ha-node.sh` (`HA_NO_ROLLBACK=1`), DNS step, mails "FAILOVER DONE" with details.
5. **Users see:** errors on S2-served requests from S1's death until the app recreate finishes (S2's app still talks to S1's Postgres until then): about 3.5-4 min with the defaults. Sessions/JWT survive (same secrets, same DB); WS clients reconnect; in-flight AI streams on S1 are lost.
6. **Data loss bound:** what S1 committed but had not streamed to S2 (replication lag, normally 0 bytes; `ha-failover status`). Media uploaded on S1 in the last seconds may miss the MinIO replica (S1->S2 replication is async; it was 2950 vs 2957 objects, 0 queued, at setup).

**Fencing.** S1's watchdog (every 10 s) asks S2 `state` over the restricted key; when S2 says `role=primary` S1 runs `ha-peer-cmd fence-local`: role=fenced, `docker update --restart=no` + stop `next-vibe-app` and `prod-postgres`. While fenced it re-stops them if anything starts them (reboot, manual start). S2 also pushes `fence` to S1 every loop once it can reach it. A fenced S1's Caddy keeps working and proxies to S2's app over WG (lb_policy first), so S1 stays a harmless edge. Residual window: if S1 boots while S2 is primary, the S1 app could take writes for the few seconds before the first watchdog loop (the app needs ~20 s to boot, the watchdog starts with docker), and S1's own crons during a pure network isolation are lost (they stay in S1's old data dir; see Rejoin step 1).

**Planned S1 work (reboot, maintenance): put S2 on hold first** or a long reboot becomes a failover:
`ssh S2 ha-failover hold "S1 kernel update"` ... `ha-failover unhold`.

### Manual commands (on S2)

- `ha-failover status` (also on S1): role, replication line, which S1 paths answer, what the peer reports.
- `ha-failover promote` (asks for PROMOTE) / `--yes`. Refuses while S1 answers on any path; `--force` only after you stopped S1's app + Postgres yourself.
- `ha-failover witness [ip]`: check-host.net verdict (`down|up|unknown`).
- `ha-failover dns-failover`: just the hosttech A-record repoint.
- Disable auto failover: set `HA_AUTO_FAILOVER=0` in `/etc/ha-failover/ha.env`, `systemctl restart ha-failover-watch`. Stop all of it: `systemctl disable --now ha-failover-watch` (both boxes).

### Deploys while S1 is down

`vibe image-push --primary=false`: builds the commit, uploads straight from the workstation to S2 (slow, ~1 h for 6.5 GB on a home line), syncs `deploy-ha-node.sh`, `merge-env.py` and the s2-ha overlay from the commit, rolls only S2 (no S1 `.env` copy; `.ha-overrides` stays, so migrations run on S2 via `HA_DB_SETUP=true`). Normal `vibe image-push` must NOT be used while S1 is fenced (it would redeploy S1's app on the old data).

### Rejoin after failover (manual, planned; S2 stays primary meanwhile)

1. On S1 (fenced, app + Postgres stopped): keep the old data for forensics, never delete: `mv /next-vibe-db-data /root/.tmp/next-vibe-db-data-pre-rejoin-$(date +%F)` and `mkdir /next-vibe-db-data`.
2. On S2: expose the promoted DB on WG and allow S1 to replicate:
   `docker run -d --name pg-wg-forward-s2 --restart unless-stopped --network unbottled_app-network -p 10.88.0.2:5432:5432 -e FWD_PORT=5432 -e FWD_TARGET=unbottled-pg-replica:5432 -v /root/ha-wg-forward/wg-forward.haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg:ro haproxy:3.2-alpine`;
   in `unbottled-pg-replica` add `host replication replicator <subnet of unbottled_app-network> scram-sha-256` to pg_hba.conf if missing, `select pg_reload_conf()`.
3. On S1: base backup from S2 as a standby (same image `unbottled-postgres`), slot `s1_replica`:
   `docker run --rm --network host -e PGPASSWORD=<replicator pw> -v /next-vibe-db-data:/var/lib/postgresql/data --entrypoint bash unbottled-postgres -c "pg_basebackup -h 10.88.0.2 -p 5432 -U replicator -D /var/lib/postgresql/data -X stream -R -C -S s1_replica --checkpoint=fast --max-rate=5M -P && chown -R postgres:postgres /var/lib/postgresql/data && chmod 700 /var/lib/postgresql/data"`,
   then `docker update --restart unless-stopped prod-postgres && docker start prod-postgres` (starts as a hot standby because of `standby.signal`). Leave `next-vibe-app` stopped. S1 now mirrors S2.
4. MinIO back to S1: `mc mirror --overwrite --limit-upload 5MiB s2/chat-media s1/chat-media` (rate limit: bulk over WG trips the DDoS filter) (mc ships in `cgr.dev/chainguard/minio`; aliases with each box's MinIO root creds, see `minio/setup-replication.sh`), then add the S2->S1 replication rule so new uploads keep flowing.
5. Optional switchback to S1 as primary (a planned, quiet-hour job): `ha-failover hold` on S2; stop `unbottled-app` on S2 (S1 Caddy has no app then: brief outage); wait until S1 replay LSN = S2's current LSN; `pg_ctl promote` on S1's prod-postgres; on S1 `echo primary > /var/lib/ha-failover/role`, `docker update --restart unless-stopped next-vibe-app && docker start next-vibe-app`; on S2 `mv /root/unbottled/.ha-overrides /root/.tmp/` and restore `.ha-database-url` from `.ha-database-url.bak-*` (the 10.88.0.1 one), `bash scripts/deploy-ha-node.sh`, rebuild the S2 standby (`mv /srv/unbottled/pg-replica` aside, drop slot, `REPL_PASSWORD=... bash ha/s2-streaming-replica.sh init` after removing the old container), `echo standby > /var/lib/ha-failover/role`, `ha-failover unhold`. Re-check MinIO S1->S2 replication.

### Drill results (2026-11-13, before the NS delegation went live)

- **Clone promote drill** (`ha-failover drill-promote`): base backup of the 1.3 GB standby 6 s, `pg_ctl promote` + write test 1 s, the real app image on the promoted clone with the post-failover env served `/robots.txt`, `/en-US`, `/en-US/models`, `/en-US/story/blog`, `/sitemap.xml` all 200 after 16 s, 383 users present, migrations (`--db-setup=true`) a no-op. Cleaned up automatically. (First run found a drill-only bug: `docker run --env-file` keeps quotes; fixed by a quote-stripped env copy. The real failover uses compose, which strips them.)
- **Partition drill** (`drill-partition 270 --witness=down`, watch mode): S1 seen as unreachable at +5 s, "Server 1 UNREACHABLE" mail at +87 s, "WOULD PROMOTE" at +4 min 3 s (180 s threshold + check-host round trip + probe timeouts), auto-undo on time. The real witness answered "up" (S1 was up), so without the drill override S2 would have refused to promote, which is the split-brain guard working.
- **Real incident found by the drill window:** S2's app DB pool hung (MTU 65456 on S2 wg0, then the provider's IPv4 UDP block). Led to: MTU fix, WG over IPv6 + endpoint flip, the DB-backed DNS probe, the drain switch.
- **Estimated real RTO for a dead S1** (delegated DNS): users routed to S2 get errors until the promote finishes, about 180 s detection + ~25 s witness + ~5 s promote + ~25 s app recreate = ~4 min; the DNS probe already removed S1 within ~20 s, and S2 re-enters DNS as soon as its app answers on the promoted DB. RPO: replication lag (0 bytes in every check).

### Drills

- `ha-failover drill-promote` (S2): base-backup clone of the live standby -> `unbottled-pg-drill` on an `--internal` docker network (no route out: no Stripe, mail or S1), the exact `promote_pg` path, a write test, then the real app image with the post-failover env on the clone (task runner OFF), page checks, auto cleanup (clone data moved to `/root/.tmp/todelete/`). Prod data and the live app are not touched.
- `ha-failover drill-partition <secs> [--witness=down] [--mode=full]` (S2): iptables hides S1 from S2 only, watchdog in dry-run (mails tagged `[unbottled HA DRILL]`, "WOULD PROMOTE" instead of promoting), S2's DNS health daemon frozen so ns2 keeps publishing S1; a systemd timer removes it all after `<secs>` (`ha-failover drill-partition-undo` by hand). Default mode hides S1 from S2's host stack only (WG encapsulation exempt): the watchdog sees a dead S1 while apps, replication and Caddy keep working, so it is user-safe any time. `--mode=full` also cuts containers and WG (a real S1 death as seen from S2): S2-served requests fail meanwhile, so only use it before the NS delegation or in a quiet window. `--witness=down` makes the dry run pretend check-host.net agrees (S1 is really up), to exercise the would-promote path.

## History

Everything below is the original design. The keepalived/VIP edge and the logical-replication data layer were superseded (two datacenters cannot share an L2 floating IP); the G1 stream-drain notes still apply.

# unbottled.ai — 2-node active-active HA

A 2-node active-active pair (Server 1 + Server 2) that survives EITHER node
dying, with zero-downtime rolling deploys and no in-flight AI-stream kills.

Built ON TOP of the already-done stateless-app foundation (self-hosted Redis +
MinIO, WS/storage adapters flipped — `docker-compose.prod.yml`,
`scripts/migrate-uploads-to-minio.sh`, the storage-serving route, the env
schema).

## Nodes

| Node     | Public                 | WireGuard   | Role                                                                    |
| -------- | ---------------------- | ----------- | ----------------------------------------------------------------------- |
| Server 1 | unbottled.ai (srv1)    | `10.88.0.1` | PG primary, Redis master, app #1                                        |
| Server 2 | srv2016195.hstgr.cloud | `10.88.0.2` | PG logical replica, Redis replica, app #2 (coexists with heilpraktiker) |

- Private VIP `10.88.0.10` (keepalived) = the current DB/Redis primary.
- Public floating IP (keepalived) = the current live edge.

## Layers

| Layer    | Mechanism                                   | Failover                                                  | Dir                                |
| -------- | ------------------------------------------- | --------------------------------------------------------- | ---------------------------------- |
| App      | 2 instances, portless on srv2 (WG-bound)    | LB health-checked; drain-safe deploys                     | `../docker-compose.ha.yml`         |
| Net      | WireGuard mesh `10.88.0.0/24`               | n/a (both always up)                                      | `wireguard/`                       |
| Postgres | logical replication srv1→srv2 `unbottled`   | keepalived VIP + promote hook (auto); supervised failback | `postgres/`                        |
| Redis    | master/replica + Sentinel + HAProxy front   | Sentinel promote; HAProxy routes to master                | `redis/`                           |
| MinIO    | two-way bucket replication                  | each app uses local MinIO (no promotion)                  | `minio/`                           |
| Edge     | keepalived floating IP + Caddy LB both apps | VRRP moves IP; Caddy health-checks apps                   | `keepalived/`, `caddy/`            |
| Deploy   | per-node drain → migrate → health → rejoin  | always ≥1 live node                                       | superseded: `vibe image-push` + `scripts/ha-node-drain.sh` |
| Stream   | G1 SIGTERM drain of in-flight StreamLoops   | finishes streams before exit                              | `src/instrumentation.ts`, app code |

## Build order (what to run)

Provisioning (safe, additive, done ahead of go-live):

```
ha/scripts/provision-node.sh server1      # wireguard-tools + keepalived + keys
ha/scripts/provision-node.sh server2
ha/scripts/wg-mesh-up.sh                   # bring up the private tunnel
# stage app image + configs on Server 2 (no public ports taken)
```

Go-live is then a SINGLE image deploy + flip — see `CUTOVER-RUNBOOK.md`.

## The stream-safe deploy (G1)

`src/instrumentation.ts` installs a SIGTERM handler in the Next.js runtime that
flips the health endpoint to `critical` (LB drains the node), waits for every
in-flight `StreamLoop` (tracked in
`src/vibe/agent/ai-stream/repository/loop/active-loops.ts`) up to
`STREAM_DRAIN_TIMEOUT_MS` (default 90s), then exits. `vibe start`'s supervisor
(`src/vibe/platforms/web/start/repository.ts`) forwards SIGTERM to that child and
waits for it (bounded) instead of hard-killing, and compose `stop_grace_period`
(120s) gives Docker time before SIGKILL. Result: a rolling deploy never severs a
half-written answer.

See each sub-directory's README for the layer detail, and `CUTOVER-RUNBOOK.md`
for the exact ordered switch.
