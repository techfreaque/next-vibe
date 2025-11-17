/**
 * Lead ID Middleware
 *
 * This middleware ensures that every visitor has a leadId cookie set.
 */

import type { NextRequest, NextResponse } from "next/server";
import { NextResponse as NextResponseClass } from "next/server";

import type { CountryLanguage } from "@/i18n/core/config";

import { LEAD_ID_COOKIE_NAME } from "@/config/constants";
import { env } from "@/config/env";
import { Environment } from "next-vibe/shared/utils";

import { isApiRoute, shouldSkipPath } from "../utils";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Check if leadId needs to be created
 * @param request The incoming request
 * @returns The existing valid leadId or null if a new one needs to be created
 */
export function checkLeadId(request: NextRequest): "skip" | null {
  const path = request.nextUrl.pathname;

  // Skip for API routes (they handle their own leadId logic)
  if (isApiRoute(path)) {
    return "skip";
  }

  // Skip for static files
  if (shouldSkipPath(path)) {
    return "skip";
  }

  // Check if leadId cookie exists and is valid
  const existingLeadId = request.cookies.get(LEAD_ID_COOKIE_NAME)?.value;

  if (existingLeadId && UUID_REGEX.test(existingLeadId)) {
    return "skip";
  }

  return null;
}

/**
 * Create a new leadId and set the cookie
 * @param request The incoming request
 * @param locale The locale for the request
 * @returns Response with leadId cookie set
 */
export async function createLeadId(
  request: NextRequest,
  locale: CountryLanguage,
): Promise<NextResponse> {
  // Import here to avoid circular dependencies
  const { leadAuthRepository } = await import(
    "@/app/api/[locale]/v1/core/leads/auth/repository"
  );
  const { createEndpointLogger } = await import(
    "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint"
  );

  const logger = createEndpointLogger(true, Date.now(), locale);

  const clientInfo = {
    userAgent: request.headers.get("user-agent") || undefined,
    referer: request.headers.get("referer") || undefined,
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      undefined,
  };

  const result = await leadAuthRepository.ensurePublicLeadId(
    undefined,
    clientInfo,
    locale,
    logger,
  );

  const response = NextResponseClass.next();

  if (!result.leadId) {
    logger.error("Failed to create leadId in middleware");
    return response;
  }

  // Set lead ID cookie
  response.cookies.set({
    name: LEAD_ID_COOKIE_NAME,
    value: result.leadId,
    httpOnly: false, // Needs to be readable by client
    path: "/",
    secure: env.NODE_ENV === Environment.PRODUCTION,
    sameSite: "lax",
    // No maxAge - cookie persists indefinitely
  });

  logger.debug("Lead ID cookie set in middleware", {
    leadId: result.leadId,
  });

  return response;
}
