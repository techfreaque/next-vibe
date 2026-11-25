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
                    "chunks/../private-deadbeef.js", "server/chunks/abcdef12.js"]
        old = {OLD_CHUNK: b"old", LOCALE: b"locale", **{k: b"private" for k in rejected}}
        commands = []

        def staged(command, root):
            commands.append(command)
            files = old if command[1] == "exec" else {NEW_CHUNK: b"new"}
            return assets.stage(bundle(files), root)

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
            for key in (OLD_CHUNK, LOCALE, NEW_CHUNK):
                self.assertTrue((root / key).is_file())
            self.assertFalse(expired.exists())
            self.assertFalse((root / "chunks/secret-deadbeef.js").exists())
            self.assertEqual(len([p for p in root.rglob("*") if p.is_file()]), 3)
        config = (HERE.parent / "ha/edge-lb/routing/ingress.caddy").read_text()
        matcher = re.search(r"path_regexp (\^/_next/static/[^\n]+)", config).group(1)
        for name in [OLD_CHUNK, NEW_CHUNK, LOCALE, "css/96fc339f.css", *rejected]:
            accepted = name not in rejected
            self.assertEqual(bool(assets.ASSET.fullmatch(name)), accepted, name)
            self.assertEqual(bool(re.fullmatch(matcher, "/_next/static/" + name)), accepted, name)

    def test_unrecognized_release_fails_preflight(self):
        with tempfile.TemporaryDirectory() as folder, self.assertRaises(ValueError):
            assets.stage(bundle({"server/private.js": b"fixture"}), Path(folder))


if __name__ == "__main__":
    unittest.main()
