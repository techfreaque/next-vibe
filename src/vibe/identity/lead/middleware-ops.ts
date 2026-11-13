import { and, eq, isNull, ne, or, sql } from "drizzle-orm";

import type { CountryLanguage } from "../../core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "../../core/i18n/core/language-utils";
import { parseError } from "../../core/utils/parse-error";
import { db } from "../../database";
import type { EndpointLogger } from "../../logger/types";
import { leadLeadLinks, leads, userLeadLinks } from "./db";
import { LeadSource, LeadStatus } from "./enum";
import { GUEST_IP_POOL_WINDOW_HOURS, ipPoolKey } from "./ip-key";

interface ClientInfo {
  userAgent?: string;
  ipAddress?: string;
  referer?: string;
}

/**
 * Does `leadId` exist? `null` = the lookup itself failed (DB timeout/blip):
 * unknown, NOT missing — callers must not treat it as a dead identity.
 */
export async function validateLeadIdExists(
  leadId: string,
): Promise<boolean | null> {
  try {
    const [lead] = await db
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);
    return !!lead;
  } catch {
    return null;
  }
}

export async function createAnonymousLead(
  clientInfo: ClientInfo,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<string> {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const conditions = [
    eq(leads.status, LeadStatus.WEBSITE_USER),
    eq(leads.source, LeadSource.WEBSITE),
    isNull(leads.email),
    sql`${leads.createdAt} > ${fiveMinutesAgo}`,
  ];

  if (clientInfo.ipAddress) {
    conditions.push(
      sql`${leads.metadata}->>'ipAddress' = ${clientInfo.ipAddress}`,
    );
  }

  if (clientInfo.userAgent) {
    conditions.push(
      sql`${leads.metadata}->>'userAgent' = ${clientInfo.userAgent}`,
    );
  }

  const [existingLead] = await db
    .select()
    .from(leads)
    .where(and(...conditions))
    .limit(1);

  if (existingLead) {
    logger.debug("Found existing anonymous lead", { leadId: existingLead.id });
    return existingLead.id;
  }

  const { language, country } = getLanguageAndCountryFromLocale(locale);

  const [newLead] = await db
    .insert(leads)
    .values({
      email: null,
      businessName: "",
      contactName: null,
      phone: null,
      website: null,
      country,
      language,
      source: LeadSource.WEBSITE,
      status: LeadStatus.WEBSITE_USER,
      notes: null,
      metadata: {
        anonymous: true,
        createdFromTracking: true,
        userAgent: clientInfo.userAgent ?? null,
        ipAddress: clientInfo.ipAddress ?? null,
        ipKey: ipPoolKey(clientInfo.ipAddress),
        referer: clientInfo.referer ?? null,
        timestamp: new Date().toISOString(),
      },
    })
    .returning();

  logger.debug(`Created anonymous lead ${newLead.id}`);

  // Credit wallet is created lazily on first balance check — no eager init needed here.

  if (clientInfo.ipAddress) {
    await linkLeadsByIp(newLead.id, clientInfo.ipAddress, logger);
  }

  return newLead.id;
}

/**
 * Guests behind one IP share ONE guest pool: a new lead links (ip_match) to
 * every guest lead seen from the same IP key (IPv4 /32, IPv6 /64) within the
 * last GUEST_IP_POOL_WINDOW_HOURS, whatever browser, incognito or fingerprint.
 * Leads that belong to an account are never IP-linked: accounts only join
 * devices through strong signals (login, same lead cookie).
 */
async function linkLeadsByIp(
  newLeadId: string,
  ipAddress: string,
  logger: EndpointLogger,
): Promise<void> {
  try {
    const ipKey = ipPoolKey(ipAddress);
    if (!ipKey) {
      return;
    }
    const since = new Date(
      Date.now() - GUEST_IP_POOL_WINDOW_HOURS * 60 * 60 * 1000,
    );

    const sameIpLeads = await db
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
          sql`NOT EXISTS (SELECT 1 FROM ${userLeadLinks} ull WHERE ull.lead_id = ${leads.id})`,
        ),
      )
      .limit(20);

    if (sameIpLeads.length === 0) {
      return;
    }

    await db
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
    logger.error("Failed to link leads by IP", parseError(error).message);
  }
}
