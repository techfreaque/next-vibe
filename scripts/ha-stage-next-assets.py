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
# Every content-hashed file a browser of either release can request: shared and
# dynamic chunks, App Router segment chunks (chunks/app/[locale]/(auth)/...),
# per-build locale chunks, CSS and fonts/images under media/. Only the build
# manifests (<buildId>/_buildManifest.js, unhashed) stay origin-only.
ASSET = re.compile(
    r"(?:(?:chunks|css)/(?:[a-zA-Z0-9_.~()\[\]@-]+/)*[a-zA-Z0-9_.~-]*[0-9a-f]{8,}"
    r"[a-zA-Z0-9_.~-]*\.(?:js|css)|chunks/locales/[a-zA-Z0-9_-]{8,}/[0-9]+\.js"
    r"|media/[a-zA-Z0-9_.~-]*[0-9a-f]{8,}[a-zA-Z0-9_.~-]*"
    r"\.(?:woff2?|ttf|otf|eot|png|jpe?g|gif|svg|webp|avif|ico))"
)
RETENTION_SECONDS = 7 * 24 * 60 * 60


def is_asset(name):
    """Allowlisted release file; segment names may hold dots ([...path]) but
    never a "." or ".." segment that could leave the cache directory."""
    return bool(ASSET.fullmatch(name)) and not {".", ".."} & set(name.split("/"))
# Keep in sync with runtimeEnvPlaceholder() in
# src/vibe/platforms/cli/runtime/runtime-env-placeholders.ts.
RUNTIME_ENV_SENTINEL = re.compile(rb"__VIBE_RUNTIME_ENV_[A-Z0-9_]+__")


def write_atomic(dest, data):
    dest.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=dest.parent, prefix=".incoming-", delete=False) as pending:
        try:
            pending.write(data)
            pending.flush()
            os.fchmod(pending.fileno(), 0o644)
            os.replace(pending.name, dest)
        finally:
            Path(pending.name).unlink(missing_ok=True)


def stage(source, root, patched=True, authoritative=frozenset()):
    """Copy release assets into the edge cache; returns the staged names.

    The filename hash is computed BEFORE the container patches its runtime env
    sentinels into the bundle, so the same name holds different bytes in the
    image and in the running app. patched=True (a running container): its copy
    is what browsers must get, so it replaces a differing cached copy.
    patched=False (the raw image): a file with a sentinel is never staged (it
    would crash every page for a year of immutable browser caching, prod
    2026-11-25 23:02 .. 11-26 07:45 UTC); an older cached copy of it is dropped
    unless this run's running container supplied it (`authoritative`), so the
    edge falls through to the patched origin.
    """
    staged = set()
    recognized = 0
    with tarfile.open(fileobj=source, mode="r|") as archive:
        for member in archive:
            name = member.name.removeprefix("./")
            if not member.isfile() or not is_asset(name):
                continue
            recognized += 1
            dest = root / name
            with archive.extractfile(member) as stream:
                data = stream.read()
            if not patched and RUNTIME_ENV_SENTINEL.search(data):
                if name not in authoritative:
                    dest.unlink(missing_ok=True)
                continue
            if dest.is_file() and (not patched or dest.read_bytes() == data):
                # Same release content: only refresh the retention clock.
                os.utime(dest, None)
            else:
                write_atomic(dest, data)
            staged.add(name)
    if not recognized:
        raise ValueError("release has no recognized immutable browser assets")
    return staged


def stage_release(command, root, patched=True, authoritative=frozenset()):
    with subprocess.Popen(["timeout", "180", *command], stdout=subprocess.PIPE) as proc:
        try:
            names = stage(proc.stdout, root, patched, authoritative)
        finally:
            proc.stdout.close()
        if proc.wait() != 0:
            raise RuntimeError("could not read release static directory")
        return names


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
            patched=False, authoritative=frozenset(outgoing),
        )
        # Only published asset names are eligible for cache eviction.
        cutoff = time.time() - RETENTION_SECONDS
        for file in cache.rglob("*"):
            if is_asset(file.relative_to(cache).as_posix()) and file.is_file():
                if file.stat().st_mtime < cutoff:
                    file.unlink()
        print(f"Staged {len(outgoing)} outgoing and {len(incoming)} incoming immutable assets")


if __name__ == "__main__":
    main(*sys.argv[1:])
