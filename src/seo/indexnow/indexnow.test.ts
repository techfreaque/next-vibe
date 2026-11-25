import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { INDEXNOW_KEY, INDEXNOW_KEY_PATH } from "./constants";
import {
  chunk,
  fingerprintUrl,
  fingerprintUrls,
  parseFingerprints,
  pendingUrls,
  serializeFingerprints,
} from "./diff";
import { checkIndexNowKey } from "./key-check";

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

describe("IndexNow fingerprint slicing", () => {
  const many = Array.from({ length: 1234 }, (_, index) => ({
    url: `https://unbottled.ai/en-US/page-${index}`,
    lastmod: index % 3 === 0 ? "2026-11-25" : null,
  }));

  it("matches the synchronous fingerprints in order", async () => {
    expect(await fingerprintUrls(many, 250)).toEqual(many.map(fingerprintUrl));
  });

  it("yields to the event loop between slices", async () => {
    let ticks = 0;
    const timer = setInterval(() => {
      ticks++;
    }, 0);
    const yielded = await new Promise<boolean>((resolve) => {
      setImmediate(() => {
        ticks = 0;
        void fingerprintUrls(many, 50).then(() => resolve(ticks > 0));
      });
    });
    clearInterval(timer);
    expect(yielded).toBe(true);
  });

  it("reuses precomputed fingerprints in pendingUrls", async () => {
    const fingerprints = await fingerprintUrls(urls, 2);
    const submitted = new Set([fingerprints[0] ?? ""]);
    expect(pendingUrls(urls, submitted, false, fingerprints)).toEqual(
      pendingUrls(urls, submitted, false),
    );
  });
});

describe("IndexNow key preflight", () => {
  function serve(
    handler: (request: Request) => Response,
  ): ReturnType<typeof Bun.serve> {
    return Bun.serve({ port: 0, fetch: handler });
  }

  it("passes when the key file answers 200 with the key", async () => {
    const server = serve((request) =>
      new URL(request.url).pathname === INDEXNOW_KEY_PATH
        ? new Response(`${INDEXNOW_KEY}\n`, {
            headers: { "content-type": "text/plain; charset=utf-8" },
          })
        : new Response("missing", { status: 404 }),
    );
    try {
      const result = await checkIndexNowKey(`${server.url.origin}/`);
      expect(result.ok).toBe(true);
      expect(result.status).toBe(200);
      expect(result.keyUrl).toBe(`${server.url.origin}${INDEXNOW_KEY_PATH}`);
    } finally {
      void server.stop(true);
    }
  });

  it("fails on a locale redirect and reports the location", async () => {
    const server = serve(
      () =>
        new Response(null, {
          status: 307,
          headers: { location: `/en-GLOBAL${INDEXNOW_KEY_PATH}` },
        }),
    );
    try {
      const result = await checkIndexNowKey(server.url.origin);
      expect(result.ok).toBe(false);
      expect(result.status).toBe(307);
      expect(result.location).toBe(`/en-GLOBAL${INDEXNOW_KEY_PATH}`);
    } finally {
      void server.stop(true);
    }
  });

  it("fails on a 200 with the wrong body", async () => {
    const server = serve(
      () =>
        new Response("<html></html>", {
          headers: { "content-type": "text/html" },
        }),
    );
    try {
      const result = await checkIndexNowKey(server.url.origin);
      expect(result.ok).toBe(false);
      expect(result.contentType).toBe("text/html");
    } finally {
      void server.stop(true);
    }
  });

  it("fails without throwing when the host is unreachable", async () => {
    const result = await checkIndexNowKey("http://127.0.0.1:1");
    expect(result.ok).toBe(false);
    expect(result.status).toBeNull();
  });
});
