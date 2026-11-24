"""Run the production release drivers with fixture Docker, HTTP and edge state."""
import os
from pathlib import Path
import subprocess
import tempfile

SCRIPTS = Path(__file__).resolve().parent


def write(path, script):
    path.write_text("#!/bin/bash\nset -eu\n" + script)
    path.chmod(0o700)


def verify(driver, outcome):
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        (root / "scripts").mkdir()
        (root / "bin").mkdir()
        (root / "running").write_text("prior")
        (root / "tag").write_text("candidate")
        write(root / "bin/docker", """
case "$*" in
  *'{{.State.Running}}'*) echo true ;;
  *'{{.Image}}'*) cat running ;;
  *'{{.State.Status}}'*) echo running ;;
  'tag prior '*) printf prior > tag ;;
  'tag '*) : ;;
  'compose '*'config --images app') echo "fixture/app:$TAG" ;;
  'compose '*'up -d --no-deps --force-recreate app') cp tag running; cat running >> rolls; echo >> rolls ;;
  'inspect '*|'image inspect '*|'logs '*|'compose '*'pull app'|'compose '*' pg_isready '*|\
  'compose '*'run --rm app '*|'compose '*'logs --tail=60 app'|\
  'builder prune '*|'image prune '*|'volume prune '*) : ;;
  *) echo "unexpected fixture Docker call" >&2; exit 5 ;;
esac
""")
        write(root / "bin/curl", "echo 200\n")
        write(root / "scripts/ha-edge-canary.sh", """
live=$(cat running)
echo "$live" >> canaries
case "$OUTCOME:$live" in
  baseline:prior|reject:candidate) exit 1 ;;
esac
""")
        env = {
            **os.environ, "PATH": str(root / "bin") + ":" + os.environ["PATH"],
            "NO_GIT_RESET": "1", "HA_DRAIN_WAIT": "0", "HA_NO_ROLLBACK": "0",
            "HA_EDGE_CANARY_REQUIRED": "1", "DOCKER_IMAGE_NAME": "fixture/app",
            "TAG": "latest" if driver == "install-docker.sh" else "unbottled",
            "HA_IMAGE_TAG": "unbottled", "HA_NEW_IMAGE_REF": "fixture/app:candidate",
            "LOG_ARCHIVE_DIR": str(root / "logs"), "OUTCOME": outcome,
        }
        proc = subprocess.run(["bash", SCRIPTS / driver], cwd=root, env=env, timeout=10,
                              stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        rolls = (root / "rolls").read_text().splitlines() if (root / "rolls").exists() else []
        expected = {"baseline": [], "success": ["candidate"], "reject": ["candidate", "prior"]}[outcome]
        assert rolls == expected and (proc.returncode == 0) == (outcome == "success"), (driver, outcome, proc.stdout)
        assert (root / "canaries").read_text().splitlines() == ["prior", *expected]
        assert (root / "running").read_text() == ("candidate" if outcome == "success" else "prior")


def verify_canary():
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        conf = root / "ha.env"
        conf.write_text("HA_NODE=s2\nHA_SELF_PUBLIC=192.0.2.10\n")
        script = (SCRIPTS / "ha-edge-canary.sh").read_text().replace("/etc/ha-failover/ha.env", str(conf))
        write(root / "docker", "echo 123\n")
        write(root / "nsenter", 'shift 3; exec "$@"\n')
        write(root / "curl", """
case "$*" in
  *'/config/apps/http/servers/'*)
    echo '{"site":{"listen":[":443"]},"origin":{"listen":["127.0.0.1:19381"],"path":["/_ha/admit"]}}'; exit ;;
esac
up=unbottled-app:3000
body=$'User-agent: *\\n'
status=200
reason=v1-ready
instance=$up
case "$*" in
  *'/_ha/ready'*) body=$'ready\\n' ;;
esac
case "$SCENARIO:$*" in
  peer:*'19381/robots.txt'*) up=next-vibe-app:3000 ;;
  rejected:*'19381/robots.txt'*) exit 22 ;;
  redirect:*'3000/_ha/ready'*) status=307 ;;
  legacy:*'3099/_ha/ready'*) reason="" ;;
  warm:*'19381/robots.txt'*) instance=unbottled-ha-warm:3000 ;;
  no-instance:*'19381/robots.txt'*) instance= ;;
esac
printf 'HTTP/1.1 %s\\r\\nX-HA-Upstream: %s\\r\\n' "$status" "$up"
if [[ -n $instance ]]; then
  printf 'X-HA-App-Instance: %s\\r\\n' "$instance"
fi
printf 'X-HA-Readiness: %s\\r\\n\\r\\n%s\\n%s' "$reason" "$body" "$status"
""")
        for scenario in ("healthy", "peer", "rejected", "redirect", "legacy", "warm", "no-instance"):
            env = {**os.environ, "PATH": str(root) + ":" + os.environ["PATH"], "SCENARIO": scenario}
            p = subprocess.run(["bash", "-s"], input=script, env=env, capture_output=True, text=True, timeout=5)
            assert (p.returncode == 0) == (scenario == "healthy"), (scenario, p.stdout, p.stderr)


verify_canary()
for driver in ("install-docker.sh", "deploy-ha-node.sh"):
    for outcome in ("baseline", "success", "reject"):
        verify(driver, outcome)
print("PASS both release drivers: refused baseline, healthy candidate, rejected candidate restored and rechecked")
