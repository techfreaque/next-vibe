/**
 * Lead ID Middleware
 *
 * This middleware ensures that every visitor has a leadId cookie set.
 */

import type { NextRequest, NextResponse } from "next/server";
import { NextResponse as NextResponseClass } from "next/server";
import { Environment } from "next-vibe/shared/utils";

import { LEAD_ID_COOKIE_NAME } from "@/config/constants";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadAuthRepository } from "../../../leads/auth/repository";
import { createEndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import { shouldSkipPath } from "../utils";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

enum LeadIdCheckResult {
  VALID = "valid",
  INVALID = "invalid",
  MISSING = "missing",
  SKIP = "skip",
}

/**
 * Get the current leadId from the request cookie
 * @param request The incoming request
 * @returns The leadId value or undefined if not present
 */
export function getLeadIdFromRequest(request: NextRequest): string | undefined {
  return request.cookies.get(LEAD_ID_COOKIE_NAME)?.value;
}

/**
 * Check if leadId exists in database
 * @param leadId The leadId to check
 * @returns true if leadId exists in database
 */
export async function isLeadIdValid(leadId: string): Promise<boolean> {
  try {
    const result = await LeadAuthRepository.validateLeadIdExists(leadId);
    return result;
  } catch {
    return false;
  }
}

/**
 * Check if leadId needs to be created
 * @param request The incoming request
 * @returns Result of leadId validation
 */
export async function checkLeadId(
  request: NextRequest,
): Promise<LeadIdCheckResult> {
  const path = request.nextUrl.pathname;

  // Skip for static files
  if (shouldSkipPath(path)) {
    return LeadIdCheckResult.SKIP;
  }

  // Check if leadId cookie exists
  const existingLeadId = request.cookies.get(LEAD_ID_COOKIE_NAME)?.value;

  if (!existingLeadId) {
    return LeadIdCheckResult.MISSING;
  }

  // Check if format is valid UUID
  if (!UUID_REGEX.test(existingLeadId)) {
    return LeadIdCheckResult.INVALID;
  }

  // Check if leadId exists in database
  const isValid = await isLeadIdValid(existingLeadId);
  if (!isValid) {
    return LeadIdCheckResult.INVALID;
  }

  return LeadIdCheckResult.VALID;
}

export { LeadIdCheckResult };

/**
 * Create a new leadId and set the cookie
 * @param request The incoming request
 * @param locale The locale for the request
 * @returns Response with leadId cookie set and redirect to ensure cookie is used
 */
export async function createLeadId(
  request: NextRequest,
  locale: CountryLanguage,
): Promise<NextResponse> {
  const logger = createEndpointLogger(false, Date.now(), locale);

  const clientInfo = {
    userAgent: request.headers.get("user-agent") || undefined,
    referer: request.headers.get("referer") || undefined,
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      undefined,
  };

  // Always create a fresh leadId (pass undefined)
  // This ensures exactly ONE new leadId is created, not duplicates from parallel requests
  const result = await LeadAuthRepository.ensurePublicLeadId(
    undefined,
    clientInfo,
    locale,
    logger,
  );

  if (!result.leadId) {
    logger.error("Failed to create leadId in middleware");
    return NextResponseClass.next();
  }

  // Redirect to the same URL to ensure the cookie is sent with subsequent requests
  const response = NextResponseClass.redirect(request.url);

  // Set lead ID cookie
  // IMPORTANT: Lead ID cookie NEVER expires - it persists across all sessions
  response.cookies.set({
    name: LEAD_ID_COOKIE_NAME,
    value: result.leadId,
    httpOnly: false, // Needs to be readable by client
    path: "/",
    secure: env.NODE_ENV === Environment.PRODUCTION,
    sameSite: "lax",
    maxAge: 365 * 24 * 60 * 60 * 10, // 10 years (effectively permanent)
  });

  logger.debug("Lead ID cookie set in middleware with redirect", {
    leadId: result.leadId,
  });

  return response;
}
