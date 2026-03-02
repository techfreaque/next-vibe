/**
 * Vibe Frame Mount — Route
 *
 * Custom GET handler returns raw HTML for iframe embedding.
 * The `tools` export uses standard endpointsHandler for CLI/MCP/cron.
 */

import "server-only";

import type { NextRequest } from "next/server";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { CountryLanguage } from "@/i18n/core/config";

import definitions from "./definition";
import { VibeFrameMountRepository } from "./repository";

/**
 * GET handler that returns raw HTML for iframe src usage.
 * Uses AuthRepository to resolve the user from cookies (same as standard handler).
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ locale: string }> },
): Promise<Response> {
  const { locale } = await context.params;
  const typedLocale = locale as CountryLanguage;
  const url = new URL(request.url);

  // Extract query params
  const endpoint = url.searchParams.get("endpoint") ?? "";
  const frameId = url.searchParams.get("frameId") ?? "";
  const urlPathParams = url.searchParams.get("urlPathParams") ?? undefined;
  const data = url.searchParams.get("data") ?? undefined;
  const themeParam = url.searchParams.get("theme") ?? undefined;
  const authToken = url.searchParams.get("authToken") ?? undefined;

  if (!endpoint) {
    return new Response(
      "<html><body><div class='vf-error'>Missing endpoint parameter</div></body></html>",
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const logger = createEndpointLogger(true, Date.now(), typedLocale);

  // Resolve user from cookies/session (creates lead if needed)
  const user = await AuthRepository.getAuthMinimalUser(
    definitions.GET.allowedRoles,
    { platform: Platform.NEXT_API, locale: typedLocale, request },
    logger,
  );

  if (!user) {
    return new Response(
      "<html><body><div class='vf-error'>Authentication failed</div></body></html>",
      { status: 401, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  // Validate theme (default to "system")
  const theme =
    themeParam === "light" || themeParam === "dark" || themeParam === "system"
      ? themeParam
      : ("system" as const);

  const result = await VibeFrameMountRepository.mount({
    data: { endpoint, frameId, urlPathParams, data, theme, authToken },
    user,
    locale: typedLocale,
    logger,
  });

  if (!result.success) {
    return new Response(
      `<html><body><div class="vf-error">${result.message}</div></body></html>`,
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  return new Response(result.data.html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Frame-Options": "ALLOWALL",
      "Content-Security-Policy": "frame-ancestors *",
    },
  });
}

/**
 * Standard tools export for CLI/MCP/cron compatibility
 */
export const { tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) => {
      return VibeFrameMountRepository.mount({ data, user, locale, logger });
    },
  },
});
