/**
 * Lead ID Middleware
 *
 * This middleware ensures that every visitor has a leadId cookie set.
 */

import { and, eq, gt, isNull } from "drizzle-orm";
import type { NextRequest, NextResponse } from "next-vibe-ui/lib/request";
import { NextResponse as NextResponseClass } from "next-vibe-ui/lib/request";
import { Environment } from "next-vibe/shared/utils";

import { LEAD_ID_COOKIE_NAME } from "@/config/constants";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";

import { LeadAuthRepository } from "../../../leads/auth/repository";
import { leads } from "../../../leads/db";
import { db } from "../../db";
import { createEndpointLogger } from "../../unified-interface/shared/logger/server-logger";
import { frameExchangeTokens } from "../../unified-interface/vibe-frame/db";
import { shouldSkipPath } from "../utils";

export const UUID_REGEX =
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

  // Check if leadId cookie exists.
  // Frame routes handle auth via exchange token (?et=) redeemed before this check.
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

// ─── Exchange Token Redemption ────────────────────────────────────────────────

export interface ExchangeTokenPayload {
  /** Null when the host page didn't provide a leadId - middleware creates a new lead */
  leadId: string | null;
  authToken: string | null;
}

/**
 * Redeem a short-lived exchange token minted by the config API.
 * Marks it as used (single-use) and returns lead_id + optional auth token.
 * Returns null if token is missing, expired, or already used.
 *
 * Atomicity: the UPDATE ... WHERE usedAt IS NULL ... RETURNING pattern is a
 * single round-trip. Only the connection that successfully updates the row
 * (rowCount > 0) gets the payload - concurrent redemptions are safely rejected.
 */
export async function redeemExchangeToken(
  token: string,
): Promise<ExchangeTokenPayload | null> {
  try {
    const now = new Date();

    // Atomic single-query redemption: mark used only if currently unused and not expired.
    // RETURNING gives us the row data without a separate SELECT.
    const updated = await db
      .update(frameExchangeTokens)
      .set({ usedAt: now })
      .where(
        and(
          eq(frameExchangeTokens.token, token),
          isNull(frameExchangeTokens.usedAt),
          // gt(expiresAt, now) - filter expired tokens atomically
          gt(frameExchangeTokens.expiresAt, now),
        ),
      )
      .returning({
        leadId: frameExchangeTokens.leadId,
        authToken: frameExchangeTokens.authToken,
      });

    const row = updated[0];
    if (!row) {
      // Token missing, already used, or expired - all treated the same
      return null;
    }

    return { leadId: row.leadId, authToken: row.authToken };
  } catch {
    return null;
  }
}

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

  const response = NextResponseClass.next();

  // Set lead ID cookie
  // IMPORTANT: Lead ID cookie NEVER expires - it persists across all sessions
  response.cookies.set({
    name: LEAD_ID_COOKIE_NAME,
    value: result.leadId,
    httpOnly: true,
    path: "/",
    secure: env.NODE_ENV === Environment.PRODUCTION,
    sameSite: "lax" as const,
    maxAge: 365 * 24 * 60 * 60 * 10, // 10 years (effectively permanent)
  });

  logger.debug("Lead ID cookie set in middleware", {
    leadId: result.leadId,
  });

  return response;
}

/**
 * Update a lead's language and country from a locale string
 * Used by middleware to keep lead locale in sync when user changes language
 * @param leadId - The lead ID to update
 * @param locale - The new locale (e.g., "en-GLOBAL", "de-DE")
 */
export async function updateLeadLocale(
  leadId: string,
  locale: CountryLanguage,
): Promise<void> {
  const { language, country } = getLanguageAndCountryFromLocale(locale);
  await db
    .update(leads)
    .set({ language, country, updatedAt: new Date() })
    .where(eq(leads.id, leadId));
}
