/**
 * HTTP proxy to the internal Next.js server.
 *
 * The Bun server on the public port terminates WebSockets in-process (server.ts)
 * and proxies all other HTTP traffic here to Next.js on port + NEXT_PORT_OFFSET.
 *
 * Kept separate from the WS concern: this module knows nothing about sockets,
 * channels, or events — it is a pure reverse proxy with retry/backoff and
 * streaming, used by server.ts as the fallback when a request is not a WS concern.
 *
 * Uses a raw Node http pipe instead of fetch() — Bun's fetch auto-decompresses
 * responses, which breaks streaming SSR and compressed assets.
 *
 * NOTE: Bun runtime context only (imported from server.ts).
 */

/// <reference types="bun-types" />

import http from "node:http";

import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";

import { PROXY_LOADING_HTML } from "./proxy-loading-page";

// ─── Recent-request tracker (diagnoses Next.js crashes) ─────────────────────────

interface RecentRequest {
  method: string;
  path: string;
  ts: number;
}

/** Rolling log of the last N proxied requests — dumped on first ECONNREFUSED. */
const recentRequests: RecentRequest[] = [];
const RECENT_REQUESTS_MAX = 20;

function trackRequest(method: string, path: string): void {
  recentRequests.push({ method, path, ts: Date.now() });
  if (recentRequests.length > RECENT_REQUESTS_MAX) {
    recentRequests.shift();
  }
}

// Proxy timeout is always high — timeout enforcement belongs on the app server
// via the endpoint definition's timeoutMs, not here. The proxy must not cut off
// long-running requests (SSR cold-start, media gen, execute-tool) before the app
// server's own deadline fires.
const PROXY_REQUEST_TIMEOUT_MS = 600_000;

export interface HttpProxyContext {
  nextPort: number;
  logger: EndpointLogger;
  /** True once the server is stopping — suppresses retries and expected errors. */
  isShuttingDown: () => boolean;
}

/**
 * Proxy a non-WebSocket request to the internal Next.js server.
 *
 * Idempotent methods retry with backoff across an ECONNREFUSED window (Next.js
 * restarting); non-idempotent methods return 503 immediately so their bodies are
 * never buffered across a retry. Returns the (streamed) upstream response, or a
 * loading page once retries are exhausted.
 */
export async function handleHttpProxy(
  req: Request,
  ctx: HttpProxyContext,
): Promise<Response> {
  const { nextPort, logger, isShuttingDown } = ctx;
  const url = new URL(req.url);

  const clientIp =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "127.0.0.1";
  const outHeaders: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    outHeaders[key] = value;
  });
  outHeaders["host"] = `127.0.0.1:${String(nextPort)}`;
  outHeaders["x-forwarded-for"] = clientIp;
  outHeaders["x-forwarded-proto"] = url.protocol.replace(":", "");
  // Forward the original public host so Nitro builds redirect URLs using the
  // proxy port (e.g. 3000) rather than the internal Vite port (3100).
  outHeaders["x-forwarded-host"] = req.headers.get("host") ?? url.host;

  // Only idempotent methods get retry logic. Non-idempotent methods are proxied
  // fire-and-forget (no body buffering, no retry on ECONNREFUSED).
  const isIdempotent =
    req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS";
  const PROXY_RETRY_DELAYS = isIdempotent ? [500, 1000, 2000, 4000, 8000] : [];

  let lastProxyError = "Unknown error";
  const proxyStartMs = Date.now();
  trackRequest(req.method, url.pathname);

  // Bun's internal idle timeout can fire mid-stream and truncate the body before
  // all bytes reach the proxy. Buffer multipart (file uploads) and JSON bodies
  // (large sync payloads) upfront so Bun fully receives them before we open the
  // proxy connection. Safe for non-idempotent POSTs (no retry).
  let bufferedBody: Buffer | null = null;
  const contentType = req.headers.get("content-type") ?? "";
  const shouldBufferBody =
    contentType.includes("multipart/form-data") ||
    contentType.includes("application/json");
  if (!isIdempotent && shouldBufferBody && req.body) {
    try {
      bufferedBody = Buffer.from(await req.arrayBuffer());
    } catch {
      return new Response("Request body read failed", { status: 400 });
    }
  }

  for (let attempt = 0; attempt <= PROXY_RETRY_DELAYS.length; attempt++) {
    const proxyResult = await new Promise<Response | null>((resolve) => {
      let settled = false;
      // settle() wraps resolve() with a guard so the timeout and the normal
      // response path can't both resolve the Promise.
      const settle = (result: Response | null): void => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timeoutHandle);
        // oxlint-disable-next-line promise/no-multiple-resolved -- `settled` guard prevents double-resolve; static analysis can't track it
        resolve(result);
      };
      const timeoutHandle = setTimeout(() => {
        proxyReq.destroy(new Error("upstream timeout"));
        settle(
          new Response("Gateway Timeout: Vite dev server is not responding", {
            status: 504,
          }),
        );
      }, PROXY_REQUEST_TIMEOUT_MS);
      const proxyReq = http.request(
        {
          hostname: "127.0.0.1",
          port: nextPort,
          path: `${url.pathname}${url.search}`,
          method: req.method,
          headers: outHeaders,
        },
        (proxyRes) => {
          // Use Headers so Set-Cookie entries are appended individually (joining
          // multiple Set-Cookie with ", " breaks them).
          const resHeaders = new Headers();
          for (const [key, value] of Object.entries(proxyRes.headers)) {
            if (value === undefined) {
              continue;
            }
            if (Array.isArray(value)) {
              for (const v of value) {
                resHeaders.append(key, v);
              }
            } else {
              resHeaders.set(key, value);
            }
          }

          // Stream the raw (possibly compressed) body straight to the browser.
          const stream = new ReadableStream({
            start(controller): void {
              proxyRes.on("data", (chunk: Buffer) => {
                controller.enqueue(chunk);
              });
              proxyRes.on("end", () => {
                controller.close();
              });
              proxyRes.on("error", (err) => {
                controller.error(err);
              });
            },
          });

          settle(
            new Response(stream, {
              status: proxyRes.statusCode ?? 200,
              headers: resHeaders,
            }),
          );
        },
      );

      proxyReq.on("error", (err) => {
        const nodeErr = err as NodeJS.ErrnoException;
        const isConnRefused = nodeErr.code === "ECONNREFUSED";
        const shuttingDown = isShuttingDown();
        // On ECONNREFUSED while running — signal retry via null (idempotent only).
        // Non-idempotent methods and shutdown: return 502/503 immediately.
        if (isConnRefused && !shuttingDown && isIdempotent) {
          lastProxyError = nodeErr.code ?? err.message;
          // On first ECONNREFUSED, dump recent request history.
          if (attempt === 0) {
            logger.error(
              "[Proxy] Next.js went down - recent requests before crash",
              {
                path: url.pathname,
                method: req.method,
                recentRequests: recentRequests.map((r) => ({
                  method: r.method,
                  path: r.path,
                  agoMs: Date.now() - r.ts,
                })),
              },
            );
          }
          settle(null); // null = retry
          return;
        }
        if (isConnRefused && !shuttingDown && !isIdempotent) {
          // Non-idempotent method, server not ready — return 503 immediately so
          // the body is never buffered and the caller can retry on their own.
          settle(
            new Response("Service Unavailable", {
              status: 503,
              headers: { "retry-after": "5" },
            }),
          );
          return;
        }
        if (!shuttingDown) {
          logger.error("[Proxy] Server unreachable", {
            errorCode: nodeErr.code ?? "UNKNOWN",
            error: err.message,
            path: url.pathname,
            method: req.method,
            elapsedMs: Date.now() - proxyStartMs,
          });
        }
        settle(new Response("Bad Gateway", { status: 502 }));
      });

      // Send the request body upstream. Multipart and JSON bodies are
      // pre-buffered above to avoid Bun's idle timeout truncating large bodies
      // mid-stream. All other non-idempotent requests stream directly (no retry
      // means single-use is safe).
      if (bufferedBody !== null) {
        proxyReq.end(bufferedBody);
      } else if (req.body && !isIdempotent) {
        const reader = req.body.getReader();
        const pumpBody = (): void => {
          reader
            .read()
            .then(({ done, value }) => {
              if (done) {
                proxyReq.end();
                return undefined;
              }
              if (!proxyReq.write(value)) {
                // Backpressure: wait for drain before reading more.
                proxyReq.once("drain", pumpBody);
              } else {
                pumpBody();
              }
              return undefined;
            })
            .catch(() => {
              proxyReq.destroy();
            });
        };
        pumpBody();
      } else {
        proxyReq.end();
      }
    });

    if (proxyResult !== null) {
      return proxyResult;
    }

    // Next.js not ready yet — wait before retrying (skip delay if shutting down).
    if (isShuttingDown()) {
      break;
    }
    const delay = PROXY_RETRY_DELAYS[attempt] ?? 8000;
    const mem = process.memoryUsage();
    logger.warn("[Proxy] Server not ready, retrying", {
      path: url.pathname,
      method: req.method,
      attempt: attempt + 1,
      delayMs: delay,
      elapsedMs: Date.now() - proxyStartMs,
      lastErrorCode: lastProxyError,
      uptime: Math.floor(process.uptime()),
      heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
      rssMb: Math.round(mem.rss / 1024 / 1024),
      targetPort: nextPort,
    });
    await new Promise<void>((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  const mem = process.memoryUsage();
  logger.error("[Proxy] All retries exhausted - returning 502", {
    path: url.pathname,
    method: req.method,
    totalElapsedMs: Date.now() - proxyStartMs,
    lastErrorCode: lastProxyError,
    uptime: Math.floor(process.uptime()),
    heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
    rssMb: Math.round(mem.rss / 1024 / 1024),
    targetPort: nextPort,
  });
  // Loading page served when upstream Next.js is unreachable — see proxy-loading-page.ts
  return new Response(PROXY_LOADING_HTML, {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "retry-after": "15",
      "cache-control": "no-store",
    },
  });
}
