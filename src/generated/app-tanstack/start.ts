/**
 * TanStack Start global configuration.
 *
 * Integrates src/proxy.ts (Next.js middleware) as a TanStack request middleware
 * so that locale detection, lead tracking, CSRF stamping, and cookie management
 * run on every server request - matching the Next.js edge middleware behaviour.
 */

import { isNotFound, isRedirect } from "@tanstack/react-router";
import {
  createCsrfMiddleware,
  createMiddleware,
  createStart,
} from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { NextRequest } from "next/server";
import { shouldUseColors } from "next-vibe/logger/colors";
import { formatSinceStart } from "next-vibe/logger/uptime";
import { serverFileLog } from "next-vibe/logger/file";
import { preloadAllLazyWidgets } from "next-vibe/unified-ui/_shared/lazy-widget";

// ANSI helpers (inline - avoid importing heavy logger chain at middleware level)
const C = {
  reset: "\u001B[0m",
  bold: "\u001B[1m",
  dim: "\u001B[2m",
  white: "\u001B[97m",
  // Timestamp white matches semantic.highlight used by every other log line.
  timeWhite: "\u001B[37m",
  green: "\u001B[32m",
  yellow: "\u001B[33m",
  red: "\u001B[31m",
  cyan: "\u001B[36m",
  // HTTP request lines share the web-server colour (semantic.webServer === semantic.nextjs, brightCyan).
  blue: "\u001B[96m",
} as const;

function formatMs(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

/** Status colour by class: 2xx green, 3xx cyan, 4xx yellow, 5xx red. */
function statusColor(status: number): string {
  if (status >= 500) {
    return C.red;
  }
  if (status >= 400) {
    return C.yellow;
  }
  if (status >= 300) {
    return C.cyan;
  }
  return C.green;
}

function logRequest(
  method: string,
  path: string,
  status: number,
  totalMs: number,
  appMs: number,
): void {
  const useColors = shouldUseColors();
  const ts = `[${formatSinceStart()}]`;
  const total = formatMs(totalMs);
  const app = `(app: ${formatMs(appMs)})`;
  const statusStr = String(status);
  const plain = `${ts} ${method} ${path} ${statusStr} in ${total} ${app}`;
  if (useColors) {
    // [time] white · method+path web cyan · status by class · "in" + (app) dim · total bold white
    process.stdout.write(
      `${C.timeWhite}${ts}${C.reset} ${C.blue}${method} ${path}${C.reset} ${statusColor(status)}${statusStr}${C.reset} ${C.dim}in${C.reset} ${C.white}${C.bold}${total}${C.reset} ${C.dim}${app}${C.reset}\n`,
    );
  } else {
    process.stdout.write(`${plain}\n`);
  }
  void serverFileLog(plain);
}

/**
 * Decode a /_serverFn/<base64> path into a readable label.
 * The base64 segment is a JSON object with `file` and `export` keys.
 * e.g. { file: ".../$locale.threads.index.tsx?...", export: "loadData_createServerFn_handler" }
 * → "/_serverFn/threads.index → loadData"
 */
function decodeServerFnPath(pathname: string): string {
  if (!pathname.startsWith("/_serverFn/")) {
    return pathname;
  }
  try {
    const encoded = pathname.slice("/_serverFn/".length);
    const json = Buffer.from(encoded, "base64").toString("utf8");
    const parsed = JSON.parse(json) as { file?: string; export?: string };
    // Extract route name from file path (last segment before ?tss-...)
    const fileSegment = (parsed.file ?? "").split("?")[0];
    const routeName = fileSegment.split("/").pop() ?? fileSegment;
    // Strip leading $locale. and trailing .tsx
    const cleanRoute = routeName
      .replace(/^\$locale\./, "")
      .replace(/\.tsx?$/, "");
    // Simplify the export name: strip _createServerFn_handler suffix
    const exportName = (parsed.export ?? "")
      .replace(/_createServerFn_handler$/, "")
      .replace(/_handler$/, "");
    return `/_serverFn/${cleanRoute} → ${exportName}`;
  } catch {
    return pathname;
  }
}

// Paths to skip logging (Vite internals, HMR, source maps, favicons)
const SKIP_LOG_PREFIXES = [
  "/@",
  "/__vite",
  "/_build",
  "/node_modules",
  "/favicon",
];
const SKIP_LOG_EXTENSIONS = [
  ".map",
  ".ico",
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".woff",
  ".woff2",
  ".ttf",
];

function shouldSkipLog(pathname: string): boolean {
  if (SKIP_LOG_PREFIXES.some((p) => pathname.startsWith(p))) {
    return true;
  }
  if (SKIP_LOG_EXTENSIONS.some((e) => pathname.endsWith(e))) {
    return true;
  }
  return false;
}

// Resolves once widgets are preloaded. Reset on HMR to pick up new factories.
let _widgetPreloadDone = false;

// srvx attaches the underlying Bun server to every request. Bun.serve kills
// requests idle for 10s by default (its idleTimeout), which killed cold SSR
// renders mid-stream; per-request timeout(request, 255) lifts that to the
// uWS max — the same mechanism the WS proxy uses (realtime/server.ts).
interface BunRuntimeRequest {
  runtime?: {
    bun?: {
      server?: { timeout: (request: Request, seconds: number) => void };
    };
  };
}

const proxyMiddleware = createMiddleware().server(async ({ next, request }) => {
  try {
    (request as Request & BunRuntimeRequest).runtime?.bun?.server?.timeout(
      request,
      255,
    );
  } catch {
    /* non-Bun runtime or srvx API change — the Bun.serve idleTimeout patch
       in vite-compiler still provides the server-wide default */
  }
  // Preload all lazy widgets before the first SSR render. By the time this
  // middleware runs, all route modules that call lazyWidget() have been
  // evaluated and registered their factories. Awaiting here ensures the first
  // SSR render never suspends on a cold Vite dynamic import.
  if (!_widgetPreloadDone) {
    _widgetPreloadDone = true;
    await preloadAllLazyWidgets();
  }
  const requestStart = Date.now();
  const url = new URL(request.url);
  const rawPath = `${url.pathname}${url.search ? url.search : ""}`;
  // Use a human-readable label for /_serverFn/ requests; otherwise the full path
  const path = url.pathname.startsWith("/_serverFn/")
    ? decodeServerFnPath(url.pathname)
    : rawPath;

  // Skip logging for Vite internals and static assets
  if (shouldSkipLog(url.pathname)) {
    return next();
  }

  const { proxy, config } = await import("../../proxy");

  // Check if this path matches the proxy matcher config
  const matcher = config.matcher;
  const shouldRun = matcher.some((pattern: string) => {
    if (pattern === "/") {
      return path === "/";
    }
    // Convert Next.js matcher pattern to a regex
    // Patterns like "/((?!_next/static|...).*)" are valid URL patterns
    try {
      const regex = new RegExp(
        `^${pattern.replaceAll(/\(\?!/g, "(?!").replaceAll(/\*/g, ".*")}$`,
      );
      return regex.test(url.pathname);
    } catch {
      return true; // If regex fails, run middleware
    }
  });

  if (!shouldRun) {
    const appStart = Date.now();
    const result = await next();
    const total = Date.now() - requestStart;
    const app = Date.now() - appStart;
    logRequest(request.method, path, result.response.status, total, app);
    return result;
  }

  // Build a bodyless NextRequest for the proxy (it only needs URL + headers/cookies).
  // Do NOT pass the original request body - Bun transfers body ownership when passing
  // a Request to new Request(), leaving downstream handlers with an empty stream.
  const nextRequest = new NextRequest(
    new Request(request.url, {
      headers: request.headers,
      method: request.method,
    }),
  );
  const proxyResponse = await proxy(nextRequest);

  // If the proxy returned a redirect or error (non-2xx), short-circuit
  if (proxyResponse.status !== 200) {
    const total = Date.now() - requestStart;
    logRequest(request.method, path, proxyResponse.status, total, 0);
    return proxyResponse;
  }

  // Forward Set-Cookie headers from the proxy response onto the TanStack
  // response via the H3 event (the only reliable way in TanStack middleware).
  const setCookies =
    proxyResponse.headers.getSetCookie?.() ??
    (proxyResponse.headers.get("Set-Cookie")
      ? [proxyResponse.headers.get("Set-Cookie")!]
      : []);

  if (setCookies.length > 0) {
    // Pass array so h3 appends each cookie (not overwrites)
    setResponseHeader("Set-Cookie", setCookies);
  }

  // CORS headers the proxy stamped on API passthroughs (Next.js merges these
  // onto the final response; TanStack needs them forwarded explicitly).
  proxyResponse.headers.forEach((value, key) => {
    if (key.toLowerCase().startsWith("access-control-")) {
      setResponseHeader(key, value);
    }
  });

  const appStart = Date.now();
  const result = await next();
  const total = Date.now() - requestStart;
  const app = Date.now() - appStart;
  logRequest(request.method, path, result.response.status, total, app);
  return result;
});

// Server-function errors (every generated page/layout loader runs through
// createServerFn) surface only as the route's error boundary — during SSR
// that meant a failing loader rendered as a completely SILENT 500: no log
// line at all, and the router's defaultOnCatch only sees RENDER errors.
// Log and rethrow. notFound()/redirect() are router control flow, not
// failures — pass them through quietly.
const fnErrorLogMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    try {
      return await next();
    } catch (error) {
      if (!isRedirect(error) && !isNotFound(error)) {
        const text =
          error instanceof Error
            ? (error.stack ?? `${error.name}: ${error.message}`)
            : JSON.stringify(error);
        process.stderr.write(`[SSR loader error] ${text}\n`);
      }
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- middleware must rethrow so the router's error handling still runs
      throw error;
    }
  },
);

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [proxyMiddleware, csrfMiddleware],
  functionMiddleware: [fnErrorLogMiddleware],
}));
