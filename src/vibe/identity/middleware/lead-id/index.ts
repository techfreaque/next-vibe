/**
 * Lead ID Middleware
 *
 * This middleware ensures that every visitor has a leadId cookie set.
 */

import { and, DrizzleQueryError, eq, gt, isNull } from "drizzle-orm";
import type { NextRequest, NextResponse } from "next-vibe/ui/lib/request";
import { NextResponse as NextResponseClass } from "next-vibe/ui/lib/request";

import { skipCrawlerLead } from "@/credits/anti-farming/crawler";
import {
  AUTH_TOKEN_COOKIE_NAME,
  LEAD_ID_COOKIE_NAME,
  REQUEST_ID_HEADER_NAME,
} from "@/env/constants";
import { clientIpFromHeaders, geoCountryForIp } from "@/leads/geo/lookup";
import {
  extractTouch,
  isAcquisitionVisit,
  isLikelyBot,
} from "@/leads/growth/attribution";
import { matchesChrome131CrawlerHeaders } from "@/leads/growth/chrome-131-crawler";

import { coreEnv } from "../../../core/env";
import type { CountryLanguage } from "../../../core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "../../../core/i18n/core/language-utils";
import { scopedTranslation as sharedTranslation } from "../../../core/i18n/shared";
import { ErrorResponseTypes, fail } from "../../../core/route/response.schema";
import { parseError } from "../../../core/utils/parse-error";
import { db } from "../../../database";
import { isPglite, pool } from "../../../database/client";
import { databaseFailureDiagnostics } from "../../../database/error-diagnostics";
import { describePgPoolCheckouts } from "../../../database/pool";
import { Environment } from "../../../env/env-util";
import { sanitizeRoutePath } from "../../../logger/client-context";
import { createEndpointLogger } from "../../../logger/server";
import type { EndpointLogger } from "../../../logger/types";
import { frameExchangeTokens } from "../../../platforms/vibe-frame/db";
import {
  canRenderWithoutLead,
  markDegradedPublicDocument,
} from "../../../platforms/web/middleware/public-document";
import {
  isToolsDocument,
  toolsDocumentHeaders,
  toolsDocumentHtml,
} from "../../../platforms/web/middleware/tools-document";
import { shouldSkipPath } from "../../../platforms/web/middleware/utils";
import { leadFailureTimingHeader } from "../../../realtime/core/proxy-timing";
import {
  GUEST_LEAD_DB_BUDGET_MS,
  GuestLeadDatabaseDeadlineError,
} from "../../lead/database-deadline";
import { leads } from "../../lead/db";
import {
  createAnonymousLead,
  validateLeadIdExists,
} from "../../lead/middleware-ops";

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
 * @returns true only if the leadId is confirmed to exist (a failed lookup is false)
 */
export async function isLeadIdValid(
  leadId: string,
  deadlineMs?: number,
): Promise<boolean> {
  return (await validateLeadIdExists(leadId, deadlineMs)) === true;
}

/**
 * Check if leadId needs to be created
 * @param request The incoming request
 * @returns Result of leadId validation
 */
export async function checkLeadId(
  request: NextRequest,
  deadlineMs?: number,
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

  // Check if leadId exists in database. Only a confirmed miss is INVALID: a
  // failed lookup (DB slow/blip) used to count as missing, so API calls got
  // 401 invalid_identity and page loads minted a NEW lead over the cookie —
  // the visitor silently lost their guest credits, packs and chats.
  const exists = await validateLeadIdExists(existingLeadId, deadlineMs);
  if (exists === false) {
    return LeadIdCheckResult.INVALID;
  }

  return LeadIdCheckResult.VALID;
}

export { LeadIdCheckResult };

// ─── Exchange Token Redemption ────────────────────────────────────────────────

interface ExchangeTokenPayload {
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

/** Bound ancillary work that can wait for a cold geo cache or telemetry.
 * Provisioning uses a cancellable transaction with the same absolute deadline. */
async function withinGuestBudget<T>(
  work: Promise<T>,
  deadlineMs: number,
): Promise<T> {
  const timeout = Promise.withResolvers<never>();
  const timer = setTimeout(
    () => timeout.reject(new Error("Guest lead database deadline exceeded")),
    Math.max(0, deadlineMs - performance.now()),
  );
  try {
    return await Promise.race([work, timeout.promise]);
  } finally {
    clearTimeout(timer);
  }
}

function leadlessPublicDocument(): NextResponse {
  const response = NextResponseClass.next();
  response.headers.set("Cache-Control", "private, no-store");
  markDegradedPublicDocument(response);
  return response;
}

type LeadCreationStage = "crawler-policy" | "geo" | "provision";

export function leadFailureResponse(
  request: NextRequest,
  logger: EndpointLogger,
  error: Error,
  deadlineMs: number,
  locale: CountryLanguage,
  operation: "create" | "lookup",
  creationStage?: LeadCreationStage,
): NextResponse {
  const details = databaseFailureDiagnostics(error);
  const renderPublic = !!details.driverFailure && canRenderWithoutLead(request);
  const status = renderPublic ? 200 : details.driverFailure ? 503 : 500;
  const requestId = request.headers.get(REQUEST_ID_HEADER_NAME);
  const databaseDeadline =
    error instanceof GuestLeadDatabaseDeadlineError ? error : undefined;
  const budgetOverrunMs = Math.round(performance.now() - deadlineMs);
  logger.error(
    operation === "create"
      ? "Anonymous lead creation failed in middleware"
      : "Anonymous lead lookup failed in middleware",
    {
      ...details,
      stage:
        error instanceof DrizzleQueryError
          ? /^insert\b/i.test(error.query)
            ? "insert"
            : /^select\b/i.test(error.query)
              ? "lookup"
              : "other-query"
          : (creationStage ?? operation),
      requestId:
        requestId && UUID_REGEX.test(requestId) ? requestId : undefined,
      elapsedMs: budgetOverrunMs + GUEST_LEAD_DB_BUDGET_MS,
      budgetOverrunMs: Math.max(0, budgetOverrunMs),
      databaseDeadlinePhase: databaseDeadline?.phase,
      poolTotal: databaseDeadline?.poolTotal,
      poolIdle: databaseDeadline?.poolIdle,
      poolWaiting: databaseDeadline?.poolWaiting,
      leadCheckoutWaiting: databaseDeadline?.leadCheckoutWaiting,
      oldestPoolCheckouts: databaseDeadline?.oldestPoolCheckouts,
      oldestAppPoolCheckouts:
        databaseDeadline && isPglite && pool
          ? describePgPoolCheckouts(pool)
          : undefined,
      method: request.method,
      path: sanitizeRoutePath(request.nextUrl.pathname),
      status,
      renderWithoutLead: renderPublic,
    },
  );
  if (renderPublic) {
    return leadlessPublicDocument();
  }
  const responseInit = {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Server-Timing": leadFailureTimingHeader(creationStage ?? "lookup"),
      ...(status === 503 ? { "Retry-After": "5" } : {}),
    },
  };
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const { t } = sharedTranslation.scopedT(locale);
    return NextResponseClass.json(
      fail({
        message: t("errorTypes.database_error"),
        errorType: { ...ErrorResponseTypes.DATABASE_ERROR, errorCode: status },
      }),
      responseInit,
    );
  }
  if (isToolsDocument(request, request.nextUrl.pathname)) {
    return new NextResponseClass(
      request.method === "HEAD" ? null : toolsDocumentHtml(locale),
      {
        ...responseInit,
        headers: { ...responseInit.headers, ...toolsDocumentHeaders },
      },
    );
  }
  return new NextResponseClass(
    status === 503 ? "Service Unavailable" : "Internal Server Error",
    responseInit,
  );
}

export async function recordAttributionWithinBudget(
  request: NextRequest,
  leadId: string,
  logger: EndpointLogger,
  deadlineMs: number,
): Promise<void> {
  try {
    await withinGuestBudget(
      recordAttributionTouch(request, leadId, logger),
      deadlineMs,
    );
  } catch (error) {
    const requestId = request.headers.get(REQUEST_ID_HEADER_NAME);
    logger.error("Guest attribution failed in middleware", {
      ...databaseFailureDiagnostics(parseError(error)),
      method: request.method,
      path: sanitizeRoutePath(request.nextUrl.pathname),
      requestId:
        requestId && UUID_REGEX.test(requestId) ? requestId : undefined,
      budgetOverrunMs: Math.max(0, Math.round(performance.now() - deadlineMs)),
    });
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
  deadlineMs = performance.now() + GUEST_LEAD_DB_BUDGET_MS,
): Promise<NextResponse> {
  if (
    matchesChrome131CrawlerHeaders(request.headers) &&
    !request.nextUrl.search &&
    canRenderWithoutLead(request, { includeSkillPages: true })
  ) {
    return leadlessPublicDocument();
  }

  const logger = createEndpointLogger(false, locale);

  const anonymousRead =
    (request.method === "GET" || request.method === "HEAD") &&
    !request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value &&
    !request.headers.has("authorization");

  let leadId: string;
  let stage: LeadCreationStage = "crawler-policy";
  try {
    if (
      anonymousRead &&
      (await withinGuestBudget(
        skipCrawlerLead(request.headers.get("user-agent"), logger),
        deadlineMs,
      ))
    ) {
      return NextResponseClass.next();
    }

    stage = "geo";
    const ipAddress = clientIpFromHeaders(request.headers);
    const clientInfo = {
      userAgent: request.headers.get("user-agent") || undefined,
      referer: request.headers.get("referer") || undefined,
      ipAddress,
      geoCountry: await withinGuestBudget(
        geoCountryForIp(ipAddress, logger),
        deadlineMs,
      ),
    };
    // The insert itself uses a bounded transaction, so a timed-out checkout
    // cannot later create an identity after we have returned the document.
    stage = "provision";
    leadId = await createAnonymousLead(clientInfo, locale, logger, deadlineMs);
  } catch (error) {
    return leadFailureResponse(
      request,
      logger,
      error instanceof Error ? error : parseError(error),
      deadlineMs,
      locale,
      "create",
      stage,
    );
  }

  if (!leadId) {
    return leadFailureResponse(
      request,
      logger,
      new Error("Guest provisioning returned no identity"),
      deadlineMs,
      locale,
      "create",
      stage,
    );
  }
  await recordAttributionWithinBudget(request, leadId, logger, deadlineMs);

  const response = NextResponseClass.next();

  response.cookies.set({
    name: LEAD_ID_COOKIE_NAME,
    value: leadId,
    httpOnly: true,
    path: "/",
    secure:
      coreEnv.NODE_ENV === Environment.PRODUCTION && !coreEnv.IS_PREVIEW_MODE,
    sameSite: "lax" as const,
    maxAge: 365 * 24 * 60 * 60 * 10, // 10 years (effectively permanent)
  });

  logger.debug("Lead ID cookie set in middleware", { leadId });

  return response;
}

/**
 * Growth attribution: record how this page request arrived.
 * Record document arrivals. Internal navigation only counts when it carries
 * new campaign markers. Skip API calls, prefetches, subresources and crawlers.
 */
export async function recordAttributionTouch(
  request: NextRequest,
  leadId: string,
  logger: EndpointLogger,
): Promise<void> {
  const path = request.nextUrl.pathname;
  const destination = request.headers.get("sec-fetch-dest");
  if (
    request.method !== "GET" ||
    path.startsWith("/api/") ||
    (destination !== null && destination !== "document") ||
    !request.headers.get("accept")?.includes("text/html") ||
    request.headers.get("rsc") !== null ||
    request.headers.get("next-router-prefetch") !== null ||
    request.headers.get("purpose")?.includes("prefetch") ||
    request.headers.get("sec-purpose")?.includes("prefetch") ||
    isLikelyBot(request.headers.get("user-agent"))
  ) {
    return;
  }
  const ownHosts = [
    new URL(coreEnv.NEXT_PUBLIC_APP_URL).hostname,
    request.headers.get("x-forwarded-host")?.split(":")[0] ?? "",
  ].filter((h) => h.length > 0);
  const url = new URL(request.nextUrl.href);
  const referer = request.headers.get("referer");
  const touch = extractTouch(url, referer, ownHosts);
  if (
    !isAcquisitionVisit(
      url,
      referer,
      ownHosts,
      touch,
      request.headers.get("sec-fetch-site"),
    )
  ) {
    return;
  }
  const { GrowthJourneyRepository } = await import("@/leads/growth/repository");
  const geoCountry = await geoCountryForIp(
    clientIpFromHeaders(request.headers),
    logger,
  );
  await GrowthJourneyRepository.recordTouch(leadId, touch, logger, geoCountry);
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
