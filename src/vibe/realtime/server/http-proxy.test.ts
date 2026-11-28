/**
 * Same-port front proxy header forwarding. Regression: the proxy overwrote
 * X-Forwarded-Proto with its own plain-http scheme, so on a node running
 * Next.js behind it (HA S2) every middleware locale redirect pointed to
 * http:// even though the TLS edge (Caddy) had sent X-Forwarded-Proto: https.
 */

import { createServer, type Socket } from "node:net";

import { afterAll, beforeAll, describe, expect, it, mock } from "bun:test";

import { defaultLocale } from "../../core/i18n/core/config";
import { createEndpointLogger } from "../../logger/server";
import type { EndpointLogger } from "../../logger/types";
import { readProxyTimingHeader } from "../core/proxy-timing";
import { handleHttpProxy, summarizeInFlightRequests } from "./http-proxy";

const logger = createEndpointLogger(false, defaultLocale);

let upstream: ReturnType<typeof Bun.serve>;
let nextPort = 0;

beforeAll(() => {
  upstream = Bun.serve({
    port: 0,
    fetch: async (req) => {
      const path = new URL(req.url).pathname;
      if (path === "/api/en-US/upload") {
        return Response.json({
          length: req.headers.get("content-length"),
          bytes: (await req.arrayBuffer()).byteLength,
          requestId: req.headers.get("x-request-id"),
        });
      }
      if (path === "/sk-SK/tools/tax-report") {
        return Response.json({ message: "internal diagnostic" }, {
          status: 500, headers: {"Retry-After": "5", "Set-Cookie": "fixture=1", "Content-Disposition": "attachment"},
        });
      }
      if (path === "/api/en-US/failing") {
        return Response.json({ message: "framework failure" }, { status: 500 });
      }
      if (path === "/api/en-US/unavailable") {
        return new Response("Service Unavailable", {
          status: 503,
          headers: {
            "Retry-After": "5",
            "Server-Timing": 'vibe-lead;desc="provision"',
          },
        });
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
      if (path === "/src/missing.tsx") {
        return new Response("Not Found", { status: 404 });
      }
      if (path === "/src/rewritten.tsx") {
        return new Response("<h1>Page</h1>", {
          headers: { "content-type": "text/html" },
        });
      }
      if (path === "/src/slow-module.tsx") {
        await Bun.sleep(50);
        return new Response("export default 1", {
          headers: { "content-type": "text/javascript" },
        });
      }
      if (path === "/api/en-US/preflight") {
        return new Response(null, { status: 204 });
      }
      if (path === "/api/en-US/streamed-response") {
        const hop = req.headers.has("x-request-hop");
        return new Response(
          new ReadableStream({
            start(controller): void {
              const encoder = new TextEncoder();
              controller.enqueue(encoder.encode('{"requestHopForwarded":'));
              controller.enqueue(encoder.encode(`${String(hop)}}`));
              controller.close();
            },
          }),
          {
            headers: {
              connection: "close, X-Response-Hop",
              "content-type": "application/json",
              "x-response-hop": "upstream-only",
            },
          },
        );
      }
      if (path === "/api/en-US/cached") {
        return new Response(null, {
          status: 304,
          headers: { etag: '"fixture"' },
        });
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
  const warn = mock<EndpointLogger["warn"]>((message): void => {
    if (message === "[Proxy] Server not ready, retrying") {
      recovering ??= Bun.serve({
        hostname: "127.0.0.1",
        port,
        fetch: () => new Response("ready"),
      });
    }
  });
  const info = mock<EndpointLogger["info"]>();
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
  const error = mock<EndpointLogger["error"]>();
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
  expect(
    await Promise.all(responses.map((response) => response.text())),
  ).toEqual([
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

it("correlates missing and rewritten development modules", async () => {
  const error = mock<EndpointLogger["error"]>();
  const context = {
    nextPort,
    logger: { ...logger, error },
    isShuttingDown: (): boolean => false,
  };
  for (const [module, status] of [
    ["missing.tsx", 404],
    ["rewritten.tsx", 200],
  ] as const) {
    const response = await handleHttpProxy(
      new Request(`http://127.0.0.1:3000/src/${module}?t=123`, {
        headers: { "sec-fetch-dest": "script" },
      }),
      context,
    );
    expect(response.status).toBe(status);
    expect(readProxyTimingHeader(response.headers.get("server-timing"))).toBe(
      "upstream-response",
    );
    const requestId = response.headers.get("x-request-id");
    expect(requestId).toBeTruthy();
    expect(error).toHaveBeenCalledWith(
      "[Proxy] Upstream returned an HTTP failure",
      expect.objectContaining({
        requestId,
        path: `/src/${module}`,
        status,
      }),
    );
    await response.text();
  }
});

it("gives development source modules the asset deadline", async () => {
  const response = await handleHttpProxy(
    new Request("http://127.0.0.1:3000/src/slow-module.tsx", {
      headers: { "sec-fetch-dest": "script" },
    }),
    {
      nextPort,
      logger,
      pageRenderTimeoutMs: 10,
      isShuttingDown: () => false,
    },
  );
  expect(response.status).toBe(200);
  expect(await response.text()).toBe("export default 1");
});

it("forwards bodyless upstream responses", async () => {
  const context = { nextPort, logger, isShuttingDown: (): boolean => false };
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

it("separates request and response framing and correlates streamed API responses", async () => {
  const requestId = "4b0c1d7e-8f1a-4c2b-9d3e-5f6a7b8c9d0e";
  const response = await handleHttpProxy(
    new Request("http://127.0.0.1:3000/api/en-US/streamed-response", {
      headers: {
        connection: "keep-alive, X-Request-Hop",
        "x-request-hop": "downstream-only",
        "x-request-id": requestId,
      },
    }),
    { nextPort, logger, isShuttingDown: () => false },
  );
  expect(await response.json()).toEqual({ requestHopForwarded: false });
  expect(response.headers.has("connection")).toBe(false);
  expect(response.headers.has("transfer-encoding")).toBe(false);
  expect(response.headers.has("x-response-hop")).toBe(false);
  expect(response.headers.get("x-request-id")).toBe(requestId);
  expect(readProxyTimingHeader(response.headers.get("server-timing"))).toBe(
    "upstream-response",
  );
});

it("records a serving upstream's retry interval on a 503", async () => {
  const error = mock<EndpointLogger["error"]>();
  const context = {
    nextPort,
    logger: { ...logger, error },
    isShuttingDown: (): boolean => false,
  };
  const warm = await handleHttpProxy(
    new Request("http://127.0.0.1:3000/robots.txt"),
    context,
  );
  await warm.text();
  const response = await handleHttpProxy(
    new Request("http://127.0.0.1:3000/api/en-US/unavailable"),
    context,
  );
  expect(response.status).toBe(503);
  expect(response.headers.get("retry-after")).toBe("5");
  expect(await response.text()).toBe("Service Unavailable");
  expect(error).toHaveBeenCalledWith(
    "[Proxy] Upstream returned an HTTP failure",
    expect.objectContaining({
      status: 503,
      retryAfterSeconds: 5,
      leadFailurePhase: "provision",
      previousUpstreamResponseAgeMs: expect.any(Number),
    }),
  );
});

it("identifies and logs a synthetic 503 with the client request id", async () => {
  const socket = Bun.serve({ port: 0, fetch: () => new Response("fixture") });
  const port = socket.port ?? 0;
  await socket.stop(true);
  const warn = mock<EndpointLogger["warn"]>();
  const response = await handleHttpProxy(
    new Request("http://127.0.0.1:3000/api/en-US/sample", {
      method: "POST",
      headers: { "x-request-id": "fixture-request-503" },
    }),
    {
      nextPort: port,
      logger: { ...logger, warn },
      isShuttingDown: () => false,
    },
  );
  expect(response.status).toBe(503);
  expect(readProxyTimingHeader(response.headers.get("server-timing"))).toBe(
    "upstream-unavailable",
  );
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

it("frames a buffered request using its byte count and forwards a request id", async () => {
  const body = JSON.stringify({ text: "ą".repeat(1024) });
  const response = await handleHttpProxy(
    new Request("http://127.0.0.1:3000/api/en-US/upload", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "transfer-encoding": "chunked",
      },
      body,
    }),
    { nextPort, logger, isShuttingDown: () => false },
  );
  const length = Buffer.byteLength(body);
  expect(await response.json()).toEqual({
    length: String(length),
    bytes: length,
    requestId: expect.stringMatching(/^[a-zA-Z0-9_-]{8,64}$/),
  });
});

it("reports truncated buffered requests before opening the upstream connection", async () => {
  const error = mock<EndpointLogger["error"]>();
  const response = await handleHttpProxy(
    new Request("http://127.0.0.1:3000/api/en-US/upload", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "content-length": "12",
        "x-request-id": "fixture-short-upload",
      },
      body: "{}",
    }),
    { nextPort, logger: { ...logger, error }, isShuttingDown: () => false },
  );
  expect(response.status).toBe(400);
  expect(error).toHaveBeenCalledWith(
    "[Proxy] Request body length differs from Content-Length",
    expect.objectContaining({
      requestId: "fixture-short-upload",
      advertisedLength: "12",
      receivedBytes: 2,
    }),
  );
});

it("rejects a write before dispatch when the HA database path is down", async () => {
  const response = await handleHttpProxy(
    new Request("http://localhost/checkout", {
      method: "POST",
      body: "fixture",
      headers: { "x-request-id": "fixture-db-admission" },
    }),
    {
      nextPort: 0,
      logger,
      isShuttingDown: () => false,
      databaseReadiness: () => Promise.resolve(AbortSignal.abort()),
    },
  );
  expect(response.status).toBe(503);
  expect(response.headers.get("retry-after")).toBe("1");
  expect(response.headers.get("x-request-id")).toBe("fixture-db-admission");
  expect(readProxyTimingHeader(response.headers.get("server-timing"))).toBe(
    "database-unavailable",
  );
});

it("releases a read waiting for headers when HA database readiness fails", async () => {
  const db = new AbortController();
  const slow = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch: async () => {
      db.abort();
      await Bun.sleep(100);
      return new Response("too late");
    },
  });
  try {
    const response = await handleHttpProxy(
      new Request("http://localhost/en-US/story", {
        headers: { "x-request-id": "fixture-inflight-db-loss" },
      }),
      {
        nextPort: slow.port ?? 0,
        logger,
        isShuttingDown: () => false,
        databaseReadiness: () => Promise.resolve(db.signal),
      },
    );
    expect(response.status).toBe(503);
    expect(response.headers.get("x-request-id")).toBe("fixture-inflight-db-loss");
    expect(readProxyTimingHeader(response.headers.get("server-timing"))).toBe(
      "database-unavailable",
    );
    expect(await response.text()).toBe("Database unavailable");
  } finally {
    await slow.stop(true);
  }
});

it("closes the upstream socket when a client abandons a read before headers", async () => {
  const received = Promise.withResolvers<void>();
  const closed = Promise.withResolvers<void>();
  const server = createServer((socket) => {
    socket.once("data", () => received.resolve());
    socket.once("close", () => closed.resolve());
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const client = new AbortController();
  const error = mock<EndpointLogger["error"]>();
  const info = mock<EndpointLogger["info"]>();
  try {
    const pending = handleHttpProxy(
      new Request("http://localhost/en-US/tools", {
        signal: client.signal,
        headers: { "x-request-id": "fixture-abandoned-read" },
      }),
      {
        nextPort: address && typeof address !== "string" ? address.port : 0,
        databaseReadiness: () =>
          Promise.resolve(new AbortController().signal),
        logger: { ...logger, error, info },
        isShuttingDown: () => false,
      },
    );
    await received.promise;
    client.abort();
    const response = await pending;
    expect(response.status).toBe(499);
    await closed.promise;
    expect(summarizeInFlightRequests()).not.toContain("GET /en-US/tools");
    expect(error).not.toHaveBeenCalled();
    expect(info).toHaveBeenCalledWith(
      "[Proxy] Client closed before response headers",
      expect.objectContaining({ requestId: "fixture-abandoned-read" }),
    );
  } finally {
    server.close();
  }
});

it("returns 504 for page headers and gives assets, traffic streams, and writes more time", async () => {
  const pageReceived = Promise.withResolvers<void>();
  const slow = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch: async (req) => {
      if (new URL(req.url).pathname.endsWith("/fixture-token")) {
        pageReceived.resolve();
      }
      await Bun.sleep(225);
      return new Response("upstream");
    },
  });
  const error = mock<EndpointLogger["error"]>();
  const ctx = {
    nextPort: slow.port ?? 0,
    pageRenderTimeoutMs: 100,
    databaseReadiness: (): Promise<AbortSignal> =>
      Promise.resolve(new AbortController().signal),
    logger: { ...logger, error },
    isShuttingDown: (): boolean => false,
  };
  try {
    const page = handleHttpProxy(
      new Request(
        "http://localhost/en-US/user/reset-password/fixture-token?secret=fixture",
      ),
      ctx,
    );
    const head = handleHttpProxy(
      new Request("http://localhost/de-DE", { method: "HEAD" }),
      ctx,
    );
    const bypasses = [
      new Request("http://localhost/api/en-US/slow"),
      new Request("http://localhost/_next/static/slow"),
      new Request("http://localhost/media/slow"),
      new Request("http://localhost/en-US/slow.webm"),
      new Request("http://localhost/uploads/slow"),
      new Request("http://localhost/en-US/streaming/slow"),
      new Request("http://localhost/ws"),
      new Request("http://localhost/en-US/events", {
        headers: { accept: "text/event-stream" },
      }),
      new Request("http://localhost/en-US/slow", {
        method: "POST",
        body: "upload",
      }),
    ].map((request) => handleHttpProxy(request, ctx));

    await Promise.race([pageReceived.promise, page]);
    expect(summarizeInFlightRequests()).toContain(
      "GET /en-US/user/reset-password/:token",
    );
    expect(summarizeInFlightRequests()).not.toContain("fixture-token");
    const response = await page;
    expect(response.status).toBe(504);
    expect(readProxyTimingHeader(response.headers.get("server-timing"))).toBe(
      "upstream-timeout",
    );
    expect(await response.text()).toBe("Gateway Timeout");
    const headResponse = await head;
    expect(headResponse.status).toBe(504);
    expect(headResponse.body).toBeNull();
    const preserved = await Promise.all(bypasses);
    expect(preserved.map((res) => res.status)).toEqual(bypasses.map(() => 200));
    expect(await Promise.all(preserved.map((res) => res.text()))).toEqual(
      bypasses.map(() => "upstream"),
    );
    expect(error).toHaveBeenCalledTimes(2);
    expect(error).toHaveBeenCalledWith(
      "[Proxy] Upstream request timed out",
      expect.objectContaining({
        path: "/en-US/user/reset-password/:token",
        phase: "response-headers",
        targetPort: ctx.nextPort,
      }),
    );
    expect(summarizeInFlightRequests()).not.toContain(
      "/en-US/user/reset-password/",
    );
  } finally {
    await slow.stop(true);
  }
});

it("counts reconnect backoff against the page deadline", async () => {
  const reserved = Bun.serve({ port: 0, fetch: () => new Response("fixture") });
  const port = reserved.port ?? 0;
  await reserved.stop(true);
  const response = await handleHttpProxy(
    new Request("http://localhost/en-US"),
    {
      nextPort: port,
      pageRenderTimeoutMs: 100,
      logger,
      isShuttingDown: () => false,
    },
  );
  expect(response.status).toBe(504);
});

it("lets an open page response continue streaming past the header deadline", async () => {
  const encoder = new TextEncoder();
  const streaming = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch: () =>
      new Response(
        new ReadableStream({
          async start(controller): Promise<void> {
            controller.enqueue(encoder.encode("first "));
            await Bun.sleep(225);
            controller.enqueue(encoder.encode("last"));
            controller.close();
          },
        }),
      ),
  });
  try {
    const response = await handleHttpProxy(
      new Request("http://localhost/en-US/story"),
      {
        nextPort: streaming.port ?? 0,
        pageRenderTimeoutMs: 100,
        logger,
        isShuttingDown: () => false,
      },
    );
    expect(response.status).toBe(200);
    expect(summarizeInFlightRequests()).toContain("GET /en-US/story");
    expect(await response.text()).toBe("first last");
  } finally {
    await streaming.stop(true);
  }
});

it("reports an incomplete upstream response body once with its request ID", async () => {
  const upstreamSocket = Promise.withResolvers<Socket>();
  const server = createServer((socket) => {
    upstreamSocket.resolve(socket);
    socket.once("data", () => {
      socket.write(
        "HTTP/1.1 200 OK\r\nContent-Length: 9\r\nConnection: close\r\n\r\nstart",
      );
    });
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const error = mock<EndpointLogger["error"]>();
  try {
    const response = await handleHttpProxy(
      new Request("http://localhost/api/en-US/partial-response", {
        headers: { "x-request-id": "fixture-partial-response" },
      }),
      {
        nextPort: address && typeof address !== "string" ? address.port : 0,
        logger: { ...logger, error },
        isShuttingDown: () => false,
      },
    );
    expect(response.status).toBe(200);
    (await upstreamSocket.promise).end();
    await expect(response.text()).rejects.toThrow();
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(
      "[Proxy] Upstream response failed mid-body",
      expect.objectContaining({
        requestId: "fixture-partial-response",
        status: 200,
      }),
    );
  } finally {
    server.close();
  }
});

it("reports renderer health on both readiness paths", async () => {
  let ready = false;
  const db = new AbortController();
  const ctx = {
    nextPort,
    logger,
    databaseReadiness: (): Promise<AbortSignal> => Promise.resolve(db.signal),
    isRendererReady: (): boolean => ready,
    isShuttingDown: (): boolean => false,
  };
  for (const path of ["/robots.txt", "/_ha/ready"]) {
    const req = new Request(`http://localhost${path}`);
    ready = false;
    const unavailable = await handleHttpProxy(req, ctx);
    expect(unavailable.status).toBe(503);
    expect(unavailable.headers.get("x-ha-readiness")).toBe(
      "v1-renderer-unavailable",
    );
    ready = true;
    const restored = await handleHttpProxy(req, ctx);
    expect(restored.status).toBe(200);
    await restored.text();
  }
});

it("returns localized HTML for failed admin document navigation and preserves API and data reads", async () => {
  const origin = "http://127.0.0.1:3000";
  const ctx = {nextPort, logger, isShuttingDown: () => false};
  for (const method of ["GET", "HEAD"]) {
    const response = await handleHttpProxy(new Request(origin + "/sk-SK/tools/tax-report", {
      method, headers: { accept: "text/html" },
    }), ctx);
    expect(response.status).toBe(500);
    expect(response.headers.get("Content-Type")).toContain("text/html");
    expect(response.headers.get("Content-Disposition")).toBeNull();
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("Retry-After")).toBe("5");
    expect(response.headers.getSetCookie()).toEqual(["fixture=1"]);
    const body = await response.text();
    if (method === "HEAD") {
      expect(body).toBe("");
    } else {
      expect(body).toContain('lang="sk"');
      expect(body).toContain("Znova načítať stránku");
      expect(body).not.toContain("internal diagnostic");
    }
  }
  for (const [path, accept] of [["/sk-SK/tools/tax-report","application/json"],["/api/en-US/failing","text/html"]]) {
    const response = await handleHttpProxy(new Request(origin + path, { headers: { accept } }), ctx);
    expect(response.status).toBe(500);
    expect(response.headers.get("Content-Type")).toContain("application/json");
  }
});

it("provides the same admin recovery page when proxy admission fails before reaching the renderer", async () => {
  const response = await handleHttpProxy(new Request("http://localhost/de-DE/tools", {headers: {accept: "text/html"}}), {
    nextPort, logger, isShuttingDown: () => false, databaseReadiness: () => Promise.resolve(AbortSignal.abort()),
  });
  expect(response.status).toBe(503);
  expect(response.headers.get("retry-after")).toBe("1");
  expect(response.headers.get("content-type")).toContain("text/html");
  expect(await response.text()).toContain('lang="de"');
});
