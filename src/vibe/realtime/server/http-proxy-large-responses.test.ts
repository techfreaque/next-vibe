/**
 * Event-loop lag rows name multi-MB proxied bodies by route class and bytes,
 * never by raw URL (ids, tokens and the query stay out).
 */

import { expect, it } from "bun:test";

import { defaultLocale } from "../../core/i18n/core/config";
import { createEndpointLogger } from "../../logger/server";
import { handleHttpProxy, summarizeLargeResponses } from "./http-proxy";

const logger = createEndpointLogger(false, defaultLocale);
const BODY_BYTES = 3 * 1024 * 1024;

it("summarizes a large proxied response without its ids or query", async () => {
  const body = new Uint8Array(BODY_BYTES).fill(7);
  const upstream = Bun.serve({
    port: 0,
    fetch: () =>
      new Response(body, { headers: { "content-type": "text/plain" } }),
  });
  try {
    const startedAt = Date.now();
    const response = await handleHttpProxy(
      new Request(
        "http://localhost/api/en-GLOBAL/vibe/agent/chat/threads/files/dc3985f8-23a4-457b-9026-42bbcb6e27b3/opaqueToken1234567890abc.txt?sig=secret",
      ),
      {
        nextPort: upstream.port ?? 0,
        logger,
        isShuttingDown: () => false,
      },
    );
    expect((await response.arrayBuffer()).byteLength).toBe(BODY_BYTES);
    const summary = summarizeLargeResponses(startedAt, Date.now());
    expect(summary).toContain(
      "GET /api/en-GLOBAL/vibe/agent/chat/threads/files/:token/:id 3.0 MB of 3.0 MB finished",
    );
    expect(summary).not.toContain("dc3985f8");
    expect(summary).not.toContain("opaqueToken");
    expect(summary).not.toContain("secret");
  } finally {
    await upstream.stop(true);
  }
});

it("reports nothing when no large response was near the stall", () => {
  expect(summarizeLargeResponses(0, 1)).toBeUndefined();
});
