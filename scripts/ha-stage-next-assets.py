"""Retain immutable browser chunks from both releases before switching HA traffic."""
import fcntl
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile
import time

# Keep this allowlist aligned with @asset in ha/edge-lb/routing/ingress.caddy.
ASSET = re.compile(
    r"(?:(?:chunks|css)/(?:[a-zA-Z0-9_~-]+/)*[a-zA-Z0-9_.~-]*[0-9a-f]{8,}"
    r"[a-zA-Z0-9_.~-]*\.(?:js|css)|chunks/locales/[a-zA-Z0-9_-]{8,}/[0-9]+\.js)"
)
RETENTION_SECONDS = 7 * 24 * 60 * 60


def stage(source, root):
    staged = 0
    with tarfile.open(fileobj=source, mode="r|") as archive:
        for member in archive:
            name = member.name.removeprefix("./")
            if not member.isfile() or not ASSET.fullmatch(name):
                continue
            dest = root / name
            if dest.is_file():
                # Both a content hash and a build-specific locale name are immutable.
                os.utime(dest, None)
            else:
                dest.parent.mkdir(parents=True, exist_ok=True)
                with archive.extractfile(member) as data, tempfile.NamedTemporaryFile(
                    dir=dest.parent, prefix=".incoming-", delete=False
                ) as pending:
                    try:
                        shutil.copyfileobj(data, pending)
                        pending.flush()
                        os.fchmod(pending.fileno(), 0o644)
                        os.replace(pending.name, dest)
                    finally:
                        Path(pending.name).unlink(missing_ok=True)
            staged += 1
    if not staged:
        raise ValueError("release has no recognized immutable browser assets")
    return staged


def stage_release(command, root):
    with subprocess.Popen(["timeout", "180", *command], stdout=subprocess.PIPE) as proc:
        try:
            count = stage(proc.stdout, root)
        finally:
            proc.stdout.close()
        if proc.wait() != 0:
            raise RuntimeError("could not read release static directory")
        return count


def main(app, image, edge_dir):
    public = Path(edge_dir) / "ha-public"
    cache = public / "_next" / "static"
    public.mkdir(parents=True, exist_ok=True)
    with (public / ".next-assets.lock").open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        args = ["-C", "/app/.next-prod/static", "-cf", "-", "."]
        outgoing = stage_release(["docker", "exec", app, "tar", *args], cache)
        incoming = stage_release(
            ["docker", "run", "--rm", "--network", "none", "--read-only",
             "--pull", "never", "--entrypoint", "tar", image, *args], cache,
        )
        # Only published asset names are eligible for cache eviction.
        cutoff = time.time() - RETENTION_SECONDS
        for file in cache.rglob("*"):
            if ASSET.fullmatch(file.relative_to(cache).as_posix()) and file.is_file():
                if file.stat().st_mtime < cutoff:
                    file.unlink()
        print(f"Staged {outgoing} outgoing and {incoming} incoming immutable assets")


if __name__ == "__main__":
    main(*sys.argv[1:])
