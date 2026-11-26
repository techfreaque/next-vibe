import { and, eq, isNull, ne, or, sql } from "drizzle-orm";

import { coreEnv } from "../../core/env";
import type { CountryLanguage } from "../../core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "../../core/i18n/core/language-utils";
import { parseError } from "../../core/utils/parse-error";
import { isPrivateAddress } from "../../core/utils/ssrf-guard";
import { sanitizeTelemetryUrl } from "../../core/utils/telemetry-url";
import { db } from "../../database";
import { getGuestLeadPool } from "../../database/client";
import { databaseFailureDiagnostics } from "../../database/error-diagnostics";
import { Environment } from "../../env/env-util";
import type { EndpointLogger } from "../../logger/types";
import {
  GuestLeadDatabaseDeadlineError,
  type LeadProvisionStep,
  withLeadDatabaseDeadline,
  withLeadLookupDeadline,
} from "./database-deadline";
import { leadLeadLinks, leads, userLeadLinks } from "./db";
import { LeadSource, LeadStatus } from "./enum";
import {
  GUEST_IP_POOL_WINDOW_HOURS,
  IP_LINK_EXEMPT_METADATA_KEY,
  ipPoolKey,
} from "./ip-key";
import { parseLeadUserAgent } from "./user-agent";

const pendingLeadLookups = new Map<
  string,
  { deadlineMs: number; result: Promise<boolean> }
>();

interface ClientInfo {
  userAgent?: string;
  ipAddress?: string;
  referer?: string;
  /** Visitor country from the IP (ISO alpha-2), null when unresolved */
  geoCountry?: string | null;
}

/**
 * Does `leadId` exist? `null` = the lookup itself failed (DB timeout/blip):
 * unknown, NOT missing — callers must not treat it as a dead identity.
 * Callers supplying a deadline receive the original database error on failure.
 */
export function validateLeadIdExists(
  leadId: string,
  deadlineMs: number,
): Promise<boolean>;
export function validateLeadIdExists(
  leadId: string,
  deadlineMs?: number,
): Promise<boolean | null>;
export async function validateLeadIdExists(
  leadId: string,
  deadlineMs?: number,
): Promise<boolean | null> {
  const lookup = async (
    connection: Pick<typeof db, "select">,
  ): Promise<boolean> => {
    const [lead] = await connection
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);
    return !!lead;
  };
  if (deadlineMs !== undefined) {
    const pending = pendingLeadLookups.get(leadId);
    const now = performance.now();
    // Parallel requests from the same visitor can share the in-flight SELECT.
    // Each caller keeps its own deadline and a settled result is discarded.
    if (
      pending &&
      pending.deadlineMs > now &&
      pending.deadlineMs <= deadlineMs
    ) {
      try {
        return await pending.result;
      } catch (error) {
        if (
          !(error instanceof GuestLeadDatabaseDeadlineError) ||
          performance.now() >= deadlineMs
        ) {
          return Promise.reject(error);
        }
        return validateLeadIdExists(leadId, deadlineMs);
      }
    }
    const result = withLeadLookupDeadline(
      getGuestLeadPool(),
      deadlineMs,
      lookup,
    );
    const active = { deadlineMs, result };
    pendingLeadLookups.set(leadId, active);
    try {
      return await result;
    } finally {
      if (pendingLeadLookups.get(leadId) === active) {
        pendingLeadLookups.delete(leadId);
      }
    }
  }
  try {
    return await lookup(db);
  } catch {
    return null;
  }
}

export function createAnonymousLead(
  clientInfo: ClientInfo,
  locale: CountryLanguage,
  logger: EndpointLogger,
  deadlineMs?: number,
): Promise<string> {
  if (deadlineMs === undefined) {
    return provisionAnonymousLead(db, clientInfo, locale, logger, false);
  }
  return withLeadDatabaseDeadline(
    getGuestLeadPool(),
    deadlineMs,
    (connection, setStep) =>
      provisionAnonymousLead(
        connection,
        clientInfo,
        locale,
        logger,
        true,
        setStep,
      ),
  );
}

async function provisionAnonymousLead(
  connection: typeof db,
  clientInfo: ClientInfo,
  locale: CountryLanguage,
  logger: EndpointLogger,
  transactional: boolean,
  setStep?: (step: LeadProvisionStep) => void,
): Promise<string> {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const conditions = [
    eq(leads.status, LeadStatus.WEBSITE_USER),
    eq(leads.source, LeadSource.WEBSITE),
    isNull(leads.email),
    // Match the guest IP index predicate and leave account-linked leads alone.
    isNull(leads.convertedUserId),
    sql`${leads.createdAt} > ${fiveMinutesAgo}`,
  ];

  if (clientInfo.ipAddress) {
    conditions.push(
      sql`${leads.metadata}->>'ipAddress' = ${clientInfo.ipAddress}`,
      sql`GREATEST(${leads.createdAt}, ${leads.updatedAt}) > ${fiveMinutesAgo}`,
    );
  }

  if (clientInfo.userAgent) {
    conditions.push(
      sql`${leads.metadata}->>'userAgent' = ${clientInfo.userAgent}`,
    );
  }

  setStep?.("find-reusable-guest");
  const [existingLead] = await connection
    .select({ id: leads.id })
    .from(leads)
    .where(and(...conditions))
    .limit(1);

  if (existingLead) {
    logger.debug("Found existing anonymous lead", { leadId: existingLead.id });
    return existingLead.id;
  }

  const { language, country } = getLanguageAndCountryFromLocale(locale);
  // Typed identity columns (lead analytics, list, detail) plus the metadata
  // copy the duplicate check above and older readers use.
  const parsed = clientInfo.userAgent
    ? parseLeadUserAgent(clientInfo.userAgent)
    : null;

  setStep?.("insert-guest");
  const [newLead] = await connection
    .insert(leads)
    .values({
      email: null,
      businessName: "",
      contactName: null,
      phone: null,
      website: null,
      country,
      language,
      geoCountry: clientInfo.geoCountry ?? null,
      ipAddress: clientInfo.ipAddress ?? null,
      userAgent: clientInfo.userAgent ?? null,
      deviceType: parsed?.deviceType ?? null,
      browser: parsed?.browser ?? null,
      os: parsed?.os ?? null,
      source: LeadSource.WEBSITE,
      status: LeadStatus.WEBSITE_USER,
      notes: null,
      metadata: {
        anonymous: true,
        createdFromTracking: true,
        userAgent: clientInfo.userAgent ?? null,
        ipAddress: clientInfo.ipAddress ?? null,
        ipKey: ipPoolKey(clientInfo.ipAddress),
        referer: sanitizeTelemetryUrl(clientInfo.referer, true),
        timestamp: new Date().toISOString(),
      },
    })
    .returning({ id: leads.id });

  logger.debug(`Created anonymous lead ${newLead.id}`);

  // Credit wallet is created lazily on first balance check — no eager init needed here.

  if (clientInfo.ipAddress) {
    setStep?.("link-guest-pool");
    await linkLeadsByIp(
      connection,
      newLead.id,
      clientInfo.ipAddress,
      logger,
      transactional,
    );
  }

  return newLead.id;
}

/**
 * Production sees real visitors only through the edge proxy (X-Forwarded-For
 * = the client). A loopback/private address there is the server talking to
 * itself (deploy warmup, health probes over the docker bridge / WireGuard),
 * never a guest: pooling those leads glues unrelated server traffic into one
 * ever-growing pool. Dev/test/preview keep linking (local runs are all
 * 127.0.0.1 and the anti-farming tests use private ranges).
 */
export function isServerSideIp(
  ipAddress: string,
  production: boolean = coreEnv.NODE_ENV === Environment.PRODUCTION &&
    !coreEnv.IS_PREVIEW_MODE,
): boolean {
  return production && isPrivateAddress(ipAddress);
}

/**
 * Guests behind one IP share ONE guest pool: a new lead links (ip_match) to
 * every guest lead seen from the same IP key (IPv4 /32, IPv6 /64) within the
 * last GUEST_IP_POOL_WINDOW_HOURS, whatever browser, incognito or fingerprint.
 * Leads that belong to an account are never IP-linked: accounts only join
 * devices through strong signals (login, same lead cookie).
 * Never linked: server-side IPs (see isServerSideIp) and leads flagged
 * `metadata.ipLinkExempt` (the HA health probe's lead, set by an admin: a
 * request header or user agent would let anyone opt out of guest pooling).
 */
async function linkLeadsByIp(
  connection: typeof db,
  newLeadId: string,
  ipAddress: string,
  logger: EndpointLogger,
  transactional: boolean,
): Promise<void> {
  const startedAt = performance.now();
  const ipKey = ipPoolKey(ipAddress);
  if (!ipKey || isServerSideIp(ipAddress)) {
    return;
  }
  const since = new Date(
    Date.now() - GUEST_IP_POOL_WINDOW_HOURS * 60 * 60 * 1000,
  );

  try {
    // Select and insert in one statement on the bounded provisioning client.
    const eligible = connection
      .select({
        id: sql<string>`gen_random_uuid()`,
        leadId1: sql<string>`${newLeadId}::uuid`,
        leadId2: leads.id,
        linkReason: sql<"ip_match">`'ip_match'`,
        linkedAt: sql<Date>`now()`,
        createdAt: sql<Date>`now()`,
      })
      .from(leads)
      .where(
        and(
          ne(leads.id, newLeadId),
          isNull(leads.email),
          isNull(leads.convertedUserId),
          or(
            sql`${leads.metadata}->>'ipKey' = ${ipKey}`,
            sql`${leads.metadata}->>'ipAddress' = ${ipAddress}`,
          ),
          sql`GREATEST(${leads.createdAt}, ${leads.updatedAt}) >= ${since}`,
          sql`COALESCE(${leads.metadata}->>${IP_LINK_EXEMPT_METADATA_KEY}, 'false') <> 'true'`,
          sql`NOT EXISTS (SELECT 1 FROM ${userLeadLinks} ull WHERE ull.lead_id = ${leads.id})`,
        ),
      )
      .limit(20);

    const result = await connection
      .insert(leadLeadLinks)
      .select(eligible.getSQL())
      .onConflictDoNothing();

    if (result.rowCount !== null && result.rowCount > 0) {
      logger.debug("Linked new lead to same-IP guest leads", {
        newLeadId,
        linkedCount: result.rowCount,
      });
    }
  } catch (error) {
    logger.error("Failed to link leads by IP", {
      ...databaseFailureDiagnostics(
        error instanceof Error ? error : parseError(error),
      ),
      stage: "insert-select-links",
      elapsedMs: Math.round(performance.now() - startedAt),
    });
    if (transactional) {
      return Promise.reject(error);
    }
  }
}
