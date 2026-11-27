"""Offline Q104 rules. All remote, container and database operations are fakes."""
import asyncio
import importlib.util
import datetime
import io
import json
import os
import subprocess
import tempfile
import unittest
from unittest.mock import patch
from pathlib import Path

BASE = Path(__file__).resolve().parent


def load(path):
    module = importlib.util.spec_from_file_location(path.stem, path)
    loaded = importlib.util.module_from_spec(module)
    module.loader.exec_module(loaded)
    return loaded


w = load(BASE / "witness.py")
gate = load(BASE.parent / "edge-lb/switchover-gate.py")
warm = load(BASE.parent / "edge-lb/prewarm-s2.py")
NODES = {str(i): ["", "", "", "", f"AS{100+i}"] for i in range(4)}
DOWN = {name: [{"error": "Connection timed out"}] for name in NODES}


class WitnessTests(unittest.TestCase):
    def test_check_host_receives_an_identifiable_client(self):
        with patch.object(w, "urlopen", return_value=io.BytesIO(b'{"ok":1}')) as opened:
            self.assertEqual(w.request("check-result/example", 3), {"ok": 1})
        request = opened.call_args.args[0]
        self.assertEqual(request.get_header("Accept"), "application/json")
        self.assertTrue(request.get_header("User-agent").startswith("unbottled-ha/"))
        self.assertEqual(opened.call_args.kwargs["timeout"], 3)

    def test_quorum(self):
        self.assertEqual(w.classify(NODES, DOWN), "down")
        for bad in (None, [{}], [{"message": "probe failed"}], [{"error": "monitor unavailable"}]):
            self.assertEqual(w.classify(NODES, {**DOWN, "0": bad}), "unknown")
        self.assertEqual(w.classify(NODES, {**DOWN, "0": [{"time": 0.01}]}), "up")
        self.assertEqual(w.classify(NODES, dict(list(DOWN.items())[:3])), "unknown")
        self.assertEqual(w.classify(dict.fromkeys(NODES, NODES["0"]), DOWN), "unknown")

    def test_fast_and_timeout(self):
        for verdict, samples, duration in [
            ("down", [DOWN], 0),
            ("up", [{**DOWN, "0": None}, {**DOWN, "0": [{"time": 0.1}]}], 2),
            ("unknown", [{}] * 12, 24),
        ]:
            replies = iter([{"ok": 1, "request_id": "abc", "nodes": NODES}, *samples])
            elapsed = [0]
            def sleep(seconds):
                elapsed[0] += seconds
            self.assertEqual(w.witness("192.0.2.1", lambda p, t: next(replies), lambda: elapsed[0], sleep), verdict)
            self.assertEqual(elapsed[0], duration)


class GateTests(unittest.IsolatedAsyncioTestCase):
    async def test_limit_deadline_disconnect_and_release(self):
        with tempfile.TemporaryDirectory() as tmp:
            work = Path(tmp)
            admit = gate.Gate(work, limit=1, timeout=.3)
            admit.marker.touch()
            server = await asyncio.start_unix_server(admit.handle, str(work / "socket"))
            async with server:
                async def connect():
                    reader, writer = await asyncio.open_unix_connection(str(work / "socket"))
                    writer.write(b"GET /admit HTTP/1.1\r\nHost: test\r\n\r\n")
                    await writer.drain()
                    return reader, writer
                waiter, writer = await connect()
                await asyncio.sleep(.05)
                second, extra = await connect()
                self.assertIn(b"503 Service Unavailable", await second.read())
                extra.close()
                self.assertIn(b"Retry-After: 1", await waiter.read())
                writer.close()
                abandoned, writer = await connect()
                writer.close()
                await writer.wait_closed()
                await asyncio.sleep(.12)
                self.assertEqual(admit.waiters, 0)
                waiting, writer = await connect()
                admit.marker.rename(work / "released")
                self.assertIn(b"204 No Content", await waiting.read())
                writer.close()


class ConfigTests(unittest.TestCase):
    def test_warm_creation_with_default_standby_role(self):
        source = {"Image": "fixture", "Config": {"Env": ["DATABASE_URL=postgres://u:p@10.88.0.1/d",
                  "MINIO_ROOT_USER=x", "MINIO_ROOT_PASSWORD=y"]}}
        with patch.object(Path, "read_text", return_value="HA_NODE=s2"), patch.object(Path, "is_file", return_value=True), \
                patch.object(warm.subprocess, "check_output", side_effect=["node=s2 role=standby pg=standby ts=1", json.dumps([source]), b"t"]), \
                patch.object(warm.subprocess, "run") as run:
            warm.main()
        self.assertIn("http://localhost/containers/create?name=unbottled-ha-warm", run.call_args_list[0].args[0])
        self.assertEqual(run.call_args_list[-1].args[0][-1], "ha-app-readiness@unbottled-ha-warm")

    def test_warm_target(self):
        base = {"DATABASE_URL": "postgres://u:a%40b@10.88.0.1:5454/d?sslmode=prefer",
                "MINIO_ROOT_USER": "fixture", "MINIO_ROOT_PASSWORD": "fixture-key",
                "PUBLIC_SETTING": "retain", "S3_ACCESS_KEY_ID": "remote"}
        def prepare():
            return warm.prepare({"Config": {"Env": [k + "=" + v for k, v in base.items()]}})
        out = prepare()
        self.assertEqual(out["DATABASE_URL"], "postgres://u:a%40b@pg-replica:5432/d?sslmode=prefer")
        self.assertEqual(out["PUBLIC_SETTING"], "retain")
        self.assertEqual(out["S3_ACCESS_KEY_ID"], "fixture")
        self.assertIn("unbottled-redis", out["REDIS_URL"])
        base["DATABASE_URL"] = "postgres://u:pw@localhost/db"
        with self.assertRaises(ValueError):
            prepare()


class PromotionTests(unittest.TestCase):
    def run_planned(self, hold=True, proof="s1-fenced 123 4 F/123", replay=True, args=None):
        with tempfile.TemporaryDirectory() as tmp:
            work = Path(tmp)
            if hold:
                (work / "hold").write_text("fixture")
            script = (BASE / "ha-failover.sh").read_text().split('case "${1:-status}" in')[0]
            script = script.replace('CONF=/etc/ha-failover/ha.env', 'CONF=/dev/null')
            script += r'''
docker() { exit 90; }; ssh() { exit 91; }
pg_q() { case "$1" in
  *pg_control_system*) echo "$1" > "$STATE_DIR/checked"; echo "$REPLAY" ;;
  *) echo t ;;
esac; }
peer_ssh() { [ "$1" = fence-proof ] && echo "$PROOF"; }
promote_pg() { touch "$STATE_DIR/pg-promote"; }
switch_app_local() { :; }; app_probe() { :; }; dns_failover() { :; }; alert() { :; }
cmd_promote "$@"
'''
            env = {**os.environ, "HA_NODE": "s2", "HA_LOCAL_PG": "fixture",
                   "HA_PEER_WG": "192.0.2.1", "HA_PEER_PUBLIC": "192.0.2.1", "HA_SELF_PUBLIC": "192.0.2.2",
                   "HA_CADDY_DRAIN_DIR": tmp, "HA_STATE_DIR": tmp, "PROOF": proof, "REPLAY": "t" if replay else "f"}
            args = ["--planned", "--target-lsn=F/110", "--yes"] if args is None else args
            proc = subprocess.run(["bash", "-c", script, "fixture", *args], capture_output=True, env=env, timeout=5)
            query = work / "checked"
            return proc.returncode, (work / "pg-promote").exists(), query.read_text() if query.exists() else ""

    def test_fixed_barrier_and_shutdown_fence(self):
        rc, promoted, query = self.run_planned()
        self.assertEqual((rc, promoted), (0, True))
        for fragment in ["= '123'", "= 4", ">= 'F/110'::pg_lsn", "> 'F/123'::pg_lsn"]:
            self.assertIn(fragment, query)
        for values in [{"hold": False}, {"proof": ""}, {"proof": "s1-fenced 123 4 INVALID"},
                       {"replay": False}, {"args": ["--planned", "--force", "--target-lsn=F/110", "--yes"]}]:
            rc, promoted, _ = self.run_planned(**values)
            self.assertNotEqual(rc, 0)
            self.assertFalse(promoted)

    def test_durable_fence(self):
        script = (BASE / "ha-peer-cmd.sh").read_text().split('case "${SSH_ORIGINAL_COMMAND')[0]
        script = script.replace('/etc/ha-failover/ha.env', '/dev/null')
        script += r'''
docker() {
  case "$1:$2" in
    update:*|stop:*) return "$STOP_RC" ;;
    inspect:-f) if [[ "$3" == *RestartPolicy* ]]; then echo "$STOPPED"; else echo image; fi ;;
    run:*) printf '%s\n' 'Database system identifier: 123' "Database cluster state: $CLUSTER" \
      'Latest checkpoint location: F/124' "Latest checkpoint's TimeLineID: 4" ;;
    *) return 90 ;;
  esac
}
logger() { :; }
fence_self && fence_proof
'''
        for stop_rc, stopped, cluster, ok in [(0, "exited no", "shut down", True), (1, "exited no", "shut down", False),
                                             (0, "exited always", "shut down", False), (0, "exited no", "in production", False)]:
            with tempfile.TemporaryDirectory() as tmp:
                env = {**os.environ, "HA_STATE_DIR": tmp, "HA_NODE": "s1", "HA_LOCAL_PG": "prod-postgres",
                       "HA_FENCE_CONTAINERS": "next-vibe-app prod-postgres", "STOP_RC": str(stop_rc),
                       "STOPPED": stopped, "CLUSTER": cluster}
                result = subprocess.run(["bash", "-c", script], capture_output=True, env=env, timeout=5)
                self.assertEqual(result.returncode == 0, ok)
                self.assertEqual(result.stdout.strip() == b"s1-fenced 123 4 F/124", ok)


class CutTests(unittest.TestCase):
    def test_preflight_checks_helper_database_and_live_counter(self):
        cut = load(BASE / "q104-cut.py")
        for node, role, recovery in [("s1", "primary", "f"), ("s2", "standby", "t")]:
            state = f"node={node} role={role} pg={role} ts=123"
            for reply, db, counter, ok in [
                (state, recovery, 2, True), (state.replace("pg=" + role, "pg=down"), recovery, 0, False),
                (state.replace("role=" + role, "role=fenced"), recovery, 0, False),
                (state.replace(node, "other"), recovery, 0, False), ("", recovery, 0, False),
                (state, "t" if recovery == "f" else "f", 0, False),
                (state, recovery, None, False), (state, recovery, -1, False),
            ]:
                with self.subTest(node=node, reply=reply, db=db, counter=counter), \
                     patch.object(cut, "ssh", return_value=reply) as helper, \
                     patch.object(cut, "sql", return_value=db), \
                     patch.object(cut, "upstream_counts", return_value={cut.APP[node]: counter}):
                    if ok:
                        self.assertIn(cut.APP[node], cut.preflight(node))
                    else:
                        with self.assertRaises(RuntimeError):
                            cut.preflight(node)
                    helper.assert_called_once_with(node, "SSH_ORIGINAL_COMMAND=state /usr/local/sbin/ha-peer-cmd")

    def test_s1_requires_idle_shared_port_and_checks_lingering_sidecar(self):
        cut = load(BASE / "q104-cut.py")
        for shared, sidecar, expected in [
            (0, None, True), (None, 0, False), (1, None, False),
            (0, 1, False), (0, 0, True),
        ]:
            rows = [{"address": f"next-vibe-app:{port}", "num_requests": count}
                    for port, count in [(3000, shared), (4000, sidecar)] if count is not None]
            with self.subTest(shared=shared, sidecar=sidecar), patch.object(cut, "ssh", return_value=json.dumps(rows)):
                self.assertEqual(cut.idle("s1"), expected)

    def test_drain_needs_both_fresh_idle_roles_and_closed_sockets(self):
        cut = load(BASE / "q104-cut.py")
        now = datetime.datetime.now(datetime.timezone.utc)
        counts = {"loops": 0, "tasks": 0, "runs": 0}
        reports = [{"role": "next", "counts": {**counts, "http": 0}, "at": now.isoformat()},
                   {"role": "server", "counts": {**counts, "wsClients": 0, "wsConnectors": 0}, "at": now.isoformat(), "wsClosed": True}]
        def idle():
            return cut.drain_idle("\n".join(json.dumps(s) for s in reports), now)
        self.assertTrue(idle())
        reports[0]["counts"]["http"] = 1
        self.assertFalse(idle())
        reports[0]["counts"]["http"] = 0
        reports[1]["wsClosed"] = False
        self.assertFalse(idle())
        reports[1]["wsClosed"] = True
        reports[1]["at"] = (now - datetime.timedelta(seconds=10)).isoformat()
        self.assertFalse(idle())

    def simulate(self, failure):
        cut = load(BASE / "q104-cut.py")
        calls = []
        def ssh(node, command):
            calls.append((node, command))
            if "fence-local" in command and failure == "fence":
                raise RuntimeError("fixture fence failure")
            if command == "SSH_ORIGINAL_COMMAND=state /usr/local/sbin/ha-peer-cmd":
                role = "primary" if node == "s1" else "standby"
                return f"node={node} role={role} pg={role} ts=123"
            if "/reverse_proxy/upstreams" in command:
                return json.dumps([{"address": cut.APP[node], "num_requests": 0}])
            return ""
        def sql(node, query):
            if "prepared" in query:
                return "1" if failure == "busy" else "0"
            if "flush_lsn" in query:
                return "F/123"
            if "replay_lsn" in query:
                return "t"
            if "from users" in query:
                return "1|1|2|0|4" if node == "s2" and failure == "counts" else "1|1|2|0|3"
            return "f" if node == "s1" else "t"
        with patch.object(cut, "ssh", ssh), patch.object(cut, "sql", sql), patch.object(cut, "idle", return_value=True), \
             patch.object(cut, "verified_warm", return_value=True), patch.object(cut, "event"):
            if failure:
                with self.assertRaises(RuntimeError):
                    cut.cut()
            else:
                cut.cut()
        return [command for node, command in calls]

    def test_cut_and_abort_boundaries(self):
        ok = self.simulate("")
        fence = next(i for i, command in enumerate(ok) if "fence-local" in command)
        promote = next(i for i, command in enumerate(ok) if "promote --planned" in command)
        releases = [i for i, command in enumerate(ok) if "mv -T switchover.pause" in command]
        self.assertTrue(fence < promote < min(releases))
        self.assertEqual(len(releases), 2)
        before = self.simulate("busy")
        self.assertFalse(any("fence-local" in c or "promote --planned" in c for c in before))
        self.assertEqual(sum("mv -T switchover.pause" in c for c in before), 2)
        mismatch = self.simulate("counts")
        self.assertFalse(any("fence-local" in c or "promote --planned" in c for c in mismatch))
        self.assertEqual(sum("mv -T switchover.pause" in c for c in mismatch), 2)
        after = self.simulate("fence")
        self.assertFalse(any("mv -T switchover.pause" in c or "promote --planned" in c for c in after))


class PublicDocumentTests(unittest.TestCase):
    def test_release_scope(self):
        legal = load(BASE.parent / "edge-lb/export-public-legal.py")
        for slug, ids in legal.SECTIONS.items():
            sections = "".join(f'<section id="{name}" onclick="secret_handler"><h2>{name}</h2><p>Released text.</p></section>' for name in ids)
            source = f'<html><nav>private_name</nav><div class="min-h-screen"><h1>Title</h1><div><p>2026</p></div><div class="text-pretty">Binding introduction.</div>{sections}<script>private_credential</script></div></html>'
            document = legal.export(source.encode(), slug)
            self.assertIn("Binding introduction.", document)
            self.assertIn(ids[-1], document)
            self.assertNotIn("private_", document)
            self.assertNotIn("secret_handler", document)
            with self.assertRaises(ValueError):
                legal.export(source.replace(f'id="{ids[0]}"', 'id="changed"').encode(), slug)


if __name__ == "__main__":
    unittest.main()
