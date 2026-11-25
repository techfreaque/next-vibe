import { and, eq, isNull, ne, or, sql } from "drizzle-orm";

import { coreEnv } from "../../core/env";
import type { CountryLanguage } from "../../core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "../../core/i18n/core/language-utils";
import { parseError } from "../../core/utils/parse-error";
import { isPrivateAddress } from "../../core/utils/ssrf-guard";
import { sanitizeTelemetryUrl } from "../../core/utils/telemetry-url";
import { db } from "../../database";
import { pool } from "../../database/client";
import { databaseFailureDiagnostics } from "../../database/error-diagnostics";
import { Environment } from "../../env/env-util";
import type { EndpointLogger } from "../../logger/types";
import {
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
    return withLeadLookupDeadline(pool, deadlineMs, lookup);
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
  return withLeadDatabaseDeadline(pool, deadlineMs, (connection, setStep) =>
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
  let matches = 0;
  try {
    const ipKey = ipPoolKey(ipAddress);
    if (!ipKey || isServerSideIp(ipAddress)) {
      return;
    }
    const since = new Date(
      Date.now() - GUEST_IP_POOL_WINDOW_HOURS * 60 * 60 * 1000,
    );

    const sameIpLeads = await connection
      .select({ id: leads.id })
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

    matches = sameIpLeads.length;
    if (matches === 0) {
      return;
    }

    await connection
      .insert(leadLeadLinks)
      .values(
        sameIpLeads.map((existing) => ({
          leadId1: newLeadId,
          leadId2: existing.id,
          linkReason: "ip_match" as const,
        })),
      )
      .onConflictDoNothing();

    logger.debug("Linked new lead to same-IP guest leads", {
      newLeadId,
      linkedCount: sameIpLeads.length,
    });
  } catch (error) {
    logger.error("Failed to link leads by IP", {
      ...databaseFailureDiagnostics(
        error instanceof Error ? error : parseError(error),
      ),
      stage: matches ? "insertLinks" : "findGuests",
      matches,
      elapsedMs: Math.round(performance.now() - startedAt),
    });
    if (transactional) {
      return Promise.reject(error);
    }
  }
}
