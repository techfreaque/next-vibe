/**
 * Same-port front proxy header forwarding. Regression: the proxy overwrote
 * X-Forwarded-Proto with its own plain-http scheme, so on a node running
 * Next.js behind it (HA S2) every middleware locale redirect pointed to
 * http:// even though the TLS edge (Caddy) had sent X-Forwarded-Proto: https.
 */

import { afterAll, beforeAll, describe, expect, it, mock } from "bun:test";

import { defaultLocale } from "../../core/i18n/core/config";
import { createEndpointLogger } from "../../logger/server";
import type { LoggerMetadata } from "../../logger/types";
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

it("correlates a startup refusal and its retry outcome", async () => {
  const reserved = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch: () => new Response("reserved"),
  });
  const port = reserved.port ?? 0;
  await reserved.stop(true);
  let recovering: ReturnType<typeof Bun.serve> | undefined;
  const warn = mock((message: string, ..._metadata: LoggerMetadata[]) => {
    if (message === "[Proxy] Server not ready, retrying") {
      recovering ??= Bun.serve({
        hostname: "127.0.0.1",
        port,
        fetch: () => new Response("ready"),
      });
    }
  });
  const info = mock((_message: string, ..._metadata: LoggerMetadata[]) => {});
  try {
    const response = await handleHttpProxy(
      new Request("http://127.0.0.1:3000/robots.txt"),
      {
        nextPort: port,
        logger: { ...logger, warn, info },
        isShuttingDown: () => false,
      },
    );
    expect(await response.text()).toBe("ready");
    const first = warn.mock.calls[0]?.[1];
    const requestId =
      typeof first === "object" && first !== null && "requestId" in first
        ? first.requestId
        : undefined;
    expect(typeof requestId).toBe("string");
    expect(warn).toHaveBeenCalledWith(
      "[Proxy] Request arrived before Next.js was up",
      expect.objectContaining({ requestId, path: "/robots.txt" }),
    );
    expect(warn).toHaveBeenCalledWith(
      "[Proxy] Server not ready, retrying",
      expect.objectContaining({ requestId, attempt: 1 }),
    );
    expect(info).toHaveBeenCalledWith(
      "[Proxy] Upstream answered after retry",
      expect.objectContaining({ requestId, status: 200, retries: 1 }),
    );
  } finally {
    await recovering?.stop(true);
  }
});

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
