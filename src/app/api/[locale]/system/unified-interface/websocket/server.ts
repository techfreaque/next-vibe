/**
 * WebSocket + HTTP Proxy Server
 *
 * Single Bun.serve() on the main port that:
 *   1. Handles WebSocket upgrades at /ws in-process (no sidecar)
 *   2. Proxies all other HTTP traffic to Next.js on an internal port (main + 1)
 *
 * Architecture:
 *   Browser → Bun proxy (port 3000/3001) for HTTP + WS
 *   Bun proxy → Next.js (port 3001/3002, internal) for HTTP
 *
 * Auth uses httpOnly cookies (token + lead_id), sent automatically
 * because cookies are scoped by domain+path, not port.
 *
 * NOTE: This file runs only in Bun CLI context (dynamically imported
 * from dev/repository.ts and start/repository.ts).
 */

/// <reference types="bun-types" />

import http from "node:http";

import type { ServerWebSocket } from "bun";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  AUTH_TOKEN_COOKIE_NAME,
  LEAD_ID_COOKIE_NAME,
} from "@/config/constants";

import type { PubSubAdapter } from "./pubsub/types";
import type { WsClientMessage, WsConnectionData, WsWireMessage } from "./types";

/** Type for the lazy-required pubsub module to avoid inline import() annotations */
interface PubSubModule {
  getPubSubAdapter: () => PubSubAdapter;
}

// ============================================================================
// CHANNEL REGISTRY (singleton)
// ============================================================================

/** All active /ws connections, keyed by channel → set of sockets */
const channels = new Map<string, Set<ServerWebSocket<WsConnectionData>>>();

/** Global sequence counter for event ordering */
let globalSeq = 0;

/** Set to true during shutdown to suppress expected proxy errors */
let shuttingDown = false;

/**
 * Broadcast an event to LOCAL subscribers of a channel (this process only).
 * Called directly by the emitter (same process - no HTTP POST needed).
 */
export function broadcastLocal(
  channel: string,
  event: string,
  data: WsWireMessage["data"],
): void {
  const subscribers = channels.get(channel);
  if (!subscribers || subscribers.size === 0) {
    return;
  }

  globalSeq++;
  const message: WsWireMessage = {
    channel,
    event,
    data,
    seq: globalSeq,
  };

  const payload = JSON.stringify(message);
  for (const ws of subscribers) {
    try {
      ws.send(payload);
    } catch {
      // Socket may be closing - silently skip
    }
  }
}

/**
 * Publish an event through the pub/sub adapter.
 * NOTE: Route handlers should use createEmitter() from emitter.ts instead.
 */
export function publish(
  channel: string,
  event: string,
  data: WsWireMessage["data"],
): void {
  // Lazy import to avoid circular dependency at module load time
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getPubSubAdapter } = require("./pubsub") as PubSubModule;
  getPubSubAdapter().publish(channel, event, data);
}

/**
 * Get the number of active connections on a channel.
 */
export function getChannelSize(channel: string): number {
  return channels.get(channel)?.size ?? 0;
}

// ============================================================================
// CONNECTION MANAGEMENT
// ============================================================================

function subscribeToChannel(
  ws: ServerWebSocket<WsConnectionData>,
  channel: string,
): void {
  let set = channels.get(channel);
  const isNewChannel = !set;
  if (!set) {
    set = new Set();
    channels.set(channel, set);
  }
  set.add(ws);
  ws.data.channels.add(channel);

  if (isNewChannel) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getPubSubAdapter } = require("./pubsub") as PubSubModule;
    getPubSubAdapter().subscribe(channel, (event, data) => {
      broadcastLocal(channel, event, data);
    });
  }
}

function unsubscribeFromChannel(
  ws: ServerWebSocket<WsConnectionData>,
  channel: string,
): void {
  const set = channels.get(channel);
  if (set) {
    set.delete(ws);
    if (set.size === 0) {
      channels.delete(channel);
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getPubSubAdapter } = require("./pubsub") as PubSubModule;
      getPubSubAdapter().unsubscribe(channel);
    }
  }
  ws.data.channels.delete(channel);
}

function unsubscribeFromAll(ws: ServerWebSocket<WsConnectionData>): void {
  for (const channel of ws.data.channels) {
    unsubscribeFromChannel(ws, channel);
  }
}

// ============================================================================
// AUTH
// ============================================================================

/** Parse a single cookie value from a Cookie header string */
function parseCookieValue(
  cookieHeader: string,
  name: string,
): string | undefined {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match?.[1];
}

/**
 * Verify JWT and extract userId + leadId from the connection request.
 *
 * Sources (checked in order):
 *   1. httpOnly cookies (browser clients)
 *   2. URL query params ?token=...&leadId=... (server-to-server, e.g. self-hosted relay)
 */
async function authenticateFromCookies(
  req: Request,
  logger: EndpointLogger,
): Promise<{ userId: string | null; leadId: string | null }> {
  const cookieHeader = req.headers.get("cookie") ?? "";

  const token = parseCookieValue(cookieHeader, AUTH_TOKEN_COOKIE_NAME);
  const leadId = parseCookieValue(cookieHeader, LEAD_ID_COOKIE_NAME) ?? null;

  if (!token) {
    return { userId: null, leadId };
  }

  try {
    const { AuthRepository } =
      await import("@/app/api/[locale]/user/auth/repository");
    const result = await AuthRepository.verifyJwt(token, logger, "en-US");

    if (result.success) {
      return { userId: result.data.id, leadId: result.data.leadId ?? leadId };
    }
  } catch {
    logger.debug("[WS] JWT verification failed during upgrade");
  }

  return { userId: null, leadId };
}

// ============================================================================
// SERVER FACTORY
// ============================================================================

/** Extended connection data for proxied WS connections (e.g. Next.js HMR) */
interface WsConnectionDataWithProxy extends WsConnectionData {
  proxyWs?: WebSocket;
}

/**
 * Next.js runs on this offset above the main port (internal only).
 * Main port 3000 → Next.js on 3100 (internal, vibe dev)
 * Main port 3001 → Next.js on 3101 (internal, vibe start)
 * Large offset avoids collision between dev and start running simultaneously.
 */
export const NEXT_PORT_OFFSET = 100;

export interface WebSocketServerOptions {
  /** Main public-facing port */
  port: number;
  logger: EndpointLogger;
  /** Optional hostname (default: "0.0.0.0") */
  hostname?: string;
}

export interface WebSocketServerHandle {
  /** Stop the Bun server */
  stop: () => void;
  /** Internal Next.js port (main port + NEXT_PORT_OFFSET) */
  nextPort: number;
}

/**
 * Start the Bun proxy + WebSocket server on the main port.
 * WebSocket upgrades to /ws are handled in-process.
 * All other requests are proxied to Next.js on port + NEXT_PORT_OFFSET.
 *
 * IMPORTANT: This function must only be called in Bun runtime context.
 */
export function startWebSocketServer(
  options: WebSocketServerOptions,
): WebSocketServerHandle {
  // Default to "::" which binds both IPv4 and IPv6 on Linux
  // so Chrome's localhost→[::1] resolution works alongside IPv4 curl/fetch.
  const { port, logger, hostname = "::" } = options;
  const nextPort = port + NEXT_PORT_OFFSET;

  const server = Bun.serve<WsConnectionDataWithProxy>({
    port,
    hostname,
    reusePort: true, // allow re-binding after restart without waiting for TIME_WAIT
    // Use max value (255s) instead of 0 - Bun 1.3.x ignores idleTimeout: 0
    // and falls back to the 10s uWS default, killing slow SSR cold-starts.
    // 255s covers even the slowest first-load (full dep pre-bundle ~30-60s).
    idleTimeout: 255,

    async fetch(req, bunServer): Promise<Response> {
      // Also disable per-request idle timeout (belt-and-suspenders).
      // On Bun versions where server.timeout(req, 0) works, this overrides
      // the server-level 255s back to infinite for long-lived SSE streams.
      bunServer.timeout(req, 0);

      const url = new URL(req.url);

      // ── Internal broadcast endpoint - called by Next.js to emit WS events ──
      // Next.js runs in a separate process and can't call broadcastLocal() directly,
      // so it POSTs here and the proxy calls broadcastLocal() in-process.
      if (url.pathname === "/ws/broadcast" && req.method === "POST") {
        try {
          const body = (await req.json()) as {
            channel: string;
            event: string;
            data: WsWireMessage["data"];
          };
          broadcastLocal(body.channel, body.event, body.data);
          return new Response("ok", { status: 200 });
        } catch {
          return new Response("Bad Request", { status: 400 });
        }
      }

      // ── Proxy non-/ws WebSocket upgrades to internal Next.js (e.g. HMR) ──
      if (
        url.pathname !== "/ws" &&
        req.headers.get("upgrade")?.toLowerCase() === "websocket"
      ) {
        const targetUrl = `ws://127.0.0.1:${String(nextPort)}${url.pathname}${url.search}`;
        // Open upstream WS connection, then upgrade the browser connection.
        // Messages are bridged in the websocket handlers below.
        // Forward the subprotocol (e.g. "vite-hmr") so Vite accepts the connection.
        const subprotocol =
          req.headers.get("sec-websocket-protocol") ?? undefined;
        const upstream = new WebSocket(
          targetUrl,
          subprotocol ? [subprotocol] : undefined,
        );
        const upgraded = bunServer.upgrade(req, {
          data: {
            userId: null,
            leadId: "__proxy__",
            channels: new Set<string>(),
            connectedAt: Date.now(),
            proxyWs: upstream,
          } satisfies WsConnectionDataWithProxy,
        });
        if (!upgraded) {
          upstream.close();
          return new Response("WebSocket upgrade failed", { status: 426 });
        }
        return new Response(null, { status: 101 });
      }

      // ── WebSocket upgrade at /ws ──────────────────────────────────────────
      if (
        url.pathname === "/ws" &&
        req.headers.get("upgrade")?.toLowerCase() === "websocket"
      ) {
        const channel = url.searchParams.get("channel");

        const { userId, leadId } = await authenticateFromCookies(req, logger);

        if (!leadId) {
          logger.warn("[WS] Rejected upgrade - missing lead_id cookie");
          return new Response("Missing lead_id cookie", { status: 401 });
        }

        const upgraded = bunServer.upgrade(req, {
          data: {
            userId,
            leadId,
            channels: new Set(channel ? [channel] : []),
            connectedAt: Date.now(),
          },
        });

        if (!upgraded) {
          return new Response("WebSocket upgrade failed", { status: 426 });
        }

        // Unreachable after successful upgrade
        return new Response(null, { status: 101 });
      }

      // ── Proxy everything else to Next.js ─────────────────────────────────
      // Use a raw Node http pipe instead of fetch() - Bun's fetch auto-decompresses
      // responses which breaks streaming SSR and compressed assets.
      // On ECONNREFUSED (Next.js restarting), retry with backoff so the browser
      // gets a real response once Next.js recovers instead of a hard 502.
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
      // Forward the original public host so Nitro builds redirect URLs using
      // the proxy port (e.g. 3000) rather than the internal Vite port (3100).
      outHeaders["x-forwarded-host"] = req.headers.get("host") ?? url.host;

      // Read body once before retry loop (body can only be consumed once)
      const bodyBuffer =
        req.body && req.method !== "GET" && req.method !== "HEAD"
          ? Buffer.from(await req.arrayBuffer())
          : null;

      const PROXY_RETRY_DELAYS = [500, 1000, 2000, 4000, 8000];
      // Timeout for a single proxy attempt. Vite can take 30-60s on cold start
      // for the first SSR render (full dep pre-bundle + module evaluation).
      // If it takes longer than this, something is genuinely stuck - return 504.
      const PROXY_REQUEST_TIMEOUT_MS = 90_000;
      let lastProxyError = "Unknown error";
      const proxyStartMs = Date.now();

      for (let attempt = 0; attempt <= PROXY_RETRY_DELAYS.length; attempt++) {
        const proxyResult = await new Promise<Response | null>((resolve) => {
          let settled = false;
          // settle() wraps resolve() with a guard so the timeout and the
          // normal response path can't both resolve the Promise.
          const settle = (result: Response | null): void => {
            if (settled) {
              return;
            }
            settled = true;
            clearTimeout(timeoutHandle);
            // eslint-disable-next-line promise/no-multiple-resolved
            resolve(result);
          };
          const timeoutHandle = setTimeout(() => {
            proxyReq.destroy(new Error("upstream timeout"));
            settle(
              new Response(
                "Gateway Timeout: Vite dev server is not responding",
                { status: 504 },
              ),
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
              // Use Headers so Set-Cookie entries are appended individually
              // (joining multiple Set-Cookie with ", " breaks them)
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

              // Stream the raw (possibly compressed) body straight to the browser
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
            const isConnRefused =
              (err as NodeJS.ErrnoException).code === "ECONNREFUSED";
            // On ECONNREFUSED while running - signal retry via null.
            // While shutting down - return 502 immediately, no retry.
            if (isConnRefused && !shuttingDown) {
              lastProxyError = err.message;
              settle(null); // null = retry
              return;
            }
            if (!shuttingDown) {
              logger.error("[Proxy] Server unreachable", {
                error: err.message,
                path: url.pathname,
              });
            }
            settle(new Response("Bad Gateway", { status: 502 }));
          });

          // Write buffered body
          if (bodyBuffer) {
            proxyReq.write(bodyBuffer);
          }
          proxyReq.end();
        });

        if (proxyResult !== null) {
          return proxyResult;
        }

        // Next.js not ready yet - wait before retrying (skip delay if shutting down)
        if (shuttingDown) {
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
          lastError: lastProxyError,
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
        lastError: lastProxyError,
        uptime: Math.floor(process.uptime()),
        heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
        rssMb: Math.round(mem.rss / 1024 / 1024),
        targetPort: nextPort,
      });
      const errorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Back in a moment</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    :root{--bg:#080808;--surface:#111;--border:#1e1e1e;--border-bright:#2a2a2a;--text:#f0f0f0;--muted:#555;--subtle:#333;--accent:#6366f1;--accent-dim:#4f46e5}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;gap:0}

    /* Ambient glow */
    .glow{position:fixed;top:-200px;left:50%;transform:translateX(-50%);width:600px;height:400px;background:radial-gradient(ellipse,rgba(99,102,241,.07) 0%,transparent 70%);pointer-events:none}

    .card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:52px 44px 44px;max-width:460px;width:100%;text-align:center;position:relative;overflow:hidden}
    .card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(99,102,241,.04) 0%,transparent 60%);pointer-events:none}

    /* Spinner ring */
    .spinner-wrap{position:relative;width:72px;height:72px;margin:0 auto 32px}
    .spinner-ring{width:72px;height:72px;border-radius:50%;border:2px solid var(--border-bright);border-top-color:var(--accent);animation:spin 1.1s cubic-bezier(.6,.2,.4,.8) infinite;position:absolute;inset:0}
    .spinner-ring.slow{width:58px;height:58px;margin:7px;border-top-color:transparent;border-right-color:rgba(99,102,241,.35);animation-duration:2.2s;animation-direction:reverse}
    @keyframes spin{to{transform:rotate(360deg)}}
    .spinner-dot{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
    .spinner-dot::after{content:'';width:8px;height:8px;border-radius:50%;background:var(--accent);opacity:.7;animation:pulse 1.1s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:.4;transform:scale(.85)}50%{opacity:1;transform:scale(1)}}

    .eyebrow{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:14px;opacity:.9}
    h1{font-size:24px;font-weight:700;color:var(--text);margin-bottom:12px;line-height:1.25;letter-spacing:-.02em}
    .subtext{font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:32px;max-width:320px;margin-left:auto;margin-right:auto}

    /* Status bar */
    .status-bar{background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:14px 18px;margin-bottom:28px;display:flex;align-items:center;gap:12px;text-align:left}
    .status-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;flex-shrink:0;animation:statusPulse 2s ease-in-out infinite}
    @keyframes statusPulse{0%,100%{opacity:.4}50%{opacity:1;box-shadow:0 0 6px #22c55e}}
    .status-dot.warn{background:#f59e0b;animation:statusPulse 1.5s ease-in-out infinite}
    @keyframes statusPulse{0%,100%{opacity:.5}50%{opacity:1}}
    .status-text{font-size:13px;color:var(--muted);flex:1}
    .status-text strong{color:rgba(240,240,240,.75);font-weight:500}
    .status-timer{font-size:12px;color:var(--subtle);font-variant-numeric:tabular-nums;font-family:ui-monospace,monospace}

    /* Progress bar */
    .progress-wrap{height:2px;background:var(--border);border-radius:99px;margin-bottom:24px;overflow:hidden}
    .progress-bar{height:100%;background:linear-gradient(90deg,var(--accent-dim),var(--accent));border-radius:99px;width:0%;transition:width .9s linear}

    /* Button */
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:var(--text);color:#000;border:none;border-radius:10px;padding:12px 26px;font-size:14px;font-weight:600;cursor:pointer;transition:opacity .15s,transform .1s;width:100%}
    .btn:hover:not(:disabled){opacity:.88;transform:translateY(-1px)}
    .btn:active:not(:disabled){transform:translateY(0)}
    .btn:disabled{opacity:.35;cursor:not-allowed;background:var(--subtle);color:var(--muted)}
    .btn-spinner{width:14px;height:14px;border:2px solid rgba(0,0,0,.2);border-top-color:#000;border-radius:50%;animation:spin .7s linear infinite;display:none}
    .btn.loading .btn-spinner{display:block}
    .btn.loading .btn-label{opacity:.7}

    .footer-note{font-size:12px;color:#2e2e2e;margin-top:20px;line-height:1.6}
  </style>
</head>
<body>
  <div class="glow"></div>
  <div class="card">
    <div class="spinner-wrap">
      <div class="spinner-ring"></div>
      <div class="spinner-ring slow"></div>
      <div class="spinner-dot"></div>
    </div>

    <div class="eyebrow">System Status</div>
    <h1>Back in a moment</h1>
    <p class="subtext">The server is catching its breath — either waking up after an update or recovering from high load. It'll be right back.</p>

    <div class="status-bar">
      <div class="status-dot warn" id="sdot"></div>
      <div class="status-text"><strong id="stext">Checking server&hellip;</strong><br><span id="sdesc">Auto-retry in progress</span></div>
      <div class="status-timer" id="stimer">0:15</div>
    </div>

    <div class="progress-wrap">
      <div class="progress-bar" id="prog"></div>
    </div>

    <button class="btn" id="btn" onclick="manualReload()">
      <div class="btn-spinner"></div>
      <span class="btn-label">Try now</span>
    </button>
  </div>
  <div class="footer-note">unbottled.ai &mdash; if this persists, try refreshing manually</div>

  <script>
    var TOTAL=20, elapsed=0, reloading=false;
    var messages=[
      ['Warming up…','Server process starting'],
      ['Almost there…','Loading application modules'],
      ['Hang tight…','Finalising startup'],
      ['Ready soon…','Waiting for health check'],
    ];

    function fmt(s){return'0:'+String(s).padStart(2,'0')}

    function setStatus(dot,title,desc){
      document.getElementById('sdot').className='status-dot'+(dot?' warn':'');
      document.getElementById('stext').textContent=title;
      document.getElementById('sdesc').textContent=desc;
    }

    function tick(){
      if(reloading)return;
      elapsed++;
      var remaining=TOTAL-elapsed;
      document.getElementById('stimer').textContent=fmt(Math.max(0,remaining));
      document.getElementById('prog').style.width=(elapsed/TOTAL*100)+'%';

      var mi=Math.min(Math.floor(elapsed/5),messages.length-1);
      setStatus(true,messages[mi][0],messages[mi][1]);

      if(remaining<=0){autoReload();return;}
      setTimeout(tick,1000);
    }

    function autoReload(){
      if(reloading)return;
      reloading=true;
      var btn=document.getElementById('btn');
      btn.disabled=true;
      btn.classList.add('loading');
      btn.querySelector('.btn-label').textContent='Connecting…';
      setStatus(false,'Reconnecting…','Attempting to reach the server');
      document.getElementById('stimer').textContent='';
      location.reload();
    }

    function manualReload(){
      if(reloading)return;
      reloading=true;
      var btn=document.getElementById('btn');
      btn.disabled=true;
      btn.classList.add('loading');
      btn.querySelector('.btn-label').textContent='Connecting…';
      setStatus(false,'Reconnecting…','Attempting to reach the server');
      document.getElementById('stimer').textContent='';
      location.reload();
    }

    window.onload=function(){setTimeout(tick,1000)};
  </script>
</body>
</html>`;
      return new Response(errorHtml, {
        status: 503,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "retry-after": "15",
          "cache-control": "no-store",
        },
      });
    },

    websocket: {
      open(ws): void {
        // Proxy connection - wire up upstream → browser bridging
        if (ws.data.proxyWs) {
          const upstream = ws.data.proxyWs;
          upstream.addEventListener("message", (event): void => {
            try {
              ws.send(
                typeof event.data === "string"
                  ? event.data
                  : (event.data as ArrayBuffer),
              );
            } catch {
              // Socket may be closing - silently skip
            }
          });
          upstream.addEventListener("close", (): void => {
            ws.close();
          });
          upstream.addEventListener("error", (): void => {
            ws.close();
          });
          return;
        }
        // Normal /ws connection - register initial channels from query param
        const initialChannels = [...ws.data.channels];
        // Clear first since subscribeToChannel() re-adds them
        ws.data.channels.clear();
        for (const channel of initialChannels) {
          subscribeToChannel(ws, channel);
        }
        logger.debug(
          `[WS] Connection opened (channels: ${initialChannels.join(", ") || "none"})`,
        );
      },

      async message(ws, raw): Promise<void> {
        // Proxy connection - forward browser → upstream
        if (ws.data.proxyWs) {
          try {
            ws.data.proxyWs.send(raw as string | ArrayBuffer);
          } catch {
            // Upstream socket may be closing - silently skip
          }
          return;
        }
        // Normal /ws connection
        try {
          const msg = JSON.parse(
            typeof raw === "string" ? raw : new TextDecoder().decode(raw),
          ) as WsClientMessage;

          if (msg.type === "subscribe") {
            subscribeToChannel(
              ws as ServerWebSocket<WsConnectionData>,
              msg.channel,
            );
            logger.debug(`[WS] Subscribed to ${msg.channel}`);
          } else if (msg.type === "unsubscribe") {
            unsubscribeFromChannel(
              ws as ServerWebSocket<WsConnectionData>,
              msg.channel,
            );
            logger.debug(`[WS] Unsubscribed from ${msg.channel}`);
          }
        } catch {
          logger.warn("[WS] Invalid message received");
        }
      },

      close(ws): void {
        // Proxy connection - close upstream
        if (ws.data.proxyWs) {
          ws.data.proxyWs.close();
          return;
        }
        unsubscribeFromAll(ws as ServerWebSocket<WsConnectionData>);
        logger.debug("[WS] Connection closed");
      },
    },
  });

  logger.debug(`[WS] Proxy server started on :${port}`);

  return {
    stop: (): void => {
      shuttingDown = true;
      server.stop(true);
    },
    nextPort,
  };
}
