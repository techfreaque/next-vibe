import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { INDEXNOW_KEY } from "./constants";
import {
  chunk,
  fingerprintUrl,
  parseFingerprints,
  pendingUrls,
  serializeFingerprints,
} from "./diff";

const urls = [
  { url: "https://unbottled.ai/en-US/story", lastmod: null },
  { url: "https://unbottled.ai/de-DE/story", lastmod: null },
  { url: "https://unbottled.ai/en-US/story/blog/a", lastmod: "2026-11-20" },
];

describe("IndexNow key file", () => {
  it("public/<key>.txt holds exactly the key", () => {
    expect(INDEXNOW_KEY).toMatch(/^[a-f0-9]{32}$/);
    const file = join(process.cwd(), "public", `${INDEXNOW_KEY}.txt`);
    expect(readFileSync(file, "utf8").trim()).toBe(INDEXNOW_KEY);
  });
});

describe("IndexNow diff", () => {
  it("submits everything the first time", () => {
    expect(pendingUrls(urls, new Set(), false)).toHaveLength(3);
  });

  it("skips URLs already submitted and is stable across a round trip", () => {
    const stored = serializeFingerprints(urls.map(fingerprintUrl));
    expect(pendingUrls(urls, parseFingerprints(stored), false)).toHaveLength(
      0,
    );
  });

  it("resubmits a URL whose lastmod changed", () => {
    const stored = new Set(urls.map(fingerprintUrl));
    const changed = urls.map((entry, index) =>
      index === 2 ? { ...entry, lastmod: "2026-11-25" } : entry,
    );
    expect(pendingUrls(changed, stored, false).map(({ url }) => url)).toEqual([
      "https://unbottled.ai/en-US/story/blog/a",
    ]);
  });

  it("force resubmits all", () => {
    expect(
      pendingUrls(urls, new Set(urls.map(fingerprintUrl)), true),
    ).toHaveLength(3);
  });

  it("treats malformed state as empty", () => {
    expect(parseFingerprints("not json").size).toBe(0);
    expect(parseFingerprints('{"a":1}').size).toBe(0);
    expect(parseFingerprints(null).size).toBe(0);
  });

  it("batches at the protocol limit", () => {
    const items = Array.from({ length: 25_001 }, (_, index) => index);
    expect(chunk(items, 10_000).map((batch) => batch.length)).toEqual([
      10_000, 10_000, 5001,
    ]);
  });
});
