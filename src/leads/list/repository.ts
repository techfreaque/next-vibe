/**
 * Leads List Repository
 *
 * Lists leads with the classic filters (status, source, stage, country,
 * language, search, acquisition) plus every lead-analytics drill-down filter
 * (segment, creation window, reached step), so a number in the acquisition,
 * funnel or abuse report opens exactly the leads behind it.
 */

import "server-only";

import type { SQL } from "drizzle-orm";
import { and, count, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { leads } from "next-vibe/identity/lead/db";
import {
  convertCountryFilter,
  convertLanguageFilter,
  LeadSortField,
  LeadStatus,
  mapCampaignStageFilter,
  mapSourceFilter,
  mapStatusFilter,
  SortOrder,
} from "next-vibe/identity/lead/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { QueryResultRow } from "pg";

import { BotFamily, LeadDimension, TrafficFilter } from "../analytics/enum";
import {
  dimensionColumn,
  leadFactsSql,
  matchingLeadIdsSql,
  requestsBotTraffic,
} from "../analytics/segment-sql";
import { AcquisitionSourceFilter } from "../growth/acquisition";
import { AcquisitionRepository } from "../growth/acquisition-repository";
import type {
  LeadListGetRequestTypeOutput,
  LeadListGetResponseTypeOutput,
} from "./definition";
import type { LeadsListT } from "./i18n";

type LeadRow = NonNullable<
  LeadListGetResponseTypeOutput["response"]
>["leads"][number];
type Triage = NonNullable<LeadRow["triage"]>;

function notNull<T>(value: T | null): value is T {
  return value !== null;
}

/** Bot, channel, network and funnel facts for the listed leads. */
async function triageFor(ids: string[]): Promise<Map<string, Triage>> {
  if (ids.length === 0) {
    return new Map();
  }
  const idList = sql.join(
    ids.map((id) => sql`${id}::uuid`),
    sql`, `,
  );
  const { rows } = await db.execute<
    QueryResultRow & Triage & { id: string }
  >(sql`
    SELECT f.id, f.bot_family AS "botFamily",
      ${dimensionColumn(LeadDimension.CHANNEL_TYPE)} AS "channelType",
      f.channel, f.source, f.referrer_host AS "referrerHost",
      f.landing_path AS "landingPath", f.ref_code AS "refCode",
      f.ip_prefix AS "ipPrefix", f.ua_fp AS "uaFingerprint",
      ${dimensionColumn(LeadDimension.DEVICE)} AS device,
      f.browser, f.os, f.country AS "geoCountry",
      (f.signed_up_at IS NOT NULL) AS "signedUp",
      f.email_verified AS "emailConfirmed",
      (f.first_chat_at IS NOT NULL) AS chatted,
      (f.first_paid_at IS NOT NULL) AS paid
    FROM (${leadFactsSql(sql`l.id IN (${idList})`)}) f
  `);
  return new Map(rows.map(({ id, ...triage }) => [id, triage]));
}

/** Who is behind a drilled number: humans, signups, payers, distinct agents. */
async function summarize(where: SQL | undefined): Promise<{
  total: number;
  humans: number;
  signups: number;
  paid: number;
  agents: number;
}> {
  const ids = db.select({ id: leads.id }).from(leads).where(where);
  const { rows } = await db.execute<
    QueryResultRow & {
      total: number;
      humans: number;
      signups: number;
      paid: number;
      agents: number;
    }
  >(sql`
    SELECT count(*)::int AS total,
      count(*) FILTER (WHERE f.bot_family = ${BotFamily.HUMAN})::int AS humans,
      count(*) FILTER (WHERE f.signed_up_at IS NOT NULL)::int AS signups,
      count(*) FILTER (WHERE f.first_paid_at IS NOT NULL)::int AS paid,
      count(DISTINCT f.ua_fp)::int AS agents
    FROM (${leadFactsSql(sql`l.id IN (${ids})`)}) f
  `);
  return rows[0] ?? { total: 0, humans: 0, signups: 0, paid: 0, agents: 0 };
}

function orderBy(
  field: LeadListGetRequestTypeOutput["sortingOptions"],
): SQL | ReturnType<typeof desc> {
  const sortBy = field?.sortBy ?? LeadSortField.CREATED_AT;
  const asc = field?.sortOrder === SortOrder.ASC;
  const column =
    sortBy === LeadSortField.EMAIL
      ? leads.email
      : sortBy === LeadSortField.BUSINESS_NAME
        ? leads.businessName
        : sortBy === LeadSortField.UPDATED_AT
          ? leads.updatedAt
          : sortBy === LeadSortField.LAST_ENGAGEMENT_AT
            ? leads.lastEngagementAt
            : leads.createdAt;
  return asc ? sql`${column} ASC` : desc(column);
}

export class LeadsListRepository {
  static async listLeads(
    data: LeadListGetRequestTypeOutput,
    t: LeadsListT,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LeadListGetResponseTypeOutput>> {
    try {
      logger.debug("Listing leads", { locale });
      const page = data.paginationInfo?.page ?? 1;
      const limit = data.paginationInfo?.limit ?? 20;
      const search = data.statusFilters?.search?.trim();

      const statuses = (data.statusFilters?.status ?? [])
        .map(mapStatusFilter)
        .filter(notNull);
      const stages = (data.statusFilters?.currentCampaignStage ?? [])
        .map(mapCampaignStageFilter)
        .filter(notNull);
      const sources = (data.statusFilters?.source ?? [])
        .map(mapSourceFilter)
        .filter(notNull);
      const countries = (data.locationFilters?.country ?? [])
        .map(convertCountryFilter)
        .filter(notNull);
      const languages = (data.locationFilters?.language ?? [])
        .map(convertLanguageFilter)
        .filter(notNull);

      // Everything except status: the status tabs count against these.
      // Exclude flagged crawler/bot leads by default unless explicitly requested.
      const base: SQL[] = [];
      const showBots =
        data.includeBots === true ||
        data.traffic === TrafficFilter.ALL ||
        requestsBotTraffic(data);
      if (!showBots) {
        base.push(eq(leads.isBot, false));
      }
      if (stages.length > 0) {
        base.push(inArray(leads.currentCampaignStage, stages));
      }
      if (sources.length > 0) {
        base.push(inArray(leads.source, sources));
      }
      if (countries.length > 0) {
        base.push(inArray(leads.country, countries));
      }
      if (languages.length > 0) {
        base.push(inArray(leads.language, languages));
      }
      if (search) {
        const pattern = `%${search}%`;
        const condition = or(
          ilike(leads.email, pattern),
          ilike(leads.businessName, pattern),
          ilike(leads.ipAddress, pattern),
          sql`${leads.id}::text = ${search}`,
        );
        if (condition) {
          base.push(condition);
        }
      }
      const { sourceType, ...acquisitionFields } =
        data.acquisitionFilters ?? {};
      if (
        (sourceType && sourceType !== AcquisitionSourceFilter.ALL) ||
        Object.values(acquisitionFields).some((value) => value?.trim())
      ) {
        base.push(
          sql`${leads.id} IN (${AcquisitionRepository.matchingLeadIds({
            sourceType,
            ...acquisitionFields,
          })})`,
        );
      }
      const drill = matchingLeadIdsSql(data);
      if (drill) {
        base.push(sql`${leads.id} IN (${drill})`);
      }

      const baseWhere = base.length > 0 ? and(...base) : undefined;
      const where =
        statuses.length > 0
          ? and(...base, inArray(leads.status, statuses))
          : baseWhere;

      const [[{ total }], statusCounts, rows] = await Promise.all([
        db.select({ total: count() }).from(leads).where(where),
        db
          .select({ status: leads.status, value: count() })
          .from(leads)
          .where(baseWhere)
          .groupBy(leads.status),
        db
          .select({
            id: leads.id,
            email: leads.email,
            businessName: leads.businessName,
            contactName: leads.contactName,
            phone: leads.phone,
            website: leads.website,
            country: leads.country,
            language: leads.language,
            status: leads.status,
            source: leads.source,
            notes: leads.notes,
            convertedUserId: leads.convertedUserId,
            convertedAt: leads.convertedAt,
            signedUpAt: leads.signedUpAt,
            subscriptionConfirmedAt: leads.subscriptionConfirmedAt,
            currentCampaignStage: leads.currentCampaignStage,
            emailsSent: leads.emailsSent,
            lastEmailSentAt: leads.lastEmailSentAt,
            unsubscribedAt: leads.unsubscribedAt,
            emailsOpened: leads.emailsOpened,
            emailsClicked: leads.emailsClicked,
            lastEngagementAt: leads.lastEngagementAt,
            metadata: leads.metadata,
            createdAt: leads.createdAt,
            updatedAt: leads.updatedAt,
            referralCode: leads.referralCode,
            isBot: leads.isBot,
            linkedLeadsCount: sql<number>`(
              SELECT COUNT(*)::int FROM lead_lead_links lll
              JOIN leads other_l
                ON other_l.id = CASE
                  WHEN lll.lead_id_1 = ${leads.id} THEN lll.lead_id_2
                  ELSE lll.lead_id_1
                END
              WHERE (lll.lead_id_1 = ${leads.id} OR lll.lead_id_2 = ${leads.id})
                AND other_l.is_bot = false
            )`,
            hasLinkedUser: sql<boolean>`EXISTS (
              SELECT 1 FROM user_lead_links WHERE lead_id = ${leads.id}
            )`,
          })
          .from(leads)
          .where(where)
          .orderBy(orderBy(data.sortingOptions), desc(leads.id))
          .limit(limit)
          .offset((page - 1) * limit),
      ]);

      const ids = rows.map((row) => row.id);
      const drillSummary = drill ? await summarize(where) : undefined;
      const [triage, acquisition] = await Promise.all([
        triageFor(ids),
        AcquisitionRepository.leadDetails(
          ids,
          data.acquisitionCurrency ?? "EUR",
        ),
      ]);
      const byStatus = new Map(
        statusCounts.map(({ status, value }) => [status, value]),
      );

      return success({
        response: {
          leads: rows.map((row) => ({
            ...row,
            metadata: row.metadata ?? {},
            referralCode: row.referralCode ?? null,
            acquisition: acquisition.get(row.id),
            triage: triage.get(row.id),
          })),
        },
        paginationInfo: {
          totalCount: total,
          pageCount: Math.ceil(total / limit),
        },
        drillSummary,
        countsByStatus: {
          new: byStatus.get(LeadStatus.NEW) ?? 0,
          pending: byStatus.get(LeadStatus.PENDING) ?? 0,
          campaignRunning: byStatus.get(LeadStatus.CAMPAIGN_RUNNING) ?? 0,
          websiteUser: byStatus.get(LeadStatus.WEBSITE_USER) ?? 0,
          newsletterSubscriber:
            byStatus.get(LeadStatus.NEWSLETTER_SUBSCRIBER) ?? 0,
          inContact: byStatus.get(LeadStatus.IN_CONTACT) ?? 0,
          signedUp: byStatus.get(LeadStatus.SIGNED_UP) ?? 0,
          subscriptionConfirmed:
            byStatus.get(LeadStatus.SUBSCRIPTION_CONFIRMED) ?? 0,
          unsubscribed: byStatus.get(LeadStatus.UNSUBSCRIBED) ?? 0,
          bounced: byStatus.get(LeadStatus.BOUNCED) ?? 0,
          invalid: byStatus.get(LeadStatus.INVALID) ?? 0,
        },
      });
    } catch (error) {
      logger.error("Failed to list leads", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
