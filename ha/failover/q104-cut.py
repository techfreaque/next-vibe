"""Read-only Q104 preflight and supervised cut after DNS drain and old runner stop."""
import concurrent.futures
import datetime
import json
import re
import subprocess
import sys
import time
from pathlib import Path

IPS = {"s1": "72.61.156.49", "s2": "179.198.214.41"}
DIR = {"s1": "/caddy/data/ha-drain", "s2": "/root/caddy_data/ha-drain"}
CADDY = {"s1": "caddy-caddy-1", "s2": "caddy"}
APP = {"s1": "next-vibe-app:3000", "s2": "unbottled-app:3000"}
TOKEN = "q104-20261126"


def event(message):
    print(datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="milliseconds"), message, flush=True)


def ssh(node, command):
    keydir = Path.home() / ".ssh"
    args = ["ssh", "-F", "/dev/null", "-o", "BatchMode=yes", "-o", "StrictHostKeyChecking=yes",
            "-o", "UserKnownHostsFile=" + str(keydir / "known_hosts"), "-o", "ConnectTimeout=3",
            "-i", str(keydir / "unbottled_ha_ed25519"), "root@" + IPS[node], command]
    result = subprocess.run(args, capture_output=True, timeout=40)
    if result.returncode:
        raise RuntimeError(f"{node} operation returned {result.returncode}")
    return result.stdout.decode().strip()


def both(action):
    with concurrent.futures.ThreadPoolExecutor(2) as pool:
        return list(pool.map(action, IPS))


def flag(node, name):
    return ssh(node, f"cd {DIR[node]} && (set -C; echo {TOKEN} > {name})")


def release(node):
    # Check ownership and preserve the marker. Moving within the same FS is atomic.
    return ssh(node, f"cd {DIR[node]} && test \"$(cat switchover.pause)\" = {TOKEN} && mv -T switchover.pause {TOKEN}.released")


def sql(node, query):
    container = "prod-postgres" if node == "s1" else "unbottled-pg-replica"
    return ssh(node, f'docker exec {container} psql -X -U postgres -v ON_ERROR_STOP=1 -Atqc "{query}"')


def has_role(node, expected):
    state = ssh(node, "SSH_ORIGINAL_COMMAND=state /usr/local/sbin/ha-peer-cmd")
    return re.fullmatch(rf"node={node} role={expected} pg={expected} ts=[0-9]+", state) is not None


def upstream_counts(node):
    rows = json.loads(ssh(node, f"docker exec {CADDY[node]} wget -qO- http://127.0.0.1:2019/reverse_proxy/upstreams"))
    return {row["address"]: row["num_requests"] for row in rows}


def preflight(node):
    role, recovery = ("primary", "f") if node == "s1" else ("standby", "t")
    if not has_role(node, role) or sql(node, "select pg_is_in_recovery()") != recovery:
        raise RuntimeError(f"{node} HA helper and PostgreSQL must both report {role}")
    count = upstream_counts(node).get(APP[node])
    if type(count) is not int or count < 0:
        raise RuntimeError(f"{node} missing valid Caddy counter for {APP[node]}")
    return f"{node} {role} confirmed by HA and PostgreSQL, {APP[node]} active requests = {count}"


def idle(node):
    counts = upstream_counts(node)
    if counts.get(APP[node]) != 0:
        return False
    if node == "s1":
        # Older Caddy configurations can still be draining split-port sockets.
        return counts.get("next-vibe-app:4000", 0) == 0
    statuses = ssh(node, "docker exec unbottled-app sh -ec 'for role in next server; do cat /app/.tmp/drain/status-$role.json; echo; done'")
    return drain_idle(statuses, datetime.datetime.now(datetime.timezone.utc))


def drain_idle(statuses, now):
    reports = [json.loads(line) for line in statuses.splitlines() if line.strip()]
    if {s["role"] for s in reports} != {"next", "server"} or len(reports) != 2:
        return False
    for report in reports:
        age = (now - datetime.datetime.fromisoformat(report["at"].replace("Z", "+00:00"))).total_seconds()
        required = {"loops", "runs", "tasks", "http"} if report["role"] == "next" else {"loops", "runs", "tasks", "wsClients", "wsConnectors"}
        if not 0 <= age <= 5 or not required.issubset(report["counts"]) or any(report["counts"].values()):
            return False
        if report["role"] == "server" and report.get("wsClosed") is not True:
            return False
    return True


def warm_serving():
    headers = ssh("s2", "curl -fsS --max-time 2 --resolve unbottled.ai:443:179.198.214.41 "
                        "-D - -o /dev/null https://unbottled.ai/_ha/ready")
    observed = {k.lower(): v.strip() for k, v in (line.split(':', 1) for line in headers.splitlines() if ':' in line)}
    return all(observed.get(k) == v for k, v in [
        ("x-ha-upstream", "unbottled-app:3000"), ("x-ha-app-instance", "unbottled-ha-warm:3000"),
        ("x-ha-db-path", "local")])


def verified_warm():
    if not warm_serving() or not has_role("s2", "primary"):
        return False
    ssh("s2", """docker exec -i unbottled-ha-warm bun -e '
const cookie=(await Bun.stdin.text()).trim();
if (!cookie) process.exit(1);
const r=await fetch("http://127.0.0.1:3000/api/en-US/credits",{headers:{Cookie:cookie},signal:AbortSignal.timeout(1500)});
if(r.status!==200 || (await r.json()).success!==true) process.exit(1);
' </root/ha-edge/edge-dns/probe-cookie >/dev/null 2>&1""")
    return True


def wait_for(check, seconds):
    limit = time.monotonic() + seconds
    while True:
        try:
            if check():
                return
        except (OSError, RuntimeError, subprocess.TimeoutExpired):
            pass
        if time.monotonic() >= limit:
            raise RuntimeError("handoff condition did not become true before its deadline")
        time.sleep(.12)


def cut():
    def verify_edge(node):
        directory = DIR[node]
        ssh(node, f"cd {directory} && test -S switchover.sock && test ! -e switchover.pause && "
                  f"test ! -e {TOKEN}.released && test ! -e primary-s2 && test ! -e use-warm && "
                  f"test -f /srv/ha-edge/zones/drain.s1 && test ! -e /srv/ha-edge/zones/drain.s2 && "
                  f"test \"$(curl --disable --max-time 2 --unix-socket switchover.sock -sS -o /dev/null -w '%{{http_code}}' http://localhost/admit)\" = 204")
        ssh(node, f"test \"$(dig +short +tries=1 +time=2 @{IPS[node]} unbottled.ai A)\" = {IPS['s2']}")
    both(verify_edge)
    ssh("s1", "test -f /caddy/data/ha-drain/s1 && "
              "test \"$(docker inspect -f '{{.State.Status}} {{.HostConfig.RestartPolicy.Name}}' next-vibe-app)\" = 'exited no'")
    ssh("s2", "test -s /var/lib/ha-failover/hold && "
              "systemctl is-active --quiet ha-app-readiness@unbottled-ha-warm && "
              "docker exec unbottled-app sh -c 'test -f /app/.tmp/drain/request && test ! -e /app/.tmp/drain/ws-close' && "
              "test \"$(docker inspect -f '{{.Image}}' unbottled-ha-warm)\" = \"$(docker inspect -f '{{.Image}}' unbottled-app)\"")
    both(preflight)
    fencing = False
    try:
        both(lambda node: flag(node, "switchover.pause"))
        event("both edges holding new dynamic requests")
        # New WS handshakes now queue at admission. Close old sockets with
        # 1012 while the previous web process can still complete its handshake.
        ssh("s2", "docker exec unbottled-app touch /app/.tmp/drain/ws-close")
        wait_for(lambda: all(both(idle)), 3)
        if sql("s1", "select count(*) from pg_prepared_xacts") != "0":
            raise RuntimeError("unresolved prepared transactions")
        target = sql("s1", "select pg_current_wal_flush_lsn()")
        if not re.fullmatch("[A-F0-9]{1,8}/[A-F0-9]{1,8}", target):
            raise RuntimeError("invalid final WAL position")
        wait_for(lambda: sql("s2", f"select pg_last_wal_replay_lsn() >= '{target}'::pg_lsn") == "t", 2)
        event("S2 replayed fixed flush LSN " + target)
        fencing = True
        ssh("s1", "/usr/local/sbin/ha-peer-cmd fence-local")
        event("S1 writer stopped with restart disabled")
        flag("s2", "use-warm")
        ssh("s2", "systemd-run --quiet --unit=q104-planned-promote /usr/local/sbin/ha-failover promote --planned --yes --target-lsn=" + target)
        wait_for(verified_warm, 15)
        both(lambda node: flag(node, "primary-s2"))
        both(release)
        event("both edges released to verified S2 web and writable local PG")
    except Exception:
        if not fencing and sql("s1", "select pg_is_in_recovery()") == "f" and sql("s2", "select pg_is_in_recovery()") == "t":
            for node in IPS:
                try:
                    release(node)
                except RuntimeError:
                    pass
            event("pre-fence abort; verify both admissions have reopened")
        else:
            event("writer fence may have started; use the role-specific recovery procedure")
        raise


if __name__ == "__main__":
    if sys.argv[1:] == ["--preflight"]:
        for result in both(preflight):
            event(result)
        sys.exit(0)
    now = datetime.datetime.now(datetime.timezone.utc)
    if sys.argv[1:] != ["--execute-q104"] or now.strftime("%Y-%m-%d") != "2026-11-26" or not ("03:00" <= now.strftime("%H:%M") < "03:20"):
        sys.exit("Q104 cut requires --execute-q104 during 03:00 to 03:20 UTC on November 26")
    cut()
