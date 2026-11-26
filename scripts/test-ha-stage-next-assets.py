"""Replay public chunk names captured during a rolling deploy using fixture tarballs."""
import importlib.util
import io
import os
from pathlib import Path
import re
import tarfile
import tempfile
import time
import unittest
from unittest.mock import patch

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("ha_stage_next_assets", HERE / "ha-stage-next-assets.py")
assets = importlib.util.module_from_spec(spec)
spec.loader.exec_module(assets)

OLD_CHUNK = "chunks/552793.c92bc34adbec4758.js"
NEW_CHUNK = "chunks/486147-49ed48a3f953da9b.js"
LOCALE = "chunks/locales/V3icjTMls73LWteelCsVU/991135.js"
# Names from the prod static tree of 998a07d72b: App Router segment chunks were
# origin-only, so every old tab 404'd on its next client navigation after a deploy.
APP_CHUNKS = [
    "chunks/app/[locale]/layout-94fac8c647f3d689.js",
    "chunks/app/[locale]/(auth)/signup/page-30a0cd9e8840ace5.js",
    "chunks/app/[locale]/threads/[...path]/page-e007b32e8ceb0f18.js",
    "chunks/app/api/[locale]/v1/music/[id]/route-8fe7c331abf9949c.js",
    "chunks/app/_not-found/page-0d1c9a6b2f3e4a5b.js",
]
MEDIA = ["media/ba9851c3c22cd980-s.woff2", "media/inter-cyrillic-wght-normal.491cbc05.woff2"]


def bundle(files):
    stream = io.BytesIO()
    with tarfile.open(fileobj=stream, mode="w") as tar:
        for name, data in files.items():
            entry = tarfile.TarInfo(f"./{name}")
            entry.size = len(data)
            tar.addfile(entry, io.BytesIO(data))
        link = tarfile.TarInfo("./chunks/secret-deadbeef.js")
        link.type = tarfile.SYMTYPE
        link.linkname = "/outside"
        tar.addfile(link)
    stream.seek(0)
    return stream


class ReleaseAssetsTest(unittest.TestCase):
    def test_both_images_and_cache_expiry(self):
        rejected = ["chunks/123.js", "chunks/secret.map", "../escape-deadbeef.js",
                    "chunks/../private-deadbeef.js", "server/chunks/abcdef12.js",
                    "chunks/app/../../escape-deadbeef.js", "media/font.woff2",
                    "media/x-deadbeef.html", "V3icjTMls73LWteelCsVU/_buildManifest.js"]
        old = {OLD_CHUNK: b"old", LOCALE: b"locale", **{k: b"app" for k in APP_CHUNKS + MEDIA},
               **{k: b"private" for k in rejected}}
        commands = []

        def staged(command, root, patched=True, authoritative=frozenset()):
            commands.append(command)
            files = old if command[1] == "exec" else {NEW_CHUNK: b"new"}
            return assets.stage(bundle(files), root, patched, authoritative)

        with tempfile.TemporaryDirectory() as folder, patch.object(assets, "stage_release", staged):
            root = Path(folder) / "ha-public" / "_next" / "static"
            expired = root / "chunks" / "expired-deadbeef.js"
            expired.parent.mkdir(parents=True)
            expired.write_bytes(b"expired")
            old_time = time.time() - 2 * assets.RETENTION_SECONDS
            os.utime(expired, (old_time, old_time))
            assets.main("fixture-app", "fixture:candidate", folder)
            self.assertEqual(commands[0][:3], ["docker", "exec", "fixture-app"])
            self.assertIn("fixture:candidate", commands[1])
            for key in (OLD_CHUNK, LOCALE, NEW_CHUNK, *APP_CHUNKS, *MEDIA):
                self.assertTrue((root / key).is_file(), key)
            self.assertFalse(expired.exists())
            self.assertFalse((root / "chunks/secret-deadbeef.js").exists())
            self.assertFalse((Path(folder) / "ha-public" / "escape-deadbeef.js").exists())
            self.assertEqual(len([p for p in root.rglob("*") if p.is_file()]), 3 + len(APP_CHUNKS + MEDIA))
        config = (HERE.parent / "ha/edge-lb/routing/ingress.caddy").read_text()
        matcher = re.search(r"path_regexp (\^/_next/static/[^\n]+)", config).group(1)
        for name in [OLD_CHUNK, NEW_CHUNK, LOCALE, "css/96fc339f.css", *APP_CHUNKS, *MEDIA, *rejected]:
            accepted = name not in rejected
            self.assertEqual(assets.is_asset(name), accepted, name)
            # Caddy cleans ".." segments before matching, so only the staging side
            # needs the traversal guard; every other name must agree exactly.
            if ".." not in name.split("/"):
                self.assertEqual(bool(re.fullmatch(matcher, "/_next/static/" + name)), accepted, name)

    def test_runtime_env_sentinels_never_reach_the_edge_unpatched(self):
        raw_env = b'value:"__VIBE_RUNTIME_ENV_NEXT_PUBLIC_APP_URL__"'
        patched_env = b'value:"https://unbottled.ai"'
        guard = b'r.startsWith("__VIBE_RUNTIME_ENV_")'
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            # A raw image copy poisoned by an earlier run must not survive.
            (root / "chunks").mkdir()
            (root / NEW_CHUNK).write_bytes(raw_env)
            names = assets.stage(
                bundle({NEW_CHUNK: raw_env, OLD_CHUNK: guard}), root, patched=False
            )
            self.assertEqual(names, {OLD_CHUNK})
            self.assertFalse((root / NEW_CHUNK).exists())
            self.assertEqual((root / OLD_CHUNK).read_bytes(), guard)

            # The running container's patched copy replaces a differing cache entry.
            (root / NEW_CHUNK).write_bytes(raw_env)
            outgoing = assets.stage(bundle({NEW_CHUNK: patched_env}), root)
            self.assertEqual((root / NEW_CHUNK).read_bytes(), patched_env)
            # ...and the raw image of the next release leaves it in place.
            assets.stage(bundle({NEW_CHUNK: raw_env}), root, patched=False,
                         authoritative=frozenset(outgoing))
            self.assertEqual((root / NEW_CHUNK).read_bytes(), patched_env)

    def test_prod_poisoned_env_chunk_is_rejected(self):
        """Replay of the 2026-11-26 outage: the staged raw chunk kept three sentinels."""
        raw = (b'NEXT_PUBLIC_APP_URL:{value:"__VIBE_RUNTIME_ENV_NEXT_PUBLIC_APP_URL__"},'
               b'NEXT_PUBLIC_VIBE_MODE:{value:"__VIBE_RUNTIME_ENV_NEXT_PUBLIC_VIBE_MODE__"}')
        name = "chunks/153721-aa860b19c81fb1fc.js"
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            self.assertEqual(assets.stage(bundle({name: raw}), root, patched=False), set())
            self.assertFalse((root / name).exists())

    def test_unrecognized_release_fails_preflight(self):
        with tempfile.TemporaryDirectory() as folder, self.assertRaises(ValueError):
            assets.stage(bundle({"server/private.js": b"fixture"}), Path(folder))


if __name__ == "__main__":
    unittest.main()
