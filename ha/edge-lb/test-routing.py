"""Replay the production Caddy snippets with two isolated local origins.

Usage: python3 ha/edge-lb/test-routing.py /path/to/caddy
"""
import concurrent.futures
import http.client
import json
import os
import socket
import subprocess
import sys
import tempfile
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class App(BaseHTTPRequestHandler):
    def do_GET(self):
        self.respond()

    def do_HEAD(self):
        self.respond()

    def do_POST(self):
        self.respond()

    def log_message(self, *args):
        pass

    def respond(self):
        server = self.server
        probe = self.path in ("/_ha/ready", "/_ha/admit")
        if probe:
            if server.probe_delay:
                time.sleep(server.probe_delay)
            if server.probe_disconnect:
                self.close_connection = True
                return
            body = b"ready" if server.ready else b"unavailable"
            status = 200 if server.ready else server.failure_status
        else:
            payload = self.rfile.read(int(self.headers.get("Content-Length", 0)))
            body = json.dumps([self.command, self.path, payload.decode(), self.headers.get("Cookie")]).encode()
            server.calls.append((self.command, self.path))
            status = server.page_status
        self.send_response(status)
        self.send_header("X-HA-Upstream", server.name)
        if probe and server.reason:
            self.send_header("X-HA-Readiness", "v1-ready" if server.ready else server.reason)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if self.command != "HEAD":
            try:
                self.wfile.write(body)
            except BrokenPipeError:
                if not probe:
                    raise


def backend(name):
    server = ThreadingHTTPServer(("127.0.0.1", 0), App)
    server.name = name
    server.ready = True
    server.failure_status = 503
    server.reason = "v1-db-unavailable"
    server.probe_disconnect = False
    server.probe_delay = 0
    server.page_status = 200
    server.calls = []
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


def address(port):
    return f"127.0.0.1:{port}"


def free_port():
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def run(caddy, work):
    own, peer, warm = backend("own"), backend("peer"), backend("warm")
    origin, ingress, s1_ingress = free_port(), free_port(), free_port()
    local_app = address(own.server_port)
    (work / "accept.caddy").write_text('header Proxy-Authorization "Bearer fixture"\n')
    (work / "send.caddy").write_text('header_up Proxy-Authorization "Bearer fixture"\n')
    for source in (Path(__file__).parent / "routing").glob("*.caddy"):
        s = source.read_text().replace("/data/ha-routing", str(work)).replace("/data/ha-drain", str(work)).replace("/data/ha-relay", str(work))
        s = s.replace("127.0.0.1:19381", address(origin)).replace("127.0.0.1:19382", address(peer.server_port))
        if source.name == "origin.caddy":
            s = s.replace("{args[3]}:3000", address(warm.server_port)).replace("{args[3]}:3099", address(warm.server_port))
        s = s.replace("/data/ha-public", str(work / "public"))
        (work / source.name).write_text(s)
    config = work / "Caddyfile"
    config.write_text(f"""{{
    admin off
    auto_https off
}}
http://:{origin} {{
    import {work}/origin.caddy {local_app} {local_app} {local_app} fixture-warm
}}
http://:{ingress} {{
    bind 127.0.0.1
    handle_errors 502 503 504 {{
        import {work}/unavailable.caddy
    }}
    import {work}/ingress.caddy {local_app} 192.0.2.1 s2
}}
http://:{s1_ingress} {{
    bind 127.0.0.1
    import {work}/ingress.caddy {local_app} 192.0.2.1 s1
}}
""")
    def request(path, method="GET", data=None, headers=None, port=ingress):
        conn = http.client.HTTPConnection("127.0.0.1", port, timeout=6)
        conn.request(method, path, body=data, headers={"Cookie": "fixture=1", **(headers or {})})
        response = conn.getresponse()
        body = response.read()
        conn.close()
        return response, body

    with (work / "caddy.log").open("w") as log:
        process = subprocess.Popen([caddy, "run", "--config", str(config)], stdout=log, stderr=log,
                                   env={**os.environ, "XDG_CONFIG_HOME":str(work), "XDG_DATA_HOME":str(work)})
        gate = subprocess.Popen([sys.executable, str(Path(__file__).parent / "switchover-gate.py"), str(work)])
        try:
            for _ in range(100):
                if process.poll() is not None:
                    raise RuntimeError((work/"caddy.log").read_text()[:6000])
                try:
                    response, _ = request("/warmup")
                    if response.status == 200 and response.getheader("X-HA-Upstream") == local_app:
                        break
                except OSError:
                    pass
                time.sleep(.05)
            own.calls.clear()
            peer.calls.clear()
            response, body = request("/checkout?q=12", "POST", "signed-payload")
            assert response.status == 200 and response.getheader("X-HA-Upstream") == local_app, (response.status, response.getheaders(), body, own.calls, peer.calls)
            assert json.loads(body) == ["POST", "/checkout?q=12", "signed-payload", "fixture=1"]
            assert own.calls == [("POST", "/checkout?q=12")] and not peer.calls
            for status, reason, disconnected in [
                (404, None, False), (503, None, False),
                (503, "v1-renderer-unavailable", False), (503, "v1-unknown", False),
                (503, None, True),
            ]:
                own.ready, own.failure_status, own.reason, own.probe_disconnect = False, status, reason, disconnected
                own.calls.clear()
                response, body = request("/checkout?fallback", "POST", "once")
                assert response.status == 200 and json.loads(body) == ["POST", "/checkout?fallback", "once", "fixture=1"], (status, reason, response.status, body)
                assert own.calls == [("POST", "/checkout?fallback")] and not peer.calls
            own.ready, own.failure_status, own.reason, own.probe_disconnect = True, 503, "v1-db-unavailable", False
            own.probe_delay = 1.2
            own.calls.clear()
            response, body = request("/checkout?deadline", "POST", "once")
            assert response.status == 200 and json.loads(body)[2] == "once"
            assert own.calls == [("POST", "/checkout?deadline")] and not peer.calls
            own.probe_delay = 0
            own.page_status = 503
            response, body = request("/story")
            assert response.status == 200 and response.getheader("X-HA-Retry-Status") == "503"
            assert response.getheader("X-HA-Upstream") == "peer" and peer.calls == [("GET", "/story")]
            response, body = request("/checkout", "POST", "do-not-repeat")
            assert response.status == 503 and json.loads(body)[2] == "do-not-repeat"
            assert len(peer.calls) == 1
            own.ready = False
            response, _ = request("/_ha/ready")
            assert response.status == 503 and response.getheader("X-HA-Upstream") == local_app
            response, body = request("/checkout", "POST", "new-write")
            assert response.status == 200 and json.loads(body) == ["POST", "/checkout", "new-write", "fixture=1"]
            own.ready = True
            own.page_status = 200
            (work / "s2").touch()
            response, _ = request("/cached-dns")
            assert response.getheader("X-HA-Upstream") == "peer"
            peer.ready = False
            response, _ = request("/peer-down")
            assert response.status == 200 and response.getheader("X-HA-Upstream") == local_app
            (work / "s2").rename(work / "drain-finished")
            marker = work / "switchover.pause"
            marker.touch()
            own.calls.clear()
            peer.calls.clear()
            with concurrent.futures.ThreadPoolExecutor() as pool:
                pending = pool.submit(request, "/checkout?id=cut", "POST", "signed-once")
                time.sleep(.3)
                assert not pending.done() and not own.calls and not peer.calls and not warm.calls
                (work / "use-warm").touch()
                (work / "primary-s2").touch()
                ready, _ = request("/_ha/ready")
                assert ready.status == 200 and ready.getheader("X-HA-App-Instance") == address(warm.server_port)
                marker.rename(work / "pause-ended")
                response, body = pending.result()
            assert response.status == 200 and json.loads(body) == ["POST", "/checkout?id=cut", "signed-once", "fixture=1"], (response.status, body, response.getheaders(), own.calls, peer.calls, warm.calls, (work / "caddy.log").read_text()[-4000:])
            assert response.getheader("X-HA-Upstream") == local_app
            assert warm.calls == [("POST", "/checkout?id=cut")] and not own.calls and not peer.calls
            peer.ready = True
            response, _ = request("/from-cached-s1", port=s1_ingress)
            assert response.status == 200 and peer.calls == [("GET", "/from-cached-s1")]
            peer.calls.clear()
            legal_path = "/en-US/story/terms-of-service"
            doc = work / "public" / (legal_path.lstrip("/") + ".html")
            doc.parent.mkdir(parents=True)
            doc.write_bytes(b"<h1>Released fixture</h1>")
            request_headers = {"Accept": "text/html"}
            response, body = request(legal_path, headers=request_headers)
            assert response.status == 200 and json.loads(body)[1] == legal_path
            warm.ready = False
            response, body = request(legal_path, headers=request_headers)
            assert response.status == 200 and response.getheader("X-HA-Read-Only") == "public-document" and body == doc.read_bytes()
            response, _ = request(legal_path, headers={**request_headers, "RSC": "1"})
            assert response.status == 503 and not response.getheader("X-HA-Read-Only")
            warm.ready = True
            warm.calls.clear()
            gate.terminate()
            gate.wait(timeout=3)
            marker.touch()
            asset_path = "/_next/static/chunks/abcd1234.js"
            asset = work / "public" / asset_path.lstrip("/")
            asset.parent.mkdir(parents=True)
            asset.write_bytes(b"release asset")
            response, body = request(asset_path)
            assert response.status == 200 and body == b"release asset"
            response, _ = request(asset_path, "POST", "write")
            assert response.status == 503 and not own.calls
            response, _ = request("/payment", "POST", "never-dispatched")
            assert response.status == 503 and response.getheader("Retry-After") == "1"
            assert not warm.calls and not own.calls and not peer.calls
            print("PASS: paused POST waits across the origin switch and reaches the warm instance exactly once; readiness bypasses the pause; a missing gate returns retryable 503.")
            print("PASS: S1 forwards to the selected S2, released public document and immutable asset remain readable; RSC and writes keep admission.")
            print("PASS: original POST body, cookie and URI; local 503 GET replay; ambiguous POST delivered once; unhealthy origin rejects admission; drained peer-first and local fallback.")
        finally:
            gate.terminate()
            gate.wait(timeout=3)
            process.terminate()
            process.wait(timeout=5)
            own.server_close()
            peer.server_close()
            warm.server_close()


with tempfile.TemporaryDirectory() as tmp:
    run(sys.argv[1], Path(tmp))
