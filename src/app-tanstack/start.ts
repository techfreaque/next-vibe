/**
 * TanStack Start global configuration.
 *
 * Integrates src/proxy.ts (Next.js middleware) as a TanStack request middleware
 * so that locale detection, lead tracking, CSRF stamping, and cookie management
 * run on every server request — matching the Next.js edge middleware behaviour.
 */

import { createMiddleware, createStart } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { NextRequest } from "next/server";

const proxyMiddleware = createMiddleware().server(async ({ next, request }) => {
  const { proxy, config } = await import("@/proxy");

  const path = new URL(request.url).pathname;

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
      return regex.test(path);
    } catch {
      return true; // If regex fails, run middleware
    }
  });

  if (!shouldRun) {
    return next();
  }

  // Build a bodyless NextRequest for the proxy (it only needs URL + headers/cookies).
  // Do NOT pass the original request body — Bun transfers body ownership when passing
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

  return next();
});

export const startInstance = createStart(() => ({
  requestMiddleware: [proxyMiddleware],
}));
