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
import { readProxyTimingHeader } from "../core/proxy-timing";
import { handleHttpProxy } from "./http-proxy";

const logger = createEndpointLogger(false, defaultLocale);

let upstream: ReturnType<typeof Bun.serve>;
let nextPort = 0;

beforeAll(() => {
  upstream = Bun.serve({
    port: 0,
    fetch: (req) => {
      const path = new URL(req.url).pathname;
      if (path === "/api/en-US/failing") {
        return Response.json({ message: "framework failure" }, { status: 500 });
      }
      if (path === "/api/en-US/unmatched") {
        return new Response("<h1>Not Found</h1>", {
          status: 404,
          headers: { "content-type": "text/html" },
        });
      }
      if (path === "/api/en-US/missing-resource") {
        return Response.json({ success: false }, { status: 404 });
      }
      if (path === "/api/en-US/preflight") {
        return new Response(null, { status: 204 });
      }
      if (path === "/api/en-US/cached") {
        return new Response(null, { status: 304, headers: { etag: '"fixture"' } });
      }
      return Response.json(
        {
          proto: req.headers.get("x-forwarded-proto"),
          host: req.headers.get("x-forwarded-host"),
        },
        { headers: { "server-timing": "fixture;dur=1" } },
      );
    },
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
    const response = await handleHttpProxy(new Request("http://127.0.0.1:3000/robots.txt"), {
      nextPort: port,
      logger: { ...logger, warn, info },
      isShuttingDown: () => false,
    });
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

it("identifies Next asset responses while preserving upstream timing", async () => {
  const response = await handleHttpProxy(
    new Request("http://127.0.0.1:3000/_next/static/chunks/sample.js"),
    { nextPort, logger, isShuttingDown: () => false },
  );
  const timing = response.headers.get("server-timing");
  expect(timing).toContain("fixture;dur=1");
  expect(readProxyTimingHeader(timing)).toBe("upstream-response");
  await response.text();
});

it("correlates framework API failures and preserves the upstream responses", async () => {
  const error = mock((_message: string, ..._metadata: LoggerMetadata[]) => {});
  const headers = {
    accept: "application/json",
    "x-request-id": "fixture-request-error",
  };
  const responses = await Promise.all(
    ["failing", "unmatched", "missing-resource"].map((path) =>
      handleHttpProxy(
        new Request(`http://127.0.0.1:3000/api/en-US/${path}?token=fixture`, {
          headers,
        }),
        { nextPort, logger: { ...logger, error }, isShuttingDown: () => false },
      ),
    ),
  );
  expect(responses.map((response) => response.status)).toEqual([500, 404, 404]);
  expect(await Promise.all(responses.map((response) => response.text()))).toEqual([
    '{"message":"framework failure"}',
    "<h1>Not Found</h1>",
    '{"success":false}',
  ]);
  expect(error).toHaveBeenCalledTimes(2);
  expect(error).toHaveBeenCalledWith(
    "[Proxy] Upstream returned an HTTP failure",
    expect.objectContaining({
      requestId: "fixture-request-error",
      path: "/api/en-US/failing",
      status: 500,
    }),
  );
  expect(error).toHaveBeenCalledWith(
    "[Proxy] Upstream returned an HTTP failure",
    expect.objectContaining({
      requestId: "fixture-request-error",
      path: "/api/en-US/unmatched",
      status: 404,
    }),
  );
});

it("forwards bodyless upstream responses", async () => {
  const context = { nextPort, logger, isShuttingDown: () => false };
  const preflight = await handleHttpProxy(
    new Request("http://127.0.0.1:3000/api/en-US/preflight", {
      method: "OPTIONS",
    }),
    context,
  );
  const cached = await handleHttpProxy(
    new Request("http://127.0.0.1:3000/api/en-US/cached"),
    context,
  );
  expect(preflight.status).toBe(204);
  expect(preflight.body).toBeNull();
  expect(cached.status).toBe(304);
  expect(cached.body).toBeNull();
  expect(cached.headers.get("etag")).toBe('"fixture"');
});

it("identifies and logs a synthetic 503 with the client request id", async () => {
  const socket = Bun.serve({ port: 0, fetch: () => new Response("fixture") });
  const port = socket.port ?? 0;
  await socket.stop(true);
  const warn = mock((_message: string, ..._metadata: LoggerMetadata[]) => {});
  const response = await handleHttpProxy(
    new Request("http://127.0.0.1:3000/api/en-US/sample", {
      method: "POST",
      headers: { "x-request-id": "fixture-request-503" },
    }),
    { nextPort: port, logger: { ...logger, warn }, isShuttingDown: () => false },
  );
  expect(response.status).toBe(503);
  expect(readProxyTimingHeader(response.headers.get("server-timing"))).toBe("upstream-unavailable");
  expect(warn).toHaveBeenCalledWith(
    "[Proxy] Upstream unavailable for a non-retriable request",
    expect.objectContaining({ requestId: "fixture-request-503" }),
  );
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
