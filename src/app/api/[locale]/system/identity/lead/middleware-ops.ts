import { and, eq, isNull, ne, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { leadLeadLinks, leads } from "./db";
import { LeadSource, LeadStatus } from "./enum";

interface ClientInfo {
  userAgent?: string;
  ipAddress?: string;
  referer?: string;
}

export async function validateLeadIdExists(leadId: string): Promise<boolean> {
  try {
    const [lead] = await db
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);
    return !!lead;
  } catch {
    return false;
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

async function linkLeadsByIp(
  newLeadId: string,
  ipAddress: string,
  logger: EndpointLogger,
): Promise<void> {
  try {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const sameIpLeads = await db
      .select({ id: leads.id })
      .from(leads)
      .where(
        and(
          ne(leads.id, newLeadId),
          isNull(leads.email),
          sql`${leads.metadata}->>'ipAddress' = ${ipAddress}`,
          sql`${leads.createdAt} >= ${monthStart}`,
        ),
      )
      .limit(20);

    if (sameIpLeads.length === 0) {
      return;
    }

    const BATCH_SIZE = 10;
    for (let i = 0; i < sameIpLeads.length; i += BATCH_SIZE) {
      const batch = sameIpLeads.slice(i, i + BATCH_SIZE);
      await db
        .insert(leadLeadLinks)
        .values(
          batch.map((existing) => ({
            leadId1: newLeadId,
            leadId2: existing.id,
            linkReason: "ip_match" as const,
          })),
        )
        .onConflictDoNothing();
    }

    logger.debug("Linked new lead to same-IP leads", {
      newLeadId,
      linkedCount: sameIpLeads.length,
    });
  } catch (error) {
    logger.error("Failed to link leads by IP", parseError(error).message);
  }
}
