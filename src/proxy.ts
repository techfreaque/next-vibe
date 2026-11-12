/**
 * Next.js Middleware
 *
 * This file implements the middleware for the application.
 */

import type { NextRequest, NextResponse } from "next-vibe/ui/lib/request";
import { NextResponse as NextResponseClass } from "next-vibe/ui/lib/request";

import type { languageDefaults } from "./vibe/core/i18n";
import type { CountryLanguage } from "./vibe/core/i18n/core/config";
// we have to use relative paths as vercel cant resolve import aliases from here
import { middleware } from "./vibe/platforms/web/middleware";

const defaultLocale: `${typeof languageDefaults.language}-${typeof languageDefaults.country}` =
  "en-GLOBAL";

const supportedLocales: CountryLanguage[] = [
  "de-DE",
  "pl-PL",
  "en-GLOBAL",
  "en-US",
];

/**
 * Middleware implementation
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const response = await middleware(request, {
    supportedLocales,
    defaultLocale,
    allowMixedLocales: true,
  });

  // For passthrough responses (NextResponse.next(), not redirects/errors or a
  // final answer like the 204 CORS preflight), inject x-pathname so server
  // components can read the current pathname without URL hacks.
  if (response.headers.get("x-middleware-next") === "1") {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", request.nextUrl.pathname);
    const withPathname = NextResponseClass.next({
      request: { headers: requestHeaders },
    });
    if (typeof response.cookies?.getAll === "function") {
      response.cookies.getAll().forEach((cookie) => {
        withPathname.cookies.set(cookie);
      });
    } else {
      // TanStack/Bun: response.cookies is not a Next.js RequestCookies instance.
      // Copy Set-Cookie headers manually via the standard Headers API.
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() === "set-cookie") {
          withPathname.headers.append("set-cookie", value);
        }
      });
    }
    response.headers.forEach((value, key) => {
      if (key !== "set-cookie") {
        withPathname.headers.set(key, value);
      }
    });
    return withPathname;
  }

  return response;
}

/**
 * Middleware configuration
 */
export const config = {
  matcher: [
    // Match all paths except static files and specific API routes.
    // Every bare-root file in public/ MUST be listed here: middleware runs
    // before public/ serving and 404s bare-root paths with an extension, so an
    // unlisted public file (was: logo.png, og-image.jpg — the OG image and
    // structured-data logo) is unreachable.
    "/",
    "/((?!_next/static|_next/image|image|images|favicon\\.ico|favicon\\.png|favicon\\.svg|logo\\.png|og-image\\.jpg|robots\\.txt|sitemap\\.xml|vibe-frame|api/[^/]+/manifest|_serverFn).*)",
  ],
};
