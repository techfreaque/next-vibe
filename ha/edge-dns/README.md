# HA edge — self-hosted PowerDNS failover + round-robin LB (cross-datacenter)

The public edge for `unbottled.ai` across TWO servers in **different datacenters**
(S1 Düsseldorf `72.61.156.49`, S2 Frankfurt `179.198.214.41`). No Cloudflare, no
provider floating IP (an L2 VIP can't bridge two datacenters), no reliance on the
registrar's slow DNS API for failover.

## Why DNS (and not keepalived/VIP)

A floating IP needs both nodes on one L2 segment — impossible here. So failover
is done at the **DNS layer**, by nameservers WE run, with a TTL low enough to
re-point fast. The registrar's hosttech DNS publishes changes to its own NS
slowly (minutes) — fine for static records, too slow to DRIVE failover — so we
don't drive failover through it; we make our own NS authoritative and edit the
apex A set locally in sub-second.

## Design

```
                       registrar delegation (.ai)
                    NS ns1.unbottled.ai  NS ns2.unbottled.ai
                         │                     │
            ┌────────────┘                     └────────────┐
            ▼                                                ▼
   S1  ha-edge-pdns :53  (authoritative)          S2  ha-edge-pdns :53 (authoritative)
   S1  ha-dns-health ────probes BOTH boxes───►    S2  ha-dns-health ────probes BOTH boxes
        │ writes S1's apex A set                        │ writes S2's apex A set
        ▼                                                ▼
   apex A = {healthy boxes}  (TTL 30s)             apex A = {healthy boxes} (TTL 30s)
            │                                                │
            └───────── round-robin across both public IPs ───┘
                              │
                    each box's Caddy LB
                              │
                 N local app replicas (all cores)
```

- **Two authoritative nameservers**, one per box (`ns1`=S1, `ns2`=S2), each a
  PowerDNS (BIND backend) serving the SAME zone. Static records (NS, glue, MX,
  SPF, DKIM, DMARC, `*`, `s2`) mirror the hosttech zone 391416 EXACTLY — cutting
  the delegation here changes NOTHING except who answers.
- **Round-robin apex A** across both public IPs = load spread between boxes.
  **TTL 30s** = resolvers re-fetch fast.
- **`ha-dns-health` daemon, one per box.** Every 10s it probes EVERY box's app
  over the public internet (`GET https://unbottled.ai/robots.txt` via that box's
  IP — 200 only when the app actually serves; `/robots.txt` is app-served +
  unauthenticated; the `/health` endpoint needs auth → 401 → unusable as a
  probe). A box that fails 2 consecutive probes is dropped from THIS box's apex
  A set (zone rewritten; PowerDNS auto-reloads within 5s via
  `bind-check-interval`). A box must pass 2 consecutive probes to be re-added
  (flap damping). Never-dark guard: if the computed set is empty (both probes
  fail — almost always a local egress fault) it publishes BOTH.

### The "a box dies → it loses an app AND a nameserver" risk — handled

Each box runs its OWN pdns + its OWN health daemon, independently. When S1 dies:

- Resolvers still have `ns2` (S1 app down, S1 NS down). They query `ns2`.
- S2's health daemon has ALREADY dropped S1's A record (within ~30-60s), so
  `ns2` answers with S2's IP only. Traffic lands on the live box.
- The dead `ns1` is simply unreachable; resolvers fail over to `ns2` by design
  (that's what multiple NS are for). No AXFR/replication between the boxes is
  needed — each daemon authors its own apex A from its own health view, so the
  survivor is always correct even with the peer (and its daemon) gone.

## Failover timing (measured on the S2 staging instance)

| Phase                                                    | Time               |
| -------------------------------------------------------- | ------------------ |
| Detect (2 × 10s probe interval)                          | ~18-20s (measured) |
| Zone rewrite + PowerDNS reload (`bind-check-interval=5`) | ≤5-10s             |
| Client apex-A TTL expiry                                 | ≤30s               |
| **Total worst case**                                     | **~50-60s**        |
| **Typical**                                              | **~30-40s**        |

Browsers do happy-eyeballs/connection-failure retry across the still-cached A
records, so an active user whose resolver still holds both A's reconnects to the
survivor near-instantly; the DNS drop matters mainly for NEW resolutions.

Tune in `docker-compose.health.yml`: `EDGE_CHECK_INTERVAL`, `EDGE_FAIL_THRESHOLD`,
`EDGE_APEX_TTL`. Don't drop the TTL below ~20s (resolver-churn / some resolvers
clamp very low TTLs upward).

## Files

| File                          | What                                                                                                                        |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `zone.unbottled.ai.tmpl`      | zone template; `;;APEX_A_RECORDS;;` + `@@SERIAL@@` filled by the daemon                                                     |
| `pdns/pdns.conf`              | PowerDNS auth config (BIND backend, auto-reload, binds node IPs only)                                                       |
| `pdns/named.conf`             | BIND zone list                                                                                                              |
| `health/ha-dns-health.sh`     | the failover daemon (probe → rewrite apex A)                                                                                |
| `docker-compose.edge-dns.yml` | PowerDNS container (publishes `:53` on the node's public + WG IP ONLY, never 0.0.0.0 — systemd-resolved owns 127.0.0.53:53) |
| `docker-compose.health.yml`   | the health-daemon container (alpine + curl)                                                                                 |
| `edge-up.sh`                  | stage/start the edge on one box: `./edge-up.sh s1\|s2 [--dry-run]`                                                          |

## Status (2026-11-13: hardened, :53 open, DELEGATED ~13:25 UTC)

- **Both boxes run pdns + health daemon** (S1 ns1, S2 ns2), same files as this
  dir under `/root/ha-edge/edge-dns/`, zone in `/srv/ha-edge/zones/`.
- **Hardening** (`pdns/pdns.conf`): authoritative only (other names REFUSED),
  `any-to-tcp` (ANY over UDP -> empty 41-byte TC reply), UDP answers capped at
  1232 bytes (largest real answer: DKIM TXT, 491 bytes), AXFR refused,
  `version-string=anonymous`, no webserver/API, no security polling, bounded
  TCP. Rate limits live in `ha/scripts/ha-host-fw.sh` (iptables hashlimit on
  the docker-published :53): 30 q/s per source IP (burst 60), 1500 q/s UDP
  overall, 5 new TCP conns/s per IP. In a reflection attack the spoofed source
  IS the victim, so one victim can get at most ~15 KB/s from each box.
- **Verified from outside** (home line, both IPs): SOA/apex/www answer,
  recursion REFUSED, AXFR refused, version.bind hidden, ANY->TC 41 B, a
  300-query burst gets 60 answers then drops, recovers immediately. Every
  static record matches hosttech zone 391416 (DKIM equal after joining the
  string chunks); the wildcard `*` was removed (hosttech has none).
- **www is health-managed** like the apex (`;;WWW_A_RECORDS;;`).
- **Probe is DB-backed** (since 13:22 UTC): `GET /api/en-US/credits` with the
  probe lead's cookie (`/root/ha-edge/edge-dns/probe-cookie`, mode 600, one
  line `lead_id=<uuid>`, not in the repo) must return 200 and contain
  `"success":true`. `/robots.txt` stayed 200 while S2's app could not reach
  Postgres, so it was useless as a liveness signal. Recreate the cookie if
  the lead row is ever deleted (see `docker-compose.health.yml`).
- **Manual drain:** `touch /srv/ha-edge/zones/drain.<s1|s2>` on BOTH boxes
  removes that node immediately; `rm` it to let the probes re-add it. Use it
  while the boxes run different app builds (chunk 404s otherwise).
- Rollback of the hardening: `/root/ha-dns-harden-20261113/` on each box holds
  the previous pdns.conf, daemon, template, zone, `ha-host-fw.sh` and an
  `iptables-save`; `DNS_OPEN=0` in `/etc/default/ha-host-fw` +
  `systemctl restart ha-host-fw` closes :53 again.

## Registrar action Max must make (the ONE manual step)

The `.ai` registry (registrar Key-Systems, resold by hosttech; DNSSEC
unsigned) currently delegates `unbottled.ai` to `ns1/2/3.hosttech.ch`. To make the
self-hosted edge authoritative, at the registrar for `unbottled.ai` set the
nameservers to our two boxes, WITH GLUE (because the NS names are inside the
delegated zone):

```
ns1.unbottled.ai    (glue A 72.61.156.49)
ns2.unbottled.ai    (glue A 179.198.214.41)
```

- Both glue A records are REQUIRED (in-bailiwick NS need glue or resolution
  can't bootstrap). The zone already serves matching `ns1`/`ns2` A records.
- Do this ONLY after `./edge-up.sh` is running on BOTH boxes and both answer
  `dig @<ip> unbottled.ai SOA` correctly, and after each box's Caddy serves the
  `unbottled.ai` vhost (ha/edge-lb/) so the health probe sees both boxes as 200.
- Keep the hosttech delegation as a documented rollback: revert the registrar
  NS to hosttech's and the zone (still intact at hosttech, see below) serves
  again within the registrar's propagation window.
- Where: the `.ai` registrar's domain panel (NOT hosttech's DNS panel — that
  only edits zone contents; the delegation lives at the registrar). If the
  registrar is hosttech itself, it's the domain's "nameserver" setting, separate
  from the DNS-zone editor.

## NS-hygiene note (task item #4) — NO CHANGE MADE, flag for Max

The in-zone apex NS records at hosttech (zone 391416) point to
`ns1/2/3.hostserv.eu`. Investigation (every other hosttech zone + the API's own
validation) shows this is **hosttech's canonical in-zone nameserver naming** —
`hostserv.eu` IS hosttech's nameserver infrastructure (SOA MNAME = dns.hosttech.eu),
and the hosttech API **rejects `ns1.hosttech.ch` as an in-zone NS targetname**
(HTTP 422 "targetname ist ungültig"). So the records are NOT stale — changing
them to `hosttech.ch` would be a regression and is blocked by the API anyway.
The only cosmetic mismatch is that the registrar delegation lists both
hosttech.ch and hostserv.eu while the zone apex lists hostserv.eu — a
registrar-side matter, harmless, and moot once the delegation moves to the
self-hosted NS above. Left untouched; raised as a decision for Max.

## Rollback

The hosttech zone 391416 still holds the complete, correct zone, and the
registrar delegation to hosttech is untouched. Reverting the registrar NS back
to hosttech's restores service through hosttech within its propagation window.
The self-hosted edge containers can be stopped (`docker compose ... down`) with
zero effect on anything until the delegation points at them.
