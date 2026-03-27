/**
 * TanStack Start global configuration.
 *
 * Integrates src/proxy.ts (Next.js middleware) as a TanStack request middleware
 * so that locale detection, lead tracking, CSRF stamping, and cookie management
 * run on every server request - matching the Next.js edge middleware behaviour.
 */

import { createMiddleware, createStart } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { NextRequest } from "next/server";

// ANSI helpers (inline - avoid importing heavy logger chain at middleware level)
const C = {
  reset: "\u001B[0m",
  bold: "\u001B[1m",
  gray: "\u001B[90m",
  green: "\u001B[32m",
  yellow: "\u001B[33m",
  red: "\u001B[31m",
  cyan: "\u001B[96m",
} as const;

function statusColor(status: number): string {
  if (status < 300) {
    return C.green;
  }
  if (status < 400) {
    return C.yellow;
  }
  return C.red;
}

function formatMs(ms: number): string {
  const useColors = Boolean(process.stdout?.isTTY) && !process.env.NO_COLOR;
  const s = ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
  return useColors ? `${C.gray}${s}${C.reset}` : s;
}

function logRequest(
  method: string,
  path: string,
  status: number,
  totalMs: number,
  appMs: number,
): void {
  const useColors = Boolean(process.stdout?.isTTY) && !process.env.NO_COLOR;
  const ts = `[${process.uptime().toFixed(3)}s]`;
  const sc = statusColor(status);
  const statusStr = useColors
    ? `${sc}${String(status)}${C.reset}`
    : String(status);
  const methodStr = useColors ? `${C.bold}${method}${C.reset}` : method;
  const pathStr = useColors ? `${C.cyan}${path}${C.reset}` : path;
  const line = `${ts} ${methodStr} ${pathStr} ${statusStr} in ${formatMs(totalMs)} (app: ${formatMs(appMs)})`;
  process.stdout.write(`${line}\n`);
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

const proxyMiddleware = createMiddleware().server(async ({ next, request }) => {
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

  const { proxy, config } = await import("@/proxy");

  // Check if this path matches the proxy matcher config
  const matcher = config.matcher;
  const shouldRun = matcher.some((pattern) => {
    if (pattern === "/") {
      return path === "/";
    }
    // Convert Next.js matcher pattern to a regex
    // Patterns like "/((?!_next/static|...).*)" are valid URL patterns
    try {
      const regex = new RegExp(
        `^${pattern.replace(/\(\?!/g, "(?!").replace(/\*/g, ".*")}$`,
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

  const appStart = Date.now();
  const result = await next();
  const total = Date.now() - requestStart;
  const app = Date.now() - appStart;
  logRequest(request.method, path, result.response.status, total, app);
  return result;
});

export const startInstance = createStart(() => ({
  requestMiddleware: [proxyMiddleware],
}));
