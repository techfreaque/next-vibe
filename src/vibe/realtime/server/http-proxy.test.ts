/**
 * Same-port front proxy header forwarding. Regression: the proxy overwrote
 * X-Forwarded-Proto with its own plain-http scheme, so on a node running
 * Next.js behind it (HA S2) every middleware locale redirect pointed to
 * http:// even though the TLS edge (Caddy) had sent X-Forwarded-Proto: https.
 */

import { afterAll, beforeAll, describe, expect, it } from "bun:test";

import { defaultLocale } from "../../core/i18n/core/config";
import { createEndpointLogger } from "../../logger/server";
import { handleHttpProxy } from "./http-proxy";

const logger = createEndpointLogger(false, defaultLocale);

let upstream: ReturnType<typeof Bun.serve>;
let nextPort = 0;

beforeAll(() => {
  upstream = Bun.serve({
    port: 0,
    fetch: (req) =>
      Response.json({
        proto: req.headers.get("x-forwarded-proto"),
        host: req.headers.get("x-forwarded-host"),
      }),
  });
  nextPort = upstream.port ?? 0;
});

afterAll(() => {
  void upstream.stop(true);
});

async function forwarded(
  headers: Record<string, string>,
): Promise<{ proto: string | null; host: string | null }> {
  const res = await handleHttpProxy(
    new Request("http://127.0.0.1:3000/user/referral", { headers }),
    { nextPort, logger, isShuttingDown: () => false },
  );
  const body: { proto: string | null; host: string | null } = await res.json();
  return body;
}

describe("http proxy forwarded headers", () => {
  it("keeps the TLS edge's proto and host", async () => {
    expect(
      await forwarded({
        host: "unbottled.ai",
        "x-forwarded-proto": "https",
        "x-forwarded-host": "unbottled.ai",
      }),
    ).toEqual({ proto: "https", host: "unbottled.ai" });
  });

  it("falls back to its own scheme and Host header without an edge", async () => {
    expect(await forwarded({ host: "localhost:3000" })).toEqual({
      proto: "http",
      host: "localhost:3000",
    });
  });
});
