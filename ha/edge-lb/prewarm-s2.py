"""Start a taskless, portless copy of S2's released web image on local storage."""
import json
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlsplit


def prepare(source):
    values = dict(item.split("=", 1) for item in source["Config"]["Env"])
    db = urlsplit(values["DATABASE_URL"])
    if db.hostname != "10.88.0.1" or not db.username or not db.password:
        raise ValueError("expected the S2 standby application's remote database")
    for key in ("MINIO_ROOT_USER", "MINIO_ROOT_PASSWORD"):
        if not values.get(key):
            raise ValueError("missing local object-store credentials")
    values.update(
        DATABASE_URL=db._replace(netloc=db.netloc.rsplit("@", 1)[0] + "@pg-replica:5432").geturl(),
        REDIS_URL="redis://unbottled-redis:6379",
        S3_ENDPOINT="http://unbottled-minio:9000",
        S3_ACCESS_KEY_ID=values["MINIO_ROOT_USER"],
        S3_SECRET_ACCESS_KEY=values["MINIO_ROOT_PASSWORD"],
        DATABASE_POOL_MAX="2", HA_DB_ADMISSION="true",
    )
    return values


def main():
    config = Path("/etc/ha-failover/ha.env").read_text().splitlines()
    state = Path("/var/lib/ha-failover")
    warm = "unbottled-ha-warm"
    if "HA_NODE=s2" not in config or not (state / "hold").is_file():
        sys.exit("requires held S2 standby")
    peer_state = subprocess.check_output(["/usr/local/sbin/ha-peer-cmd", "state"], text=True)
    if peer_state.split()[:3] != ["node=s2", "role=standby", "pg=standby"]:
        sys.exit("requires held S2 standby")
    source = json.loads(subprocess.check_output(["docker", "inspect", "unbottled-app"]))[0]
    recovery = subprocess.check_output(["docker", "exec", "unbottled-pg-replica", "psql", "-U", "postgres",
                                        "-Atc", "select pg_is_in_recovery()"]).strip()
    if recovery != b"t":
        sys.exit("local database must be in recovery")
    values = prepare(source)
    # Send effective environ (including multiline values) via stdin to the
    # local Engine socket. Credentials never appear in argv or a temp file.
    payload = {"Image": source["Image"], "Env": [key + "=" + value for key, value in values.items()],
               "Cmd": ["bun", "src/vibe/platforms/cli/vibe-runtime.ts", "start",
                       "--seed=false", "--db-setup=false", "--task-runner=false"],
               "HostConfig": {"NetworkMode": "unbottled_app-network", "RestartPolicy": {"Name": "no"},
                              "LogConfig": {"Type": "json-file", "Config": {"max-size": "10m", "max-file": "2"}}}}
    subprocess.run(["curl", "--disable", "--silent", "--fail", "--max-time", "10", "--noproxy", "*",
                    "--unix-socket", "/var/run/docker.sock", "-H", "Content-Type: application/json",
                    "--data-binary", "@-", "http://localhost/containers/create?name=" + warm],
                   input=json.dumps(payload).encode(), check=True, stdout=subprocess.DEVNULL)
    subprocess.run(["docker", "network", "connect", "caddy_internal", warm], check=True)
    subprocess.run(["docker", "start", warm], check=True)
    subprocess.run(["systemctl", "start", "ha-app-readiness@" + warm], check=True)


if __name__ == "__main__":
    main()
